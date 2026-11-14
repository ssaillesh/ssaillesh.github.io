import { useEffect, useMemo, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Billboard } from '@react-three/drei'
import * as THREE from 'three'
import { emptyRow, INLET_LIMIT_C, placeNext, RACK_SIZE, rackView, SLOTS } from './isothermModel.js'

// Exhibits that are more than a few primitives: Isotherm's GPU rack and VouchStudio's job board.

const reduceMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

function canvasTex(w, h, draw) {
  const c = document.createElement('canvas')
  c.width = w
  c.height = h
  draw(c.getContext('2d'), w, h)
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  t.anisotropy = 8
  return t
}

// ---------------------------------------------------------------- Isotherm: the GPU rack
// One rack from the playable demo (public/isotherm/index.html), built to the same
// proportions: a top-of-rack switch, a blank, four GPU servers and a blank, with
// the rack's inlet temperature on a tag above it. The servers are painted by the
// same thermal model as the demo while Isotherm places jobs across the row.

const { w: RACK_W, h: RACK_H, d: RACK_D } = RACK_SIZE
const PX = RACK_H / 240 // the demo draws a rack front 80 × 240 px
const INNER_W = RACK_W - 2 * 5 * PX - 0.02
const SHOWN_RACK = 2 // rack02 is where Isotherm sends the first job, so it fills as you watch
const JOB_EVERY_MS = 2200
const JOBS_PER_LOOP = 12

// Rows of link lights on the top-of-rack switch.
const switchTex = () =>
  canvasTex(280, 44, (g, w, h) => {
    g.fillStyle = '#0B0C0E'
    g.fillRect(0, 0, w, h)
    g.fillStyle = '#7FD1A8'
    for (let y = 12; y < h; y += 24)
      for (let x = 12; x < w; x += 20) {
        g.beginPath()
        g.arc(x, y, 4.6, 0, Math.PI * 2)
        g.fill()
      }
  })

// Vent slots across a server front. White so the server's colour shows through.
const ventTex = () =>
  canvasTex(64, 160, (g, w, h) => {
    g.fillStyle = '#ffffff'
    g.fillRect(0, 0, w, h)
    g.fillStyle = 'rgba(0,0,0,0.3)'
    for (let y = 0; y < h; y += 20) g.fillRect(0, y, w, 8)
  })

// Perforated raised-floor tile for the cold aisle in front of the rack.
const perfTex = () => {
  const t = canvasTex(256, 256, (g, w, h) => {
    g.fillStyle = '#10171A'
    g.fillRect(0, 0, w, h)
    g.fillStyle = '#2b444c'
    for (let y = 16; y < h; y += 32)
      for (let x = 16; x < w; x += 32) {
        g.beginPath()
        g.arc(x, y, 6.5, 0, Math.PI * 2)
        g.fill()
      }
    g.strokeStyle = '#1e2c31'
    g.lineWidth = 4
    g.strokeRect(2, 2, w - 4, h - 4)
  })
  t.wrapS = t.wrapT = THREE.RepeatWrapping
  return t
}

function drawTag(g, w, h, name, maxIn) {
  const over = maxIn > INLET_LIMIT_C
  g.clearRect(0, 0, w, h)
  g.fillStyle = 'rgba(14,16,19,0.92)'
  g.strokeStyle = over ? '#FF6B5B' : '#3a3e45'
  g.lineWidth = 5
  g.beginPath()
  g.roundRect(4, 4, w - 8, h - 8, 26)
  g.fill()
  g.stroke()
  g.textBaseline = 'middle'
  g.font = '400 50px "JetBrains Mono", Menlo, monospace'
  g.fillStyle = '#E6DFD4'
  g.fillText(name, 34, h * 0.32)
  g.fillStyle = over ? '#FF8A7A' : maxIn > 26 ? '#E8913A' : '#A7D3DC'
  g.fillText(`in ${maxIn.toFixed(1)}°C${over ? ' over' : ''}`, 34, h * 0.7)
}

