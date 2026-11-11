import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { Box } from './primitives.jsx'
import { BUILDING } from '../data/rooms.js'

const H = BUILDING.wallHeight
const INTERIOR_H = 2.7
const T = 0.16

// Interior partitions. `fadeFor` lists the rooms this wall would hide from the
// default camera (it sits on their east or south edge), so it fades when one is open.
const interiorWalls = [
  { id: 'w-west-core', axis: 'z', at: -4, from: -9, to: 9, openings: [[-2.4, 0.4], [1.6, 3.6]], fadeFor: ['study', 'workshop'] },
  { id: 'w-east-core', axis: 'z', at: 4, from: -9, to: 9, openings: [[-2, 3]], fadeFor: ['foyer', 'vault'] },
  { id: 'w-study-workshop', axis: 'x', at: 1, from: -12, to: -4, openings: [], fadeFor: ['workshop'] },
  { id: 'w-gallery', axis: 'x', at: -3, from: -4, to: 4, openings: [[-2, 2]], fadeFor: ['vault'] },
  { id: 'w-foyer', axis: 'x', at: 4, from: -4, to: 4, openings: [[-2.4, 2.4]], fadeFor: [] },
]

const segmentsOf = (from, to, openings) => {
  const segs = []
  let cur = from
  for (const [a, b] of [...openings].sort((x, y) => x[0] - y[0])) {
    if (a > cur) segs.push([cur, a])
    cur = b
  }
  if (cur < to) segs.push([cur, to])
  return segs
}

function WallRun({ wall, mats, activeRoom }) {
  const body = useMemo(() => mats.wall.clone(), [mats])
  const cap = useMemo(() => mats.wallCap.clone(), [mats])
  const opacity = useRef(1)

  useFrame((_, dt) => {
    const target = activeRoom && wall.fadeFor.includes(activeRoom) ? 0.08 : 1
    opacity.current = THREE.MathUtils.damp(opacity.current, target, 6, dt)
    for (const m of [body, cap]) {
      m.opacity = opacity.current
      m.transparent = opacity.current < 0.995
      m.depthWrite = opacity.current > 0.5
    }
  })

  return segmentsOf(wall.from, wall.to, wall.openings).map(([a, b]) => {
    const len = b - a
    const mid = (a + b) / 2
    const p = wall.axis === 'z' ? [wall.at, 0, mid] : [mid, 0, wall.at]
    const s = wall.axis === 'z' ? [T, INTERIOR_H, len] : [len, INTERIOR_H, T]
    const sc = wall.axis === 'z' ? [T + 0.02, 0.04, len] : [len, 0.04, T + 0.02]
    return (
      <group key={`${wall.id}-${a}`}>
        <Box p={p} s={s} m={body} />
        <Box p={[p[0], INTERIOR_H, p[2]]} s={sc} m={cap} cast={false} />
      </group>
    )
  })
}

// Floor-to-ceiling glazing between structural piers (north and west, behind the rooms).
function GlazedFacade({ axis, at, from, to, piers, mats }) {
  const bays = []
  for (let i = 0; i < piers.length - 1; i++) bays.push([piers[i], piers[i + 1]])
  const place = (u, y, w, h, d) => (axis === 'x' ? { p: [u, y, at], s: [w, h, d] } : { p: [at, y, u], s: [d, h, w] })
  return (
    <group>
      {piers.map((u) => {
        const b = place(u, 0, 0.5, H, 0.45)
        return <Box key={`pier-${u}`} p={b.p} s={b.s} m={mats.wall} />
      })}
      {bays.map(([a, b]) => {
        const w = b - a - 0.5
        const mid = (a + b) / 2
        const glass = place(mid, 0.12, w, H - 0.3, 0.02)
        const sill = place(mid, 0, w, 0.12, 0.3)
        const head = place(mid, H - 0.18, w, 0.18, 0.3)
        const mull = place(mid, 0.12, 0.06, H - 0.3, 0.08)
        const rail = place(mid, 2.35, w, 0.05, 0.08)
        return (
          <group key={`bay-${a}`}>
            <Box {...glass} m={mats.glass} cast={false} receive={false} />
            <Box {...sill} m={mats.steel} />
            <Box {...head} m={mats.steel} />
            <Box {...mull} m={mats.steel} />
            <Box {...rail} m={mats.steel} />
          </group>
        )
      })}
      <Box {...place((from + to) / 2, H, to - from + 0.5, 0.08, 0.5)} m={mats.wallCap} cast={false} />
    </group>
  )
}

