import { useEffect, useState } from 'react'
import {
  LayoutDashboard,
  Store,
  CalendarDays,
  Newspaper,
  Images,
  BookOpen,
  LogOut,
  Search,
  Moon,
  Sun,
  Menu,
  X,
  Leaf,
} from 'lucide-react'

const navItems = [
  { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { key: 'umkm', label: 'UMKM', icon: Store },
  { key: 'acara', label: 'Acara', icon: CalendarDays },
  { key: 'berita', label: 'Berita', icon: Newspaper },
  { key: 'galeri', label: 'Galeri', icon: Images },
  { key: 'tentang', label: 'Tentang Dusun', icon: BookOpen },
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
            <Leaf size={17} strokeWidth={2.4} />
          </div>
          <span>Dusun Ngalang</span>
          <button
            className="admin-sidebar-close"
            onClick={() => setSidebarOpen(false)}
            aria-label="Tutup sidebar"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="admin-sidebar-nav">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <button
                key={item.key}
                className={`admin-nav-item${activeTab === item.key ? ' active' : ''}`}
                onClick={() => {
                  onTabChange(item.key)
                  setSidebarOpen(false)
                }}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </button>
            )
          })}
        </nav>

        <button className="admin-nav-item admin-logout" onClick={onLogout}>
          <LogOut size={18} />
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
            <Menu size={20} />
          </button>

          <div className="admin-topbar-title">
            <h1>{activeLabel}</h1>
          </div>

          <div className="admin-search">
            <Search size={16} />
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
    </div>
  )
}
