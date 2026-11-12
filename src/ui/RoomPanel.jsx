import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, X } from 'lucide-react'
import { roomById, rooms } from '../data/rooms.js'
import RoomContent from './RoomContent.jsx'
import { artifactById } from '../data/artifacts.js'

const Motion = motion

export default function RoomPanel({ route, go, width }) {
  // The panel only opens once an object has been picked up; choosing a room
  // just frames it and lights up what can be picked up.
  const picked = route.item && artifactById[route.item] && artifactById[route.item].room === route.room
  const room = route.room && picked ? roomById[route.room] : null
  const idx = room ? rooms.indexOf(room) : -1
  const prev = idx > 0 ? rooms[idx - 1] : null
  const next = idx >= 0 && idx < rooms.length - 1 ? rooms[idx + 1] : null

  return (
    <AnimatePresence>
      {room && (
        <Motion.aside
          key="panel"
          aria-label={`${room.name}: ${room.kicker}`}
          initial={{ x: 40, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 40, opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.2, 0.7, 0.2, 1] }}
          style={{ width }}
          className="fixed bottom-4 right-4 top-[84px] z-30 flex flex-col overflow-hidden rounded-[4px] border border-line bg-char-2/95 shadow-[0_40px_120px_rgba(0,0,0,.55)] backdrop-blur-md"
        >
          <div className="flex items-center gap-3 border-b border-line px-6 py-4">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brass font-mono text-[11px] text-charcoal">{room.number}</span>
            <div className="leading-tight">
              <p className="font-serif text-[22px] text-ivory">{room.name}</p>
              <p className="label-mono text-[10px] text-stone">{room.kicker}</p>
            </div>
            <button
              type="button"
              onClick={() => go(room.id)}
              aria-label="Put it back"
              className="ml-auto flex h-10 w-10 items-center justify-center rounded-full text-stone transition-colors hover:bg-char-3 hover:text-ivory"
            >
              <X size={18} strokeWidth={1.6} />
            </button>
          </div>

          <div className="panel-scroll flex-1 overflow-y-auto px-6 py-7">
            <AnimatePresence mode="wait">
              <Motion.div key={`${room.id}/${route.item || ''}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                <RoomContent room={room.id} item={route.item} onItem={(id) => go(room.id, id)} onRoom={(id) => go(id)} />
              </Motion.div>
            </AnimatePresence>
          </div>

          <div className="grid grid-cols-2 border-t border-line text-[13px]">
            <button
              type="button"
              disabled={!prev}
              onClick={() => prev && go(prev.id)}
              className="flex min-h-[56px] items-center gap-2 px-6 text-left text-ivory-2 transition-colors enabled:hover:text-ivory disabled:opacity-30"
            >
              <ArrowLeft size={15} strokeWidth={1.6} aria-hidden />
              {prev ? prev.name : 'Start'}
            </button>
            <button
              type="button"
              disabled={!next}
              onClick={() => next && go(next.id)}
              className="flex min-h-[56px] items-center justify-end gap-2 border-l border-line px-6 text-right text-ivory-2 transition-colors enabled:hover:text-ivory disabled:opacity-30"
            >
              {next ? next.name : 'End'}
              <ArrowRight size={15} strokeWidth={1.6} aria-hidden />
            </button>
          </div>
        </Motion.aside>
      )}
    </AnimatePresence>
  )
}
