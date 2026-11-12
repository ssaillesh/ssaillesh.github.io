import { useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, Lightformer } from '@react-three/drei'
import * as THREE from 'three'

// The 3D unlock: dial → three tumblers → bolts retract → wheel spins →
// door swings open on its hinge while the camera moves through.
// Timeline (seconds). `onStep` fires as each beat is reached.
const T = { dial: [0.3, 1.0, 1.7, 2.4], bolts: [2.5, 3.0], wheel: [3.0, 3.6], door: [3.7, 5.0], done: 5.2 }
const ANGLES = [0, -2.4, 3.7, 0.84]
const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)
const clamp01 = (x) => Math.min(1, Math.max(0, x))
const span = (t, [a, b]) => clamp01((t - a) / (b - a))

function dialTexture() {
  const c = document.createElement('canvas')
  c.width = c.height = 512
  const g = c.getContext('2d')
  const r = 256
  const grd = g.createRadialGradient(r * 0.8, r * 0.7, 30, r, r, r)
  grd.addColorStop(0, '#e3e5e8')
  grd.addColorStop(1, '#8a8e93')
  g.fillStyle = grd
  g.fillRect(0, 0, 512, 512)
  g.translate(r, r)
  for (let i = 0; i < 100; i++) {
    g.save()
    g.rotate((i / 100) * Math.PI * 2)
    g.fillStyle = '#2a2c2f'
    g.fillRect(-1.5, -r + 14, 3, i % 10 === 0 ? 34 : i % 5 === 0 ? 24 : 14)
    if (i % 10 === 0) {
      g.font = '600 30px JetBrains Mono, monospace'
      g.textAlign = 'center'
      g.fillText(String(i), 0, -r + 82)
    }
    g.restore()
  }
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  return t
}

