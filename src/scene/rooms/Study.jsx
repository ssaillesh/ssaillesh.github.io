import { useMemo } from 'react'
import * as THREE from 'three'
import { Box, Cyl, Chair, FloorLamp, Plant, Rug } from '../primitives.jsx'
import Interactive from '../Interactive.jsx'
import { seeded } from '../random.js'

// ROOM 02, STUDY: x[-12, -4], z[1, 9]. Achievements are spread through the room:
// the degree and a letter on the north wall, an achievement shelf beside them,
// the crystal award and a bound transcript on the desk, the coursework on the
// bookshelf and a microscope in the reading corner.
// a medal standing upright on a small stand, facing into the room (+z)
function StandingMedal({ x, y, face, ribbon, base, r = 0.11 }) {
  return (
    <group position={[x, y, 1.42]}>
      <Box p={[0, 0, 0]} s={[0.16, 0.03, 0.1]} m={base} />
      <Box p={[0, 0.03, -0.03]} s={[0.05, 0.2, 0.01]} m={ribbon} cast={false} />
      <mesh position={[0, 0.17, 0]} rotation={[Math.PI / 2, 0, 0]} material={face} castShadow>
        <cylinderGeometry args={[r, r, 0.02, 32]} />
      </mesh>
    </group>
  )
}

