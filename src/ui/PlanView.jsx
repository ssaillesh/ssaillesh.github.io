import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { profile } from '../data/profile.js'
import { rooms } from '../data/rooms.js'
import FloorPlan from './FloorPlan.jsx'
import RoomContent from './RoomContent.jsx'
import { ResumeButton } from './bits.jsx'
import VaultPage from './VaultPage.jsx'

const Motion = motion

// Mobile / no-WebGL / "plain view" layout: the same six rooms read as one
// editorial page, with the floor plan as the map and a sticky room bar.
export default function PlanView({ route, go }) {
  const [items, setItems] = useState({})
  const [current, setCurrent] = useState(route.room || 'foyer')

  const vaultItem = 'vault' in items ? items.vault : route.room === 'vault' ? route.item : null

  const scrollTo = (id) => document.getElementById(`room-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })

  useEffect(() => {
    if (route.room) requestAnimationFrame(() => scrollTo(route.room))
  }, [route.room, route.item])

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setCurrent(e.target.dataset.room)),
      { rootMargin: '-45% 0px -50% 0px' },
    )
    rooms.forEach((r) => {
      const el = document.getElementById(`room-${r.id}`)
      if (el) io.observe(el)
    })
    return () => io.disconnect()
  }, [])

  return (
    <div className="min-h-screen bg-charcoal pb-24">
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-line bg-charcoal/90 px-5 py-3 backdrop-blur-md">
        <a href="#/" onClick={(e) => (e.preventDefault(), window.scrollTo({ top: 0, behavior: 'smooth' }))} className="leading-none">
          <span className="flex items-center gap-2.5">
            <img src="/logos/sai-logo.png" alt="SM" className="h-8 w-auto" />
            <span className="font-serif text-[26px]">{profile.name}.</span>
          </span>
        </a>
        <div className="flex items-center gap-2">
          <a href="?3d" className="label-mono hidden h-9 items-center px-2 text-[10px] text-stone hover:text-ivory sm:inline-flex">
            3D view
          </a>
          <ResumeButton size="sm" label="Résumé" />
        </div>
      </header>

      <section className="grain relative overflow-hidden px-5 pb-10 pt-16">
        <Motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }} className="label-mono text-[10.5px] text-brass">
          {profile.residence}
        </Motion.p>
        <Motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.15, ease: [0.2, 0.7, 0.2, 1] }}
          className="mt-4 font-serif text-[clamp(76px,22vw,140px)] leading-[0.85] tracking-[-0.02em]"
        >
          {profile.name}.
        </Motion.h1>
        <Motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.5 }} className="mt-5 font-serif text-[24px] italic text-ivory-2">
          {profile.motto}
        </Motion.p>
        <p className="mt-5 max-w-[34rem] text-[15.5px] leading-relaxed text-stone">
          A private residence of six rooms, one for each part of the story. Tap a room on the plan, or scroll through them in order.
        </p>
        <div className="mt-8 rounded-[4px] border border-line bg-char-2 p-3">
          <FloorPlan active={current} onSelect={scrollTo} className="w-full" />
        </div>
      </section>

      {rooms.map((r) => (
        <section key={r.id} id={`room-${r.id}`} data-room={r.id} className="scroll-mt-16 border-t border-line px-5 py-12">
          <div className="mb-8 flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brass font-mono text-[11px] text-charcoal">{r.number}</span>
            <div className="leading-tight">
              <p className="font-serif text-[22px]">{r.name}</p>
              <p className="label-mono text-[10px] text-stone">{r.kicker}</p>
            </div>
          </div>
          <div className="mx-auto max-w-[40rem]">
            <RoomContent
              room={r.id}
              item={r.id in items ? items[r.id] : route.room === r.id ? route.item : null}
              onItem={(id) => {
                setItems((s) => ({ ...s, [r.id]: id }))
                requestAnimationFrame(() => scrollTo(r.id))
              }}
              onRoom={scrollTo}
            />
          </div>
        </section>
      ))}

      <VaultPage
        open={!!vaultItem}
        project={vaultItem === 'inside' ? null : vaultItem}
        onProject={(id) => setItems((s) => ({ ...s, vault: id || 'inside' }))}
        onClose={() => setItems((s) => ({ ...s, vault: null }))}
      />

      <nav aria-label="Rooms" className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-charcoal/92 backdrop-blur-md">
        <ul className="hide-scrollbar flex gap-1 overflow-x-auto px-3 py-2.5">
          {rooms.map((r) => (
            <li key={r.id}>
              <button
                type="button"
                onClick={() => {
                  scrollTo(r.id)
                  go(r.id)
                }}
                aria-current={current === r.id ? 'true' : undefined}
                className={`flex h-11 items-center gap-2 whitespace-nowrap rounded-full px-4 text-[13.5px] transition-colors ${current === r.id ? 'bg-ivory text-charcoal' : 'text-ivory-2'}`}
              >
                <span className={`font-mono text-[10px] ${current === r.id ? 'text-walnut' : 'text-brass'}`}>{r.number}</span>
                {r.name}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}
