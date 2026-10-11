import { Fragment, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { ArrowDown, ArrowUpRight, Sparkles } from 'lucide-react'
import { HERO } from '../content'
import { Magnetic } from './fx'
import { dur, ease } from '../motion'

const pillSpots = [
  { top: '24%', right: '6%' },
  { top: '46%', right: '30%' },
  { top: '62%', right: '3%' },
  { top: '76%', right: '22%' },
  { top: '36%', right: '42%' },
]

function RotatingWord({ words, ready }) {
  const reduce = useReducedMotion()
  const [i, setI] = useState(0)
  const [paused, setPaused] = useState(false)
  useEffect(() => {
    if (reduce || paused || !ready) return
    const id = setInterval(() => setI((v) => (v + 1) % words.length), 2200)
    return () => clearInterval(id)
  }, [reduce, paused, ready, words.length])
  return (
    <span
      className="rotator"
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      aria-live="off"
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={words[i]}
          className="rotator-word"
          initial={{ y: '100%', opacity: 0, filter: 'blur(6px)' }}
          animate={{ y: '0%', opacity: 1, filter: 'blur(0px)' }}
          exit={{ y: '-100%', opacity: 0, filter: 'blur(6px)', transition: { duration: dur.exit, ease: ease.in } }}
          transition={{ duration: dur.base, ease: ease.out }}
        >
          {words[i]}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}

export default function Hero({ ready, onNavigate, onStartProject }) {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['0%', reduce ? '0%' : '-18%'])
  const opacity = useTransform(scrollYProgress, [0, 0.75], [1, reduce ? 1 : 0])
  const show = ready ? 'show' : 'hidden'

  const word = {
    hidden: { y: '115%' },
    show: (i) => ({ y: '0%', transition: { delay: 0.1 + i * 0.07, duration: 1.1, ease: ease.out } }),
  }
  let wi = 0

  return (
    <section id="top" ref={ref} className="hero" data-shape="0" data-dim="1">
      <motion.div className="hero-inner container" style={{ y, opacity }}>
        {/* One h1: the keyword line plus the headline. */}
        <h1 className="hero-h1">
          <motion.span
            className="eyebrow"
            initial={{ opacity: 0, y: 12 }}
            animate={ready ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: dur.slow, ease: ease.out }}
          >
            <span className="eyebrow-dot" aria-hidden="true" />
            {HERO.eyebrow}
          </motion.span>
          <span className="sr-only"> — </span>
          <span className="hero-title">
            {HERO.lines.map((line, li) => (
              <span className="split-line" key={li}>
                {line.split(' ').map((w, k) => {
                  const idx = wi++
                  return (
                    <Fragment key={k}>
                      {k > 0 && ' '}
                      <span className="split-mask">
                        <motion.span
                          className={`split-word ${w.startsWith('intelligent') ? 'text-gradient' : ''}`}
                          custom={idx}
                          variants={word}
                          initial={reduce ? false : 'hidden'}
                          animate={show}
                        >
                          {w}
                        </motion.span>
                      </span>
                    </Fragment>
                  )
                })}{' '}
              </span>
            ))}
          </span>
        </h1>

        <motion.div
          className="hero-sub"
          initial={{ opacity: 0, y: 20 }}
          animate={ready ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.55, duration: dur.slow, ease: ease.out }}
        >
          <p className="hero-build">
            <Sparkles size={18} aria-hidden="true" className="text-accent" /> We build <RotatingWord words={HERO.rotating} ready={ready} />
          </p>
          <p className="lead">{HERO.sub}</p>
        </motion.div>

        <motion.div
          className="hero-ctas"
          initial={{ opacity: 0, y: 20 }}
          animate={ready ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.7, duration: dur.slow, ease: ease.out }}
        >
          <Magnetic>
            <button type="button" className="btn btn-primary" onClick={onStartProject} aria-haspopup="dialog">
              Start a project <ArrowUpRight size={18} aria-hidden="true" />
            </button>
          </Magnetic>
          <Magnetic>
            <a href="#services" className="btn btn-ghost" onClick={(e) => (e.preventDefault(), onNavigate('services'))}>
              Explore services
            </a>
          </Magnetic>
        </motion.div>
      </motion.div>

      {/* Industry pills float around the particle tree, like satellites. */}
      <div className="hero-pills" aria-hidden="true">
        {HERO.pills.map((p, i) => (
          <motion.span
            key={p}
            className="glass-pill"
            style={pillSpots[i]}
            initial={{ opacity: 0, scale: 0.7 }}
            animate={ready ? { opacity: 1, scale: 1, y: reduce ? 0 : [0, -10, 0] } : {}}
            transition={{
              opacity: { delay: 0.9 + i * 0.12, duration: dur.slow },
              scale: { delay: 0.9 + i * 0.12, ...{ type: 'spring', stiffness: 160, damping: 16 } },
              y: { delay: 1.5 + i * 0.3, duration: 4 + i * 0.6, repeat: Infinity, ease: 'easeInOut' },
            }}
          >
            <span className="pill-dot" /> {p}
          </motion.span>
        ))}
      </div>

      <motion.a
        href="#services"
        className="scroll-cue"
        onClick={(e) => (e.preventDefault(), onNavigate('services'))}
        initial={{ opacity: 0 }}
        animate={ready ? { opacity: 1 } : {}}
        transition={{ delay: 1.4, duration: dur.slow }}
      >
        <span className="mono">Scroll</span>
        <span className="scroll-cue-track" aria-hidden="true">
          <ArrowDown size={14} />
        </span>
      </motion.a>
    </section>
  )
}
