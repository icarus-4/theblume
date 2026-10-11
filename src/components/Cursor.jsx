import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

// Trailing ring cursor for mouse users; grows over interactive elements.
// The native cursor stays visible so nothing about pointing changes.
export default function Cursor() {
  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const sx = useSpring(x, { stiffness: 500, damping: 40, mass: 0.4 })
  const sy = useSpring(y, { stiffness: 500, damping: 40, mass: 0.4 })
  const [hover, setHover] = useState(false)
  const [show, setShow] = useState(false)

  useEffect(() => {
    const move = (e) => {
      if (e.pointerType !== 'mouse') return
      x.set(e.clientX)
      y.set(e.clientY)
      setShow(true)
      setHover(!!e.target.closest('a, button, [data-cursor]'))
    }
    const leave = () => setShow(false)
    window.addEventListener('pointermove', move, { passive: true })
    document.addEventListener('pointerleave', leave)
    return () => {
      window.removeEventListener('pointermove', move)
      document.removeEventListener('pointerleave', leave)
    }
  }, [x, y])

  return (
    <motion.div
      className="cursor-ring"
      aria-hidden="true"
      style={{ x: sx, y: sy }}
      animate={{ scale: hover ? 2.2 : 1, opacity: show ? 1 : 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
    />
  )
}
