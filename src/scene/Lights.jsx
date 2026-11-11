import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// Warm architectural lighting per room. The open room brightens, the others dim.
const ROOM_LIGHTS = {
  foyer: [{ p: [0, 2.8, 6.5], i: 9 }],
  study: [{ p: [-9.9, 1.4, 4.75], i: 4, d: 5 }, { p: [-7.6, 2.8, 4.6], i: 9 }],
  workshop: [{ p: [-10, 2.8, -7.2], i: 9 }, { p: [-7, 2.8, -2.6], i: 9 }],
  gallery: [],
  lounge: [{ p: [8, 2.8, 6], i: 10 }, { p: [8, 2.8, -0.6], i: 9 }, { p: [4.9, 0.6, 6], i: 3, d: 4, c: '#ff8a3c' }],
  trophy: [{ p: [8, 2.9, -5.2], i: 5 }],
  core: [{ p: [0, 3, 0.5], i: 7 }],
}

// Spotlights for exhibits: [room, x, z] of the thing being lit.
const SPOTS = [
  ['gallery', -2.65, -6.6], ['gallery', 0, -6.6], ['gallery', 2.65, -6.6],
  ['trophy', 5.4, -7.7], ['trophy', 7.0, -7.7], ['trophy', 8.6, -7.7], ['trophy', 10.3, -7.7], ['trophy', 8.0, -5.2],
]

function RoomLight({ room, cfg, activeRoom, hoveredRoom }) {
  const ref = useRef()
  useFrame((_, dt) => {
    if (!ref.current) return
    const k = !activeRoom ? (hoveredRoom === room ? 1.7 : hoveredRoom ? 0.8 : 1) : activeRoom === room ? 1.5 : room === 'core' ? 0.6 : 0.35
    ref.current.intensity = THREE.MathUtils.damp(ref.current.intensity, cfg.i * k, 4, dt)
  })
  return <pointLight ref={ref} position={cfg.p} intensity={cfg.i} distance={cfg.d || 9} decay={1.6} color={cfg.c || '#ffc58a'} />
}

function Spot({ room, x, z, activeRoom, hoveredRoom }) {
  const ref = useRef()
  const target = useMemo(() => new THREE.Object3D(), [])
  useEffect(() => {
    target.position.set(x, 0.9, z)
    target.updateMatrixWorld()
    if (ref.current) ref.current.target = target
  }, [target, x, z])
  useFrame((_, dt) => {
    if (!ref.current) return
    const k = !activeRoom ? (hoveredRoom === room ? 1.6 : hoveredRoom ? 0.8 : 1) : activeRoom === room ? 1.6 : 0.35
    ref.current.intensity = THREE.MathUtils.damp(ref.current.intensity, 22 * k, 4, dt)
  })
  return <spotLight ref={ref} position={[x, 4.2, z + 2]} angle={0.4} penumbra={0.7} intensity={22} distance={9} decay={1.6} color="#ffe2b8" />
}

export default function Lights({ activeRoom, hoveredRoom }) {
  return (
    <>
      <hemisphereLight args={['#5b6372', '#2a2118', 0.55]} />
      <ambientLight intensity={0.18} color="#f3e6d2" />
      <directionalLight
        position={[-18, 28, -14]}
        intensity={0.9}
        color="#c9d4e4"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-17}
        shadow-camera-right={17}
        shadow-camera-top={17}
        shadow-camera-bottom={-17}
        shadow-camera-near={1}
        shadow-camera-far={80}
        shadow-bias={-0.0004}
        shadow-normalBias={0.03}
      />
      <directionalLight position={[20, 14, 22]} intensity={0.35} color="#ffd9a8" />
      {Object.entries(ROOM_LIGHTS).flatMap(([room, list]) =>
        list.map((cfg, i) => <RoomLight key={`${room}${i}`} room={room} cfg={cfg} activeRoom={activeRoom} hoveredRoom={hoveredRoom} />),
      )}
      {SPOTS.map(([room, x, z]) => (
        <Spot key={`${room}${x}${z}`} room={room} x={x} z={z} activeRoom={activeRoom} hoveredRoom={hoveredRoom} />
      ))}
    </>
  )
}
