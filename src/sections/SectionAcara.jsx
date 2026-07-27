import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Clock, ListChecks, ArrowUpRight, CalendarDays } from 'lucide-react'
import { daftarAcara } from '../data/siteData'
import { getDaftarAcara, urlFor } from '../lib/sanityClient'
import { useSanityData } from '../hooks/useSanityData'
import Reveal from '../components/motion/Reveal'
import Modal from '../components/Modal'

// Foto tematik per kategori — dipakai saat acara (khususnya yang diinput lewat admin/Sanity)
// belum punya gambar sendiri, supaya kartu tidak tampil kosong.
const kategoriImageFallback = {
  Tradisi: 'https://images.unsplash.com/photo-1546186479-607640447f9a?auto=format&fit=crop&w=1200&q=80',
  Sosial: 'https://images.unsplash.com/photo-1616680214084-22670de1bc82?auto=format&fit=crop&w=1200&q=80',
  Nasional: 'https://images.unsplash.com/photo-1533805994737-558461dcb28e?auto=format&fit=crop&w=1200&q=80',
  Budaya: 'https://images.unsplash.com/photo-1542897643-cfccd88c7127?auto=format&fit=crop&w=1200&q=80',
  Olahraga: 'https://images.unsplash.com/photo-1692366850335-9415ee4724c8?auto=format&fit=crop&w=1200&q=80',
}

function resolveImage(acara) {
  return (
    (typeof acara.image === 'string' ? acara.image : acara.image ? urlFor(acara.image) : acara.imageUrl) ||
    kategoriImageFallback[acara.kategori]
  )
}

function parseTanggal(tanggal) {
  const date = new Date(tanggal)
  return Number.isNaN(date.getTime()) ? null : date
}

function getCountdownLabel(date) {
  if (!date) return null
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const target = new Date(date)
  target.setHours(0, 0, 0, 0)
  const diffDays = Math.round((target - today) / (1000 * 60 * 60 * 24))

  if (diffDays > 1) return `${diffDays} hari lagi`
  if (diffDays === 1) return 'Besok'
  if (diffDays === 0) return 'Hari ini'
  return null
}

