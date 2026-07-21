import { MapPin, Mountain, Wheat, Landmark, ArrowRight } from 'lucide-react'
import { tentangDusun } from '../data/siteData'
import { getTentangDusun } from '../lib/sanityClient'
import { useSanityData } from '../hooks/useSanityData'
import Reveal from '../components/motion/Reveal'

// Setiap topik "Tentang Dusun" diarahkan ke section paling relevan yang membahasnya lebih detail,
// dengan ikon dan foto yang sesuai untuk layout alternating premium.
const topicMeta = [
  {
    keywords: ['lokasi'],
    href: '#lokasi',
    icon: MapPin,
    image:
      'https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=1000&q=80',
  },
  {
    keywords: ['alam', 'lingkungan'],
    href: '#galeri',
    icon: Mountain,
    image:
      'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=1000&q=80',
  },
  {
    keywords: ['pencaharian', 'ekonomi', 'usaha'],
    href: '#umkm',
    icon: Wheat,
    image:
      'https://images.unsplash.com/photo-1523741543316-beb7fc7023d8?auto=format&fit=crop&w=1000&q=80',
  },
  {
    keywords: ['budaya', 'tradisi'],
    href: '#acara',
    icon: Landmark,
    image:
      'https://images.unsplash.com/photo-1528909514045-2fa4ac7a08ba?auto=format&fit=crop&w=1000&q=80',
  },
]

function resolveTopicMeta(title = '') {
  const lower = title.toLowerCase()
  return (
    topicMeta.find(({ keywords }) => keywords.some((keyword) => lower.includes(keyword))) ||
    topicMeta[0]
  )
}

export default function SectionTentang() {
  const items = useSanityData(getTentangDusun, tentangDusun)

  return (
    <section className="tentang-section" id="tentang-dusun">
      <Reveal className="section-header">
        <span className="section-kicker">Profil Dusun</span>
        <h2>Tentang Dusun Ngalang</h2>
        <p>
          Gambaran singkat mengenai lokasi, lingkungan alam, mata pencaharian,
          serta tradisi warga Dusun Ngalang.
        </p>
      </Reveal>

      <div className="tentang-rows">
        {items.map((item, index) => {
          const meta = resolveTopicMeta(item.title)
          const Icon = meta.icon
          const reversed = index % 2 === 1

          return (
            <Reveal
              key={item._id || item.title}
              className={`tentang-row${reversed ? ' reversed' : ''}`}
              y={36}
            >
              <div className="tentang-row-media">
                <img src={meta.image} alt={item.title} loading="lazy" />
              </div>
              <div className="tentang-row-copy">
                <span className="tentang-row-icon">
                  <Icon size={22} strokeWidth={2} />
                </span>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <a href={meta.href} className="service-link">
                  Pelajari lebih lanjut <ArrowRight size={15} />
                </a>
              </div>
            </Reveal>
          )
        })}
      </div>
    </section>
  )
}
