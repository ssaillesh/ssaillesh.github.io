import { useEffect } from 'react'

export function useEscape(handler, enabled = true) {
  useEffect(() => {
    if (!enabled) return undefined
    const onKeyDown = (event) => {
      if (event.key === 'Escape' && !event.defaultPrevented) {
        event.preventDefault()
        handler()
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [handler, enabled])
}
