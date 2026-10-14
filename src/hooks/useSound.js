import { useSyncExternalStore } from 'react'
import { isMuted, setMuted, subscribeToSound } from '../utils/sound'

export function useSoundMuted() {
  const muted = useSyncExternalStore(subscribeToSound, isMuted, () => true)
  return [muted, setMuted]
}
