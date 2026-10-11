import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { ArrowUpRight, Clock, Globe, Hourglass, ThumbsDown, Zap, Smartphone } from 'lucide-react'
import { APPS } from '../content'
import { SplitHeading, Reveal, TiltCard, useInViewOnce } from './fx'
import { dur, ease, stagger, viewport } from '../motion'
import '../apps.css'

// Drawn stand-in for the welikethisone icon: three tilted cards.
function StackIcon() {
  return (
    <span className="app-icon app-icon-stack" aria-hidden="true">
      <i /><i /><i />
    </span>
  )
}

function AppIcon({ app }) {
  if (app.icon) return <img className="app-icon" src={`${import.meta.env.BASE_URL}${app.icon}`} alt="" width="64" height="64" />
  if (app.key === 'welikethisone') return <StackIcon />
  return <span className="app-icon app-icon-mono" aria-hidden="true">{app.name[0]}</span>
}

// Illustrative phone screen for welikethisone: boards, a post, a live vote.
function VoteScreen() {
  const ref = useRef(null)
  const on = useInViewOnce(ref, 0.4)
  const reduce = useReducedMotion()
  const boards = ['Everything', 'Panels', 'Strays']
  const [board, setBoard] = useState(1)
  const [secs, setSecs] = useState(23 * 3600 + 59 * 60 + 41)

  useEffect(() => {
    if (!on || reduce) return
    const t = setInterval(() => setSecs((s) => (s > 0 ? s - 1 : 0)), 1000)
    const b = setInterval(() => setBoard((v) => (v + 1) % boards.length), 3200)
    return () => {
      clearInterval(t)
      clearInterval(b)
    }
  }, [on, reduce, boards.length])

  const hh = String(Math.floor(secs / 3600)).padStart(2, '0')
  const mm = String(Math.floor((secs % 3600) / 60)).padStart(2, '0')
  const ss = String(secs % 60).padStart(2, '0')

  return (
    <div className="phone-screen wlto" ref={ref} aria-hidden="true">
      <div className="wlto-top">
        <span className="wlto-logo">welike<br />thisone</span>
        <span className="wlto-dot" />
      </div>
      <div className="wlto-boards">
        {boards.map((b, i) => (
          <span key={b} className={i === board ? 'is-on' : ''}>
            {i === board && <motion.i layoutId="wlto-tab" transition={{ type: 'spring', stiffness: 400, damping: 32 }} />}
            <em>{b}</em>
          </span>
        ))}
      </div>
      <div className="wlto-post">
        <small className="mono">Panels · Screen</small>
        <p>The villain was right the whole time. Rewatch the opening scene.</p>
        <div className="wlto-actions">
          <span className="pow"><Zap size={12} /> POW</span>
          <span className="boo"><ThumbsDown size={12} /> BOO</span>
        </div>
      </div>
      <div className="wlto-post wlto-post-stray">
        <small className="mono">Strays · Urgent</small>
        <p>Ginger kitten near the old station needs a foster tonight.</p>
      </div>
      <div className="wlto-vote">
        <div className="wlto-vote-head">
          <small>The room is voting</small>
          <span className="mono"><Clock size={11} /> {hh}:{mm}:{ss}</span>
        </div>
        <div className="wlto-bar">
          <motion.i
            initial={{ scaleX: 0 }}
            animate={on ? { scaleX: 0.68 } : {}}
            transition={{ duration: 1.6, ease: ease.out, delay: 0.3 }}
          />
        </div>
        <div className="wlto-vote-foot mono"><span>Keep 68%</span><span>Remove 32%</span></div>
      </div>
      <div className="wlto-nav"><i /><i className="is-on" /><i /><i /></div>
    </div>
  )
}

// Illustrative phone screen for Fairly: a trip group's balances.
const FAIRLY_PEOPLE = [
  { n: 'You', v: 2340 },
  { n: 'Aarav', v: -1180 },
  { n: 'Meera', v: -760 },
  { n: 'Kabir', v: -400 },
]

