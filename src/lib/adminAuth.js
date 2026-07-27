// Gerbang login admin ini murni cek di sisi browser (belum ada backend/user database
// sungguhan) — konsisten dengan VITE_ADMIN_PASSWORD yang sudah dipakai sebelumnya.
// Password yang diganti lewat fitur "Ganti Password" disimpan sebagai override di
// localStorage milik browser tsb, jadi tidak butuh verifikasi email/server.
const PASSWORD_OVERRIDE_KEY = 'admin-password-override'

export const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL || 'padukuhanngalang@gmail.com'

export function getCurrentPassword() {
  return localStorage.getItem(PASSWORD_OVERRIDE_KEY) || import.meta.env.VITE_ADMIN_PASSWORD || ''
}

export function setCurrentPassword(newPassword) {
  localStorage.setItem(PASSWORD_OVERRIDE_KEY, newPassword)
}
