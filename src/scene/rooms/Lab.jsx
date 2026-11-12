import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { Box, Cyl, Plant, Stool } from '../primitives.jsx'
import Interactive from '../Interactive.jsx'

// ROOM 06, LAB: x[-12, -4], z[-9, 1]. A robotics lab: a workstation bench under
// the north glass, a robot arm on a pedestal, a 3D printer, a competition test
// table with the autonomous robot (2nd place), and the robotics trophy on a
// shelf on the west wall.

const reduceMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

// The competition field: black mat, white tape lines and a start box.
function fieldTexture() {
  const c = document.createElement('canvas')
  c.width = 512
  c.height = 512
  const g = c.getContext('2d')
  g.fillStyle = '#121314'
  g.fillRect(0, 0, 512, 512)
  g.strokeStyle = '#e9e5dc'
  g.lineWidth = 10
  g.strokeRect(24, 24, 464, 464)
  g.beginPath()
  g.moveTo(80, 430)
  g.bezierCurveTo(80, 220, 260, 340, 260, 180)
  g.bezierCurveTo(260, 70, 430, 90, 430, 250)
  g.lineTo(430, 430)
  g.stroke()
  g.fillStyle = '#c6a96c'
  g.fillRect(40, 400, 80, 70)
  g.fillStyle = '#2e9e5b'
  g.beginPath()
  g.arc(430, 250, 22, 0, Math.PI * 2)
  g.fill()
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  return t
}

// A six-axis arm that slowly works through a pick-and-place loop.
function RobotArm({ p, m }) {
  const base = useRef()
  const shoulder = useRef()
  const elbow = useRef()
  const wrist = useRef()
  useFrame((state) => {
    if (reduceMotion || !base.current) return
    const t = state.clock.elapsedTime * 0.5
    base.current.rotation.y = Math.sin(t) * 0.9
    shoulder.current.rotation.z = -0.35 + Math.sin(t * 1.3) * 0.25
    elbow.current.rotation.z = 0.9 + Math.sin(t * 1.3 + 1) * 0.3
    wrist.current.rotation.z = -0.5 + Math.sin(t * 2) * 0.3
  })
  return (
    <group position={p}>
      <Box p={[0, 0, 0]} s={[0.6, 0.5, 0.6]} m={m.dark} />
      <group ref={base} position={[0, 0.5, 0]}>
        <Cyl p={[0, 0, 0]} radius={0.22} h={0.18} m={m.orange} />
        <group ref={shoulder} position={[0, 0.25, 0]}>
          <mesh position={[0, 0.38, 0]} material={m.orange} castShadow>
            <boxGeometry args={[0.16, 0.8, 0.16]} />
          </mesh>
          <mesh rotation={[Math.PI / 2, 0, 0]} material={m.dark}>
            <cylinderGeometry args={[0.12, 0.12, 0.24, 18]} />
          </mesh>
          <group ref={elbow} position={[0, 0.76, 0]}>
            <mesh rotation={[Math.PI / 2, 0, 0]} material={m.dark}>
              <cylinderGeometry args={[0.1, 0.1, 0.22, 18]} />
            </mesh>
            <mesh position={[0.3, 0, 0]} material={m.orange} castShadow>
              <boxGeometry args={[0.62, 0.13, 0.13]} />
            </mesh>
            <group ref={wrist} position={[0.6, 0, 0]}>
              <mesh rotation={[Math.PI / 2, 0, 0]} material={m.dark}>
                <cylinderGeometry args={[0.07, 0.07, 0.16, 14]} />
              </mesh>
              <mesh position={[0.1, -0.06, 0]} material={m.steel}>
                <boxGeometry args={[0.08, 0.14, 0.12]} />
              </mesh>
              {[-0.04, 0.04].map((z) => (
                <mesh key={z} position={[0.13, -0.18, z]} material={m.steel}>
                  <boxGeometry args={[0.02, 0.12, 0.02]} />
                </mesh>
              ))}
            </group>
          </group>
        </group>
      </group>
    </group>
  )
}

