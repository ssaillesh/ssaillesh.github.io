import { useEffect, useState } from 'react'

const hasWebGL = () => {
  try {
    const c = document.createElement('canvas')
    return !!(window.WebGL2RenderingContext && c.getContext('webgl2')) || !!c.getContext('webgl')
  } catch {
    return false
  }
}

// 'residence' = full 3D experience, 'plan' = the deliberate mobile / no-WebGL layout.
// ?plan forces the plan layout, ?3d forces the residence (useful for testing).
export function useExperienceMode() {
  const decide = () => {
    const q = new URLSearchParams(window.location.search)
    if (q.has('plan')) return 'plan'
    if (q.has('3d')) return 'residence'
    const small = window.matchMedia('(max-width: 860px)').matches
    return small || !hasWebGL() ? 'plan' : 'residence'
  }
  const [mode, setMode] = useState(decide)

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 860px)')
    const onChange = () => setMode(decide())
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  return mode
}
