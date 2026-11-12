import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// Warm architectural lighting: one light per room, two wide spots for the
// exhibit rooms. Kept deliberately few — every extra light makes every
// material more expensive to compile and to draw on modest GPUs.
const ROOM_LIGHTS = {
  foyer: [{ p: [0, 2.8, 6.5], i: 9 }],
  study: [{ p: [-8.6, 2.6, 4.6], i: 11 }],
  lab: [{ p: [-8.2, 2.8, -4.4], i: 11, d: 9, c: '#e6ecf8' }],
  garage: [{ p: [16, 3.0, -4.6], i: 14, d: 11 }, { p: [16, 3.0, 4.6], i: 14, d: 11 }],
  lounge: [{ p: [8, 2.9, 4.2], i: 13, d: 10 }, { p: [8, 2.9, -4.6], i: 11, d: 9 }],
  core: [{ p: [0, 3, 0.5], i: 7 }],
}

// Wide spotlights: [room, x, z] of the area being lit.
const SPOTS = [['vault', 0, -6.2]]

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
    ref.current.intensity = THREE.MathUtils.damp(ref.current.intensity, 34 * k, 4, dt)
  })
  return <spotLight ref={ref} position={[x, 5.2, z + 2.6]} angle={0.85} penumbra={0.6} intensity={34} distance={12} decay={1.5} color="#ffe2b8" />
}

export default function Lights({ activeRoom, hoveredRoom }) {
  return (
    <>
      <hemisphereLight args={['#5b6372', '#2a2118', 0.55]} />
      <ambientLight intensity={0.18} color="#f3e6d2" />
      <directionalLight
        position={[-14, 30, -14]}
        intensity={0.9}
        color="#c9d4e4"
        castShadow
        shadow-mapSize={[1536, 1536]}
        shadow-camera-left={-22}
        shadow-camera-right={22}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
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
