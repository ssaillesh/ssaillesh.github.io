import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { profile } from '../../data/profile.js'
import { isLive } from '../../data/projects.js'
import { LiveBadge, Reveal } from './parts.jsx'
import { ProjectCover } from './ProjectPages.jsx'
import { projectHref } from './projectMeta.js'
import { useMediaQuery } from './hooks.js'

const Motion = motion
const EASE = [0.2, 0.7, 0.2, 1]

// A slow brass glow behind the hero. Two pools drift on their own; on a laptop a third
// follows the mouse with a soft spring. Gradients only, no blur filters, so phones stay smooth.
export function Aurora() {
  const reduce = useReducedMotion()
  const fine = useMediaQuery('(any-pointer: fine)')
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const x = useSpring(mx, { stiffness: 35, damping: 18 })
  const y = useSpring(my, { stiffness: 35, damping: 18 })

  useEffect(() => {
    if (!fine || reduce) return undefined
    const move = (e) => {
      mx.set((e.clientX - window.innerWidth / 2) * 0.6)
      my.set((e.clientY - window.innerHeight / 2) * 0.6)
    }
    window.addEventListener('pointermove', move, { passive: true })
    return () => window.removeEventListener('pointermove', move)
  }, [fine, reduce, mx, my])

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="aurora-a absolute -right-[20%] -top-[30%] h-[85vmax] w-[85vmax] rounded-full bg-[radial-gradient(circle,rgba(198,169,108,0.30),transparent_62%)]" />
      <div className="aurora-b absolute -left-[25%] top-[20%] h-[70vmax] w-[70vmax] rounded-full bg-[radial-gradient(circle,rgba(232,163,90,0.14),transparent_60%)]" />
      {fine && !reduce && (
        <Motion.div style={{ x, y }} className="absolute left-1/2 top-[40%] -ml-[22rem] -mt-[22rem] h-[44rem] w-[44rem] rounded-full bg-[radial-gradient(circle,rgba(220,196,143,0.16),transparent_60%)]" />
      )}
    </div>
  )
}

// The name rises in one letter at a time.
export function LetterRise({ text, className = '', delay = 0 }) {
  const reduce = useReducedMotion()
  return (
    <h1 className={className} aria-label={text}>
      {[...text].map((c, i) => (
        <Motion.span
          key={i}
          aria-hidden
          className="inline-block"
          initial={reduce ? false : { opacity: 0, y: '45%', filter: 'blur(10px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.9, delay: delay + i * 0.05, ease: EASE }}
        >
          {c}
        </Motion.span>
      ))}
    </h1>
  )
}

// Cycles through short phrases, each sliding up into place.
export function RoleTicker({ items, interval = 2400, className = '' }) {
  const reduce = useReducedMotion()
  const [i, setI] = useState(0)

  useEffect(() => {
    if (reduce || items.length < 2) return undefined
    const t = setInterval(() => setI((v) => (v + 1) % items.length), interval)
    return () => clearInterval(t)
  }, [reduce, items.length, interval])

  return (
    <span className={`relative block h-[1.3em] overflow-hidden ${className}`}>
      <span className="sr-only">{items.join(', ')}</span>
      <AnimatePresence initial={false}>
        <Motion.span
          key={i}
          aria-hidden
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '-100%', opacity: 0 }}
          transition={{ duration: 0.55, ease: EASE }}
          className="absolute inset-x-0 top-0 whitespace-nowrap"
        >
          {items[i]}
        </Motion.span>
      </AnimatePresence>
    </span>
  )
}

