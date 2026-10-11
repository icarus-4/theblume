import { motion, useReducedMotion } from 'framer-motion'
import { Landmark, GraduationCap, HeartPulse, ShoppingBag, Truck, Building2, Factory, Rocket } from 'lucide-react'
import { INDUSTRIES } from '../content'
import { SplitHeading, Reveal } from './fx'
import { dur, ease, stagger, viewport } from '../motion'

const ICONS = [Landmark, GraduationCap, HeartPulse, ShoppingBag, Truck, Building2, Factory, Rocket]

export default function Industries() {
  const reduce = useReducedMotion()
  return (
    <section id="industries" className="section industries" data-shape="4" data-dim="0.45">
      <div className="container">
        <div className="section-head">
          <Reveal as="p" className="eyebrow"><span className="eyebrow-dot" aria-hidden="true" />Industries</Reveal>
          <SplitHeading lines={['Different fields.', 'One tech partner.']} accent={['One']} className="h2" />
        </div>
        <motion.ul
          className="industry-grid"
          initial={reduce ? false : 'hidden'}
          whileInView="show"
          viewport={viewport}
          transition={{ staggerChildren: stagger }}
        >
          {INDUSTRIES.map((ind, i) => {
            const I = ICONS[i]
            return (
              <motion.li
                key={ind.name}
                className="industry"
                tabIndex={0}
                data-cursor
                variants={{
                  hidden: { opacity: 0, y: 30, filter: 'blur(8px)' },
                  show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: dur.slow, ease: ease.out } },
                }}
              >
                <span className="industry-scan" aria-hidden="true" />
                <I size={26} className="industry-icon" aria-hidden="true" />
                <h3>{ind.name}</h3>
                <p>{ind.body}</p>
                <span className="mono industry-k" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
              </motion.li>
            )
          })}
        </motion.ul>
      </div>
    </section>
  )
}
