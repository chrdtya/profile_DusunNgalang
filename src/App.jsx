import { useState, useEffect } from 'react'
import './App.css'
import SectionTentang from './sections/SectionTentang'
import SectionUmkm from './sections/SectionUmkm'
import SectionAcara from './sections/SectionAcara'
import SectionBerita from './sections/SectionBerita'
import SectionGaleri from './sections/SectionGaleri'
import SectionLokasi from './sections/SectionLokasi'

// Daftar nav links + id section yang terkait
const navLinks = [
  { label: 'Beranda', href: '#beranda' },
  { label: 'UMKM', href: '#umkm' },
  { label: 'Acara', href: '#acara' },
  { label: 'Lokasi', href: '#lokasi' },
  { label: 'Berita', href: '#berita' },
  { label: 'Galeri', href: '#galeri' },
  { label: 'Tentang', href: '#tentang-dusun' },
]

function App() {
  const [activeHash, setActiveHash] = useState('#beranda')

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

  return (
    <div className="page-shell">

      {/* ── NAVBAR ── */}
      <header className="topbar">
        <div className="brand-wrap">
          <div className="brand-mark" aria-hidden="true">DN</div>
          <p className="brand-name">Dusun Ngalang</p>
        </div>
        <nav aria-label="Menu utama">
          <ul className="menu-list">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  className={`menu-item${activeHash === link.href ? ' active' : ''}`}
                  href={link.href}
                  onClick={() => setActiveHash(link.href)}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <main>

        {/* ── HERO ── */}
        <section className="hero-section" id="beranda">
          <div className="hero-overlay"></div>
          <div className="hero-content">
            <h1>Selamat Datang di Dusun Ngalang</h1>
            <p className="hero-subtitle">
              Portal informasi UMKM, acara tradisional, serta kegiatan masyarakat
              yang dirancang sederhana dan mudah diakses.
            </p>
            <div className="hero-actions">
              <a className="btn btn-primary" href="#umkm">Jelajahi UMKM</a>
              <a className="btn btn-ghost" href="#acara">Lihat Acara</a>
            </div>
          </div>
        </section>

        {/* ── SECTIONS ── */}
        <SectionTentang />
        <SectionUmkm />
        <SectionAcara />
        <SectionBerita />
        <SectionGaleri />
        <SectionLokasi />

        {/* ── CTA ── */}
        <section className="cta-section">
          <div className="cta-box">
            <div className="cta-text">
              <h2>Daftarkan UMKM Anda</h2>
              <p>
                Miliki usaha di Dusun Ngalang? Daftarkan dan promosikan produk atau
                layanan Anda kepada masyarakat dan pengunjung.
              </p>
            </div>
            <div className="cta-actions">
              <a className="btn btn-primary" href="#umkm">Daftar Sekarang</a>
              <a className="btn btn-ghost" href="#tentang-dusun">Pelajari Lebih</a>
            </div>
          </div>
        </section>

      </main>

      {/* ── FOOTER ── */}
      <footer className="site-footer">
        <div className="footer-grid">

          {/* Brand & deskripsi */}
          <div className="footer-brand">
            <div className="brand-wrap">
              <div className="brand-mark" aria-hidden="true">DN</div>
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
              <li><a href="#beranda">Beranda</a></li>
              <li><a href="#umkm">UMKM</a></li>
              <li><a href="#acara">Acara</a></li>
              <li><a href="#lokasi">Lokasi</a></li>
              <li><a href="#berita">Berita</a></li>
              <li><a href="#galeri">Galeri</a></li>
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

        </div>
        <div className="footer-bottom">
          <p>© 2026 Dusun Ngalang. Hak cipta dilindungi.</p>
          <p>Dibangun untuk kemajuan dusun</p>
        </div>
      </footer>

    </div>
  )
}

export default App
