import { useMemo } from 'react'
import * as THREE from 'three'
import { Ball, Box, Cyl, Chair, FloorLamp, Plant, Rug } from '../primitives.jsx'
import Interactive from '../Interactive.jsx'
import { seeded } from '../random.js'

// ROOM 02, STUDY: x[-12, -4], z[1, 9]. The degree on the north wall beside a lit
// display cabinet of awards and honours, the résumé on the desk, the coursework
// on the bookshelf and a microscope in the reading corner.
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

      {/* Display cabinet: awards and honours (opens the cabinet view) */}
      <Interactive {...it('cabinet', 'A lit display cabinet')} ring={[-8.5, 1.95, 1.0]}>
        <Box p={[-8.5, 0, 1.3]} s={[1.7, 2.3, 0.5]} m={mats.walnut} />
        <Box p={[-8.5, 0.12, 1.56]} s={[1.5, 2.0, 0.02]} m={mats.glass} cast={false} receive={false} />
        {[0.12, 0.8, 1.46].map((y) => (
          <group key={y}>
            <Box p={[-8.5, y + 0.6, 1.53]} s={[1.5, 0.02, 0.03]} m={mats.lampGlow} cast={false} />
            <Box p={[-8.5, y, 1.32]} s={[1.5, 0.04, 0.42]} m={mats.walnut} cast={false} />
          </group>
        ))}
        {/* small glinting pieces on each shelf */}
        <mesh position={[-8.9, 1.62, 1.38]} rotation={[Math.PI / 2, 0, 0]} material={a.cobalt}>
          <cylinderGeometry args={[0.09, 0.09, 0.015, 24]} />
        </mesh>
        <mesh position={[-8.45, 1.6, 1.38]} material={a.gold}>
          <cylinderGeometry args={[0.07, 0.035, 0.14, 20]} />
        </mesh>
        <Box p={[-8.05, 1.5, 1.38]} s={[0.08, 0.2, 0.04]} m={a.crystal} cast={false} />
        <mesh position={[-8.8, 0.96, 1.38]} rotation={[Math.PI / 2, 0, 0]} material={a.silver}>
          <cylinderGeometry args={[0.08, 0.08, 0.015, 24]} />
        </mesh>
        <Box p={[-8.35, 0.84, 1.36]} s={[0.22, 0.06, 0.14]} m={mats.carGrey} cast={false} />
        <Box p={[-8.7, 0.16, 1.4]} s={[0.36, 0.28, 0.02]} m={mats.steel} cast={false} />
        <Box p={[-8.2, 0.16, 1.34]} s={[0.26, 0.08, 0.32]} m={mats.books[1]} cast={false} />
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
      <Plant p={[-4.6, 0, 1.8]} mats={mats} scale={0.9} />

      {/* Desk facing the windows */}
      <Box p={[-9.7, 0.72, 5.4]} s={[0.95, 0.05, 2.1]} m={mats.walnut} />
      <Box p={[-9.7, 0, 4.45]} s={[0.9, 0.72, 0.05]} m={mats.walnut} />
      <Box p={[-9.7, 0, 6.35]} s={[0.9, 0.72, 0.05]} m={mats.walnut} />
      <Chair p={[-8.9, 0, 5.3]} rot={-Math.PI / 2} mats={mats} />
      <Cyl p={[-9.9, 0.77, 4.75]} radius={0.08} h={0.02} m={mats.brass} />
      <Cyl p={[-9.9, 0.77, 4.75]} radius={0.012} h={0.42} m={mats.brass} />
      <Cyl p={[-9.9, 1.15, 4.75]} radius={0.11} h={0.12} m={mats.lampGlow} cast={false} />
      <Interactive {...it('resume', 'A leather folio')} ring={[-9.7, 5.7, 0.5]}>
        <Box p={[-9.7, 0.77, 5.7]} s={[0.36, 0.035, 0.48]} m={mats.leather} r={[0, 0.2, 0]} />
        <Box p={[-9.7, 0.805, 5.7]} s={[0.3, 0.005, 0.42]} m={mats.ivory} r={[0, 0.2, 0]} cast={false} />
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

      {/* ---- scenery (not pick-ups) ---- */}
      {/* a globe on a stand in the window corner */}
      <group position={[-11.2, 0, 7.9]}>
        <Cyl p={[0, 0, 0]} radius={0.2} h={0.03} m={mats.walnut} />
        <Cyl p={[0, 0, 0]} radius={0.025} h={0.78} m={mats.brass} />
        <Ball p={[0, 1.0, 0]} radius={0.22} m={mats.rugWarm} />
        <mesh position={[0, 1.0, 0]} rotation={[0, 0, 0.4]}>
          <torusGeometry args={[0.25, 0.008, 8, 48]} />
          <primitive object={mats.brass} attach="material" />
        </mesh>
      </group>
      {/* a low sideboard on the east wall with books, a vase and a print above */}
      <Box p={[-4.33, 0, 4.5]} s={[0.45, 0.75, 1.6]} m={mats.walnut} />
      {[0, 1, 2, 3].map((i) => (
        <Box key={i} p={[-4.33, 0.75 + i * 0.05, 4.05]} s={[0.3 - i * 0.02, 0.05, 0.38 - i * 0.03]} m={mats.books[(i * 3) % mats.books.length]} r={[0, i * 0.12, 0]} />
      ))}
      <Cyl p={[-4.33, 0.75, 4.95]} radius={0.09} h={0.34} m={mats.terracotta} />
      <Cyl p={[-4.33, 1.09, 4.95]} radius={0.01} h={0.3} m={mats.plantDark} />
      <Box p={[-4.12, 1.15, 4.5]} s={[0.04, 0.8, 1.1]} m={mats.blackMatte} />
      <Box p={[-4.145, 1.21, 4.5]} s={[0.01, 0.68, 0.98]} m={mats.linen} cast={false} />
      <mesh position={[-4.152, 1.55, 4.5]} rotation={[0, -Math.PI / 2, 0]}>
        <circleGeometry args={[0.2, 40]} />
        <primitive object={mats.brass} attach="material" />
      </mesh>
    </group>
  )
}
