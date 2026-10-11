import { motion, useReducedMotion } from 'framer-motion'
import { Smartphone, Code2, BrainCircuit, Cloud, PenTool, LifeBuoy, ArrowUpRight } from 'lucide-react'
import { SERVICES } from '../content'
import { pageHref } from '../routes'
import { SplitHeading, Reveal, TiltCard } from './fx'
import { dur, ease, stagger, viewport } from '../motion'

const ICONS = { apps: Smartphone, software: Code2, ai: BrainCircuit, cloud: Cloud, design: PenTool, support: LifeBuoy }

// Small looping illustrations; they idle until the card is hovered/focused.
function Viz({ kind }) {
  switch (kind) {
    case 'apps':
      return (
        <div className="viz viz-apps" aria-hidden="true">
          {[0, 1, 2].map((i) => (
            <div className="phone" key={i} style={{ '--i': i }}>
              <span className="phone-notch" />
              <span className="phone-bar w70" />
              <span className="phone-card" />
              <span className="phone-bar w50" />
              <span className="phone-bar w80" />
            </div>
          ))}
        </div>
      )
    case 'software':
      return (
        <div className="viz viz-code mono" aria-hidden="true">
          <div><span className="c-k">const</span> app = <span className="c-f">build</span>({'{'}</div>
          <div>&nbsp;&nbsp;stack: <span className="c-s">'cloud-native'</span>,</div>
          <div>&nbsp;&nbsp;ai: <span className="c-k">true</span>,</div>
          <div>&nbsp;&nbsp;scale: <span className="c-s">'∞'</span></div>
          <div>{'}'})<span className="caret" /></div>
        </div>
      )
    case 'ai':
      return (
        <svg className="viz viz-ai" viewBox="0 0 200 120" aria-hidden="true">
          {[[30, 30], [30, 90], [100, 20], [100, 60], [100, 100], [170, 45], [170, 85]].map(([x, y], i, arr) =>
            arr.slice(i + 1).filter(([x2]) => x2 > x).map(([x2, y2], j) => (
              <line key={`${i}-${j}`} x1={x} y1={y} x2={x2} y2={y2} className="ai-edge" style={{ '--d': `${(i + j) * 0.15}s` }} />
            )),
          )}
          {[[30, 30], [30, 90], [100, 20], [100, 60], [100, 100], [170, 45], [170, 85]].map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r="6" className="ai-node" style={{ '--d': `${i * 0.2}s` }} />
          ))}
        </svg>
      )
    case 'cloud':
      return (
        <div className="viz viz-orbit" aria-hidden="true">
          <span className="orbit o1"><i /></span>
          <span className="orbit o2"><i /></span>
          <span className="orbit o3"><i /></span>
          <span className="orbit-core" />
        </div>
      )
    case 'design':
      return (
        <svg className="viz viz-pen" viewBox="0 0 200 110" aria-hidden="true">
          <path d="M10 90 C 60 -10, 120 130, 190 30" className="pen-path" />
          <line x1="10" y1="90" x2="60" y2="20" className="pen-handle" />
          <line x1="190" y1="30" x2="140" y2="100" className="pen-handle" />
          <rect x="5" y="85" width="10" height="10" className="pen-pt" />
          <rect x="185" y="25" width="10" height="10" className="pen-pt" />
          <circle cx="60" cy="20" r="4" className="pen-h" />
          <circle cx="140" cy="100" r="4" className="pen-h" />
        </svg>
      )
    case 'support':
      return (
        <div className="viz viz-status" aria-hidden="true">
          <svg viewBox="0 0 300 60" preserveAspectRatio="none">
            <path className="pulse-line" d="M0 30 L80 30 L95 10 L110 50 L125 30 L180 30 L195 18 L210 42 L222 30 L300 30" />
          </svg>
          <div className="status-row mono">
            <span className="status-dot" /> All systems operational
          </div>
        </div>
      )
    default:
      return null
  }
}

export default function Services() {
  const reduce = useReducedMotion()
  return (
    <section id="services" className="section services" data-shape="1" data-dim="0.55">
      <div className="container">
        <div className="section-head">
          <Reveal as="p" className="eyebrow"><span className="eyebrow-dot" aria-hidden="true" />Services</Reveal>
          <SplitHeading lines={['Every layer of your stack,', 'handled by one team.']} accent={['one', 'team']} className="h2" />
          <Reveal as="p" className="lead section-lead" delay={0.15}>
            From the first wireframe to 3am incident response — we design, engineer, integrate AI and keep everything running.
          </Reveal>
        </div>

        <motion.div
          className="bento"
          initial={reduce ? false : 'hidden'}
          whileInView="show"
          viewport={viewport}
          transition={{ staggerChildren: stagger * 2 }}
        >
          {SERVICES.map((s, i) => {
            const Icon = ICONS[s.key]
            return (
              <motion.div
                key={s.key}
                className={`bento-cell size-${s.size}`}
                variants={{
                  hidden: { opacity: 0, y: 40, scale: 0.97 },
                  show: { opacity: 1, y: 0, scale: 1, transition: { duration: dur.slow, ease: ease.out } },
                }}
              >
                <TiltCard className="service-card" data-cursor>
                  <div className="card-spot" aria-hidden="true" />
                  <div className="card-top">
                    <span className="icon-chip"><Icon size={20} aria-hidden="true" /></span>
                    <span className="mono card-index">0{i + 1}</span>
                  </div>
                  <Viz kind={s.key} />
                  <div className="card-body">
                    <h3><a className="stretched" href={pageHref(s.page)}>{s.title}</a></h3>
                    <p>{s.body}</p>
                    <ul className="tag-list">
                      {s.tags.map((t) => <li key={t}>{t}</li>)}
                    </ul>
                  </div>
                  <ArrowUpRight className="card-arrow" size={20} aria-hidden="true" />
                </TiltCard>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
