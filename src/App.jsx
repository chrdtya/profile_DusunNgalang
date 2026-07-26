import { useState, useEffect, lazy, Suspense } from 'react'
import { motion } from 'framer-motion'
import {
  Leaf,
  LogIn,
  Menu,
  X,
  ArrowRight,
  MapPin,
  Store,
  Camera,
  Users,
  MessageCircle,
} from 'lucide-react'
import './App.css'
import Reveal from './components/motion/Reveal'
import SectionTentang from './sections/SectionTentang'
import SectionUmkm from './sections/SectionUmkm'
import SectionAcara from './sections/SectionAcara'
import SectionBerita from './sections/SectionBerita'
import SectionGaleri from './sections/SectionGaleri'
import SectionLokasi from './sections/SectionLokasi'
import { useSanityData } from './hooks/useSanityData'
import { getDaftarUmkm, getDaftarAcara, getDaftarBerita } from './lib/sanityClient'
import { daftarUmkm, daftarAcara, daftarBerita } from './data/siteData'

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

const heroImage =
  'https://images.unsplash.com/photo-1576076983530-d45f9c5b60b2?auto=format&fit=crop&w=1400&q=80'

const heroVideoUrl = 'https://youtu.be/kcyMei5cNig?si=dirwqpA-YI4yFD-f'
const heroVideoId = 'kcyMei5cNig'
const heroVideoSrc = `https://www.youtube-nocookie.com/embed/${heroVideoId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${heroVideoId}&playsinline=1&rel=0&modestbranding=1&iv_load_policy=3&disablekb=1&fs=0`

// Admin panel (termasuk recharts & sanity write proxy) di-lazy-load agar bundle publik tetap ringan
const AdminPanel = lazy(() => import('./components/AdminPanel'))

function App() {
  const [activeHash, setActiveHash] = useState(window.location.hash || '#beranda')
  const [isAdminPage, setIsAdminPage] = useState(window.location.hash === '#admin')
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  const umkmList = useSanityData(getDaftarUmkm, daftarUmkm)
  const acaraList = useSanityData(getDaftarAcara, daftarAcara)
  const beritaList = useSanityData(getDaftarBerita, daftarBerita)

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

  // Navbar berubah dari transparan (di atas hero) menjadi solid + blur saat discroll
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24)
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
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

        {/* ── HERO ── */}
        <section className="hero-section" id="beranda" style={{ '--hero-image': `url(${heroImage})` }}>
          <div className="hero-video-backdrop" aria-hidden="true">
            <iframe
              src={heroVideoSrc}
              title="Video background Padukuhan Ngalang"
              loading="eager"
              allow="autoplay; encrypted-media; picture-in-picture"
              referrerPolicy="strict-origin-when-cross-origin"
              tabIndex="-1"
            ></iframe>
          </div>
          <div className="hero-blob hero-blob-a" aria-hidden="true"></div>
          <div className="hero-blob hero-blob-b" aria-hidden="true"></div>
          <div className="hero-pattern" aria-hidden="true"></div>

          <div className="hero-inner">
            <Reveal className="hero-copy">
              <h1>
                Selamat Datang di <span className="hero-highlight">Padukuhan Ngalang</span>
              </h1>
              <p className="hero-subtitle">
                Portal informasi UMKM, acara tradisional, serta kegiatan masyarakt Padukuhan Ngalang dirancang sederhana, modern, dan mudah diakses siapa saja.
              </p>
              <a className="hero-video-link" href={heroVideoUrl} target="_blank" rel="noreferrer">
                Lihat video YouTube
              </a>
              <div className="hero-actions">
                <a className="btn btn-primary" href="#umkm">
                  Jelajahi UMKM <ArrowRight size={16} />
                </a>
                <a className="btn btn-ghost" href="#acara">
                  Lihat Acara
                </a>
              </div>
              <div className="hero-stats">
                <div className="hero-stat">
                  <strong>{umkmList.length}+</strong>
                  <span>UMKM Terdaftar</span>
                </div>
                <div className="hero-stat">
                  <strong>{acaraList.length}+</strong>
                  <span>Acara &amp; Tradisi</span>
                </div>
                <div className="hero-stat">
                  <strong>{beritaList.length}+</strong>
                  <span>Berita Terbit</span>
                </div>
              </div>
            </Reveal>

            <Reveal className="hero-visual" delay={0.15} y={40}>
              <div className="hero-photo-frame">
                <img src={heroImage} alt="Panorama pedesaan Dusun Ngalang" loading="eager" />
              </div>
              <motion.div
                className="hero-float-card hero-float-card-a"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <span className="hero-float-icon">
                  <MapPin size={16} />
                </span>
                <div>
                  <strong>Balai Desa Ngalang</strong>
                  <span>Gedangsari, Gunungkidul</span>
                </div>
              </motion.div>
              <motion.div
                className="hero-float-card hero-float-card-b"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
              >
                <span className="hero-float-icon">
                  <Store size={16} />
                </span>
                <div>
                  <strong>{umkmList.length}+ UMKM Aktif</strong>
                  <span>Kuliner, kerajinan &amp; lainnya</span>
                </div>
              </motion.div>
            </Reveal>
          </div>
        </section>

        {/* ── SECTIONS ── */}
        <SectionTentang />
        <SectionUmkm />
        <SectionAcara />
        <SectionBerita />
        <SectionGaleri />
        <SectionLokasi />

      </main>

      {/* ── FOOTER ── */}
      <footer className="site-footer">
        <Reveal className="footer-grid" y={20}>

          {/* Brand & deskripsi */}
          <div className="footer-brand">
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
          <div className="footer-col">
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
          <div className="footer-col">
            <h4>Kontak</h4>
            <div className="footer-contact">
              <p>Dusun Ngalang</p>
              <p>Kec. Gedangsari, Kab. Gunungkidul</p>
              <p>D.I. Yogyakarta, Indonesia</p>
              <p><a href="mailto:info@dusunngalang.id">info@dusunngalang.id</a></p>
            </div>
          </div>

          {/* Sosial media — belum tersedia, tombol non-aktif agar tidak mengarah ke tautan palsu */}
          <div className="footer-col">
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
            <p>© 2026 Dusun Ngalang. Hak cipta dilindungi.</p>
            <p>Dibangun untuk kemajuan dusun</p>
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
