import { useRef } from 'react'
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { roomById } from '../../data/rooms.js'
import { WALK } from './walk.js'

const Motion = motion
const EASE = [0.2, 0.7, 0.2, 1]

// The whole page sits on this layer. Its tone and glow shift as you move from room to room.
export function Ambient({ current }) {
  const tone = (WALK.find((w) => w.room === current) || WALK[0]).tone
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 transition-colors duration-[1200ms] ease-out" style={{ backgroundColor: tone }}>
      {WALK.map((w) => (
        <div
          key={w.room}
          className="absolute inset-0 transition-opacity duration-[1200ms] ease-out"
          style={{ opacity: w.room === current ? 1 : 0, background: `radial-gradient(110% 70% at 85% 0%, ${w.glow}, transparent 65%)` }}
        />
      ))}
    </div>
  )
}

// The opening of each room: a brass threshold sweeps across, then the room's name rises in.
export function RoomHeader({ room, step }) {
  const r = roomById[room]
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [50, -50])

  return (
    <div ref={ref} className="relative">
      <Motion.div
        initial={reduce ? false : { scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, margin: '0px 0px -12% 0px' }}
        transition={{ duration: 1.2, ease: EASE }}
        className="h-px origin-left bg-gradient-to-r from-brass via-brass/40 to-transparent"
      />
      <div className="label-mono mt-4 flex items-baseline justify-between gap-4 text-[10.5px]">
        <span className="text-brass">
          {String(step).padStart(2, '0')} · {r.kicker}
        </span>
        <span className="text-right text-concrete">{r.purpose}</span>
      </div>
      <Motion.h2 style={reduce ? undefined : { y }} className="mt-4 font-display text-[clamp(60px,17vw,156px)] font-bold leading-[0.86] tracking-[-0.05em]">
        <span className="block overflow-hidden pb-[0.06em]">
          <Motion.span
            className="inline-block"
            initial={reduce ? false : { y: '105%' }}
            whileInView={{ y: 0 }}
            viewport={{ once: true, margin: '0px 0px -12% 0px' }}
            transition={{ duration: 1, delay: 0.25, ease: EASE }}
          >
            <span className="mr-[0.18em] align-[0.62em] text-[0.3em] font-semibold tracking-[-0.02em] text-ivory-2/50">The</span>
            {r.name}
          </Motion.span>
        </span>
      </Motion.h2>
    </div>
  )
}

// A small guide on the left edge of wide screens: one mark per room, the current one lit.
export function RoomRail({ current, onJump }) {
  return (
    <nav aria-label="Rooms" className="fixed left-3 top-1/2 z-20 hidden -translate-y-1/2 flex-col gap-3.5 lg:flex xl:left-6">
      {WALK.map((w) => {
        const on = current === w.room
        return (
          <button key={w.room} type="button" onClick={() => onJump(w.room)} aria-current={on ? 'true' : undefined} className="group flex h-4 items-center gap-3">
            <span className={`h-px transition-all duration-500 ${on ? 'w-6 bg-brass xl:w-8' : 'w-2.5 bg-ivory/25 group-hover:w-4 group-hover:bg-ivory/60 xl:w-4 xl:group-hover:w-6'}`} />
            <span
              className={`label-mono hidden text-[9.5px] transition-all duration-500 xl:inline ${on ? 'translate-x-0 text-brass opacity-100' : '-translate-x-1 text-concrete opacity-0 group-hover:translate-x-0 group-hover:opacity-100'}`}
            >
              {roomById[w.room].name}
            </span>
          </button>
        )
      })}
    </nav>
  )
}

// On phones the current room shows in the header instead.
export function RoomChip({ current }) {
  const r = roomById[current]
  const step = WALK.findIndex((w) => w.room === current) + 1
  return (
    <span className="label-mono relative flex h-5 min-w-[7.5rem] items-center justify-center overflow-hidden text-[10px] text-ivory-2 lg:hidden" aria-live="polite">
      <AnimatePresence initial={false} mode="popLayout">
        <Motion.span
          key={current}
          initial={{ y: 14, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -14, opacity: 0 }}
          transition={{ duration: 0.4, ease: EASE }}
          className="whitespace-nowrap"
        >
          <span className="text-brass">{String(step).padStart(2, '0')}</span> · {r?.name}
        </Motion.span>
      </AnimatePresence>
    </span>
  )
}
