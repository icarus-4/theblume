import { useId, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Plus } from 'lucide-react'
import { FAQS } from '../content'
import { SplitHeading, Reveal } from './fx'
import { dur, ease, stagger, viewport } from '../motion'

// Answers stay in the HTML even when collapsed, so search engines and AI
// crawlers can read every one of them.
export default function FAQ({
  id = 'faq',
  items = FAQS,
  eyebrow = 'FAQ',
  lines = ['Questions,', 'answered.'],
  lead = 'Straight answers about our AI development, software and app services.',
  shape = 4,
}) {
  const uid = useId()
  const reduce = useReducedMotion()
  const [open, setOpen] = useState(0)

  return (
    <section id={id} className="section faq" data-shape={shape} data-dim="0.3">
      <div className="container faq-grid">
        <div className="section-head sticky-head">
          <Reveal as="p" className="eyebrow"><span className="eyebrow-dot" aria-hidden="true" />{eyebrow}</Reveal>
          <SplitHeading lines={lines} accent={[lines[lines.length - 1].replace(/[.,?]/g, '')]} className="h2" />
          <Reveal as="p" className="lead" delay={0.15}>{lead}</Reveal>
        </div>

        <motion.div
          className="faq-list"
          initial={reduce ? false : 'hidden'}
          whileInView="show"
          viewport={viewport}
          transition={{ staggerChildren: stagger }}
        >
          {items.map((f, i) => {
            const isOpen = open === i
            const btn = `${uid}-q${i}`
            const panel = `${uid}-a${i}`
            return (
              <motion.div
                key={f.q}
                className={`faq-item ${isOpen ? 'is-open' : ''}`}
                variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: dur.base, ease: ease.out } } }}
              >
                <h3>
                  <button id={btn} type="button" aria-expanded={isOpen} aria-controls={panel} onClick={() => setOpen(isOpen ? -1 : i)}>
                    <span>{f.q}</span>
                    <span className="faq-icon" aria-hidden="true"><Plus size={18} /></span>
                  </button>
                </h3>
                <div className="faq-panel" id={panel} role="region" aria-labelledby={btn}>
                  <div>
                    <p>{f.a}</p>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
