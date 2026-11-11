import { Suspense, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { ContactShadows, Environment, Float, Lightformer, PresentationControls } from '@react-three/drei'
import * as THREE from 'three'
import { INSPECT } from './registry.js'

const reduceMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

// Brings the object up from below and slightly turned, as if it has just been lifted.
function Lift({ children }) {
  const ref = useRef()
  const t = useRef(reduceMotion ? 1 : 0)
  useFrame((_, dt) => {
    if (!ref.current) return
    t.current = Math.min(1, t.current + dt * 1.4)
    const e = 1 - Math.pow(1 - t.current, 3)
    ref.current.position.y = THREE.MathUtils.lerp(-0.9, 0, e)
    ref.current.rotation.y = THREE.MathUtils.lerp(-0.9, 0, e)
    ref.current.scale.setScalar(THREE.MathUtils.lerp(0.7, 1, e))
  })
  return <group ref={ref}>{children}</group>
}

export default function InspectStage({ item }) {
  const entry = INSPECT[item]
  if (!entry) return null
  const { Model } = entry
  return (
    <Canvas
      key={item}
      shadows
      dpr={[1, 1.75]}
      camera={{ position: [0, 0.1, 6.6], fov: 32 }}
      gl={{ antialias: true, alpha: true }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping
        gl.toneMappingExposure = 1.1
      }}
    >
      <hemisphereLight args={['#f3e6d2', '#1a1512', 0.7]} />
      <directionalLight position={[3, 4, 5]} intensity={2.2} color="#fff1dc" castShadow shadow-mapSize={[1024, 1024]} />
      <directionalLight position={[-4, 2, -3]} intensity={1.1} color="#9fb4c2" />
      <pointLight position={[0, -1, 3]} intensity={6} distance={8} color="#e8a35a" />
      {/* a small studio built from light panels: gives metal something to reflect, no files fetched */}
      <Environment resolution={256} frames={1}>
        <Lightformer form="rect" intensity={2.4} color="#fff1dc" position={[0, 4, 3]} scale={[8, 3, 1]} />
        <Lightformer form="rect" intensity={1.2} color="#e8a35a" position={[-5, 1, 1]} rotation-y={Math.PI / 2} scale={[6, 4, 1]} />
        <Lightformer form="rect" intensity={0.9} color="#9fb4c2" position={[5, 0.5, -2]} rotation-y={-Math.PI / 2} scale={[6, 4, 1]} />
        <Lightformer form="ring" intensity={1.5} color="#ffffff" position={[0, 1, 6]} scale={2.5} />
      </Environment>
      <PresentationControls global snap rotation={[0.08, 0, 0]} polar={[-0.45, 0.45]} azimuth={[-1.4, 1.4]} speed={1.4}>
        <Float speed={reduceMotion ? 0 : 1.3} rotationIntensity={0.15} floatIntensity={0.35}>
          <Lift>
            <Suspense fallback={null}>
              <Model />
            </Suspense>
          </Lift>
        </Float>
      </PresentationControls>
      <ContactShadows position={[0, -1.45, 0]} opacity={0.55} blur={2.6} scale={7} far={3.2} color="#000000" />
    </Canvas>
  )
}
