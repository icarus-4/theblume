import { useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { dur, ease } from '../motion'
import '../via-page.css'

// Real screenshots of via.theivies.in (desktop), shown in a browser frame.
export const VIA_SHOTS = [
  {
    key: 'home',
    label: 'Home',
    path: 'via.theivies.in',
    src: 'via/via-home.webp',
    w: 1600,
    h: 900,
    alt: 'Via home page: "Hiring that blooms on trust", with buttons to find jobs or hire verified talent.',
    caption: 'Real jobs, verified talent and no ghosting, from the first screen.',
  },
  {
    key: 'how',
    label: 'How it works',
    path: 'via.theivies.in',
    src: 'via/via-how-it-works.webp',
    w: 1260,
    h: 1080,
    alt: 'Via explaining linked jobs from across the web and Via jobs open only to verified candidates.',
    caption: 'Linked jobs from across the web, and Via jobs open only to verified candidates.',
  },
  {
    key: 'recruiters',
    label: 'For recruiters',
    path: 'via.theivies.in/recruiters',
    src: 'via/via-recruiters.webp',
    w: 1600,
    h: 900,
    alt: 'Via for recruiters: every applicant verified, ranked by verified match, pay per post, reply in one click.',
    caption: 'Every applicant verified and ranked by match, with one-click replies.',
  },
  {
    key: 'pricing',
    label: 'Pricing',
    path: 'via.theivies.in/pricing',
    src: 'via/via-pricing.webp',
    w: 1600,
    h: 900,
    alt: 'Via pricing: Standard job post ₹100, Featured job post ₹200, and skill verification for candidates ₹50.',
    caption: 'Pay per post, with no subscription or seat fees.',
  },
]

export function BrowserShot({ shot, eager = false, className = '' }) {
  return (
    <figure className={`via-shot ${className}`}>
      <div className="via-shot-bar" aria-hidden="true">
        <span className="dots"><i /><i /><i /></span>
        <span className="via-url mono">{shot.path}</span>
      </div>
      <img
        src={`${import.meta.env.BASE_URL}${shot.src}`}
        width={shot.w}
        height={shot.h}
        alt={shot.alt}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
      />
    </figure>
  )
}

// Product tour: tabs switch between real Via screens with a crossfade.
export function ViaTour() {
  const reduce = useReducedMotion()
  const [i, setI] = useState(0)
  const shot = VIA_SHOTS[i]
  return (
    <div className="via-tour">
      <div className="via-tour-tabs" role="tablist" aria-label="Via screens">
        {VIA_SHOTS.map((s, k) => (
          <button
            key={s.key}
            type="button"
            role="tab"
            id={`via-tab-${s.key}`}
            aria-selected={k === i}
            aria-controls="via-tour-panel"
            className={k === i ? 'is-on' : ''}
            onClick={() => setI(k)}
          >
            {k === i && <motion.span layoutId="via-tab-bg" className="via-tab-bg" transition={{ type: 'spring', stiffness: 380, damping: 32 }} />}
            <span>{s.label}</span>
          </button>
        ))}
      </div>
      <div className="via-tour-stage" id="via-tour-panel" role="tabpanel" aria-labelledby={`via-tab-${shot.key}`}>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={shot.key}
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -12, scale: 0.99, transition: { duration: dur.exit, ease: ease.in } }}
            transition={{ duration: dur.base, ease: ease.out }}
          >
            <BrowserShot shot={shot} />
          </motion.div>
        </AnimatePresence>
        <p className="via-tour-caption">{shot.caption}</p>
      </div>
    </div>
  )
}
