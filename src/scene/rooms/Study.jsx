import { useMemo } from 'react'
import * as THREE from 'three'
import { Box, Cyl, Chair, FloorLamp, Plant, Rug } from '../primitives.jsx'
import Interactive from '../Interactive.jsx'
import { seeded } from '../random.js'

// ROOM 02, STUDY: x[-12, -4], z[1, 9]. Bookshelves and honours on the north wall,
// desk facing the west windows and the city.
export default function Study({ mats, ctx }) {
  const it = (id) => ({ id, enabled: ctx.active, hovered: ctx.hovered, selected: ctx.selected, onHover: ctx.onHover, onSelect: ctx.onSelect })

  const books = useMemo(() => {
    const r = seeded(3)
    const out = []
    for (let shelf = 0; shelf < 5; shelf++) {
      let x = -11.4
      while (x < -8.2) {
        const w = 0.05 + r() * 0.07
        const h = 0.24 + r() * 0.16
        if (r() > 0.88) { x += 0.18; continue }
        out.push({ x: x + w / 2, y: 0.12 + shelf * 0.48, w, h, m: Math.floor(r() * 8) })
        x += w + 0.008
      }
    }
    return out
  }, [])

  const awardMats = useMemo(
    () => ({
      gold: new THREE.MeshStandardMaterial({ color: '#d4af5f', metalness: 1, roughness: 0.22 }),
      silver: new THREE.MeshStandardMaterial({ color: '#c9ccd1', metalness: 1, roughness: 0.25 }),
      cobalt: new THREE.MeshStandardMaterial({ color: '#2c4f8c', metalness: 0.8, roughness: 0.25 }),
      ribbonRed: new THREE.MeshStandardMaterial({ color: '#7a2420', roughness: 0.8 }),
      ribbonBlue: new THREE.MeshStandardMaterial({ color: '#263d63', roughness: 0.8 }),
      crystal: new THREE.MeshPhysicalMaterial({ color: '#dfe8ee', roughness: 0.05, transparent: true, opacity: 0.5, emissive: '#c9dbe6', emissiveIntensity: 0.15 }),
    }),
    [],
  )

  return (
    <group>
      <Rug p={[-8.6, 0.02, 5.3]} s={[3.6, 3.2]} m={mats.rugWarm} />

      {/* Bookshelf */}
      <Box p={[-9.8, 0, 1.28]} s={[3.5, 2.6, 0.04]} m={mats.walnut} />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <Box key={i} p={[-9.8, 0.08 + i * 0.48, 1.45]} s={[3.5, 0.04, 0.34]} m={mats.walnut} />
      ))}
      <Box p={[-11.56, 0, 1.45]} s={[0.04, 2.6, 0.34]} m={mats.walnut} />
      <Box p={[-8.04, 0, 1.45]} s={[0.04, 2.6, 0.34]} m={mats.walnut} />
      {books.map((b, i) => (
        <Box key={i} p={[b.x, b.y, 1.45]} s={[b.w, b.h, 0.24]} m={mats.books[b.m]} cast={false} />
      ))}

      {/* The degree, framed as the centrepiece of the wall, with honours beside it */}
      <Interactive {...it('degree')} label="BSc Honours Physics · University of Waterloo" sub="Degree" ring={[-6.9, 1.8, 0.75]}>
        <Box p={[-6.9, 1.0, 1.1]} s={[1.25, 1.0, 0.05]} m={mats.walnut} />
        <Box p={[-6.9, 1.06, 1.13]} s={[1.13, 0.88, 0.01]} m={mats.ivory} cast={false} />
        <Box p={[-6.9, 1.62, 1.14]} s={[0.56, 0.05, 0.005]} m={mats.blackMatte} cast={false} />
        <Box p={[-6.9, 1.52, 1.14]} s={[0.8, 0.025, 0.005]} m={mats.stone} cast={false} />
        <Box p={[-6.9, 1.44, 1.14]} s={[0.66, 0.02, 0.005]} m={mats.stone} cast={false} />
        <Cyl p={[-6.62, 1.18, 1.14]} radius={0.07} h={0.01} m={mats.brass} r={[Math.PI / 2, 0, 0]} />
      </Interactive>
      <Interactive {...it('presidential')} label="Presidential Scholarship" sub="Honour" ring={[-5.4, 1.8, 0.55]}>
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
      <Interactive {...it('distinction')} label="Term Distinction" sub="Honour" ring={[-9.7, 5.9, 0.5]}>
        <Box p={[-9.7, 0.77, 5.9]} s={[0.3, 0.06, 0.4]} m={mats.books[1]} />
        <Box p={[-9.7, 0.83, 5.9]} s={[0.28, 0.04, 0.38]} m={mats.books[4]} />
      </Interactive>

      {/* Awards: a glass-topped walnut display table */}
      <Box p={[-5.4, 0, 5.3]} s={[0.72, 0.82, 2.7]} m={mats.walnut} />
      <Box p={[-5.4, 0.82, 5.3]} s={[0.76, 0.03, 2.74]} m={mats.brass} />
      <Box p={[-5.4, 0.85, 5.3]} s={[0.7, 0.36, 2.66]} m={mats.glass} cast={false} />
      <Interactive {...it('ideal')} label="IDEAL Scholarship" sub="Award" ring={[-5.4, 4.25, 0.34]}>
        <mesh position={[-5.4, 0.87, 4.25]} material={awardMats.gold} castShadow>
          <cylinderGeometry args={[0.1, 0.1, 0.02, 32]} />
        </mesh>
        <Box p={[-5.4, 0.86, 4.08]} s={[0.07, 0.01, 0.22]} m={awardMats.ribbonRed} cast={false} />
      </Interactive>
      <Interactive {...it('cobalt')} label="Cobalt Medallion" sub="Award" ring={[-5.4, 4.8, 0.34]}>
        <mesh position={[-5.4, 0.87, 4.8]} material={awardMats.cobalt} castShadow>
          <cylinderGeometry args={[0.11, 0.11, 0.025, 32]} />
        </mesh>
        <Box p={[-5.4, 0.86, 4.62]} s={[0.07, 0.01, 0.22]} m={awardMats.ribbonBlue} cast={false} />
      </Interactive>
      <Interactive {...it('physics')} label="Excellence Award, 100% in Physics" sub="Award" ring={[-5.4, 5.35, 0.34]}>
        <Box p={[-5.4, 0.85, 5.35]} s={[0.2, 0.04, 0.14]} m={mats.blackMatte} />
        <Box p={[-5.4, 0.89, 5.35]} s={[0.15, 0.26, 0.07]} m={awardMats.crystal} cast={false} />
      </Interactive>
      <Interactive {...it('robotics-excellence')} label="Excellence Award in Robotics" sub="Award" ring={[-5.4, 5.9, 0.34]}>
        <Box p={[-5.4, 0.85, 5.9]} s={[0.16, 0.06, 0.16]} m={mats.blackMatte} />
        <Cyl p={[-5.4, 0.91, 5.9]} radius={0.018} h={0.1} m={awardMats.gold} />
        <mesh position={[-5.4, 1.06, 5.9]} material={awardMats.gold} castShadow>
          <cylinderGeometry args={[0.08, 0.04, 0.12, 24]} />
        </mesh>
      </Interactive>
      <Interactive {...it('robotics-second')} label="Second Place, Autonomous Robotics" sub="Award" ring={[-5.4, 6.4, 0.34]}>
        <Box p={[-5.4, 0.85, 6.3]} s={[0.18, 0.06, 0.12]} m={mats.carGrey} />
        <Cyl p={[-5.36, 0.91, 6.3]} radius={0.02} h={0.03} m={mats.led} />
        <mesh position={[-5.4, 0.87, 6.5]} material={awardMats.silver} castShadow>
          <cylinderGeometry args={[0.08, 0.08, 0.018, 28]} />
        </mesh>
      </Interactive>

      {/* Reading corner */}
      <group position={[-6.2, 0, 7.4]} rotation={[0, -2.4, 0]}>
        <Box p={[0, 0, 0]} s={[0.9, 0.42, 0.85]} m={mats.leather} />
        <Box p={[0, 0.42, -0.34]} s={[0.9, 0.5, 0.18]} m={mats.leather} />
        <Box p={[-0.4, 0.42, 0.05]} s={[0.12, 0.2, 0.8]} m={mats.leather} />
        <Box p={[0.4, 0.42, 0.05]} s={[0.12, 0.2, 0.8]} m={mats.leather} />
      </group>
      <Cyl p={[-5.0, 0, 8.2]} radius={0.28} h={0.55} m={mats.walnut} />
      <FloorLamp p={[-7.2, 0, 8.4]} mats={mats} />
    </group>
  )
}
