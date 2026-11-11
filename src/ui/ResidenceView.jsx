import { Suspense, lazy, useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import TopNav from './TopNav.jsx'
import RoomPanel from './RoomPanel.jsx'
import Intro from './Intro.jsx'
import FloorPlan from './FloorPlan.jsx'
import { roomById } from '../data/rooms.js'

const Residence = lazy(() => import('../scene/Residence.jsx'))
const Motion = motion

const usePanelWidth = () => {
  const calc = () => Math.round(Math.min(460, Math.max(380, window.innerWidth * 0.34)))
  const [w, setW] = useState(calc)
  useEffect(() => {
    const on = () => setW(calc())
    window.addEventListener('resize', on)
    return () => window.removeEventListener('resize', on)
  }, [])
  return w
}

// Desktop experience: full-screen 3D residence with a minimal interface over it.
export default function ResidenceView({ route, go }) {
  const [intro, setIntro] = useState(() => !route.room)
  const [ready, setReady] = useState(false)
  const [hover, setHover] = useState(null)
  const panelWidth = usePanelWidth()

  const caption = hover
    ? hover.kind === 'room'
      ? { eyebrow: `${roomById[hover.id].number} · ${roomById[hover.id].kicker}`, text: `Enter the ${roomById[hover.id].name}` }
      : { eyebrow: hover.sub, text: hover.label }
    : route.room
      ? { eyebrow: roomById[route.room].name, text: 'Hover an object to light it · click to open' }
      : { eyebrow: 'Six rooms', text: 'Hover a room to light it · click to enter' }

  return (
    <div className="fixed inset-0 overflow-hidden bg-charcoal">
      <div className="absolute inset-0" aria-hidden={intro}>
        <Suspense fallback={null}>
          <Residence route={route} go={go} intro={intro} panelWidth={route.room ? panelWidth : 0} onHoverInfo={setHover} onCreated={() => setTimeout(() => setReady(true), 600)} />
        </Suspense>
      </div>

      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,transparent_55%,rgba(8,8,9,.65)_100%)]" />

      <AnimatePresence>
        {!intro && (
          <Motion.div key="chrome" initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 0.6, duration: 0.8 } }}>
            <TopNav route={route} go={go} />

            <div className="fixed bottom-5 left-6 z-20 flex items-end gap-5 lg:left-8">
              <div className="w-[190px] rounded-[4px] border border-line bg-charcoal/75 p-2 backdrop-blur-md">
                <FloorPlan active={route.room} onSelect={(id) => go(id)} showLabels={false} className="w-full" />
                <p className="label-mono mt-1.5 px-1 text-[9px] text-stone">Plan · select a room</p>
              </div>
            </div>

            <div
              aria-live="polite"
              className="pointer-events-none fixed bottom-6 z-20 -translate-x-1/2"
              style={{ left: route.room ? `calc((100% - ${panelWidth + 16}px) / 2)` : '50%' }}
            >
              <div className="flex items-center gap-3 rounded-full border border-line bg-charcoal/80 px-4 py-2 backdrop-blur-md">
                <span className="label-mono text-[10px] text-brass">{caption.eyebrow}</span>
                <span className="h-3 w-px bg-line" aria-hidden />
                <span className="text-[13px] text-ivory-2">{caption.text}</span>
              </div>
            </div>

            <RoomPanel route={route} go={go} width={panelWidth} />
          </Motion.div>
        )}
      </AnimatePresence>

      <Intro show={intro} ready={ready} onEnter={() => setIntro(false)} />
    </div>
  )
}
