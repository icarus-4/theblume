import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { BookOpen, Award, BarChart3, Sparkles, LayoutDashboard, GraduationCap, Settings, Bell, CheckCircle2, PlayCircle } from 'lucide-react'
import { FINHANCE } from '../content'
import { SplitHeading, Reveal, useInViewOnce } from './fx'
import { dur, ease, stagger, viewport } from '../motion'

const FEATURE_ICONS = [BookOpen, Award, BarChart3, Sparkles]

// Illustrative sample data for the product mock-up.
const COURSES = [
  { name: 'Foundations of Personal Finance', pct: 86 },
  { name: 'Investing 101: Markets & Risk', pct: 62 },
  { name: 'Credit, Loans & Interest', pct: 38 },
]
const CHART = [12, 18, 15, 26, 22, 34, 31, 42, 39, 50, 47, 58]

function Ring({ pct, on }) {
  const r = 34
  const c = 2 * Math.PI * r
  return (
    <svg viewBox="0 0 80 80" className="ring" aria-hidden="true">
      <circle cx="40" cy="40" r={r} className="ring-bg" />
      <motion.circle
        cx="40" cy="40" r={r}
        className="ring-fg"
        strokeDasharray={c}
        initial={{ strokeDashoffset: c }}
        animate={on ? { strokeDashoffset: c * (1 - pct / 100) } : {}}
        transition={{ duration: 1.6, ease: ease.out, delay: 0.3 }}
      />
    </svg>
  )
}

function Dashboard() {
  const ref = useRef(null)
  const on = useInViewOnce(ref, 0.3)
  const max = Math.max(...CHART)
  const pts = CHART.map((v, i) => `${(i / (CHART.length - 1)) * 300},${100 - (v / max) * 88}`).join(' ')
  return (
    <div className="dash" ref={ref} role="img" aria-label="Finhance LMS dashboard preview showing course progress, learning activity chart and an AI study suggestion">
      <aside className="dash-side" aria-hidden="true">
        <div className="dash-logo"><span className="dash-logo-mark">F</span> Finhance</div>
        {[LayoutDashboard, BookOpen, GraduationCap, BarChart3, Settings].map((I, i) => (
          <span key={i} className={`dash-nav ${i === 0 ? 'is-on' : ''}`}><I size={16} /></span>
        ))}
      </aside>
      <div className="dash-main" aria-hidden="true">
        <div className="dash-top">
          <div>
            <small className="mono">Welcome back</small>
            <strong>Your learning journey</strong>
          </div>
          <span className="dash-bell"><Bell size={16} /><i /></span>
        </div>
        <div className="dash-kpis">
          <div className="kpi kpi-ring">
            <Ring pct={72} on={on} />
            <div><small>Path complete</small><strong>72%</strong></div>
          </div>
          <div className="kpi"><small>Lessons this week</small><strong>14</strong><em className="up">streak 6 days</em></div>
          <div className="kpi"><small>Certificates</small><strong>3</strong><em>1 in progress</em></div>
        </div>
        <div className="dash-row">
          <div className="dash-chart">
            <div className="dash-card-head"><small>Learning activity</small><span className="mono">12 wks</span></div>
            <svg viewBox="0 0 300 100" preserveAspectRatio="none">
              <defs>
                <linearGradient id="fill" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0" stopColor="var(--green-400)" stopOpacity="0.45" />
                  <stop offset="1" stopColor="var(--green-400)" stopOpacity="0" />
                </linearGradient>
              </defs>
              <motion.polygon
                points={`0,100 ${pts} 300,100`}
                fill="url(#fill)"
                initial={{ opacity: 0 }}
                animate={on ? { opacity: 1 } : {}}
                transition={{ delay: 1, duration: 0.8 }}
              />
              <motion.polyline
                points={pts}
                className="chart-line"
                initial={{ pathLength: 0 }}
                animate={on ? { pathLength: 1 } : {}}
                transition={{ duration: 1.8, ease: ease.inOut, delay: 0.2 }}
              />
            </svg>
          </div>
          <div className="dash-courses">
            <div className="dash-card-head"><small>Continue learning</small></div>
            {COURSES.map((c, i) => (
              <div className="course" key={c.name}>
                <PlayCircle size={18} className="text-accent" />
                <div>
                  <span>{c.name}</span>
                  <div className="bar">
                    <motion.i
                      initial={{ scaleX: 0 }}
                      animate={on ? { scaleX: c.pct / 100 } : {}}
                      transition={{ duration: 1.2, ease: ease.out, delay: 0.5 + i * 0.15 }}
                    />
                  </div>
                </div>
                <small className="mono">{c.pct}%</small>
              </div>
            ))}
          </div>
        </div>
        <motion.div
          className="dash-ai"
          initial={{ opacity: 0, y: 12 }}
          animate={on ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1.6, duration: dur.base, ease: ease.out }}
        >
          <Sparkles size={16} />
          <span><b>AI tutor:</b> You’re strongest on budgeting. Try the “Compound Interest” quiz next to unlock Investing II.</span>
        </motion.div>
      </div>
    </div>
  )
}

export default function Finhance() {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'center center'] })
  const rotateX = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [32, 0])
  const scale = useTransform(scrollYProgress, [0, 1], reduce ? [1, 1] : [0.82, 1])
  const y = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [80, 0])
  const chipA = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [120, 0])
  const chipB = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [200, 0])

  return (
    <section id="finhance" ref={ref} className="section finhance" data-shape="3" data-dim="0.6">
      <div className="container">
        <div className="section-head center">
          <Reveal as="p" className="eyebrow"><span className="eyebrow-dot" aria-hidden="true" />{FINHANCE.eyebrow}</Reveal>
          <SplitHeading lines={[FINHANCE.title]} accent={['LMS']} className="h2 h2-xl" />
          <Reveal as="p" className="lead section-lead" delay={0.15}>{FINHANCE.sub}</Reveal>
        </div>

        <div className="dash-stage">
          <motion.div className="dash-tilt" style={{ rotateX, scale, y, transformPerspective: 1400 }}>
            <div className="dash-glow" aria-hidden="true" />
            <Dashboard />
          </motion.div>
          <motion.div className="float-chip chip-a glass" style={{ y: chipA }} aria-hidden="true">
            <CheckCircle2 size={16} className="text-accent" /> Quiz passed · 9/10
          </motion.div>
          <motion.div className="float-chip chip-b glass" style={{ y: chipB }} aria-hidden="true">
            <Award size={16} className="text-accent" /> Certificate issued
          </motion.div>
        </div>

        <motion.ul
          className="features"
          initial={reduce ? false : 'hidden'}
          whileInView="show"
          viewport={viewport}
          transition={{ staggerChildren: stagger * 2 }}
        >
          {FINHANCE.features.map((f, i) => {
            const I = FEATURE_ICONS[i]
            return (
              <motion.li
                key={f.title}
                variants={{ hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: dur.slow, ease: ease.out } } }}
              >
                <span className="icon-chip"><I size={20} aria-hidden="true" /></span>
                <h3>{f.title}</h3>
                <p>{f.body}</p>
              </motion.li>
            )
          })}
        </motion.ul>
      </div>
    </section>
  )
}
