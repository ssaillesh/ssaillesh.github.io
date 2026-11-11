import { useMemo } from 'react'
import * as THREE from 'three'
import { Box, Cyl, Rug } from '../primitives.jsx'
import Interactive from '../Interactive.jsx'

// ROOM 05, TROPHY ROOM: x[4, 12], z[-9, -3]. Walnut plinths under spotlights
// along the north glazing, with a low vitrine in the middle of the room.

function Plinth({ x, z, mats, h = 1.0, w = 0.8 }) {
  return (
    <group>
      <Box p={[x, 0, z]} s={[w, h, w]} m={mats.walnut} />
      <Box p={[x, h, z]} s={[w + 0.04, 0.03, w + 0.04]} m={mats.brass} />
    </group>
  )
}

function GlassCase({ x, z, y, mats }) {
  return <Box p={[x, y, z]} s={[0.56, 0.56, 0.56]} m={mats.glass} cast={false} />
}

function Medal({ p, face, ribbon, mats }) {
  return (
    <group position={p}>
      <Box p={[0, 0, 0]} s={[0.2, 0.03, 0.12]} m={mats.steel} />
      <Box p={[0, 0.03, -0.02]} s={[0.07, 0.26, 0.012]} m={ribbon} />
      <mesh position={[0, 0.2, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow material={face}>
        <cylinderGeometry args={[0.1, 0.1, 0.018, 36]} />
      </mesh>
    </group>
  )
}

export default function Trophy({ mats, ctx }) {
  const it = (id, label) => ({ id, label, sub: 'Award', enabled: ctx.active, hovered: ctx.hovered, selected: ctx.selected, onHover: ctx.onHover, onSelect: ctx.onSelect })
  const m = useMemo(
    () => ({
      gold: new THREE.MeshStandardMaterial({ color: '#d4af5f', metalness: 1, roughness: 0.22 }),
      silver: new THREE.MeshStandardMaterial({ color: '#c9ccd1', metalness: 1, roughness: 0.25 }),
      cobalt: new THREE.MeshStandardMaterial({ color: '#2c4f8c', metalness: 0.8, roughness: 0.25 }),
      ribbonRed: new THREE.MeshStandardMaterial({ color: '#7a2420', roughness: 0.8 }),
      ribbonBlue: new THREE.MeshStandardMaterial({ color: '#263d63', roughness: 0.8 }),
      crystal: new THREE.MeshPhysicalMaterial({ color: '#dfe8ee', roughness: 0.05, transparent: true, opacity: 0.45, emissive: '#c9dbe6', emissiveIntensity: 0.15 }),
    }),
    [],
  )

  return (
    <group>
      <Rug p={[8.0, 0.02, -5.3]} s={[5.2, 3.0]} m={mats.rugWarm} />

      <Interactive {...it('ideal', 'IDEAL Scholarship')} ring={[5.4, -7.7, 0.7]}>
        <Plinth x={5.4} z={-7.7} mats={mats} />
        <Medal p={[5.4, 1.03, -7.7]} face={m.gold} ribbon={m.ribbonRed} mats={mats} />
        <GlassCase x={5.4} z={-7.7} y={1.03} mats={mats} />
      </Interactive>

      <Interactive {...it('cobalt', 'Cobalt Medallion')} ring={[7.0, -7.7, 0.7]}>
        <Plinth x={7.0} z={-7.7} mats={mats} />
        <Medal p={[7.0, 1.03, -7.7]} face={m.cobalt} ribbon={m.ribbonBlue} mats={mats} />
        <GlassCase x={7.0} z={-7.7} y={1.03} mats={mats} />
      </Interactive>

      <Interactive {...it('physics', 'Excellence Award, 100% in Physics')} ring={[8.6, -7.7, 0.7]}>
        <Plinth x={8.6} z={-7.7} mats={mats} />
        <Box p={[8.6, 1.03, -7.7]} s={[0.3, 0.06, 0.18]} m={mats.blackMatte} />
        <Box p={[8.6, 1.09, -7.7]} s={[0.24, 0.42, 0.1]} m={m.crystal} cast={false} />
      </Interactive>

      <Interactive {...it('robotics-excellence', 'Excellence Award in Robotics')} ring={[10.3, -7.7, 0.7]}>
        <Plinth x={10.3} z={-7.7} mats={mats} />
        <Box p={[10.3, 1.03, -7.7]} s={[0.28, 0.1, 0.28]} m={mats.blackMatte} />
        <Cyl p={[10.3, 1.13, -7.7]} radius={0.03} h={0.2} m={m.gold} />
        <mesh position={[10.3, 1.45, -7.7]} castShadow material={m.gold}>
          <cylinderGeometry args={[0.15, 0.07, 0.24, 28]} />
        </mesh>
        {[-1, 1].map((s) => (
          <mesh key={s} position={[10.3 + s * 0.17, 1.47, -7.7]} rotation={[Math.PI / 2, 0, 0]} material={m.gold}>
            <torusGeometry args={[0.05, 0.012, 8, 20]} />
          </mesh>
        ))}
      </Interactive>

      {/* Centre vitrine: second place, autonomous robotics, with a robot model */}
      <Interactive {...it('robotics-second', 'Second Place, Autonomous Robotics')} ring={[8.0, -5.2, 1.2]}>
        <Box p={[8.0, 0, -5.2]} s={[1.7, 0.75, 0.9]} m={mats.walnut} />
        <Box p={[8.0, 0.75, -5.2]} s={[1.74, 0.03, 0.94]} m={mats.brass} />
        <Box p={[8.0, 0.78, -5.2]} s={[1.6, 0.5, 0.8]} m={mats.glass} cast={false} />
        <group position={[7.65, 0.78, -5.2]}>
          <Box p={[0, 0.05, 0]} s={[0.42, 0.1, 0.3]} m={mats.carGrey} />
          <Box p={[0.05, 0.15, 0]} s={[0.22, 0.08, 0.2]} m={mats.blackMatte} />
          <Cyl p={[0.12, 0.23, 0]} radius={0.035} h={0.05} m={mats.led} />
          {[[-0.14, 0.16], [0.14, 0.16], [-0.14, -0.16], [0.14, -0.16]].map(([x, z]) => (
            <mesh key={`${x}${z}`} position={[x, 0.05, z]} rotation={[Math.PI / 2, 0, 0]} castShadow material={mats.rubber}>
              <cylinderGeometry args={[0.05, 0.05, 0.04, 16]} />
            </mesh>
          ))}
        </group>
        <Medal p={[8.4, 0.78, -5.2]} face={m.silver} ribbon={m.ribbonBlue} mats={mats} />
      </Interactive>

      <Box p={[6.0, 0, -3.75]} s={[1.6, 0.42, 0.45]} m={mats.leather} />
    </group>
  )
}
