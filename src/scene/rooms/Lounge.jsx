import { useMemo } from 'react'
import { useTexture } from '@react-three/drei'
import * as THREE from 'three'
import { Box, Cyl, Chair, FloorLamp, Plant, Rug, Stool } from '../primitives.jsx'
import { makeCarPrintTexture } from '../materials.js'
import Interactive from '../Interactive.jsx'

// ROOM 05, LOUNGE: x[4, 12], z[-9, 9]. Living area to the south, kitchen and
// dining to the north, the east side glazed.
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

      {/* Dumbbell rack */}
      <Interactive {...it('gym')} label="The gym" sub="Interest" ring={[11.3, 1.9, 0.9]}>
        <group position={[0, 0, 2.5]}>
          <Box p={[11.3, 0, -0.6]} s={[0.5, 0.06, 1.4]} m={mats.steel} />
          <Box p={[11.3, 0, -1.28]} s={[0.5, 0.8, 0.05]} m={mats.steel} />
          <Box p={[11.3, 0, 0.08]} s={[0.5, 0.8, 0.05]} m={mats.steel} />
          {[0.35, 0.65].map((y) => (
            <Box key={y} p={[11.3, y, -0.6]} s={[0.46, 0.03, 1.36]} m={mats.steel} />
          ))}
          {[-1.0, -0.6, -0.2].map((z, i) =>
            [0.38, 0.68].map((y) => (
              <mesh key={`${z}${y}`} position={[11.3, y + 0.08, z]} rotation={[0, 0, Math.PI / 2]} castShadow>
                <cylinderGeometry args={[0.06 + i * 0.012, 0.06 + i * 0.012, 0.34, 14]} />
                <primitive object={mats.rubber} attach="material" />
              </mesh>
            )),
          )}
        </group>
      </Interactive>

      {/* Bike on a floor stand by the east glazing */}
      <Interactive {...it('biking')} label="Biking" sub="Interest" ring={[11.3, 6.0, 1.0]}>
        <group position={[11.3, 0.36, 6.0]} rotation={[0, Math.PI / 2, 0]}>
          {[-0.55, 0.55].map((x) => (
            <mesh key={x} position={[x, 0, 0]}>
              <torusGeometry args={[0.34, 0.025, 10, 40]} />
              <primitive object={mats.rubber} attach="material" />
            </mesh>
          ))}
          <mesh position={[0, 0.12, 0]} rotation={[0, 0, 0.15]}>
            <boxGeometry args={[1.0, 0.035, 0.035]} />
            <primitive object={mats.brass} attach="material" />
          </mesh>
          <mesh position={[-0.12, 0.05, 0]} rotation={[0, 0, 1.1]}>
            <boxGeometry args={[0.6, 0.035, 0.035]} />
            <primitive object={mats.brass} attach="material" />
          </mesh>
          <Box p={[0.3, 0.26, 0]} s={[0.04, 0.3, 0.04]} m={mats.steel} />
          <Box p={[0.3, 0.56, 0]} s={[0.2, 0.04, 0.1]} m={mats.leather} />
        </group>
      </Interactive>

      {/* Kitchen run along the north-west wall, island and dining by the windows */}
      <Box p={[4.45, 0, -6.6]} s={[0.7, 0.9, 4.0]} m={mats.walnut} />
      <Box p={[4.45, 0.9, -6.6]} s={[0.74, 0.04, 4.04]} m={mats.steel} />
      <Box p={[4.4, 0, -8.4]} s={[0.6, 2.4, 0.4]} m={mats.walnut} />
      <Interactive {...it('cooking')} label="Cooking" sub="Interest" ring={[7.0, -6.4, 1.6]}>
        <Box p={[7.0, 0, -6.4]} s={[1.0, 0.9, 2.6]} m={mats.walnut} />
        <Box p={[7.0, 0.9, -6.4]} s={[1.1, 0.05, 2.7]} m={mats.marble} />
        <Cyl p={[7.0, 0.95, -7.1]} radius={0.16} h={0.14} m={mats.steel} />
        <Box p={[7.0, 0.95, -5.8]} s={[0.4, 0.03, 0.28]} m={mats.walnut} />
        {[-7.2, -6.4, -5.6].map((z) => (
          <Stool key={z} p={[7.85, 0, z]} mats={mats} />
        ))}
      </Interactive>
      <Box p={[10.2, 0.72, -5.8]} s={[1.1, 0.05, 2.2]} m={mats.walnut} />
      <Box p={[10.2, 0, -5.8]} s={[0.5, 0.72, 1.4]} m={mats.steel} />
      {[-6.4, -5.2].map((z) => (
        <group key={z}>
          <Chair p={[9.4, 0, z]} rot={Math.PI / 2} mats={mats} seat="linen" />
          <Chair p={[11.0, 0, z]} rot={-Math.PI / 2} mats={mats} seat="linen" />
        </group>
      ))}
      <Plant p={[11.4, 0, -8.4]} mats={mats} scale={1.1} />
      <Plant p={[4.6, 0, -3.2]} mats={mats} scale={1.2} />
    </group>
  )
}