// Countdown presisi (hari/jam/menit/detik) khusus acara unggulan — di-update tiap detik.
function useCountdown(targetDate) {
  const [remaining, setRemaining] = useState(null)

  useEffect(() => {
    if (!targetDate) return
    const tick = () => {
      const diff = targetDate.getTime() - Date.now()
      if (diff <= 0) {
        setRemaining({ days: 0, hours: 0, minutes: 0, seconds: 0 })
        return
      }
      setRemaining({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff / 3600000) % 24),
        minutes: Math.floor((diff / 60000) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      })
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [targetDate])

  return remaining
}

export default function SectionAcara() {
  const items = useSanityData(getDaftarAcara, daftarAcara)
  const [detail, setDetail] = useState(null)

  const sorted = useMemo(() => {
    return [...items].sort((a, b) => {
      const da = parseTanggal(a.tanggal)
      const db = parseTanggal(b.tanggal)
      if (!da) return 1
      if (!db) return -1
      return da - db
    })
  }, [items])

  const today = useMemo(() => {
    const d = new Date()
    d.setHours(0, 0, 0, 0)
    return d
  }, [])

  const featured = useMemo(() => {
    return sorted.find((acara) => {
      const d = parseTanggal(acara.tanggal)
      return d && d >= today
    }) || sorted[0]
  }, [sorted, today])

  const others = sorted.filter((acara) => acara !== featured)
  // Memoized by the raw date string, bukan objek Date, supaya referensinya stabil antar
  // render — Date baru di setiap render akan membuat dependency useEffect di useCountdown
  // berubah terus dan memicu infinite update loop.
  const featuredDate = useMemo(
    () => (featured ? parseTanggal(featured.tanggal) : null),
    [featured]
  )
  const countdown = useCountdown(featuredDate)

  return (
    <section className="acara-section" id="acara">
      <Reveal className="section-header">
        <span className="section-kicker">Agenda Dusun</span>
        <h2>Acara Mendatang</h2>
        <p>Jangan lewatkan acara dan kegiatan menarik di Dusun Ngalang</p>
      </Reveal>

      {featured && (
        <Reveal className="acara-featured" y={24}>
          <div className="acara-featured-media">
            <img src={resolveImage(featured)} alt={featured.judul} loading="lazy" />
            <div className="acara-featured-overlay" aria-hidden="true"></div>
            <span className="acara-badge acara-featured-badge">{featured.kategori}</span>
          </div>
          <div className="acara-featured-body">
            <span className="acara-featured-kicker">
              <CalendarDays size={14} /> Acara Unggulan
            </span>
            <h3>{featured.judul}</h3>
            <div className="acara-meta">
              <span><MapPin size={14} /> {featured.lokasi}</span>
              <span><Clock size={14} /> {featured.tanggal}</span>
            </div>
            <p className="acara-desc acara-featured-desc">{featured.deskripsi}</p>

            {countdown && (
              <div className="acara-countdown-timer">
                {[
                  { label: 'Hari', value: countdown.days },
                  { label: 'Jam', value: countdown.hours },
                  { label: 'Menit', value: countdown.minutes },
                  { label: 'Detik', value: countdown.seconds },
                ].map((unit) => (
                  <div key={unit.label} className="acara-countdown-unit">
                    <motion.strong
                      key={unit.value}
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {String(unit.value).padStart(2, '0')}
                    </motion.strong>
                    <span>{unit.label}</span>
                  </div>
                ))}
              </div>
            )}

            <button type="button" className="acara-detail-btn acara-featured-btn" onClick={() => setDetail(featured)}>
              <ListChecks size={15} /> Lihat rangkaian kegiatan
              <ArrowUpRight size={14} />
            </button>
          </div>
        </Reveal>
      )}

      {others.length > 0 && (
        <Reveal className="acara-grid" y={20}>
          {others.map((acara) => {
            const date = parseTanggal(acara.tanggal)
            const countdownLabel = getCountdownLabel(date)
            const imageSrc = resolveImage(acara)
            return (
              <article className="acara-event-card" key={acara._id || acara.judul}>
                <div className="acara-image-wrap">
                  {imageSrc && <img src={imageSrc} alt={acara.judul} loading="lazy" className="acara-image" />}
                  <div className="acara-image-overlay" aria-hidden="true"></div>
                  <div className="acara-date-block">
                    <span className="acara-date-day">{date ? date.getDate() : '–'}</span>
                    <span className="acara-date-month">
                      {date ? date.toLocaleDateString('id-ID', { month: 'short' }) : ''}
                    </span>
                  </div>
                  <span className="acara-badge">{acara.kategori}</span>
                  {countdownLabel && (
                    <span className="acara-countdown">
                      <Clock size={12} /> {countdownLabel}
                    </span>
                  )}
                </div>
                <div className="acara-event-body">
                  <h3>{acara.judul}</h3>
                  <div className="acara-meta">
                    <span><MapPin size={12} /> {acara.lokasi}</span>
                  </div>
                  <p className="acara-desc">{acara.deskripsi}</p>
                  <button type="button" className="acara-detail-btn" onClick={() => setDetail(acara)}>
                    Lihat detail <ArrowUpRight size={14} />
                  </button>
                </div>
              </article>
            )
          })}
        </Reveal>
      )}

      <Modal open={!!detail} onClose={() => setDetail(null)} labelledBy="acara-detail-title">
        {detail && (
          <div className="acara-detail">
            <span className="acara-badge">{detail.kategori}</span>
            <h3 id="acara-detail-title">{detail.judul}</h3>
            <div className="acara-meta">
              <span>
                <MapPin size={14} /> {detail.lokasi}
              </span>
              <span>{detail.tanggal}</span>
            </div>
            <p className="acara-detail-desc">{detail.deskripsi}</p>
            <p className="acara-detail-label">Rangkaian kegiatan</p>
            <ul className="acara-detail-list">
              {detail.kegiatan.map((k) => (
                <li key={k}>{k}</li>
              ))}
            </ul>
          </div>
        )}
      </Modal>
    </section>
  )
}
