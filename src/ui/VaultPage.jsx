import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUpRight, Lock, X } from 'lucide-react'
import { projects, vaultBoxes } from '../data/projects.js'
import { Chips, Kicker, Metrics, SectionLabel } from './bits.jsx'

const Motion = motion
const reduceMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

const boxes = vaultBoxes.map((id, i) => ({ n: String(i + 1).padStart(2, '0'), id: id || `sealed-${i}`, p: id ? projects.find((x) => x.id === id) : null }))

function LinkButton({ href, children }) {
  return (
    <a href={href} target="_blank" rel="noreferrer" className="inline-flex h-11 items-center gap-2 rounded-full border border-ivory/25 px-4 text-[14px] text-ivory transition-colors hover:border-brass hover:text-brass-2">
      {children}
      <ArrowUpRight size={15} strokeWidth={1.6} aria-hidden />
    </a>
  )
}

function Facts({ p }) {
  return (
    <div className="flex flex-col gap-7">
      <div>
        <SectionLabel>The problem</SectionLabel>
        <p className="text-[15px] leading-relaxed text-ivory-2">{p.problem}</p>
        <p className="mt-3 text-[14.5px] leading-relaxed text-stone">{p.description}</p>
      </div>
      <div>
        <SectionLabel>Architecture</SectionLabel>
        <ol>
          {p.architecture.map((a, i) => (
            <li key={a} className="grid grid-cols-[32px_1fr] gap-2 border-t border-line py-3 text-[14.5px] leading-relaxed text-ivory-2">
              <span className="font-mono text-[11px] text-brass">{String(i + 1).padStart(2, '0')}</span>
              {a}
            </li>
          ))}
        </ol>
      </div>
      <div>
        <SectionLabel>Built with</SectionLabel>
        <Chips items={p.stack} />
      </div>
      {p.contribution && (
        <div>
          <SectionLabel>My contribution</SectionLabel>
          <p className="text-[15px] leading-relaxed text-ivory-2">{p.contribution}</p>
        </div>
      )}
      <div className="flex flex-wrap gap-3">
        {p.links.live && <LinkButton href={p.links.live}>Live demo</LinkButton>}
        {p.links.github && <LinkButton href={p.links.github}>Source on GitHub</LinkButton>}
        {!p.links.live && !p.links.github && <p className="font-mono text-[12px] text-stone">Private repository · not yet deployed</p>}
      </div>
    </div>
  )
}

// ------------------------------------------------------------ Box 01: Rova as an archive feed
function ArchiveTile({ post, image }) {
  const base = 'group relative flex aspect-square flex-col justify-end overflow-hidden rounded-[3px] border border-line p-4 text-left'
  if (post.kind === 'image')
    return (
      <article className={`${base} col-span-2 row-span-2 aspect-auto min-h-[300px]`}>
        <img src={image} alt="Rova planner screenshot" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/95 via-charcoal/30 to-transparent" />
        <div className="relative">
          <p className="font-serif text-[30px] leading-tight text-ivory">{post.title}</p>
          <p className="mt-1.5 max-w-[30rem] text-[14px] leading-relaxed text-ivory-2">{post.body}</p>
        </div>
      </article>
    )
  if (post.kind === 'route')
    return (
      <article className={`${base} bg-char-2`}>
        <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full opacity-80" aria-hidden>
          <path d="M16 50 C 28 30, 42 42, 52 26 S 72 14, 86 12" fill="none" stroke="#c6a96c" strokeWidth="1.6" strokeDasharray="3 3" />
          {[[16, 50], [52, 26], [86, 12]].map(([x, y]) => (
            <g key={x}>
              <circle cx={x} cy={y} r="4.2" fill="#0d0d0e" stroke="#dcc48f" strokeWidth="1.4" />
              <circle cx={x} cy={y} r="1.4" fill="#dcc48f" />
            </g>
          ))}
        </svg>
        <div className="relative">
          <p className="font-serif text-[22px] leading-tight text-ivory">{post.title}</p>
          <p className="mt-1 text-[12.5px] leading-snug text-stone">{post.body}</p>
        </div>
      </article>
    )
  if (post.kind === 'stack')
    return (
      <article className={`${base} bg-charcoal`}>
        <p className="label-mono absolute left-4 top-4 text-[10px] text-brass">FastAPI · PostGIS · Redis</p>
        <p className="font-serif text-[22px] leading-tight text-ivory">{post.title}</p>
        <p className="mt-1 text-[12.5px] leading-snug text-stone">{post.body}</p>
      </article>
    )
  return (
    <article className={`${base} bg-ivory`}>
      <p className="font-serif text-[24px] leading-tight text-charcoal">{post.title}</p>
      <p className="mt-1.5 text-[12.5px] leading-snug text-walnut">{post.body}</p>
    </article>
  )
}

