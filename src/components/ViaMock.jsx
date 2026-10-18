import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { BadgeCheck, Mic } from 'lucide-react'
import { useInViewOnce } from './fx'
import { ease } from '../motion'
import '../apps.css'

// Illustrative screen for Via: a skill profile verified by the AI interview.
const VIA_SKILLS = [
  { name: 'Python', level: 'Advanced', v: 92 },
  { name: 'SQL', level: 'Intermediate', v: 78 },
  { name: 'Git', level: 'Foundation', v: 60 },
]

export function ViaScreen() {
  const ref = useRef(null)
  const on = useInViewOnce(ref, 0.4)
  const reduce = useReducedMotion()
  const [match, setMatch] = useState(reduce ? 84 : 0)

  useEffect(() => {
    if (!on || reduce) return
    const start = performance.now()
    let raf
    const tick = (now) => {
      const p = Math.min(1, (now - start) / 1400)
      setMatch(Math.round(84 * (1 - Math.pow(1 - p, 3))))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    const t = setTimeout(() => (raf = requestAnimationFrame(tick)), 700)
    return () => {
      clearTimeout(t)
      cancelAnimationFrame(raf)
    }
  }, [on, reduce])

  const C = 2 * Math.PI * 15
  return (
    <div className="phone-screen via" ref={ref} aria-hidden="true">
      <div className="via-top">
        <span className="via-word">Via<small>by Ivies</small></span>
        <span className="via-mic"><Mic size={12} /> AI interview</span>
      </div>
      <div className="via-badge">
        <BadgeCheck size={16} />
        <div>
          <b>Skills verified</b>
          <small className="mono">78% · 12 spoken answers</small>
        </div>
      </div>
      <ul className="via-skills">
        {VIA_SKILLS.map((k, i) => (
          <li key={k.name}>
            <div className="via-skill-row">
              <span>{k.name}</span>
              <em>{k.level}</em>
            </div>
            <span className="via-bar">
              <motion.i
                initial={{ scaleX: 0 }}
                animate={on ? { scaleX: k.v / 100 } : {}}
                transition={{ duration: 1, ease: ease.out, delay: 0.25 + i * 0.12 }}
              />
            </span>
          </li>
        ))}
      </ul>
      <div className="via-job">
        <svg viewBox="0 0 36 36" className="via-ring">
          <circle cx="18" cy="18" r="15" className="via-ring-bg" />
          <circle cx="18" cy="18" r="15" className="via-ring-fg" strokeDasharray={C} strokeDashoffset={C * (1 - match / 100)} />
          <text x="18" y="21" textAnchor="middle">{match}%</text>
        </svg>
        <div>
          <b>Backend Developer</b>
          <small>Via job · you match</small>
        </div>
      </div>
      <span className="via-apply">Apply with verified skills</span>
      <span className="via-promise mono">Every applicant gets an answer</span>
    </div>
  )
}

// Illustrative recruiter view: applicants ranked by verified skill match.
const VIA_APPLICANTS = [
  { n: 'Ananya R.', m: 91, s: ['Python · Advanced', 'SQL · Advanced'] },
  { n: 'Rohit K.', m: 86, s: ['Python · Advanced', 'Git · Intermediate'] },
  { n: 'Meera S.', m: 72, s: ['SQL · Intermediate', 'AWS · Foundation'] },
]

export function ViaRecruiterBrowser() {
  const ref = useRef(null)
  const on = useInViewOnce(ref, 0.3)
  return (
    <div className="via-browser" ref={ref} aria-hidden="true">
      <div className="via-browser-bar">
        <span className="dots"><i /><i /><i /></span>
        <span className="via-url mono">via.theivies.in/recruiter</span>
      </div>
      <div className="via-browser-body">
        <div className="via-rec-head">
          <div>
            <b>Backend Developer</b>
            <small>Standard post · applicants ranked by verified match</small>
          </div>
          <span className="via-rec-count mono">12 applicants</span>
        </div>
        <ul className="via-rec-list">
          {VIA_APPLICANTS.map((a, i) => (
            <motion.li
              key={a.n}
              initial={{ opacity: 0, x: 24 }}
              animate={on ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, ease: ease.out, delay: 0.2 + i * 0.14 }}
            >
              <span className="via-avatar">{a.n[0]}</span>
              <div className="via-rec-main">
                <div className="via-rec-row">
                  <b>{a.n}</b>
                  <span className="mono">{a.m}% match</span>
                </div>
                <span className="via-bar">
                  <motion.i
                    initial={{ scaleX: 0 }}
                    animate={on ? { scaleX: a.m / 100 } : {}}
                    transition={{ duration: 1, ease: ease.out, delay: 0.5 + i * 0.14 }}
                  />
                </span>
                <div className="via-rec-skills">
                  {a.s.map((x) => <em key={x}>{x}</em>)}
                </div>
              </div>
              <div className="via-rec-actions">
                <span className="go">Shortlist</span>
                <span>Decline with reason</span>
              </div>
            </motion.li>
          ))}
        </ul>
        <div className="via-rec-foot mono">Every applicant gets a reply</div>
      </div>
    </div>
  )
}
