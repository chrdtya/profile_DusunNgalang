import { useState } from 'react'
import { Calendar, User, Clock } from 'lucide-react'
import { daftarBerita } from '../data/siteData'
import { getDaftarBerita, urlFor } from '../lib/sanityClient'
import { useSanityData } from '../hooks/useSanityData'
import Reveal, { RevealItem } from '../components/motion/Reveal'
import Modal from '../components/Modal'

export default function SectionBerita() {
  const items = useSanityData(getDaftarBerita, daftarBerita)
  const [detail, setDetail] = useState(null)

  return (
    <section className="berita-section" id="berita">
      <Reveal className="section-header">
        <span className="section-kicker">Kabar Terbaru</span>
        <h2>Berita Dusun</h2>
        <p>
          Update kegiatan masyarakat, program desa, serta informasi terbaru
          untuk warga dan pengunjung Dusun Ngalang.
        </p>
      </Reveal>

      <Reveal className="berita-grid" y={20}>
        {items.map((item, index) => {
          const content = item.konten || item.excerpt || ''
          const imageSrc = item.image ? urlFor(item.image) : item.imageUrl

          return (
            <RevealItem key={item._id || item.title} delay={Math.min(index, 4) * 0.06}>
              <article className="berita-card">
                <div className="berita-image-wrap">
                  {imageSrc ? (
                    <img src={imageSrc} alt={item.judul || item.title} loading="lazy" />
                  ) : (
                    <div className="berita-image-fallback" aria-hidden="true"></div>
                  )}
                  {item.kategori && <span className="berita-badge">{item.kategori}</span>}
                </div>
                <div className="berita-body">
                  <div className="berita-meta-row">
                    <span><Calendar size={12} /> {formatTanggal(item.tanggalPublikasi || item.date)}</span>
                    <span><Clock size={12} /> {readingTime(content)} min baca</span>
                  </div>
                  <h3>{item.judul || item.title}</h3>
                  <p>{content}</p>
                  <div className="berita-footer-row">
                    {(item.penulis) && (
                      <span className="berita-author"><User size={12} /> {item.penulis}</span>
                    )}
                    <button type="button" className="service-link service-link-btn" onClick={() => setDetail(item)}>
                      Baca selengkapnya
                    </button>
                  </div>
                </div>
              </article>
            </RevealItem>
          )
        })}
      </Reveal>

      <Modal open={!!detail} onClose={() => setDetail(null)} labelledBy="berita-detail-title">
        {detail && (
          <div className="berita-detail">
            {detail.kategori && <span className="berita-badge berita-badge-static">{detail.kategori}</span>}
            <h3 id="berita-detail-title">{detail.judul || detail.title}</h3>
            <div className="berita-meta-row">
              <span><Calendar size={12} /> {formatTanggal(detail.tanggalPublikasi || detail.date)}</span>
              {detail.penulis && <span><User size={12} /> {detail.penulis}</span>}
            </div>
            <p className="berita-detail-content">{detail.konten || detail.excerpt}</p>
          </div>
        )}
      </Modal>
    </section>
  )
}

function formatTanggal(tanggal) {
  const date = new Date(tanggal)
  return Number.isNaN(date.getTime()) ? tanggal : date.toLocaleDateString('id-ID')
}

function readingTime(text = '') {
  const words = text.trim().split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.round(words / 200))
}
