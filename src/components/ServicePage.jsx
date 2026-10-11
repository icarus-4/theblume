import { Fragment, useRef } from 'react'
import { motion, useMotionValue, useReducedMotion, useScroll, useSpring } from 'framer-motion'
import { ArrowUpRight, ArrowRight, ChevronRight, Sparkles, BadgeCheck, Check } from 'lucide-react'
import { pageBySlug } from '../services-data'
import { pageHref } from '../routes'
import { SplitHeading, Reveal, Magnetic, TiltCard } from './fx'
import FAQ from './FAQ'
import { dur, ease, stagger, viewport } from '../motion'
import '../service-page.css'

export function Breadcrumbs({ trail }) {
  return (
    <nav className="breadcrumbs mono" aria-label="Breadcrumb">
      <ol>
        {trail.map(([label, href], i) => (
          <li key={label}>
            {i > 0 && <ChevronRight size={12} aria-hidden="true" />}
            {href ? <a href={href}>{label}</a> : <span aria-current="page">{label}</span>}
          </li>
        ))}
      </ol>
    </nav>
  )
}

// Headline split into masked words, animated on load (not on scroll).
function HeroTitle({ text }) {
  const reduce = useReducedMotion()
  const words = text.split(' ')
  return (
    <h1 className="svc-h1">
      {words.map((w, i) => (
        <Fragment key={i}>
          {i > 0 && ' '}
          <span className="split-mask">
            <motion.span
              className={`split-word ${/^(AI|Generative|Machine|Mobile|Custom|Cloud|UI\/UX|IT)$/.test(w) ? 'text-gradient' : ''}`}
              initial={reduce ? false : { y: '110%' }}
              animate={{ y: '0%' }}
              transition={{ delay: 0.1 + i * 0.07, duration: 1, ease: ease.out }}
            >
              {i === 0 ? w.charAt(0).toUpperCase() + w.slice(1) : w}
            </motion.span>
          </span>
        </Fragment>
      ))}
    </h1>
  )
}

function Steps({ steps }) {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 75%', 'end 55%'] })
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 })
  const full = useMotionValue(1)
  return (
    <ol className="svc-steps" ref={ref}>
      <svg className="svc-steps-line" viewBox="0 0 100 4" preserveAspectRatio="none" aria-hidden="true">
        <line x1="0" y1="2" x2="100" y2="2" className="vine-bg" />
        <motion.line x1="0" y1="2" x2="100" y2="2" className="vine-fg" style={{ pathLength: reduce ? full : progress }} />
      </svg>
      {steps.map((s, i) => (
        <Reveal as="li" key={s.title} className="svc-step" delay={i * 0.08} y={30}>
          <span className="svc-step-node mono" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
          <h3>{s.title}</h3>
          <p>{s.body}</p>
        </Reveal>
      ))}
    </ol>
  )
}

