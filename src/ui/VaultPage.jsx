import { Suspense, lazy, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, ArrowUpRight, Github, Image as ImageIcon, X } from 'lucide-react'
import { projects, vaultBoxed, vaultDisplays, vaultFeatured, vaultRightWall } from '../data/projects.js'
import { Chips, Kicker, Metrics, SectionLabel } from './bits.jsx'

const Motion = motion
const UnlockScene = lazy(() => import('../scene/vault/UnlockScene.jsx'))
const VaultRoomScene = lazy(() => import('../scene/vault/VaultRoomScene.jsx'))
const reduceMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
const displays = vaultDisplays.map((id, i) => ({ n: String(i + 1).padStart(2, '0'), p: projects.find((x) => x.id === id) })).filter((d) => d.p)
let unlockedThisVisit = false

// ============================================================ unlock sequence
const BOLTS = Array.from({ length: 16 }, (_, i) => (i / 16) * 360)
const COMBINATION = [-137, 212, -48]

function UnlockSequence2D({ onDone }) {
  const [step, setStep] = useState(0) // 0 idle, 1-3 tumblers, 4 bolts, 5 granted, 6 door
  useEffect(() => {
    const times = [350, 1150, 1950, 2550, 3050, 3600, 4500]
    const ids = times.map((t, i) => setTimeout(() => (i < 6 ? setStep(i + 1) : onDone()), t))
    return () => ids.forEach(clearTimeout)
  }, [onDone])

  const dialAngle = step === 0 ? 0 : COMBINATION[Math.min(step, 3) - 1]
  const granted = step >= 5

  return (
    <div className="flex min-h-full flex-col items-center justify-center gap-8 px-6 py-16" style={{ perspective: 1600 }}>
      <p className="label-mono text-[11px] text-brass">Vault 04 · Projects · Restricted</p>
      <Motion.div
        className="relative"
        style={{ transformOrigin: '100% 50%', transformStyle: 'preserve-3d' }}
        animate={step >= 6 ? { rotateY: -108, opacity: 0.0, x: 60 } : { rotateY: 0, opacity: 1, x: 0 }}
        transition={{ duration: 0.9, ease: [0.65, 0, 0.35, 1] }}
      >
        <svg viewBox="0 0 520 520" className="h-[min(62vh,520px)] w-[min(62vh,520px)]" aria-hidden>
          <defs>
            <radialGradient id="vdoor" cx="40%" cy="35%" r="75%">
              <stop offset="0" stopColor="#8b8f94" />
              <stop offset="0.6" stopColor="#55595e" />
              <stop offset="1" stopColor="#2e3033" />
            </radialGradient>
            <radialGradient id="vdial" cx="40%" cy="35%" r="80%">
              <stop offset="0" stopColor="#d8dadd" />
              <stop offset="1" stopColor="#7b7f84" />
            </radialGradient>
          </defs>
          {/* frame */}
          <circle cx="260" cy="260" r="252" fill="#1a1b1d" stroke="#3a3c3f" strokeWidth="6" />
          {/* bolts */}
          {BOLTS.map((a) => (
            <g key={a} transform={`rotate(${a} 260 260)`}>
              <Motion.rect
                x="250"
                width="20"
                height="34"
                rx="4"
                fill="#b9bcc0"
                initial={false}
                animate={{ y: step >= 4 ? 34 : 10 }}
                transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1], delay: (a / 360) * 0.18 }}
              />
            </g>
          ))}
          {/* door face */}
          <circle cx="260" cy="260" r="214" fill="url(#vdoor)" stroke="#2a2c2f" strokeWidth="4" />
          <circle cx="260" cy="260" r="184" fill="none" stroke="#6c7074" strokeWidth="2" opacity="0.6" />
          <circle cx="260" cy="260" r="150" fill="none" stroke="#2a2c2f" strokeWidth="10" opacity="0.5" />
          {/* status lamp */}
          <circle cx="260" cy="96" r="9" fill={granted ? '#7fcf98' : '#d97757'} />
          {granted && <circle cx="260" cy="96" r="18" fill="#7fcf98" opacity="0.25" />}
          {/* dial */}
          <Motion.g
            style={{ originX: '260px', originY: '260px', transformBox: 'view-box' }}
            animate={{ rotate: dialAngle }}
            transition={{ duration: 0.7, ease: [0.3, 0, 0.2, 1] }}
          >
            <circle cx="260" cy="260" r="96" fill="url(#vdial)" stroke="#3a3c3f" strokeWidth="3" />
            {Array.from({ length: 50 }, (_, i) => (
              <line key={i} x1="260" y1="170" x2="260" y2={i % 5 === 0 ? 186 : 178} stroke="#2a2c2f" strokeWidth={i % 5 === 0 ? 3 : 1.5} transform={`rotate(${i * 7.2} 260 260)`} />
            ))}
            {Array.from({ length: 10 }, (_, i) => (
              <text key={i} x="260" y="202" textAnchor="middle" fontSize="13" fontFamily="JetBrains Mono, monospace" fill="#2a2c2f" transform={`rotate(${i * 36} 260 260)`}>
                {i * 10}
              </text>
            ))}
            <circle cx="260" cy="260" r="34" fill="#2e3033" stroke="#b9bcc0" strokeWidth="3" />
            <rect x="254" y="226" width="12" height="20" rx="3" fill="#c6a96c" />
          </Motion.g>
          {/* index mark */}
          <path d="M 252 150 L 268 150 L 260 164 Z" fill="#c6a96c" />
        </svg>
      </Motion.div>

      <div className="flex flex-col items-center gap-4">
        <div className="flex gap-6">
          {[1, 2, 3].map((t) => (
            <div key={t} className="flex flex-col items-center gap-2">
              <span className={`h-3 w-3 rounded-full transition-colors duration-300 ${step >= t ? 'bg-[#7fcf98] shadow-[0_0_12px_#7fcf98]' : 'bg-[#3a3c3f]'}`} />
              <span className="label-mono text-[9.5px] text-stone">Tumbler {t}</span>
            </div>
          ))}
        </div>
        <p role="status" className={`font-mono text-[15px] tracking-[0.3em] ${granted ? 'text-[#7fcf98]' : 'text-ivory-2'}`}>
          {granted ? 'ACCESS GRANTED' : step >= 4 ? 'RETRACTING BOLTS…' : step >= 1 ? `CODE ${String(Math.abs(COMBINATION[Math.min(step, 3) - 1]) % 100).padStart(2, '0')} ACCEPTED` : 'AUTHENTICATING…'}
        </p>
        <button type="button" onClick={onDone} className="label-mono text-[10px] text-stone underline-offset-4 hover:text-ivory hover:underline">
          Skip
        </button>
      </div>
    </div>
  )
}

