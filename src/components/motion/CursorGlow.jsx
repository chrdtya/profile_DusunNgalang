import { useEffect, useRef } from 'react'

/**
 * Soft radial glow that follows the pointer across the whole page.
 * Desktop-only (pointer: fine) and disabled for users who prefer reduced motion.
 *
 * The RAF loop only runs while the glow is still easing toward the pointer and stops
 * itself once settled — an always-on loop was competing with Lenis's own RAF for main
 * thread time and made scrolling feel heavy.
 */
export default function CursorGlow() {
  const ref = useRef(null)

  useEffect(() => {
    const isFinePointer = window.matchMedia('(pointer: fine)').matches
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!isFinePointer || prefersReducedMotion) return

    const el = ref.current
    let raf = null
    let x = window.innerWidth / 2
    let y = window.innerHeight / 2
    let targetX = x
    let targetY = y

    const settle = () => Math.abs(targetX - x) < 0.5 && Math.abs(targetY - y) < 0.5

    const tick = () => {
      x += (targetX - x) * 0.12
      y += (targetY - y) * 0.12
      if (el) el.style.transform = `translate3d(${x}px, ${y}px, 0)`
      if (!settle()) {
        raf = requestAnimationFrame(tick)
      } else {
        raf = null
      }
    }

    const handleMove = (e) => {
      targetX = e.clientX
      targetY = e.clientY
      if (raf === null) raf = requestAnimationFrame(tick)
    }

    window.addEventListener('mousemove', handleMove, { passive: true })

    return () => {
      window.removeEventListener('mousemove', handleMove)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  return <div ref={ref} className="cursor-glow" aria-hidden="true" />
}