export default function Study({ mats, ctx }) {
  const it = (id, label) => ({ id, label, sub: 'Pick up', enabled: ctx.active, hovered: ctx.hovered, selected: ctx.selected, onHover: ctx.onHover, onSelect: ctx.onSelect })

  const books = useMemo(() => {
    const r = seeded(3)
    const out = []
    for (let shelf = 0; shelf < 5; shelf++) {
      let x = -11.45
      while (x < -9.75) {
        const w = 0.05 + r() * 0.07
        const h = 0.24 + r() * 0.16
        if (r() > 0.9) {
          x += 0.16
          continue
        }
        out.push({ x: x + w / 2, y: 0.12 + shelf * 0.48, w, h, m: Math.floor(r() * 8) })
        x += w + 0.008
      }
    }
    return out
  }, [])

  const a = useMemo(
    () => ({
      gold: new THREE.MeshStandardMaterial({ color: '#d4af5f', metalness: 1, roughness: 0.22 }),
      silver: new THREE.MeshStandardMaterial({ color: '#c9ccd1', metalness: 1, roughness: 0.25 }),
      cobalt: new THREE.MeshStandardMaterial({ color: '#2c4f8c', metalness: 0.8, roughness: 0.25 }),
      ribbonBlue: new THREE.MeshStandardMaterial({ color: '#263d63', roughness: 0.8 }),
      crystal: new THREE.MeshPhysicalMaterial({ color: '#dfe8ee', roughness: 0.05, transparent: true, opacity: 0.5, emissive: '#c9dbe6', emissiveIntensity: 0.2 }),
    }),
    [],
  )

  return (
    <group>
      <Rug p={[-8.6, 0.02, 5.3]} s={[3.6, 3.2]} m={mats.rugWarm} />

      {/* Bookshelf: the coursework */}
      <Interactive {...it('coursework', 'Five well-used textbooks')} ring={[-10.6, 1.9, 0.9]}>
        <Box p={[-10.6, 0, 1.28]} s={[1.95, 2.6, 0.04]} m={mats.walnut} />
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <Box key={i} p={[-10.6, 0.08 + i * 0.48, 1.45]} s={[1.95, 0.04, 0.34]} m={mats.walnut} />
        ))}
        <Box p={[-11.56, 0, 1.45]} s={[0.04, 2.6, 0.34]} m={mats.walnut} />
        <Box p={[-9.64, 0, 1.45]} s={[0.04, 2.6, 0.34]} m={mats.walnut} />
        {books.map((b, i) => (
          <Box key={i} p={[b.x, b.y, 1.45]} s={[b.w, b.h, 0.24]} m={mats.books[b.m]} cast={false} />
        ))}
      </Interactive>

      {/* Achievement shelf: three walnut shelves on the wall */}
      <Box p={[-8.5, 0, 1.3]} s={[1.5, 2.3, 0.04]} m={mats.walnut} />
      {[0.55, 1.2, 1.85].map((y) => (
        <group key={y}>
          <Box p={[-8.5, y, 1.42]} s={[1.5, 0.04, 0.3]} m={mats.walnut} />
          <Box p={[-8.5, y - 0.02, 1.58]} s={[1.5, 0.02, 0.02]} m={mats.brass} cast={false} />
        </group>
      ))}
      <Interactive {...it('ideal', 'A cobalt medal')} ring={[-8.5, 1.95, 0.45]}>
        <StandingMedal x={-8.5} y={1.89} face={a.cobalt} ribbon={a.ribbonBlue} base={mats.blackMatte} r={0.13} />
      </Interactive>
      <Interactive {...it('robotics-excellence', 'A gold trophy')} ring={[-8.5, 1.95, 0.45]}>
        <Box p={[-8.5, 1.24, 1.42]} s={[0.18, 0.06, 0.18]} m={mats.blackMatte} />
        <Cyl p={[-8.5, 1.3, 1.42]} radius={0.02} h={0.12} m={a.gold} />
        <mesh position={[-8.5, 1.48, 1.42]} material={a.gold} castShadow>
          <cylinderGeometry args={[0.1, 0.05, 0.16, 24]} />
        </mesh>
      </Interactive>
      <Interactive {...it('robotics-second', 'A silver medal and a small robot')} ring={[-8.5, 1.95, 0.45]}>
        <StandingMedal x={-8.8} y={0.59} face={a.silver} ribbon={a.ribbonBlue} base={mats.blackMatte} r={0.1} />
        <group position={[-8.25, 0.59, 1.42]}>
          <Box p={[0, 0.03, 0]} s={[0.26, 0.07, 0.18]} m={mats.carGrey} />
          <Box p={[0.02, 0.1, 0]} s={[0.12, 0.06, 0.12]} m={mats.blackMatte} />
          <Cyl p={[0.08, 0.16, 0]} radius={0.025} h={0.03} m={mats.led} />
        </group>
      </Interactive>

      {/* The degree and the scholarship letter */}
      <Interactive {...it('degree', 'A framed certificate')} ring={[-6.9, 1.8, 0.75]}>
        <Box p={[-6.9, 1.0, 1.1]} s={[1.25, 1.0, 0.05]} m={mats.walnut} />
        <Box p={[-6.9, 1.06, 1.13]} s={[1.13, 0.88, 0.01]} m={mats.ivory} cast={false} />
        <Box p={[-6.9, 1.62, 1.14]} s={[0.56, 0.05, 0.005]} m={mats.blackMatte} cast={false} />
        <Box p={[-6.9, 1.52, 1.14]} s={[0.8, 0.025, 0.005]} m={mats.stone} cast={false} />
        <Box p={[-6.9, 1.44, 1.14]} s={[0.66, 0.02, 0.005]} m={mats.stone} cast={false} />
        <Cyl p={[-6.62, 1.18, 1.14]} radius={0.07} h={0.01} m={mats.brass} r={[Math.PI / 2, 0, 0]} />
      </Interactive>
      <Interactive {...it('presidential', 'A steel-framed letter')} ring={[-5.4, 1.8, 0.55]}>
        <Box p={[-5.4, 1.2, 1.1]} s={[0.62, 0.76, 0.04]} m={mats.steel} />
        <Box p={[-5.4, 1.25, 1.125]} s={[0.52, 0.66, 0.01]} m={mats.ivory} cast={false} />
      </Interactive>
      <Plant p={[-4.6, 0, 1.8]} mats={mats} scale={0.9} />

      {/* Desk facing the windows */}
      <Box p={[-9.7, 0.72, 5.4]} s={[0.95, 0.05, 2.1]} m={mats.walnut} />
      <Box p={[-9.7, 0, 4.45]} s={[0.9, 0.72, 0.05]} m={mats.walnut} />
      <Box p={[-9.7, 0, 6.35]} s={[0.9, 0.72, 0.05]} m={mats.walnut} />
      <Chair p={[-8.9, 0, 5.3]} rot={-Math.PI / 2} mats={mats} />
      <Cyl p={[-9.9, 0.77, 4.75]} radius={0.08} h={0.02} m={mats.brass} />
      <Cyl p={[-9.9, 0.77, 4.75]} radius={0.012} h={0.42} m={mats.brass} />
      <Cyl p={[-9.9, 1.15, 4.75]} radius={0.11} h={0.12} m={mats.lampGlow} cast={false} />
      <Interactive {...it('physics', 'A crystal block')} ring={[-9.7, 5.25, 0.4]}>
        <Box p={[-9.75, 0.77, 5.25]} s={[0.16, 0.03, 0.1]} m={mats.blackMatte} />
        <Box p={[-9.75, 0.8, 5.25]} s={[0.11, 0.2, 0.05]} m={a.crystal} cast={false} />
      </Interactive>
      <Interactive {...it('distinction', 'A bound book')} ring={[-9.7, 5.95, 0.45]}>
        <Box p={[-9.7, 0.77, 5.95]} s={[0.3, 0.06, 0.4]} m={mats.books[1]} />
        <Box p={[-9.7, 0.83, 5.95]} s={[0.28, 0.04, 0.38]} m={mats.books[4]} />
      </Interactive>

      {/* Reading corner with the microscope */}
      <group position={[-6.2, 0, 7.4]} rotation={[0, -2.4, 0]}>
        <Box p={[0, 0, 0]} s={[0.9, 0.42, 0.85]} m={mats.leather} />
        <Box p={[0, 0.42, -0.34]} s={[0.9, 0.5, 0.18]} m={mats.leather} />
        <Box p={[-0.4, 0.42, 0.05]} s={[0.12, 0.2, 0.8]} m={mats.leather} />
        <Box p={[0.4, 0.42, 0.05]} s={[0.12, 0.2, 0.8]} m={mats.leather} />
      </group>
      <Cyl p={[-5.0, 0, 8.2]} radius={0.3} h={0.55} m={mats.walnut} />
      <Interactive {...it('specialization', 'A microscope')} ring={[-5.0, 8.2, 0.55]}>
        <Box p={[-5.0, 0.55, 8.2]} s={[0.22, 0.03, 0.18]} m={mats.blackMatte} />
        <Box p={[-5.06, 0.58, 8.2]} s={[0.04, 0.28, 0.06]} m={mats.blackMatte} />
        <mesh position={[-4.98, 0.8, 8.2]} rotation={[0, 0, -0.5]} material={mats.ivory} castShadow>
          <cylinderGeometry args={[0.03, 0.035, 0.24, 16]} />
        </mesh>
        <Box p={[-4.97, 0.66, 8.2]} s={[0.12, 0.015, 0.12]} m={mats.steel} />
      </Interactive>
      <FloorLamp p={[-7.2, 0, 8.4]} mats={mats} />
    </group>
  )
}