function FairlyScreen() {
  const ref = useRef(null)
  const on = useInViewOnce(ref, 0.4)
  const reduce = useReducedMotion()
  const [owed, setOwed] = useState(reduce ? 2340 : 0)

  useEffect(() => {
    if (!on || reduce) return
    const start = performance.now()
    let raf
    const tick = (now) => {
      const p = Math.min(1, (now - start) / 1400)
      setOwed(Math.round(2340 * (1 - Math.pow(1 - p, 3))))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [on, reduce])

  const max = Math.max(...FAIRLY_PEOPLE.map((p) => Math.abs(p.v)))
  return (
    <div className="phone-screen fairly" ref={ref} aria-hidden="true">
      <div className="fairly-top">
        <small>Goa trip · 4 people</small>
        <span className="fairly-chip mono">INR</span>
      </div>
      <div className="fairly-hero">
        <small>You are owed</small>
        <strong>₹{owed.toLocaleString('en-IN')}</strong>
      </div>
      <ul className="fairly-people">
        {FAIRLY_PEOPLE.map((p, i) => (
          <li key={p.n}>
            <span className="fairly-avatar" style={{ '--h': i * 70 }}>{p.n[0]}</span>
            <span className="fairly-name">{p.n}</span>
            <span className="fairly-bar">
              <motion.i
                className={p.v > 0 ? 'pos' : 'neg'}
                initial={{ scaleX: 0 }}
                animate={on ? { scaleX: Math.abs(p.v) / max } : {}}
                transition={{ duration: 1, ease: ease.out, delay: 0.4 + i * 0.08 }}
              />
            </span>
            <span className={`fairly-amt mono ${p.v > 0 ? 'pos' : 'neg'}`}>{p.v > 0 ? '+' : '−'}{Math.abs(p.v)}</span>
          </li>
        ))}
      </ul>
      <div className="fairly-expense">
        <span className="fairly-receipt" />
        <div>
          <b>Seafood dinner</b>
          <small>₹4,800 · split by item</small>
        </div>
      </div>
      <span className="fairly-settle">Settle up</span>
    </div>
  )
}

// Placeholder screen for an unreleased app: shimmering skeleton.
function SoonScreen() {
  return (
    <div className="phone-screen soon" aria-hidden="true">
      <span className="sk sk-title" />
      <span className="sk sk-line" />
      <span className="sk sk-card" />
      <span className="sk sk-line short" />
      <span className="sk sk-card" />
      <div className="soon-badge mono"><Hourglass size={14} /> In development</div>
    </div>
  )
}

function AppCard({ app, index }) {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const phoneY = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [60, -60])
  const live = app.status === 'live'

  return (
    <motion.article
      ref={ref}
      className={`app-card ${live ? 'is-live' : 'is-soon'}`}
      variants={{
        hidden: { opacity: 0, y: 50 },
        show: { opacity: 1, y: 0, transition: { duration: dur.slow, ease: ease.out } },
      }}
      aria-labelledby={`app-${app.key}`}
    >
      <TiltCard className="app-card-inner" max={4}>
        <div className="card-spot" aria-hidden="true" />
        <div className="app-info">
          <div className="app-head">
            <AppIcon app={app} />
            <div>
              <h3 id={`app-${app.key}`}>
                {app.name}
                {app.subtitle && <span className="app-sub">: {app.subtitle}</span>}
              </h3>
              <div className="app-meta">
                <span className={`status ${live ? 'status-live' : 'status-soon'}`}>
                  <span className="status-dot" aria-hidden="true" />
                  {live ? 'Live on Google Play' : 'Coming soon'}
                </span>
                <span className="mono app-cat"><Smartphone size={12} aria-hidden="true" /> {app.category}</span>
              </div>
            </div>
          </div>
          <p className="app-tagline">{app.tagline}</p>
          <p className="app-body">{app.body}</p>
          {app.features.length > 0 && (
            <ul className="tag-list">
              {app.features.map((f) => <li key={f}>{f}</li>)}
            </ul>
          )}
          <div className="app-cta">
            {live && app.url ? (
              <a className="btn btn-store" href={app.url} target="_blank" rel="noopener noreferrer">
                <PlayGlyph /> <span><small>Get it on</small>Google Play</span>
                <ArrowUpRight size={16} aria-hidden="true" />
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            ) : (
              <span className="btn btn-store is-disabled" aria-disabled="true">
                <PlayGlyph /> <span><small>Google Play</small>Link coming soon</span>
              </span>
            )}
            {app.website && (
              <a className="btn btn-ghost btn-site" href={app.website} target="_blank" rel="noopener noreferrer">
                <Globe size={18} aria-hidden="true" /> {new URL(app.website).hostname.replace(/^www\./, '')}
                <ArrowUpRight size={16} aria-hidden="true" />
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            )}
          </div>
        </div>

        <motion.div className="app-phone" style={{ y: phoneY }}>
          <div className={`phone-frame ${index % 2 ? 'tilt-left' : 'tilt-right'}`}>
            <span className="phone-cam" aria-hidden="true" />
            {app.key === 'welikethisone' ? <VoteScreen /> : app.key === 'fairly' ? <FairlyScreen /> : <SoonScreen />}
            {!live && (
              <span className="phone-ribbon mono" aria-hidden="true"><Hourglass size={12} /> Coming soon</span>
            )}
          </div>
          <div className="phone-shadow" aria-hidden="true" />
        </motion.div>
      </TiltCard>
    </motion.article>
  )
}

function PlayGlyph() {
  return (
    <svg className="play-glyph" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 3.5v17a1 1 0 0 0 1.5.86l14-8.5a1 1 0 0 0 0-1.72l-14-8.5A1 1 0 0 0 5 3.5Z" />
    </svg>
  )
}

export default function Apps() {
  const reduce = useReducedMotion()
  return (
    <section id="apps" className="section apps" data-shape="3" data-dim="0.35">
      <div className="container">
        <div className="section-head">
          <Reveal as="p" className="eyebrow"><span className="eyebrow-dot" aria-hidden="true" />Built by theBlume</Reveal>
          <SplitHeading lines={['Android apps', 'we’ve built.']} accent={['built']} className="h2" />
          <Reveal as="p" className="lead section-lead" delay={0.15}>
            We don’t just build for clients. These are our own apps, designed, engineered and launched by our team.
          </Reveal>
        </div>

        <motion.div
          className="app-list"
          initial={reduce ? false : 'hidden'}
          whileInView="show"
          viewport={viewport}
          transition={{ staggerChildren: stagger * 3 }}
        >
          {APPS.map((app, i) => <AppCard key={app.key} app={app} index={i} />)}
        </motion.div>
      </div>
    </section>
  )
}
