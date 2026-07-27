import { useRef } from 'react'
import { motion } from 'framer-motion'

/**
 * Wraps any inline element (button/link) with a subtle magnetic pull toward the
 * cursor on hover — used on primary CTAs to add a premium, tactile feel.
 */
export default function MagneticButton({ children, className, as: Component = motion.a, strength = 18, ...props }) {
  const ref = useRef(null)

  const handleMouseMove = (e) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const relX = e.clientX - rect.left - rect.width / 2
    const relY = e.clientY - rect.top - rect.height / 2
    el.style.setProperty('--mx', `${(relX / rect.width) * strength}px`)
    el.style.setProperty('--my', `${(relY / rect.height) * strength}px`)
  }

  const handleMouseLeave = () => {
    const el = ref.current
    if (!el) return
    el.style.setProperty('--mx', '0px')
    el.style.setProperty('--my', '0px')
  }

  return (
    <Component
      ref={ref}
      className={`magnetic-btn${className ? ` ${className}` : ''}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      {children}
    </Component>
  )
}
