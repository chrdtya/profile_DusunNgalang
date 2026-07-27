import { useMemo, useState } from 'react'
import { MapPin, Clock, ArrowUpRight } from 'lucide-react'
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

  return (
    <section className="acara-section" id="acara">
      <Reveal className="section-header">
        <span className="section-kicker">Agenda Dusun</span>
        <h2>Acara Mendatang</h2>
        <p>Jangan lewatkan acara dan kegiatan menarik di Dusun Ngalang</p>
      </Reveal>

      {sorted.length > 0 && (
        <Reveal className="acara-grid" y={20}>
          {sorted.map((acara) => {
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