export default function ServicePage({ page, onStartProject }) {
  const reduce = useReducedMotion()
  const grid = (delayStep = stagger * 1.5) => ({
    initial: reduce ? false : 'hidden',
    whileInView: 'show',
    viewport,
    transition: { staggerChildren: delayStep },
  })
  const item = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: dur.slow, ease: ease.out } },
  }
  const related = page.related.map((s) => pageBySlug[s]).filter(Boolean)

  return (
    <>
      {/* Hero */}
      <section className="svc-hero" data-shape={page.shape} data-dim="0.9">
        <div className="container svc-hero-inner">
          <Breadcrumbs trail={[['Home', pageHref()], ['Services', pageHref('services')], [page.navTitle]]} />
          <motion.p className="eyebrow" initial={reduce ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: dur.slow, ease: ease.out }}>
            <span className="eyebrow-dot" aria-hidden="true" />{page.eyebrow}
          </motion.p>
          <HeroTitle text={page.h1} />
          <motion.p className="lead svc-lead" initial={reduce ? false : { opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45, duration: dur.slow, ease: ease.out }}>
            {page.lead}
          </motion.p>
          <motion.div className="hero-ctas" initial={reduce ? false : { opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: dur.slow, ease: ease.out }}>
            <Magnetic>
              <button type="button" className="btn btn-primary" onClick={onStartProject} aria-haspopup="dialog">
                Start a project <ArrowUpRight size={18} aria-hidden="true" />
              </button>
            </Magnetic>
            <Magnetic>
              <a className="btn btn-ghost" href={pageHref('services')}>All services</a>
            </Magnetic>
          </motion.div>
          <motion.ul
            className="svc-hero-stack"
            aria-label="Technologies"
            initial={reduce ? false : 'hidden'}
            animate="show"
            transition={{ staggerChildren: 0.04, delayChildren: 0.8 }}
          >
            {page.stack.slice(0, 6).map((t) => (
              <motion.li key={t} variants={{ hidden: { opacity: 0, scale: 0.8 }, show: { opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 260, damping: 20 } } }}>{t}</motion.li>
            ))}
          </motion.ul>
        </div>
      </section>

      {/* Overview */}
      <section className="section svc-overview" data-shape={page.shape} data-dim="0.35">
        <div className="container svc-two-col">
          <div className="section-head sticky-head">
            <Reveal as="p" className="eyebrow"><span className="eyebrow-dot" aria-hidden="true" />Overview</Reveal>
            <SplitHeading lines={[`${page.navTitle},`, 'explained.']} accent={['explained']} className="h2" />
          </div>
          <div className="svc-prose">
            {page.overview.map((para, i) => (
              <Reveal as="p" key={i} delay={i * 0.08}>{para}</Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Offerings */}
      <section className="section svc-offerings" data-shape={page.shape} data-dim="0.3">
        <div className="container">
          <div className="section-head">
            <Reveal as="p" className="eyebrow"><span className="eyebrow-dot" aria-hidden="true" />What we deliver</Reveal>
            <SplitHeading lines={[`${page.navTitle} services`, 'we deliver.']} accent={['deliver']} className="h2" />
          </div>
          <motion.ul className="svc-offer-grid" {...grid()}>
            {page.offerings.map((o, i) => (
              <motion.li key={o.title} variants={item}>
                <TiltCard className="svc-offer" max={5}>
                  <div className="card-spot" aria-hidden="true" />
                  <span className="mono svc-offer-k" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                  <h3>
                    {o.href ? <a className="stretched" href={pageHref(o.href)}>{o.title}</a> : o.title}
                  </h3>
                  <p>{o.body}</p>
                  {o.href && <span className="svc-offer-more mono" aria-hidden="true">Explore <ArrowRight size={14} /></span>}
                </TiltCard>
              </motion.li>
            ))}
          </motion.ul>
        </div>
      </section>

      {/* Use cases */}
      <section className="section svc-usecases" data-shape={page.shape} data-dim="0.3">
        <div className="container">
          <div className="section-head">
            <Reveal as="p" className="eyebrow"><span className="eyebrow-dot" aria-hidden="true" />Use cases</Reveal>
            <SplitHeading lines={['Where it creates', 'real value.']} accent={['value']} className="h2" />
          </div>
          <motion.ul className="svc-uses" {...grid(stagger * 2)}>
            {page.useCases.map((u) => (
              <motion.li key={u.industry} variants={item} className="svc-use">
                <span className="svc-use-scan" aria-hidden="true" />
                <h3>{u.industry}</h3>
                <p>{u.body}</p>
              </motion.li>
            ))}
          </motion.ul>
        </div>
      </section>

      {/* Process */}
      <section className="section svc-process" data-shape={page.shape} data-dim="0.4">
        <div className="container">
          <div className="section-head">
            <Reveal as="p" className="eyebrow"><span className="eyebrow-dot" aria-hidden="true" />How we deliver</Reveal>
            <SplitHeading lines={['A clear path from', 'idea to launch.']} accent={['launch']} className="h2" />
          </div>
          <Steps steps={page.process} />
          {page.deliverables && (
            <div className="svc-deliver glass">
              <h3>What you receive</h3>
              <motion.ul {...grid(0.06)}>
                {page.deliverables.map((d) => (
                  <motion.li key={d} variants={{ hidden: { opacity: 0, x: -12 }, show: { opacity: 1, x: 0, transition: { duration: dur.base, ease: ease.out } } }}>
                    <span className="svc-check" aria-hidden="true"><Check size={14} /></span>
                    {d}
                  </motion.li>
                ))}
              </motion.ul>
            </div>
          )}
        </div>
      </section>

      {/* Stack + proof */}
      <section className="section svc-stack" data-shape={page.shape} data-dim="0.35">
        <div className="container svc-two-col">
          <div>
            <Reveal as="p" className="eyebrow"><span className="eyebrow-dot" aria-hidden="true" />Technology</Reveal>
            <SplitHeading lines={['Tools we', 'build with.']} accent={['build']} className="h2" />
            <motion.ul className="svc-chips" aria-label="Technologies we use" {...grid(0.03)}>
              {page.stack.map((t) => (
                <motion.li key={t} variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: dur.base, ease: ease.out } } }}>{t}</motion.li>
              ))}
            </motion.ul>
          </div>
          {page.proof && (
            <Reveal className="svc-proof glass" y={40}>
              <span className="icon-chip"><BadgeCheck size={20} aria-hidden="true" /></span>
              <h3>{page.proof.title}</h3>
              <p>{page.proof.body}</p>
              <a className="svc-proof-link mono" href={`${pageHref()}#apps`}>See our products <ArrowRight size={14} aria-hidden="true" /></a>
            </Reveal>
          )}
        </div>
      </section>

      {/* FAQ */}
      <FAQ
        id="service-faq"
        items={page.faqs}
        eyebrow={`${page.navTitle} FAQ`}
        lines={['Common', 'questions.']}
        lead={`Answers to what clients ask most about our ${page.navTitle.toLowerCase()} services.`}
        shape={page.shape}
      />

      {/* Related */}
      <section className="section svc-related" data-shape={page.shape} data-dim="0.3">
        <div className="container">
          <div className="section-head">
            <Reveal as="p" className="eyebrow"><span className="eyebrow-dot" aria-hidden="true" />Related</Reveal>
            <SplitHeading lines={['Related services']} accent={['Related']} className="h2" />
          </div>
          <motion.ul className="svc-related-grid" {...grid(stagger * 2)}>
            {related.map((r) => (
              <motion.li key={r.slug} variants={item}>
                <a className="svc-related-card" href={pageHref(r.slug)}>
                  <Sparkles size={18} className="text-accent" aria-hidden="true" />
                  <span className="svc-related-title">{r.navTitle}</span>
                  <span className="svc-related-body">{r.metaDescription}</span>
                  <span className="svc-related-go" aria-hidden="true"><ArrowUpRight size={18} /></span>
                </a>
              </motion.li>
            ))}
          </motion.ul>
        </div>
      </section>
    </>
  )
}
