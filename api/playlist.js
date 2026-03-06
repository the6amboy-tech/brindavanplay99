import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  const { user, name, songs } = req.method === 'POST' ? req.body : req.query;
  const key = `pub:${user || 'global'}:${name}`.toLowerCase();

  if (req.method === 'POST') {
    await kv.set(key, songs);
    return res.status(200).json({ success: true });
  } 

  const data = await kv.get(key);
  return data ? res.status(200).json(data) : res.status(404).json({ error: 'Empty' });
}
