/**
 * Organic SVG wave used at a few key section boundaries instead of a hard edge,
 * so transitions between backgrounds feel soft rather than boxy.
 * `flip` mirrors it vertically for use at the top vs. bottom of a section.
 * `color` should match the background of the section the wave "belongs" to.
 */
export default function WaveDivider({ color = 'var(--background)', flip = false, className }) {
  return (
    <div
      className={`wave-divider${flip ? ' wave-divider-flip' : ''}${className ? ` ${className}` : ''}`}
      aria-hidden="true"
    >
      <svg viewBox="0 0 1440 90" preserveAspectRatio="none">
        <path
          fill={color}
          d="M0,32 C240,90 480,0 720,24 C960,48 1200,96 1440,40 L1440,90 L0,90 Z"
        />
      </svg>
    </div>
  )
}
