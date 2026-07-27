import { Compass, ExternalLink, Mountain, Thermometer, Ruler, Users, Signpost, Landmark } from 'lucide-react'
import { dataGeografis } from '../data/siteData'
import Reveal, { RevealItem } from '../components/motion/Reveal'
import CountUp from '../components/motion/CountUp'

const mapsLink = 'https://maps.app.goo.gl/U3zdYyREFooRqvYNA?g_st=ic'
const mapsEmbedLink =
  'https://maps.google.com/maps?q=Balai%20Desa%20Ngalang%2C%20Ngalang%2C%20Gedangsari%2C%20Gunungkidul%2C%20Daerah%20Istimewa%20Yogyakarta&t=&z=15&ie=UTF8&iwloc=&output=embed'

// Infografis geografis — angka bersumber dari profil administrasi Kecamatan Gedangsari (BPS/profil desa).
const geoInfografis = [
  { icon: Mountain, label: 'Ketinggian', value: 100, suffix: ' mdpl' },
  { icon: Thermometer, label: 'Suhu Udara', display: '27–34°C' },
  { icon: Ruler, label: 'Luas Wilayah', value: 14.82, suffix: ' km²' },
  { icon: Users, label: 'Jumlah Penduduk', value: 8969, suffix: '' },
  { icon: Signpost, label: 'Jarak ke Kabupaten', value: 17, suffix: ' km' },
  { icon: Landmark, label: 'Wilayah Administratif', display: 'Kec. Gedangsari' },
]

export default function SectionLokasi() {
  return (
    <section className="geo-demo" id="lokasi">
      <Reveal className="section-header geo-head">
        <span className="section-kicker">Kunjungi Kami</span>
        <h2>Data Geografis dan Lokasi</h2>
        <p>
          Ringkasan profil wilayah Dusun Ngalang untuk memudahkan perencanaan
          kunjungan dan orientasi lokasi bagi pengunjung.
        </p>
      </Reveal>

      <Reveal className="geo-infographic" y={20}>
        {geoInfografis.map((stat, index) => {
          const Icon = stat.icon
          return (
            <RevealItem key={stat.label} delay={index * 0.06} className="geo-infographic-tile">
              <span className="geo-infographic-icon">
                <Icon size={20} strokeWidth={2} />
              </span>
              <strong>
                {stat.display ?? <CountUp value={stat.value} suffix={stat.suffix} />}
              </strong>
              <span className="geo-infographic-label">{stat.label}</span>
            </RevealItem>
          )
        })}
      </Reveal>

      <div className="geo-layout">
        <Reveal className="info-box" y={20}>
          <h3><Compass size={18} /> Profil Geografis</h3>
          <ul className="detail-list">
            {dataGeografis.map((item) => (
              <li key={item.label}>
                <p className="detail-label">{item.label}</p>
                <p className="detail-value">{item.value}</p>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal className="map-box" y={20} delay={0.1}>
          <div className="map-head">
            <h3>Peta Lokasi Dusun Ngalang</h3>
            <a
              className="btn btn-primary map-link"
              href={mapsLink}
              target="_blank"
              rel="noreferrer"
            >
              Buka Rute di Google Maps <ExternalLink size={14} />
            </a>
          </div>
          <p>
            Gunakan titik Balai Desa Ngalang sebagai orientasi awal kunjungan.
            Setelah peta terbuka, aktifkan navigasi untuk mendapatkan rute tercepat
            dari lokasi Anda.
          </p>
          <div className="map-frame-wrap">
            <iframe
              title="Peta Balai Desa Ngalang"
              src={mapsEmbedLink}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            ></iframe>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
