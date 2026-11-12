import { useCallback, useEffect, useState } from 'react'
import { roomById } from '../data/rooms.js'

// Hash routing so GitHub Pages needs no server rewrites:
//   #/                  overview
//   #/workshop          a room
//   #/workshop/symcor   an item inside a room
//   #/projects          the plain view's projects page
//   #/projects/rova     one project's page in the plain view
const parse = () => {
  const parts = window.location.hash.replace(/^#\/?/, '').split('/').filter(Boolean)
  if (parts[0] === 'projects') {
    return { room: null, item: null, page: 'projects', project: parts[1] ? decodeURIComponent(parts[1]) : null }
  }
  const room = parts[0] && roomById[parts[0]] ? parts[0] : null
  return { room, item: room && parts[1] ? decodeURIComponent(parts[1]) : null, page: null, project: null }
}

export function useRoute() {
  const [route, setRoute] = useState(parse)

  useEffect(() => {
    const onHash = () => setRoute(parse())
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  const go = useCallback((room = null, item = null) => {
    const hash = room ? `#/${room}${item ? `/${encodeURIComponent(item)}` : ''}` : '#/'
    if (window.location.hash !== hash) window.location.hash = hash
    else setRoute(parse())
  }, [])

  return [route, go]
}