function Door({ onStep, onDone }) {
  const hinge = useRef()
  const dial = useRef()
  const wheel = useRef()
  const bolts = useRef([])
  const leds = useRef([])
  const lamp = useRef()
  const glow = useRef()
  const fired = useRef(new Set())
  const start = useRef(null)

  const m = useMemo(
    () => ({
      steel: new THREE.MeshStandardMaterial({ color: '#6c7074', metalness: 0.9, roughness: 0.3 }),
      face: new THREE.MeshStandardMaterial({ color: '#7f8388', metalness: 0.92, roughness: 0.22 }),
      chrome: new THREE.MeshStandardMaterial({ color: '#c3c6ca', metalness: 1, roughness: 0.15 }),
      dark: new THREE.MeshStandardMaterial({ color: '#232527', metalness: 0.6, roughness: 0.5 }),
      brass: new THREE.MeshStandardMaterial({ color: '#c6a96c', metalness: 1, roughness: 0.25 }),
      dial: new THREE.MeshStandardMaterial({ map: dialTexture(), metalness: 0.7, roughness: 0.3 }),
      glowInside: new THREE.MeshBasicMaterial({ color: '#ffcf8a', transparent: true, opacity: 0.0 }),
    }),
    [],
  )
  const boltAngles = useMemo(() => Array.from({ length: 16 }, (_, i) => (i / 16) * Math.PI * 2), [])

  // run a beat exactly once
  const fire = (key, step, effect) => {
    if (fired.current.has(key)) return
    fired.current.add(key)
    effect?.()
    if (step) onStep?.(step)
  }

  useFrame((state) => {
    if (start.current == null) start.current = state.clock.elapsedTime
    // window.__UNLOCK_T freezes the timeline at a moment (used for screenshots)
    const t = typeof window.__UNLOCK_T === 'number' ? window.__UNLOCK_T : state.clock.elapsedTime - start.current

    // dial: three turns to the combination, a tumbler clicks after each
    let a = ANGLES[0]
    for (let i = 0; i < 3; i++) {
      const p = ease(span(t, [T.dial[i], T.dial[i + 1]]))
      if (p > 0) a = THREE.MathUtils.lerp(ANGLES[i], ANGLES[i + 1], p)
      if (t >= T.dial[i + 1])
        fire(`tumbler${i}`, i + 1, () => {
          leds.current[i]?.color.set('#7fcf98')
          leds.current[i]?.emissive.set('#7fcf98')
        })
    }
    if (dial.current) dial.current.rotation.z = a

    // bolts slide back into the door
    const b = ease(span(t, T.bolts))
    bolts.current.forEach((mesh, i) => {
      if (!mesh) return
      const r = THREE.MathUtils.lerp(2.12, 1.78, b)
      mesh.position.set(Math.cos(boltAngles[i]) * r, Math.sin(boltAngles[i]) * r, 0)
    })
    if (t >= T.bolts[0]) fire('bolts', 4)

    // the wheel spins a turn and a half
    const w = ease(span(t, T.wheel))
    if (wheel.current) wheel.current.rotation.z = -w * Math.PI * 3
    if (t >= T.wheel[1])
      fire('granted', 5, () => {
        lamp.current?.color.set('#7fcf98')
        lamp.current?.emissive.set('#7fcf98')
      })

    // the door swings open and the camera moves through
    const d = ease(span(t, T.door))
    if (hinge.current) hinge.current.rotation.y = -d * 1.85
    if (glow.current) glow.current.material.opacity = 0.15 + d * 0.85
    state.camera.position.set(THREE.MathUtils.lerp(0, -0.4, d), THREE.MathUtils.lerp(0.15, 0, d), THREE.MathUtils.lerp(7.2, 1.2, d * d))
    state.camera.lookAt(0, 0, -1)
    if (t >= T.done) fire('done', 6, () => onDone?.())
  })

  return (
    <group>
      {/* the wall, the frame and the lit vault behind */}
      <mesh position={[0, 0, -0.5]} material={m.dark}>
        <planeGeometry args={[30, 20]} />
      </mesh>
      <mesh ref={glow} position={[0, 0, -0.45]} material={m.glowInside}>
        <circleGeometry args={[2.2, 64]} />
      </mesh>
      <mesh position={[0, 0, 0]} material={m.steel}>
        <torusGeometry args={[2.32, 0.22, 24, 96]} />
      </mesh>
      {/* tumbler indicators and status lamp on the frame */}
      {[-0.5, 0, 0.5].map((x, i) => (
        <mesh key={x} position={[x, 2.75, 0.1]}>
          <sphereGeometry args={[0.07, 20, 12]} />
          <meshStandardMaterial ref={(r) => (leds.current[i] = r)} color="#3a3c3f" emissive="#000000" emissiveIntensity={1.6} />
        </mesh>
      ))}
      <mesh position={[0, -2.75, 0.1]}>
        <sphereGeometry args={[0.09, 20, 12]} />
        <meshStandardMaterial ref={lamp} color="#d97757" emissive="#d97757" emissiveIntensity={0.8} />
      </mesh>

      {/* hinge on the right edge */}
      <group ref={hinge} position={[2.1, 0, 0.15]}>
        <group position={[-2.1, 0, 0]}>
          <mesh rotation={[Math.PI / 2, 0, 0]} material={m.steel} castShadow>
            <cylinderGeometry args={[2.05, 2.05, 0.5, 96]} />
          </mesh>
          <mesh position={[0, 0, 0.26]} rotation={[Math.PI / 2, 0, 0]} material={m.face}>
            <cylinderGeometry args={[1.75, 1.75, 0.04, 96]} />
          </mesh>
          <mesh position={[0, 0, 0.28]} material={m.dark}>
            <torusGeometry args={[1.35, 0.04, 12, 96]} />
          </mesh>
          {boltAngles.map((ang, i) => (
            <mesh key={ang} ref={(r) => (bolts.current[i] = r)} position={[Math.cos(ang) * 2.12, Math.sin(ang) * 2.12, 0]} rotation={[0, 0, ang + Math.PI / 2]} material={m.chrome}>
              <cylinderGeometry args={[0.09, 0.09, 0.42, 16]} />
            </mesh>
          ))}
          {/* combination dial */}
          <group position={[0, 0.78, 0.3]}>
            <mesh rotation={[Math.PI / 2, 0, 0]} material={m.chrome}>
              <cylinderGeometry args={[0.52, 0.55, 0.1, 64]} />
            </mesh>
            <group ref={dial}>
              <mesh position={[0, 0, 0.056]} material={m.dial}>
                <circleGeometry args={[0.48, 64]} />
              </mesh>
              <mesh position={[0, 0, 0.09]} rotation={[Math.PI / 2, 0, 0]} material={m.dark}>
                <cylinderGeometry args={[0.16, 0.16, 0.08, 32]} />
              </mesh>
            </group>
            <mesh position={[0, 0.6, 0.06]} rotation={[0, 0, Math.PI]} material={m.brass}>
              <coneGeometry args={[0.06, 0.12, 3]} />
            </mesh>
          </group>
          {/* spoked wheel */}
          <group ref={wheel} position={[0, -0.6, 0.34]}>
            <mesh material={m.chrome}>
              <torusGeometry args={[0.62, 0.05, 16, 64]} />
            </mesh>
            {[0, Math.PI / 3, (2 * Math.PI) / 3].map((r) => (
              <mesh key={r} rotation={[0, 0, r]} material={m.chrome}>
                <boxGeometry args={[1.24, 0.06, 0.06]} />
              </mesh>
            ))}
            <mesh rotation={[Math.PI / 2, 0, 0]} material={m.brass}>
              <cylinderGeometry args={[0.14, 0.14, 0.14, 24]} />
            </mesh>
          </group>
        </group>
        {[-0.9, 0.9].map((y) => (
          <mesh key={y} position={[0.05, y, -0.05]} material={m.chrome}>
            <cylinderGeometry args={[0.12, 0.12, 0.55, 20]} />
          </mesh>
        ))}
      </group>
    </group>
  )
}

export default function UnlockScene({ onStep, onDone }) {
  return (
    <Canvas dpr={[1, 1.75]} camera={{ position: [0, 0.15, 7.2], fov: 38 }} gl={{ antialias: true }}>
      <color attach="background" args={['#0b0c0d']} />
      <hemisphereLight args={['#dfe6ee', '#1a1512', 0.5]} />
      <spotLight position={[3, 5, 8]} angle={0.5} penumbra={0.6} intensity={120} decay={1.6} color="#fff1dc" />
      <pointLight position={[0, 0, -0.2]} intensity={12} distance={6} color="#ffc27a" />
      <Environment resolution={256} frames={1}>
        <Lightformer form="rect" intensity={2.4} color="#fff1dc" position={[0, 4, 4]} scale={[10, 3, 1]} />
        <Lightformer form="rect" intensity={1.2} color="#e8a35a" position={[-5, 0, 2]} rotation-y={Math.PI / 2} scale={[6, 5, 1]} />
        <Lightformer form="ring" intensity={1.6} color="#ffffff" position={[2, 1, 6]} scale={2} />
      </Environment>
      <Door onStep={onStep} onDone={onDone} />
    </Canvas>
  )
}
