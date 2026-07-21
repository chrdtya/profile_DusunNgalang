import { useMemo, useState } from 'react'
import { Expand } from 'lucide-react'
import { daftarGaleri } from '../data/siteData'
import { getGaleri, urlFor } from '../lib/sanityClient'
import { useSanityData } from '../hooks/useSanityData'
import Reveal, { RevealItem } from '../components/motion/Reveal'
import Lightbox from '../components/Lightbox'

export default function SectionGaleri() {
  const items = useSanityData(getGaleri, daftarGaleri)
  const [activeFilter, setActiveFilter] = useState('Semua')
  const [lightboxIndex, setLightboxIndex] = useState(null)

  const categories = useMemo(() => {
    const set = new Set(items.map((item) => item.category).filter(Boolean))
    return ['Semua', ...set]
  }, [items])

  const filtered = useMemo(() => {
    if (activeFilter === 'Semua') return items
    return items.filter((item) => item.category === activeFilter)
  }, [items, activeFilter])

  const lightboxItems = filtered.map((item) => ({
    src: typeof item.image === 'string' ? item.image : item.image ? urlFor(item.image) : item.imageUrl,
    caption: item.title || item.caption,
  }))

  return (
    <section className="galeri-section" id="galeri">
      <Reveal className="section-header">
        <span className="section-kicker">Dokumentasi</span>
        <h2>Galeri Dusun Ngalang</h2>
        <p>
          Dokumentasi suasana alam, aktivitas warga, dan momen budaya yang
          merepresentasikan kehidupan desa.
        </p>
      </Reveal>

      {categories.length > 1 && (
        <Reveal className="galeri-filters" y={12}>
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              className={`galeri-filter-chip${activeFilter === cat ? ' active' : ''}`}
              onClick={() => setActiveFilter(cat)}
            >
              {cat}
            </button>
          ))}
        </Reveal>
      )}

      <Reveal className="gallery-masonry" y={20}>
        {filtered.map((item, index) => {
          const imgSrc =
            typeof item.image === 'string' ? item.image : item.image ? urlFor(item.image) : item.imageUrl
          return (
            <RevealItem
              key={item._id || item.caption}
              delay={Math.min(index, 6) * 0.05}
              className="gallery-item"
            >
              <button
                type="button"
                className="gallery-item-btn"
                onClick={() => setLightboxIndex(index)}
                aria-label={`Perbesar foto: ${item.title || item.caption}`}
              >
                <img src={imgSrc} alt={item.title || item.caption} loading="lazy" />
                <span className="gallery-item-overlay">
                  <Expand size={18} />
                </span>
                <figcaption>{item.title || item.caption}</figcaption>
              </button>
            </RevealItem>
          )
        })}
      </Reveal>

      <Lightbox
        items={lightboxItems}
        index={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onNavigate={setLightboxIndex}
      />
    </section>
  )
}
