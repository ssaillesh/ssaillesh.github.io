import { useMemo } from 'react'
import * as THREE from 'three'
import { Box, Cyl, ChipBag } from '../primitives.jsx'
import Interactive from '../Interactive.jsx'
import { carBodyGeometry, wheelPositions } from '../carGeometry.js'

// ROOM 03, WORKSHOP: x[-12, -4], z[-9, 1]. A working garage. The west wall has a
// roll-up door onto a driveway; the UWAFT autonomous car sits in the bay with a
// lidar workbench beside it. Along the north glass: Symcor's server rack,
// OmniaBio's test-tube cart, PepsiCo's analyst standing desk and the tool chest.
// PepsiCo operations is a pallet of cases with the chip bags on top.

const CAR = { length: 3.5, width: 1.6, height: 1.15 }

function GarageCar({ mats, m }) {
  const body = useMemo(() => carBodyGeometry(CAR), [])
  return (
    <group position={[-9.0, 0.1, -2.2]}>
      <mesh geometry={body} material={m.paint} castShadow />
      <mesh position={[0.15, 0.86, 0]} rotation={[0, 0, -0.06]} material={m.glassDark}>
        <boxGeometry args={[1.35, 0.2, 1.34]} />
      </mesh>
      {wheelPositions(CAR).map(([x, z]) => (
        <group key={`${x}${z}`} position={[x, 0.26, z]}>
          <mesh rotation={[Math.PI / 2, 0, 0]} material={mats.rubber} castShadow>
            <cylinderGeometry args={[0.34, 0.34, 0.24, 28]} />
          </mesh>
          <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, z > 0 ? 0.122 : -0.122]} material={mats.brass}>
            <cylinderGeometry args={[0.2, 0.2, 0.01, 20]} />
          </mesh>
        </group>
      ))}
      {/* roof lidar mount: two bars, a plate and the spinning puck */}
      {[-0.45, 0.45].map((z) => (
        <Box key={z} p={[0.15, 0.96, z]} s={[0.9, 0.05, 0.06]} m={mats.steel} />
      ))}
      <Box p={[0.15, 1.01, 0]} s={[0.46, 0.04, 0.46]} m={mats.steel} />
      <Cyl p={[0.15, 1.05, 0]} radius={0.16} h={0.2} m={mats.blackMatte} />
      <Cyl p={[0.15, 1.12, 0]} radius={0.165} h={0.05} m={mats.led} />
      {/* bumper camera */}
      <Box p={[-1.77, 0.3, 0]} s={[0.06, 0.08, 0.24]} m={mats.blackMatte} />
    </group>
  )
}

