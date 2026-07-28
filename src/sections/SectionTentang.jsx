import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { MapPin, Mountain, Wheat, Landmark, ArrowRight } from 'lucide-react'
import { tentangDusun } from '../data/siteData'
import { getTentangDusun, urlFor } from '../lib/sanityClient'
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
      'https://images.unsplash.com/photo-1566622246836-12802785656a?auto=format&fit=crop&w=1000&q=80',
  },
  {
    keywords: ['alam', 'lingkungan'],
    href: '#galeri',
    icon: Mountain,
    image:
      'https://images.unsplash.com/photo-1500622944204-b135684e99fd?auto=format&fit=crop&w=1000&q=80',
  },
  {
    keywords: ['pencaharian', 'ekonomi', 'usaha'],
    href: '#umkm',
    icon: Wheat,
    image:
      'https://images.unsplash.com/photo-1636057423765-c766099ef09d?auto=format&fit=crop&w=1000&q=80',
  },
  {
    keywords: ['budaya', 'tradisi'],
    href: '#acara',
    icon: Landmark,
    image:
      'https://images.unsplash.com/photo-1542897643-cfccd88c7127?auto=format&fit=crop&w=1000&q=80',
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
  const rowsRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: rowsRef,
    offset: ['start 70%', 'end 60%'],
  })
  const timelineHeight = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])

  return (
    <section className="tentang-section mesh-gradient-bg" id="tentang-dusun">
      <Reveal className="section-header">
        <h2>Mengenal Dusun Ngalang</h2>
        <p>
          Sebuah perjalanan singkat mengenal lokasi, alam, mata pencaharian, dan
          budaya yang membentuk kehidupan warga Dusun Ngalang.
        </p>
      </Reveal>

      <div className="tentang-rows" ref={rowsRef}>
        <div className="tentang-timeline-track" aria-hidden="true">
          <motion.div className="tentang-timeline-fill" style={{ height: timelineHeight }} />
        </div>

        {items.map((item, index) => {
          const meta = resolveTopicMeta(item.title)
          const Icon = meta.icon
          const reversed = index % 2 === 1
          const image = (item.image && urlFor(item.image)) || meta.image

          return (
            <Reveal
              key={item._id || item.title}
              className={`tentang-row${reversed ? ' reversed' : ''}`}
              y={36}
            >
              <motion.span
                className="tentang-node"
                initial={{ scale: 0.4, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                aria-hidden="true"
              >
                <Icon size={14} strokeWidth={2.4} />
              </motion.span>

              <div className="tentang-row-media">
                <span className="tentang-row-shape" aria-hidden="true"></span>
                <img src={image} alt={item.title} loading="lazy" />
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