function RovaArchive({ p }) {
  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
      <section aria-label="Rova archive">
        <div className="mb-6 flex items-center gap-4 border-b border-line pb-6">
          <span className="flex h-16 w-16 items-center justify-center rounded-full border border-brass/60 font-serif text-[30px] text-brass-2">R</span>
          <div>
            <p className="font-serif text-[34px] leading-none text-ivory">{p.name}</p>
            <p className="label-mono mt-2 text-[10px] text-stone">
              The archive · {p.archive.length} posts · {p.status}
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {p.archive.map((post) => (
            <ArchiveTile key={post.id} post={post} image={p.image} />
          ))}
        </div>
      </section>
      <section className="flex flex-col gap-6">
        <div>
          <Kicker>Box 01 · {p.kind}</Kicker>
          <p className="mt-4 font-serif text-[26px] italic leading-snug text-ivory-2">{p.oneLiner}</p>
        </div>
        <Facts p={p} />
      </section>
    </div>
  )
}

// ------------------------------------------------------------ Box 02: LapZero on a circuit
const TRACK = 'M 130 300 C 120 170, 240 118, 360 150 S 560 112, 660 182 S 770 352, 652 404 S 470 368, 400 432 S 160 470, 130 300 Z'
const LAP_SECONDS = 8

function F1Car() {
  // top-down, pointing +x so animateMotion's rotate="auto" follows the racing line
  return (
    <g>
      <rect x="-22" y="-9" width="6" height="18" rx="1" fill="#141414" />
      <rect x="15" y="-11" width="5" height="22" rx="1" fill="#c6a96c" />
      {[[-12, -10], [-12, 10], [9, -9.5], [9, 9.5]].map(([x, y]) => (
        <rect key={`${x}${y}`} x={x - 4} y={y - 3} width="8" height="6" rx="1.5" fill="#0a0a0a" />
      ))}
      <path d="M -18 -5 L 6 -6 L 22 -1.6 L 22 1.6 L 6 6 L -18 5 Z" fill="#7a1f17" />
      <path d="M -10 -7.5 L 2 -7 L 2 7 L -10 7.5 Z" fill="#5e1712" />
      <rect x="-4" y="-2.2" width="7" height="4.4" rx="2" fill="#0d0d0e" />
      <path d="M -18 -0.8 L 22 -0.8 L 22 0.8 L -18 0.8 Z" fill="#dcc48f" opacity="0.9" />
    </g>
  )
}

