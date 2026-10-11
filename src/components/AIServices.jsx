import { motion, useReducedMotion } from 'framer-motion'
import { Sparkles, Bot, FileSearch, MessagesSquare, Plug, LineChart, ScanText, Gauge, ArrowUpRight } from 'lucide-react'
import { AI_SERVICES } from '../content'
import { pageHref } from '../routes'
import { SplitHeading, Reveal, Magnetic } from './fx'
import { dur, ease, stagger, viewport } from '../motion'

const ICONS = { genai: Sparkles, agents: Bot, rag: FileSearch, chatbots: MessagesSquare, integration: Plug, ml: LineChart, vision: ScanText, mlops: Gauge }

export default function AIServices({ onStartProject }) {
  const reduce = useReducedMotion()
  return (
    <section id="ai-development" className="section ai-services" data-shape="2" data-dim="0.25">
      <div className="container">
        <div className="section-head">
          <Reveal as="p" className="eyebrow"><span className="eyebrow-dot" aria-hidden="true" />AI development company</Reveal>
          <SplitHeading lines={['AI development services,', 'end to end.']} accent={['AI', 'development']} className="h2" />
          <Reveal as="p" className="lead section-lead" delay={0.15}>
            From a first proof of concept to AI running in production: generative AI, AI agents, RAG assistants, machine learning
            and AI integration into the software you already use.
          </Reveal>
        </div>
        <motion.ul
          className="ai-grid-services"
          initial={reduce ? false : 'hidden'}
          whileInView="show"
          viewport={viewport}
          transition={{ staggerChildren: stagger * 1.5 }}
        >
          {AI_SERVICES.map((s, i) => {
            const Icon = ICONS[s.key]
            return (
              <motion.li
                key={s.key}
                className="ai-svc"
                data-cursor
                variants={{
                  hidden: { opacity: 0, y: 36, filter: 'blur(6px)' },
                  show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: dur.slow, ease: ease.out } },
                }}
              >
                <span className="ai-svc-ring" aria-hidden="true" />
                <div className="ai-svc-inner">
                  <div className="ai-svc-top">
                    <span className="ai-svc-icon"><Icon size={22} aria-hidden="true" /></span>
                    <span className="mono ai-svc-k" aria-hidden="true">AI.{String(i + 1).padStart(2, '0')}</span>
                  </div>
                  <h3><a className="stretched" href={pageHref(s.page)}>{s.title}</a></h3>
                  <p>{s.body}</p>
                  <ul className="tag-list" aria-label={`${s.title} capabilities`}>
                    {s.stack.map((t) => <li key={t}>{t}</li>)}
                  </ul>
                </div>
              </motion.li>
            )
          })}
        </motion.ul>

        <Reveal className="ai-cta glass" y={30}>
          <div>
            <h3>Have an AI idea, or a product that needs AI?</h3>
            <p>Tell us what you want to automate, predict or build. We’ll map where AI creates real value before anything is built.</p>
          </div>
          <Magnetic>
            <button type="button" className="btn btn-primary" onClick={onStartProject} aria-haspopup="dialog">
              Discuss your AI project <ArrowUpRight size={18} aria-hidden="true" />
            </button>
          </Magnetic>
        </Reveal>
      </div>
    </section>
  )
}
