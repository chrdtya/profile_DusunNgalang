import { useState, useEffect, lazy, Suspense } from 'react'
import { motion } from 'framer-motion'
import Lenis from 'lenis'
import {
  Leaf,
  LogIn,
  Menu,
  X,
  ArrowRight,
  Camera,
  Users,
  MessageCircle,
} from 'lucide-react'
import './App.css'
import Reveal from './components/motion/Reveal'
import CursorGlow from './components/motion/CursorGlow'
import BackToTop from './components/motion/BackToTop'
import WaveDivider from './components/motion/WaveDivider'
import SectionHero from './sections/SectionHero'
import SectionProfilDesa from './sections/SectionProfilDesa'
import SectionTentang from './sections/SectionTentang'
import SectionFiturDesa from './sections/SectionFiturDesa'
import SectionUmkm from './sections/SectionUmkm'
import SectionAcara from './sections/SectionAcara'
import SectionBerita from './sections/SectionBerita'
import SectionGaleri from './sections/SectionGaleri'
import SectionLokasi from './sections/SectionLokasi'

// Daftar nav links + id section yang terkait — urutan mengikuti urutan section di halaman
const navLinks = [
  { label: 'Beranda', href: '#beranda' },
  { label: 'Tentang', href: '#tentang-dusun' },
  { label: 'UMKM', href: '#umkm' },
  { label: 'Acara', href: '#acara' },
  { label: 'Berita', href: '#berita' },
  { label: 'Galeri', href: '#galeri' },
  { label: 'Data Geografi', href: '#lokasi' },
]

// Admin panel (termasuk recharts & sanity write proxy) di-lazy-load agar bundle publik tetap ringan
const AdminPanel = lazy(() => import('./components/AdminPanel'))

