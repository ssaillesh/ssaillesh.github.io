import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import * as THREE from 'three'
import { Box, Ball } from '../primitives.jsx'
import Interactive from '../Interactive.jsx'

const reduceMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

// ROOM 04, GALLERY: x[-4, 4], z[-9, -3]. Three exhibits, each a plinth with a
// physical object and a graphic panel carrying the real product screenshot.
const EXHIBITS = [
  { id: 'rova', x: -2.65, img: '/residence/rova.jpg', label: 'Rova', sub: 'Exhibit 01' },
  { id: 'lapzero', x: 0, img: '/residence/lapzero.jpg', label: 'LapZero', sub: 'Exhibit 02' },
  { id: 'codegraphrag', x: 2.65, img: '/residence/codegraphrag.jpg', label: 'CodeGraphRAG', sub: 'Exhibit 03' },
]

function Panel({ x, texture, mats }) {
  // Free-standing exhibition graphic, turned slightly toward the visitor.
  return (
    <group position={[x, 0, -8.1]} rotation={[0, 0.32, 0]}>
      <Box p={[0, 0, 0]} s={[2.2, 0.06, 0.4]} m={mats.steel} />
      <Box p={[-1.06, 0, 0]} s={[0.05, 2.9, 0.05]} m={mats.steel} />
      <Box p={[1.06, 0, 0]} s={[0.05, 2.9, 0.05]} m={mats.steel} />
      <Box p={[0, 1.15, -0.02]} s={[2.12, 1.32, 0.03]} m={mats.blackMatte} />
      <mesh position={[0, 1.81, 0]}>
        <planeGeometry args={[2.04, 1.15]} />
        <meshStandardMaterial map={texture} emissive="#ffffff" emissiveMap={texture} emissiveIntensity={0.7} roughness={0.4} toneMapped={false} />
      </mesh>
    </group>
  )
}

function RaceCar({ mats }) {
  const ref = useRef()
  useFrame((_, dt) => {
    if (ref.current && !reduceMotion) ref.current.rotation.y += dt * 0.35
  })
  return (
    <group ref={ref} position={[0, 1.0, -6.3]}>
      <Box p={[0, 0.06, 0]} s={[0.36, 0.07, 0.9]} m={mats.carRed} />
      <Box p={[0, 0.13, -0.05]} s={[0.2, 0.08, 0.36]} m={mats.carRed} />
      <Box p={[0, 0.06, 0.48]} s={[0.5, 0.02, 0.1]} m={mats.steel} />
      <Box p={[0, 0.18, -0.42]} s={[0.44, 0.02, 0.1]} m={mats.steel} />
      {[[-0.22, 0.3], [0.22, 0.3], [-0.22, -0.3], [0.22, -0.3]].map(([x, z]) => (
        <mesh key={`${x}${z}`} position={[x, 0.08, z]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.075, 0.075, 0.07, 16]} />
          <primitive object={mats.rubber} attach="material" />
        </mesh>
      ))}
    </group>
  )
}

function GraphSculpture({ mats }) {
  const ref = useRef()
  const { nodes, edges } = useMemo(() => {
    const n = [
      [0, 0.55, 0], [0.3, 0.3, 0.1], [-0.28, 0.35, -0.12], [0.1, 0.1, -0.3], [-0.1, 0.75, 0.25],
      [0.32, 0.72, -0.18], [-0.34, 0.08, 0.2], [0.22, 0.95, 0.05], [-0.18, 0.98, -0.1],
    ]
    const e = [[0, 1], [0, 2], [0, 4], [0, 5], [1, 3], [2, 6], [1, 5], [4, 7], [5, 7], [4, 8], [2, 8], [3, 6], [7, 8]]
    return { nodes: n, edges: e }
  }, [])
  const edgeMeshes = useMemo(
    () =>
      edges.map(([a, b]) => {
        const va = new THREE.Vector3(...nodes[a])
        const vb = new THREE.Vector3(...nodes[b])
        const mid = va.clone().add(vb).multiplyScalar(0.5)
        const len = va.distanceTo(vb)
        const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), vb.clone().sub(va).normalize())
        return { mid, len, q }
      }),
    [nodes, edges],
  )
  useFrame((_, dt) => {
    if (ref.current && !reduceMotion) ref.current.rotation.y += dt * 0.25
  })
  return (
    <group ref={ref} position={[2.65, 0.95, -6.3]}>
      {nodes.map((p, i) => (
        <Ball key={i} p={p} radius={i === 0 ? 0.07 : 0.045} m={mats.brass} />
      ))}
      {edgeMeshes.map(({ mid, len, q }, i) => (
        <mesh key={i} position={mid} quaternion={q}>
          <cylinderGeometry args={[0.008, 0.008, len, 6]} />
          <primitive object={mats.steel} attach="material" />
        </mesh>
      ))}
    </group>
  )
}

function TabletDisplay({ texture, mats }) {
  return (
    <group position={[-2.65, 0.95, -6.3]} rotation={[-0.25, 0.2, 0]}>
      <Box p={[0, 0, 0]} s={[0.16, 0.24, 0.12]} m={mats.steel} />
      <Box p={[0, 0.2, 0]} s={[0.86, 0.52, 0.03]} m={mats.blackMatte} />
      <mesh position={[0, 0.46, 0.017]}>
        <planeGeometry args={[0.8, 0.46]} />
        <meshStandardMaterial map={texture} emissive="#ffffff" emissiveMap={texture} emissiveIntensity={0.6} />
      </mesh>
    </group>
  )
}

export default function Gallery({ mats, ctx }) {
  const textures = useTexture(EXHIBITS.map((e) => e.img))
  textures.forEach((t) => (t.colorSpace = THREE.SRGBColorSpace))
  const plinth = useMemo(() => new THREE.MeshStandardMaterial({ color: '#d6d0c5', roughness: 0.85 }), [])

  return (
    <group>
      {EXHIBITS.map((e, i) => (
        <Interactive
          key={e.id}
          id={e.id}
          enabled={ctx.active}
          hovered={ctx.hovered}
          selected={ctx.selected}
          onHover={ctx.onHover}
          onSelect={ctx.onSelect}
          label={e.label}
          sub={e.sub}
         
          ring={[e.x, -6.3, 1.0]}
        >
          <Box p={[e.x, 0, -6.3]} s={[1.0, 0.95, 1.0]} m={plinth} />
          <Panel x={e.x} texture={textures[i]} mats={mats} />
        </Interactive>
      ))}
      <TabletDisplay texture={textures[0]} mats={mats} />
      <RaceCar mats={mats} />
      <GraphSculpture mats={mats} />
      <Box p={[0, 0, -4.1]} s={[2.4, 0.42, 0.5]} m={mats.walnut} />
    </group>
  )
}
