import { useRef } from 'react'
import { motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion'
import { PROCESS } from '../content'
import { SplitHeading, Reveal } from './fx'
import { dur, ease } from '../motion'

// A circuit "vine" draws itself down the page as you scroll; each stage's
// node lights up when the line reaches it — echoing the logo's traces.
function Stage({ s, i, progress }) {
  const at = (i + 0.5) / PROCESS.length
  const lit = useTransform(progress, [at - 0.12, at], [0, 1])
  const scale = useTransform(lit, [0, 1], [0.6, 1])
  const opacity = useTransform(lit, [0, 1], [0.35, 1])
  return (
    <li className="stage">
      <motion.span className="stage-node" style={{ opacity, scale }} aria-hidden="true">
        <span />
      </motion.span>
      <Reveal className="stage-card glass" y={40}>
        <span className="mono stage-k">0{i + 1} · {s.k}</span>
        <h3>{s.title}</h3>
        <p>{s.body}</p>
      </Reveal>
    </li>
  )
}

export default function Process() {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 70%', 'end 60%'] })
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 })
  const full = useMotionValue(1)
  const draw = reduce ? full : progress

  return (
    <section id="process" className="section process" data-shape="4" data-dim="0.75">
      <div className="container process-grid">
        <div className="section-head sticky-head">
          <Reveal as="p" className="eyebrow"><span className="eyebrow-dot" aria-hidden="true" />How we work</Reveal>
          <SplitHeading lines={['From seed', 'to bloom.']} accent={['bloom']} className="h2 h2-xl" />
          <Reveal as="p" className="lead" delay={0.15}>
            A clear, four-stage process with weekly demos — so you always know what’s growing and when it ships.
          </Reveal>
        </div>

        <ol className="stages" ref={ref}>
          <svg className="vine" viewBox="0 0 4 100" preserveAspectRatio="none" aria-hidden="true">
            <line x1="2" y1="0" x2="2" y2="100" className="vine-bg" />
            <motion.line x1="2" y1="0" x2="2" y2="100" className="vine-fg" style={{ pathLength: draw }} />
          </svg>
          {PROCESS.map((s, i) => (
            <Stage key={s.k} s={s} i={i} progress={draw} />
          ))}
        </ol>
      </div>
      <motion.div
        className="process-glow"
        aria-hidden="true"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: dur.slow, ease: ease.out }}
      />
    </section>
  )
}
