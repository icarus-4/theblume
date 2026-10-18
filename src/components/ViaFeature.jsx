import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { ArrowRight, ArrowUpRight, Check } from 'lucide-react'
import { VIA } from '../via-data'
import { pageHref } from '../routes'
import { Reveal, Magnetic } from './fx'
import { ViaScreen } from './ViaMock'
import '../via-page.css'

// Home-page spotlight for Via, Ivies' main product. Links to /via/.
export default function ViaFeature() {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [60, -60])

  return (
    <section id="via" ref={ref} className="section" data-shape="0" data-dim="0.35">
      <div className="container">
        <Reveal className="via-feature" y={50}>
          <div className="via-feature-copy">
            <p className="eyebrow"><span className="eyebrow-dot" aria-hidden="true" />Our product</p>
            <span className="via-wordmark" aria-hidden="true">Via</span>
            <h2>Hiring that blooms on trust.</h2>
            <p>{VIA.lead}</p>
            <ul className="via-checks">
              {['Skills verified in a spoken AI interview', 'Only matching candidates can apply', 'Every applicant gets an answer'].map((x) => (
                <li key={x}><span className="svc-check" aria-hidden="true"><Check size={14} /></span>{x}</li>
              ))}
            </ul>
            <div className="hero-ctas">
              <Magnetic>
                <a className="btn btn-primary" href={pageHref('via')}>
                  Explore Via <ArrowRight size={18} aria-hidden="true" />
                </a>
              </Magnetic>
              <Magnetic>
                <a className="btn btn-ghost" href={VIA.links.open} target="_blank" rel="noopener noreferrer">
                  via.theivies.in <ArrowUpRight size={18} aria-hidden="true" />
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              </Magnetic>
            </div>
          </div>
          <motion.div className="via-feature-phone" style={{ y }}>
            <div className="phone-frame">
              <span className="phone-cam" aria-hidden="true" />
              <ViaScreen />
            </div>
          </motion.div>
        </Reveal>
      </div>
    </section>
  )
}
