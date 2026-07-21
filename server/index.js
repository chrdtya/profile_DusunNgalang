import express from 'express'
import dotenv from 'dotenv'
import bodyParser from 'body-parser'
import { createClient } from '@sanity/client'

dotenv.config({ path: '.env.local' })

const app = express()
const port = process.env.PORT || 5175

app.use(bodyParser.json())

const projectId = process.env.VITE_SANITY_PROJECT_ID
const dataset = process.env.VITE_SANITY_DATASET || 'production'
const apiVersion = process.env.VITE_SANITY_API_VERSION || '2024-01-15'
const token = process.env.SANITY_WRITE_TOKEN || process.env.VITE_SANITY_TOKEN

if (!token) {
  console.warn('Warning: SANITY write token not set. Writes will fail.')
}

const serverClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token,
})

app.post('/api/sanity-write', async (req, res) => {
  try {
    const { op, type, data, id } = req.body
    if (!op) return res.status(400).json({ error: 'op required' })

    let result
    if (op === 'create') {
      result = await serverClient.create({ _type: type, ...data })
    } else if (op === 'update') {
      if (!id) return res.status(400).json({ error: 'id required for update' })
      result = await serverClient.patch(id).set(data).commit()
    } else if (op === 'delete') {
      if (!id) return res.status(400).json({ error: 'id required for delete' })
      result = await serverClient.delete(id)
    } else {
      return res.status(400).json({ error: 'unknown op' })
    }

    return res.json(result)
  } catch (err) {
    console.error('Sanity proxy error', err)
    const status = err.statusCode || 500
    return res.status(status).json({ error: err.message || String(err) })
  }
})

app.post(
  '/api/sanity-upload',
  express.raw({ type: 'image/*', limit: '5mb' }),
  async (req, res) => {
    try {
      if (!token) return res.status(500).json({ error: 'SANITY_WRITE_TOKEN belum dikonfigurasi' })
      if (!req.body?.length) return res.status(400).json({ error: 'File gambar tidak ditemukan' })

      const encodedFilename = req.get('X-Filename') || 'image'
      const filename = decodeURIComponent(encodedFilename)
      const asset = await serverClient.assets.upload('image', req.body, { filename })
      return res.json(asset)
    } catch (err) {
      console.error('Sanity image upload error', err)
      const status = err.statusCode || 500
      return res.status(status).json({ error: err.message || String(err) })
    }
  },
)

app.listen(port, () => {
  console.log(`Sanity write proxy running on http://localhost:${port}`)
})
