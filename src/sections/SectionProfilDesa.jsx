import { MapPinned, Ruler, Users, LayoutGrid, Signpost, Mountain, Thermometer } from 'lucide-react'
import { profilDesaStats, daftarPadukuhan } from '../data/siteData'
import Reveal, { RevealItem } from '../components/motion/Reveal'
import CountUp from '../components/motion/CountUp'

const statIcons = {
  'Luas Wilayah': Ruler,
  'Jumlah Penduduk': Users,
  Padukuhan: LayoutGrid,
  'Jarak ke Kabupaten': Signpost,
}

// Profil Kalurahan Ngalang — Padukuhan Ngalang adalah satu dari 14 padukuhan di kalurahan ini.
// Ditampilkan tepat setelah hero supaya pengunjung langsung dapat konteks wilayah, bukan
// terkubur di bagian paling bawah halaman.
export default function SectionProfilDesa() {
  return (
    <section className="profil-desa-section">
      <span className="profil-desa-blob profil-desa-blob-a" aria-hidden="true"></span>
      <span className="profil-desa-blob profil-desa-blob-b" aria-hidden="true"></span>

      <Reveal className="profil-desa-panel" y={22}>
        <div className="profil-desa-copy">
          <span className="profil-desa-kicker"><MapPinned size={14} /> Konteks Wilayah</span>
          <h3>Padukuhan Ngalang, bagian dari Kalurahan Ngalang</h3>
          <p>
            Padukuhan Ngalang adalah salah satu dari 14 padukuhan yang membentuk
            Kalurahan Ngalang, Kapanewon Gedangsari, Kabupaten Gunungkidul, DIY —
            kalurahan dengan jumlah penduduk terbanyak di Gedangsari. Wilayahnya
            berada di ketinggian rata-rata 100 mdpl dengan suhu 27–34°C, dikelilingi
            perbukitan karst dan lahan pertanian yang menjadi ciri khas Gunungkidul.
          </p>
          <div className="profil-desa-tags">
            <span className="profil-desa-tag"><Mountain size={14} /> 100 mdpl</span>
            <span className="profil-desa-tag"><Thermometer size={14} /> Suhu 27–34°C</span>
          </div>
        </div>

        <div className="profil-desa-stats">
          {profilDesaStats.map((stat, index) => {
            const Icon = statIcons[stat.label] ?? MapPinned
            return (
              <RevealItem key={stat.label} delay={index * 0.08} className="profil-desa-stat">
                <span className="profil-desa-stat-icon">
                  <Icon size={18} strokeWidth={2} />
                </span>
                <strong>
                  <CountUp value={stat.value} suffix={stat.suffix} />
                </strong>
                <span className="profil-desa-stat-label">{stat.label}</span>
              </RevealItem>
            )
          })}
        </div>

        <div className="profil-desa-chips">
          <span className="profil-desa-chips-label">14 padukuhan di kalurahan ini</span>
          <div className="padukuhan-chip-list">
            {daftarPadukuhan.map((nama) => (
              <span key={nama} className={`padukuhan-chip${nama === 'Ngalang' ? ' active' : ''}`}>
                {nama}
              </span>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  )
}