function App() {
  const [activeHash, setActiveHash] = useState(window.location.hash || '#beranda')
  const [isAdminPage, setIsAdminPage] = useState(window.location.hash === '#admin')
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  // Check if accessing admin page
  useEffect(() => {
    const handleHashChange = () => {
      const currentHash = window.location.hash
      setIsAdminPage(currentHash === '#admin')
      if (!currentHash.includes('admin')) {
        setActiveHash(currentHash || '#beranda')
      }
    }

    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  // Tutup menu mobile setiap kali ukuran layar kembali ke desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 860) setIsMenuOpen(false)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Lenis — scroll halus premium menggantikan native scroll (dimatikan untuk reduced-motion).
  // Klik pada anchor (#id) diarahkan lewat lenis.scrollTo, karena lompatan hash native akan
  // "berebut" dengan RAF loop Lenis dan membuat scroll berhenti di posisi yang salah.
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const lenis = new Lenis({ duration: 1.1, smoothWheel: true })
    let rafId
    const raf = (time) => {
      lenis.raf(time)
      rafId = requestAnimationFrame(raf)
    }
    rafId = requestAnimationFrame(raf)

    const handleAnchorClick = (e) => {
      const anchor = e.target.closest('a[href^="#"]')
      if (!anchor) return
      const id = anchor.getAttribute('href').slice(1)
      const target = id ? document.getElementById(id) : null
      if (!target) return
      e.preventDefault()
      lenis.scrollTo(target, { offset: -90, duration: 1.2 })
    }
    document.addEventListener('click', handleAnchorClick)

    return () => {
      cancelAnimationFrame(rafId)
      document.removeEventListener('click', handleAnchorClick)
      lenis.destroy()
    }
  }, [])

  // Navbar berubah dari transparan (di atas hero) menjadi solid + blur saat discroll
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24)
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Section terakhir (Data Geografi) sering tidak sempat masuk zona trigger
  // IntersectionObserver karena tidak bisa discroll lagi setelah mentok dasar
  // halaman — jadi nav-nya tidak pernah ke-highlight. Paksa aktif saat mentok bawah.
  useEffect(() => {
    const lastHref = navLinks[navLinks.length - 1].href
    const handleBottom = () => {
      const reachedBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4
      if (reachedBottom) setActiveHash(lastHref)
    }
    handleBottom()
    window.addEventListener('scroll', handleBottom, { passive: true })
    return () => window.removeEventListener('scroll', handleBottom)
  }, [])

  useEffect(() => {
    // Kumpulkan semua section yang punya id sesuai nav
    const sectionIds = navLinks.map((l) => l.href.replace('#', ''))

    const observer = new IntersectionObserver(
      (entries) => {
        // Ambil section yang paling banyak terlihat
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)

        if (visible.length > 0) {
          setActiveHash(`#${visible[0].target.id}`)
        }
      },
      {
        rootMargin: '-30% 0px -60% 0px', // aktif saat section ada di ~30% atas viewport
        threshold: [0, 0.1, 0.3, 0.5],
      }
    )

    sectionIds.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  // Render admin panel if accessing admin page
  if (isAdminPage) {
    return (
      <Suspense fallback={<div className="admin-loading-fallback">Memuat Admin Panel…</div>}>
        <AdminPanel />
      </Suspense>
    )
  }

  return (
    <div className="page-shell">
      <CursorGlow />
      <BackToTop />

      {/* ── NAVBAR ── */}
      <header className={`topbar${scrolled ? ' scrolled' : ''}${isMenuOpen ? ' menu-open' : ''}`}>
        <div className="topbar-inner">
          <a
            className="brand-wrap"
            href="#beranda"
            onClick={() => {
              setActiveHash('#beranda')
              setIsMenuOpen(false)
            }}
          >
            <div className="brand-mark" aria-hidden="true">
              <Leaf size={17} strokeWidth={2.4} />
            </div>
            <p className="brand-name">Dusun Ngalang</p>
          </a>

          <nav className="main-nav" aria-label="Menu utama">
            <ul className={`menu-list${isMenuOpen ? ' open' : ''}`}>
              {navLinks.map((link) => {
                const isActive = activeHash === link.href
                return (
                  <li key={link.href}>
                    <a
                      className={`menu-item${isActive ? ' active' : ''}`}
                      href={link.href}
                      onClick={() => {
                        setActiveHash(link.href)
                        setIsMenuOpen(false)
                      }}
                    >
                      {link.label}
                      {isActive && (
                        <motion.span
                          className="menu-underline"
                          layoutId="nav-underline"
                          aria-hidden="true"
                          transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                        />
                      )}
                    </a>
                  </li>
                )
              })}
            </ul>
          </nav>

          <div className="topbar-actions">
            <button
              className={`menu-toggle${isMenuOpen ? ' open' : ''}`}
              aria-label={isMenuOpen ? 'Tutup menu navigasi' : 'Buka menu navigasi'}
              aria-expanded={isMenuOpen}
              onClick={() => setIsMenuOpen((open) => !open)}
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        <button
          type="button"
          className={`menu-backdrop${isMenuOpen ? ' open' : ''}`}
          aria-label="Tutup menu navigasi"
          tabIndex={isMenuOpen ? 0 : -1}
          onClick={() => setIsMenuOpen(false)}
        />

        <nav className={`mobile-sidebar${isMenuOpen ? ' open' : ''}`} aria-label="Menu utama mobile">
          <div className="mobile-sidebar-header">
            <div>
              <span className="mobile-sidebar-kicker">Akses Cepat</span>
              <h2>Menu Fitur</h2>
            </div>
            <button
              type="button"
              className="mobile-sidebar-close"
              aria-label="Tutup menu navigasi"
              onClick={() => setIsMenuOpen(false)}
            >
              <X size={18} />
            </button>
          </div>

          <ul className="mobile-sidebar-list">
            {navLinks.map((link) => {
              const isActive = activeHash === link.href
              return (
                <li key={link.href}>
                  <a
                    className={`mobile-sidebar-item${isActive ? ' active' : ''}`}
                    href={link.href}
                    onClick={() => {
                      setActiveHash(link.href)
                      setIsMenuOpen(false)
                    }}
                  >
                    <span>{link.label}</span>
                    <ArrowRight size={16} />
                  </a>
                </li>
              )
            })}
          </ul>
        </nav>
      </header>

      <main>

        <SectionHero />

        {/* ── SECTIONS ── */}
        <SectionProfilDesa />
        <SectionTentang />
        <SectionFiturDesa />
        <SectionUmkm />
        <SectionAcara />
        <SectionBerita />
        <SectionGaleri />
        <SectionLokasi />

      </main>

      {/* ── FOOTER ── */}
      <footer className="site-footer">
        <WaveDivider color="var(--muted)" />

        <Reveal className="footer-grid" y={20}>

          {/* Brand & deskripsi */}
          <div className="footer-brand footer-glass">
            <div className="brand-wrap footer-brand-wrap">
              <div className="brand-mark" aria-hidden="true">
                <Leaf size={17} strokeWidth={2.4} />
              </div>
              <p className="brand-name">Dusun Ngalang</p>
            </div>
            <p className="footer-desc">
              Portal informasi resmi Dusun Ngalang. Menyajikan informasi UMKM lokal,
              acara tradisional Rasulan, dan kegiatan masyarakat dusun.
            </p>
          </div>

          {/* Navigasi */}
          <div className="footer-col footer-glass">
            <h4>Halaman</h4>
            <ul className="footer-links">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a href={link.href}>{link.label}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Kontak */}
          <div className="footer-col footer-glass">
            <h4>Kontak</h4>
            <div className="footer-contact">
              <p>Dusun Ngalang</p>
              <p>Kec. Gedangsari, Kab. Gunungkidul</p>
              <p>D.I. Yogyakarta, Indonesia</p>
              <p><a href="mailto:padukuhanngalang@gmail.com">padukuhanngalang@gmail.com</a></p>
            </div>
          </div>

          {/* Sosial media — belum tersedia, tombol non-aktif agar tidak mengarah ke tautan palsu */}
          <div className="footer-col footer-glass">
            <h4>Ikuti Kami</h4>
            <div className="footer-social">
              <button type="button" className="footer-social-btn" disabled title="Segera hadir">
                <Camera size={17} />
              </button>
              <button type="button" className="footer-social-btn" disabled title="Segera hadir">
                <Users size={17} />
              </button>
              <button type="button" className="footer-social-btn" disabled title="Segera hadir">
                <MessageCircle size={17} />
              </button>
            </div>
            <p className="footer-social-note">Kanal media sosial resmi segera hadir</p>
          </div>

        </Reveal>
        <div className="footer-bottom">
          <div className="footer-bottom-meta">
            <p>© {new Date().getFullYear()} Dusun Ngalang. Hak cipta dilindungi.</p>
            <p className="footer-heart">
              Dibangun untuk kemajuan dusun
              <motion.span
                animate={{ scale: [1, 1.25, 1] }}
                transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
                aria-hidden="true"
              >
                ♥
              </motion.span>
            </p>
          </div>
          <a className="btn-login footer-login" href="#admin" title="Admin Panel">
            <LogIn size={16} strokeWidth={2.4} />
            <span>Login</span>
          </a>
        </div>
      </footer>

    </div>
  )
}

export default App
