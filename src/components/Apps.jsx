import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { ArrowUpRight, Bell, Clipboard, Clock, Fuel, Globe, Hourglass, Lock, Monitor, ThumbsDown, Wrench, Zap, Smartphone } from 'lucide-react'
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
  if (app.key === 'lanclip') return <LanIcon />
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

// Illustrative phone screen for dashtr: economy, costs and a paperwork alert.
const DASHTR_COSTS = [42, 58, 35, 66, 48, 72]

function DashtrScreen() {
  const ref = useRef(null)
  const on = useInViewOnce(ref, 0.4)
  const reduce = useReducedMotion()
  const [eco, setEco] = useState(reduce ? 5.6 : 0)

  useEffect(() => {
    if (!on || reduce) return
    const start = performance.now()
    let raf
    const tick = (now) => {
      const p = Math.min(1, (now - start) / 1300)
      setEco(5.6 * (1 - Math.pow(1 - p, 3)))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [on, reduce])

  const max = Math.max(...DASHTR_COSTS)
  return (
    <div className="phone-screen dashtr" ref={ref} aria-hidden="true">
      <div className="dashtr-top">
        <span className="dashtr-word">dashtr</span>
        <span className="dashtr-car mono">Swift VXi</span>
      </div>
      <div className="dashtr-alert">
        <Bell size={13} />
        <span><b>Insurance</b> expires in 12 days</span>
      </div>
      <div className="dashtr-kpis">
        <div>
          <small>Economy</small>
          <strong>{eco.toFixed(1)}</strong>
          <em className="mono">L/100 km</em>
        </div>
        <div>
          <small>Cost per km</small>
          <strong>₹6.40</strong>
          <em className="mono">incl. servicing</em>
        </div>
      </div>
      <div className="dashtr-chart">
        <small>Running costs · 6 months</small>
        <div className="dashtr-bars">
          {DASHTR_COSTS.map((v, i) => (
            <motion.i
              key={i}
              initial={{ scaleY: 0 }}
              animate={on ? { scaleY: v / max } : {}}
              transition={{ duration: 0.9, ease: ease.out, delay: 0.3 + i * 0.07 }}
            />
          ))}
        </div>
      </div>
      <ul className="dashtr-log">
        <li><span><Fuel size={12} /> Fill-up · 32.4 L</span><b>₹3,450</b></li>
        <li><span><Wrench size={12} /> Oil &amp; filter</span><b>₹2,100</b></li>
      </ul>
      <span className="dashtr-cta">Log fill-up</span>
    </div>
  )
}

// Illustrative phone screen for LANClip: peers and clips arriving from the PC.
const LAN_CLIPS = ['Order #4521 ships on Friday', 'Invoice INV-2026-118 is attached', 'Thanks for the call today, sending the draft now.']

function LanclipScreen() {
  const ref = useRef(null)
  const on = useInViewOnce(ref, 0.4)
  const reduce = useReducedMotion()
  const [i, setI] = useState(0)

  useEffect(() => {
    if (!on || reduce) return
    const t = setInterval(() => setI((v) => (v + 1) % LAN_CLIPS.length), 2600)
    return () => clearInterval(t)
  }, [on, reduce])

  return (
    <div className="phone-screen lanclip" ref={ref} aria-hidden="true">
      <div className="lan-top">
        <b>LANClip</b>
        <span className="lan-toggle"><i /></span>
      </div>
      <div className="lan-secure mono"><Lock size={11} /> Encrypted · sync group “home”</div>
      <div className="lan-peers">
        <small>On this Wi-Fi</small>
        <div className="lan-peer"><Monitor size={14} /><span>DESKTOP-WORK</span><em className="on" /></div>
        <div className="lan-peer"><Smartphone size={14} /><span>This phone</span><em className="on" /></div>
      </div>
      <div className="lan-clips">
        <small>Latest clip</small>
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div
            key={i}
            className="lan-clip"
            initial={{ opacity: 0, y: 14, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, transition: { duration: 0.2 } }}
            transition={{ duration: 0.4, ease: ease.out }}
          >
            <span className="mono">from DESKTOP-WORK · just now</span>
            <p>{LAN_CLIPS[i]}</p>
          </motion.div>
        </AnimatePresence>
      </div>
      <span className="lan-send"><Clipboard size={14} /> Send clipboard</span>
    </div>
  )
}

// Drawn stand-in icon for LANClip: a clipboard with Wi-Fi arcs.
function LanIcon() {
  return (
    <span className="app-icon app-icon-lan" aria-hidden="true">
      <svg viewBox="0 0 64 64">
        <defs>
          <linearGradient id="lanG" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#7cc4ff" />
            <stop offset="1" stopColor="#2f7cf6" />
          </linearGradient>
        </defs>
        <rect x="17" y="16" width="30" height="36" rx="6" fill="none" stroke="url(#lanG)" strokeWidth="4" />
        <rect x="25" y="12" width="14" height="8" rx="3" fill="url(#lanG)" />
        <path d="M24 38 a11 11 0 0 1 16 0" fill="none" stroke="url(#lanG)" strokeWidth="3.5" strokeLinecap="round" />
        <path d="M28.5 43 a5 5 0 0 1 7 0" fill="none" stroke="url(#lanG)" strokeWidth="3.5" strokeLinecap="round" />
      </svg>
    </span>
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

const SCREENS = {
  welikethisone: () => <VoteScreen />,
  fairly: () => <FairlyScreen />,
  dashtr: () => <DashtrScreen />,
  lanclip: () => <LanclipScreen />,
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
                <Globe size={18} aria-hidden="true" /> {app.websiteLabel || new URL(app.website).hostname.replace(/^www\./, '')}
                <ArrowUpRight size={16} aria-hidden="true" />
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            )}
          </div>
        </div>

        <motion.div className="app-phone" style={{ y: phoneY }}>
          <div className={`phone-frame ${index % 2 ? 'tilt-left' : 'tilt-right'}`}>
            <span className="phone-cam" aria-hidden="true" />
            {SCREENS[app.key] ? SCREENS[app.key]() : <SoonScreen />}
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
          <Reveal as="p" className="eyebrow"><span className="eyebrow-dot" aria-hidden="true" />Built by Ivies</Reveal>
          <SplitHeading lines={['Apps', 'we’ve built.']} accent={['built']} className="h2" />
          <Reveal as="p" className="lead section-lead" delay={0.15}>
            We don’t just build for clients. These are our own Android and Windows apps, designed, engineered and launched by our team.
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
