import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { ArrowUpRight, ArrowRight, BadgeCheck, Check, FileText, Mic, ListChecks, Gauge } from 'lucide-react'
import { VIA } from '../via-data'
import { pageHref } from '../routes'
import { SplitHeading, Reveal, Magnetic, TiltCard, useInViewOnce } from './fx'
import { Breadcrumbs } from './ServicePage'
import FAQ from './FAQ'
import { BrowserShot, ViaTour, VIA_SHOTS } from './ViaShots'
import { dur, ease, stagger, viewport } from '../motion'
import '../service-page.css'
import '../via-page.css'

const AI_ICONS = [FileText, Mic, ListChecks, Gauge]

function ExtLink({ href, className, children }) {
  return (
    <a className={className} href={href} target="_blank" rel="noopener noreferrer">
      {children}
      <span className="sr-only">(opens in a new tab)</span>
    </a>
  )
}

// Counts up to `value` once the stat scrolls into view.
function Stat({ value, suffix, label }) {
  const ref = useRef(null)
  const on = useInViewOnce(ref, 0.5)
  const reduce = useReducedMotion()
  const [n, setN] = useState(reduce ? value : 0)
  useEffect(() => {
    if (!on || reduce) return
    const start = performance.now()
    let raf
    const tick = (now) => {
      const p = Math.min(1, (now - start) / 1400)
      setN(Math.round(value * (1 - Math.pow(1 - p, 3))))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [on, reduce, value])
  return (
    <li className="via-stat" ref={ref}>
      <strong>
        {/* Real number for crawlers/screen readers; animated copy for sight. */}
        <span className="sr-only">{value}{suffix}</span>
        <span aria-hidden="true">{n}{suffix}</span>
      </strong>
      <p>{label}</p>
    </li>
  )
}

export default function ViaPage() {
  const reduce = useReducedMotion()
  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const shotY = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [0, -60])
  const shotRot = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [-6, 0])
  const grid = (s = stagger * 1.5) => ({ initial: reduce ? false : 'hidden', whileInView: 'show', viewport, transition: { staggerChildren: s } })
  const item = { hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0, transition: { duration: dur.slow, ease: ease.out } } }
  const fadeIn = (delay) => ({
    initial: reduce ? false : { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { delay, duration: dur.slow, ease: ease.out },
  })

  return (
    <>
      {/* Hero */}
      <section className="svc-hero via-hero" ref={heroRef} data-shape="0" data-dim="0.55">
        <div className="container via-hero-grid">
          <div className="svc-hero-inner">
            <Breadcrumbs trail={[['Home', pageHref()], ['Via']]} />
            <motion.p className="eyebrow" {...fadeIn(0)}>
              <span className="eyebrow-dot" aria-hidden="true" />{VIA.eyebrow}
            </motion.p>
            <h1 className="svc-h1 via-h1">
              <span className="split-mask">
                <motion.span className="split-word via-wordmark" initial={reduce ? false : { y: '110%' }} animate={{ y: '0%' }} transition={{ duration: 1, ease: ease.out }}>
                  Via
                </motion.span>
              </span>
              <span className="sr-only">: </span>
              <motion.span className="via-h1-sub" {...fadeIn(0.25)}>
                Real jobs, verified skills, and an answer for every applicant.
              </motion.span>
            </h1>
            <motion.p className="lead svc-lead" {...fadeIn(0.4)}>{VIA.lead}</motion.p>
            <motion.div className="hero-ctas" {...fadeIn(0.55)}>
              <Magnetic>
                <ExtLink className="btn btn-primary" href={VIA.links.open}>
                  Open Via <ArrowUpRight size={18} aria-hidden="true" />
                </ExtLink>
              </Magnetic>
              <Magnetic>
                <ExtLink className="btn btn-ghost" href={VIA.links.verify}>Get verified</ExtLink>
              </Magnetic>
              <Magnetic>
                <ExtLink className="btn btn-ghost" href={VIA.links.post}>Post a job</ExtLink>
              </Magnetic>
            </motion.div>
          </div>

          <motion.div className="via-hero-visual" {...fadeIn(0.3)}>
            <div className="via-hero-glow" aria-hidden="true" />
            <motion.div style={{ y: shotY, rotateY: shotRot, transformPerspective: 1400 }}>
              <BrowserShot shot={VIA_SHOTS[0]} eager />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Problem */}
      <section className="section via-problem" data-shape="1" data-dim="0.3">
        <div className="container">
          <div className="section-head">
            <Reveal as="p" className="eyebrow"><span className="eyebrow-dot" aria-hidden="true" />The problem</Reveal>
            <SplitHeading lines={VIA.problem.title} accent={['easy']} className="h2" />
            <Reveal as="p" className="lead section-lead" delay={0.1}>{VIA.problem.body}</Reveal>
          </div>
          <ul className="via-stats">
            {VIA.problem.stats.map((s) => <Stat key={s.label} {...s} />)}
          </ul>
          <p className="mono via-source">{VIA.problem.source}</p>
        </div>
      </section>

      {/* Product tour: real screens */}
      <section className="section via-tour-section" data-shape="2" data-dim="0.25">
        <div className="container">
          <div className="section-head center">
            <Reveal as="p" className="eyebrow"><span className="eyebrow-dot" aria-hidden="true" />Inside Via</Reveal>
            <SplitHeading lines={['See it', 'for yourself.']} accent={['yourself']} className="h2 center" />
            <Reveal as="p" className="lead center" delay={0.1}>Real screens from via.theivies.in. Pick one to take a look.</Reveal>
          </div>
          <Reveal y={40}>
            <ViaTour />
          </Reveal>
        </div>
      </section>

      {/* Candidates */}
      <section className="section svc-process" data-shape="1" data-dim="0.35">
        <div className="container">
          <div className="section-head">
            <Reveal as="p" className="eyebrow"><span className="eyebrow-dot" aria-hidden="true" />For candidates</Reveal>
            <SplitHeading lines={VIA.candidates.title} accent={['match']} className="h2" />
            <Reveal as="p" className="lead section-lead" delay={0.1}>{VIA.candidates.body}</Reveal>
          </div>
          <motion.ol className="via-steps" {...grid(stagger * 3)}>
            {VIA.candidates.steps.map((s, i) => (
              <motion.li key={s.title} variants={item} className="via-step glass">
                <span className="via-step-k mono" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                <h3>{s.title}</h3>
                <p>{s.body}</p>
              </motion.li>
            ))}
          </motion.ol>
          <Reveal className="via-inline-cta">
            <ExtLink className="btn btn-primary" href={VIA.links.verify}>
              Start verifying <ArrowUpRight size={18} aria-hidden="true" />
            </ExtLink>
          </Reveal>
        </div>
      </section>

      {/* Recruiters */}
      <section className="section svc-offerings" data-shape="2" data-dim="0.3">
        <div className="container">
          <div className="section-head">
            <Reveal as="p" className="eyebrow"><span className="eyebrow-dot" aria-hidden="true" />For recruiters</Reveal>
            <SplitHeading lines={VIA.recruiters.title} accent={['proved']} className="h2" />
            <Reveal as="p" className="lead section-lead" delay={0.1}>{VIA.recruiters.body}</Reveal>
          </div>
          <motion.ul className="via-feature-grid" {...grid()}>
            {VIA.recruiters.features.map((f) => (
              <motion.li key={f.title} variants={item}>
                <TiltCard className="svc-offer" max={5}>
                  <div className="card-spot" aria-hidden="true" />
                  <span className="icon-chip via-chip"><BadgeCheck size={20} aria-hidden="true" /></span>
                  <h3>{f.title}</h3>
                  <p>{f.body}</p>
                </TiltCard>
              </motion.li>
            ))}
          </motion.ul>
        </div>
      </section>

      {/* Pricing */}
      <section className="section via-pricing" data-shape="2" data-dim="0.25">
        <div className="container">
          <div className="section-head center">
            <Reveal as="p" className="eyebrow"><span className="eyebrow-dot" aria-hidden="true" />Pricing</Reveal>
            <SplitHeading lines={['Pay per post.', 'Nothing else.']} accent={['Nothing']} className="h2 center" />
            <Reveal as="p" className="lead center" delay={0.1}>No subscription and no seat fees. Pay once for each job you post.</Reveal>
          </div>
          <motion.ul className="via-price-grid" {...grid(stagger * 2)}>
            {VIA.pricing.map((p) => (
              <motion.li key={p.name} variants={item} className={`via-price ${p.featured ? 'is-featured' : ''}`}>
                {p.featured && <span className="via-price-flag mono">Most visible</span>}
                <h3>{p.name}</h3>
                <p className="via-price-amt"><strong>{p.price}</strong> <span>{p.unit}</span></p>
                <p className="via-price-note mono">{p.note}</p>
                <ul>
                  {p.points.map((x) => (
                    <li key={x}><Check size={14} aria-hidden="true" /> {x}</li>
                  ))}
                </ul>
              </motion.li>
            ))}
          </motion.ul>
          <Reveal className="via-inline-cta center">
            <ExtLink className="btn btn-ghost" href={VIA.links.pricing}>
              Full pricing on Via <ArrowUpRight size={18} aria-hidden="true" />
            </ExtLink>
          </Reveal>
        </div>
      </section>

      {/* Linked jobs */}
      <section className="section svc-stack" data-shape="3" data-dim="0.3">
        <div className="container svc-two-col">
          <div>
            <Reveal as="p" className="eyebrow"><span className="eyebrow-dot" aria-hidden="true" />Linked jobs</Reveal>
            <SplitHeading lines={VIA.linked.title} accent={['web']} className="h2" />
            <Reveal className="via-linked-shot" y={40}>
              <BrowserShot shot={VIA_SHOTS[1]} />
            </Reveal>
          </div>
          <Reveal className="svc-proof glass" y={40}>
            <p>{VIA.linked.body}</p>
            <ul className="via-checks">
              {VIA.linked.points.map((x) => (
                <li key={x}><span className="svc-check" aria-hidden="true"><Check size={14} /></span>{x}</li>
              ))}
            </ul>
            <ExtLink className="svc-proof-link mono" href={VIA.links.jobs}>
              Browse jobs on Via <ArrowRight size={14} aria-hidden="true" />
            </ExtLink>
          </Reveal>
        </div>
      </section>

      {/* AI behind Via */}
      <section className="section via-ai" data-shape="2" data-dim="0.35">
        <div className="container">
          <div className="section-head">
            <Reveal as="p" className="eyebrow"><span className="eyebrow-dot" aria-hidden="true" />Built by Ivies</Reveal>
            <SplitHeading lines={VIA.ai.title} accent={['Via']} className="h2" />
            <Reveal as="p" className="lead section-lead" delay={0.1}>{VIA.ai.body}</Reveal>
          </div>
          <motion.ul className="via-feature-grid" {...grid()}>
            {VIA.ai.items.map((a, i) => {
              const Icon = AI_ICONS[i]
              return (
                <motion.li key={a.title} variants={item}>
                  <TiltCard className="svc-offer" max={5}>
                    <div className="card-spot" aria-hidden="true" />
                    <span className="icon-chip"><Icon size={20} aria-hidden="true" /></span>
                    <h3>{a.title}</h3>
                    <p>{a.body}</p>
                    <a className="svc-offer-more mono" href={pageHref(a.href)}>
                      Related service <ArrowRight size={14} aria-hidden="true" />
                    </a>
                  </TiltCard>
                </motion.li>
              )
            })}
          </motion.ul>
        </div>
      </section>

      <FAQ
        id="via-faq"
        items={VIA.faqs}
        eyebrow="Via FAQ"
        lines={['Questions', 'about Via.']}
        lead="What candidates and recruiters ask most about Via."
        shape={1}
      />

      {/* Closing CTA */}
      <section className="section via-cta-band" data-shape="0" data-dim="0.4">
        <div className="container">
          <Reveal className="ai-cta glass via-cta">
            <div>
              <h2 className="via-cta-title">Hiring that blooms on trust.</h2>
              <p>Find real jobs, verify your skills once, or post a job and hear only from people who proved it.</p>
            </div>
            <div className="via-cta-btns">
              <Magnetic>
                <ExtLink className="btn btn-primary" href={VIA.links.open}>
                  Open Via <ArrowUpRight size={18} aria-hidden="true" />
                </ExtLink>
              </Magnetic>
              <Magnetic>
                <ExtLink className="btn btn-ghost" href={VIA.links.post}>Post a job</ExtLink>
              </Magnetic>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