// 3D version: the door is a real model; the status text sits over it.
function UnlockSequence3D({ onDone }) {
  const [step, setStep] = useState(0)
  const granted = step >= 5
  const label = granted ? 'ACCESS GRANTED' : step >= 4 ? 'RETRACTING BOLTS…' : step >= 1 ? `TUMBLER ${step} OF 3 · ACCEPTED` : 'AUTHENTICATING…'
  return (
    <div className="relative h-full min-h-screen">
      <div className="absolute inset-0">
        <Suspense fallback={null}>
          <UnlockScene onStep={setStep} onDone={onDone} />
        </Suspense>
      </div>
      <div className="pointer-events-none absolute inset-x-0 top-8 text-center">
        <p className="label-mono text-[11px] text-brass">Vault 04 · Projects · Restricted</p>
      </div>
      <div className="absolute inset-x-0 bottom-10 flex flex-col items-center gap-4">
        <div className="flex gap-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="flex flex-col items-center gap-2">
              <span className={`h-3 w-3 rounded-full transition-colors duration-300 ${step >= n ? 'bg-[#7fcf98] shadow-[0_0_12px_#7fcf98]' : 'bg-[#3a3c3f]'}`} />
              <span className="label-mono text-[9.5px] text-stone">Tumbler {n}</span>
            </div>
          ))}
        </div>
        <p role="status" className={`font-mono text-[15px] tracking-[0.3em] ${granted ? 'text-[#7fcf98]' : 'text-ivory-2'}`}>
          {label}
        </p>
        <button type="button" onClick={onDone} className="label-mono text-[10px] text-stone underline-offset-4 hover:text-ivory hover:underline">
          Skip
        </button>
      </div>
    </div>
  )
}

