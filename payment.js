const PAID_DAYS = 90;

async function kvSet(url, token, key, value) {
  const r = await fetch(url + "/set/" + encodeURIComponent(key) + "/" + encodeURIComponent(JSON.stringify(value)), {
    headers: { Authorization: "Bearer " + token }
  });
  return r.json();
}

async function kvGet(url, token, key) {
  const r = await fetch(url + "/get/" + encodeURIComponent(key), {
    headers: { Authorization: "Bearer " + token }
  });
  const data = await r.json();
  if (data.result) return JSON.parse(data.result);
  return null;
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Api-Key");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const url   = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;
  if (!url || !token) return res.status(500).json({ error: "KV not configured" });

  try {
    const body = req.body;
    console.log("Lava.top webhook received:", JSON.stringify(body));

    // Lava.top формат: { buyer: { email: "..." }, status: "completed", eventType: "payment.success" }
    const eventType = body?.eventType;
    const status    = body?.status;
    const email     = body?.buyer?.email;

    // Принимаем только успешные платежи
    const isSuccess = status === "completed" || eventType === "payment.success";
    if (!isSuccess) {
      console.log("Not a success event, skipping. status:", status, "eventType:", eventType);
      return res.status(200).json({ ok: true, message: "not a success event" });
    }

    if (!email) {
      console.log("No email found in webhook body:", JSON.stringify(body));
      return res.status(200).json({ ok: true, message: "no email found" });
    }

    console.log("Activating paid access for:", email);

    const emailKey = "email:" + email.toLowerCase().trim();
    const now = Date.now();

    // Ищем пользователя по email
    let userId = null;
    try {
      const r = await fetch(url + "/get/" + encodeURIComponent(emailKey), {
        headers: { Authorization: "Bearer " + token }
      });
      const data = await r.json();
      if (data.result) userId = data.result;
    } catch (e) {}

    if (userId) {
      // Пользователь уже зарегистрирован — обновляем статус
      const user = await kvGet(url, token, "user:" + userId);
      if (user) {
        user.type = "paid";
        user.paidAt = now;
        user.paidDays = PAID_DAYS;
        await kvSet(url, token, "user:" + userId, user);
        console.log("Existing user upgraded to paid:", email, userId);
      }
    } else {
      // Новый пользователь — создаём сразу с paid статусом
      const newId = "u_" + Math.random().toString(36).slice(2, 10) + now.toString(36);
      const newUser = {
        id: newId,
        email: email.toLowerCase().trim(),
        type: "paid",
        registeredAt: now,
        paidAt: now,
        paidDays: PAID_DAYS,
        usageCount: 0,
      };
      await kvSet(url, token, "user:" + newId, newUser);
      await fetch(url + "/set/" + encodeURIComponent(emailKey) + "/" + encodeURIComponent(newId), {
        headers: { Authorization: "Bearer " + token }
      });
      console.log("New paid user created:", email, newId);
    }

    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error("Payment webhook error:", e);
    return res.status(500).json({ error: e.message });
  }
}
