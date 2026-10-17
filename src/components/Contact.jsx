import { useState } from 'react'
import { ArrowUpRight, Copy, Check, Mail } from 'lucide-react'
import { CONTACT_EMAIL } from '../content'
import { Magnetic, Reveal, SplitHeading } from './fx'

export default function Contact({ onStartProject }) {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(CONTACT_EMAIL)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      /* clipboard blocked — the mailto link still works */
    }
  }

  // The particles gather into the Ivies logo behind this section.
  return (
    <section id="contact" className="section contact" data-shape="5" data-dim="0.95">
      <div className="contact-spacer" aria-hidden="true" />
      <div className="container contact-inner">
        <Reveal as="p" className="eyebrow center"><span className="eyebrow-dot" aria-hidden="true" />Let’s talk</Reveal>
        <SplitHeading lines={['Let’s make your', 'idea bloom.']} accent={['bloom']} className="h2 h2-xxl center" />
        <Reveal as="p" className="lead center" delay={0.15}>
          Tell us what you’re building. We’ll get back to you with clear next steps.
        </Reveal>
        <Reveal className="contact-ctas" delay={0.25}>
          <Magnetic strength={0.4}>
            <button type="button" className="btn btn-primary btn-lg" onClick={onStartProject} aria-haspopup="dialog">
              <Mail size={20} aria-hidden="true" /> Start a project <ArrowUpRight size={20} aria-hidden="true" />
            </button>
          </Magnetic>
          <button className="btn btn-ghost btn-lg" onClick={copy} aria-live="polite">
            {copied ? <Check size={18} aria-hidden="true" /> : <Copy size={18} aria-hidden="true" />}
            {copied ? 'Copied!' : CONTACT_EMAIL}
          </button>
        </Reveal>
      </div>
    </section>
  )
}
