import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const ringGeo = new THREE.RingGeometry(0.92, 1, 64)

// Wraps a piece of furniture so it can be hovered and selected. There are no
// floating labels: a ring appears on the floor. When `enabled` is false clicks fall through to the room.
export default function Interactive({ id, label, sub, enabled, hovered, selected, onHover, onSelect, ring, children }) {
  const group = useRef()
  const ringMat = useRef()
  const glow = useRef(0)

  const lit = enabled && (hovered === id || selected === id)

  useFrame((state, dt) => {
    const breathe = 0.2 + 0.12 * Math.sin(state.clock.elapsedTime * 2.4 + id.length)
    const target = !enabled ? 0 : hovered === id ? 1 : selected === id ? 0.7 : breathe
    const g = THREE.MathUtils.damp(glow.current, target, 9, dt)
    if (g < 0.001 && glow.current < 0.001) return
    glow.current = g < 0.001 ? 0 : g
    if (ringMat.current) ringMat.current.opacity = Math.min(0.9, g * 1.1)
  })

  const handlers = enabled
    ? {
        onPointerOver: (e) => {
          e.stopPropagation()
          onHover(id, label, sub)
          document.body.style.cursor = 'pointer'
        },
        onPointerOut: () => {
          onHover(null)
          document.body.style.cursor = ''
        },
        onClick: (e) => {
          e.stopPropagation()
          onSelect(id)
        },
      }
    : {}

  return (
    <group ref={group} {...handlers} userData={{ lit }}>
      {children}
      {ring && (
        <mesh geometry={ringGeo} position={[ring[0], 0.03, ring[1]]} rotation={[-Math.PI / 2, 0, 0]} scale={ring[2] || 1} userData={{ noGlow: true }}>
          <meshBasicMaterial ref={ringMat} color="#c6a96c" transparent opacity={0} depthWrite={false} />
        </mesh>
      )}
    </group>
  )
}
