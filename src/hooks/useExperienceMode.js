import { useEffect, useState } from 'react'

const hasWebGL = () => {
  try {
    const c = document.createElement('canvas')
    return !!(window.WebGL2RenderingContext && c.getContext('webgl2')) || !!c.getContext('webgl')
  } catch {
    return false
  }
}

// 'residence' = full 3D experience, 'plan' = the quick view for phones, recruiters and no-WebGL.
// ?plan forces the quick view, ?3d forces the residence.
// Project links (#/projects…) always open the quick view, so they can be shared with anyone.
export function useExperienceMode() {
  const decide = () => {
    const q = new URLSearchParams(window.location.search)
    if (q.has('plan')) return 'plan'
    if (window.location.hash.startsWith('#/projects')) return 'plan'
    if (q.has('3d')) return 'residence'
    const small = window.matchMedia('(max-width: 860px)').matches
    // tablets and other touch-only devices get the quick view: the 3D scene
    // is built for a mouse and is the heaviest thing on the page
    const touchOnly = window.matchMedia('(pointer: coarse)').matches && !window.matchMedia('(any-pointer: fine)').matches
    return small || touchOnly || !hasWebGL() ? 'plan' : 'residence'
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
