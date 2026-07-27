import { useState } from 'react'
import Modal from '../Modal'
import { getCurrentPassword, setCurrentPassword } from '../../lib/adminAuth'

const emptyForm = { current: '', next: '', confirm: '' }

export default function ChangePasswordModal({ open, onClose }) {
  const [form, setForm] = useState(emptyForm)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const updateField = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }))
    setError('')
  }

  const handleClose = () => {
    setForm(emptyForm)
    setError('')
    setSuccess(false)
    onClose()
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (form.current !== getCurrentPassword()) {
      setError('Password saat ini salah.')
      return
    }
    if (form.next.length < 6) {
      setError('Password baru minimal 6 karakter.')
      return
    }
    if (form.next !== form.confirm) {
      setError('Konfirmasi password baru tidak cocok.')
      return
    }

    setCurrentPassword(form.next)
    setForm(emptyForm)
    setSuccess(true)
  }

  return (
    <Modal open={open} onClose={handleClose} labelledBy="change-password-title">
      <div className="admin-password-modal">
        <h3 id="change-password-title">Ganti Password</h3>
        <p className="admin-password-modal-desc">
          Password login admin untuk email ini akan diperbarui. Tidak perlu verifikasi
          email — cukup konfirmasi password yang sedang aktif.
        </p>

        {success ? (
          <div className="admin-password-success">
            <p>Password berhasil diganti. Gunakan password baru saat login berikutnya.</p>
            <button type="button" className="admin-login-btn" onClick={handleClose}>
              Selesai
            </button>
          </div>
        ) : (
          <form className="admin-login-form" onSubmit={handleSubmit}>
            <label htmlFor="admin-current-password">Password saat ini</label>
            <div className="admin-password-field">
              <input
                id="admin-current-password"
                type="password"
                autoComplete="current-password"
                value={form.current}
                onChange={updateField('current')}
                required
              />
            </div>

            <label htmlFor="admin-new-password">Password baru</label>
            <div className="admin-password-field">
              <input
                id="admin-new-password"
                type="password"
                autoComplete="new-password"
                value={form.next}
                onChange={updateField('next')}
                required
              />
            </div>

            <label htmlFor="admin-confirm-password">Konfirmasi password baru</label>
            <div className="admin-password-field">
              <input
                id="admin-confirm-password"
                type="password"
                autoComplete="new-password"
                value={form.confirm}
                onChange={updateField('confirm')}
                required
              />
            </div>

            {error && <p className="admin-login-error">{error}</p>}

            <button type="submit" className="admin-login-btn">
              Simpan Password Baru
            </button>
          </form>
        )}
      </div>
    </Modal>
  )
}
