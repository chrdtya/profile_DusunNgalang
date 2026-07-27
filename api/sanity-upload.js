import { createClient } from '@sanity/client'

// Vercel Serverless Function — production counterpart of server/index.js's
// /api/sanity-upload route. See sanity-write.js for why this exists.
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

// Whether Vercel's Node runtime has already parsed the body into a Buffer
// (behavior differs by content-type/runtime version) isn't guaranteed, so
// handle both: use req.body if it's already a Buffer/string, otherwise read
// the raw request stream ourselves.
async function readRawBody(req) {
  if (Buffer.isBuffer(req.body)) return req.body
  if (typeof req.body === 'string' && req.body.length) return Buffer.from(req.body)

  const chunks = []
  for await (const chunk of req) chunks.push(chunk)
  return Buffer.concat(chunks)
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    if (!token) return res.status(500).json({ error: 'SANITY_WRITE_TOKEN belum dikonfigurasi' })

    const buffer = await readRawBody(req)
    if (!buffer.length) return res.status(400).json({ error: 'File gambar tidak ditemukan' })

    const encodedFilename = req.headers['x-filename'] || 'image'
    const filename = decodeURIComponent(Array.isArray(encodedFilename) ? encodedFilename[0] : encodedFilename)
    const asset = await client.assets.upload('image', buffer, { filename })
    return res.status(200).json(asset)
  } catch (err) {
    console.error('Sanity image upload error', err)
    const status = err.statusCode || 500
    return res.status(status).json({ error: err.message || String(err) })
  }
}
