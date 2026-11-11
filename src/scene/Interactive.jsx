import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'

const ringGeo = new THREE.RingGeometry(0.92, 1, 64)

// Wraps a piece of furniture so it can be hovered and selected.
// When `enabled` is false the object is inert and clicks fall through to the room.
export default function Interactive({ id, label, sub, enabled, hovered, selected, onHover, onSelect, labelAt, ring, children }) {
  const ringMat = useRef()
  const lit = enabled && (hovered === id || selected === id)

  useFrame((_, dt) => {
    if (!ringMat.current) return
    ringMat.current.opacity = THREE.MathUtils.damp(ringMat.current.opacity, lit ? 0.9 : 0, 8, dt)
  })

  const handlers = enabled
    ? {
        onPointerOver: (e) => {
          e.stopPropagation()
          onHover(id)
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
    <group {...handlers}>
      {children}
      {ring && (
        <mesh geometry={ringGeo} position={[ring[0], 0.03, ring[1]]} rotation={[-Math.PI / 2, 0, 0]} scale={ring[2] || 1}>
          <meshBasicMaterial ref={ringMat} color="#c6a96c" transparent opacity={0} depthWrite={false} />
        </mesh>
      )}
      {enabled && labelAt && (
        <Html position={labelAt} zIndexRange={[30, 10]} style={{ pointerEvents: 'none' }}>
          <div
            className="hotspot-tag"
            style={{
              opacity: lit ? 1 : 0,
              transform: `translate3d(-50%, ${lit ? '-100%' : '-80%'}, 0)`,
              transition: 'opacity .25s ease, transform .35s cubic-bezier(.2,.7,.2,1)',
              pointerEvents: 'none',
            }}
          >
            <div className="rounded-full border border-brass/50 bg-charcoal/85 px-3 py-1.5 text-ivory shadow-lg backdrop-blur-sm">
              <span className="label-mono text-brass">{sub}</span>
              <span className="ml-2 text-[13px]">{label}</span>
            </div>
          </div>
        </Html>
      )}
    </group>
  )
}
