export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { action, code, entry } = req.body;
  const key = 'history:' + code.trim().toUpperCase();
  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;

  const kv = async (cmd) => {
    const r = await fetch(url + '/' + cmd.join('/'), {
      headers: { Authorization: 'Bearer ' + token }
    });
    return r.json();
  };

  try {
    if (action === 'save') {
      await kv(['lpush', key, JSON.stringify(entry)]);
      await kv(['ltrim', key, '0', '19']);
      return res.status(200).json({ ok: true });
    }
    if (action === 'load') {
      const data = await kv(['lrange', key, '0', '19']);
      const items = (data.result || []).map(i => JSON.parse(i));
      return res.status(200).json({ items });
    }
  } catch (e) {
    return res.status(500).json({ error: 'DB error' });
  }
}
