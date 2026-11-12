import { useEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import { BUILDING, roomById, roomCenter, roomSize } from '../data/rooms.js'

// Narrow-lens perspective camera: reads almost isometric up close (an
// architectural presentation), while the city behind still recedes.
export const FOV = 24
const reduceMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
const AZIMUTH = 0.72 // from the south-east
const POLAR = 0.86 // ~49° below vertical
const dirFrom = (az, polar) =>
  new THREE.Vector3(Math.sin(polar) * Math.sin(az), Math.cos(polar), Math.sin(polar) * Math.cos(az))

// Screen-space extent (world units) of a w×d footprint seen from this angle.
const projected = (w, d, h = 3) => {
  const pw = w * Math.cos(AZIMUTH) + d * Math.sin(AZIMUTH)
  const ph = (w * Math.sin(AZIMUTH) + d * Math.cos(AZIMUTH)) * Math.cos(POLAR) + h * Math.sin(POLAR)
  return [pw, ph]
}

const tanHalf = Math.tan(THREE.MathUtils.degToRad(FOV / 2))
const fitDistance = (pw, ph, widthPx, heightPx) => Math.max(ph / 2 / tanHalf, pw / 2 / (tanHalf * (widthPx / heightPx)))

export default function CameraRig({ room, intro, panelWidth }) {
  const controls = useRef()
  const size = useThree((s) => s.size)
  const anim = useRef(true)
  const goal = useRef({ target: new THREE.Vector3(), dist: 100, dir: dirFrom(AZIMUTH, POLAR) })

  const overviewDist = useMemo(() => {
    const [pw, ph] = projected(BUILDING.maxX - BUILDING.minX + 1.2, BUILDING.maxZ - BUILDING.minZ + 1.2, 4)
    return fitDistance(pw * 1.1, ph * 1.28, size.width, size.height)
  }, [size])

  useEffect(() => {
    const g = goal.current
    if (intro) {
      g.target.set((BUILDING.minX + BUILDING.maxX) / 2, -4, 0)
      g.dist = overviewDist * 1.9
      g.dir = dirFrom(AZIMUTH - 0.3, POLAR - 0.25)
    } else if (!room) {
      g.target.set((BUILDING.minX + BUILDING.maxX) / 2, 0, 0.6)
      g.dist = overviewDist
      g.dir = dirFrom(AZIMUTH, POLAR)
    } else {
      const r = roomById[room]
      const [w, d] = roomSize(r)
      const [pw, ph] = projected(w, d, 3.4)
      const availW = Math.max(320, size.width - panelWidth - 140)
      const availH = size.height - 170
      // Fit the room into the area left of the panel.
      const dist = fitDistance(pw * 0.98 * (size.width / availW), ph * 1.02 * (size.height / availH), size.width, size.height)
      const pxToWorld = (2 * dist * tanHalf) / size.height
      const right = new THREE.Vector3(Math.cos(AZIMUTH), 0, -Math.sin(AZIMUTH))
      g.target.set(...roomCenter(r)).setY(0.6).addScaledVector(right, (panelWidth / 2 + 10) * pxToWorld)
      g.dist = dist
      g.dir = dirFrom(AZIMUTH, POLAR - 0.08)
    }
    anim.current = true
  }, [room, intro, overviewDist, panelWidth, size])

  const offset = useMemo(() => new THREE.Vector3(), [])
  const desired = useMemo(() => new THREE.Vector3(), [])

  useFrame((state, dt) => {
    const camera = state.camera
    const c = controls.current
    if (!c) return
    const g = goal.current
    if (anim.current) {
      const k = (intro ? 0.9 : 2.8) * (reduceMotion ? 4 : 1)
      const t = 1 - Math.exp(-k * Math.min(dt, 0.1))
      offset.copy(camera.position).sub(c.target)
      desired.copy(g.dir).multiplyScalar(g.dist)
      offset.lerp(desired, t)
      c.target.lerp(g.target, t)
      camera.position.copy(c.target).add(offset)
      if (c.target.distanceTo(g.target) < 0.01 && offset.distanceTo(desired) < 0.05) anim.current = false
      c.enabled = false
      c.minDistance = 0
      c.maxDistance = Infinity
    } else {
      c.enabled = !intro
      c.minDistance = g.dist * 0.6
      c.maxDistance = g.dist * 1.15
    }
    c.update()
  })

  return (
    <OrbitControls
      ref={controls}
      makeDefault
      enablePan={false}
      enableDamping
      dampingFactor={0.08}
      rotateSpeed={0.45}
      zoomSpeed={0.6}
      minAzimuthAngle={AZIMUTH - 0.5}
      maxAzimuthAngle={AZIMUTH + 0.45}
      minPolarAngle={0.55}
      maxPolarAngle={1.02}
    />
  )
}
