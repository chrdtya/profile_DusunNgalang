import { createClient } from '@sanity/client'
import { createImageUrlBuilder } from '@sanity/image-url'

const projectId = import.meta.env.VITE_SANITY_PROJECT_ID || 'your_project_id'
const dataset = import.meta.env.VITE_SANITY_DATASET || 'production'
const apiVersion = import.meta.env.VITE_SANITY_API_VERSION || '2024-01-15'

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  // Note: do NOT expose server write tokens in the browser bundle.
  // Writes are proxied through a server endpoint (`/api/sanity-write`).
})

const builder = createImageUrlBuilder(client)

export const urlFor = (source) => {
  if (!source) return ''
  if (typeof source === 'string') return source.startsWith('http') ? source : ''
  try {
    return builder.image(source).auto('format').fit('max').url()
  } catch {
    return ''
  }
}

// Query functions
export const getTentangDusun = async () => {
  const query = `*[_type == "tentangDusun"]`
  return fetchDocuments(query)
}

export const getDaftarUmkm = async () => {
  const query = `*[_type == "umkm"] | order(_createdAt desc)`
  return fetchDocuments(query)
}

export const getDaftarAcara = async () => {
  const query = `*[_type == "acara"] | order(tanggal desc)`
  return fetchDocuments(query)
}

export const getDaftarBerita = async () => {
  const query = `*[_type == "berita"] | order(tanggalPublikasi desc)`
  return fetchDocuments(query)
}

export const getGaleri = async () => {
  const query = `*[_type == "galeri"] | order(_createdAt desc)`
  return fetchDocuments(query)
}

export const getLokasi = async () => {
  const query = `*[_type == "lokasi"] | order(_createdAt desc)[0]`
  return fetchDocuments(query)
}

async function fetchDocuments(query) {
  if (!import.meta.env.DEV) return client.fetch(query)

  const params = new URLSearchParams({ query, returnQuery: 'false' })
  const response = await fetch(`/sanity/v${apiVersion}/data/query/${dataset}?${params}`)
  if (!response.ok) throw new Error(`Sanity request failed: ${response.status}`)

  const body = await response.json()
  return body.result
}

// Create/Update/Delete functions
export const createDocument = async (type, data) => {
  return writeThroughProxy({ op: 'create', type, data })
}

export const updateDocument = async (id, data) => {
  return writeThroughProxy({ op: 'update', id, data })
}

export const deleteDocument = async (id) => {
  return writeThroughProxy({ op: 'delete', id })
}

async function writeThroughProxy(payload) {
  const res = await fetch('/api/sanity-write', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error(`Proxy error: ${res.status}`)
  return res.json()
}
