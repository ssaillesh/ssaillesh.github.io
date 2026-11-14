import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUpRight, Play, X } from 'lucide-react'

const Motion = motion

// A project's playable demo (`demo: { src, label, title }` in src/data/projects.js),
// opened over the page in a full-size frame. Esc or the close button returns to
// where you were; the page under it keeps its state.
export function DemoViewer({ demo, open, onClose }) {
  const closeRef = useRef()
  useEffect(() => {
    if (!open) return
    closeRef.current?.focus({ preventScroll: true })
    // capture, so pages that also listen for Esc (the Vault) don't step back too
    const onKey = (e) => {
      if (e.key !== 'Escape') return
      e.stopPropagation()
      onClose()
    }
    window.addEventListener('keydown', onKey, true)
    return () => window.removeEventListener('keydown', onKey, true)
  }, [open, onClose])

  return createPortal(
    <AnimatePresence>
      {open && (
        <Motion.div
          key="demo"
          role="dialog"
          aria-modal="true"
          aria-label={demo.title}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[80] flex flex-col bg-[#08090B]/95 backdrop-blur-sm"
        >
          <div className="flex items-center gap-3 border-b border-line px-4 py-3 lg:px-6">
            <p className="label-mono min-w-0 flex-1 truncate text-[10.5px] text-brass">{demo.title}</p>
            <a
              href={demo.src}
              target="_blank"
              rel="noreferrer"
              className="hidden h-10 items-center gap-2 rounded-full border border-line px-4 text-[13px] text-ivory-2 transition-colors hover:border-ivory/40 hover:text-ivory sm:inline-flex"
            >
              New tab <ArrowUpRight size={14} strokeWidth={1.6} aria-hidden />
            </a>
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              className="inline-flex h-10 items-center gap-2 rounded-full border border-line px-4 text-[13px] text-ivory-2 transition-colors hover:border-ivory/40 hover:text-ivory"
            >
              Close <X size={14} strokeWidth={1.6} aria-hidden />
            </button>
          </div>
          <Motion.div initial={{ y: 12 }} animate={{ y: 0 }} transition={{ duration: 0.3 }} className="min-h-0 flex-1">
            <iframe src={demo.src} title={demo.title} className="h-full w-full border-0 bg-[#08090B]" />
          </Motion.div>
        </Motion.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}

// The button that opens it. `className` styles the button; it defaults to a brass pill.
export function DemoButton({ demo, className }) {
  const [open, setOpen] = useState(false)
  if (!demo) return null
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={
          className ||
          'inline-flex h-11 items-center gap-2 rounded-full bg-brass px-5 text-[14px] font-medium text-charcoal transition-colors hover:bg-brass-2'
        }
      >
        <Play size={14} strokeWidth={2} aria-hidden /> {demo.label || 'Try the demo'}
      </button>
      <DemoViewer demo={demo} open={open} onClose={() => setOpen(false)} />
    </>
  )
}