// Low parapet + slim mullions on the camera-facing sides, so the interior stays visible.
function OpenFacade({ axis, at, from, to, gaps = [], mats }) {
  const runs = segmentsOf(from, to, gaps)
  const place = (u, y, w, h, d) => (axis === 'x' ? { p: [u, y, at], s: [w, h, d] } : { p: [at, y, u], s: [d, h, w] })
  const posts = []
  for (let u = from; u <= to + 0.001; u += 2) if (!gaps.some(([a, b]) => u > a - 0.2 && u < b + 0.2)) posts.push(u)
  return (
    <group>
      {runs.map(([a, b]) => (
        <group key={`run-${a}`}>
          <Box {...place((a + b) / 2, 0, b - a, 0.45, 0.3)} m={mats.wall} />
          <Box {...place((a + b) / 2, 0.45, b - a, 0.04, 0.32)} m={mats.steel} />
          <Box {...place((a + b) / 2, 0.49, b - a, H - 0.49, 0.02)} m={mats.glass} cast={false} receive={false} />
        </group>
      ))}
      {posts.map((u) => (
        <Box key={`post-${u}`} {...place(u, 0.45, 0.06, H - 0.45, 0.08)} m={mats.steel} cast={false} />
      ))}
    </group>
  )
}

// The residence stands at ground level on a low concrete plinth, inside a
// quiet forecourt that falls away into darkness. No backdrop.
function Ground({ mats }) {
  const groundMat = useMemo(() => {
    const m = mats.concreteFloor.clone()
    m.map = mats.concreteFloor.map.clone()
    m.map.repeat.set(18, 18)
    m.map.needsUpdate = true
    m.color = new THREE.Color('#8a857c')
    m.roughness = 0.95
    return m
  }, [mats])
  return (
    <group>
      <mesh position={[0, -0.3, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow material={groundMat}>
        <circleGeometry args={[70, 64]} />
      </mesh>
      {/* plinth the building sits on */}
      <Box p={[0, -0.3, 0]} s={[25.2, 0.3, 19.2]} m={mats.slab} />
      {/* forecourt paving and entrance steps */}
      <Box p={[0, -0.3, 11.2]} s={[6, 0.02, 3.2]} m={mats.stone} cast={false} />
      <Box p={[0, -0.3, 9.85]} s={[3.6, 0.2, 0.5]} m={mats.stone} />
      <Box p={[0, -0.3, 9.7]} s={[3.6, 0.3, 0.2]} m={mats.stone} />
      {/* low planters flanking the entrance */}
      {[-3.6, 3.6].map((x) => (
        <group key={x}>
          <Box p={[x, -0.3, 10.6]} s={[2.2, 0.55, 0.8]} m={mats.wall} />
          <Box p={[x, 0.25, 10.6]} s={[2.0, 0.25, 0.6]} m={mats.plant} />
        </group>
      ))}
    </group>
  )
}

const floors = [
  { b: [-4, 4, 4, 9], m: 'polished' },
  { b: [-4, 4, -3, 4], m: 'polished' },
  { b: [-12, -4, 1, 9], m: 'darkFloor' },
  { b: [-12, -4, -9, 1], m: 'concreteFloor' },
  { b: [-4, 4, -9, -3], m: 'polished' },
  { b: [4, 12, -9, 9], m: 'oakFloor' },
]

export default function Architecture({ mats, activeRoom }) {
  return (
    <group>
      <Ground mats={mats} />
      {floors.map(({ b: [x0, x1, z0, z1], m }) => (
        <Box key={`${x0}${z0}`} p={[(x0 + x1) / 2, 0, (z0 + z1) / 2]} s={[x1 - x0, 0.02, z1 - z0]} m={mats[m]} cast={false} />
      ))}
      {interiorWalls.map((w) => (
        <WallRun key={w.id} wall={w} mats={mats} activeRoom={activeRoom} />
      ))}
      <GlazedFacade axis="x" at={-9} from={-12} to={12} piers={[-12, -8, -4, 0, 4, 8, 12]} mats={mats} />
      <GlazedFacade axis="z" at={-12} from={-9} to={9} piers={[-9, -4.5, 0, 4.5, 9]} mats={mats} />
      <OpenFacade axis="x" at={9} from={-12} to={12} gaps={[[-1.3, 1.3]]} mats={mats} />
      <OpenFacade axis="z" at={12} from={-9} to={9} mats={mats} />
      {/* Entrance: steel portal and a walnut pivot door left ajar */}
      <Box p={[-1.35, 0, 9]} s={[0.12, 3, 0.3]} m={mats.steel} />
      <Box p={[1.35, 0, 9]} s={[0.12, 3, 0.3]} m={mats.steel} />
      <Box p={[0, 3, 9]} s={[2.82, 0.14, 0.3]} m={mats.steel} />
      <Box p={[0.55, 0, 8.55]} s={[0.08, 2.95, 1.7]} r={[0, 0.55, 0]} m={mats.walnut} />

    </group>
  )
}
