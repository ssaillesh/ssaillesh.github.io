import { useEffect } from 'react'
import '@fontsource/figtree/400.css'
import '@fontsource/figtree/500.css'
import '@fontsource/figtree/600.css'
import '@fontsource/figtree/700.css'
import '@fontsource/figtree/800.css'
import LegacyApp from './LegacyApp.jsx'

// The previous site, kept intact and reachable at /?classic.
export default function LegacyRoot() {
  useEffect(() => {
    document.body.classList.add('legacy')
    return () => document.body.classList.remove('legacy')
  }, [])
  return <LegacyApp />
}
