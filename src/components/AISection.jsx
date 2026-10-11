import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll } from 'framer-motion'
import { Bot, User, Cpu } from 'lucide-react'
import { AI_STEPS, AI_CONSOLE } from '../content'
import { SplitHeading, Reveal } from './fx'
import { dur, ease } from '../motion'

function Typewriter({ text, speed = 14 }) {
  const reduce = useReducedMotion()
  const [n, setN] = useState(reduce ? text.length : 0)
  useEffect(() => {
    if (reduce) return
    let i = 0
    const id = setInterval(() => {
      i += 2
      setN(Math.min(i, text.length))
      if (i >= text.length) clearInterval(id)
    }, speed)
    return () => clearInterval(id)
  }, [text, speed, reduce])
  return (
    <>
      <span>{text.slice(0, n)}</span>
      {n < text.length && <span className="caret" aria-hidden="true" />}
    </>
  )
}

// Tall section with a sticky stage: scrolling advances the steps and the
// console conversation. Normal scrolling — nothing is hijacked.
export default function AISection() {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const [step, setStep] = useState(reduce ? AI_STEPS.length - 1 : 0)
  const [progress, setProgress] = useState(0)

  useMotionValueEvent(scrollYProgress, 'change', (p) => {
    setProgress(p)
    if (!reduce) setStep(Math.min(AI_STEPS.length - 1, Math.floor(p * AI_STEPS.length * 0.999)))
  })

  const shown = reduce ? AI_CONSOLE.length : Math.min(AI_CONSOLE.length, step === 0 ? 1 : step >= 2 ? 3 : 2)

  return (
    <section id="ai" ref={ref} className="ai-section" data-shape="2" data-dim="0.9">
      <div className="ai-sticky">
        <div className="container ai-grid">
          <div className="ai-copy">
            <Reveal as="p" className="eyebrow"><span className="eyebrow-dot" aria-hidden="true" />AI, woven in</Reveal>
            <SplitHeading lines={['Intelligence in', 'every line of code.']} accent={['Intelligence']} className="h2" />
            <ol className="ai-steps">
              {AI_STEPS.map((s, i) => (
                <li key={s.k} className={i === step ? 'is-active' : i < step ? 'is-done' : ''}>
                  <span className="mono step-k">{s.k}</span>
                  <div>
                    <h3>{s.title}</h3>
                    <AnimatePresence initial={false}>
                      {(i === step || reduce) && (
                        <motion.p
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0, transition: { duration: dur.exit, ease: ease.in } }}
                          transition={{ duration: dur.base, ease: ease.out }}
                        >
                          {s.body}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                </li>
              ))}
            </ol>
            <div className="ai-progress" aria-hidden="true">
              <span style={{ transform: `scaleX(${progress})` }} />
            </div>
          </div>

          <Reveal className="console" y={60}>
            <div className="console-bar">
              <span className="dots" aria-hidden="true"><i /><i /><i /></span>
              <span className="mono">blume-agent · live</span>
              <span className="console-chip mono"><Cpu size={13} aria-hidden="true" /> {AI_STEPS[step].title.toLowerCase()}</span>
            </div>
            <div className="console-body" aria-live="polite">
              {AI_CONSOLE.slice(0, shown).map((m, i) => (
                <motion.div
                  key={i}
                  className={`msg msg-${m.role}`}
                  initial={reduce ? false : { opacity: 0, y: 16, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: dur.base, ease: ease.out }}
                >
                  <span className="msg-avatar" aria-hidden="true">{m.role === 'user' ? <User size={14} /> : <Bot size={14} />}</span>
                  <p><Typewriter text={m.text} /></p>
                </motion.div>
              ))}
              {shown < AI_CONSOLE.length && (
                <div className="msg msg-agent thinking" aria-label="Agent is thinking">
                  <span className="msg-avatar" aria-hidden="true"><Bot size={14} /></span>
                  <span className="think-dots" aria-hidden="true"><i /><i /><i /></span>
                </div>
              )}
            </div>
            <div className="console-meter mono" aria-hidden="true">
              {['tokens/s', 'latency', 'accuracy'].map((k, i) => (
                <div key={k}>
                  <span>{k}</span>
                  <b>{[`${180 + step * 37}`, `${(220 - step * 31)}ms`, `${(94 + step * 1.3).toFixed(1)}%`][i]}</b>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
