import { useEffect, useState } from 'react'
import { KeyRound, Moon, Sun } from 'lucide-react'
import ChangePasswordModal from './ChangePasswordModal'
const navItems = [
  { key: 'dashboard', label: 'Dashboard' },
  { key: 'umkm', label: 'UMKM' },
  { key: 'acara', label: 'Acara' },
  { key: 'berita', label: 'Berita' },
  { key: 'galeri', label: 'Galeri' },
  { key: 'tentang', label: 'Tentang Dusun' },
]

export default function AdminLayout({
  activeTab,
  onTabChange,
  onLogout,
  searchQuery,
  onSearchChange,
  children,
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [passwordModalOpen, setPasswordModalOpen] = useState(false)
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem('admin-theme') === 'dark'
  )

  useEffect(() => {
    localStorage.setItem('admin-theme', darkMode ? 'dark' : 'light')
  }, [darkMode])

  const activeLabel = navItems.find((item) => item.key === activeTab)?.label || 'Dashboard'

  return (
    <div className="admin-shell" data-theme={darkMode ? 'dark' : 'light'}>
      <aside className={`admin-sidebar${sidebarOpen ? ' open' : ''}`}>
        <div className="admin-sidebar-brand">
          <div className="admin-brand-mark">
            DN
          </div>
          <span>Dusun Ngalang</span>
          <button
            className="admin-sidebar-close"
            onClick={() => setSidebarOpen(false)}
            aria-label="Tutup sidebar"
          >
            Tutup
          </button>
        </div>

        <nav className="admin-sidebar-nav">
          {navItems.map((item) => (
            <button
              key={item.key}
              className={`admin-nav-item${activeTab === item.key ? ' active' : ''}`}
              onClick={() => {
                onTabChange(item.key)
                setSidebarOpen(false)
              }}
            >
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <button className="admin-nav-item admin-logout" onClick={onLogout}>
          <span>Logout</span>
        </button>
      </aside>

      {sidebarOpen && (
        <button
          className="admin-sidebar-backdrop"
          onClick={() => setSidebarOpen(false)}
          aria-label="Tutup sidebar"
        ></button>
      )}

      <div className="admin-main">
        <header className="admin-topbar">
          <button
            className="admin-sidebar-toggle"
            onClick={() => setSidebarOpen(true)}
            aria-label="Buka sidebar"
          >
            Menu
          </button>

          <div className="admin-topbar-title">
            <h1>{activeLabel}</h1>
          </div>

          <div className="admin-search">
            <input
              type="search"
              placeholder="Cari..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>

          <div className="admin-topbar-actions">
            <button
              className="admin-icon-btn"
              onClick={() => setPasswordModalOpen(true)}
              aria-label="Ganti password"
              title="Ganti password"
            >
              <KeyRound size={17} />
            </button>
            <button
              className="admin-icon-btn"
              onClick={() => setDarkMode((d) => !d)}
              aria-label="Ganti tema"
              title="Ganti tema"
            >
              {darkMode ? <Sun size={17} /> : <Moon size={17} />}
            </button>
            <div className="admin-avatar" title="Admin Dusun Ngalang">A</div>
          </div>
        </header>

        <main className="admin-content-area">{children}</main>
      </div>

      <ChangePasswordModal open={passwordModalOpen} onClose={() => setPasswordModalOpen(false)} />
    </div>
  )
}
