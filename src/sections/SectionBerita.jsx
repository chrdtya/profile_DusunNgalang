import { useState } from 'react'
import { Calendar, User, Clock, ArrowUpRight } from 'lucide-react'
import { daftarBerita } from '../data/siteData'
import { getDaftarBerita, urlFor } from '../lib/sanityClient'
import { useSanityData } from '../hooks/useSanityData'
import Reveal, { RevealItem } from '../components/motion/Reveal'
import Modal from '../components/Modal'

// Foto tematik per kategori — dipakai saat berita (khususnya yang diinput lewat admin/Sanity)
// belum punya gambar sendiri, supaya kartu tidak tampil kosong.
const kategoriImageFallback = {
  Kegiatan: 'https://images.unsplash.com/photo-1616680214084-22670de1bc82?auto=format&fit=crop&w=1200&q=80',
  UMKM: 'https://images.unsplash.com/photo-1631010231130-5c7828d9a3a7?auto=format&fit=crop&w=1200&q=80',
  Pengumuman: 'https://images.unsplash.com/photo-1566622246836-12802785656a?auto=format&fit=crop&w=1200&q=80',
}

function resolveImage(item) {
  return (
    (typeof item.image === 'string' ? item.image : item.image ? urlFor(item.image) : item.imageUrl) ||
    kategoriImageFallback[item.kategori]
  )
}

export default function SectionBerita() {
  const items = useSanityData(getDaftarBerita, daftarBerita)
  const [detail, setDetail] = useState(null)
  const [featured, ...rest] = items

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

      {featured && (
        <Reveal className="berita-featured" y={22}>
          <div className="berita-featured-media">
            <img src={resolveImage(featured)} alt={featured.judul || featured.title} loading="lazy" />
            {featured.kategori && <span className="berita-badge">{featured.kategori}</span>}
          </div>
          <div className="berita-featured-body">
            <div className="berita-meta-row">
              <span><Calendar size={12} /> {formatTanggal(featured.tanggalPublikasi || featured.date)}</span>
              <span><Clock size={12} /> {readingTime(featured.konten || featured.excerpt)} min baca</span>
            </div>
            <h3>{featured.judul || featured.title}</h3>
            <p>{featured.konten || featured.excerpt}</p>
            <div className="berita-footer-row">
              {featured.penulis && (
                <span className="berita-author"><User size={12} /> {featured.penulis}</span>
              )}
              <button
                type="button"
                className="service-link service-link-btn berita-featured-link"
                onClick={() => setDetail(featured)}
              >
                Baca selengkapnya <ArrowUpRight size={15} />
              </button>
            </div>
          </div>
        </Reveal>
      )}

      {rest.length > 0 && (
        <Reveal className="berita-list" y={20}>
          {rest.map((item, index) => {
            const content = item.konten || item.excerpt || ''
            const imageSrc = resolveImage(item)

            return (
              <RevealItem key={item._id || item.title} delay={Math.min(index, 4) * 0.06}>
                <article className="berita-row">
                  <div className="berita-row-media">
                    {imageSrc ? (
                      <img src={imageSrc} alt={item.judul || item.title} loading="lazy" />
                    ) : (
                      <div className="berita-image-fallback" aria-hidden="true"></div>
                    )}
                  </div>
                  <div className="berita-row-body">
                    <div className="berita-row-top">
                      {item.kategori && <span className="berita-row-badge">{item.kategori}</span>}
                      <span className="berita-meta-row">
                        <span><Calendar size={12} /> {formatTanggal(item.tanggalPublikasi || item.date)}</span>
                        <span><Clock size={12} /> {readingTime(content)} min baca</span>
                      </span>
                    </div>
                    <h3>{item.judul || item.title}</h3>
                    <p>{content}</p>
                    <button type="button" className="berita-row-link" onClick={() => setDetail(item)}>
                      Baca selengkapnya <ArrowUpRight size={14} />
                    </button>
                  </div>
                </article>
              </RevealItem>
            )
          })}
        </Reveal>
      )}

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
