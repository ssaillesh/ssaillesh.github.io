import { useLayoutEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { makeWindowTexture } from './materials.js'
import { seeded } from './random.js'

// A night city around the penthouse: one instanced mesh, a few hundred towers.
// The residence sits at y = 0, roughly forty storeys up.
export default function Skyline({ count = 240 }) {
  const ref = useRef()
  const material = useMemo(() => {
    const tex = makeWindowTexture()
    tex.repeat.set(2, 6)
    return new THREE.MeshStandardMaterial({ color: '#0e0f11', emissive: '#ffffff', emissiveMap: tex, emissiveIntensity: 0.32, roughness: 0.9 })
  }, [])

  const towers = useMemo(() => {
    const r = seeded(11)
    const out = []
    while (out.length < count) {
      const ang = r() * Math.PI * 2
      const dist = 46 + Math.pow(r(), 0.75) * 240
      const x = Math.cos(ang) * dist
      const z = Math.sin(ang) * dist
      // keep the south-east clear so the camera's line to the building stays open
      if (x > 6 && z > 6 && dist < 150) continue
      const w = 5 + r() * 9
      const d = 5 + r() * 9
      // the residence is the tallest point nearby; the skyline rises with distance
      const top = -14 - r() * 34 + Math.min(1, dist / 220) * r() * 38
      out.push({ x, z, w, d, top })
    }
    return out
  }, [count])

  useLayoutEffect(() => {
    const m = new THREE.Matrix4()
    const base = -160
    towers.forEach((t, i) => {
      const h = t.top - base
      m.compose(new THREE.Vector3(t.x, base + h / 2, t.z), new THREE.Quaternion(), new THREE.Vector3(t.w, h, t.d))
      ref.current.setMatrixAt(i, m)
    })
    ref.current.instanceMatrix.needsUpdate = true
  }, [towers])

  return (
    <group>
      <instancedMesh ref={ref} args={[undefined, undefined, towers.length]} material={material}>
        <boxGeometry args={[1, 1, 1]} />
      </instancedMesh>
      {/* faint warm haze on the horizon */}
      <mesh position={[0, -120, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[420, 48]} />
        <meshBasicMaterial color="#17120d" />
      </mesh>
    </group>
  )
}