// The demo's auto-play loop: a job every 2.2 s, a pause once the row is busy, then reset.
function useIsothermJobs() {
  const [state, setState] = useState(() => ({ util: emptyRow(), jobs: 0, wait: 0, last: -1 }))
  useEffect(() => {
    const id = setInterval(() => {
      setState((s) => {
        if (s.jobs >= JOBS_PER_LOOP) return s.wait < 2 ? { ...s, wait: s.wait + 1 } : { util: emptyRow(), jobs: 0, wait: 0, last: -1 }
        const at = placeNext(s.util)
        if (at < 0) return s
        const util = s.util.slice()
        util[at] = 0.95
        return { util, jobs: s.jobs + 1, wait: 0, last: at }
      })
    }, JOB_EVERY_MS)
    return () => clearInterval(id)
  }, [])
  return state
}

export function GpuRack() {
  const { util, last } = useIsothermJobs()
  const view = useMemo(() => rackView(util, SHOWN_RACK), [util])
  const lastSlot = Math.floor(last / SLOTS) === SHOWN_RACK ? last % SLOTS : -1

  const mats = useMemo(() => {
    const vents = ventTex()
    return {
      body: new THREE.MeshStandardMaterial({ color: '#111215', roughness: 0.55, metalness: 0.55 }),
      roof: new THREE.MeshStandardMaterial({ color: '#1A1B1F', roughness: 0.5, metalness: 0.5 }),
      face: new THREE.MeshStandardMaterial({ color: '#141518', roughness: 0.6, metalness: 0.4 }),
      frame: new THREE.MeshStandardMaterial({ color: '#2C2F35', roughness: 0.4, metalness: 0.7 }),
      blank: new THREE.MeshStandardMaterial({ color: '#18191C', roughness: 0.6, metalness: 0.4 }),
      tor: new THREE.MeshBasicMaterial({ map: switchTex(), toneMapped: false }),
      power: new THREE.MeshBasicMaterial({ color: '#7FD1A8', toneMapped: false }),
      beam: new THREE.MeshBasicMaterial({ color: '#A7D3DC', transparent: true, opacity: 0.07, depthWrite: false, side: THREE.DoubleSide }),
      beamEdge: new THREE.MeshBasicMaterial({ color: '#A7D3DC', transparent: true, opacity: 0.7, depthWrite: false, toneMapped: false }),
      // unlit, so the servers show the demo's exact colours however the hall is lit
      servers: Array.from({ length: SLOTS }, () => new THREE.MeshBasicMaterial({ color: '#1C3C44', map: vents, toneMapped: false })),
      activity: Array.from({ length: SLOTS }, () => new THREE.MeshBasicMaterial({ color: '#2A2D33', toneMapped: false })),
    }
  }, [])

  // the tag is redrawn only when the reading changes
  const tag = useMemo(() => {
    const c = document.createElement('canvas')
    c.width = 512
    c.height = 232
    const t = new THREE.CanvasTexture(c)
    t.colorSpace = THREE.SRGBColorSpace
    t.anisotropy = 8
    return { g: c.getContext('2d'), tex: t, w: c.width, h: c.height }
  }, [])
  useEffect(() => {
    drawTag(tag.g, tag.w, tag.h, `rack0${SHOWN_RACK}`, view.maxIn)
    tag.tex.needsUpdate = true
  }, [tag, view.maxIn])
  useEffect(() => {
    // draw again once the mono font has loaded, or the first tag keeps the fallback
    let live = true
    document.fonts?.ready.then(() => {
      if (!live) return
      drawTag(tag.g, tag.w, tag.h, `rack0${SHOWN_RACK}`, view.maxIn)
      tag.tex.needsUpdate = true
    })
    return () => {
      live = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tag])

  const targets = useMemo(() => view.servers.map((s) => new THREE.Color(s.color)), [view])
  const shown = useMemo(() => Array.from({ length: SLOTS }, () => new THREE.Color('#1C3C44')), [])
  const landed = useRef(-1)
  const pulse = useRef(0)
  useEffect(() => {
    if (lastSlot >= 0) {
      landed.current = lastSlot
      pulse.current = 1
    }
  }, [lastSlot, last])

  const beam = useRef()
  useFrame((state, dt) => {
    const t = state.clock.elapsedTime
    const k = 1 - Math.exp(-(reduceMotion ? 30 : 2.2) * Math.min(dt, 0.1))
    pulse.current = Math.max(0, pulse.current - dt * 0.9)
    mats.servers.forEach((mat, s) => {
      shown[s].lerp(targets[s], k)
      // the server a job just landed on flashes brighter for a moment
      mat.color.copy(shown[s]).multiplyScalar(1 + (s === landed.current ? pulse.current * 0.8 : 0))
      const busy = view.servers[s].busy
      const blink = reduceMotion || Math.floor(t * 2) % 2 === 0
      mats.activity[s].color.set(busy ? (blink ? '#6AA9FF' : '#22364f') : '#2A2D33')
    })
    if (beam.current) {
      beam.current.visible = !reduceMotion
      // the demo's sweep: back and forth across the rack every 2.6 s
      beam.current.position.x = Math.sin((t / 2.6) * Math.PI) * (RACK_W / 2 + 0.14)
    }
  })

  // the front, laid out top to bottom like the demo: switch, blank, servers, blank
  const pad = 6 * PX
  const gap = 4 * PX
  const torH = 11 * PX
  const blankTopH = 18 * PX
  const blankBotH = 12 * PX
  const serverH = (RACK_H - 2 * pad - torH - blankTopH - blankBotH - (SLOTS + 2) * gap) / SLOTS
  const zFace = RACK_D / 2
  const torY = RACK_H - pad - torH / 2
  const blankTopY = torY - torH / 2 - gap - blankTopH / 2
  const firstServerTop = blankTopY - blankTopH / 2 - gap
  // slot 0 is the bottom server
  const serverY = (slot) => firstServerTop - (SLOTS - 1 - slot) * (serverH + gap) - serverH / 2
  const blankBotY = pad + blankBotH / 2
  const ledX = INNER_W / 2 - 5 * PX

  return (
    <group>
      <mesh position={[0, RACK_H / 2, 0]} material={mats.body} castShadow>
        <boxGeometry args={[RACK_W, RACK_H, RACK_D]} />
      </mesh>
      <mesh position={[0, RACK_H + 0.008, 0]} material={mats.roof}>
        <boxGeometry args={[RACK_W + 0.01, 0.016, RACK_D + 0.01]} />
      </mesh>
      {/* front panel and its frame */}
      <mesh position={[0, RACK_H / 2, zFace + 0.002]} material={mats.face}>
        <planeGeometry args={[RACK_W - 0.01, RACK_H - 0.01]} />
      </mesh>
      {[-1, 1].map((s) => (
        <mesh key={`v${s}`} position={[s * (RACK_W / 2 - 0.009), RACK_H / 2, zFace + 0.008]} material={mats.frame}>
          <boxGeometry args={[0.018, RACK_H, 0.016]} />
        </mesh>
      ))}
      {[0.009, RACK_H - 0.009].map((y) => (
        <mesh key={`h${y}`} position={[0, y, zFace + 0.008]} material={mats.frame}>
          <boxGeometry args={[RACK_W, 0.018, 0.016]} />
        </mesh>
      ))}
      {/* top-of-rack switch and the blanking panels */}
      <mesh position={[0, torY, zFace + 0.01]} material={mats.tor}>
        <boxGeometry args={[INNER_W, torH, 0.012]} />
      </mesh>
      <mesh position={[0, blankTopY, zFace + 0.008]} material={mats.blank}>
        <boxGeometry args={[INNER_W, blankTopH, 0.008]} />
      </mesh>
      <mesh position={[0, blankBotY, zFace + 0.008]} material={mats.blank}>
        <boxGeometry args={[INNER_W, blankBotH, 0.008]} />
      </mesh>
      {/* the four GPU servers, coolest colour to hottest */}
      {Array.from({ length: SLOTS }, (_, slot) => (
        <group key={slot} position={[0, serverY(slot), zFace + 0.012]}>
          <mesh material={mats.servers[slot]}>
            <boxGeometry args={[INNER_W, serverH, 0.02]} />
          </mesh>
          <mesh position={[ledX, serverH / 2 - 7 * PX, 0.011]} material={mats.power}>
            <circleGeometry args={[2.2 * PX, 16]} />
          </mesh>
          <mesh position={[ledX - 7 * PX, serverH / 2 - 7 * PX, 0.011]} material={mats.activity[slot]}>
            <circleGeometry args={[2.2 * PX, 16]} />
          </mesh>
        </group>
      ))}
      {/* the inlet reading, always turned to the visitor */}
      <Billboard position={[0, RACK_H + 0.34, zFace]}>
        <mesh>
          <planeGeometry args={[0.78, 0.354]} />
          <meshBasicMaterial map={tag.tex} transparent toneMapped={false} depthWrite={false} />
        </mesh>
      </Billboard>
      {/* the scan that checks every free server */}
      <group ref={beam}>
        <mesh position={[0, RACK_H / 2, 0.1]} rotation={[0, Math.PI / 2, 0]} material={mats.beam}>
          <planeGeometry args={[RACK_D + 0.5, RACK_H + 0.12]} />
        </mesh>
        <mesh position={[0, RACK_H / 2, zFace + 0.33]} material={mats.beamEdge}>
          <boxGeometry args={[0.006, RACK_H + 0.12, 0.006]} />
        </mesh>
      </group>
    </group>
  )
}

// The raised floor the rack stands on: perforated cold-aisle tiles in front of it.
export function ColdAisleTiles({ width = 1.3, depth = 0.62 }) {
  const mat = useMemo(() => {
    const t = perfTex()
    t.repeat.set(2, 1)
    return new THREE.MeshStandardMaterial({ map: t, roughness: 0.6, metalness: 0.4 })
  }, [])
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} material={mat}>
      <planeGeometry args={[width, depth]} />
    </mesh>
  )
}

