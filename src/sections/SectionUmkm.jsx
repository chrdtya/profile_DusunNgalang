import { useState } from 'react'
import { Star, MapPin, ExternalLink } from 'lucide-react'
import { daftarUmkm } from '../data/siteData'
import { getDaftarUmkm, urlFor } from '../lib/sanityClient'
import { useSanityData } from '../hooks/useSanityData'
import Reveal, { RevealItem } from '../components/motion/Reveal'
import Modal from '../components/Modal'

function Rating({ value }) {
  if (!value) return null
  const rounded = Math.round(value)
  return (
    <div className="umkm-rating" aria-label={`Rating ${value} dari 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={13} className={i < rounded ? 'star filled' : 'star'} />
      ))}
      <span>{value}</span>
    </div>
  )
}

export default function SectionUmkm() {
  const items = useSanityData(getDaftarUmkm, daftarUmkm)
  const [detail, setDetail] = useState(null)

  return (
    <section className="umkm-section" id="umkm">
      <Reveal className="section-header">
        <span className="section-kicker">Ekonomi Lokal</span>
        <h2>UMKM Dusun Ngalang</h2>
        <p>Kenali dan dukung usaha UMKM milik warga Dusun Ngalang.</p>
      </Reveal>

      <Reveal className="umkm-grid" y={20}>
        {items.map((item, index) => {
          const imageSrc =
            typeof item.image === 'string' ? item.image : item.image ? urlFor(item.image) : item.imageUrl
          const mapsHref = item.address
            ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.address)}`
            : null

          return (
            <RevealItem key={item._id || item.name} delay={Math.min(index, 4) * 0.06}>
              <article className="umkm-card">
                <div className="umkm-image-wrap">
                  {imageSrc && (
                    <img src={imageSrc} alt={item.name} loading="lazy" className="umkm-image" />
                  )}
                  <div className="umkm-image-overlay" aria-hidden="true"></div>
                  <span className="umkm-category umkm-category-floating">{item.category}</span>
                </div>
                <div className="umkm-body">
                  <div className="umkm-head">
                    <h3>{item.name}</h3>
                    <Rating value={item.rating} />
                  </div>
                  <p>{item.description}</p>
                  <p className="umkm-meta">
                    <MapPin size={13} /> {item.address}
                  </p>
                  <div className="umkm-actions">
                    <button className="umkm-button umkm-button-ghost" onClick={() => setDetail(item)}>
                      Detail
                    </button>
                    {mapsHref && (
                      <a className="umkm-button" href={mapsHref} target="_blank" rel="noreferrer">
                        Lihat Lokasi <ExternalLink size={13} />
                      </a>
                    )}
                  </div>
                </div>
              </article>
            </RevealItem>
          )
        })}
      </Reveal>

      <Modal open={!!detail} onClose={() => setDetail(null)} labelledBy="umkm-detail-title">
        {detail && (
          <div className="umkm-detail">
            {(() => {
              const imageSrc =
                typeof detail.image === 'string'
                  ? detail.image
                  : detail.image
                  ? urlFor(detail.image)
                  : detail.imageUrl
              return imageSrc ? (
                <img src={imageSrc} alt={detail.name} className="umkm-detail-image" />
              ) : null
            })()}
            <span className="umkm-category">{detail.category}</span>
            <h3 id="umkm-detail-title">{detail.name}</h3>
            <Rating value={detail.rating} />
            <p className="umkm-detail-desc">{detail.description}</p>
            <p className="umkm-meta">
              <MapPin size={14} /> {detail.address}
            </p>
            {detail.address && (
              <a
                className="btn btn-primary umkm-detail-link"
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(detail.address)}`}
                target="_blank"
                rel="noreferrer"
              >
                Lihat Lokasi <ExternalLink size={15} />
              </a>
            )}
          </div>
        )}
      </Modal>
    </section>
  )
}
