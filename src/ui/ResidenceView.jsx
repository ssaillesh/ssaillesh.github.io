import { Suspense, lazy, useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import TopNav from './TopNav.jsx'
import RoomPanel from './RoomPanel.jsx'
import Intro from './Intro.jsx'
import FloorPlan from './FloorPlan.jsx'
import { roomById } from '../data/rooms.js'
import SceneBoundary from './SceneBoundary.jsx'
import VaultPage from './VaultPage.jsx'
import InspectOverlay from './InspectOverlay.jsx'
import CabinetPage from './CabinetPage.jsx'
import { INSPECTABLE, inspectLabel } from '../data/inspect.js'
import { artifactById } from '../data/artifacts.js'

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
export default function ResidenceView({ route, go, onFail }) {
  const [intro, setIntro] = useState(() => !route.room)
  const [ready, setReady] = useState(false)
  const [slow, setSlow] = useState(false)
  const [hover, setHover] = useState(null)

  // Watchdog: if no frame has been drawn after 12 s, offer the plain version.
  useEffect(() => {
    if (ready) return
    const t = setTimeout(() => setSlow(true), 12000)
    return () => clearTimeout(t)
  }, [ready])
  const panelWidth = usePanelWidth()

  const inspecting = !intro && route.room && route.room !== 'vault' && route.item && route.item !== 'cabinet' && INSPECTABLE[route.item] ? route.item : null
  const [cabinetSel, setCabinetSel] = useState(null)

  const caption = hover
    ? hover.kind === 'room'
      ? { eyebrow: `${roomById[hover.id].number} · ${roomById[hover.id].kicker}`, text: `Enter the ${roomById[hover.id].name}` }
      : { eyebrow: artifactById[hover.id]?.where || hover.sub, text: artifactById[hover.id]?.object || hover.label }
    : route.room
      ? { eyebrow: roomById[route.room].name, text: 'Glowing objects can be picked up · click one' }
      : { eyebrow: 'Six rooms', text: 'Hover a room to light it · click to enter' }

  return (
    <div className="fixed inset-0 overflow-hidden bg-charcoal">
      <div className="absolute inset-0" aria-hidden={intro}>
        <SceneBoundary onFail={onFail}>
          <Suspense fallback={null}>
            <Residence
              route={route}
              go={go}
              intro={intro}
              panelWidth={0}
              onHoverInfo={setHover}
              onFail={onFail}
              paused={!!inspecting || (route.room === 'vault' && !!route.item) || (route.room === 'study' && route.item === 'cabinet')}
              onCreated={() => setTimeout(() => setReady(true), 300)}
            />
          </Suspense>
        </SceneBoundary>
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
              hidden={!!inspecting}
              className="pointer-events-none fixed bottom-6 z-20 -translate-x-1/2"
              style={{ left: '50%' }}
            >
              <div className="flex items-center gap-3 rounded-full border border-line bg-charcoal/80 px-4 py-2 backdrop-blur-md">
                <span className="label-mono text-[10px] text-brass">{caption.eyebrow}</span>
                <span className="h-3 w-px bg-line" aria-hidden />
                <span className="text-[13px] text-ivory-2">{caption.text}</span>
              </div>
            </div>

            {route.room && !route.item && (
              <button
                type="button"
                onClick={() => go(null)}
                className="fixed bottom-6 left-[236px] z-20 inline-flex h-10 items-center gap-2 rounded-full border border-line bg-charcoal/80 px-4 text-[13px] text-ivory-2 backdrop-blur-md transition-colors hover:border-ivory/40 hover:text-ivory lg:left-[244px]"
              >
                ← Overview
              </button>
            )}
            <AnimatePresence>
              {inspecting && (
                <InspectOverlay
                  key={inspecting}
                  item={inspecting}
                  label={inspectLabel(inspecting)}
                  from={INSPECTABLE[inspecting]}
                  right={panelWidth + 24}
                  onClose={() => go(route.room)}
                />
              )}
            </AnimatePresence>
            <RoomPanel route={route} go={go} width={panelWidth} />
            <VaultPage
              threeD
              open={route.room === 'vault' && !!route.item}
              project={route.item === 'inside' ? null : route.item}
              onProject={(id) => go('vault', id || 'inside')}
              onClose={() => go('vault')}
            />
            <CabinetPage
              open={route.room === 'study' && route.item === 'cabinet'}
              selected={cabinetSel}
              onSelect={setCabinetSel}
              onClose={() => {
                setCabinetSel(null)
                go('study')
              }}
            />
          </Motion.div>
        )}
      </AnimatePresence>

      <Intro show={intro} ready={ready} slow={slow && !ready} onEnter={() => setIntro(false)} onPlain={onFail} />
    </div>
  )
}
