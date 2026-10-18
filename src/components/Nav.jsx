import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion'
import { Menu, X, ArrowUpRight } from 'lucide-react'
import Wordmark from './Wordmark'
import { Magnetic, Scramble } from './fx'
import { NAV_LINKS } from '../content'
import { pageHref, homeAnchor } from '../routes'
import { dur, ease } from '../motion'

export default function Nav({ route, onNavigate, onStartProject }) {
  const isHome = route.type === 'home'
  const { scrollY } = useScroll()
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [open, setOpen] = useState(false)
  // On a service page, highlight the matching top-level page link.
  const pageActive = route.type === 'product' ? 'via' : route.type === 'hub' ? 'services' : route.type === 'service' ? (route.page.kind === 'ai' ? 'ai-development' : 'services') : ''
  const [active, setActive] = useState(pageActive)

  useMotionValueEvent(scrollY, 'change', (y) => {
    const prev = scrollY.getPrevious() ?? 0
    setScrolled(y > 40)
    setHidden(y > 600 && y > prev && !open)
  })

  // On the home page, highlight the link for the section in view.
  useEffect(() => {
    if (!isHome) return
    const els = NAV_LINKS.filter((l) => l.id).map((l) => document.getElementById(l.id)).filter(Boolean)
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-45% 0px -50% 0px' },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [isHome])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const go = (e, id) => {
    e.preventDefault()
    setOpen(false)
    onNavigate(id)
  }

  // Page links are plain hrefs; section links scroll on the home page and
  // point back to the home page from anywhere else.
  const linkProps = (l) => {
    if (l.page) return { href: pageHref(l.page), onClick: () => setOpen(false) }
    if (isHome || l.id === 'contact') return { href: `#${l.id}`, onClick: (e) => go(e, l.id) }
    return { href: homeAnchor(l.id) }
  }
  const keyOf = (l) => l.page || l.id

  return (
    <>
      <motion.header
        className={`nav ${scrolled ? 'is-scrolled' : ''}`}
        animate={{ y: hidden ? '-120%' : '0%' }}
        transition={{ duration: hidden ? dur.exit : dur.base, ease: hidden ? ease.in : ease.out }}
      >
        <a href={pageHref()} className="nav-brand" onClick={isHome ? (e) => go(e, 'top') : undefined} aria-label="Ivies home">
          <img src={`${import.meta.env.BASE_URL}logo-mark.png`} alt="" width="40" height="40" />
          <Wordmark />
        </a>

        <nav className="nav-pill" aria-label="Primary">
          {NAV_LINKS.map((l) => (
            <a
              key={keyOf(l)}
              {...linkProps(l)}
              className={active === keyOf(l) ? 'is-active' : ''}
              aria-current={active === keyOf(l) ? (l.page === route.slug ? 'page' : 'true') : undefined}
            >
              {active === keyOf(l) && <motion.span layoutId="nav-dot" className="nav-active-bg" transition={{ type: 'spring', stiffness: 380, damping: 30 }} />}
              <Scramble text={l.label} />
            </a>
          ))}
        </nav>

        <div className="nav-right">
          <Magnetic>
            <button type="button" className="btn btn-primary btn-sm" onClick={onStartProject} aria-haspopup="dialog">
              Start a project <ArrowUpRight size={16} aria-hidden="true" />
            </button>
          </Magnetic>
          <button className="nav-burger" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} onClick={() => setOpen((o) => !o)}>
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            className="mobile-menu"
            initial={{ clipPath: 'circle(0% at 92% 4%)' }}
            animate={{ clipPath: 'circle(150% at 92% 4%)' }}
            exit={{ clipPath: 'circle(0% at 92% 4%)', transition: { duration: dur.exit * 1.5, ease: ease.in } }}
            transition={{ duration: dur.slow, ease: ease.out }}
          >
            <nav aria-label="Mobile">
              {[...NAV_LINKS, { id: 'contact', label: 'Contact' }].map((l, i) => (
                <motion.a
                  key={keyOf(l)}
                  {...linkProps(l)}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + i * 0.05, duration: dur.base, ease: ease.out }}
                >
                  <span className="mono">0{i + 1}</span> {l.label}
                </motion.a>
              ))}
              <motion.button
                type="button"
                className="btn btn-primary btn-lg mobile-cta"
                aria-haspopup="dialog"
                onClick={() => {
                  setOpen(false)
                  onStartProject()
                }}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: dur.base, ease: ease.out }}
              >
                Start a project <ArrowUpRight size={20} aria-hidden="true" />
              </motion.button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
