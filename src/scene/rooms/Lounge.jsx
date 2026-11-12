import { useMemo } from 'react'
import { useTexture } from '@react-three/drei'
import * as THREE from 'three'
import { Box, Cyl, FloorLamp, Plant, Rug } from '../primitives.jsx'
import { makeCarPrintTexture } from '../materials.js'
import Interactive from '../Interactive.jsx'

// ROOM 05, DEN: x[4, 12], z[-9, 9]. A home theater to the south (a big screen
// over the linear fireplace, a front sofa and a raised row of recliners) and a
// games corner to the north (PC battlestation, racing sim rig, arcade cabinet,
// the drinks cabinet and armchairs). Warm light, with a little RGB by the games.

function Recliner({ p, m }) {
  return (
    <group position={p}>
      <Box p={[0, 0, 0]} s={[0.95, 0.5, 0.9]} m={m.recliner} />
      <Box p={[0.38, 0.5, 0]} s={[0.22, 0.62, 0.9]} m={m.recliner} />
      {[-0.42, 0.42].map((z) => (
        <Box key={z} p={[0, 0.5, z]} s={[0.9, 0.16, 0.1]} m={m.recliner} />
      ))}
      <Box p={[-0.52, 0.2, 0]} s={[0.25, 0.12, 0.8]} m={m.recliner} r={[0, 0, 0.3]} />
    </group>
  )
}

