import { useMemo } from 'react'
import { useTexture } from '@react-three/drei'
import * as THREE from 'three'
import { Box, Cyl, Chair, FloorLamp, Plant, Rug, Stool } from '../primitives.jsx'
import { makeCarPrintTexture } from '../materials.js'
import Interactive from '../Interactive.jsx'

// ROOM 05, LOUNGE: x[4, 12], z[-9, 9]. The fire, the sofa and the photographs
// to the south; a drinks cabinet and armchairs to the north. The Garage is
// through the door in the east wall; the kitchen is in the Dining room.
export default function Lounge({ mats, ctx }) {
  const it = (id) => ({ id, enabled: ctx.active, hovered: ctx.hovered, selected: ctx.selected, onHover: ctx.onHover, onSelect: ctx.onSelect })
  const carPrint = useMemo(() => makeCarPrintTexture(), [])
  const photos = useTexture(['/residence/explore-lake.jpg', '/residence/explore-river.jpg'])
  photos.forEach((t) => (t.colorSpace = THREE.SRGBColorSpace))

  return (
    <group>
      <Rug p={[8.0, 0.02, 6.0]} s={[4.6, 4.8]} m={mats.rugIvory} />

      {/* Fireplace wall with an automotive print */}
      <Box p={[4.4, 0, 6.0]} s={[0.5, 0.55, 3.8]} m={mats.walnut} />
      <Box p={[4.66, 0.12, 6.0]} s={[0.02, 0.22, 2.2]} m={mats.fire} cast={false} />
      <Interactive {...it('cars')} label="Cars & automotive design" sub="Select" ring={[7.4, 6.0, 1.3]}>
        <Box p={[4.1, 1.15, 6.0]} s={[0.04, 1.3, 2.1]} m={mats.brass} />
        <mesh position={[4.13, 1.8, 6.0]} rotation={[0, Math.PI / 2, 0]}>
          <planeGeometry args={[1.98, 1.18]} />
          <meshStandardMaterial map={carPrint} roughness={0.6} />
        </mesh>
        {/* Coffee table with a scale model */}
        <Box p={[7.4, 0, 6.0]} s={[1.2, 0.34, 2.0]} m={mats.walnut} />
        <Box p={[7.4, 0.34, 6.0]} s={[1.24, 0.03, 2.04]} m={mats.marble} />
        <Box p={[7.4, 0.38, 5.9]} s={[0.18, 0.05, 0.42]} m={mats.carRed} />
        <Box p={[7.4, 0.43, 5.85]} s={[0.12, 0.04, 0.18]} m={mats.carRed} />
      </Interactive>

      {/* L-shaped sofa facing the fire */}
      <Box p={[9.9, 0, 5.8]} s={[1.0, 0.42, 4.4]} m={mats.linen} />
      <Box p={[10.45, 0, 5.8]} s={[0.26, 0.82, 4.4]} m={mats.linen} />
      <Box p={[8.6, 0, 7.6]} s={[1.8, 0.42, 0.95]} m={mats.linen} />
      <Box p={[8.6, 0, 8.15]} s={[1.8, 0.82, 0.26]} m={mats.linen} />
      <Box p={[9.9, 0.42, 4.6]} s={[0.5, 0.18, 0.5]} m={mats.leather} />
      <Box p={[6.0, 0, 3.3]} s={[0.9, 0.42, 0.85]} m={mats.leather} r={[0, 0.6, 0]} />
      <FloorLamp p={[11.3, 0, 3.3]} mats={mats} />
      <Plant p={[11.4, 0, 8.5]} mats={mats} scale={1.2} />
      <Cyl p={[7.1, 0, 8.35]} radius={0.28} h={0.52} m={mats.walnut} />
      <Interactive {...it('contact')} label="A rotary phone" sub="Pick up" ring={[7.1, 8.35, 0.5]}>
        <Box p={[7.1, 0.52, 8.35]} s={[0.26, 0.1, 0.2]} m={mats.blackMatte} />
        <Cyl p={[7.1, 0.62, 8.39]} radius={0.07} h={0.01} m={mats.brass} />
        <Box p={[7.1, 0.65, 8.3]} s={[0.3, 0.05, 0.07]} m={mats.blackMatte} />
      </Interactive>
      <Plant p={[4.9, 0, 8.5]} mats={mats} />

      {/* Credenza with photographs */}
      <Interactive {...it('exploring')} label="Exploring new things" sub="Select" ring={[8.2, 1.2, 1.3]}>
        <Box p={[8.2, 0, 1.2]} s={[2.4, 0.7, 0.45]} m={mats.walnut} />
        {[[-0.55, 0], [0.5, 1]].map(([dx, i]) => (
          <group key={i} position={[8.2 + dx, 0.7, 1.22]} rotation={[-0.12, 0, 0]}>
            <Box p={[0, 0, 0]} s={[0.78, 0.6, 0.03]} m={mats.blackMatte} />
            <mesh position={[0, 0.3, 0.017]}>
              <planeGeometry args={[0.7, 0.52]} />
              <meshStandardMaterial map={photos[i]} roughness={0.7} />
            </mesh>
          </group>
        ))}
      </Interactive>

      {/* North end: a drinks cabinet under the glass and a pair of armchairs */}
      <Box p={[8.0, 0, -8.55]} s={[3.0, 0.95, 0.55]} m={mats.walnut} />
      <Box p={[8.0, 0.95, -8.55]} s={[3.04, 0.03, 0.59]} m={mats.brass} />
      {[7.0, 7.3, 7.6, 8.6, 8.9].map((x, i) => (
        <Cyl key={x} p={[x, 0.98, -8.6]} radius={0.05} h={0.28 + (i % 2) * 0.06} m={mats.books[i % 8]} />
      ))}
      <Rug p={[8.0, 0.02, -5.2]} s={[3.6, 3.0]} m={mats.rugWarm} />
      {[[6.9, -5.4, 0.7], [9.1, -5.4, -0.7]].map(([x, z, r]) => (
        <group key={x} position={[x, 0, z]} rotation={[0, r, 0]}>
          <Box p={[0, 0, 0]} s={[0.9, 0.42, 0.85]} m={mats.leather} />
          <Box p={[0, 0.42, -0.34]} s={[0.9, 0.5, 0.18]} m={mats.leather} />
        </group>
      ))}
      <Cyl p={[8.0, 0, -5.0]} radius={0.3} h={0.5} m={mats.walnut} />
      <FloorLamp p={[10.4, 0, -6.6]} mats={mats} />
      <Plant p={[11.4, 0, -8.4]} mats={mats} scale={1.1} />
      <Plant p={[4.6, 0, -3.2]} mats={mats} scale={1.2} />
    </group>
  )
}
