import dotenv from 'dotenv'
import { createClient } from '@sanity/client'
import { daftarAcara, daftarBerita, daftarGaleri, daftarUmkm, tentangDusun } from '../src/data/siteData.js'

dotenv.config({ path: '.env.local' })

const client = createClient({
  projectId: process.env.VITE_SANITY_PROJECT_ID,
  dataset: process.env.VITE_SANITY_DATASET || 'production',
  apiVersion: process.env.VITE_SANITY_API_VERSION || '2024-01-15',
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false,
})

if (!process.env.SANITY_WRITE_TOKEN) {
  throw new Error('SANITY_WRITE_TOKEN belum diatur di .env.local')
}

const acaraDates = ['2026-06-15T00:00:00.000Z', '2026-06-29T00:00:00.000Z', '2026-08-17T00:00:00.000Z']
const beritaDates = ['2026-06-05T00:00:00.000Z', '2026-05-29T00:00:00.000Z', '2026-05-18T00:00:00.000Z']

async function uploadImage(url, filename) {
  try {
    const response = await fetch(url)
    if (!response.ok) {
      console.warn(`Gambar ${filename} tidak dapat diunggah (${response.status}); URL asal disimpan sebagai fallback.`)
      return null
    }

    const buffer = Buffer.from(await response.arrayBuffer())
    const asset = await client.assets.upload('image', buffer, {
      filename,
      contentType: response.headers.get('content-type') || 'image/jpeg',
    })

    return { _type: 'reference', _ref: asset._id }
  } catch {
    console.warn(`Gambar ${filename} tidak dapat diunggah; URL asal disimpan sebagai fallback.`)
    return null
  }
}

async function createIfMissing(id, document) {
  const existing = await client.getDocument(id)
  if (existing) return false
  await client.create({ _id: id, ...document })
  return true
}

let created = 0

for (const [index, item] of tentangDusun.entries()) {
  if (await createIfMissing(`seed-tentang-${index + 1}`, { _type: 'tentangDusun', ...item })) created += 1
}

for (const [index, item] of daftarUmkm.entries()) {
  const id = `seed-umkm-${index + 1}`
  if (await client.getDocument(id)) continue
  const { image: sourceImage, ...umkm } = item
  const image = await uploadImage(sourceImage, `umkm-${index + 1}.jpg`)
  await client.create({
    _id: id,
    _type: 'umkm',
    ...umkm,
    imageUrl: sourceImage,
    ...(image && { image: { _type: 'image', asset: image } }),
  })
  created += 1
}

for (const [index, item] of daftarAcara.entries()) {
  if (await createIfMissing(`seed-acara-${index + 1}`, {
    _type: 'acara',
    ...item,
    tanggal: acaraDates[index],
  })) created += 1
}

for (const [index, item] of daftarBerita.entries()) {
  if (await createIfMissing(`seed-berita-${index + 1}`, {
    _type: 'berita',
    judul: item.title,
    konten: item.excerpt,
    tanggalPublikasi: beritaDates[index],
  })) created += 1
}

for (const [index, item] of daftarGaleri.entries()) {
  const id = `seed-galeri-${index + 1}`
  if (await client.getDocument(id)) continue
  const { image: sourceImage } = item
  const image = await uploadImage(sourceImage, `galeri-${index + 1}.jpg`)
  await client.create({
    _id: id,
    _type: 'galeri',
    title: item.caption,
    imageUrl: sourceImage,
    ...(image && { image: { _type: 'image', asset: image } }),
  })
  created += 1
}

console.log(`Migrasi selesai. ${created} dokumen baru dibuat.`)
