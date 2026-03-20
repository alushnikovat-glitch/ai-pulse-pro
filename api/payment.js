export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, X-Api-Key");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  // Проверяем ключ от Lava Top
  const webhookKey = req.headers["x-api-key"];
  if (webhookKey !== process.env.LAVA_WEBHOOK_KEY) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const PAID_DAYS = 90;
  const url   = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;
  if (!url || !token) return res.status(500).json({ error: "KV not configured" });

  async function kv(cmd) {
    const parts = cmd.map(x => encodeURIComponent(String(x)));
    const r = await fetch(url + "/" + parts.join("/"), {
      headers: { Authorization: "Bearer " + token }
    });
    return r.json();
  }

  try {
    const body = req.body || {};

    // Принимаем только успешные платежи
    if (body.status !== "success") {
      return res.status(200).json({ ok: true, skipped: true });
    }

    // Получаем email покупателя
    const email = (body.buyer_email || body.email || "").toLowerCase().trim();
    if (!email) return res.status(200).json({ ok: true, skipped: "no email" });

    // Ищем пользователя по email
    const emailKey = "email:" + email;
    const uidRes = await kv(["get", emailKey]);
    const uid = uidRes.result;

    if (!uid) {
      // Пользователь не зарегистрирован — сохраняем email для ручной активации
      await kv(["set", "pending_paid:" + email, JSON.stringify({
        email, date: new Date().toISOString(), amount: body.amount || ""
      })]);
      return res.status(200).json({ ok: true, skipped: "user not found, saved as pending" });
    }

    // Активируем платный доступ
    const userRes = await kv(["get", "user:" + uid]);
    if (!userRes.result) return res.status(200).json({ ok: true, skipped: "user data not found" });

    const user = JSON.parse(userRes.result);
    user.type = "paid";
    user.paidAt = Date.now();
    user.paidCode = "LAVA_AUTO";
    user.paidAmount = body.amount || "";

    await kv(["set", "user:" + uid, JSON.stringify(user)]);

    return res.status(200).json({ ok: true, activated: true, email });

  } catch (e) {
    return res.status(500).json({ error: "Server error", details: e.message });
  }
}