// ============================================================ shared pieces
// Every project has an image slot. Set `image` in src/data/projects.js to fill it;
// until then a placeholder frame holds the space.
function ScreenImage({ p, className = '' }) {
  const [failed, setFailed] = useState(false)
  if (!p.image || failed)
    return (
      <div className={`flex flex-col items-center justify-center gap-3 bg-[#121417] ${className}`}>
        <div aria-hidden className="absolute inset-3 rounded-[2px] border border-dashed border-[#3a3f45]" />
        <ImageIcon size={26} strokeWidth={1.4} className="text-[#4d5560]" aria-hidden />
        <span className="font-serif text-[30px] leading-none text-[#4d5560]">{p.name}</span>
        <span className="label-mono text-[9.5px] text-[#4d5560]">Image coming soon</span>
      </div>
    )
  return <img src={p.image} alt={`${p.name} screenshot`} onError={() => setFailed(true)} className={`object-cover ${className}`} />
}

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
        <SectionLabel>{p.problem ? 'The problem' : 'What it is'}</SectionLabel>
        {p.problem && <p className="text-[15px] leading-relaxed text-ivory-2">{p.problem}</p>}
        <p className={`${p.problem ? 'mt-3 text-stone' : 'text-ivory-2'} text-[14.5px] leading-relaxed`}>{p.description}</p>
      </div>
      {p.architecture?.length > 0 && (
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
      )}
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

// ============================================================ Rova: archive feed
function ArchiveTile({ post, image }) {
  const base = 'group relative flex aspect-square flex-col justify-end overflow-hidden rounded-[3px] border border-line p-4 text-left'
  if (post.kind === 'image')
    return (
      <article className={`${base} col-span-2 row-span-2 aspect-auto min-h-[300px] bg-[#f2e8dc] p-0`}>
        <img src={post.image || image} alt={`${post.title} brand artwork`} className="absolute inset-0 h-full w-full object-contain transition-transform duration-700 group-hover:scale-[1.03]" />
      </article>
    )
  if (post.kind === 'photo')
    return (
      <article className={`${base} ${post.wide ? 'col-span-2 aspect-auto min-h-[120px]' : ''} bg-black p-0`}>
        <img src={post.image} alt={`Rova ${post.title.toLowerCase()}`} className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]" />
        <p className="label-mono relative m-3 self-start rounded-full bg-charcoal/80 px-2.5 py-1 text-[9.5px] text-ivory-2 backdrop-blur">{post.title}</p>
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
          {p.icon ? (
            <img src={p.icon} alt="" className="h-16 w-16 rounded-full border border-brass/60 object-cover" />
          ) : (
            <span className="flex h-16 w-16 items-center justify-center rounded-full border border-brass/60 font-serif text-[30px] text-brass-2">R</span>
          )}
          <div>
            <p className="font-serif text-[34px] leading-none text-ivory">{p.name}</p>
            <p className="label-mono mt-2 text-[10px] text-stone">
              The archive · {p.archive.length} posts · {p.status}
            </p>
            {p.tagline && <p className="mt-2 font-serif text-[17px] italic text-ivory-2">{p.tagline}</p>}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {p.archive.map((post) => (
            <ArchiveTile key={post.id} post={post} image={p.image} />
          ))}
        </div>
      </section>
      <section className="flex flex-col gap-6">
        <p className="font-serif text-[26px] italic leading-snug text-ivory-2">{p.oneLiner}</p>
        <Facts p={p} />
      </section>
    </div>
  )
}

// ============================================================ LapZero: F1 on a circuit
const TRACK = 'M 130 300 C 120 170, 240 118, 360 150 S 560 112, 660 182 S 770 352, 652 404 S 470 368, 400 432 S 160 470, 130 300 Z'