// ---------------------------------------------------------------- VouchStudio: the job board
// A résumé editor and job board. A board of scored postings stands at the back,
// the one-page résumé it was scored against leans in front, and a pen lies beside it.
// (Its V mark is not used here: it reads too close to Rova's.)

const jobBoardTex = () =>
  canvasTex(880, 640, (g, w, h) => {
    const serif = 'Georgia, "Times New Roman", serif'
    const sans = '"DM Sans", Helvetica, Arial, sans-serif'
    const mono = '"JetBrains Mono", Menlo, monospace'
    g.fillStyle = '#fbfaf7'
    g.fillRect(0, 0, w, h)
    // window bar
    g.fillStyle = '#f1efe9'
    g.fillRect(0, 0, w, 58)
    g.fillStyle = '#d6d3cb'
    ;[30, 56, 82].forEach((x) => {
      g.beginPath()
      g.arc(x, 29, 8, 0, Math.PI * 2)
      g.fill()
    })
    g.fillStyle = '#8d8a82'
    g.font = `400 20px ${mono}`
    g.textBaseline = 'middle'
    g.fillText('your board', 118, 30)

    const chip = (x, y, text, matched) => {
      g.font = `500 21px ${sans}`
      const cw = g.measureText(text).width + 26
      g.beginPath()
      g.roundRect(x, y, cw, 36, 6)
      if (matched) {
        g.fillStyle = '#e2efdf'
        g.fill()
        g.fillStyle = '#2f5d37'
      } else {
        g.fillStyle = '#ffffff'
        g.fill()
        g.strokeStyle = '#d9d6ce'
        g.lineWidth = 2
        g.stroke()
        g.fillStyle = '#55524b'
      }
      g.fillText(text, x + 13, y + 19)
      return x + cw + 10
    }

    const rows = [
      { score: '81', matched: ['Machine learning', 'Python', 'SQL'], gaps: ['1 gap'], top: true },
      { score: '74', matched: ['Python', 'Statistics'], gaps: ['2 gaps'] },
      { score: '62', matched: ['SQL'], gaps: ['3 gaps'] },
    ]
    rows.forEach((r, i) => {
      const y = 78 + i * 186
      if (r.top) {
        g.fillStyle = '#ffffff'
        g.strokeStyle = '#c6a96c'
        g.lineWidth = 4
        g.beginPath()
        g.roundRect(18, y, w - 36, 170, 12)
        g.fill()
        g.stroke()
      } else {
        g.strokeStyle = '#e4e1d9'
        g.lineWidth = 2
        g.beginPath()
        g.roundRect(18, y, w - 36, 170, 12)
        g.stroke()
      }
      g.fillStyle = '#16150f'
      g.font = `400 76px ${serif}`
      g.fillText(r.score, 46, y + 66)
      g.fillStyle = '#8d8a82'
      g.font = `400 19px ${mono}`
      g.fillText('match', 50, y + 128)
      // the posting's title and company, as bars
      g.fillStyle = r.top ? '#16150f' : '#3a3833'
      g.fillRect(190, y + 34, r.top ? 430 : 350 - i * 30, 20)
      g.fillStyle = '#b9b6ae'
      g.fillRect(190, y + 70, 250, 12)
      let x = 190
      r.matched.forEach((t) => (x = chip(x, y + 106, t, true)))
      r.gaps.forEach((t) => (x = chip(x, y + 106, t, false)))
    })
  })

