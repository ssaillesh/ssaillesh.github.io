import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useDragControls, useInView, useReducedMotion } from 'framer-motion'
import { ChevronDown, X } from 'lucide-react'
import { useDesktop } from './hooks.js'

const Motion = motion

// Fades and lifts its children in once, the first time they scroll into view.
export function Reveal({ children, delay = 0, className = '' }) {
  const reduce = useReducedMotion()
  return (
    <Motion.div
      initial={reduce ? false : { opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -8% 0px' }}
      transition={{ duration: 0.6, delay, ease: [0.2, 0.7, 0.2, 1] }}
      className={className}
    >
      {children}
    </Motion.div>
  )
}

// Counts the first number in a value up from zero when it scrolls into view.
// Values with no number, or that read as a range or a change ("1 h → 10 s"), stay as written.
export function CountUp({ value, className = '' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '0px 0px -10% 0px' })
  const reduce = useReducedMotion()
  const m = /^([^\d]*)(\d[\d,]*(?:\.\d+)?)(.*)$/.exec(value)
  const animated = !!m && !reduce && !/[→–/]/.test(value)
  const target = m ? parseFloat(m[2].replace(/,/g, '')) : 0
  const decimals = m && m[2].includes('.') ? m[2].split('.')[1].length : 0
  const commas = !!m && m[2].includes(',')
  const [n, setN] = useState(0)

  useEffect(() => {
    if (!animated || !inView) return undefined
    let raf
    let start
    const tick = (t) => {
      start ??= t
      const p = Math.min(1, (t - start) / 1100)
      setN(target * (1 - Math.pow(1 - p, 3)))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [animated, inView, target])

  if (!animated) {
    return (
      <span ref={ref} className={className}>
        {value}
      </span>
    )
  }
  const shown = commas
    ? n.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
    : n.toFixed(decimals)
  return (
    <span ref={ref} className={`tabular-nums ${className}`}>
      {m[1]}
      {shown}
      {m[3]}
    </span>
  )
}

export function LiveBadge({ className = '' }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border border-[#7fc79a]/40 bg-[#7fc79a]/10 px-2 py-0.5 font-sans text-[11px] normal-case tracking-normal text-[#7fc79a] ${className}`}>
      <i className="h-1.5 w-1.5 rounded-full bg-[#7fc79a]" />
      Live
    </span>
  )
}

// Big numbers with a short label under each.
export function Results({ items, wide = false, className = '' }) {
  if (!items?.length) return null
  return (
    <dl className={`grid grid-cols-2 gap-x-4 gap-y-6 ${wide ? 'md:grid-cols-4' : ''} ${className}`}>
      {items.map((m) => (
        <div key={m.label} className="border-l border-brass pl-3">
          <dt className="sr-only">{m.label}</dt>
          <dd className="font-display text-[34px] font-bold leading-none tracking-[-0.03em] text-brass-2">
            <CountUp value={m.value} />
          </dd>
          <dd className="mt-2 text-[12.5px] leading-snug text-stone">{m.label}</dd>
        </div>
      ))}
    </dl>
  )
}

export function Disclosure({ label, children }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-t border-line">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex min-h-[52px] w-full items-center justify-between text-left text-[14.5px] text-ivory-2 transition-colors hover:text-ivory"
      >
        {label}
        <ChevronDown size={18} strokeWidth={1.6} className={`text-brass transition-transform ${open ? 'rotate-180' : ''}`} aria-hidden />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <Motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
            <div className="pb-5">{children}</div>
          </Motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// A bottom sheet on phones and a side drawer on desktop.
// Close it by dragging the handle down (phones), tapping outside, the close button, or Escape.
export function Sheet({ open, onClose, label, children }) {
  const controls = useDragControls()
  const closeRef = useRef(null)
  const desktop = useDesktop()

  useEffect(() => {
    if (!open) return undefined
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    closeRef.current?.focus()
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [open, onClose])

  const panel = desktop
    ? {
        initial: { x: '100%' },
        animate: { x: 0 },
        exit: { x: '100%' },
        className: 'absolute inset-y-0 right-0 flex w-full max-w-[560px] flex-col border-l border-line bg-char-2',
      }
    : {
        initial: { y: '100%' },
        animate: { y: 0 },
        exit: { y: '100%' },
        drag: 'y',
        dragControls: controls,
        dragListener: false,
        dragConstraints: { top: 0, bottom: 0 },
        dragElastic: { top: 0, bottom: 0.7 },
        onDragEnd: (_, info) => (info.offset.y > 120 || info.velocity.y > 600) && onClose(),
        className: 'absolute inset-x-0 bottom-0 flex max-h-[90dvh] w-full flex-col rounded-t-[28px] border-t border-line bg-char-2',
      }

  return (
    <AnimatePresence>
      {open && (
        <Motion.div key="sheet" className="fixed inset-0 z-50">
          <Motion.button
            type="button"
            aria-label="Close"
            tabIndex={-1}
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60"
          />
          <Motion.div role="dialog" aria-modal="true" aria-label={label} transition={{ type: 'spring', damping: 34, stiffness: 320 }} {...panel}>
            <div onPointerDown={desktop ? undefined : (e) => controls.start(e)} className={`relative shrink-0 pb-2 pt-3 ${desktop ? 'h-14' : 'cursor-grab touch-none'}`}>
              {!desktop && <div className="mx-auto h-1 w-10 rounded-full bg-line" />}
              <button
                ref={closeRef}
                type="button"
                onClick={onClose}
                aria-label="Close"
                onPointerDown={(e) => e.stopPropagation()}
                className="absolute right-4 top-2 flex h-10 w-10 items-center justify-center rounded-full bg-char-3 text-ivory transition-colors hover:bg-line"
              >
                <X size={18} strokeWidth={1.8} aria-hidden />
              </button>
            </div>
            <div className="overflow-y-auto overscroll-contain px-5 pb-[max(2rem,env(safe-area-inset-bottom))] lg:px-8">{children}</div>
          </Motion.div>
        </Motion.div>
      )}
    </AnimatePresence>
  )
}
