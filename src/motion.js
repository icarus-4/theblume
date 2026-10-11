// Shared motion tokens — every animation on the site draws from these so the
// whole page moves with one rhythm (ui-ux-pro-max: motion-consistency).
export const ease = {
  out: [0.16, 1, 0.3, 1], // decelerate on arrival
  in: [0.7, 0, 0.84, 0], // accelerate on exit
  inOut: [0.65, 0, 0.35, 1],
}

export const dur = {
  fast: 0.2,
  base: 0.5,
  slow: 0.9,
  exit: 0.3, // exits ~60–70% of enters
}

export const spring = {
  soft: { type: 'spring', stiffness: 140, damping: 22, mass: 0.6 },
  snappy: { type: 'spring', stiffness: 320, damping: 26 },
}

export const stagger = 0.04 // 30–50ms per item

export const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: dur.slow, ease: ease.out } },
}

export const viewport = { once: true, amount: 0.25 }
