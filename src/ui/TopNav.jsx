import { rooms } from '../data/rooms.js'
import { profile } from '../data/profile.js'
import { ResumeButton } from './bits.jsx'

export default function TopNav({ route, go }) {
  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-40 flex items-start justify-between gap-6 px-6 pt-5 lg:px-8">
      <a href="#/" onClick={(e) => (e.preventDefault(), go(null))} className="pointer-events-auto flex items-center gap-3 leading-none">
        <img src="/logos/sai-logo.png" alt="SM" className="h-11 w-auto" />
        <span className="flex flex-col">
          <span className="font-serif text-[28px] text-ivory">{profile.name}.</span>
          <span className="label-mono mt-1.5 text-[10px] text-stone">{profile.residence}</span>
        </span>
      </a>

      <nav aria-label="Rooms" className="pointer-events-auto hidden items-center gap-1 rounded-full border border-line bg-charcoal/70 p-1 backdrop-blur-md xl:flex">
        <button
          type="button"
          onClick={() => go(null)}
          aria-current={!route.room ? 'page' : undefined}
          className={`h-9 rounded-full px-3.5 text-[13px] transition-colors ${!route.room ? 'bg-ivory text-charcoal' : 'text-ivory-2 hover:text-ivory'}`}
        >
          Overview
        </button>
        {rooms.map((r) => {
          const on = route.room === r.id
          return (
            <button
              key={r.id}
              type="button"
              onClick={() => go(r.id)}
              aria-current={on ? 'page' : undefined}
              className={`flex h-9 items-center gap-2 rounded-full px-3.5 text-[13px] transition-colors ${on ? 'bg-ivory text-charcoal' : 'text-ivory-2 hover:text-ivory'}`}
            >
              <span className={`font-mono text-[10px] ${on ? 'text-walnut' : 'text-brass'}`}>{r.number}</span>
              {r.name}
            </button>
          )
        })}
      </nav>

      <div className="pointer-events-auto flex items-center gap-2">
        <a href="?plan" className="label-mono hidden h-9 items-center rounded-full px-3 text-[10px] text-stone transition-colors hover:text-ivory lg:inline-flex">
          Plain view
        </a>
        <ResumeButton size="sm" label="Résumé" />
      </div>
    </header>
  )
}