function F1Car() {
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
            <g transform="translate(110 300)">
              {Array.from({ length: 10 }, (_, i) => (
                <rect key={i} x={(i % 2) * 5} y={-20 + Math.floor(i / 2) * 8} width="5" height="8" fill={i % 2 === Math.floor(i / 2) % 2 ? '#efe9dd' : '#0d0d0e'} />
              ))}
            </g>
            {reduceMotion ? (
              <g transform="translate(130 300) rotate(-90) scale(1.7)">
                <F1Car />
              </g>
            ) : (
              <g>
                <g transform="scale(1.7)">
                  <F1Car />
                </g>
                <animateMotion dur="8s" repeatCount="indefinite" rotate="auto" path={TRACK} />
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
          <p className="font-serif text-[26px] italic leading-snug text-ivory-2">{p.oneLiner}</p>
          <div className="mt-6">
            <Metrics items={p.results} />
          </div>
        </div>
        <Facts p={p} />
      </div>
    </div>
  )
}

// ============================================================ any other project: a file view
function ProjectFile({ p }) {
  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
      <div className="overflow-hidden rounded-[6px] border-[10px] border-[#1a1c1f] bg-black shadow-[0_0_0_1px_#2c2a27]">
        <div className="relative aspect-[16/10]">
          <ScreenImage p={p} className="absolute inset-0 h-full w-full" />
          <div aria-hidden className="pointer-events-none absolute inset-0 [background:repeating-linear-gradient(0deg,rgba(0,0,0,.18)_0_1px,transparent_1px_3px)]" />
        </div>
      </div>
      <div className="flex flex-col gap-6">
        <p className="font-serif text-[26px] italic leading-snug text-ivory-2">{p.oneLiner}</p>
        <Facts p={p} />
      </div>
    </div>
  )
}

// ============================================================ the wall of displays
function Display({ d, onOpen, wide }) {
  const { p, n } = d
  return (
    <button
      type="button"
      onClick={onOpen}
      className={`group relative flex h-full w-full flex-col overflow-hidden rounded-[6px] border border-[#2a2d31] bg-[#16181b] p-2 text-left transition-[border-color,box-shadow] duration-300 hover:border-brass/70 hover:shadow-[0_0_40px_rgba(198,169,108,.18)] focus-visible:border-brass ${wide ? 'md:col-span-2' : ''}`}
    >
      <div className="relative overflow-hidden rounded-[3px] bg-black">
        <div className={`relative ${wide ? 'aspect-[21/9]' : 'aspect-[16/10]'}`}>
          <ScreenImage p={p} className="absolute inset-0 h-full w-full opacity-90 transition-[opacity,transform] duration-500 group-hover:scale-[1.03] group-hover:opacity-100" />
          <div aria-hidden className="pointer-events-none absolute inset-0 [background:repeating-linear-gradient(0deg,rgba(0,0,0,.16)_0_1px,transparent_1px_3px)]" />
          <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_65%,rgba(0,0,0,.45)_100%)]" />
          <div className="absolute inset-x-0 top-0 flex items-center justify-between px-3 py-2 font-mono text-[10px] tracking-[0.14em] text-[#9fb4c2]">
            <span>DISPLAY {n}</span>
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-[#7fcf98] shadow-[0_0_6px_#7fcf98]" /> ONLINE
            </span>
          </div>
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent px-4 pb-3 pt-10">
            <p className="font-serif text-[26px] leading-none text-ivory">{p.name}</p>
            <p className="label-mono mt-2 text-[9.5px] text-stone">
              {p.kind} · {p.year}
            </p>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between gap-3 px-2 pb-1 pt-3">
        <span className="rounded-full border border-line px-2 py-0.5 font-mono text-[10px] text-ivory-2">{p.status}</span>
        <span className="flex items-center gap-2 font-mono text-[10.5px] text-stone transition-colors group-hover:text-brass-2">
          {p.links.github && <Github size={12} aria-hidden />}
          OPEN FILE →
        </span>
      </div>
    </button>
  )
}

function useClock() {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])
  return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })
}

function SecureHeader({ onClose, closeRef, current, onBack }) {
  const clock = useClock()
  return (
    <header className="sticky top-0 z-10 border-b border-[#24272b] bg-[#0e0f11]/92 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1320px] flex-wrap items-center gap-x-6 gap-y-3 px-5 py-3 lg:px-8">
        <div className="flex items-center gap-3">
          <img src="/logos/sai-logo.png" alt="" className="h-8 w-auto opacity-90" />
          <div className="leading-none">
            <p className="font-serif text-[24px]">Projects</p>
            <p className="label-mono mt-1 text-[9.5px] text-stone">Vault 04 · Secure storage</p>
          </div>
        </div>
        <div className="hidden items-center gap-4 font-mono text-[10.5px] tracking-[0.12em] text-stone md:flex">
          <span className="flex items-center gap-1.5 text-[#7fcf98]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#7fcf98] shadow-[0_0_6px_#7fcf98]" /> SECURE
          </span>
          <span>CLEARANCE · VISITOR</span>
          <span>{displays.length} FILES</span>
          <span className="text-ivory-2">{clock}</span>
        </div>
        <div className="ml-auto flex items-center gap-2">
          {current && (
            <button type="button" onClick={onBack} className="inline-flex h-10 items-center gap-2 rounded-full border border-line px-4 text-[13px] text-ivory-2 transition-colors hover:border-brass/60 hover:text-ivory">
              <ArrowLeft size={14} aria-hidden /> All displays
            </button>
          )}
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="inline-flex h-10 items-center gap-2 rounded-full border border-line px-4 text-[13px] text-ivory-2 transition-colors hover:border-ivory/40 hover:text-ivory"
          >
            Leave the vault <X size={14} strokeWidth={1.6} aria-hidden />
          </button>
        </div>
      </div>
    </header>
  )
}

