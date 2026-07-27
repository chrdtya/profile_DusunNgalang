import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Star, MapPin, ExternalLink, Search, Heart } from 'lucide-react'
import { daftarUmkm } from '../data/siteData'
import { getDaftarUmkm, urlFor } from '../lib/sanityClient'
import { useSanityData } from '../hooks/useSanityData'
import Reveal from '../components/motion/Reveal'
import Modal from '../components/Modal'

// Foto tematik per kategori — dipakai saat UMKM (khususnya yang diinput lewat admin/Sanity)
// belum punya gambar sendiri, supaya kartu tidak tampil kosong.
const kategoriImageFallback = {
  Kuliner: 'https://images.unsplash.com/photo-1569058242252-623df46b5025?auto=format&fit=crop&w=1200&q=80',
  Kerajinan: 'https://images.unsplash.com/photo-1534953342533-7711c98712be?auto=format&fit=crop&w=1200&q=80',
  Fashion: 'https://images.unsplash.com/photo-1604973104381-870c92f10343?auto=format&fit=crop&w=1200&q=80',
  Pertanian: 'https://images.unsplash.com/photo-1636057423765-c766099ef09d?auto=format&fit=crop&w=1200&q=80',
  Peternakan: 'https://images.unsplash.com/photo-1614658784535-d94113d46cf4?auto=format&fit=crop&w=1200&q=80',
  Jasa: 'https://images.unsplash.com/photo-1518245085299-f3c2a6148796?auto=format&fit=crop&w=1200&q=80',
}

const FAVORITES_KEY = 'ngalang-umkm-favorites'

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

function resolveImage(source) {
  return typeof source.image === 'string'
    ? source.image
    : source.image
    ? urlFor(source.image)
    : source.imageUrl || kategoriImageFallback[source.category]
}

export default function SectionUmkm() {
  const items = useSanityData(getDaftarUmkm, daftarUmkm)
  const [detail, setDetail] = useState(null)
  const [query, setQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('Semua')
  const [favorites, setFavorites] = useState(() => {
    try {
      return new Set(JSON.parse(localStorage.getItem(FAVORITES_KEY) || '[]'))
    } catch {
      return new Set()
    }
  })

  useEffect(() => {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify([...favorites]))
  }, [favorites])

  const toggleFavorite = (id) => {
    setFavorites((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const categories = useMemo(() => {
    const set = new Set(items.map((item) => item.category).filter(Boolean))
    return ['Semua', ...set]
  }, [items])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return items.filter((item) => {
      const matchesCategory = activeCategory === 'Semua' || item.category === activeCategory
      const matchesQuery =
        !q || item.name?.toLowerCase().includes(q) || item.description?.toLowerCase().includes(q)
      return matchesCategory && matchesQuery
    })
  }, [items, activeCategory, query])

  return (
    <section className="umkm-section" id="umkm">
      <Reveal className="section-header">
        <span className="section-kicker">Ekonomi Lokal</span>
        <h2>UMKM Dusun Ngalang</h2>
        <p>Kenali dan dukung usaha UMKM milik warga Dusun Ngalang.</p>
      </Reveal>

      <Reveal className="umkm-toolbar" y={16}>
        <div className="umkm-search">
          <Search size={16} />
          <input
            type="search"
            placeholder="Cari nama usaha atau produk..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Cari UMKM"
          />
        </div>
        <div className="umkm-filters">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              className={`umkm-filter-chip${activeCategory === cat ? ' active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </Reveal>

      <motion.div className="umkm-grid" layout>
        <AnimatePresence mode="popLayout">
          {filtered.map((item, index) => {
            const imageSrc = resolveImage(item)
            const mapsHref = item.address
              ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.address)}`
              : null
            const favId = item._id || item.name
            const isFav = favorites.has(favId)

            return (
              <motion.article
                key={favId}
                layout
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.94 }}
                transition={{ duration: 0.4, delay: Math.min(index, 4) * 0.05, ease: [0.22, 1, 0.36, 1] }}
                className="umkm-card"
              >
                <div className="umkm-image-wrap">
                  {imageSrc && (
                    <img src={imageSrc} alt={item.name} loading="lazy" className="umkm-image" />
                  )}
                  <div className="umkm-image-overlay" aria-hidden="true"></div>
                  <span className="umkm-category umkm-category-floating">{item.category}</span>
                  <button
                    type="button"
                    className={`umkm-favorite${isFav ? ' active' : ''}`}
                    onClick={() => toggleFavorite(favId)}
                    aria-label={isFav ? 'Hapus dari favorit' : 'Tandai favorit'}
                    aria-pressed={isFav}
                  >
                    <Heart size={16} fill={isFav ? 'currentColor' : 'none'} />
                  </button>
                  <div className="umkm-hover-cta">
                    <button className="btn btn-cta" onClick={() => setDetail(item)}>
                      Lihat Detail
                    </button>
                  </div>
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
              </motion.article>
            )
          })}
        </AnimatePresence>
      </motion.div>

      {filtered.length === 0 && (
        <p className="umkm-empty">Tidak ada UMKM yang cocok dengan pencarian atau kategori ini.</p>
      )}

      <Modal open={!!detail} onClose={() => setDetail(null)} labelledBy="umkm-detail-title">
        {detail && (
          <div className="umkm-detail">
            {(() => {
              const imageSrc = resolveImage(detail)
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