// A 3D printer: frame, bed, a part half printed and a head that moves.
function Printer({ p, m }) {
  const head = useRef()
  useFrame((state) => {
    if (reduceMotion || !head.current) return
    const t = state.clock.elapsedTime
    head.current.position.x = Math.sin(t * 2.1) * 0.14
    head.current.position.z = Math.cos(t * 1.7) * 0.12
  })
  return (
    <group position={p}>
      {[[-0.25, -0.25], [0.25, -0.25], [-0.25, 0.25], [0.25, 0.25]].map(([x, z]) => (
        <Box key={`${x}${z}`} p={[x, 0, z]} s={[0.03, 0.62, 0.03]} m={m.dark} />
      ))}
      <Box p={[0, 0.6, 0]} s={[0.56, 0.03, 0.56]} m={m.dark} />
      <Box p={[0, 0.08, 0]} s={[0.46, 0.02, 0.46]} m={m.steel} />
      <Cyl p={[0.02, 0.1, -0.02]} radius={0.07} h={0.1} m={m.orange} />
      <group ref={head} position={[0, 0.3, 0]}>
        <Box p={[0, 0, 0]} s={[0.1, 0.08, 0.1]} m={m.dark} />
        <mesh position={[0, -0.03, 0]} material={m.steel}>
          <coneGeometry args={[0.02, 0.05, 10]} />
        </mesh>
      </group>
      <Box p={[0, 0.27, -0.26]} s={[0.5, 0.02, 0.02]} m={m.steel} />
    </group>
  )
}

