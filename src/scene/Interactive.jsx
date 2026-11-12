import { useLayoutEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const BRASS = new THREE.Color('#e0b874')
const ringGeo = new THREE.RingGeometry(0.92, 1, 64)

function applyGlow(list, g) {
  for (const e of list) {
    e.mat.emissive.copy(e.base).lerp(BRASS, g * 0.5)
    e.mat.emissiveIntensity = THREE.MathUtils.lerp(e.baseI, Math.max(e.baseI, 0.55), g)
  }
}

// Wraps a piece of furniture so it can be hovered and selected. There are no
// floating labels: on hover the object itself warms up with a brass glow and a
// ring appears on the floor. When `enabled` is false clicks fall through to the room.
export default function Interactive({ id, label, sub, enabled, hovered, selected, onHover, onSelect, ring, children }) {
  const group = useRef()
  const ringMat = useRef()
  const glow = useRef(0)

  // Give this object its own material copies so the glow does not leak to
  // other furniture that shares the same base material.
  useLayoutEffect(() => {
    const list = []
    group.current?.traverse((o) => {
      if (!o.isMesh || !o.material || o.userData.noGlow) return
      if (!o.material.emissive) return
      const mat = o.material.clone()
      o.material = mat
      list.push({ mat, base: mat.emissive.clone(), baseI: mat.emissiveIntensity })
    })
    group.current.userData.glow = list
    return () => list.forEach((e) => e.mat.dispose())
  }, [])

  const lit = enabled && (hovered === id || selected === id)

  useFrame((state, dt) => {
    // In an open room every pickable object breathes with a soft glow so it
    // reads as interactive; hover brings it to full strength.
    const breathe = 0.2 + 0.12 * Math.sin(state.clock.elapsedTime * 2.4 + id.length)
    const target = !enabled ? 0 : hovered === id ? 1 : selected === id ? 0.7 : breathe
    const g = THREE.MathUtils.damp(glow.current, target, 9, dt)
    if (g < 0.001 && glow.current < 0.001) return
    glow.current = g < 0.001 ? 0 : g
    applyGlow(group.current?.userData.glow || [], g)
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
