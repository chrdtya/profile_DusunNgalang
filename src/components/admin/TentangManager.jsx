import { useState, useEffect } from 'react'
import NotificationModal from '../NotificationModal'
import { getTentangDusun, createDocument, updateDocument, deleteDocument, urlFor } from '../../lib/sanityClient'
import SanityImageUpload from '../SanityImageUpload'
import { tentangDusun } from '../../data/siteData'

export default function TentangManager({ searchQuery = '' }) {
  const [tentangList, setTentangList] = useState(tentangDusun)
  const [loading, setLoading] = useState(false)
  const [editing, setEditing] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [notification, setNotification] = useState({
    open: false,
    type: 'success',
    title: '',
    message: '',
    confirmLabel: 'OK',
    cancelLabel: 'Batal',
    onConfirm: null,
  })
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: null,
  })

  useEffect(() => {
    fetchTentang()
  }, [])

  async function fetchTentang() {
    setLoading(true)
    try {
      const data = await getTentangDusun()
      setTentangList(data || tentangDusun)
    } catch (error) {
      console.error('Error fetching tentang:', error)
      setTentangList(tentangDusun)
    }
    setLoading(false)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const showNotification = (type, title, message) => {
    setNotification({ open: true, type, title, message, confirmLabel: 'OK', cancelLabel: 'Batal', onConfirm: null })
  }

  const showConfirm = (type, title, message, onConfirm, confirmLabel = 'Hapus') => {
    setNotification({
      open: true,
      type,
      title,
      message,
      confirmLabel,
      cancelLabel: 'Batal',
      onConfirm,
    })
  }

  const closeNotification = () => {
    setNotification((prev) => ({ ...prev, open: false }))
  }

  const handleImageSelect = (imageAsset) => {
    setFormData((prev) => ({
      ...prev,
      image: imageAsset,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.title || !formData.description) {
      showNotification('warning', 'Perhatian', 'Harap isi semua field!')
      return
    }

    setLoading(true)
    try {
      const dataToSave = {
        title: formData.title,
        description: formData.description,
        ...(formData.image && { image: { _type: 'image', asset: formData.image } }),
      }

      if (editing) {
        await updateDocument(editing._id, dataToSave)
        showNotification('success', 'Tentang berhasil diperbarui', 'Perubahan data tentang telah tersimpan.')
      } else {
        await createDocument('tentangDusun', dataToSave)
        showNotification('success', 'Tentang berhasil ditambahkan', 'Data tentang dusun baru berhasil disimpan.')
      }

      setFormData({
        title: '',
        description: '',
        image: null,
      })
      setEditing(null)
      setShowForm(false)
      await fetchTentang()
    } catch (error) {
      console.error('Error saving tentang:', error)
      showNotification('error', 'Gagal menyimpan tentang', 'Terjadi masalah saat menyimpan data tentang. Silakan coba lagi.')
    }
    setLoading(false)
  }

  const handleEdit = (item) => {
    setFormData({
      title: item.title,
      description: item.description,
      image: item.image || null,
    })
    setEditing(item)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    showConfirm('warning', 'Hapus item?', 'Yakin ingin menghapus item ini?', async () => {
      setLoading(true)
      try {
        await deleteDocument(id)
        showNotification('success', 'Item berhasil dihapus', 'Item telah dihapus.')
        await fetchTentang()
      } catch (error) {
        console.error('Error deleting tentang:', error)
        showNotification('error', 'Gagal menghapus item', 'Terjadi masalah saat menghapus item. Silakan coba lagi.')
      }
      setLoading(false)
    }, 'Hapus')
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditing(null)
    setFormData({
      title: '',
      description: '',
      image: null,
    })
  }

  const filteredTentangList = tentangList.filter((item) => {
    const q = searchQuery.trim().toLowerCase()
    if (!q) return true
    return item.title?.toLowerCase().includes(q)
  })

  return (
    <div className="manager-container">
      <div className="manager-header">
        <h2>Kelola Tentang Dusun</h2>
        <button
          className="btn-primary"
          onClick={() => setShowForm(!showForm)}
          disabled={loading}
        >
          {showForm ? '✕ Batal' : '+ Tambah Item'}
        </button>
      </div>

      {showForm && (
        <form className="form-container" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Judul *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Masukkan judul"
              required
            />
          </div>

          <div className="form-group">
            <label>Deskripsi *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Masukkan deskripsi"
              rows="4"
              required
            ></textarea>
          </div>

          <div className="form-group">
            <label>Gambar</label>
            <SanityImageUpload onImageSelect={handleImageSelect} />
            {formData.image && (
              <img src={urlFor(formData.image)} alt="Preview" className="image-preview" />
            )}
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-primary" disabled={loading}>
              {editing ? 'Update' : 'Simpan'}
            </button>
            <button type="button" className="btn-secondary" onClick={handleCancel}>
              Batal
            </button>
          </div>
        </form>
      )}

      <NotificationModal
        open={notification.open}
        type={notification.type}
        title={notification.title}
        message={notification.message}
        confirmLabel={notification.confirmLabel}
        cancelLabel={notification.cancelLabel}
        onClose={closeNotification}
        onConfirm={notification.onConfirm}
      />

      {loading ? (
        <p className="loading">Memuat data...</p>
      ) : filteredTentangList.length === 0 ? (
        <p className="empty-state">
          {searchQuery ? 'Tidak ada item yang cocok dengan pencarian.' : 'Belum ada item. Tambahkan yang pertama!'}
        </p>
      ) : (
        <div className="items-list">
          {filteredTentangList.map((item) => (
            <div key={item._id} className="item-card-list">
              {item.image && (
                <img src={urlFor(item.image)} alt={item.title} className="thumbnail" />
              )}
              <div className="item-content">
                <h3>{item.title}</h3>
                <p className="description">{item.description}</p>
              </div>
              <div className="item-actions">
                <button
                  className="btn-edit"
                  onClick={() => handleEdit(item)}
                  disabled={loading}
                >
                  Edit
                </button>
                <button
                  className="btn-delete"
                  onClick={() => handleDelete(item._id)}
                  disabled={loading}
                >
                  Hapus
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
