import { Suspense, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { PerformanceMonitor } from '@react-three/drei'
import { getMaterials } from './materials.js'
import Architecture from './Architecture.jsx'
import Lights from './Lights.jsx'
import CameraRig, { FOV } from './CameraRig.jsx'
import Core from './rooms/Core.jsx'
import Foyer from './rooms/Foyer.jsx'
import Study from './rooms/Study.jsx'
import Workshop from './rooms/Workshop.jsx'
import Gallery from './rooms/Gallery.jsx'
import Lounge from './rooms/Lounge.jsx'
import Trophy from './rooms/Trophy.jsx'
import { rooms, roomCenter, roomSize } from '../data/rooms.js'

const ROOM_COMPONENTS = { foyer: Foyer, study: Study, workshop: Workshop, gallery: Gallery, trophy: Trophy, lounge: Lounge }

// Invisible floor that makes a whole room clickable, with a faint brass wash on hover.
function RoomHitArea({ room, hovered, active, onHover, onGo }) {
  const mat = useRef()
  const [w, d] = roomSize(room)
  const [x, , z] = roomCenter(room)
  useFrame((_, dt) => {
    if (!mat.current) return
    const target = hovered && !active ? 0.12 : 0
    mat.current.opacity = THREE.MathUtils.damp(mat.current.opacity, target, 10, dt)
  })
  return (
    <mesh
      position={[x, 0.05, z]}
      rotation={[-Math.PI / 2, 0, 0]}
      onPointerOver={(e) => {
        e.stopPropagation()
        onHover(room.id)
        if (!active) document.body.style.cursor = 'pointer'
      }}
      onPointerOut={() => {
        onHover(null)
        document.body.style.cursor = ''
      }}
      onClick={(e) => {
        e.stopPropagation()
        onGo(room.id)
      }}
    >
      <planeGeometry args={[w - 0.2, d - 0.2]} />
      <meshBasicMaterial ref={mat} color="#c6a96c" transparent opacity={0} depthWrite={false} />
    </mesh>
  )
}

// Signals "ready" only once a frame has actually been drawn, so the intro never
// offers to enter a scene the GPU has not managed to render yet.
function FirstFrame({ onFirstFrame }) {
  const done = useRef(false)
  useFrame(() => {
    if (done.current) return
    done.current = true
    onFirstFrame?.()
  })
  return null
}

function Scene({ route, go, intro, panelWidth, onHoverInfo }) {
  const mats = useMemo(() => getMaterials(), [])
  const [hoveredRoom, setHoveredRoomState] = useState(null)
  const [hoveredItem, setHoveredItemState] = useState(null)
  const activeRoom = intro ? null : route.room

  // Hover feedback lives on the objects themselves; the interface only gets a
  // short caption to show in its status line.
  const setHoveredRoom = (id) => {
    setHoveredRoomState(id)
    if (!activeRoom) onHoverInfo?.(id ? { kind: 'room', id } : null)
  }
  const setHoveredItem = (id, label, sub) => {
    setHoveredItemState(id)
    onHoverInfo?.(id ? { kind: 'item', id, label, sub } : null)
  }

  return (
    <>
      <color attach="background" args={['#0d0d0e']} />
      <fog attach="fog" args={['#0d0d0e', 100, 168]} />
      <Lights activeRoom={activeRoom} hoveredRoom={activeRoom ? null : hoveredRoom} />
      <CameraRig room={activeRoom} intro={intro} panelWidth={panelWidth} />
      <Architecture mats={mats} activeRoom={activeRoom} />
      <Core mats={mats} />
      <Suspense fallback={null}>
        {rooms.map((r) => {
          const C = ROOM_COMPONENTS[r.id]
          const ctx = {
            active: activeRoom === r.id,
            hovered: hoveredItem,
            selected: route.item,
            onHover: setHoveredItem,
            onSelect: (id) => go(r.id, id),
          }
          return <C key={r.id} mats={mats} ctx={ctx} />
        })}
      </Suspense>
      {!intro &&
        rooms.map((r) => (
          <RoomHitArea key={r.id} room={r} hovered={hoveredRoom === r.id} active={activeRoom === r.id} onHover={setHoveredRoom} onGo={(id) => go(id)} />
        ))}
    </>
  )
}

export default function Residence({ route, go, intro, panelWidth, onCreated, onFail, onHoverInfo }) {
  const [dpr, setDpr] = useState(1.5)
  return (
    <Canvas
      shadows
      dpr={dpr}
      camera={{ position: [90, 110, 90], fov: FOV, near: 2, far: 900 }}
      gl={(defaults) => {
        // Create the renderer ourselves so a failure is caught here: three.js
        // throws asynchronously, outside React's error boundary.
        try {
          return new THREE.WebGLRenderer({ ...defaults, antialias: true, powerPreference: 'high-performance' })
        } catch (err) {
          onFail?.('webgl')
          throw err
        }
      }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping
        gl.toneMappingExposure = 1.05
        gl.domElement.addEventListener('webglcontextlost', (e) => {
          e.preventDefault()
          onFail?.('context-lost')
        })
      }}
      onPointerMissed={() => route.item && go(route.room)}
    >
      <PerformanceMonitor onDecline={() => setDpr(1)} flipflops={2} onFallback={() => setDpr(1)} />
      <FirstFrame onFirstFrame={onCreated} />
      <Scene route={route} go={go} intro={intro} panelWidth={panelWidth} onHoverInfo={onHoverInfo} />
    </Canvas>
  )
}
