import { useState } from 'react'
import { Leaf, Lock, Eye, EyeOff, LogIn } from 'lucide-react'
import '../styles/AdminPanel.css'
import AdminLayout from './admin/AdminLayout'
import DashboardHome from './admin/DashboardHome'
import UmkmManager from './admin/UmkmManager'
import AcaraManager from './admin/AcaraManager'
import BeritaManager from './admin/BeritaManager'
import GaleriManager from './admin/GaleriManager'
import TentangManager from './admin/TentangManager'

const heroImage =
  'https://images.unsplash.com/photo-1576076983530-d45f9c5b60b2?auto=format&fit=crop&w=1200&q=80'

const STORAGE_KEY = 'admin-authenticated'

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [searchQuery, setSearchQuery] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => sessionStorage.getItem(STORAGE_KEY) === '1' || localStorage.getItem(STORAGE_KEY) === '1'
  )
  const [passwordAttempt, setPasswordAttempt] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [loginError, setLoginError] = useState(false)
  const password = import.meta.env.VITE_ADMIN_PASSWORD

  const handleLogin = () => {
    if (passwordAttempt === password) {
      setIsAuthenticated(true)
      setPasswordAttempt('')
      setLoginError(false)
      const storage = rememberMe ? localStorage : sessionStorage
      storage.setItem(STORAGE_KEY, '1')
    } else {
      setLoginError(true)
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    setPasswordAttempt('')
    localStorage.removeItem(STORAGE_KEY)
    sessionStorage.removeItem(STORAGE_KEY)
  }

  const handleTabChange = (tab) => {
    setActiveTab(tab)
    setSearchQuery('')
  }

  if (!isAuthenticated) {
    return (
      <div className="admin-login-page">
        <div className="admin-login-visual">
          <img src={heroImage} alt="Panorama Dusun Ngalang" />
          <div className="admin-login-visual-overlay"></div>
          <div className="admin-login-visual-content">
            <div className="admin-brand-mark admin-brand-mark-lg">
              <Leaf size={20} strokeWidth={2.4} />
            </div>
            <p className="admin-login-quote">
              "Portal digital yang menghubungkan warga, UMKM, dan pengunjung
              Dusun Ngalang dalam satu tempat."
            </p>
            <span className="admin-login-quote-author">— Tim Dusun Ngalang</span>
          </div>
        </div>

        <div className="admin-login-form-side">
          <div className="admin-login-card">
            <div className="admin-brand-mark admin-login-icon">
              <Lock size={20} strokeWidth={2.4} />
            </div>
            <h1>Selamat Datang Kembali</h1>
            <p>Masuk untuk mengelola konten Dusun Ngalang</p>

            <div className="admin-login-form">
              <label htmlFor="admin-password">Password</label>
              <div className="admin-password-field">
                <input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Masukkan password admin"
                  value={passwordAttempt}
                  onChange={(e) => {
                    setPasswordAttempt(e.target.value)
                    setLoginError(false)
                  }}
                  onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                />
                <button
                  type="button"
                  className="admin-password-toggle"
                  onClick={() => setShowPassword((s) => !s)}
                  aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
              {loginError && <p className="admin-login-error">Password salah, silakan coba lagi.</p>}

              <div className="admin-login-row">
                <label className="admin-checkbox">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  Ingat saya
                </label>
                <span className="admin-forgot" title="Hubungi admin dusun untuk reset password">
                  Lupa password?
                </span>
              </div>

              <button onClick={handleLogin} className="admin-login-btn">
                <LogIn size={17} /> Masuk
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <AdminLayout
      activeTab={activeTab}
      onTabChange={handleTabChange}
      onLogout={handleLogout}
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
    >
      {activeTab === 'dashboard' && <DashboardHome onNavigate={handleTabChange} />}
      {activeTab === 'tentang' && <TentangManager searchQuery={searchQuery} />}
      {activeTab === 'umkm' && <UmkmManager searchQuery={searchQuery} />}
      {activeTab === 'acara' && <AcaraManager searchQuery={searchQuery} />}
      {activeTab === 'berita' && <BeritaManager searchQuery={searchQuery} />}
      {activeTab === 'galeri' && <GaleriManager searchQuery={searchQuery} />}
    </AdminLayout>
  )
}
