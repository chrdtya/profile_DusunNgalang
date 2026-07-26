import { useState } from 'react'
import NotificationModal from './NotificationModal'

export default function SanityImageUpload({ onImageSelect }) {
  const [uploading, setUploading] = useState(false)
  const [imageUrl, setImageUrl] = useState('')
  const [notification, setNotification] = useState({
    open: false,
    type: 'error',
    title: '',
    message: '',
  })

  const showNotification = (type, title, message) => {
    setNotification({ open: true, type, title, message })
  }

  const closeNotification = () => {
    setNotification((prev) => ({ ...prev, open: false }))
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validasi ukuran file (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      showNotification('warning', 'Ukuran file terlalu besar', 'Ukuran file terlalu besar (max 5MB)')
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
      if (!response.ok) {
        let errorMessage = `Upload gagal: ${response.status}`
        try {
          const errorBody = await response.json()
          if (errorBody?.error) errorMessage = errorBody.error
        } catch {
          // Keep the default status-based message if the body is not JSON.
        }
        throw new Error(errorMessage)
      }

      const imageAsset = await response.json()

      setImageUrl(imageAsset.url)
      onImageSelect({ _type: 'reference', _ref: imageAsset._id })
    } catch (error) {
      console.error('Error uploading image:', error)
      showNotification(
        'error',
        'Gagal mengunggah gambar',
        error instanceof Error ? error.message : 'Terjadi masalah saat mengunggah gambar. Silakan coba lagi.'
      )
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

      <NotificationModal
        open={notification.open}
        type={notification.type}
        title={notification.title}
        message={notification.message}
        onClose={closeNotification}
      />
    </div>
  )
}
