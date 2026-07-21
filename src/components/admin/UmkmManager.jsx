import { useState, useEffect } from 'react'
import { getDaftarUmkm, createDocument, updateDocument, deleteDocument, urlFor } from '../../lib/sanityClient'
import SanityImageUpload from '../SanityImageUpload'

export default function UmkmManager({ searchQuery = '' }) {
  const [umkmList, setUmkmList] = useState([])
  const [loading, setLoading] = useState(false)
  const [editing, setEditing] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    address: '',
    rating: '',
    image: null,
  })

  useEffect(() => {
    fetchUmkm()
  }, [])

  async function fetchUmkm() {
    setLoading(true)
    try {
      const data = await getDaftarUmkm()
      setUmkmList(data || [])
    } catch (error) {
      console.error('Error fetching UMKM:', error)
      alert('Gagal memuat data UMKM')
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

    if (!formData.name || !formData.category || !formData.description) {
      alert('Harap isi semua field yang diperlukan!')
      return
    }

    setLoading(true)
    try {
      const dataToSave = {
        name: formData.name,
        category: formData.category,
        description: formData.description,
        address: formData.address,
        ...(formData.rating && { rating: Number(formData.rating) }),
        ...(formData.image && { image: { _type: 'image', asset: formData.image } }),
      }

      if (editing) {
        await updateDocument(editing._id, dataToSave)
        alert('UMKM berhasil diupdate!')
      } else {
        await createDocument('umkm', dataToSave)
        alert('UMKM berhasil ditambahkan!')
      }

      setFormData({
        name: '',
        category: '',
        description: '',
        address: '',
        rating: '',
        image: null,
      })
      setEditing(null)
      setShowForm(false)
      await fetchUmkm()
    } catch (error) {
      console.error('Error saving UMKM:', error)
      alert('Gagal menyimpan UMKM')
    }
    setLoading(false)
  }

  const handleEdit = (item) => {
    setFormData({
      name: item.name,
      category: item.category,
      description: item.description,
      address: item.address || '',
      rating: item.rating || '',
      image: item.image,
    })
    setEditing(item)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Yakin ingin menghapus UMKM ini?')) return

    setLoading(true)
    try {
      await deleteDocument(id)
      alert('UMKM berhasil dihapus!')
      await fetchUmkm()
    } catch (error) {
      console.error('Error deleting UMKM:', error)
      alert('Gagal menghapus UMKM')
    }
    setLoading(false)
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditing(null)
    setFormData({
      name: '',
      category: '',
      description: '',
      address: '',
      rating: '',
      image: null,
    })
  }

  const filteredUmkmList = umkmList.filter((item) => {
    const q = searchQuery.trim().toLowerCase()
    if (!q) return true
    return item.name?.toLowerCase().includes(q) || item.category?.toLowerCase().includes(q)
  })

  return (
    <div className="manager-container">
      <div className="manager-header">
        <h2>Kelola UMKM</h2>
        <button
          className="btn-primary"
          onClick={() => setShowForm(!showForm)}
          disabled={loading}
        >
          {showForm ? '✕ Batal' : '+ Tambah UMKM'}
        </button>
      </div>

      {showForm && (
        <form className="form-container" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nama UMKM *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Masukkan nama UMKM"
              required
            />
          </div>

          <div className="form-group">
            <label>Kategori *</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              required
            >
              <option value="">Pilih Kategori</option>
              <option value="Kuliner">🍽️ Kuliner</option>
              <option value="Kerajinan">🎨 Kerajinan</option>
              <option value="Fashion">👔 Fashion</option>
              <option value="Pertanian">🌾 Pertanian</option>
              <option value="Jasa">🛠️ Jasa</option>
              <option value="Lainnya">📦 Lainnya</option>
            </select>
          </div>

          <div className="form-group">
            <label>Deskripsi *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Masukkan deskripsi UMKM"
              rows="4"
              required
            ></textarea>
          </div>

          <div className="form-group">
            <label>Alamat / Lokasi *</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              placeholder="Masukkan alamat atau lokasi"
              required
            />
          </div>

          <div className="form-group">
            <label>Rating (1-5, opsional)</label>
            <input
              type="number"
              name="rating"
              min="1"
              max="5"
              step="0.1"
              value={formData.rating}
              onChange={handleInputChange}
              placeholder="Contoh: 4.5"
            />
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
              {editing ? '💾 Update UMKM' : '💾 Simpan UMKM'}
            </button>
            <button type="button" className="btn-secondary" onClick={handleCancel}>
              Batal
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <p className="loading">Memuat data...</p>
      ) : filteredUmkmList.length === 0 ? (
        <p className="empty-state">
          {searchQuery ? 'Tidak ada UMKM yang cocok dengan pencarian.' : 'Belum ada UMKM. Tambahkan yang pertama!'}
        </p>
      ) : (
        <div className="items-grid">
          {filteredUmkmList.map((item) => (
            <div key={item._id} className="item-card">
              {item.image && (
                <img src={urlFor(item.image)} alt={item.name} className="item-image" />
              )}
              <div className="item-content">
                <h3>{item.name}</h3>
                <p className="category">{item.category}</p>
                <p className="description">{item.description}</p>
                {item.address && <p className="address">📍 {item.address}</p>}
              </div>
              <div className="item-actions">
                <button
                  className="btn-edit"
                  onClick={() => handleEdit(item)}
                  disabled={loading}
                >
                  ✏️ Edit
                </button>
                <button
                  className="btn-delete"
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
