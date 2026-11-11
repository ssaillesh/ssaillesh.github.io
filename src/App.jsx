import { Suspense, lazy, useEffect, useState } from 'react'
import { useRoute } from './hooks/useRoute.js'
import { useExperienceMode } from './hooks/useExperienceMode.js'
import { roomById } from './data/rooms.js'
import ResidenceView from './ui/ResidenceView.jsx'
import PlanView from './ui/PlanView.jsx'

const LegacyRoot = lazy(() => import('./legacy/LegacyRoot.jsx'))

export default function App() {
  const [route, go] = useRoute()
  const mode = useExperienceMode()
  const [fallback, setFallback] = useState(false)

  useEffect(() => {
    const room = route.room ? roomById[route.room] : null
    document.title = room ? `${room.name} · Saillesh — The Private Residence` : 'Saillesh — The Private Residence'
  }, [route.room])

  if (new URLSearchParams(window.location.search).has('classic')) {
    return (
      <Suspense fallback={null}>
        <LegacyRoot />
      </Suspense>
    )
  }

  return mode === 'residence' && !fallback ? (
    <ResidenceView route={route} go={go} onFail={() => setFallback(true)} />
  ) : (
    <PlanView route={route} go={go} />
  )
}
