import { useEffect, useRef } from 'react'
import { useInView, useMotionValue, useSpring } from 'framer-motion'

/**
 * Animates a number counting up from 0 to `value` once it scrolls into view.
 * Used on stat rows (hero, profil desa) so the numbers feel alive instead of static.
 */
export default function CountUp({ value, suffix = '', duration = 1.4, className }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.6 })
  const motionValue = useMotionValue(0)
  const springValue = useSpring(motionValue, { duration, bounce: 0 })

  useEffect(() => {
    if (isInView) motionValue.set(value)
  }, [isInView, value, motionValue])

  useEffect(() => {
    return springValue.on('change', (latest) => {
      if (ref.current) ref.current.textContent = `${Math.round(latest)}${suffix}`
    })
  }, [springValue, suffix])

  return (
    <span ref={ref} className={className}>
      0{suffix}
    </span>
  )
}