function Inside({ project, onProject, onClose, closeRef }) {
  const current = displays.find((d) => d.p.id === project)
  return (
    <div className="min-h-full bg-[#0e0f11]">
      <div aria-hidden className="pointer-events-none fixed inset-0 opacity-[0.06] [background:linear-gradient(#fff_1px,transparent_1px)_0_0/48px_48px,linear-gradient(90deg,#fff_1px,transparent_1px)_0_0/48px_48px]" />
      <SecureHeader onClose={onClose} closeRef={closeRef} current={current} onBack={() => onProject(null)} />
      <main className="relative mx-auto max-w-[1320px] px-5 pb-24 pt-8 lg:px-8">
        <AnimatePresence mode="wait">
          {current ? (
            <Motion.div key={current.p.id} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }}>
              <div className="mb-8 flex flex-wrap items-end justify-between gap-4 border-b border-line pb-6">
                <div>
                  <Kicker>
                    File {current.n} · {current.p.kind}
                  </Kicker>
                  <h2 className="mt-3 font-serif text-[56px] leading-[0.95] text-ivory">{current.p.name}</h2>
                </div>
                <span className="rounded-full border border-brass/40 px-3 py-1 font-mono text-[11px] text-brass-2">
                  {current.p.status} · {current.p.year}
                </span>
              </div>
              {current.p.id === 'rova' ? <RovaArchive p={current.p} /> : current.p.id === 'lapzero' ? <LapZeroCircuit p={current.p} /> : <ProjectFile p={current.p} />}
            </Motion.div>
          ) : (
            <Motion.div key="wall" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
              <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p className="label-mono text-[10px] text-brass">Access granted</p>
                  <h2 className="mt-2 font-serif text-[48px] leading-none text-ivory">Everything I’ve built</h2>
                </div>
                <p className="max-w-[26rem] text-[14px] leading-relaxed text-stone">Each display is one project. Open a file for the problem, the architecture and the links.</p>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {displays.map((d, i) => (
                  <Motion.div key={d.p.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * i, duration: 0.5 }}>
                    <Display d={d} wide={false} onOpen={() => onProject(d.p.id)} />
                  </Motion.div>
                ))}
              </div>
            </Motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}

// project: null shows the wall of displays, an id opens that file.
// ============================================================ the 3D walk-in vault
function ExhibitRow({ d, onProject, setHovered }) {
  return (
    <li>
      <button
        type="button"
        onClick={() => onProject(d.p.id)}
        onMouseEnter={() => setHovered(d.p.id)}
        onMouseLeave={() => setHovered(null)}
        className="flex w-full items-center gap-4 border-b border-line py-3 text-left text-ivory transition-colors hover:text-brass-2"
      >
        <span className="font-mono text-[11px] text-brass">{d.n}</span>
        <span className="flex-1">
          <span className="block text-[15px]">{d.p.name}</span>
          <span className="block font-mono text-[10.5px] text-stone">{d.p.kind}</span>
        </span>
        <span className="font-mono text-[10.5px] text-stone">View →</span>
      </button>
    </li>
  )
}

const TOP_THREE = { rova: '01', vouch: '02', lapzero: '03' }
const featuredDisplays = displays.filter((d) => vaultFeatured.includes(d.p.id))
const boxedDisplays = displays.filter((d) => vaultBoxed.includes(d.p.id))

