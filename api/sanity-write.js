import { createClient } from '@sanity/client'

// Vercel Serverless Function — production counterpart of server/index.js's
// /api/sanity-write route (that Express server only runs locally via `npm run
// dev:api`; Vercel doesn't execute it, so writes 404'd in production until this
// file existed). Files under /api are auto-deployed as serverless functions.
const projectId = process.env.VITE_SANITY_PROJECT_ID || 'vko2u6kf'
const dataset = process.env.VITE_SANITY_DATASET || 'production'
const apiVersion = process.env.VITE_SANITY_API_VERSION || '2024-01-15'
const token = process.env.SANITY_WRITE_TOKEN || process.env.VITE_SANITY_TOKEN

const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token,
})

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    if (!token) return res.status(500).json({ error: 'SANITY_WRITE_TOKEN belum dikonfigurasi' })

    const { op, type, data, id } = req.body || {}
    if (!op) return res.status(400).json({ error: 'op required' })

    let result
    if (op === 'create') {
      result = await client.create({ _type: type, ...data })
    } else if (op === 'update') {
      if (!id) return res.status(400).json({ error: 'id required for update' })
      result = await client.patch(id).set(data).commit()
    } else if (op === 'delete') {
      if (!id) return res.status(400).json({ error: 'id required for delete' })
      result = await client.delete(id)
    } else {
      return res.status(400).json({ error: 'unknown op' })
    }

    return res.status(200).json(result)
  } catch (err) {
    console.error('Sanity proxy error', err)
    const status = err.statusCode || 500
    return res.status(status).json({ error: err.message || String(err) })
  }
}