export default function Lab({ mats, ctx }) {
  const it = (id) => ({ id, enabled: ctx.active, hovered: ctx.hovered, selected: ctx.selected, onHover: ctx.onHover, onSelect: ctx.onSelect })
  const m = useMemo(
    () => ({
      orange: new THREE.MeshStandardMaterial({ color: '#d9682b', roughness: 0.4, metalness: 0.2 }),
      dark: new THREE.MeshStandardMaterial({ color: '#232527', roughness: 0.55, metalness: 0.4 }),
      steel: mats.steel,
      epoxy: new THREE.MeshStandardMaterial({ color: '#4a4d51', roughness: 0.35, metalness: 0.1 }),
      field: new THREE.MeshStandardMaterial({ map: fieldTexture(), roughness: 0.9 }),
      monitor: new THREE.MeshStandardMaterial({ color: '#0b0d10', emissive: '#7fa8d8', emissiveIntensity: 0.6 }),
      rgb: new THREE.MeshStandardMaterial({ color: '#130a1a', emissive: '#8a5cff', emissiveIntensity: 2.2, toneMapped: false }),
      led: new THREE.MeshStandardMaterial({ color: '#0a1a10', emissive: '#4ee08a', emissiveIntensity: 2, toneMapped: false }),
      trophy: new THREE.MeshStandardMaterial({ color: '#e0b552', metalness: 1, roughness: 0.2 }),
      bins: ['#c0392b', '#2f6fb5', '#e0b552', '#3a8f5b'].map((c) => new THREE.MeshStandardMaterial({ color: c, roughness: 0.6 })),
    }),
    [mats.steel],
  )

  return (
    <group>
      {/* epoxy work floor */}
      <Box p={[-8.0, 0.012, -4.0]} s={[7.6, 0.01, 9.6]} m={m.epoxy} cast={false} />

      {/* workstation bench under the north glass: two monitors and a tower */}
      <Box p={[-8.6, 0.88, -8.45]} s={[5.6, 0.05, 0.8]} m={mats.walnut} />
      {[-11.2, -6.0].map((x) => (
        <Box key={x} p={[x, 0, -8.45]} s={[0.06, 0.88, 0.7]} m={mats.steel} />
      ))}
      {[[-10.0, 0.25], [-9.1, -0.25]].map(([x, r]) => (
        <group key={x} position={[x, 0.93, -8.65]} rotation={[0, r, 0]}>
          <Box p={[0, 0, 0]} s={[0.16, 0.02, 0.12]} m={mats.steel} />
          <Box p={[0, 0, -0.02]} s={[0.03, 0.2, 0.03]} m={mats.steel} />
          <Box p={[0, 0.18, 0]} s={[0.78, 0.44, 0.03]} m={mats.blackMatte} />
          <Box p={[0, 0.2, 0.017]} s={[0.74, 0.4, 0.003]} m={m.monitor} cast={false} />
        </group>
      ))}
      <Box p={[-11.6, 0, -8.4]} s={[0.3, 0.75, 0.6]} m={mats.blackMatte} />
      <Box p={[-11.44, 0.1, -8.4]} s={[0.005, 0.5, 0.45]} m={m.rgb} cast={false} />
      {/* soldering station and parts bins */}
      <Box p={[-7.6, 0.93, -8.5]} s={[0.3, 0.12, 0.22]} m={m.dark} />
      <Box p={[-7.45, 0.98, -8.45]} s={[0.015, 0.2, 0.015]} m={mats.steel} r={[0, 0, -0.6]} />
      {[0, 1, 2, 3].map((i) => (
        <Box key={i} p={[-6.7, 0.93 + Math.floor(i / 2) * 0.16, -8.6 + (i % 2) * 0.24]} s={[0.5, 0.14, 0.2]} m={m.bins[i]} />
      ))}
      <Stool p={[-9.5, 0, -7.6]} mats={mats} />

      {/* robot arm on its pedestal, in a taped safety square */}
      <Box p={[-10.4, 0.018, -5.2]} s={[1.9, 0.004, 1.9]} m={m.bins[2]} cast={false} />
      <Box p={[-10.4, 0.02, -5.2]} s={[1.75, 0.004, 1.75]} m={m.epoxy} cast={false} />
      <RobotArm p={[-10.4, 0, -5.2]} m={m} />

      {/* 3D printer on a side bench by the east wall */}
      <Box p={[-4.7, 0, -6.2]} s={[0.8, 0.8, 1.4]} m={mats.walnut} />
      <Printer p={[-4.7, 0.8, -6.5]} m={m} />
      <Box p={[-4.7, 0.8, -5.75]} s={[0.4, 0.04, 0.3]} m={m.orange} />

      {/* the competition test table and the robot: 2nd place, autonomous robotics */}
      <Interactive {...it('robotics-second')} label="An autonomous competition robot" sub="Pick up" ring={[-7.6, -3.6, 1.6]}>
        <Box p={[-7.6, 0, -3.6]} s={[1.9, 0.82, 1.9]} m={mats.walnut} />
        <mesh position={[-7.6, 0.825, -3.6]} rotation={[-Math.PI / 2, 0, 0]} material={m.field} receiveShadow>
          <planeGeometry args={[1.8, 1.8]} />
        </mesh>
        <group position={[-7.25, 0.83, -3.35]} rotation={[0, 0.7, 0]}>
          <Box p={[0, 0.05, 0]} s={[0.34, 0.09, 0.28]} m={m.dark} />
          <Box p={[0, 0.14, -0.02]} s={[0.22, 0.07, 0.18]} m={m.orange} />
          {[[-0.13, -0.15], [0.13, -0.15], [-0.13, 0.15], [0.13, 0.15]].map(([x, z]) => (
            <mesh key={`${x}${z}`} position={[x, 0.05, z]} rotation={[Math.PI / 2, 0, 0]} material={mats.blackMatte}>
              <cylinderGeometry args={[0.05, 0.05, 0.035, 16]} />
            </mesh>
          ))}
          {[-0.05, 0.05].map((x) => (
            <mesh key={x} position={[x, 0.12, 0.15]} rotation={[Math.PI / 2, 0, 0]} material={mats.steel}>
              <cylinderGeometry args={[0.025, 0.025, 0.03, 14]} />
            </mesh>
          ))}
          <Box p={[0.07, 0.18, -0.08]} s={[0.03, 0.03, 0.03]} m={m.led} cast={false} />
        </group>
        {/* the silver medal it won, leaning on its stand */}
        <group position={[-8.2, 0.83, -4.15]}>
          <Box p={[0, 0, 0]} s={[0.2, 0.03, 0.12]} m={m.dark} />
          <mesh position={[0, 0.13, 0]} rotation={[-0.2, 0, 0]} material={mats.steel}>
            <cylinderGeometry args={[0.09, 0.09, 0.015, 28]} />
          </mesh>
        </group>
      </Interactive>
      <pointLight position={[-7.6, 2.4, -3.6]} intensity={3} distance={3.5} decay={1.6} color="#f0f3ff" />

      {/* robotics trophy on a lit shelf on the west wall */}
      <Interactive {...it('robotics-excellence')} label="A robotics trophy" sub="Pick up" ring={[-11.2, -1.6, 0.9]}>
        <Box p={[-11.75, 1.25, -1.6]} s={[0.4, 0.05, 1.4]} m={mats.walnut} />
        <Box p={[-11.72, 1.3, -1.6]} s={[0.16, 0.08, 0.16]} m={m.dark} />
        <Cyl p={[-11.72, 1.38, -1.6]} radius={0.03} h={0.18} m={m.trophy} />
        <mesh position={[-11.72, 1.66, -1.6]} material={m.trophy} castShadow>
          <cylinderGeometry args={[0.13, 0.05, 0.2, 24]} />
        </mesh>
        {[-1, 1].map((s) => (
          <mesh key={s} position={[-11.72, 1.66, -1.6 + s * 0.15]} rotation={[Math.PI / 2, 0, 0]} material={m.trophy}>
            <torusGeometry args={[0.05, 0.012, 8, 18, Math.PI]} />
          </mesh>
        ))}
        <Box p={[-11.97, 1.28, -1.6]} s={[0.01, 0.01, 1.3]} m={m.led} cast={false} />
      </Interactive>
      <Plant p={[-11.4, 0, 0.3]} mats={mats} scale={1.1} />
    </group>
  )
}