const resumePageTex = () =>
  canvasTex(340, 440, (g, w, h) => {
    g.fillStyle = '#f6f2ea'
    g.fillRect(0, 0, w, h)
    g.fillStyle = '#1b1a17'
    g.fillRect(30, 34, 170, 14)
    g.fillStyle = '#c6a96c'
    g.fillRect(30, 60, w - 60, 2)
    for (let i = 0; i < 16; i++) {
      const heading = i % 5 === 0
      const lineW = heading ? 110 : w - 60 - (i % 3) * 40
      const y = 84 + i * 21
      // the lines a posting was matched against are marked as evidence
      if (!heading && (i === 2 || i === 7 || i === 8 || i === 12)) {
        g.fillStyle = '#dcebd8'
        g.fillRect(24, y - 5, lineW + 12, 16)
        g.fillStyle = 'rgba(47,93,55,.7)'
      } else g.fillStyle = heading ? 'rgba(27,26,23,.55)' : 'rgba(27,26,23,.2)'
      g.fillRect(30, y, lineW, heading ? 8 : 6)
    }
    g.strokeStyle = '#2e9e5b'
    g.lineWidth = 7
    g.beginPath()
    g.arc(w - 58, h - 56, 26, 0, Math.PI * 2)
    g.stroke()
    g.beginPath()
    g.moveTo(w - 70, h - 56)
    g.lineTo(w - 61, h - 46)
    g.lineTo(w - 45, h - 66)
    g.stroke()
  })

