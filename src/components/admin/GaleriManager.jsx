import { useState, useEffect } from 'react'
import { getGaleri, createDocument, deleteDocument, urlFor } from '../../lib/sanityClient'
import SanityImageUpload from '../SanityImageUpload'

export default function GaleriManager({ searchQuery = '' }) {
  const [galeriList, setGaleriList] = useState([])
  const [loading, setLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    image: null,
  })

  useEffect(() => {
    fetchGaleri()
  }, [])

  async function fetchGaleri() {
    setLoading(true)
    try {
      const data = await getGaleri()
      setGaleriList(data || [])
    } catch (error) {
      console.error('Error fetching galeri:', error)
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

  const handleImageSelect = (imageAsset) => {
    setFormData((prev) => ({
      ...prev,
      image: imageAsset,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.title || !formData.image) {
      alert('Harap isi title dan upload gambar!')
      return
    }

    setLoading(true)
    try {
      const dataToSave = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        image: { _type: 'image', asset: formData.image },
      }

      await createDocument('galeri', dataToSave)
      alert('Galeri berhasil ditambahkan!')

      setFormData({
        title: '',
        description: '',
        category: '',
        image: null,
      })
      setShowForm(false)
      await fetchGaleri()
    } catch (error) {
      console.error('Error saving galeri:', error)
      alert('Gagal menyimpan galeri')
    }
    setLoading(false)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Yakin ingin menghapus gambar ini?')) return

    setLoading(true)
    try {
      await deleteDocument(id)
      alert('Galeri berhasil dihapus!')
      await fetchGaleri()
    } catch (error) {
      console.error('Error deleting galeri:', error)
      alert('Gagal menghapus galeri')
    }
    setLoading(false)
  }

  const handleCancel = () => {
    setShowForm(false)
    setFormData({
      title: '',
      description: '',
      category: '',
      image: null,
    })
  }

  const filteredGaleriList = galeriList.filter((item) => {
    const q = searchQuery.trim().toLowerCase()
    if (!q) return true
    return item.title?.toLowerCase().includes(q) || item.category?.toLowerCase().includes(q)
  })

  return (
    <div className="manager-container">
      <div className="manager-header">
        <h2>Kelola Galeri</h2>
        <button
          className="btn-primary"
          onClick={() => setShowForm(!showForm)}
          disabled={loading}
        >
          {showForm ? '✕ Batal' : '+ Tambah Foto'}
        </button>
      </div>

      {showForm && (
        <form className="form-container" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Judul Foto *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Masukkan judul foto"
              required
            />
          </div>

          <div className="form-group">
            <label>Deskripsi</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Masukkan deskripsi foto (opsional)"
              rows="3"
            ></textarea>
          </div>

          <div className="form-group">
            <label>Kategori</label>
            <select name="category" value={formData.category} onChange={handleInputChange}>
              <option value="">Pilih Kategori</option>
              <option value="Alam">🌿 Alam</option>
              <option value="Budaya">🎭 Budaya</option>
              <option value="UMKM">🏪 UMKM</option>
              <option value="Kegiatan">🤝 Kegiatan</option>
            </select>
          </div>

          <div className="form-group">
            <label>Upload Gambar *</label>
            <SanityImageUpload onImageSelect={handleImageSelect} />
            {formData.image && (
              <img src={urlFor(formData.image)} alt="Preview" className="image-preview" />
            )}
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-primary" disabled={loading}>
              💾 Simpan Foto
            </button>
            <button type="button" className="btn-secondary" onClick={handleCancel}>
              Batal
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <p className="loading">Memuat data...</p>
      ) : filteredGaleriList.length === 0 ? (
        <p className="empty-state">
          {searchQuery ? 'Tidak ada foto yang cocok dengan pencarian.' : 'Belum ada foto galeri. Tambahkan yang pertama!'}
        </p>
      ) : (
        <div className="galeri-grid">
          {filteredGaleriList.map((item) => (
            <div key={item._id} className="galeri-item">
              <img src={urlFor(item.image)} alt={item.title} />
              <div className="galeri-overlay">
                <h4>{item.title}</h4>
                {item.description && <p>{item.description}</p>}
                <button
                  className="btn-delete-small"
                  onClick={() => handleDelete(item._id)}
                  disabled={loading}
                >
                  🗑️ Hapus
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
