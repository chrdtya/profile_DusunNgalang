import { useState, useEffect } from 'react'
import { getDaftarBerita, createDocument, updateDocument, deleteDocument, urlFor } from '../../lib/sanityClient'
import SanityImageUpload from '../SanityImageUpload'

export default function BeritaManager({ searchQuery = '' }) {
  const [beritaList, setBeritaList] = useState([])
  const [loading, setLoading] = useState(false)
  const [editing, setEditing] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    judul: '',
    konten: '',
    tanggalPublikasi: new Date().toISOString().split('T')[0],
    image: null,
    penulis: '',
    kategori: '',
  })

  useEffect(() => {
    fetchBerita()
  }, [])

  async function fetchBerita() {
    setLoading(true)
    try {
      const data = await getDaftarBerita()
      setBeritaList(data || [])
    } catch (error) {
      console.error('Error fetching berita:', error)
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

    if (!formData.judul || !formData.konten) {
      alert('Harap isi semua field yang diperlukan!')
      return
    }

    setLoading(true)
    try {
      const dataToSave = {
        judul: formData.judul,
        konten: formData.konten,
        tanggalPublikasi: formData.tanggalPublikasi,
        penulis: formData.penulis,
        kategori: formData.kategori,
        ...(formData.image && { image: { _type: 'image', asset: formData.image } }),
      }

      if (editing) {
        await updateDocument(editing._id, dataToSave)
        alert('Berita berhasil diupdate!')
      } else {
        await createDocument('berita', dataToSave)
        alert('Berita berhasil ditambahkan!')
      }

      setFormData({
        judul: '',
        konten: '',
        tanggalPublikasi: new Date().toISOString().split('T')[0],
        image: null,
        penulis: '',
        kategori: '',
      })
      setEditing(null)
      setShowForm(false)
      await fetchBerita()
    } catch (error) {
      console.error('Error saving berita:', error)
      alert('Gagal menyimpan berita')
    }
    setLoading(false)
  }

  const handleEdit = (item) => {
    setFormData({
      judul: item.judul,
      konten: item.konten,
      tanggalPublikasi: item.tanggalPublikasi,
      image: item.image,
      penulis: item.penulis || '',
      kategori: item.kategori || '',
    })
    setEditing(item)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Yakin ingin menghapus berita ini?')) return

    setLoading(true)
    try {
      await deleteDocument(id)
      alert('Berita berhasil dihapus!')
      await fetchBerita()
    } catch (error) {
      console.error('Error deleting berita:', error)
      alert('Gagal menghapus berita')
    }
    setLoading(false)
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditing(null)
    setFormData({
      judul: '',
      konten: '',
      tanggalPublikasi: new Date().toISOString().split('T')[0],
      image: null,
      penulis: '',
      kategori: '',
    })
  }

  const filteredBeritaList = beritaList.filter((item) => {
    const q = searchQuery.trim().toLowerCase()
    if (!q) return true
    return item.judul?.toLowerCase().includes(q) || item.kategori?.toLowerCase().includes(q)
  })

  return (
    <div className="manager-container">
      <div className="manager-header">
        <h2>Kelola Berita</h2>
        <button
          className="btn-primary"
          onClick={() => setShowForm(!showForm)}
          disabled={loading}
        >
          {showForm ? '✕ Batal' : '+ Tambah Berita'}
        </button>
      </div>

      {showForm && (
        <form className="form-container" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Judul Berita *</label>
            <input
              type="text"
              name="judul"
              value={formData.judul}
              onChange={handleInputChange}
              placeholder="Masukkan judul berita"
              required
            />
          </div>

          <div className="form-group">
            <label>Konten *</label>
            <textarea
              name="konten"
              value={formData.konten}
              onChange={handleInputChange}
              placeholder="Masukkan konten berita"
              rows="8"
              required
            ></textarea>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Tanggal Publikasi</label>
              <input
                type="date"
                name="tanggalPublikasi"
                value={formData.tanggalPublikasi}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label>Penulis</label>
              <input
                type="text"
                name="penulis"
                value={formData.penulis}
                onChange={handleInputChange}
                placeholder="Nama penulis"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Kategori</label>
            <select name="kategori" value={formData.kategori} onChange={handleInputChange}>
              <option value="">Pilih Kategori</option>
              <option value="Kegiatan">Kegiatan</option>
              <option value="Pengumuman">Pengumuman</option>
              <option value="UMKM">UMKM</option>
              <option value="Budaya">Budaya</option>
            </select>
          </div>

          <div className="form-group">
            <label>Gambar Thumbnail</label>
            <SanityImageUpload onImageSelect={handleImageSelect} />
            {formData.image && (
              <img src={urlFor(formData.image)} alt="Preview" className="image-preview" />
            )}
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-primary" disabled={loading}>
              {editing ? 'Update Berita' : 'Simpan Berita'}
            </button>
            <button type="button" className="btn-secondary" onClick={handleCancel}>
              Batal
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <p className="loading">Memuat data...</p>
      ) : filteredBeritaList.length === 0 ? (
        <p className="empty-state">
          {searchQuery ? 'Tidak ada berita yang cocok dengan pencarian.' : 'Belum ada berita. Tambahkan yang pertama!'}
        </p>
      ) : (
        <div className="items-list">
          {filteredBeritaList.map((item) => (
            <div key={item._id} className="item-card-list">
              {item.image && (
                <img src={urlFor(item.image)} alt={item.judul} className="thumbnail" />
              )}
              <div className="item-content">
                <h3>{item.judul}</h3>
                <p className="meta">
                  {new Date(item.tanggalPublikasi).toLocaleDateString('id-ID')}
                  {item.penulis && ` • Penulis: ${item.penulis}`}
                </p>
                <p className="konten-preview">{item.konten.substring(0, 150)}...</p>
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
