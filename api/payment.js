const PAID_DAYS = 90;

async function kv(url, token, cmd) {
  const parts = cmd.map(x => encodeURIComponent(String(x)));
  const r = await fetch(url + "/" + parts.join("/"), {
    headers: { Authorization: "Bearer " + token }
  });
  return r.json();
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, X-Api-Key");
  if (req.method === "OPTIONS") return res.status(200).end();

  const kvUrl   = process.env.KV_REST_API_URL;
  const kvToken = process.env.KV_REST_API_TOKEN;

  // СОЗДАТЬ INVOICE (GET)
  if (req.method === "GET") {
    try {
      const lavaApiKey = process.env.LAVA_API_KEY;
      const offerId    = process.env.LAVA_PRODUCT_ID;

      console.log("LAVA_API_KEY present:", !!lavaApiKey);
      console.log("LAVA_PRODUCT_ID:", offerId);

      if (!lavaApiKey || !offerId) {
        return res.status(500).json({ error: "Lava config missing", hasKey: !!lavaApiKey, hasId: !!offerId });
      }

      const email = req.query.email || "";

      const body = {
        email,
        offerId,
        successUrl: "https://ai-pulse-pro.vercel.app?paid=1",
        failUrl: "https://ai-pulse-pro.vercel.app?paid=0",
      };

      console.log("Sending to Lava:", JSON.stringify(body));

      const response = await fetch("https://developers.lava.top/api/v2/invoice", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Api-Key": lavaApiKey,
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();
      console.log("Lava response status:", response.status);
      console.log("Lava response body:", JSON.stringify(data));

      if (data.paymentUrl) {
        return res.status(200).json({ url: data.paymentUrl });
      } else {
        return res.status(500).json({ error: "No payment URL", details: data });
      }
    } catch (e) {
      console.log("Error:", e.message);
      return res.status(500).json({ error: e.message });
    }
  }

  // ПРИНЯТЬ WEBHOOK (POST)
  if (req.method === "POST") {
    const webhookKey = req.headers["x-api-key"];
    if (webhookKey !== process.env.LAVA_WEBHOOK_KEY) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    if (!kvUrl || !kvToken) return res.status(500).json({ error: "KV not configured" });
    try {
      const body = req.body || {};
      if (body.status !== "success") {
        return res.status(200).json({ ok: true, skipped: true });
      }
      const email = (body.buyer?.email || body.email || "").toLowerCase().trim();
      if (!email) return res.status(200).json({ ok: true, skipped: "no email" });
      const emailKey = "email:" + email;
      const uidRes = await kv(kvUrl, kvToken, ["get", emailKey]);
      const uid = uidRes.result;
      if (!uid) {
        await kv(kvUrl, kvToken, ["set", "pending_paid:" + email, JSON.stringify({
          email, date: new Date().toISOString()
        })]);
        return res.status(200).json({ ok: true, skipped: "saved as pending" });
      }
      const userRes = await kv(kvUrl, kvToken, ["get", "user:" + uid]);
      if (!userRes.result) return res.status(200).json({ ok: true, skipped: "user not found" });
      const user = JSON.parse(userRes.result);
      user.type = "paid";
      user.paidAt = Date.now();
      user.paidCode = "LAVA_AUTO";
      await kv(kvUrl, kvToken, ["set", "user:" + uid, JSON.stringify(user)]);
      return res.status(200).json({ ok: true, activated: true, email });
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
