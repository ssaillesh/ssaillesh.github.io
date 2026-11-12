import { useMemo } from 'react'
import { useTexture } from '@react-three/drei'
import * as THREE from 'three'
import { Box, Cyl, FloorLamp, Plant, Rug, Stool } from '../primitives.jsx'
import { makeCarPrintTexture } from '../materials.js'
import Interactive from '../Interactive.jsx'

// ROOM 05, DEN: x[4, 12], z[-9, 9]. A home theater to the south (a big screen
// over the linear fireplace, a front sofa and a raised row of recliners) and an
// open kitchen to the north (kitchen run under the glass, a marble island with
// bar stools and the cast-iron pan, the drinks bar). Open plan, warm light.

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
      rgbCyan: new THREE.MeshStandardMaterial({ color: '#06161a', emissive: '#4fd6e8', emissiveIntensity: 2, toneMapped: false }),
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
      <group>
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
      </group>
      <Plant p={[11.4, 0, 2.2]} mats={mats} scale={1.1} />
      <Plant p={[4.7, 0, 3.5]} mats={mats} scale={0.9} />

      {/* ---------------- open kitchen ---------------- */}
      {/* kitchen run under the north glass: hob, oven, sink */}
      <Box p={[8.0, 0, -8.45]} s={[6.2, 0.9, 0.65]} m={mats.walnut} />
      <Box p={[8.0, 0.9, -8.45]} s={[6.24, 0.04, 0.69]} m={mats.marble} />
      <Box p={[6.3, 0.94, -8.45]} s={[0.7, 0.01, 0.48]} m={mats.blackMatte} cast={false} />
      {[6.1, 6.5].map((x) => (
        <Cyl key={x} p={[x, 0.95, -8.45]} radius={0.09} h={0.005} m={mats.steel} cast={false} />
      ))}
      <Box p={[6.3, 0.15, -8.12]} s={[0.66, 0.55, 0.01]} m={mats.blackMatte} cast={false} />
      <Box p={[6.3, 0.62, -8.11]} s={[0.5, 0.025, 0.02]} m={mats.steel} cast={false} />
      <Box p={[9.4, 0.92, -8.45]} s={[0.62, 0.02, 0.44]} m={mats.steel} cast={false} />
      <Box p={[9.4, 0.94, -8.68]} s={[0.04, 0.32, 0.04]} m={mats.steel} />
      <Box p={[9.4, 1.24, -8.6]} s={[0.04, 0.04, 0.2]} m={mats.steel} />
      {/* tall fridge and oven column on the garage wall */}
      <Box p={[11.6, 0, -7.4]} s={[0.7, 2.3, 1.9]} m={mats.walnut} />
      <Box p={[11.24, 1.2, -7.85]} s={[0.01, 0.6, 0.62]} m={mats.blackMatte} cast={false} />
      <Box p={[11.24, 0.3, -6.9]} s={[0.02, 1.6, 0.02]} m={mats.brass} cast={false} />

      {/* the island: marble waterfall, the pan on the hob, stools facing the theater */}
      <group>
        <Box p={[8.0, 0, -4.8]} s={[3.0, 0.9, 1.1]} m={mats.walnut} />
        <Box p={[8.0, 0.9, -4.8]} s={[3.1, 0.06, 1.2]} m={mats.marble} />
        {[-1, 1].map((s) => (
          <Box key={s} p={[8.0 + s * 1.53, 0, -4.8]} s={[0.06, 0.9, 1.2]} m={mats.marble} />
        ))}
        <Box p={[7.3, 0.96, -4.85]} s={[0.62, 0.01, 0.5]} m={mats.blackMatte} cast={false} />
        <Cyl p={[7.3, 0.97, -4.85]} radius={0.17} h={0.06} m={mats.blackMatte} />
        <Box p={[7.65, 0.99, -4.85]} s={[0.4, 0.03, 0.05]} m={mats.walnut} />
        <Box p={[8.6, 0.96, -4.7]} s={[0.5, 0.03, 0.32]} m={mats.walnut} />
        <Cyl p={[9.1, 0.96, -4.9]} radius={0.14} h={0.1} m={mats.stone} />
      </group>
      {[6.9, 7.65, 8.4, 9.15].map((x) => (
        <Stool key={x} p={[x, 0, -3.95]} mats={mats} />
      ))}
      {/* three glass pendants over the island */}
      {[7.1, 8.0, 8.9].map((x) => (
        <group key={x}>
          <Box p={[x, 2.25, -4.8]} s={[0.01, 1.15, 0.01]} m={mats.brass} cast={false} />
          <mesh position={[x, 2.15, -4.8]}>
            <sphereGeometry args={[0.13, 18, 12]} />
            <meshStandardMaterial color="#fff3df" emissive="#ffd39a" emissiveIntensity={1.4} transparent opacity={0.9} />
          </mesh>
        </group>
      ))}

      {/* drinks bar on the west wall with the car print above it */}
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
      <Plant p={[4.7, 0, -8.3]} mats={mats} />
      <FloorLamp p={[11.3, 0, -1.6]} mats={mats} />

      {/* ---- scenery (not pick-ups) ---- */}
      {/* a record console on the garage wall: turntable, two speakers, a crate of vinyl */}
      <Box p={[11.55, 0, -4.4]} s={[0.5, 0.7, 1.5]} m={mats.walnut} />
      <Box p={[11.55, 0.7, -4.55]} s={[0.4, 0.06, 0.42]} m={mats.blackMatte} />
      <Cyl p={[11.55, 0.76, -4.55]} radius={0.15} h={0.01} m={mats.blackMatte} />
      <Cyl p={[11.55, 0.77, -4.55]} radius={0.04} h={0.005} m={m.popcorn} />
      <Box p={[11.45, 0.77, -4.38]} s={[0.02, 0.02, 0.18]} m={mats.steel} r={[0, 0.4, 0]} />
      {[-5.35, -3.45].map((z) => (
        <group key={z}>
          <Box p={[11.55, 0, z]} s={[0.36, 1.05, 0.36]} m={mats.blackMatte} />
          <Cyl p={[11.36, 0.72, z]} radius={0.11} h={0.01} m={mats.steel} r={[0, 0, Math.PI / 2]} />
          <Cyl p={[11.36, 0.32, z]} radius={0.07} h={0.01} m={mats.steel} r={[0, 0, Math.PI / 2]} />
        </group>
      ))}
      {[0, 1, 2, 3, 4].map((i) => (
        <Box key={i} p={[11.55, 0.08, -4.9 + i * 0.07]} s={[0.32, 0.32, 0.012]} m={m.bottle[i]} cast={false} />
      ))}
    </group>
  )
}
