import { useEffect } from 'react'

// Locks page scroll while a layer is open. The page keeps its scroll position because the
// document is never moved; scrollbar-gutter in index.css stops the layout from shifting.
let locks = 0

export function useLockBodyScroll(locked) {
  useEffect(() => {
    if (!locked) return undefined
    const root = document.documentElement
    locks += 1
    root.style.overflow = 'hidden'
    return () => {
      locks -= 1
      if (locks === 0) root.style.overflow = ''
    }
  }, [locked])
}
