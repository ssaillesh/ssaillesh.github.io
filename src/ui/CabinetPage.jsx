import { Suspense, lazy, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Hand, X } from 'lucide-react'
import { cabinetItems } from '../data/artifacts.js'
import { awards } from '../data/awards.js'
import { education } from '../data/education.js'
import { Kicker } from './bits.jsx'

const CabinetScene = lazy(() => import('../scene/cabinet/CabinetScene.jsx'))
const Motion = motion

// Each compartment's record: award or honour, plus a short plaque line.
const items = cabinetItems.map((c) => {
  if (c.kind === 'award') {
    const a = awards.find((x) => x.id === c.ref)
    return { ...c, name: a.name, detail: a.detail, label: a.kind, plaque: a.name.toUpperCase().replace('EXCELLENCE AWARD, ', 'EXCELLENCE · ') }
  }
  const h = education.honours.find((x) => x.id === c.ref)
  return { ...c, name: h.name, detail: education.school, label: 'Honour', plaque: h.name.toUpperCase() }
})

export default function CabinetPage({ open, selected, onSelect, onClose }) {
  const [hovered, setHovered] = useState(null)
  const closeRef = useRef()
  const sel = items.find((x) => x.id === selected)
  const hov = items.find((x) => x.id === hovered)

  useEffect(() => {
    if (!open) return
    closeRef.current?.focus({ preventScroll: true })
    const onKey = (e) => {
      if (e.key !== 'Escape') return
      if (selected) onSelect(null)
      else onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, selected, onSelect, onClose])

  return (
    <AnimatePresence>
      {open && (
        <Motion.div
          key="cabinet"
          role="dialog"
          aria-modal="true"
          aria-label="The award cabinet"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 0.5 } }}
          exit={{ opacity: 0, transition: { duration: 0.35 } }}
          className="fixed inset-0 z-[60] flex flex-col bg-[radial-gradient(ellipse_at_50%_40%,#231d18_0%,#0d0d0e_75%)] text-ivory"
        >
          <header className="flex flex-wrap items-center gap-4 border-b border-line px-5 py-3 lg:px-8">
            <img src="/logos/sai-logo.png" alt="" className="h-8 w-auto opacity-90" />
            <div className="leading-none">
              <p className="font-serif text-[24px]">The Cabinet</p>
              <p className="label-mono mt-1 text-[9.5px] text-stone">Study · Awards & honours</p>
            </div>
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              className="ml-auto inline-flex h-10 items-center gap-2 rounded-full border border-line px-4 text-[13px] text-ivory-2 transition-colors hover:border-ivory/40 hover:text-ivory"
            >
              Back to the Study <X size={14} strokeWidth={1.6} aria-hidden />
            </button>
          </header>

          <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
            <div className="relative min-h-[420px] flex-1">
              <Suspense fallback={null}>
                <CabinetScene items={items} hovered={hovered} selected={selected} onHover={setHovered} onSelect={onSelect} />
              </Suspense>
              <p className="label-mono pointer-events-none absolute bottom-5 left-1/2 flex -translate-x-1/2 items-center gap-2 text-[10px] text-stone">
                <Hand size={13} strokeWidth={1.6} aria-hidden />
                {sel ? 'Drag to turn it · Esc to step back' : hov ? hov.name : 'Select a compartment to inspect it'}
              </p>
            </div>

            <aside className="w-full shrink-0 border-t border-line bg-char-2/80 p-6 lg:w-[380px] lg:border-l lg:border-t-0">
              <AnimatePresence mode="wait">
                {sel ? (
                  <Motion.div key={sel.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }} className="flex flex-col gap-5">
                    <button type="button" onClick={() => onSelect(null)} className="label-mono self-start text-[10px] text-stone hover:text-ivory">
                      ← The whole cabinet
                    </button>
                    <Kicker>{sel.label}</Kicker>
                    <h2 className="font-serif text-[42px] leading-[1] text-ivory">{sel.name}</h2>
                    {sel.detail && <p className="font-serif text-[22px] italic text-ivory-2">{sel.detail}</p>}
                  </Motion.div>
                ) : (
                  <Motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <p className="label-mono text-[10px] text-brass">{items.length} compartments</p>
                    <ul className="mt-4">
                      {items.map((x, i) => (
                        <li key={x.id}>
                          <button
                            type="button"
                            onClick={() => onSelect(x.id)}
                            onMouseEnter={() => setHovered(x.id)}
                            onMouseLeave={() => setHovered(null)}
                            className="flex w-full items-center gap-4 border-b border-line py-3.5 text-left text-ivory transition-colors hover:text-brass-2"
                          >
                            <span className="font-mono text-[11px] text-brass">{String(i + 1).padStart(2, '0')}</span>
                            <span className="flex-1 text-[15px]">{x.name}</span>
                            <span className="font-mono text-[10.5px] text-stone">Inspect →</span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </Motion.div>
                )}
              </AnimatePresence>
            </aside>
          </div>
        </Motion.div>
      )}
    </AnimatePresence>
  )
}
