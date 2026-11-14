import { useEffect, useState } from 'react'

const hasWebGL = () => {
  try {
    const c = document.createElement('canvas')
    return !!(window.WebGL2RenderingContext && c.getContext('webgl2')) || !!c.getContext('webgl')
  } catch {
    return false
  }
}

// 'plan' = the plain view, the default for everyone. 'residence' = the 3D portfolio,
// opened on purpose with ?3d (the "3D tour" links and the residence project's button).
// Without WebGL, ?3d still falls back to the plain view. ?plan and project links
// (#/projects…) always open the plain view, so they can be shared with anyone.
export function useExperienceMode() {
  const decide = () => {
    const q = new URLSearchParams(window.location.search)
    if (q.has('plan')) return 'plan'
    if (window.location.hash.startsWith('#/projects')) return 'plan'
    return q.has('3d') && hasWebGL() ? 'residence' : 'plan'
  }
  const [mode, setMode] = useState(decide)

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 860px)')
    const onChange = () => setMode(decide())
    mq.addEventListener('change', onChange)
    window.addEventListener('hashchange', onChange)
    return () => {
      mq.removeEventListener('change', onChange)
      window.removeEventListener('hashchange', onChange)
    }
  }, [])

  return mode
}