function Vault3D({ project, onProject, onClose, closeRef }) {
  const [hovered, setHovered] = useState(null)
  const [fileOpen, setFileOpen] = useState(false)
  const [listOpen, setListOpen] = useState(false)
  const [boxesOpen, setBoxesOpen] = useState(false)
  const [walk, setWalk] = useState(0)
  const sel = displays.find((d) => d.p.id === project)
  const hov = displays.find((d) => d.p.id === hovered)
  const boxed = sel && vaultBoxed.includes(sel.p.id)
  const panel = Boolean(sel) || listOpen
  // a case on the right wall gets its panel on the left, so the case stays in view
  const onLeft = Boolean(sel) && vaultRightWall.includes(sel.p.id)

  if (fileOpen && sel)
    return <Inside project={project} onProject={(id) => (id ? onProject(id) : setFileOpen(false))} onClose={onClose} closeRef={closeRef} />

  return (
    <div className="flex h-screen flex-col bg-[#0b0c0d]">
      <SecureHeader onClose={onClose} closeRef={closeRef} current={null} onBack={() => onProject(null)} />
      <div className="relative min-h-0 flex-1 overflow-hidden">
        <Suspense fallback={null}>
          <VaultRoomScene projects={projects} hovered={hovered} selected={project} onHover={setHovered} onSelect={(id) => onProject(id)} onWalk={setWalk} />
        </Suspense>

        {!panel && (
          <button
            type="button"
            onClick={() => setListOpen(true)}
            className="label-mono absolute right-5 top-5 inline-flex h-10 items-center gap-2 rounded-full border border-brass/50 bg-charcoal/80 px-4 text-[10.5px] text-brass-2 backdrop-blur-md transition-colors hover:bg-charcoal"
          >
            {displays.length} projects <span aria-hidden>☰</span>
          </button>
        )}

        <div className="pointer-events-none absolute bottom-5 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2.5">
          {!sel && (
            <div className="flex items-center gap-2.5 font-mono text-[9.5px] text-stone" aria-hidden>
              <span>Door</span>
              <span className="relative h-[3px] w-40 overflow-hidden rounded-full bg-line">
                <span className="absolute inset-y-0 left-0 rounded-full bg-brass" style={{ width: `${Math.round(walk * 100)}%` }} />
              </span>
              <span>Rova</span>
            </div>
          )}
          <p className="label-mono rounded-full border border-line bg-charcoal/80 px-4 py-2 text-[10px] text-stone backdrop-blur-md">
            {sel ? 'Drag the piece to turn it · Esc, scroll or click the floor to step back' : hov ? `${hov.p.name} · ${hov.p.kind}` : 'Scroll or ↑ ↓ to walk the hall · click a case to look closer'}
          </p>
        </div>

        <AnimatePresence>
          {panel && (
            <Motion.aside
              key={onLeft ? 'panel-left' : 'panel-right'}
              initial={{ x: onLeft ? -40 : 40, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: onLeft ? -40 : 40, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.2, 0.7, 0.2, 1] }}
              className={`panel-scroll absolute inset-y-0 w-full max-w-[400px] overflow-y-auto bg-[#111214]/95 p-6 backdrop-blur-md ${onLeft ? 'left-0 border-r border-line' : 'right-0 border-l border-line'}`}
            >
              <AnimatePresence mode="wait">
                {sel ? (
                  <Motion.div key={sel.p.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }} className="flex flex-col gap-5">
                    <button type="button" onClick={() => onProject(null)} className="label-mono self-start text-[10px] text-stone hover:text-ivory">
                      ← Back to the hall
                    </button>
                    <Kicker>
                      {TOP_THREE[sel.p.id] ? `Top three · Nº ${TOP_THREE[sel.p.id]}` : boxed ? `Small case ${sel.n}` : `Exhibit ${sel.n}`} · {sel.p.kind}
                    </Kicker>
                    <h2 className="font-serif text-[44px] leading-[0.95] text-ivory">{sel.p.name}</h2>
                    <span className="self-start rounded-full border border-brass/40 px-2.5 py-0.5 font-mono text-[10.5px] text-brass-2">
                      {sel.p.status} · {sel.p.year}
                    </span>
                    <div className="relative aspect-[16/10] overflow-hidden rounded-[4px] border border-line bg-black">
                      <ScreenImage p={sel.p} className="absolute inset-0 h-full w-full" />
                    </div>
                    <p className="font-serif text-[21px] italic leading-snug text-ivory-2">{sel.p.oneLiner}</p>
                    <Chips items={sel.p.stack} />
                    <div className="flex flex-wrap gap-3">
                      <button
                        type="button"
                        onClick={() => setFileOpen(true)}
                        className="inline-flex h-11 items-center gap-2 rounded-full bg-brass px-5 text-[14px] font-medium text-charcoal transition-colors hover:bg-brass-2"
                      >
                        Open full file →
                      </button>
                      {sel.p.links.live && <LinkButton href={sel.p.links.live}>Live demo</LinkButton>}
                      {sel.p.links.github && <LinkButton href={sel.p.links.github}>GitHub</LinkButton>}
                    </div>
                  </Motion.div>
                ) : (
                  <Motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <div className="flex items-start justify-between gap-4">
                      <p className="label-mono text-[10px] text-brass">Access granted · {displays.length} projects</p>
                      <button type="button" onClick={() => setListOpen(false)} aria-label="Hide the list" className="-mt-1 text-stone hover:text-ivory">
                        ✕
                      </button>
                    </div>
                    <h2 className="mt-2 font-serif text-[34px] leading-none text-ivory">Everything I’ve built</h2>
                    <p className="label-mono mt-6 text-[10px] text-stone">Hall of fame · {featuredDisplays.length}</p>
                    <ul className="mt-1">
                      {featuredDisplays.map((d) => (
                        <ExhibitRow key={d.p.id} d={d} onProject={onProject} setHovered={setHovered} />
                      ))}
                    </ul>
                    <button
                      type="button"
                      onClick={() => setBoxesOpen((o) => !o)}
                      aria-expanded={boxesOpen}
                      className="label-mono mt-6 flex w-full items-center justify-between border-b border-line pb-3 text-[10px] text-stone hover:text-ivory"
                    >
                      <span>In the smaller cases · {boxedDisplays.length}</span>
                      <span aria-hidden className={`transition-transform ${boxesOpen ? 'rotate-180' : ''}`}>
                        ▾
                      </span>
                    </button>
                    <AnimatePresence initial={false}>
                      {boxesOpen && (
                        <Motion.ul key="boxes" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                          {boxedDisplays.map((d) => (
                            <ExhibitRow key={d.p.id} d={d} onProject={onProject} setHovered={setHovered} />
                          ))}
                        </Motion.ul>
                      )}
                    </AnimatePresence>
                  </Motion.div>
                )}
              </AnimatePresence>
            </Motion.aside>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default function VaultPage({ open, project, onProject, onClose, threeD = false }) {
  const closeRef = useRef()
  const [unlocked, setUnlocked] = useState(() => unlockedThisVisit || reduceMotion)

  useEffect(() => {
    if (!open) return
    // Esc steps back out of a selected exhibit first, then leaves the vault
    const onKey = (e) => {
      if (e.key !== 'Escape') return
      if (project) onProject(null)
      else onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose, project, onProject])

  useEffect(() => {
    if (open && unlocked) closeRef.current?.focus({ preventScroll: true })
  }, [open, unlocked])

  const finishUnlock = () => {
    unlockedThisVisit = true
    setUnlocked(true)
  }

  return (
    <AnimatePresence>
      {open && (
        <Motion.div
          key="vault"
          role="dialog"
          aria-modal="true"
          aria-label="The Vault: projects"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 0.4 } }}
          exit={{ opacity: 0, transition: { duration: 0.4 } }}
          className="fixed inset-0 z-[60] overflow-y-auto bg-[#0b0c0d] text-ivory"
        >
          <AnimatePresence mode="wait">
            {!unlocked ? (
              <Motion.div key="lock" className="min-h-full" exit={{ opacity: 0, transition: { duration: 0.3 } }}>
                {threeD ? <UnlockSequence3D onDone={finishUnlock} /> : <UnlockSequence2D onDone={finishUnlock} />}
              </Motion.div>
            ) : (
              <Motion.div
                key="inside"
                className="min-h-full"
                initial={{ clipPath: 'circle(0% at 50% 50%)' }}
                animate={{ clipPath: 'circle(150% at 50% 50%)', transition: { duration: reduceMotion ? 0 : 1.0, ease: [0.65, 0, 0.35, 1] } }}
              >
                {threeD ? (
                  <Vault3D project={project} onProject={onProject} onClose={onClose} closeRef={closeRef} />
                ) : (
                  <Inside project={project} onProject={onProject} onClose={onClose} closeRef={closeRef} />
                )}
              </Motion.div>
            )}
          </AnimatePresence>
        </Motion.div>
      )}
    </AnimatePresence>
  )
}
