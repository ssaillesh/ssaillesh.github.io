import { useMemo } from 'react'
import { useTexture } from '@react-three/drei'
import * as THREE from 'three'
import { Box, Cyl, ChipBag } from '../primitives.jsx'
import Interactive from '../Interactive.jsx'
import CrossoverCar from '../CrossoverCar.jsx'

// ROOM 03, GARAGE: x[12, 20], z[-9, 9], the east wing. A roll-up door on the
// south side opens onto the driveway. Each role has its own station, newest
// first from the north: Symcor's server rack (north-west), OmniaBio's lab cart
// (north-centre), PepsiCo operations' pallet (north-east), PepsiCo data's
// standing desk (centre), and the UWAFT car up on the lift (south). A training corner (bike on the
// wall, dumbbells) and a hangout corner (couch, tyre table, fridge, neon SM, racing sim rig).

export default function Garage({ mats, ctx }) {
  const it = (id) => ({ id, enabled: ctx.active, hovered: ctx.hovered, selected: ctx.selected, onHover: ctx.onHover, onSelect: ctx.onSelect })
  const logo = useTexture('/logos/sai-logo.png', (tx) => {
    tx.colorSpace = THREE.SRGBColorSpace
  })
  const m = useMemo(
    () => ({
      epoxy: new THREE.MeshStandardMaterial({ color: '#3a3b3d', roughness: 0.28, metalness: 0.15 }),
      lines: new THREE.MeshStandardMaterial({ color: '#d9b23a', roughness: 0.6 }),
      pallet: new THREE.MeshStandardMaterial({ color: '#9a7a52', roughness: 0.9 }),
      carton: new THREE.MeshStandardMaterial({ color: '#8a6a45', roughness: 0.95 }),
      paper: new THREE.MeshStandardMaterial({ color: '#f1ece2', roughness: 0.9 }),
      peg: new THREE.MeshStandardMaterial({ color: '#c9bfae', roughness: 0.9 }),
      mat: new THREE.MeshStandardMaterial({ color: '#1c1c1d', roughness: 0.95 }),
      lift: new THREE.MeshStandardMaterial({ color: '#c0392b', roughness: 0.5, metalness: 0.3 }),
      fridge: new THREE.MeshStandardMaterial({ color: '#e9e5dd', roughness: 0.35 }),
      couch: new THREE.MeshStandardMaterial({ color: '#4a2a1a', roughness: 0.7 }),
      simScreen: new THREE.MeshStandardMaterial({ color: '#0b0d10', emissive: '#7fa8d8', emissiveIntensity: 0.6 }),
      liquids: ['#7fb7c9', '#c9a24a', '#9fc4a0', '#d97757', '#7fb7c9', '#c9a24a'].map((c) => new THREE.MeshStandardMaterial({ color: c, roughness: 0.2, transparent: true, opacity: 0.85 })),
    }),
    [],
  )

  return (
    <group>
      {/* glossy epoxy floor and a painted lift bay */}
      <Box p={[16, 0.021, 0]} s={[7.9, 0.005, 17.9]} m={m.epoxy} cast={false} />
      {[
        [16, 2.6, 3.4, 0.06],
        [14.3, 5.6, 0.06, 6.0],
        [17.7, 5.6, 0.06, 6.0],
      ].map(([x, z, w, d]) => (
        <Box key={`${x}${z}`} p={[x, 0.027, z]} s={[w, 0.004, d]} m={m.lines} cast={false} />
      ))}

      {/* each role's station is marked out on the floor */}
      {[
        [12.25, 14.1, -9.0, -6.7],
        [15.0, 17.0, -8.9, -6.55],
        [18.05, 19.95, -9.0, -6.55],
        [15.1, 17.1, -5.4, -3.15],
      ].map(([x0, x1, z0, z1]) => (
        <group key={`${x0}${z0}`}>
          <Box p={[(x0 + x1) / 2, 0.027, z0 + 0.03]} s={[x1 - x0, 0.004, 0.05]} m={m.lines} cast={false} />
          <Box p={[(x0 + x1) / 2, 0.027, z1 - 0.03]} s={[x1 - x0, 0.004, 0.05]} m={m.lines} cast={false} />
          <Box p={[x0 + 0.03, 0.027, (z0 + z1) / 2]} s={[0.05, 0.004, z1 - z0]} m={m.lines} cast={false} />
          <Box p={[x1 - 0.03, 0.027, (z0 + z1) / 2]} s={[0.05, 0.004, z1 - z0]} m={m.lines} cast={false} />
        </group>
      ))}

      {/* UWAFT: the autonomous car up on a two-post lift, lidar bench beside it */}
      <Interactive {...it('uwaft')} label="An autonomous car with a lidar mount" sub="Pick up" ring={[16, 5.0, 2.4]}>
        {[14.55, 17.45].map((x) => (
          <group key={x}>
            <Box p={[x, 0, 5.0]} s={[0.32, 0.06, 0.6]} m={mats.steel} />
            <Box p={[x, 0, 5.0]} s={[0.22, 3.1, 0.3]} m={m.lift} />
            {[-1, 1].map((s) => (
              <Box key={s} p={[(x + 16) / 2, 1.18, 5.0 + s * 0.9]} s={[Math.abs(16 - x) + 0.1, 0.08, 0.12]} m={mats.steel} r={[0, s * 0.15 * (x < 16 ? 1 : -1), 0]} />
            ))}
          </group>
        ))}
        <Box p={[16, 3.1, 5.0]} s={[3.2, 0.14, 0.2]} m={m.lift} />
        <CrossoverCar lidar scale={0.85} position={[16, 0.95, 5.0]} rotation={[0, Math.PI / 2, 0]} />
        <Box p={[19.35, 0, 5.0]} s={[0.7, 0.9, 3.0]} m={mats.steel} />
        <Box p={[19.35, 0.9, 5.0]} s={[0.78, 0.06, 3.1]} m={mats.walnut} />
        <Cyl p={[19.35, 0.96, 4.1]} radius={0.13} h={0.16} m={mats.blackMatte} />
        <Cyl p={[19.35, 1.06, 4.1]} radius={0.135} h={0.04} m={mats.led} />
        <Box p={[19.3, 0.96, 4.9]} s={[0.08, 0.03, 0.5]} m={mats.steel} />
        <Box p={[19.45, 0.96, 4.9]} s={[0.08, 0.2, 0.08]} m={mats.steel} />
        <Box p={[19.35, 0.96, 5.8]} s={[0.24, 0.16, 0.3]} m={mats.carRed} />
      </Interactive>

      {/* Symcor: a server rack in the north-west corner */}
      <Interactive {...it('symcor')} label="A server rack and a security key" sub="Pick up" ring={[12.9, -8.1, 0.9]}>
        <Box p={[12.9, 0, -8.35]} s={[0.75, 2.1, 0.9]} m={mats.blackMatte} />
        {[0.25, 0.55, 0.85, 1.15, 1.45, 1.75].map((y, i) => (
          <group key={y}>
            <Box p={[12.9, y, -7.895]} s={[0.66, 0.2, 0.01]} m={mats.steel} cast={false} />
            <Box p={[12.75, y + 0.08, -7.885]} s={[0.22, 0.025, 0.005]} m={i % 3 === 1 ? mats.ledGreen : mats.led} cast={false} />
          </group>
        ))}
        <Box p={[13.08, 2.1, -8.2]} s={[0.06, 0.02, 0.14]} m={mats.brass} />
      </Interactive>

      {/* OmniaBio: a lab station of its own, north-centre */}
      <group position={[1.45, 0, 0.4]}>
        <Interactive {...it('omniabio')} label="A test-tube rack" sub="Pick up" ring={[14.55, -8.1, 0.9]}>
          {[0.15, 0.85].map((y) => (
            <Box key={y} p={[14.55, y, -8.3]} s={[1.1, 0.04, 0.6]} m={mats.steel} />
          ))}
          {[[-0.52, -0.27], [0.52, -0.27], [-0.52, 0.27], [0.52, 0.27]].map(([dx, dz]) => (
            <Box key={`${dx}${dz}`} p={[14.55 + dx, 0, -8.3 + dz]} s={[0.04, 0.89, 0.04]} m={mats.steel} />
          ))}
          <Box p={[14.55, 0.89, -8.3]} s={[0.8, 0.03, 0.22]} m={mats.whiteLab} />
          <Box p={[14.55, 1.08, -8.3]} s={[0.8, 0.02, 0.22]} m={mats.whiteLab} />
          {[14.25, 14.85].map((x) => (
            <Box key={x} p={[x, 0.89, -8.3]} s={[0.02, 0.2, 0.2]} m={mats.whiteLab} />
          ))}
          {m.liquids.map((liq, i) => {
            const x = 14.25 + i * 0.12
            return (
              <group key={i}>
                <Cyl p={[x, 0.92, -8.3]} radius={0.028} h={0.3} m={mats.glass} cast={false} />
                <Cyl p={[x, 0.92, -8.3]} radius={0.022} h={0.15} m={liq} cast={false} />
              </group>
            )
          })}
        </Interactive>
      </group>

      {/* PepsiCo, Data Analyst: a standing desk in the middle of the garage */}
      <group position={[-0.15, 0, 3.7]}>
        <Interactive {...it('pepsico-data')} label="A clipboard of SQL and charts" sub="Pick up" ring={[16.25, -7.9, 0.9]}>
          <Box p={[16.25, 0, -8.3]} s={[0.08, 1.05, 0.08]} m={mats.steel} />
          <Box p={[16.25, 0, -8.3]} s={[0.6, 0.03, 0.5]} m={mats.steel} />
          <Box p={[16.25, 1.05, -8.25]} s={[1.0, 0.04, 0.6]} m={mats.walnut} r={[0.25, 0, 0]} />
          <Box p={[16.2, 1.11, -8.2]} s={[0.3, 0.012, 0.4]} m={mats.blackMatte} r={[0.25, 0, 0]} />
          <Box p={[16.2, 1.12, -8.19]} s={[0.27, 0.004, 0.36]} m={m.paper} r={[0.25, 0, 0]} cast={false} />
          <Box p={[16.6, 1.11, -8.2]} s={[0.22, 0.01, 0.3]} m={m.paper} r={[0.25, 0.3, 0]} cast={false} />
        </Interactive>
      </group>

      {/* Tool chest: the toolkit, on the west wall by the pegboard */}
      <group position={[12.55, 0, -5.55]} rotation={[0, Math.PI / 2, 0]}>
        <group position={[-18.4, 0, 8.35]}>
        <Interactive {...it('toolkit')} label="A tool chest" sub="Pick up" ring={[18.4, -7.9, 0.9]}>
          <Box p={[18.4, 0, -8.35]} s={[1.3, 1.25, 0.6]} m={mats.carRed} />
          {[0.2, 0.42, 0.64, 0.86, 1.08].map((y) => (
            <Box key={y} p={[18.4, y, -8.04]} s={[1.18, 0.015, 0.01]} m={mats.steel} cast={false} />
          ))}
          <Box p={[18.4, 1.25, -8.35]} s={[1.34, 0.04, 0.64]} m={mats.blackMatte} />
        </Interactive>
        </group>
      </group>

      {/* PepsiCo, Software & Operations: the pallet in the north-east corner */}
      <group position={[0, 0, -2.4]}>
        <Interactive {...it('pepsico-ops')} label="A bag of chips" sub="Pick up" ring={[19.0, -5.4, 1.0]}>
          <Box p={[19.0, 0, -5.4]} s={[1.0, 0.04, 1.2]} m={m.pallet} />
          {[-0.35, 0, 0.35].map((dx) => (
            <Box key={dx} p={[19.0 + dx, 0.04, -5.4]} s={[0.12, 0.08, 1.2]} m={m.pallet} />
          ))}
          <Box p={[19.0, 0.12, -5.4]} s={[1.0, 0.04, 1.2]} m={m.pallet} />
          <Box p={[19.2, 0.16, -5.65]} s={[0.5, 0.45, 0.55]} m={m.carton} />
          <Box p={[19.2, 0.16, -5.1]} s={[0.5, 0.45, 0.5]} m={m.carton} />
          <Box p={[18.7, 0.16, -5.4]} s={[0.45, 0.4, 0.9]} m={m.carton} />
          <Box p={[19.2, 0.61, -5.6]} s={[0.45, 0.4, 0.5]} m={m.carton} />
          <ChipBag p={[18.75, 0.56, -5.3]} rot={[-0.3, -1.2, 0.1]} mats={mats} />
          <ChipBag p={[19.2, 0.61, -5.1]} rot={[0, -1.8, 0]} mats={mats} scale={0.9} />
          <ChipBag p={[19.2, 1.01, -5.6]} rot={[-1.2, 0, 0.6]} mats={mats} scale={0.85} />
        </Interactive>
      </group>

      {/* Training corner: rubber mat, bike on the wall, dumbbells, a bench */}
      <Box p={[13.45, 0.026, -3.0]} s={[2.3, 0.01, 3.2]} m={m.mat} cast={false} />
      <group>
        <group position={[12.25, 1.35, -3.3]} rotation={[0, Math.PI / 2, 0]}>
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
        <Box p={[12.12, 1.0, -3.3]} s={[0.06, 0.06, 1.4]} m={mats.steel} />
      </group>
      <group>
        <Box p={[14.1, 0, -1.9]} s={[1.4, 0.06, 0.5]} m={mats.steel} />
        {[-0.68, 0.68].map((dx) => (
          <Box key={dx} p={[14.1 + dx, 0, -1.9]} s={[0.05, 0.8, 0.5]} m={mats.steel} />
        ))}
        {[0.35, 0.65].map((y) => (
          <Box key={y} p={[14.1, y, -1.9]} s={[1.36, 0.03, 0.46]} m={mats.steel} />
        ))}
        {[-0.4, 0, 0.4].map((dx, i) =>
          [0.38, 0.68].map((y) => (
            <mesh key={`${dx}${y}`} position={[14.1 + dx, y + 0.08, -1.9]} castShadow>
              <cylinderGeometry args={[0.06 + i * 0.012, 0.06 + i * 0.012, 0.34, 14]} />
              <primitive object={mats.rubber} attach="material" />
            </mesh>
          )),
        )}
      </group>
      <Box p={[13.6, 0, -3.6]} s={[0.4, 0.42, 1.3]} m={mats.blackMatte} />
      <Box p={[13.6, 0.42, -3.6]} s={[0.42, 0.08, 1.32]} m={mats.leather} />

      {/* Hangout corner: worn leather couch, a tyre coffee table, a mini fridge */}
      <Box p={[19.2, 0, -1.3]} s={[0.95, 0.45, 2.8]} m={m.couch} />
      <Box p={[19.62, 0, -1.3]} s={[0.26, 0.9, 2.8]} m={m.couch} />
      {[-2.6, 0.0].map((z) => (
        <Box key={z} p={[19.2, 0, z]} s={[0.95, 0.65, 0.22]} m={m.couch} />
      ))}
      <mesh position={[17.9, 0.16, -1.3]} rotation={[Math.PI / 2, 0, 0]} material={mats.rubber} castShadow>
        <torusGeometry args={[0.36, 0.14, 12, 28]} />
      </mesh>
      <Cyl p={[17.9, 0.3, -1.3]} radius={0.46} h={0.02} m={mats.glass} cast={false} />
      <Box p={[19.45, 0, 1.0]} s={[0.6, 0.85, 0.6]} m={m.fridge} />
      <Box p={[19.13, 0.45, 1.15]} s={[0.02, 0.3, 0.04]} m={mats.steel} />
      {/* racing sim rig by the couch (scenery) */}
      <group>
        <group position={[13.9, 0, 2.4]} rotation={[0, Math.PI / 2, 0]}>
          <Box p={[0, 0, 0]} s={[0.7, 0.08, 1.7]} m={mats.steel} />
          <Box p={[0, 0.08, 0.35]} s={[0.55, 0.32, 0.6]} m={mats.blackMatte} />
          <Box p={[0, 0.4, 0.6]} s={[0.55, 0.62, 0.14]} m={mats.blackMatte} r={[-0.3, 0, 0]} />
          <Box p={[0, 0.58, 0.63]} s={[0.4, 0.4, 0.01]} m={mats.carRed} r={[-0.3, 0, 0]} cast={false} />
          <Box p={[0, 0.08, -0.45]} s={[0.08, 0.62, 0.08]} m={mats.steel} />
          <mesh position={[0, 0.78, -0.42]} rotation={[0.35, 0, 0]} material={mats.blackMatte}>
            <torusGeometry args={[0.16, 0.025, 10, 28]} />
          </mesh>
          <Box p={[0, 0.08, -0.75]} s={[0.4, 0.1, 0.2]} m={mats.blackMatte} r={[0.5, 0, 0]} />
          <Box p={[0, 0.55, -1.25]} s={[1.3, 0.75, 0.04]} m={mats.blackMatte} />
          <Box p={[0, 0.58, -1.225]} s={[1.24, 0.69, 0.004]} m={m.simScreen} cast={false} />
          <Box p={[0, 0, -1.25]} s={[0.1, 0.55, 0.1]} m={mats.steel} />
        </group>
      </group>
      {/* neon SM sign on the garage side of the Lounge wall */}
      <mesh position={[12.13, 2.0, 4.6]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[1.05, 1.25]} />
        <meshBasicMaterial map={logo} color="#ffb37a" transparent toneMapped={false} />
      </mesh>
      <pointLight position={[12.6, 2.0, 4.6]} intensity={3} distance={4} decay={1.6} color="#ff9a5a" />

      {/* pegboard, shelving and tyres */}
      <Box p={[12.12, 1.0, -6.4]} s={[0.04, 1.3, 2.2]} m={m.peg} />
      {[
        [1.25, -7.1, 0.5],
        [1.5, -6.7, 0.7],
        [1.2, -6.2, 0.45],
        [1.55, -5.8, 0.6],
      ].map(([y, z, h], i) => (
        <Box key={i} p={[12.16, y, z]} s={[0.02, h, 0.06]} m={i % 2 ? mats.carRed : mats.steel} cast={false} />
      ))}
      <Box p={[12.45, 0, 7.6]} s={[0.5, 1.8, 2.2]} m={mats.steel} />
      {[0.45, 0.95, 1.45].map((y) => (
        <group key={y}>
          {[6.95, 7.6, 8.25].map((z, i) => (
            <Box key={z} p={[12.5, y, z]} s={[0.4, 0.32, 0.5]} m={i === 1 ? mats.carRed : m.carton} cast={false} />
          ))}
        </group>
      ))}
      {[0, 0.24, 0.48].map((y) => (
        <mesh key={y} position={[19.3, y + 0.12, 8.2]} rotation={[Math.PI / 2, 0, 0]} material={mats.rubber} castShadow>
          <torusGeometry args={[0.32, 0.12, 12, 28]} />
        </mesh>
      ))}
    </group>
  )
}
