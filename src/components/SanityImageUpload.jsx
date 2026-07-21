import { useState } from 'react'
export default function SanityImageUpload({ onImageSelect }) {
  const [uploading, setUploading] = useState(false)
  const [imageUrl, setImageUrl] = useState('')

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validasi ukuran file (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Ukuran file terlalu besar (max 5MB)')
      return
    }

    setUploading(true)
    try {
      const response = await fetch('/api/sanity-upload', {
        method: 'POST',
        headers: {
          'Content-Type': file.type || 'application/octet-stream',
          'X-Filename': encodeURIComponent(file.name),
        },
        body: file,
      })
      if (!response.ok) throw new Error(`Upload gagal: ${response.status}`)

      const imageAsset = await response.json()

      setImageUrl(imageAsset.url)
      onImageSelect({ _type: 'reference', _ref: imageAsset._id })
    } catch (error) {
      console.error('Error uploading image:', error)
      alert('Gagal mengunggah gambar')
    }
    setUploading(false)
  }

  return (
    <div className="image-upload">
      <label htmlFor="image-input" className="upload-label">
        {uploading ? 'Mengunggah...' : '📤 Pilih Gambar'}
      </label>
      <input
        id="image-input"
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        disabled={uploading}
        className="file-input"
      />
      {imageUrl && <p className="success">✅ Gambar berhasil diunggah</p>}
    </div>
  )
}
