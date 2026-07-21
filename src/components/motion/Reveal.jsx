import { motion } from 'framer-motion'

const easing = [0.22, 1, 0.36, 1]

/**
 * Scroll-triggered reveal for containers that never remount (section headers,
 * hero, cta box, footer columns, the outer wrapper of a card grid). Fires once.
 */
export default function Reveal({ children, delay = 0, y = 28, className, ...props }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, delay, ease: easing }}
      {...props}
    >
      {children}
    </motion.div>
  )
}

/**
 * Mount fade for CMS-driven cards (UMKM/Berita/Acara/Galeri) whose DOM node
 * gets replaced when useSanityData swaps fallback data for live data. No
 * `viewport` prop, so it always plays once on mount instead of re-triggering
 * on scroll and causing a flicker when the swap happens off-screen.
 */
export function RevealItem({ children, delay = 0, className, ...props }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay, ease: easing }}
      {...props}
    >
      {children}
    </motion.div>
  )
}
