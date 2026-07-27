import { Compass, ExternalLink } from 'lucide-react'
import { dataGeografis } from '../data/siteData'
import Reveal from '../components/motion/Reveal'

const mapsLink = 'https://maps.app.goo.gl/U3zdYyREFooRqvYNA?g_st=ic'
const mapsEmbedLink =
  'https://maps.google.com/maps?q=Balai%20Desa%20Ngalang%2C%20Ngalang%2C%20Gedangsari%2C%20Gunungkidul%2C%20Daerah%20Istimewa%20Yogyakarta&t=&z=15&ie=UTF8&iwloc=&output=embed'

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
