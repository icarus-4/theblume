import { useEffect, useId, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { X, ArrowUpRight, Loader2, AlertCircle, Check } from 'lucide-react'
import { CONTACT_EMAIL, FORM_ENDPOINT, PROJECT_FORM } from '../content'
import Wordmark from './Wordmark'
import { dur, ease, spring } from '../motion'

const DRAFT_KEY = 'ivies:project-draft'
const EMPTY = { name: '', email: '', company: '', phone: '', services: [], budget: PROJECT_FORM.budgets[0], details: '' }

const LABELS = { name: 'Full name', email: 'Work email', services: 'Services', details: 'Project details' }

// Error copy states the cause and the fix (ui-ux-pro-max: error-clarity).
function validate(v) {
  const e = {}
  if (!v.name.trim()) e.name = 'Enter your name so we know who to reply to.'
  if (!v.email.trim()) e.email = 'Enter your email so we can reply.'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email.trim())) e.email = 'Enter an email like name@company.com.'
  if (!v.services.length) e.services = 'Pick at least one service — choose “Something else” if unsure.'
  if (v.details.trim().length < 20) e.details = 'Add a few more words (20+ characters) about what you’re building.'
  return e
}

function loadDraft() {
  try {
    const d = JSON.parse(localStorage.getItem(DRAFT_KEY) || 'null')
    return d ? { ...EMPTY, ...d } : EMPTY
  } catch {
    return EMPTY
  }
}

function saveDraft(v) {
  try {
    if (v) localStorage.setItem(DRAFT_KEY, JSON.stringify(v))
    else localStorage.removeItem(DRAFT_KEY)
  } catch {
    /* storage unavailable — drafts are a nicety */
  }
}

