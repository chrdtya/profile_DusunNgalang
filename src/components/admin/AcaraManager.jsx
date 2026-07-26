import { useState, useEffect } from 'react'
import NotificationModal from '../NotificationModal'
import { getDaftarAcara, createDocument, updateDocument, deleteDocument } from '../../lib/sanityClient'

export default function AcaraManager({ searchQuery = '' }) {
  const [acaraList, setAcaraList] = useState([])
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
    judul: '',
    kategori: '',
    tanggal: '',
    lokasi: '',
    deskripsi: '',
    kegiatan: '',
  })

  useEffect(() => {
    fetchAcara()
  }, [])

  async function fetchAcara() {
    setLoading(true)
    try {
      const data = await getDaftarAcara()
      setAcaraList(data || [])
    } catch (error) {
      console.error('Error fetching acara:', error)
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

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.judul || !formData.kategori || !formData.tanggal || !formData.deskripsi) {
      showNotification('warning', 'Perhatian', 'Harap isi semua kolom yang wajib diisi sebelum menyimpan acara.')
      return
    }

    setLoading(true)
    try {
      const dataToSave = {
        judul: formData.judul,
        kategori: formData.kategori,
        tanggal: formData.tanggal,
        lokasi: formData.lokasi,
        deskripsi: formData.deskripsi,
        kegiatan: formData.kegiatan
          .split('\n')
          .filter((k) => k.trim())
          .map((k) => k.trim()),
      }

      if (editing) {
        await updateDocument(editing._id, dataToSave)
        showNotification(
          'success',
          'Acara berhasil diperbarui',
          'Perubahan acara telah tersimpan dengan baik.'
        )
      } else {
        await createDocument('acara', dataToSave)
        showNotification(
          'success',
          'Acara berhasil ditambahkan',
          'Data acara baru berhasil disimpan.'
        )
      }

      setFormData({
        judul: '',
        kategori: '',
        tanggal: '',
        lokasi: '',
        deskripsi: '',
        kegiatan: '',
      })
      setEditing(null)
      setShowForm(false)
      await fetchAcara()
    } catch (error) {
      console.error('Error saving acara:', error)
      showNotification('error', 'Gagal menyimpan acara', 'Maaf, terjadi masalah saat menyimpan data acara. Silakan coba lagi.')
    }
    setLoading(false)
  }

  const handleEdit = (item) => {
    setFormData({
      judul: item.judul,
      kategori: item.kategori,
      tanggal: item.tanggal,
      lokasi: item.lokasi,
      deskripsi: item.deskripsi,
      kegiatan: item.kegiatan ? item.kegiatan.join('\n') : '',
    })
    setEditing(item)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    showConfirm('warning', 'Hapus acara?', 'Yakin ingin menghapus acara ini?', async () => {
      setLoading(true)
      try {
        await deleteDocument(id)
        showNotification('success', 'Acara berhasil dihapus', 'Data acara telah dihapus.')
        await fetchAcara()
      } catch (error) {
        console.error('Error deleting acara:', error)
        showNotification('error', 'Gagal menghapus acara', 'Terjadi masalah saat menghapus acara. Silakan coba lagi.')
      }
      setLoading(false)
    }, 'Hapus')
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditing(null)
    setFormData({
      judul: '',
      kategori: '',
      tanggal: '',
      lokasi: '',
      deskripsi: '',
      kegiatan: '',
    })
  }

  const filteredAcaraList = acaraList.filter((item) => {
    const q = searchQuery.trim().toLowerCase()
    if (!q) return true
    return item.judul?.toLowerCase().includes(q) || item.kategori?.toLowerCase().includes(q)
  })

  return (
    <div className="manager-container">
      <div className="manager-header">
        <h2>Kelola Acara</h2>
        <button
          className="btn-primary"
          onClick={() => setShowForm(!showForm)}
          disabled={loading}
        >
          {showForm ? '✕ Batal' : '+ Tambah Acara'}
        </button>
      </div>

      {showForm && (
        <form className="form-container" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Judul Acara *</label>
            <input
              type="text"
              name="judul"
              value={formData.judul}
              onChange={handleInputChange}
              placeholder="Masukkan judul acara"
              required
            />
          </div>

          <div className="form-group">
            <label>Kategori *</label>
            <select
              name="kategori"
              value={formData.kategori}
              onChange={handleInputChange}
              required
            >
              <option value="">Pilih Kategori</option>
              <option value="Tradisi">Tradisi</option>
              <option value="Sosial">Sosial</option>
              <option value="Nasional">Nasional</option>
              <option value="Olahraga">Olahraga</option>
              <option value="Budaya">Budaya</option>
            </select>
          </div>

          <div className="form-group">
            <label>Tanggal *</label>
            <input
              type="date"
              name="tanggal"
              value={formData.tanggal}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Lokasi</label>
            <input
              type="text"
              name="lokasi"
              value={formData.lokasi}
              onChange={handleInputChange}
              placeholder="Masukkan lokasi acara"
            />
          </div>

          <div className="form-group">
            <label>Deskripsi *</label>
            <textarea
              name="deskripsi"
              value={formData.deskripsi}
              onChange={handleInputChange}
              placeholder="Masukkan deskripsi acara"
              rows="4"
              required
            ></textarea>
          </div>

          <div className="form-group">
            <label>Kegiatan (satu per baris)</label>
            <textarea
              name="kegiatan"
              value={formData.kegiatan}
              onChange={handleInputChange}
              placeholder="Masukkan kegiatan dalam acara&#10;Satu kegiatan per baris"
              rows="5"
            ></textarea>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-primary" disabled={loading}>
              {editing ? 'Update Acara' : 'Simpan Acara'}
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
      ) : filteredAcaraList.length === 0 ? (
        <p className="empty-state">
          {searchQuery ? 'Tidak ada acara yang cocok dengan pencarian.' : 'Belum ada acara. Tambahkan yang pertama!'}
        </p>
      ) : (
        <div className="items-list">
          {filteredAcaraList.map((item) => (
            <div key={item._id} className="item-card-list">
              <div className="item-content">
                <h3>{item.judul}</h3>
                <p className="category">{item.kategori}</p>
                <p>
                  <strong>Tanggal:</strong> {new Date(item.tanggal).toLocaleDateString('id-ID')}
                </p>
                <p>
                  <strong>Lokasi:</strong> {item.lokasi}
                </p>
                <p className="description">{item.deskripsi}</p>
                {item.kegiatan && item.kegiatan.length > 0 && (
                  <div className="kegiatan-list">
                    <strong>Kegiatan:</strong>
                    <ul>
                      {item.kegiatan.map((k, idx) => (
                        <li key={idx}>{k}</li>
                      ))}
                    </ul>
                  </div>
                )}
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