export default function Workshop({ mats, ctx }) {
  const it = (id) => ({ id, enabled: ctx.active, hovered: ctx.hovered, selected: ctx.selected, onHover: ctx.onHover, onSelect: ctx.onSelect })
  const m = useMemo(
    () => ({
      epoxy: new THREE.MeshStandardMaterial({ color: '#3a3b3d', roughness: 0.28, metalness: 0.15 }),
      lines: new THREE.MeshStandardMaterial({ color: '#d9b23a', roughness: 0.6 }),
      paint: new THREE.MeshPhysicalMaterial({ color: '#e4e1da', metalness: 0.35, roughness: 0.3, clearcoat: 1, clearcoatRoughness: 0.08 }),
      glassDark: new THREE.MeshPhysicalMaterial({ color: '#0d1115', roughness: 0.05, metalness: 0.2, clearcoat: 1 }),
      pallet: new THREE.MeshStandardMaterial({ color: '#9a7a52', roughness: 0.9 }),
      carton: new THREE.MeshStandardMaterial({ color: '#8a6a45', roughness: 0.95 }),
      paper: new THREE.MeshStandardMaterial({ color: '#f1ece2', roughness: 0.9 }),
      peg: new THREE.MeshStandardMaterial({ color: '#c9bfae', roughness: 0.9 }),
      liquids: ['#7fb7c9', '#c9a24a', '#9fc4a0', '#d97757', '#7fb7c9', '#c9a24a'].map((c) => new THREE.MeshStandardMaterial({ color: c, roughness: 0.2, transparent: true, opacity: 0.85 })),
    }),
    [],
  )

  return (
    <group>
      {/* glossy epoxy floor with a painted parking bay */}
      <Box p={[-8, 0.021, -4]} s={[7.9, 0.005, 9.9]} m={m.epoxy} cast={false} />
      {[
        [-8.95, -0.65, 4.2, 0.06],
        [-8.95, -3.75, 4.2, 0.06],
        [-6.88, -2.2, 0.06, 3.16],
      ].map(([x, z, w, d]) => (
        <Box key={`${x}${z}`} p={[x, 0.027, z]} s={[w, 0.004, d]} m={m.lines} cast={false} />
      ))}

      {/* UWAFT: the autonomous car in the bay, with a lidar workbench beside it */}
      <Interactive {...it('uwaft')} label="An autonomous car with a lidar mount" sub="Pick up" ring={[-9.0, -2.2, 2.2]}>
        <GarageCar mats={mats} m={m} />
        <Box p={[-9.3, 0, -4.55]} s={[2.4, 0.9, 0.7]} m={mats.steel} />
        <Box p={[-9.3, 0.9, -4.55]} s={[2.5, 0.06, 0.78]} m={mats.walnut} />
        <Cyl p={[-9.9, 0.96, -4.55]} radius={0.13} h={0.16} m={mats.blackMatte} />
        <Cyl p={[-9.9, 1.06, -4.55]} radius={0.135} h={0.04} m={mats.led} />
        <Box p={[-9.2, 0.96, -4.6]} s={[0.5, 0.03, 0.08]} m={mats.steel} />
        <Box p={[-9.2, 0.96, -4.45]} s={[0.08, 0.2, 0.08]} m={mats.steel} />
        <Box p={[-8.5, 0.96, -4.55]} s={[0.3, 0.16, 0.24]} m={mats.carRed} />
      </Interactive>

      {/* Symcor: a server rack against the north glass */}
      <Interactive {...it('symcor')} label="A server rack and a security key" sub="Pick up" ring={[-11.0, -8.1, 0.9]}>
        <Box p={[-11.0, 0, -8.35]} s={[0.75, 2.1, 0.9]} m={mats.blackMatte} />
        {[0.25, 0.55, 0.85, 1.15, 1.45, 1.75].map((y, i) => (
          <group key={y}>
            <Box p={[-11.0, y, -7.895]} s={[0.66, 0.2, 0.01]} m={mats.steel} cast={false} />
            <Box p={[-11.15, y + 0.08, -7.885]} s={[0.22, 0.025, 0.005]} m={i % 3 === 1 ? mats.ledGreen : mats.led} cast={false} />
          </group>
        ))}
        <Box p={[-10.82, 2.1, -8.2]} s={[0.06, 0.02, 0.14]} m={mats.brass} />
      </Interactive>

      {/* OmniaBio: a steel lab cart with a proper test-tube rack */}
      <Interactive {...it('omniabio')} label="A test-tube rack" sub="Pick up" ring={[-9.45, -8.1, 0.8]}>
        {[0.15, 0.85].map((y) => (
          <Box key={y} p={[-9.45, y, -8.3]} s={[1.1, 0.04, 0.6]} m={mats.steel} />
        ))}
        {[[-0.52, -0.27], [0.52, -0.27], [-0.52, 0.27], [0.52, 0.27]].map(([dx, dz]) => (
          <Box key={`${dx}${dz}`} p={[-9.45 + dx, 0, -8.3 + dz]} s={[0.04, 0.89, 0.04]} m={mats.steel} />
        ))}
        <Box p={[-9.45, 0.89, -8.3]} s={[0.8, 0.03, 0.22]} m={mats.whiteLab} />
        <Box p={[-9.45, 1.08, -8.3]} s={[0.8, 0.02, 0.22]} m={mats.whiteLab} />
        {[-9.75, -9.15].map((x) => (
          <Box key={x} p={[x, 0.89, -8.3]} s={[0.02, 0.2, 0.2]} m={mats.whiteLab} />
        ))}
        {m.liquids.map((liq, i) => {
          const x = -9.75 + i * 0.12
          return (
            <group key={i}>
              <Cyl p={[x, 0.92, -8.3]} radius={0.028} h={0.3} m={mats.glass} cast={false} />
              <Cyl p={[x, 0.92, -8.3]} radius={0.022} h={0.15} m={liq} cast={false} />
            </group>
          )
        })}
      </Interactive>

      {/* PepsiCo, Data Analyst: a standing desk with a clipboard of SQL and charts */}
      <Interactive {...it('pepsico-data')} label="A clipboard of SQL and charts" sub="Pick up" ring={[-7.75, -8.0, 0.8]}>
        <Box p={[-7.75, 0, -8.3]} s={[0.08, 1.05, 0.08]} m={mats.steel} />
        <Box p={[-7.75, 0, -8.3]} s={[0.6, 0.03, 0.5]} m={mats.steel} />
        <Box p={[-7.75, 1.05, -8.25]} s={[1.0, 0.04, 0.6]} m={mats.walnut} r={[0.25, 0, 0]} />
        <Box p={[-7.8, 1.11, -8.2]} s={[0.3, 0.012, 0.4]} m={mats.blackMatte} r={[0.25, 0, 0]} />
        <Box p={[-7.8, 1.12, -8.19]} s={[0.27, 0.004, 0.36]} m={m.paper} r={[0.25, 0, 0]} cast={false} />
        <Box p={[-7.4, 1.11, -8.2]} s={[0.22, 0.01, 0.3]} m={m.paper} r={[0.25, 0.3, 0]} cast={false} />
      </Interactive>

      {/* PepsiCo, Software & Operations: a pallet of cases, chip bags on top */}
      <Interactive {...it('pepsico-ops')} label="A bag of chips" sub="Pick up" ring={[-5.3, -5.9, 1.0]}>
        <Box p={[-5.3, 0, -5.9]} s={[1.2, 0.04, 1.0]} m={m.pallet} />
        {[-0.4, 0, 0.4].map((dz) => (
          <Box key={dz} p={[-5.3, 0.04, -5.9 + dz]} s={[1.2, 0.08, 0.12]} m={m.pallet} />
        ))}
        <Box p={[-5.3, 0.12, -5.9]} s={[1.2, 0.04, 1.0]} m={m.pallet} />
        <Box p={[-5.55, 0.16, -6.1]} s={[0.55, 0.45, 0.5]} m={m.carton} />
        <Box p={[-5.0, 0.16, -6.1]} s={[0.5, 0.45, 0.5]} m={m.carton} />
        <Box p={[-5.3, 0.16, -5.6]} s={[0.9, 0.4, 0.45]} m={m.carton} />
        <Box p={[-5.5, 0.61, -6.1]} s={[0.5, 0.4, 0.45]} m={m.carton} />
        <ChipBag p={[-5.1, 0.6, -5.65]} rot={[-0.3, 0.4, 0.1]} mats={mats} />
        <ChipBag p={[-5.0, 0.61, -6.05]} rot={[0, -0.3, 0]} mats={mats} scale={0.9} />
        <ChipBag p={[-5.5, 1.01, -6.05]} rot={[-1.2, 0, 0.6]} mats={mats} scale={0.85} />
      </Interactive>

      {/* Tool chest: the toolkit */}
      <Interactive {...it('toolkit')} label="A tool chest" sub="Pick up" ring={[-5.7, -8.1, 0.9]}>
        <Box p={[-5.7, 0, -8.35]} s={[1.3, 1.25, 0.6]} m={mats.carRed} />
        {[0.2, 0.42, 0.64, 0.86, 1.08].map((y) => (
          <Box key={y} p={[-5.7, y, -8.04]} s={[1.18, 0.015, 0.01]} m={mats.steel} cast={false} />
        ))}
        <Box p={[-5.7, 1.25, -8.35]} s={[1.34, 0.04, 0.64]} m={mats.blackMatte} />
        {[-0.5, 0.5].map((dx) => (
          <Cyl key={dx} p={[-5.7 + dx, 0, -8.15]} radius={0.06} h={0.06} m={mats.rubber} />
        ))}
      </Interactive>

      {/* garage details: pegboard of tools, shelving with bins, a stack of tyres */}
      <Box p={[-11.9, 1.0, -6.2]} s={[0.04, 1.3, 2.2]} m={m.peg} />
      {[
        [1.25, -6.9, 0.5],
        [1.5, -6.5, 0.7],
        [1.2, -6.0, 0.45],
        [1.55, -5.6, 0.6],
      ].map(([y, z, h], i) => (
        <Box key={i} p={[-11.86, y, z]} s={[0.02, h, 0.06]} m={i % 2 ? mats.carRed : mats.steel} cast={false} />
      ))}
      <Box p={[-10.3, 0, 0.62]} s={[2.4, 1.8, 0.5]} m={mats.steel} r={[0, 0, 0]} />
      {[0.45, 0.95, 1.45].map((y) => (
        <group key={y}>
          {[-10.95, -10.3, -9.65].map((x, i) => (
            <Box key={x} p={[x, y, 0.55]} s={[0.5, 0.32, 0.4]} m={i === 1 ? mats.carRed : m.carton} cast={false} />
          ))}
        </group>
      ))}
      {[0, 0.24, 0.48].map((y) => (
        <mesh key={y} position={[-5.0, y + 0.12, -3.5]} rotation={[Math.PI / 2, 0, 0]} material={mats.rubber} castShadow>
          <torusGeometry args={[0.32, 0.12, 12, 28]} />
        </mesh>
      ))}
    </group>
  )
}
