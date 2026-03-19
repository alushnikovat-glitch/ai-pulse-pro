Вот полный `api/history.js`:

```js
const PAID_DAYS = 90;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "pulse_admin_2026";
const TWO_DAYS_MS = 2 * 24 * 60 * 60 * 1000;

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

  const { action, userId, code, entry, name, email, telegram, password, targetUserId } = req.body || {};

  // РЕГИСТРАЦИЯ
  if (action === "register") {
    if (!name || !email) return res.status(400).json({ error: "missing fields" });
    const emailKey = "email:" + email.toLowerCase().trim();
    let existingId = null;
    try {
      const r = await kv(url, token, ["get", emailKey]);
      if (r.result) existingId = r.result;
    } catch (e) {}
    if (existingId) {
      try {
        const r = await kv(url, token, ["get", "user:" + existingId]);
        if (r.result) {
          const user = JSON.parse(r.result);
          return res.status(200).json({ ok: true, userId: existingId, usageCount: user.usageCount || 0, existing: true });
        }
      } catch (e) {}
    }
    const newId = genUserId();
    const now = Date.now();
    const user = {
      id: newId,
      name: name.trim(),
      email: email.toLowerCase().trim(),
      telegram: (telegram || "").trim(),
      registeredAt: now,
      registeredAtFormatted: new Date(now).toLocaleString("ru-RU", { day:"2-digit", month:"2-digit", year:"numeric", hour:"2-digit", minute:"2-digit" }),
      usageCount: 1,
      type: "trial"
    };
    await kv(url, token, ["set", "user:" + newId, JSON.stringify(user)]);
    await kv(url, token, ["set", emailKey, newId]);
    await kv(url, token, ["lpush", "all_users", newId]);
    return res.status(200).json({ ok: true, userId: newId, usageCount: 1 });
  }

  // ИНКРЕМЕНТ
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

  // СОХРАНИТЬ ИСТОРИЮ ПОЛЬЗОВАТЕЛЯ
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

  // СОХРАНИТЬ ДЛЯ АДМИНКИ
  if (action === "adminSave") {
    if (!entry) return res.status(400).json({ error: "missing entry" });
    try {
      const record = { ...entry, savedAt: Date.now() };
      await kv(url, token, ["lpush", "admin_texts", JSON.stringify(record)]);
      await kv(url, token, ["ltrim", "admin_texts", "0", "199"]);
      return res.status(200).json({ ok: true });
    } catch (e) {
      return res.status(500).json({ error: "adminSave failed" });
    }
  }

  // ЗАГРУЗИТЬ ИСТОРИЮ ПОЛЬЗОВАТЕЛЯ
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

  // ВХОД ПО EMAIL
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
    if (user.type === "trial") {
      if (user.usageCount >= 5) {
        return res.status(200).json({ ok: false, reason: "trial_limit" });
      }
      return res.status(200).json({ ok: true, userId: uid, type: "trial", name: user.name || "", usageCount: user.usageCount || 0 });
    }
    return res.status(200).json({ ok: true, userId: uid, type: "trial", name: user.name || "", usageCount: user.usageCount || 0 });
  }

  // АКТИВАЦИЯ КОДА
  if (action === "activate") {
    const PAID_CODES = ["PRO2026", "PRO2027", "КУПИТЬ007"];
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
    if (daysUsed > PAID_DAYS) return res.status(200).json({ valid: false, reason: "expired", daysUsed: Math.floor(daysUsed) });
    const daysLeft = Math.max(0, PAID_DAYS - Math.floor(daysUsed));
    if (userId) {
      try {
        const r = await kv(url, token, ["get", "user:" + userId]);
        if (r.result) {
          const user = JSON.parse(r.result);
          user.type = "paid"; user.paidAt = now; user.paidCode = c;
          await kv(url, token, ["set", "user:" + userId, JSON.stringify(user)]);
        }
      } catch (e) {}
    }
    return res.status(200).json({ valid: true, type: "paid", daysLeft });
  }

  // АДМИН: СДЕЛАТЬ ПЛАТНЫМ
  if (action === "adminSetPaid") {
    if (password !== ADMIN_PASSWORD) return res.status(403).json({ error: "forbidden" });
    if (!targetUserId) return res.status(400).json({ error: "missing targetUserId" });
    try {
      const r = await kv(url, token, ["get", "user:" + targetUserId]);
      if (!r.result) return res.status(404).json({ error: "user not found" });
      const user = JSON.parse(r.result);
      user.type = "paid";
      user.paidAt = Date.now();
      user.paidCode = "MANUAL";
      await kv(url, token, ["set", "user:" + targetUserId, JSON.stringify(user)]);
      return res.status(200).json({ ok: true });
    } catch (e) {
      return res.status(500).json({ error: "failed" });
    }
  }

  // АДМИН: ОТМЕНИТЬ ПЛАТНЫЙ
  if (action === "adminSetTrial") {
    if (password !== ADMIN_PASSWORD) return res.status(403).json({ error: "forbidden" });
    if (!targetUserId) return res.status(400).json({ error: "missing targetUserId" });
    try {
      const r = await kv(url, token, ["get", "user:" + targetUserId]);
      if (!r.result) return res.status(404).json({ error: "user not found" });
      const user = JSON.parse(r.result);
      user.type = "trial";
      user.paidAt = null;
      user.paidCode = null;
      user.usageCount = 0;
      await kv(url, token, ["set", "user:" + targetUserId, JSON.stringify(user)]);
      return res.status(200).json({ ok: true });
    } catch (e) {
      return res.status(500).json({ error: "failed" });
    }
  }

  // АДМИН: ПРОДЛИТЬ ДОСТУП +90 ДНЕЙ
  if (action === "adminExtend") {
    if (password !== ADMIN_PASSWORD) return res.status(403).json({ error: "forbidden" });
    if (!targetUserId) return res.status(400).json({ error: "missing targetUserId" });
    try {
      const r = await kv(url, token, ["get", "user:" + targetUserId]);
      if (!r.result) return res.status(404).json({ error: "user not found" });
      const user = JSON.parse(r.result);
      const now = Date.now();
      const ADD_90 = 90 * 24 * 60 * 60 * 1000;
      if (user.type === "paid" && user.paidAt) {
        user.paidAt = user.paidAt + ADD_90;
      } else {
        user.type = "paid";
        user.paidAt = now;
      }
      await kv(url, token, ["set", "user:" + targetUserId, JSON.stringify(user)]);
      return res.status(200).json({ ok: true });
    } catch (e) {
      return res.status(500).json({ error: "failed" });
    }
  }

  // АДМИН: СПИСОК ПОЛЬЗОВАТЕЛЕЙ
  if (action === "adminGetUsers") {
    if (password !== ADMIN_PASSWORD) return res.status(403).json({ error: "forbidden" });
    try {
      const r = await kv(url, token, ["lrange", "all_users", "0", "499"]);
      const ids = (r.result || []).filter(Boolean).map(item => {
        try {
          const parsed = JSON.parse(item);
          return parsed.id || parsed;
        } catch {
          return item;
        }
      });
      const users = [];
      for (const id of ids) {
        try {
          const ur = await kv(url, token, ["get", "user:" + id]);
          if (ur.result) {
            const u = JSON.parse(ur.result);
            const now = Date.now();
            let daysLeft = null;
            if (u.type === "paid" && u.paidAt) {
              const daysUsed = (now - u.paidAt) / (1000 * 60 * 60 * 24);
              daysLeft = Math.max(0, Math.round(PAID_DAYS - daysUsed));
            }
            users.push({
              id: u.id, name: u.name, email: u.email,
              telegram: u.telegram || "",
              registeredAt: u.registeredAtFormatted || new Date(u.registeredAt || 0).toLocaleString("ru-RU"),
              usageCount: u.usageCount || 0,
              type: u.type || "trial",
              paidAt: u.paidAt ? new Date(u.paidAt).toLocaleString("ru-RU") : null,
              daysLeft,
            });
          }
        } catch (e) {}
      }
      users.sort((a, b) => (b.id > a.id ? 1 : -1));
      return res.status(200).json({ ok: true, users });
    } catch (e) {
      return res.status(500).json({ error: "failed" });
    }
  }

  // АДМИН: ТЕКСТЫ ЗА 2 ДНЯ
  if (action === "adminGetTexts") {
    if (password !== ADMIN_PASSWORD) return res.status(403).json({ error: "forbidden" });
    try {
      const r = await kv(url, token, ["lrange", "admin_texts", "0", "199"]);
      const now = Date.now();
      const items = (r.result || []).map(i => {
        try { return JSON.parse(i); } catch { return null; }
      }).filter(Boolean).filter(item => item.savedAt && (now - item.savedAt) < TWO_DAYS_MS);
      return res.status(200).json({ ok: true, items });
    } catch (e) {
      return res.status(500).json({ error: "failed" });
    }
  }

  return res.status(400).json({ error: "unknown action" });
}
```
