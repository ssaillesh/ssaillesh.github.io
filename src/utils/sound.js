// Mechanical clicks synthesised with the Web Audio API: a filtered noise burst for the plastic
// click and a short low thump for the body. Nothing plays until the visitor presses something,
// and a mute preference is remembered in this browser.

const STORAGE_KEY = 'tape-sound'
const listeners = new Set()
let context = null

function readMuted() {
  try {
    return window.localStorage.getItem(STORAGE_KEY) === 'off'
  } catch {
    return false
  }
}

let muted = typeof window === 'undefined' ? true : readMuted()

export const isMuted = () => muted

export function setMuted(value) {
  muted = value
  try {
    window.localStorage.setItem(STORAGE_KEY, value ? 'off' : 'on')
  } catch {
    // Storage can be blocked (private windows); the toggle still works for this visit.
  }
  listeners.forEach((listener) => listener())
}

export function subscribeToSound(listener) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

// lift: the tape coming off the desk · land: it settling flipped · latch: a deck key or the eject.
const voices = {
  lift: { band: 3400, q: 1.2, click: 0.16, length: 0.03, thump: 210, body: 0.06 },
  land: { band: 2200, q: 1.6, click: 0.24, length: 0.045, thump: 120, body: 0.14 },
  latch: { band: 2600, q: 1.8, click: 0.3, length: 0.05, thump: 150, body: 0.12 },
}

export function playClack(kind = 'land') {
  if (muted || typeof window === 'undefined') return
  const voice = voices[kind] ?? voices.land
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext
    if (!AudioContextClass) return
    context ??= new AudioContextClass()
    if (context.state === 'suspended') context.resume()
    const now = context.currentTime

    const frames = Math.max(1, Math.floor(context.sampleRate * voice.length))
    const buffer = context.createBuffer(1, frames, context.sampleRate)
    const samples = buffer.getChannelData(0)
    for (let i = 0; i < frames; i += 1) samples[i] = (Math.random() * 2 - 1) * (1 - i / frames) ** 4

    const noise = context.createBufferSource()
    noise.buffer = buffer
    const band = context.createBiquadFilter()
    band.type = 'bandpass'
    band.frequency.value = voice.band
    band.Q.value = voice.q
    const clickGain = context.createGain()
    clickGain.gain.setValueAtTime(voice.click, now)
    clickGain.gain.exponentialRampToValueAtTime(0.0001, now + voice.length + 0.02)
    noise.connect(band).connect(clickGain).connect(context.destination)
    noise.start(now)

    const thump = context.createOscillator()
    thump.type = 'triangle'
    thump.frequency.setValueAtTime(voice.thump, now)
    thump.frequency.exponentialRampToValueAtTime(60, now + 0.07)
    const bodyGain = context.createGain()
    bodyGain.gain.setValueAtTime(voice.body, now)
    bodyGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08)
    thump.connect(bodyGain).connect(context.destination)
    thump.start(now)
    thump.stop(now + 0.09)
  } catch {
    // Audio is a flourish; if the browser refuses, the interaction carries on silently.
  }
}
