import { Suspense, useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { ContactShadows, Environment, Lightformer, PresentationControls } from '@react-three/drei'
import * as THREE from 'three'
import { INSPECT } from '../inspect/registry.js'
import { labelTexture } from '../inspect/textures.js'

const reduceMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

// A walnut display cabinet seen from the front: 3 columns × 2 rows of lit
// glass compartments. Each compartment holds the award's close-up model.
const COLS = 3
const CELL_W = 2.1
const CELL_H = 2.05
const cellPos = (i) => {
  const c = i % COLS
  const r = Math.floor(i / COLS)
  return [(c - 1) * CELL_W, (r === 0 ? 1 : -1) * (CELL_H / 2), 0]
}

// A gentle sway rather than a full spin, so medals and frames keep their faces to the visitor.
function Turntable({ active, children, phase = 0 }) {
  const ref = useRef()
  useFrame((state) => {
    if (!ref.current || reduceMotion) return
    ref.current.rotation.y = Math.sin(state.clock.elapsedTime * (active ? 0.35 : 0.6) + phase) * (active ? 0.25 : 0.45)
  })
  return <group ref={ref}>{children}</group>
}

function Compartment({ item, i, hovered, selected, onHover, onSelect, mats }) {
  const [x, y] = cellPos(i)
  const strip = useRef()
  const { Model } = INSPECT[item.id]
  const plaque = useMemo(
    () => labelTexture({ key: `plaque-${item.id}`, w: 1024, h: 160, bg: '#c6a96c', lines: [{ text: item.plaque, size: item.plaque.length > 26 ? 42 : 56, font: 'sans', weight: 600, color: '#2a2118', spacing: 3 }] }),
    [item],
  )
  const lit = hovered === item.id || selected === item.id
  useFrame((_, dt) => {
    if (strip.current) strip.current.emissiveIntensity = THREE.MathUtils.damp(strip.current.emissiveIntensity, lit ? 3.2 : selected && selected !== item.id ? 0.4 : 1.6, 8, dt)
  })
  return (
    <group position={[x, y, 0]}>
      {/* back panel and floor of the compartment */}
      <mesh position={[0, 0, -0.62]} material={mats.velvet}>
        <planeGeometry args={[CELL_W - 0.12, CELL_H - 0.12]} />
      </mesh>
      <mesh position={[0, -CELL_H / 2 + 0.1, 0]} rotation={[-Math.PI / 2, 0, 0]} material={mats.velvet}>
        <planeGeometry args={[CELL_W - 0.12, 1.24]} />
      </mesh>
      {/* LED strip */}
      <mesh position={[0, CELL_H / 2 - 0.09, 0.3]}>
        <boxGeometry args={[CELL_W - 0.3, 0.03, 0.05]} />
        <meshStandardMaterial ref={strip} color="#2a2118" emissive="#ffd59a" emissiveIntensity={1.6} />
      </mesh>
      <pointLight position={[0, CELL_H / 2 - 0.25, 0.4]} intensity={lit ? 4 : 2} distance={2.6} decay={1.5} color="#ffd9a8" />
      {/* the award, small enough to sit on its plinth */}
      <group position={[0, -0.08, 0]} scale={0.46}>
        <PresentationControls enabled={selected === item.id} global={false} snap polar={[-0.4, 0.4]} azimuth={[-1.2, 1.2]}>
          <Turntable active={selected === item.id} phase={i * 1.3}>
            <Suspense fallback={null}>
              <Model />
            </Suspense>
          </Turntable>
        </PresentationControls>
      </group>
      {/* brass plaque */}
      <mesh position={[0, -CELL_H / 2 + 0.2, 0.56]}>
        <planeGeometry args={[1.5, 0.22]} />
        <meshStandardMaterial map={plaque} metalness={0.7} roughness={0.3} />
      </mesh>
      {/* glass front and hit area */}
      <mesh
        position={[0, 0, 0.62]}
        onPointerOver={(e) => {
          e.stopPropagation()
          onHover(item.id)
          document.body.style.cursor = 'pointer'
        }}
        onPointerOut={() => {
          onHover(null)
          document.body.style.cursor = ''
        }}
        onClick={(e) => {
          e.stopPropagation()
          onSelect(item.id)
        }}
      >
        <planeGeometry args={[CELL_W - 0.12, CELL_H - 0.12]} />
        <meshPhysicalMaterial color="#e6eef2" roughness={0.04} transparent opacity={selected === item.id ? 0.02 : 0.08} depthWrite={false} />
      </mesh>
    </group>
  )
}

function Carcass({ mats }) {
  const W = COLS * CELL_W + 0.3
  const H = 2 * CELL_H + 0.3
  return (
    <group>
      <mesh position={[0, 0, -0.7]} material={mats.walnut}>
        <boxGeometry args={[W, H, 0.12]} />
      </mesh>
      {[-1, 1].map((s) => (
        <mesh key={`v${s}`} position={[s * (W / 2 - 0.07), 0, 0]} material={mats.walnut} castShadow>
          <boxGeometry args={[0.14, H, 1.45]} />
        </mesh>
      ))}
      {[-1, 1].map((s) => (
        <mesh key={`v2${s}`} position={[s * (CELL_W / 2), 0, 0]} material={mats.walnut}>
          <boxGeometry args={[0.06, H - 0.2, 1.4]} />
        </mesh>
      ))}
      {[H / 2 - 0.07, 0, -H / 2 + 0.07].map((y) => (
        <mesh key={y} position={[0, y, 0]} material={mats.walnut} castShadow>
          <boxGeometry args={[W, 0.14, 1.45]} />
        </mesh>
      ))}
      <mesh position={[0, H / 2 + 0.06, 0.73]} material={mats.brass}>
        <boxGeometry args={[W, 0.03, 0.03]} />
      </mesh>
      <mesh position={[0, -H / 2 - 0.25, 0]} material={mats.walnut}>
        <boxGeometry args={[W + 0.1, 0.4, 1.5]} />
      </mesh>
    </group>
  )
}

function Rig({ selected, items }) {
  const target = useMemo(() => new THREE.Vector3(), [])
  const look = useMemo(() => new THREE.Vector3(), [])
  useFrame((state, dt) => {
    const { camera, size } = state
    const i = items.findIndex((x) => x.id === selected)
    const aspect = size.width / size.height
    const fitDist = Math.max(8.4, 8.4 * (1.55 / aspect))
    if (i >= 0) {
      const [x, y] = cellPos(i)
      target.set(x, y + 0.05, 3.3)
      look.set(x, y - 0.05, 0)
    } else {
      target.set(0, 0.15, fitDist)
      look.set(0, -0.1, 0)
    }
    const k = 1 - Math.exp(-(reduceMotion ? 20 : 3.5) * Math.min(dt, 0.1))
    camera.position.lerp(target, k)
    camera.lookAt(look)
  })
  return null
}

export default function CabinetScene({ items, hovered, selected, onHover, onSelect }) {
  const mats = useMemo(
    () => ({
      walnut: new THREE.MeshStandardMaterial({ color: '#4a3426', roughness: 0.45 }),
      brass: new THREE.MeshStandardMaterial({ color: '#c6a96c', metalness: 1, roughness: 0.25 }),
      velvet: new THREE.MeshStandardMaterial({ color: '#1f1a17', roughness: 1 }),
    }),
    [],
  )
  return (
    <Canvas shadows dpr={[1, 1.75]} camera={{ position: [0, 0.15, 9], fov: 34 }} gl={{ antialias: true, alpha: true }} onPointerMissed={() => onSelect(null)}>
      <hemisphereLight args={['#f3e6d2', '#1a1512', 0.45]} />
      <directionalLight position={[3, 5, 6]} intensity={1.1} color="#fff1dc" />
      <Environment resolution={256} frames={1}>
        <Lightformer form="rect" intensity={2.2} color="#fff1dc" position={[0, 4, 3]} scale={[8, 3, 1]} />
        <Lightformer form="rect" intensity={1.0} color="#e8a35a" position={[-5, 1, 1]} rotation-y={Math.PI / 2} scale={[6, 4, 1]} />
        <Lightformer form="ring" intensity={1.4} color="#ffffff" position={[0, 1, 6]} scale={2.5} />
      </Environment>
      <Rig selected={selected} items={items} />
      <Carcass mats={mats} />
      {items.map((item, i) => (
        <Compartment key={item.id} item={item} i={i} hovered={hovered} selected={selected} onHover={onHover} onSelect={onSelect} mats={mats} />
      ))}
      <ContactShadows position={[0, -2.55, 0]} opacity={0.4} blur={2.4} scale={12} far={2} />
    </Canvas>
  )
}
