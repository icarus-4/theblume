import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform, useVelocity, useSpring } from 'framer-motion'
import { MARQUEE } from '../content'

// Infinite ticker whose skew reacts to scroll velocity. Pauses on hover/focus
// (ui-ux-pro-max: auto-rotation-controls) and stops under reduced motion.
export default function Marquee() {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const { scrollY } = useScroll()
  const vel = useSpring(useVelocity(scrollY), { stiffness: 200, damping: 50 })
  const skew = useTransform(vel, [-2000, 0, 2000], reduce ? [0, 0, 0] : [6, 0, -6])
  const items = MARQUEE

  return (
    <div className={`marquee ${reduce ? 'is-static' : ''}`} ref={ref} aria-label="What we do" tabIndex={0}>
      <motion.div className="marquee-track" style={{ skewX: skew }}>
        {[0, 1].map((dup) => (
          <ul className="marquee-row" key={dup} aria-hidden={dup === 1 ? 'true' : undefined}>
            {items.map((m, i) => (
              <li key={i}>
                {m}
                <svg className="marquee-node" viewBox="0 0 24 24" aria-hidden="true">
                  <circle cx="12" cy="12" r="6" fill="none" stroke="currentColor" strokeWidth="2.5" />
                </svg>
              </li>
            ))}
          </ul>
        ))}
      </motion.div>
    </div>
  )
}