function Field({ id, label, required, error, hint, children }) {
  return (
    <div className={`field ${error ? 'has-error' : ''}`}>
      <label htmlFor={id}>
        {label} {required ? <span className="req" aria-hidden="true">*</span> : <span className="opt">optional</span>}
      </label>
      {children}
      {hint && !error && <p className="hint" id={`${id}-hint`}>{hint}</p>}
      <AnimatePresence initial={false}>
        {error && (
          <motion.p
            className="field-error"
            id={`${id}-error`}
            role="alert"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, transition: { duration: 0.12 } }}
          >
            <AlertCircle size={14} aria-hidden="true" /> {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function ProjectModal({ open, onClose }) {
  const uid = useId()
  const reduce = useReducedMotion()
  const panelRef = useRef(null)
  const summaryRef = useRef(null)
  const firstFieldRef = useRef(null)
  const returnFocus = useRef(null)
  const [values, setValues] = useState(EMPTY)
  const [touched, setTouched] = useState({})
  const [errors, setErrors] = useState({})
  const [showSummary, setShowSummary] = useState(false)
  const [status, setStatus] = useState('idle') // idle | sending | sent | mailto | failed
  const [confirmClose, setConfirmClose] = useState(false)

  const id = (k) => `${uid}-${k}`
  const dirty = JSON.stringify({ ...values, budget: '' }) !== JSON.stringify({ ...EMPTY, budget: '' })

  // Open: restore draft, remember the trigger, focus the first field.
  useEffect(() => {
    if (!open) return
    returnFocus.current = document.activeElement
    setValues(loadDraft())
    setTouched({})
    setErrors({})
    setShowSummary(false)
    setStatus('idle')
    setConfirmClose(false)
    const t = setTimeout(() => firstFieldRef.current?.focus(), 80)
    return () => {
      clearTimeout(t)
      returnFocus.current?.focus?.()
    }
  }, [open])

  // Autosave the draft while typing (ui-ux-pro-max: form-autosave).
  useEffect(() => {
    if (open && status === 'idle' && dirty) saveDraft(values)
  }, [values, open, status, dirty])

  const requestClose = () => {
    if (dirty && status === 'idle' && !confirmClose) {
      setConfirmClose(true)
      return
    }
    onClose()
  }

  // Escape to close + keep Tab focus inside the dialog.
  useEffect(() => {
    if (!open) return
    const onKey = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        requestClose()
      }
      if (e.key !== 'Tab') return
      const nodes = panelRef.current?.querySelectorAll(
        'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])',
      )
      if (!nodes?.length) return
      const first = nodes[0]
      const last = nodes[nodes.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  const set = (k, v) => {
    setConfirmClose(false)
    const next = { ...values, [k]: v }
    setValues(next)
    // once a field has been visited, re-check it as the user fixes it
    if (touched[k]) setErrors((er) => ({ ...er, [k]: validate(next)[k] }))
  }

  const blur = (k) => {
    setTouched((t) => ({ ...t, [k]: true }))
    setErrors((er) => ({ ...er, [k]: validate(values)[k] }))
  }

  const toggleService = (s) => {
    const next = values.services.includes(s) ? values.services.filter((x) => x !== s) : [...values.services, s]
    set('services', next)
    setTouched((t) => ({ ...t, services: true }))
    setErrors((er) => ({ ...er, services: validate({ ...values, services: next }).services }))
  }

  const submit = async (e) => {
    e.preventDefault()
    const errs = validate(values)
    setErrors(errs)
    setTouched({ name: true, email: true, services: true, details: true })
    if (Object.keys(errs).length) {
      setShowSummary(true)
      requestAnimationFrame(() => summaryRef.current?.focus())
      return
    }
    setShowSummary(false)
    setStatus('sending')
    const payload = {
      name: values.name.trim(),
      email: values.email.trim(),
      company: values.company.trim(),
      phone: values.phone.trim(),
      services: values.services.join(', '),
      budget: values.budget,
      details: values.details.trim(),
    }

    if (!FORM_ENDPOINT) {
      const body = Object.entries(payload)
        .filter(([, v]) => v)
        .map(([k, v]) => `${k[0].toUpperCase() + k.slice(1)}: ${v}`)
        .join('\n')
      const subject = `New project enquiry from ${payload.name}`
      window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
      saveDraft(null)
      setStatus('mailto')
      return
    }

    try {
      const res = await fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error(String(res.status))
      saveDraft(null)
      setStatus('sent')
    } catch {
      setStatus('failed')
    }
  }

  const errorList = Object.entries(errors).filter(([, v]) => v)
  const describedBy = (k, hint) => [errors[k] && `${id(k)}-error`, hint && !errors[k] && `${id(k)}-hint`].filter(Boolean).join(' ') || undefined
  const done = status === 'sent' || status === 'mailto'

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="modal-root"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: dur.exit, ease: ease.in } }}
          transition={{ duration: dur.base }}
        >
          <div className="modal-backdrop" onClick={requestClose} aria-hidden="true" />
          <motion.div
            ref={panelRef}
            className="modal-panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby={id('title')}
            data-lenis-prevent
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 60, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1, transition: spring.soft }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: 40, scale: 0.98, transition: { duration: dur.exit, ease: ease.in } }}
          >
            <div className="modal-glow" aria-hidden="true" />
            <header className="modal-head">
              <div className="modal-brand">
                <img src={`${import.meta.env.BASE_URL}logo-mark.png`} alt="" width="34" height="34" />
                <Wordmark />
              </div>
              <button className="modal-close" onClick={requestClose} aria-label="Close form">
                <X size={20} aria-hidden="true" />
              </button>
            </header>

            <AnimatePresence mode="wait" initial={false}>
              {done ? (
                <motion.div
                  key="done"
                  className="modal-done"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: dur.base, ease: ease.out }}
                  role="status"
                >
                  <svg className="done-check" viewBox="0 0 80 80" aria-hidden="true">
                    <motion.circle cx="40" cy="40" r="34" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.7, ease: ease.out }} />
                    <motion.path d="M25 41 L36 52 L56 30" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.5, duration: 0.45, ease: ease.out }} />
                  </svg>
                  <h2 id={id('title')}>{status === 'sent' ? 'Thanks — we’ve got it.' : 'Almost there.'}</h2>
                  <p>
                    {status === 'sent'
                      ? `We’ll review your project and reply to ${values.email.trim()}.`
                      : `Your email app should have opened with your details filled in — just press send. If it didn’t, email us at ${CONTACT_EMAIL}.`}
                  </p>
                  <button className="btn btn-primary" onClick={onClose}>Back to the site</button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  className="modal-form"
                  onSubmit={submit}
                  noValidate
                  exit={{ opacity: 0, y: -10, transition: { duration: dur.exit } }}
                >
                  <div className="modal-intro">
                    <h2 id={id('title')}>Start a project</h2>
                    <p>Tell us a little about what you’re building. Fields marked <span className="req">*</span> are required.</p>
                  </div>

                  {showSummary && errorList.length > 0 && (
                    <div className="error-summary" ref={summaryRef} tabIndex={-1} role="alert" aria-labelledby={id('sum')}>
                      <p id={id('sum')}>
                        <AlertCircle size={16} aria-hidden="true" /> Please fix {errorList.length === 1 ? 'this' : `these ${errorList.length}`} to continue:
                      </p>
                      <ul>
                        {errorList.map(([k, msg]) => (
                          <li key={k}>
                            <a
                              href={`#${id(k)}`}
                              onClick={(e) => {
                                e.preventDefault()
                                document.getElementById(id(k))?.focus()
                              }}
                            >
                              {LABELS[k]}: {msg}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="form-grid">
                    <Field id={id('name')} label="Full name" required error={touched.name && errors.name}>
                      <input
                        ref={firstFieldRef}
                        id={id('name')}
                        type="text"
                        autoComplete="name"
                        value={values.name}
                        onChange={(e) => set('name', e.target.value)}
                        onBlur={() => blur('name')}
                        aria-invalid={!!(touched.name && errors.name)}
                        aria-describedby={describedBy('name')}
                        aria-required="true"
                      />
                    </Field>
                    <Field id={id('email')} label="Work email" required error={touched.email && errors.email}>
                      <input
                        id={id('email')}
                        type="email"
                        inputMode="email"
                        autoComplete="email"
                        value={values.email}
                        onChange={(e) => set('email', e.target.value)}
                        onBlur={() => blur('email')}
                        aria-invalid={!!(touched.email && errors.email)}
                        aria-describedby={describedBy('email')}
                        aria-required="true"
                      />
                    </Field>
                    <Field id={id('company')} label="Company">
                      <input id={id('company')} type="text" autoComplete="organization" value={values.company} onChange={(e) => set('company', e.target.value)} />
                    </Field>
                    <Field id={id('phone')} label="Phone">
                      <input id={id('phone')} type="tel" inputMode="tel" autoComplete="tel" value={values.phone} onChange={(e) => set('phone', e.target.value)} />
                    </Field>
                  </div>

                  <fieldset
                    className={`field chips-field ${touched.services && errors.services ? 'has-error' : ''}`}
                    id={id('services')}
                    tabIndex={-1}
                    aria-describedby={touched.services && errors.services ? `${id('services')}-error` : undefined}
                  >
                    <legend>
                      What do you need? <span className="req" aria-hidden="true">*</span>
                    </legend>
                    <div className="chips">
                      {PROJECT_FORM.services.map((s) => {
                        const on = values.services.includes(s)
                        return (
                          <label key={s} className={`chip ${on ? 'is-on' : ''}`}>
                            <input type="checkbox" checked={on} onChange={() => toggleService(s)} />
                            <span className="chip-box" aria-hidden="true">{on && <Check size={12} />}</span>
                            {s}
                          </label>
                        )
                      })}
                    </div>
                    <AnimatePresence initial={false}>
                      {touched.services && errors.services && (
                        <motion.p className="field-error" id={`${id('services')}-error`} role="alert" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                          <AlertCircle size={14} aria-hidden="true" /> {errors.services}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </fieldset>

                  <Field id={id('budget')} label="Estimated budget">
                    <select id={id('budget')} value={values.budget} onChange={(e) => set('budget', e.target.value)}>
                      {PROJECT_FORM.budgets.map((b) => <option key={b}>{b}</option>)}
                    </select>
                  </Field>

                  <Field
                    id={id('details')}
                    label="Project details"
                    required
                    error={touched.details && errors.details}
                    hint="Goals, features, timeline — whatever you know so far."
                  >
                    <textarea
                      id={id('details')}
                      rows={4}
                      value={values.details}
                      onChange={(e) => set('details', e.target.value)}
                      onBlur={() => blur('details')}
                      aria-invalid={!!(touched.details && errors.details)}
                      aria-describedby={describedBy('details', true)}
                      aria-required="true"
                    />
                  </Field>

                  {status === 'failed' && (
                    <p className="form-failed" role="alert">
                      <AlertCircle size={16} aria-hidden="true" /> We couldn’t send that — check your connection and try again, or email{' '}
                      <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
                    </p>
                  )}

                  <AnimatePresence>
                    {confirmClose && (
                      <motion.div
                        className="confirm-close"
                        role="alertdialog"
                        aria-label="Discard your details?"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                      >
                        <span>Close the form? Your draft is saved for next time.</span>
                        <div>
                          <button type="button" className="btn btn-ghost btn-sm" autoFocus onClick={() => setConfirmClose(false)}>Keep editing</button>
                          <button type="button" className="btn btn-ghost btn-sm" onClick={onClose}>Close</button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="form-actions">
                    <button type="button" className="btn btn-ghost" onClick={requestClose}>Cancel</button>
                    <button type="submit" className="btn btn-primary" disabled={status === 'sending'} aria-busy={status === 'sending'}>
                      {status === 'sending' ? (
                        <>
                          <Loader2 size={18} className="spin" aria-hidden="true" /> Sending…
                        </>
                      ) : (
                        <>
                          Submit project <ArrowUpRight size={18} aria-hidden="true" />
                        </>
                      )}
                    </button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