function LapZeroCircuit({ p }) {
  const [laps, setLaps] = useState(reduceMotion ? 120 : 0)
  useEffect(() => {
    if (reduceMotion) return
    // count up to the real result, then keep lapping
    const id = setInterval(() => setLaps((l) => (l < 120 ? l + 3 : l)), 60)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="flex flex-col gap-10">
      <section aria-label="LapZero circuit" className="relative overflow-hidden rounded-[4px] border border-line bg-[#0f0f10]">
        <div aria-hidden className="absolute inset-0 opacity-[0.07] [background:repeating-linear-gradient(45deg,#fff_0_2px,transparent_2px_6px)]" />
        <div className="relative grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_280px]">
          <svg viewBox="0 0 800 520" className="w-full" role="img" aria-label="An F1 car lapping a circuit">
            <path d={TRACK} fill="none" stroke="#e8e2d6" strokeWidth="46" strokeDasharray="14 14" opacity="0.5" />
            <path d={TRACK} fill="none" stroke="#7a1f17" strokeWidth="46" strokeDasharray="14 14" strokeDashoffset="14" opacity="0.5" />
            <path d={TRACK} fill="none" stroke="#242426" strokeWidth="40" strokeLinejoin="round" />
            <path d={TRACK} fill="none" stroke="#3a3a3d" strokeWidth="1.2" strokeDasharray="10 12" />
            {/* start / finish */}
            <g transform="translate(110 300)">
              {Array.from({ length: 10 }, (_, i) => (
                <rect key={i} x={(i % 2) * 5} y={-20 + Math.floor(i / 2) * 8} width="5" height="8" fill={i % 2 === Math.floor(i / 2) % 2 ? '#efe9dd' : '#0d0d0e'} />
              ))}
            </g>
            <text x="150" y="300" fill="#8e8a84" fontSize="11" fontFamily="JetBrains Mono, monospace" letterSpacing="2">S/F</text>
            {reduceMotion ? (
              <g transform="translate(130 300) rotate(-90) scale(1.7)">
                <F1Car />
              </g>
            ) : (
              <g>
                <g transform="scale(1.7)">
                  <F1Car />
                </g>
                <animateMotion dur={`${LAP_SECONDS}s`} repeatCount="indefinite" rotate="auto" path={TRACK} keyPoints="0;1" keyTimes="0;1" calcMode="linear" />
              </g>
            )}
          </svg>
          <aside className="flex flex-col justify-between gap-6 border-t border-line p-6 lg:border-l lg:border-t-0">
            <div>
              <p className="label-mono text-[10px] text-brass">Unseen track · laps completed</p>
              <p className="mt-3 font-serif text-[64px] leading-none text-ivory">
                {laps}
                <span className="text-stone">/120</span>
              </p>
            </div>
            <dl className="flex flex-col gap-4 font-mono text-[12px]">
              {p.results.slice(1).map((r) => (
                <div key={r.label} className="flex flex-col gap-1 border-t border-line pt-3">
                  <dt className="text-stone">{r.label}</dt>
                  <dd className="text-[16px] text-ivory">{r.value}</dd>
                </div>
              ))}
            </dl>
          </aside>
        </div>
      </section>
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        <div>
          <Kicker>Box 02 · {p.kind}</Kicker>
          <p className="mt-4 font-serif text-[26px] italic leading-snug text-ivory-2">{p.oneLiner}</p>
          <div className="mt-6">
            <Metrics items={p.results} />
          </div>
        </div>
        <Facts p={p} />
      </div>
    </div>
  )
}

// ------------------------------------------------------------ Box 03: sealed
function Sealed({ n }) {
  return (
    <div className="flex flex-col items-center gap-8 py-16 text-center">
      <svg viewBox="0 0 200 200" className="w-[220px]" aria-hidden>
        <circle cx="100" cy="100" r="92" fill="#1c1d1f" stroke="#6c7074" strokeWidth="6" />
        <circle cx="100" cy="100" r="70" fill="none" stroke="#3a3c3f" strokeWidth="2" />
        {Array.from({ length: 12 }, (_, i) => {
          const a = (i / 12) * Math.PI * 2
          return <circle key={i} cx={100 + Math.cos(a) * 82} cy={100 + Math.sin(a) * 82} r="4" fill="#b9bcc0" />
        })}
        <circle cx="100" cy="100" r="36" fill="none" stroke="#b9bcc0" strokeWidth="4" />
        {[0, 60, 120].map((r) => (
          <rect key={r} x="62" y="98" width="76" height="4" fill="#b9bcc0" transform={`rotate(${r} 100 100)`} />
        ))}
        <circle cx="100" cy="100" r="9" fill="#c6a96c" />
      </svg>
      <div>
        <p className="label-mono flex items-center justify-center gap-2 text-[10.5px] text-brass">
          <Lock size={12} aria-hidden /> Box {n} · sealed
        </p>
        <p className="mt-4 font-serif text-[40px] leading-tight text-ivory">Reserved for what’s next.</p>
        <p className="mt-3 text-[15px] text-stone">This box opens when the next project is ready to be shown.</p>
      </div>
    </div>
  )
}

export default function VaultPage({ open, project, onProject, onClose }) {
  const closeRef = useRef()
  const current = boxes.find((b) => b.id === project) || boxes[0]

  useEffect(() => {
    if (!open) return
    closeRef.current?.focus()
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <Motion.div
          key="vault"
          role="dialog"
          aria-modal="true"
          aria-label="The Vault: projects"
          initial={{ clipPath: 'circle(0% at 50% 50%)' }}
          animate={{ clipPath: 'circle(150% at 50% 50%)', transition: { duration: reduceMotion ? 0 : 1.1, ease: [0.65, 0, 0.35, 1] } }}
          exit={{ clipPath: 'circle(0% at 50% 50%)', transition: { duration: reduceMotion ? 0 : 0.7, ease: [0.65, 0, 0.35, 1] } }}
          className="fixed inset-0 z-[60] overflow-y-auto bg-[#111213] text-ivory"
        >
          <div aria-hidden className="pointer-events-none fixed inset-0 opacity-[0.05] [background:repeating-linear-gradient(90deg,#fff_0_1px,transparent_1px_3px)]" />
          <header className="sticky top-0 z-10 border-b border-line bg-[#111213]/92 backdrop-blur-md">
            <div className="mx-auto flex max-w-[1280px] flex-wrap items-center gap-4 px-5 py-4 lg:px-8">
              <div className="leading-none">
                <p className="font-serif text-[28px]">The Vault</p>
                <p className="label-mono mt-1.5 text-[10px] text-stone">04 · Projects</p>
              </div>
              <nav aria-label="Deposit boxes" className="order-3 flex w-full gap-1 overflow-x-auto sm:order-none sm:mx-auto sm:w-auto">
                {boxes.map((b) => {
                  const on = b.id === current.id
                  return (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => onProject(b.p ? b.p.id : 'sealed')}
                      aria-current={on ? 'true' : undefined}
                      className={`flex h-11 shrink-0 items-center gap-2.5 rounded-full border px-4 text-[13.5px] transition-colors ${on ? 'border-brass bg-brass text-charcoal' : 'border-line text-ivory-2 hover:border-brass/60 hover:text-ivory'}`}
                    >
                      <span className={`font-mono text-[10px] ${on ? 'text-walnut' : 'text-brass'}`}>{b.n}</span>
                      {b.p ? b.p.name : 'Sealed'}
                    </button>
                  )
                })}
              </nav>
              <button
                ref={closeRef}
                type="button"
                onClick={onClose}
                className="ml-auto inline-flex h-11 items-center gap-2 rounded-full border border-line px-4 text-[13px] text-ivory-2 transition-colors hover:border-ivory/40 hover:text-ivory sm:ml-0"
              >
                Leave the vault <X size={15} strokeWidth={1.6} aria-hidden />
              </button>
            </div>
          </header>
          <main className="relative mx-auto max-w-[1280px] px-5 pb-24 pt-10 lg:px-8">
            <AnimatePresence mode="wait">
              <Motion.div key={current.id} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.35 }}>
                {current.p?.id === 'rova' && <RovaArchive p={current.p} />}
                {current.p?.id === 'lapzero' && <LapZeroCircuit p={current.p} />}
                {!current.p && <Sealed n={current.n} />}
              </Motion.div>
            </AnimatePresence>
          </main>
        </Motion.div>
      )}
    </AnimatePresence>
  )
}
