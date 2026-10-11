import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Wordmark from './Wordmark'
import { ease } from '../motion'

// Intro: the logo is scanned in line by line while a counter runs to 100.
// Short (~1.6s), skippable, and skipped entirely under reduced motion.
export default function Loader({ onDone }) {
  const [n, setN] = useState(0)

  useEffect(() => {
    const start = performance.now()
    const total = 1500
    let raf
    const tick = (now) => {
      const p = Math.min(1, (now - start) / total)
      setN(Math.round((1 - Math.pow(1 - p, 3)) * 100))
      if (p < 1) raf = requestAnimationFrame(tick)
      else setTimeout(onDone, 250)
    }
    raf = requestAnimationFrame(tick)
    const skip = (e) => {
      if (e.type === 'keydown' && e.key !== 'Escape' && e.key !== 'Enter') return
      onDone()
    }
    window.addEventListener('keydown', skip)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('keydown', skip)
    }
  }, [onDone])

  return (
    <motion.div
      className="loader"
      role="status"
      aria-label="Loading theBlume"
      onClick={onDone}
      exit={{ clipPath: 'inset(0 0 100% 0)', transition: { duration: 0.7, ease: ease.inOut } }}
    >
      <div className="loader-mark">
        <motion.img
          src={`${import.meta.env.BASE_URL}logo-mark.png`}
          alt=""
          initial={{ clipPath: 'inset(100% 0 0 0)' }}
          animate={{ clipPath: 'inset(0% 0 0 0)' }}
          transition={{ duration: 1.3, ease: ease.out }}
        />
        <motion.span
          className="loader-scan"
          initial={{ top: '100%', opacity: 1 }}
          animate={{ top: '0%', opacity: 0 }}
          transition={{ duration: 1.3, ease: ease.out }}
        />
      </div>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.6, ease: ease.out }}>
        <Wordmark className="loader-word" />
      </motion.div>
      <div className="loader-count mono" aria-hidden="true">
        {String(n).padStart(3, '0')}
      </div>
      <div className="loader-skip mono">Click or press Enter to skip</div>
    </motion.div>
  )
}