export function JobBoard({ m }) {
  const board = useMemo(() => jobBoardTex(), [])
  const page = useMemo(() => resumePageTex(), [])
  return (
    <group position={[0, 0.01, 0]}>
      {/* the board of scored postings, on a short stand */}
      <group position={[0.06, 0.42, -0.1]} rotation={[-0.1, -0.12, 0]}>
        <mesh material={m.black} castShadow>
          <boxGeometry args={[0.7, 0.52, 0.03]} />
        </mesh>
        <mesh position={[0, 0, 0.016]}>
          <planeGeometry args={[0.66, 0.48]} />
          <meshStandardMaterial map={board} emissive="#ffffff" emissiveMap={board} emissiveIntensity={0.75} toneMapped={false} />
        </mesh>
        <mesh position={[0, -0.33, -0.03]} material={m.steel}>
          <boxGeometry args={[0.04, 0.16, 0.04]} />
        </mesh>
        <mesh position={[0, -0.405, -0.01]} material={m.black}>
          <boxGeometry args={[0.3, 0.02, 0.16]} />
        </mesh>
      </group>
      {/* the one-page résumé, propped in front */}
      <group position={[-0.22, 0.17, 0.1]} rotation={[-0.42, 0.3, 0]}>
        <mesh material={m.black}>
          <boxGeometry args={[0.27, 0.35, 0.01]} />
        </mesh>
        <mesh position={[0, 0, 0.006]}>
          <planeGeometry args={[0.25, 0.33]} />
          <meshStandardMaterial map={page} roughness={0.9} />
        </mesh>
      </group>
      {/* a brass pen, for the editing */}
      <group position={[0.18, 0.016, 0.13]} rotation={[0, 0.5, Math.PI / 2]}>
        <mesh material={m.gold}>
          <cylinderGeometry args={[0.012, 0.012, 0.2, 14]} />
        </mesh>
        <mesh position={[0, 0.125, 0]} material={m.steel}>
          <coneGeometry args={[0.012, 0.05, 14]} />
        </mesh>
        <mesh position={[0, -0.105, 0]} material={m.black}>
          <cylinderGeometry args={[0.0125, 0.0125, 0.012, 14]} />
        </mesh>
      </group>
    </group>
  )
}
