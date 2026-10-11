import { Fragment, useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion'
import { dur, ease, spring, stagger, viewport } from '../motion'

// Word-by-word masked reveal. Only for short headlines (< ~8 words per line).
export function SplitHeading({ lines, as: Tag = 'h2', className = '', delay = 0, accent }) {
  const reduce = useReducedMotion()
  const MotionTag = motion[Tag]
  return (
    <MotionTag
      className={className}
      initial={reduce ? false : 'hidden'}
      whileInView="show"
      viewport={viewport}
      transition={{ staggerChildren: stagger * 1.5, delayChildren: delay }}
    >
      {lines.map((line, li) => (
        <span className="split-line" key={li}>
          {line.split(' ').map((word, wi) => {
            const isAccent = accent && accent.includes(word.replace(/[.,]/g, ''))
            // a real space between masks keeps the text readable to crawlers
            return (
              <Fragment key={wi}>
                {wi > 0 && ' '}
                <span className="split-mask">
                  <motion.span
                    className={`split-word${isAccent ? ' text-accent' : ''}`}
                    variants={{
                      hidden: { y: '110%', rotate: 4 },
                      show: { y: '0%', rotate: 0, transition: { duration: dur.slow, ease: ease.out } },
                    }}
                  >
                    {word}
                  </motion.span>
                </span>
              </Fragment>
            )
          })}{' '}
        </span>
      ))}
    </MotionTag>
  )
}

// Fade + rise when scrolled into view.
export function Reveal({ children, delay = 0, y = 28, className = '', as = 'div', ...rest }) {
  const reduce = useReducedMotion()
  const M = motion[as]
  return (
    <M
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={viewport}
      transition={{ duration: dur.slow, ease: ease.out, delay }}
      {...rest}
    >
      {children}
    </M>
  )
}

// Pulls toward the cursor while hovered (fine pointers only).
export function Magnetic({ children, strength = 0.35, className = '' }) {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, spring.soft)
  const sy = useSpring(y, spring.soft)
  const onMove = (e) => {
    if (reduce || e.pointerType !== 'mouse') return
    const r = ref.current.getBoundingClientRect()
    x.set((e.clientX - (r.left + r.width / 2)) * strength)
    y.set((e.clientY - (r.top + r.height / 2)) * strength)
  }
  const reset = () => {
    x.set(0)
    y.set(0)
  }
  return (
    <motion.div ref={ref} className={`magnetic ${className}`} style={{ x: sx, y: sy }} onPointerMove={onMove} onPointerLeave={reset}>
      {children}
    </motion.div>
  )
}

// Scrambles through glyphs before settling on the text (on hover / when shown).
const GLYPHS = '01<>/{}[]=+*#ABCDEFXYZ'
export function Scramble({ text, trigger = 'hover', className = '' }) {
  const reduce = useReducedMotion()
  const [out, setOut] = useState(text)
  const raf = useRef(0)
  const run = () => {
    if (reduce) return
    cancelAnimationFrame(raf.current)
    const start = performance.now()
    const total = 420
    const tick = (now) => {
      const p = Math.min(1, (now - start) / total)
      const settled = Math.floor(p * text.length)
      setOut(
        text
          .split('')
          .map((ch, i) => (i < settled || ch === ' ' ? ch : GLYPHS[(Math.random() * GLYPHS.length) | 0]))
          .join(''),
      )
      if (p < 1) raf.current = requestAnimationFrame(tick)
    }
    raf.current = requestAnimationFrame(tick)
  }
  useEffect(() => () => cancelAnimationFrame(raf.current), [])
  useEffect(() => {
    if (trigger === 'mount') run()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trigger])
  return (
    <span
      className={className}
      onPointerEnter={trigger === 'hover' ? run : undefined}
      onFocus={trigger === 'hover' ? run : undefined}
      aria-label={text}
    >
      <span aria-hidden="true">{out}</span>
    </span>
  )
}

// Card that tilts in 3D and shows a cursor spotlight. Usable without hover.
export function TiltCard({ children, className = '', max = 7, ...rest }) {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const rx = useMotionValue(0)
  const ry = useMotionValue(0)
  const srx = useSpring(rx, spring.soft)
  const sry = useSpring(ry, spring.soft)
  const onMove = (e) => {
    const el = ref.current
    const r = el.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width
    const py = (e.clientY - r.top) / r.height
    el.style.setProperty('--mx', `${px * 100}%`)
    el.style.setProperty('--my', `${py * 100}%`)
    if (reduce || e.pointerType !== 'mouse') return
    ry.set((px - 0.5) * max * 2)
    rx.set(-(py - 0.5) * max * 2)
  }
  const reset = () => {
    rx.set(0)
    ry.set(0)
  }
  return (
    <motion.div
      ref={ref}
      className={`tilt-card ${className}`}
      style={{ rotateX: srx, rotateY: sry, transformPerspective: 900 }}
      onPointerMove={onMove}
      onPointerLeave={reset}
      {...rest}
    >
      {children}
    </motion.div>
  )
}

// True once the element has scrolled into view.
export function useInViewOnce(ref, amount = 0.4) {
  const [seen, setSeen] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setSeen(true)
          io.disconnect()
        }
      },
      { threshold: amount },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [ref, amount])
  return seen
}
