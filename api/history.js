const PAID_CODES = ["PRO2026", "PRO2027", "КУПИТЬ007"];
const TRIAL_LIMIT = 5;
const PAID_DAYS = 90;

async function kv(url, token, cmd) {
  const parts = cmd.map(x => encodeURIComponent(String(x)));
  const r = await fetch(url + "/" + parts.join("/"), {
    headers: { Authorization: "Bearer " + token }
  });
  return r.json();
}

function genUserId() {
  return "u_" + Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const url   = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;
  if (!url || !token) return res.status(500).json({ error: "KV not configured" });

  const { action, userId, code, entry, name, email, telegram } = req.body || {};

  // ── РЕГИСТРАЦИЯ ──────────────────────────────────────────────────
  if (action === "register") {
    if (!name || !email) return res.status(400).json({ error: "missing fields" });

    // Проверяем не зарегистрирован ли email уже
    const emailKey = "email:" + email.toLowerCase().trim();
    let existingId = null;
    try {
      const r = await kv(url, token, ["get", emailKey]);
      if (r.result) existingId = r.result;
    } catch (e) {}

    if (existingId) {
      // Email уже зарегистрирован — возвращаем существующего пользователя
      try {
        const r = await kv(url, token, ["get", "user:" + existingId]);
        if (r.result) {
          const user = JSON.parse(r.result);
          return res.status(200).json({ ok: true, userId: existingId, usageCount: user.usageCount || 0, existing: true });
        }
      } catch (e) {}
    }

    // Новый пользователь
    const newId = genUserId();
    const user = {
      id: newId,
      name: name.trim(),
      email: email.toLowerCase().trim(),
      telegram: (telegram || "").trim(),
      registeredAt: Date.now(),
      usageCount: 1, // уже 1 генерация до регистрации
      type: "trial"
    };

    await kv(url, token, ["set", "user:" + newId, JSON.stringify(user)]);
    await kv(url, token, ["set", emailKey, newId]);

    // Сохраняем в список всех пользователей (для тебя)
    await kv(url, token, ["lpush", "all_users", JSON.stringify({ id: newId, name: user.name, email: user.email, telegram: user.telegram, date: new Date().toLocaleDateString("ru-RU") })]);

    return res.status(200).json({ ok: true, userId: newId, usageCount: 1 });
  }

  // ── АКТИВАЦИЯ ПЛАТНОГО КОДА ──────────────────────────────────────
  if (action === "activate") {
    const c = (code || "").trim().toUpperCase();
    const isPaid = PAID_CODES.map(x => x.toUpperCase()).includes(c);
    if (!isPaid) return res.status(200).json({ valid: false, reason: "invalid" });

    const codeKey = "code:" + c;
    let codeMeta = null;
    try {
      const r = await kv(url, token, ["get", codeKey]);
      if (r.result) codeMeta = JSON.parse(r.result);
    } catch (e) {}

    const now = Date.now();

    if (!codeMeta) {
      codeMeta = { activatedAt: now, activatedBy: userId || null };
      await kv(url, token, ["set", codeKey, JSON.stringify(codeMeta)]);
    }

    const daysUsed = (now - codeMeta.activatedAt) / (1000 * 60 * 60 * 24);
    if (daysUsed > PAID_DAYS) {
      return res.status(200).json({ valid: false, reason: "expired", daysUsed: Math.floor(daysUsed) });
    }

    const daysLeft = Math.max(0, PAID_DAYS - Math.floor(daysUsed));

    // Обновляем пользователя если есть
    if (userId) {
      try {
        const r = await kv(url, token, ["get", "user:" + userId]);
        if (r.result) {
          const user = JSON.parse(r.result);
          user.type = "paid";
          user.paidAt = now;
          user.paidCode = c;
          await kv(url, token, ["set", "user:" + userId, JSON.stringify(user)]);
        }
      } catch (e) {}
    }

    return res.status(200).json({ valid: true, type: "paid", daysLeft });
  }

  // ── ИНКРЕМЕНТ ────────────────────────────────────────────────────
  if (action === "increment") {
    if (!userId) return res.status(200).json({ ok: false });
    try {
      const r = await kv(url, token, ["get", "user:" + userId]);
      if (r.result) {
        const user = JSON.parse(r.result);
        user.usageCount = (user.usageCount || 0) + 1;
        await kv(url, token, ["set", "user:" + userId, JSON.stringify(user)]);
        return res.status(200).json({ ok: true, usageCount: user.usageCount });
      }
    } catch (e) {}
    return res.status(200).json({ ok: false });
  }

  // ── СОХРАНИТЬ ИСТОРИЮ ────────────────────────────────────────────
  if (action === "save") {
    if (!userId || !entry) return res.status(400).json({ error: "missing params" });
    try {
      await kv(url, token, ["lpush", "history:" + userId, JSON.stringify(entry)]);
      await kv(url, token, ["ltrim", "history:" + userId, "0", "19"]);
      return res.status(200).json({ ok: true });
    } catch (e) {
      return res.status(500).json({ error: "save failed" });
    }
  }

  // ── ЗАГРУЗИТЬ ИСТОРИЮ ────────────────────────────────────────────
  if (action === "load") {
    if (!userId) return res.status(400).json({ error: "missing userId" });
    try {
      const r = await kv(url, token, ["lrange", "history:" + userId, "0", "19"]);
      const items = (r.result || []).map(i => {
        try { return JSON.parse(i); } catch { return null; }
      }).filter(Boolean);
      return res.status(200).json({ items });
    } catch (e) {
      return res.status(200).json({ items: [] });
    }
  }

  // ── ВХОД ПО EMAIL ────────────────────────────────────────────────
  if (action === "loginByEmail") {
    if (!email) return res.status(400).json({ error: "missing email" });
    const emailKey = "email:" + email.toLowerCase().trim();
    let uid = null;
    try {
      const r = await kv(url, token, ["get", emailKey]);
      if (r.result) uid = r.result;
    } catch (e) {}

    if (!uid) return res.status(200).json({ ok: false, reason: "not_found" });

    const user = await (async () => {
      try {
        const r = await kv(url, token, ["get", "user:" + uid]);
        if (r.result) return JSON.parse(r.result);
      } catch (e) {}
      return null;
    })();

    if (!user) return res.status(200).json({ ok: false, reason: "not_found" });

    const now = Date.now();
    if (user.type === "paid") {
      const daysUsed = (now - user.paidAt) / (1000 * 60 * 60 * 24);
      if (daysUsed > PAID_DAYS) return res.status(200).json({ ok: false, reason: "expired" });
      const daysLeft = Math.max(0, PAID_DAYS - Math.floor(daysUsed));
      return res.status(200).json({ ok: true, userId: uid, type: "paid", name: user.name || "", usageCount: user.usageCount || 0, daysLeft });
    }

    return res.status(200).json({ ok: true, userId: uid, type: "trial", name: user.name || "", usageCount: user.usageCount || 0 });
  }

  return res.status(400).json({ error: "unknown action" });
}
