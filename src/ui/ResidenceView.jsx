import { Suspense, lazy, useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import TopNav from './TopNav.jsx'
import RoomPanel from './RoomPanel.jsx'
import Intro from './Intro.jsx'
import FloorPlan from './FloorPlan.jsx'

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
  const panelWidth = usePanelWidth()

  return (
    <div className="fixed inset-0 overflow-hidden bg-charcoal">
      <div className="absolute inset-0" aria-hidden={intro}>
        <Suspense fallback={null}>
          <Residence route={route} go={go} intro={intro} panelWidth={route.room ? panelWidth : 0} onCreated={() => setTimeout(() => setReady(true), 600)} />
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
              <p className="label-mono hidden pb-2 text-[10px] text-stone 2xl:block">Drag to look around · Scroll to zoom</p>
            </div>

            {!route.room && (
              <Motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0, transition: { delay: 1.2, duration: 0.8 } }}
                className="pointer-events-none fixed bottom-6 right-8 z-20 max-w-[340px] text-right"
              >
                <p className="label-mono text-[10px] text-brass">Five rooms · one residence</p>
                <p className="mt-2 font-serif text-[21px] leading-tight text-ivory-2">Start in the foyer, or walk straight to the work.</p>
              </Motion.div>
            )}

            <RoomPanel route={route} go={go} width={panelWidth} />
          </Motion.div>
        )}
      </AnimatePresence>

      <Intro show={intro} ready={ready} onEnter={() => setIntro(false)} />
    </div>
  )
}
