import { Suspense, lazy, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Hand, X } from 'lucide-react'

const InspectStage = lazy(() => import('../scene/inspect/InspectStage.jsx'))
const Motion = motion

// Close-up of a selected artifact, shown beside the room panel. The residence
// behind it pauses and dims; the panel keeps the full text.
export default function InspectOverlay({ item, label, from, right, onClose }) {
  const closeRef = useRef()
  useEffect(() => {
    closeRef.current?.focus({ preventScroll: true })
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <Motion.section
      aria-label={`Close-up: ${label}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.45 }}
      className="fixed bottom-0 left-0 top-0 z-[25]"
      style={{ right }}
    >
      <div aria-hidden className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_55%,rgba(30,26,22,.78)_0%,rgba(10,10,11,.94)_70%)] backdrop-blur-[3px]" />
      <div className="absolute inset-0">
        <Suspense fallback={null}>
          <InspectStage item={item} />
        </Suspense>
      </div>
      <div className="pointer-events-none absolute left-8 top-[96px] max-w-[30rem]">
        <Motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25, duration: 0.6 }} className="label-mono text-[10px] text-brass">
          Collected · {from}
        </Motion.p>
        <Motion.h2 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35, duration: 0.7 }} className="mt-3 font-serif text-[34px] leading-[1.05] text-ivory">
          {label}
        </Motion.h2>
      </div>
      <p className="label-mono pointer-events-none absolute bottom-7 left-1/2 flex -translate-x-1/2 items-center gap-2 text-[10px] text-stone">
        <Hand size={13} strokeWidth={1.6} aria-hidden /> Drag to turn it over · Esc to put it back
      </p>
      <button
        ref={closeRef}
        type="button"
        onClick={onClose}
        className="absolute bottom-5 right-6 inline-flex h-11 items-center gap-2 rounded-full border border-line bg-charcoal/80 px-4 text-[13px] text-ivory-2 backdrop-blur-md transition-colors hover:border-ivory/40 hover:text-ivory"
      >
        Put it back <X size={15} strokeWidth={1.6} aria-hidden />
      </button>
    </Motion.section>
  )
}
