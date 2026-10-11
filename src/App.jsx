import { lazy, Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, MotionConfig, motion, useReducedMotion, useScroll, useSpring } from 'framer-motion'
import Lenis from 'lenis'
import Loader from './components/Loader'
import Nav from './components/Nav'
import Hero from './components/Hero'
import Marquee from './components/Marquee'
import Services from './components/Services'
import AISection from './components/AISection'
import AIServices from './components/AIServices'
import Finhance from './components/Finhance'
import Apps from './components/Apps'
import Process from './components/Process'
import Industries from './components/Industries'
import FAQ from './components/FAQ'
import Contact from './components/Contact'
import Cursor from './components/Cursor'
import ProjectModal from './components/ProjectModal'
import Footer from './components/Footer'
import ServicePage from './components/ServicePage'
import ServicesHub from './components/ServicesHub'
import { resolveRoute } from './routes'

// three.js is heavy — load it after the text content (ui-ux-pro-max: lazy load).
const ParticleField = lazy(() => import('./three/ParticleField'))

export default function App({ path }) {
  const route = useMemo(() => resolveRoute(path), [path])
  const isHome = route.type === 'home'
  const reduce = useReducedMotion()
  // Starts identical on the server (prerender) and client so hydration matches;
  // browser-only pieces switch on after mount.
  const [loading, setLoading] = useState(isHome) // intro plays on the home page only
  const [mounted, setMounted] = useState(false)
  const [finePointer, setFinePointer] = useState(false)
  const [formOpen, setFormOpen] = useState(false)
  const lenis = useRef(null)
  const { scrollYProgress } = useScroll()
  const bar = useSpring(scrollYProgress, { stiffness: 200, damping: 40 })

  useEffect(() => {
    setMounted(true)
    setFinePointer(window.matchMedia('(pointer: fine)').matches)
  }, [])

  // Reduced motion skips the intro entirely.
  useEffect(() => {
    if (reduce) setLoading(false)
  }, [reduce])

  // Smooth scrolling, disabled under reduced motion.
  useEffect(() => {
    if (reduce) return
    const l = new Lenis({ duration: 1.15, smoothWheel: true })
    lenis.current = l
    let raf
    const loop = (t) => {
      l.raf(t)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(raf)
      l.destroy()
      lenis.current = null
    }
  }, [reduce])

  useEffect(() => {
    const locked = loading || formOpen
    if (locked) lenis.current?.stop()
    else lenis.current?.start()
    document.documentElement.classList.toggle('is-locked', locked)
  }, [loading, formOpen])

  const openForm = useCallback(() => setFormOpen(true), [])
  const closeForm = useCallback(() => setFormOpen(false), [])

  const done = useCallback(() => setLoading(false), [])

  const navigate = useCallback((id) => {
    const el = id === 'top' ? document.body : document.getElementById(id)
    if (!el) return
    if (lenis.current) lenis.current.scrollTo(id === 'top' ? 0 : el, { offset: 0, duration: 1.4 })
    else el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' })
    // move focus for keyboard / screen-reader users
    const target = id === 'top' ? document.getElementById('top') : el
    target?.setAttribute('tabindex', '-1')
    target?.focus({ preventScroll: true })
  }, [reduce])

  return (
    <MotionConfig reducedMotion="user">
      <a className="skip-link" href="#main" onClick={(e) => (e.preventDefault(), navigate('main'))}>
        Skip to content
      </a>

      <AnimatePresence>{loading && <Loader key="loader" onDone={done} />}</AnimatePresence>

      {mounted && (
        <Suspense fallback={null}>
          <ParticleField reducedMotion={!!reduce} />
        </Suspense>
      )}
      <div className="grain" aria-hidden="true" />
      <div className="vignette" aria-hidden="true" />

      <motion.div className="scroll-bar" style={{ scaleX: bar }} aria-hidden="true" />
      {finePointer && !reduce && <Cursor />}

      <Nav route={route} onNavigate={navigate} onStartProject={openForm} />
      <main id="main">
        {isHome && (
          <>
            <Hero ready={!loading} onNavigate={navigate} onStartProject={openForm} />
            <Marquee />
            <Services />
            <AISection />
            <AIServices onStartProject={openForm} />
            <Finhance />
            <Apps />
            <Process />
            <Industries />
            <FAQ />
          </>
        )}
        {route.type === 'hub' && <ServicesHub onStartProject={openForm} />}
        {route.type === 'service' && <ServicePage key={route.slug} page={route.page} onStartProject={openForm} />}
        <Contact onStartProject={openForm} />
      </main>
      <Footer isHome={isHome} onNavigate={navigate} />

      <ProjectModal open={formOpen} onClose={closeForm} />
    </MotionConfig>
  )
}
