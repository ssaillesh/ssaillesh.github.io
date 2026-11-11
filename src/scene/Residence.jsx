import { Suspense, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import { getMaterials } from './materials.js'
import Architecture from './Architecture.jsx'
import Skyline from './Skyline.jsx'
import Lights from './Lights.jsx'
import CameraRig, { FOV } from './CameraRig.jsx'
import Core from './rooms/Core.jsx'
import Foyer from './rooms/Foyer.jsx'
import Study from './rooms/Study.jsx'
import Workshop from './rooms/Workshop.jsx'
import Gallery from './rooms/Gallery.jsx'
import Lounge from './rooms/Lounge.jsx'
import { rooms, roomCenter, roomSize } from '../data/rooms.js'

const ROOM_COMPONENTS = { foyer: Foyer, study: Study, workshop: Workshop, gallery: Gallery, lounge: Lounge }
const LABEL_HEIGHT = { foyer: 3.4, study: 3.4, workshop: 3.4, gallery: 3.8, lounge: 3.4 }

// Invisible floor that makes a whole room clickable, with a faint brass wash on hover.
function RoomHitArea({ room, hovered, active, onHover, onGo }) {
  const mat = useRef()
  const [w, d] = roomSize(room)
  const [x, , z] = roomCenter(room)
  useFrame((_, dt) => {
    if (!mat.current) return
    const target = hovered && !active ? 0.09 : 0
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

function RoomLabel({ room, visible, emphasised, onGo }) {
  const [x, , z] = roomCenter(room)
  return (
    <Html position={[x, LABEL_HEIGHT[room.id], z]} zIndexRange={[40, 20]}>
      <button
        type="button"
        onClick={() => onGo(room.id)}
        tabIndex={visible ? 0 : -1}
        aria-hidden={!visible}
        className="hotspot-tag group flex items-center gap-2.5 rounded-full border bg-charcoal/80 py-1.5 pl-1.5 pr-4 text-left shadow-[0_10px_30px_rgba(0,0,0,.45)] backdrop-blur-sm transition-[opacity,transform,border-color] duration-500"
        style={{
          opacity: visible ? 1 : 0,
          pointerEvents: visible ? 'auto' : 'none',
          borderColor: emphasised ? 'rgba(198,169,108,.9)' : 'rgba(198,169,108,.35)',
          transform: `translate3d(-50%, ${visible ? '-100%' : '-70%'}, 0)`,
        }}
      >
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brass font-mono text-[11px] font-medium text-charcoal">{room.number}</span>
        <span className="flex flex-col leading-tight">
          <span className="font-serif text-[19px] text-ivory">{room.name}</span>
          <span className="label-mono text-[9.5px] text-stone">{room.kicker}</span>
        </span>
      </button>
    </Html>
  )
}

function Scene({ route, go, intro, panelWidth }) {
  const mats = useMemo(() => getMaterials(), [])
  const [hoveredRoom, setHoveredRoom] = useState(null)
  const [hoveredItem, setHoveredItem] = useState(null)
  const activeRoom = intro ? null : route.room

  return (
    <>
      <color attach="background" args={['#0b0b0c']} />
      <fog attach="fog" args={['#0b0b0c', 95, 260]} />
      <Lights activeRoom={activeRoom} />
      <CameraRig room={activeRoom} intro={intro} panelWidth={panelWidth} />
      <Skyline />
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
      {rooms.map((r) => (
        <RoomLabel key={r.id} room={r} visible={!intro && !activeRoom} emphasised={hoveredRoom === r.id} onGo={(id) => go(id)} />
      ))}
    </>
  )
}

export default function Residence({ route, go, intro, panelWidth, onCreated }) {
  return (
    <Canvas
      shadows
      dpr={[1, 1.75]}
      camera={{ position: [90, 110, 90], fov: FOV, near: 2, far: 900 }}
      gl={{ antialias: true, powerPreference: 'high-performance' }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping
        gl.toneMappingExposure = 1.05
        onCreated?.()
      }}
      onPointerMissed={() => route.item && go(route.room)}
    >
      <Scene route={route} go={go} intro={intro} panelWidth={panelWidth} />
    </Canvas>
  )
}
