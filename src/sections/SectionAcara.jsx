import { MapPin, Clock } from 'lucide-react'
import { daftarAcara } from '../data/siteData'
import { getDaftarAcara } from '../lib/sanityClient'
import { useSanityData } from '../hooks/useSanityData'
import Reveal, { RevealItem } from '../components/motion/Reveal'

export default function SectionAcara() {
  const items = useSanityData(getDaftarAcara, daftarAcara)

  return (
    <section className="acara-section" id="acara">
      <Reveal className="section-header">
        <span className="section-kicker">Agenda Dusun</span>
        <h2>Acara Mendatang</h2>
        <p>Jangan lewatkan acara dan kegiatan menarik di Dusun Ngalang</p>
      </Reveal>

      <Reveal className="acara-grid" y={20}>
        {items.map((acara, index) => {
          const date = parseTanggal(acara.tanggal)
          const countdown = getCountdownLabel(date)

          return (
            <RevealItem key={acara._id || acara.judul} delay={Math.min(index, 4) * 0.06}>
              <article className="acara-event-card">
                <div className="acara-date-block">
                  <span className="acara-date-day">{date ? date.getDate() : '–'}</span>
                  <span className="acara-date-month">
                    {date ? date.toLocaleDateString('id-ID', { month: 'short' }) : ''}
                  </span>
                </div>
                <div className="acara-event-body">
                  <div className="acara-event-header">
                    <span className="acara-badge">{acara.kategori}</span>
                    {countdown && <span className="acara-countdown"><Clock size={12} /> {countdown}</span>}
                  </div>
                  <h3>{acara.judul}</h3>
                  <div className="acara-meta">
                    <span><MapPin size={13} /> {acara.lokasi}</span>
                  </div>
                  <p className="acara-desc">{acara.deskripsi}</p>
                  <details className="acara-details">
                    <summary>Lihat kegiatan →</summary>
                    <ul>
                      {acara.kegiatan.map((k) => (
                        <li key={k}>{k}</li>
                      ))}
                    </ul>
                  </details>
                </div>
              </article>
            </RevealItem>
          )
        })}
      </Reveal>
    </section>
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
