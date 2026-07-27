import { useRef, useMemo } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight, MapPin, Store, Leaf as LeafIcon, PlayCircle } from 'lucide-react'
import Reveal from '../components/motion/Reveal'
import CountUp from '../components/motion/CountUp'
import MagneticButton from '../components/motion/MagneticButton'
import { useSanityData } from '../hooks/useSanityData'
import { getDaftarUmkm, getDaftarAcara, getDaftarBerita } from '../lib/sanityClient'
import { daftarUmkm, daftarAcara, daftarBerita } from '../data/siteData'

const heroImage =
  'https://images.unsplash.com/photo-1566622246836-12802785656a?auto=format&fit=crop&w=1400&q=80'

const heroVideoUrl = 'https://youtu.be/kcyMei5cNig?si=dirwqpA-YI4yFD-f'
const heroVideoId = 'kcyMei5cNig'
const heroVideoSrc = `https://www.youtube-nocookie.com/embed/${heroVideoId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${heroVideoId}&playsinline=1&rel=0&modestbranding=1&iv_load_policy=3&disablekb=1&fs=0`

// Posisi & timing acak (tapi stabil per render) untuk partikel cahaya dan daun jatuh —
// dibuat sekali lewat useMemo supaya tidak reshuffle setiap re-render.
function useAtmosphereSeeds(count, seedBase) {
  return useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        left: `${((i * 37 + seedBase) % 100)}%`,
        delay: `${(i * 0.9) % 6}s`,
        duration: `${8 + ((i * 5) % 10)}s`,
        scale: 0.6 + ((i * 13) % 6) / 10,
      })),
    [count, seedBase]
  )
}

export default function SectionHero() {
  const umkmList = useSanityData(getDaftarUmkm, daftarUmkm)
  const acaraList = useSanityData(getDaftarAcara, daftarAcara)
  const beritaList = useSanityData(getDaftarBerita, daftarBerita)

  const sectionRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] })
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '18%'])
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '10%'])
  const contentOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.2])

  const particles = useAtmosphereSeeds(16, 3)
  const leaves = useAtmosphereSeeds(6, 47)

  return (
    <section className="hero-section" id="beranda" style={{ '--hero-image': `url(${heroImage})` }} ref={sectionRef}>
      <motion.div className="hero-parallax-layer" style={{ y: bgY }}>
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
      </motion.div>

      <div className="hero-blob hero-blob-a" aria-hidden="true"></div>
      <div className="hero-blob hero-blob-b" aria-hidden="true"></div>
      <div className="hero-pattern" aria-hidden="true"></div>

      {/* ── Atmosfer sinematik: sunrays, awan, partikel cahaya, daun jatuh ── */}
      <div className="hero-sunrays" aria-hidden="true">
        <span className="hero-sunray hero-sunray-a"></span>
        <span className="hero-sunray hero-sunray-b"></span>
        <span className="hero-sunray hero-sunray-c"></span>
      </div>
      <div className="hero-clouds" aria-hidden="true">
        <span className="hero-cloud hero-cloud-a"></span>
        <span className="hero-cloud hero-cloud-b"></span>
        <span className="hero-cloud hero-cloud-c"></span>
      </div>
      <div className="hero-particles" aria-hidden="true">
        {particles.map((p, i) => (
          <span
            key={i}
            className="hero-particle"
            style={{ left: p.left, animationDelay: p.delay, animationDuration: p.duration, '--scale': p.scale }}
          />
        ))}
      </div>
      <div className="hero-leaves" aria-hidden="true">
        {leaves.map((l, i) => (
          <LeafIcon
            key={i}
            className="hero-leaf"
            size={16 + (i % 3) * 4}
            style={{ left: l.left, animationDelay: l.delay, animationDuration: l.duration }}
          />
        ))}
      </div>

      <motion.div className="hero-inner" style={{ y: contentY, opacity: contentOpacity }}>
        <Reveal className="hero-copy">
          <h1>
            Selamat Datang di <span className="hero-highlight">Padukuhan Ngalang</span>
          </h1>
          <p className="hero-subtitle">
            Portal informasi budaya, UMKM, wisata, dan kehidupan masyarakat Padukuhan
            Ngalang — dirancang sederhana, modern, dan mudah diakses siapa saja.
          </p>
          <a className="hero-video-link" href={heroVideoUrl} target="_blank" rel="noreferrer">
            <PlayCircle size={16} /> Lihat video YouTube
          </a>
          <div className="hero-actions">
            <MagneticButton as={motion.a} className="btn btn-primary" href="#tentang-dusun" whileTap={{ scale: 0.96 }}>
              Jelajahi Desa <ArrowRight size={16} />
            </MagneticButton>
            <MagneticButton as={motion.a} className="btn btn-ghost" href="#acara" whileTap={{ scale: 0.96 }}>
              Lihat Acara
            </MagneticButton>
          </div>
          <div className="hero-stats">
            <div className="hero-stat">
              <strong><CountUp value={umkmList.length} suffix="+" /></strong>
              <span>UMKM Terdaftar</span>
            </div>
            <div className="hero-stat">
              <strong><CountUp value={acaraList.length} suffix="+" /></strong>
              <span>Acara &amp; Tradisi</span>
            </div>
            <div className="hero-stat">
              <strong><CountUp value={beritaList.length} suffix="+" /></strong>
              <span>Berita Terbit</span>
            </div>
          </div>
        </Reveal>

        <Reveal className="hero-visual" delay={0.15} y={40}>
          <div className="hero-photo-frame">
            <img src={heroImage} alt="Panorama pedesaan Dusun Ngalang" loading="eager" />
          </div>
          <motion.div
            className="hero-float-card hero-float-card-a glass-panel"
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
            className="hero-float-card hero-float-card-b glass-panel"
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
      </motion.div>

      <motion.div
        className="hero-scroll-cue"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        aria-hidden="true"
      >
        <span></span>
      </motion.div>
    </section>
  )
}