// One featured project in the Vault. The screenshot opens from the centre like vault doors
// as it comes into view, then drifts slightly as you keep scrolling.
function VaultCard({ p, i }) {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const imgY = useTransform(scrollYProgress, [0, 1], ['-3%', '3%'])
  const flip = i % 2 === 1
  const stats = (p.results || []).slice(0, 2)

  return (
    <article ref={ref} className="grid items-center gap-6 lg:grid-cols-12 lg:gap-12">
      <Motion.a
        href={projectHref(p.id)}
        aria-label={`${p.name}: view project`}
        initial={reduce ? false : { clipPath: 'inset(0% 50% 0% 50% round 24px)' }}
        whileInView={{ clipPath: 'inset(0% 0% 0% 0% round 24px)' }}
        viewport={{ once: true, margin: '0px 0px -18% 0px' }}
        transition={{ duration: 1.3, ease: EASE }}
        className={`group relative block overflow-hidden rounded-[24px] border border-line lg:col-span-7 ${flip ? 'lg:order-2' : ''}`}
      >
        <span className="relative block aspect-[16/10] overflow-hidden">
          <Motion.span style={reduce ? undefined : { y: imgY }} className="absolute inset-x-0 -inset-y-[3.5%] block transition-transform duration-700 group-hover:scale-[1.03]">
            <ProjectCover p={p} />
          </Motion.span>
        </span>
        {isLive(p) && <LiveBadge className="absolute left-4 top-4 border-[#7fc79a]/50 bg-charcoal/80 backdrop-blur-sm" />}
      </Motion.a>

      <Reveal delay={0.15} className={`lg:col-span-5 ${flip ? 'lg:order-1' : ''}`}>
        <p className="label-mono text-[10.5px] text-brass">
          {String(i + 1).padStart(2, '0')} · {p.kind}
        </p>
        <h3 className="mt-2 font-display text-[40px] font-bold leading-none tracking-[-0.04em] lg:text-[52px]">{p.name}</h3>
        <p className="mt-3 text-[15.5px] leading-relaxed text-ivory-2 lg:text-[17px]">{p.oneLiner}</p>
        {stats.length > 0 && (
          <dl className="mt-5 flex flex-wrap gap-x-8 gap-y-3">
            {stats.map((s) => (
              <div key={s.label}>
                <dt className="sr-only">{s.label}</dt>
                <dd className="font-display text-[26px] font-bold leading-none tracking-[-0.03em] text-brass-2">{s.value}</dd>
                <dd className="mt-1 max-w-[12rem] text-[12px] leading-snug text-concrete">{s.label}</dd>
              </div>
            ))}
          </dl>
        )}
        <a href={projectHref(p.id)} className="group mt-6 inline-flex items-center gap-2 text-[14.5px] text-brass transition-colors hover:text-brass-2">
          View project <ArrowRight size={16} strokeWidth={1.7} className="transition-transform group-hover:translate-x-1" aria-hidden />
        </a>
      </Reveal>
    </article>
  )
}

export function VaultCards({ items }) {
  return (
    <div className="mt-10 flex flex-col gap-16 lg:mt-14 lg:gap-28">
      {items.map((p, i) => (
        <VaultCard key={p.id} p={p} i={i} />
      ))}
    </div>
  )
}

// The welcome for phones and browsers without 3D: the same title card as the 3D intro,
// with one way in.
export function Welcome({ onEnter }) {
  const enter = useRef(null)
  const reduce = useReducedMotion()
  const line = (delay) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 18, filter: 'blur(6px)' },
          animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
          transition: { duration: 1.05, delay, ease: EASE },
        }

  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const t = setTimeout(() => enter.current?.focus(), 1400)
    return () => {
      document.body.style.overflow = prev
      clearTimeout(t)
    }
  }, [])

  return (
    <Motion.section
      role="dialog"
      aria-modal="true"
      aria-label="Welcome"
      exit={{ opacity: 0, scale: 1.04, transition: { duration: 0.8, ease: [0.4, 0, 0.2, 1] } }}
      className="grain fixed inset-0 z-[60] flex flex-col items-center justify-center bg-charcoal px-6 text-center"
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_35%,rgba(198,169,108,0.14),transparent_60%)]" />
      <Motion.img {...line(0.05)} src="/logos/sai-logo.png" alt="SM logo" className="relative mb-7 h-16 w-auto" />
      <Motion.p {...line(0.2)} className="label-mono relative text-[10.5px] text-brass">
        {profile.school} · {profile.location}
      </Motion.p>
      <Motion.h1 {...line(0.4)} className="relative mt-5 font-serif text-[clamp(72px,22vw,180px)] leading-[0.85] tracking-[-0.02em] text-ivory">
        {profile.name}.
      </Motion.h1>
      <Motion.p {...line(0.75)} className="label-mono relative mt-7 text-[11.5px] tracking-[0.4em] text-ivory-2">
        {profile.residence}
      </Motion.p>
      <Motion.p {...line(1)} className="relative mt-3 font-serif text-[24px] italic text-stone">
        {profile.motto}
      </Motion.p>
      <Motion.div {...line(1.3)} className="relative mt-12 flex flex-col items-center gap-4">
        <button
          ref={enter}
          type="button"
          onClick={onEnter}
          className="inline-flex h-14 items-center gap-4 rounded-full border border-brass/60 pl-7 pr-2 text-[15px] text-ivory transition-colors hover:border-brass hover:bg-brass/10"
        >
          Step inside
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brass text-charcoal">
            <ArrowRight size={18} strokeWidth={1.8} aria-hidden />
          </span>
        </button>
        <p className="max-w-[18rem] text-[12.5px] leading-relaxed text-concrete">The full 3D residence is best on a computer. Here, you walk through it room by room.</p>
      </Motion.div>
    </Motion.section>
  )
}
