import { motion, useReducedMotion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { SERVICE_PAGES, SERVICES_HUB } from '../services-data'
import { pageHref } from '../routes'
import { SplitHeading, Reveal, Magnetic, TiltCard } from './fx'
import { Breadcrumbs } from './ServicePage'
import { dur, ease, stagger, viewport } from '../motion'
import '../service-page.css'

export default function ServicesHub({ onStartProject }) {
  const reduce = useReducedMotion()
  return (
    <>
      <section className="svc-hero" data-shape="1" data-dim="0.9">
        <div className="container svc-hero-inner">
          <Breadcrumbs trail={[['Home', pageHref()], ['Services']]} />
          <motion.p className="eyebrow" initial={reduce ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: dur.slow, ease: ease.out }}>
            <span className="eyebrow-dot" aria-hidden="true" />AI, software & app development
          </motion.p>
          <h1 className="svc-h1">
            <span className="split-mask">
              <motion.span className="split-word" initial={reduce ? false : { y: '110%' }} animate={{ y: '0%' }} transition={{ duration: 1, ease: ease.out }}>
                Technology
              </motion.span>
            </span>{' '}
            <span className="split-mask">
              <motion.span className="split-word text-gradient" initial={reduce ? false : { y: '110%' }} animate={{ y: '0%' }} transition={{ delay: 0.08, duration: 1, ease: ease.out }}>
                services
              </motion.span>
            </span>
          </h1>
          <motion.p className="lead svc-lead" initial={reduce ? false : { opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: dur.slow, ease: ease.out }}>
            {SERVICES_HUB.lead}
          </motion.p>
          <motion.div className="hero-ctas" initial={reduce ? false : { opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55, duration: dur.slow, ease: ease.out }}>
            <Magnetic>
              <button type="button" className="btn btn-primary" onClick={onStartProject} aria-haspopup="dialog">
                Start a project <ArrowUpRight size={18} aria-hidden="true" />
              </button>
            </Magnetic>
          </motion.div>
        </div>
      </section>

      {SERVICES_HUB.groups.map((g, gi) => (
        <section key={g.kind} className="section hub-group" data-shape={[2, 1, 3][gi]} data-dim="0.3">
          <div className="container">
            <div className="section-head">
              <Reveal as="p" className="eyebrow"><span className="eyebrow-dot" aria-hidden="true" />{String(gi + 1).padStart(2, '0')}</Reveal>
              <SplitHeading lines={[g.title]} className="h2" />
              <Reveal as="p" className="lead section-lead" delay={0.1}>{g.intro}</Reveal>
            </div>
            <motion.ul
              className="hub-grid"
              initial={reduce ? false : 'hidden'}
              whileInView="show"
              viewport={viewport}
              transition={{ staggerChildren: stagger * 1.5 }}
            >
              {SERVICE_PAGES.filter((p) => p.kind === g.kind).map((p) => (
                <motion.li
                  key={p.slug}
                  variants={{ hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0, transition: { duration: dur.slow, ease: ease.out } } }}
                >
                  <TiltCard className="svc-offer hub-card" max={5}>
                    <div className="card-spot" aria-hidden="true" />
                    <h3><a className="stretched" href={pageHref(p.slug)}>{p.navTitle}</a></h3>
                    <p>{p.lead}</p>
                    <span className="svc-offer-more mono" aria-hidden="true">Explore <ArrowUpRight size={14} /></span>
                  </TiltCard>
                </motion.li>
              ))}
            </motion.ul>
          </div>
        </section>
      ))}
    </>
  )
}