export default function Lounge({ mats, ctx }) {
  const it = (id) => ({ id, enabled: ctx.active, hovered: ctx.hovered, selected: ctx.selected, onHover: ctx.onHover, onSelect: ctx.onSelect })
  const carPrint = useMemo(() => makeCarPrintTexture(), [])
  const photos = useTexture(['/residence/explore-lake.jpg', '/residence/explore-river.jpg', '/residence/den-screen.jpg'], (ts) => {
    ;(Array.isArray(ts) ? ts : [ts]).forEach((t) => (t.colorSpace = THREE.SRGBColorSpace))
  })
  const m = useMemo(
    () => ({
      recliner: new THREE.MeshStandardMaterial({ color: '#3b2419', roughness: 0.6 }),
      sofa: new THREE.MeshStandardMaterial({ color: '#8a7a68', roughness: 0.95 }),
      throw: new THREE.MeshStandardMaterial({ color: '#b8743f', roughness: 1 }),
      riser: new THREE.MeshStandardMaterial({ color: '#2a2320', roughness: 0.9 }),
      backlight: new THREE.MeshBasicMaterial({ color: '#ffb36b', transparent: true, opacity: 0.5, toneMapped: false }),
      rgbPurple: new THREE.MeshStandardMaterial({ color: '#130a1a', emissive: '#8a5cff', emissiveIntensity: 2.2, toneMapped: false }),
      rgbCyan: new THREE.MeshStandardMaterial({ color: '#06161a', emissive: '#4fd6e8', emissiveIntensity: 2, toneMapped: false }),
      monitor: new THREE.MeshStandardMaterial({ color: '#0b0d10', emissive: '#7fa8d8', emissiveIntensity: 0.6 }),
      arcade: new THREE.MeshStandardMaterial({ color: '#1d1f4a', roughness: 0.5 }),
      arcadeScreen: new THREE.MeshStandardMaterial({ color: '#05060a', emissive: '#7fcf98', emissiveIntensity: 0.9 }),
      popcorn: new THREE.MeshStandardMaterial({ color: '#a8261d', roughness: 0.45, metalness: 0.2 }),
      corn: new THREE.MeshStandardMaterial({ color: '#f5e3a8', roughness: 0.9 }),
      bottle: ['#5b3a2a', '#2f3b3a', '#7d6a4f', '#3a2e2a', '#8a7a62'].map((c) => new THREE.MeshStandardMaterial({ color: c, roughness: 0.2, metalness: 0.1 })),
    }),
    [],
  )

  return (
    <group>
      {/* ---------------- theater ---------------- */}
      <Rug p={[7.6, 0.02, 6.1]} s={[5.2, 5.0]} m={mats.rugIvory} />

      {/* big screen over the linear fireplace, with a warm backlight */}
      <mesh position={[4.1, 1.95, 6.1]} rotation={[0, Math.PI / 2, 0]} material={m.backlight}>
        <planeGeometry args={[3.5, 2.1]} />
      </mesh>
      <Box p={[4.14, 1.05, 6.1]} s={[0.06, 1.8, 3.2]} m={mats.blackMatte} />
      <mesh position={[4.18, 1.95, 6.1]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[3.08, 1.7]} />
        <meshStandardMaterial map={photos[2]} emissive="#ffffff" emissiveMap={photos[2]} emissiveIntensity={0.85} toneMapped={false} />
      </mesh>
      <Box p={[4.45, 0, 6.1]} s={[0.55, 0.55, 3.8]} m={mats.walnut} />
      <Box p={[4.73, 0.12, 6.1]} s={[0.02, 0.22, 2.2]} m={mats.fire} cast={false} />
      {/* console and two controllers on the media unit */}
      <Box p={[4.45, 0.55, 4.7]} s={[0.36, 0.08, 0.5]} m={mats.blackMatte} />
      <Box p={[4.45, 0.63, 4.7]} s={[0.3, 0.01, 0.02]} m={m.rgbCyan} cast={false} />
      {[7.4, 7.7].map((z) => (
        <Box key={z} p={[4.5, 0.55, z]} s={[0.12, 0.04, 0.18]} m={mats.blackMatte} r={[0, 0.3, 0]} />
      ))}

      {/* front-row sofa with a throw, low table with popcorn */}
      <Box p={[7.5, 0, 6.1]} s={[1.0, 0.44, 4.0]} m={m.sofa} />
      <Box p={[8.02, 0, 6.1]} s={[0.26, 0.86, 4.0]} m={m.sofa} />
      {[4.2, 8.0].map((z) => (
        <Box key={z} p={[7.6, 0, z]} s={[1.05, 0.62, 0.22]} m={m.sofa} />
      ))}
      <Box p={[7.45, 0.44, 5.0]} s={[0.9, 0.05, 0.7]} m={m.throw} r={[0, 0.1, 0]} />
      {[5.3, 6.1, 6.9].map((z) => (
        <Box key={z} p={[7.85, 0.44, z]} s={[0.18, 0.36, 0.5]} m={mats.linen} r={[0, 0, -0.25]} />
      ))}
      <Box p={[5.95, 0, 6.1]} s={[0.8, 0.34, 1.6]} m={mats.walnut} />
      <Cyl p={[5.95, 0.34, 5.8]} radius={0.16} h={0.12} m={m.corn} />
      <Box p={[5.95, 0.34, 6.5]} s={[0.12, 0.03, 0.22]} m={mats.blackMatte} />

      {/* raised second row of recliners */}
      <Box p={[10.4, 0, 6.1]} s={[2.0, 0.3, 4.8]} m={m.riser} />
      <Box p={[10.4, 0.3, 6.1]} s={[2.0, 0.01, 4.8]} m={mats.rugWarm} cast={false} />
      {[4.6, 6.1, 7.6].map((z) => (
        <Recliner key={z} p={[10.5, 0.3, z]} m={m} />
      ))}

      {/* popcorn cart in the corner */}
      <Box p={[11.45, 0, 8.4]} s={[0.6, 0.8, 0.5]} m={m.popcorn} />
      <Box p={[11.45, 0.8, 8.4]} s={[0.55, 0.55, 0.45]} m={mats.glass} cast={false} />
      <Box p={[11.45, 0.82, 8.4]} s={[0.5, 0.2, 0.4]} m={m.corn} />
      <Box p={[11.45, 1.35, 8.4]} s={[0.62, 0.08, 0.52]} m={m.popcorn} />

      {/* the phone on a little table by the sofa */}
      <Cyl p={[6.3, 0, 8.4]} radius={0.28} h={0.52} m={mats.walnut} />
      <Interactive {...it('contact')} label="A rotary phone" sub="Pick up" ring={[6.3, 8.4, 0.5]}>
        <Box p={[6.3, 0.52, 8.4]} s={[0.26, 0.1, 0.2]} m={mats.blackMatte} />
        <Cyl p={[6.3, 0.62, 8.44]} radius={0.07} h={0.01} m={mats.brass} />
        <Box p={[6.3, 0.65, 8.35]} s={[0.3, 0.05, 0.07]} m={mats.blackMatte} />
      </Interactive>

      {/* credenza with photographs, between theater and games */}
      <Interactive {...it('exploring')} label="Two photographs" sub="Pick up" ring={[8.2, 1.4, 1.3]}>
        <Box p={[8.2, 0, 1.4]} s={[2.4, 0.7, 0.45]} m={mats.walnut} />
        {[[-0.55, 0], [0.5, 1]].map(([dx, i]) => (
          <group key={i} position={[8.2 + dx, 0.7, 1.42]} rotation={[-0.12, 0, 0]}>
            <Box p={[0, 0, 0]} s={[0.78, 0.6, 0.03]} m={mats.blackMatte} />
            <mesh position={[0, 0.3, 0.017]}>
              <planeGeometry args={[0.7, 0.52]} />
              <meshStandardMaterial map={photos[i]} roughness={0.7} />
            </mesh>
          </group>
        ))}
      </Interactive>
      <Plant p={[11.4, 0, 2.2]} mats={mats} scale={1.1} />
      <Plant p={[4.7, 0, 3.5]} mats={mats} scale={0.9} />

      {/* ---------------- games ---------------- */}
      <Rug p={[7.8, 0.02, -5.0]} s={[5.6, 6.6]} m={mats.rugWarm} />

      {/* PC battlestation under the north glass */}
      <Box p={[6.0, 0.74, -8.4]} s={[2.4, 0.05, 0.8]} m={mats.walnut} />
      {[4.9, 7.1].map((x) => (
        <Box key={x} p={[x, 0, -8.4]} s={[0.06, 0.74, 0.7]} m={mats.steel} />
      ))}
      {[[5.55, 0.25], [6.45, -0.25]].map(([x, r]) => (
        <group key={x} position={[x, 0.79, -8.6]} rotation={[0, r, 0]}>
          <Box p={[0, 0, 0]} s={[0.16, 0.02, 0.12]} m={mats.steel} />
          <Box p={[0, 0, -0.02]} s={[0.03, 0.2, 0.03]} m={mats.steel} />
          <Box p={[0, 0.18, 0]} s={[0.78, 0.44, 0.03]} m={mats.blackMatte} />
          <Box p={[0, 0.2, 0.017]} s={[0.74, 0.4, 0.003]} m={m.monitor} cast={false} />
        </group>
      ))}
      <Box p={[5.99, 1.3, -8.72]} s={[1.9, 0.02, 0.02]} m={m.rgbPurple} cast={false} />
      <Box p={[7.45, 0, -8.4]} s={[0.3, 0.75, 0.6]} m={mats.blackMatte} />
      <Box p={[7.3, 0.1, -8.4]} s={[0.005, 0.5, 0.45]} m={m.rgbPurple} cast={false} />
      <Box p={[6.0, 0.79, -8.15]} s={[0.7, 0.02, 0.22]} m={mats.blackMatte} />
      {/* gaming chair */}
      <group position={[6.0, 0, -7.4]} rotation={[0, Math.PI, 0]}>
        <Cyl p={[0, 0, 0]} radius={0.3} h={0.04} m={mats.steel} />
        <Cyl p={[0, 0.04, 0]} radius={0.04} h={0.4} m={mats.steel} />
        <Box p={[0, 0.44, 0]} s={[0.56, 0.1, 0.55]} m={mats.blackMatte} />
        <Box p={[0, 0.54, -0.25]} s={[0.56, 0.85, 0.1]} m={mats.blackMatte} />
        <Box p={[0, 0.7, -0.19]} s={[0.4, 0.55, 0.01]} m={mats.carRed} cast={false} />
      </group>
      <pointLight position={[6.0, 1.6, -7.8]} intensity={2.5} distance={3.5} decay={1.6} color="#9a6cff" />

      {/* drinks cabinet on the west wall with the car print above it */}
      <Box p={[4.35, 0, -4.2]} s={[0.55, 0.95, 2.8]} m={mats.walnut} />
      <Box p={[4.35, 0.95, -4.2]} s={[0.59, 0.03, 2.84]} m={mats.brass} />
      {[-5.1, -4.8, -4.5, -3.7, -3.4].map((z, i) => (
        <Cyl key={z} p={[4.35, 0.98, z]} radius={0.05} h={0.28 + (i % 2) * 0.06} m={m.bottle[i]} />
      ))}
      <Box p={[4.1, 1.35, -4.2]} s={[0.04, 1.1, 1.8]} m={mats.brass} />
      <mesh position={[4.13, 1.9, -4.2]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[1.7, 1.0]} />
        <meshStandardMaterial map={carPrint} roughness={0.6} />
      </mesh>

      {/* armchairs around a small table */}
      {[[6.6, -4.3, 1.2], [6.6, -2.7, 1.9]].map(([x, z, r]) => (
        <group key={z} position={[x, 0, z]} rotation={[0, r, 0]}>
          <Box p={[0, 0, 0]} s={[0.9, 0.42, 0.85]} m={mats.leather} />
          <Box p={[0, 0.42, -0.34]} s={[0.9, 0.5, 0.18]} m={mats.leather} />
        </group>
      ))}
      <Cyl p={[7.5, 0, -3.5]} radius={0.3} h={0.5} m={mats.walnut} />

      {/* racing sim rig: the cars artifact */}
      <Interactive {...it('cars')} label="A racing sim rig" sub="Pick up" ring={[10.2, -4.6, 1.2]}>
        <group position={[10.2, 0, -4.6]} rotation={[0, Math.PI / 2, 0]}>
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
          <Box p={[0, 0.58, -1.225]} s={[1.24, 0.69, 0.004]} m={m.monitor} cast={false} />
          <Box p={[0, 0, -1.25]} s={[0.1, 0.55, 0.1]} m={mats.steel} />
        </group>
      </Interactive>

      {/* arcade cabinet in the corner: Invasion */}
      <Interactive {...it('arcade')} label="An arcade cabinet" sub="Pick up" ring={[11.2, -8.2, 0.9]}>
        <group position={[11.25, 0, -8.25]} rotation={[0, -0.6, 0]}>
          <Box p={[0, 0, 0]} s={[0.75, 1.0, 0.7]} m={m.arcade} />
          <Box p={[0, 1.0, -0.08]} s={[0.75, 0.8, 0.54]} m={m.arcade} />
          <Box p={[0, 1.8, -0.02]} s={[0.75, 0.22, 0.66]} m={m.arcade} />
          <Box p={[0, 1.83, 0.315]} s={[0.66, 0.16, 0.01]} m={m.rgbCyan} cast={false} />
          <Box p={[0, 1.12, 0.2]} s={[0.6, 0.48, 0.01]} m={m.arcadeScreen} r={[-0.25, 0, 0]} cast={false} />
          <Box p={[0, 0.98, 0.32]} s={[0.75, 0.05, 0.3]} m={mats.blackMatte} r={[0.3, 0, 0]} />
          {[-0.18, 0.05, 0.16].map((x, i) => (
            <Cyl key={x} p={[x, 1.02, 0.36]} radius={i ? 0.03 : 0.02} h={i ? 0.02 : 0.08} m={i ? mats.carRed : mats.blackMatte} />
          ))}
        </group>
      </Interactive>
      <pointLight position={[11.0, 1.8, -7.6]} intensity={2} distance={3} decay={1.6} color="#4fd6e8" />
      <FloorLamp p={[9.0, 0, -7.6]} mats={mats} />
    </group>
  )
}
