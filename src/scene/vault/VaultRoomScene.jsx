import { createContext, Suspense, useContext, useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Environment, Lightformer, MeshReflectorMaterial, Sparkles, useGLTF, useTexture } from '@react-three/drei'
import * as THREE from 'three'
import { labelTexture } from '../inspect/textures.js'
import { ArcadeCabinet } from '../inspect/models.jsx'

// Inside the vault: a hall-of-fame walk. A chevron-marble corridor lined with lit
// glass cases, pendants down the middle, and Rova framed at the far end. The
// featured projects get the big cases nearest Rova; the rest sit in smaller cases
// by the door. Scroll (or the arrow keys) walks the corridor; clicking a case
// glides up to it.

const reduceMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

const HALF = 2.2 // the case fronts sit at x = ±HALF
const WALL = 2.8 // the wall behind the cases
const CEIL = 3.8
const DOOR_Z = 9.5
const END_Z = -7
const WALK_FROM = 8.6
const WALK_TO = -1.2

// side -1 = left wall, +1 = right wall. z is the case centre along the corridor.
const CASES = [
  { id: 'codegraphrag', side: -1, z: 0.6, big: true },
  { id: 'heston', side: 1, z: 0.6, big: true },
  { id: 'asl', side: -1, z: 3.4, big: true },
  { id: 'news', side: 1, z: 3.4, big: true },
  { id: 'ict', side: -1, z: 5.6 },
  { id: 'padlock', side: 1, z: 5.6 },
  { id: 'automl', side: -1, z: 7.2 },
  { id: 'invasion', side: 1, z: 7.2 },
]
const BIG_W = 2.4
const SMALL_W = 1.2
const PILLARS = [8.0, 6.4, 4.8, 2.0, -0.8]
// The top three: Rova at the end, VouchStudio and LapZero on glass towers either side of it.
const TOP = [
  { id: 'vouch', rank: '02', pos: [-1.45, END_Z + 3.1], rot: 0.5 },
  { id: 'lapzero', rank: '03', pos: [1.45, END_Z + 3.1], rot: -0.5 },
]
const SANCTUM_Z = -1.0 // where the cases end and the inner hall for the top three begins

const walkZ = (w) => WALK_FROM + (WALK_TO - WALK_FROM) * w
const walkFor = (z) => THREE.MathUtils.clamp((z - WALK_FROM) / (WALK_TO - WALK_FROM), 0, 1)

// ---------------------------------------------------------------- textures
function canvasTex(w, h, draw) {
  const c = document.createElement('canvas')
  c.width = w
  c.height = h
  draw(c.getContext('2d'), w, h)
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  t.anisotropy = 4
  return t
}

const cashTex = () =>
  canvasTex(256, 128, (g, w, h) => {
    g.fillStyle = '#c9d2b0'
    g.fillRect(0, 0, w, h)
    g.fillStyle = '#7d9468'
    g.fillRect(8, 8, w - 16, h - 16)
    g.fillStyle = '#c9d2b0'
    g.fillRect(16, 16, w - 32, h - 32)
    g.fillStyle = '#5c7550'
    g.beginPath()
    g.ellipse(w / 2, h / 2, 26, 32, 0, 0, Math.PI * 2)
    g.fill()
    g.fillStyle = '#e8d9a8'
    g.fillRect(w / 2 - 18, 0, 36, h)
  })

const handTex = () =>
  canvasTex(512, 384, (g, w, h) => {
    g.fillStyle = '#05080c'
    g.fillRect(0, 0, w, h)
    const pts = [[256, 330], [200, 280], [170, 230], [150, 190], [135, 150], [230, 220], [225, 160], [222, 115], [220, 80], [262, 215], [266, 150], [268, 100], [270, 62], [292, 222], [304, 165], [312, 122], [318, 88], [318, 238], [340, 195], [354, 165], [366, 138]]
    const bones = [[0, 1], [1, 2], [2, 3], [3, 4], [0, 5], [5, 6], [6, 7], [7, 8], [0, 9], [9, 10], [10, 11], [11, 12], [0, 13], [13, 14], [14, 15], [15, 16], [0, 17], [17, 18], [18, 19], [19, 20], [5, 9], [9, 13], [13, 17]]
    g.strokeStyle = '#4fd6e8'
    g.lineWidth = 4
    bones.forEach(([a, b]) => {
      g.beginPath()
      g.moveTo(...pts[a])
      g.lineTo(...pts[b])
      g.stroke()
    })
    g.fillStyle = '#e8a35a'
    pts.forEach(([x, y]) => {
      g.beginPath()
      g.arc(x, y, 7, 0, Math.PI * 2)
      g.fill()
    })
    g.fillStyle = '#efe9dd'
    g.font = '600 28px monospace'
    g.fillText('A  · 0.97', 24, 40)
  })

const paperTex = () =>
  canvasTex(512, 384, (g, w, h) => {
    g.fillStyle = '#ece6d8'
    g.fillRect(0, 0, w, h)
    g.fillStyle = '#1b1a17'
    g.font = '700 54px Georgia, serif'
    g.fillText('MARKETS', 24, 70)
    g.fillRect(24, 86, w - 48, 3)
    for (let i = 0; i < 9; i++) {
      g.fillStyle = 'rgba(27,26,23,.25)'
      g.fillRect(24 + (i % 2) * 245, 110 + Math.floor(i / 2) * 50, 220, 10)
    }
  })


// Polished Nero marble: large dark slabs with soft white veining and thin brass seams.
const slabTex = () => {
  const w = 1024
  const h = 1024
  const c = document.createElement('canvas')
  c.width = w
  c.height = h
  const g = c.getContext('2d')
  g.fillStyle = '#121213'
  g.fillRect(0, 0, w, h)
  // cloudy depth
  for (let i = 0; i < 40; i++) {
    const x = (i * 211) % w
    const y = (i * 137) % h
    const r = 80 + ((i * 53) % 160)
    const grd = g.createRadialGradient(x, y, 0, x, y, r)
    grd.addColorStop(0, 'rgba(40,38,36,0.5)')
    grd.addColorStop(1, 'rgba(40,38,36,0)')
    g.fillStyle = grd
    g.fillRect(x - r, y - r, r * 2, r * 2)
  }
  // veins
  for (let i = 0; i < 9; i++) {
    g.strokeStyle = `rgba(232,226,214,${0.05 + (i % 3) * 0.03})`
    g.lineWidth = 0.5 + (i % 3) * 0.5
    g.beginPath()
    let x = (i * 241) % w
    let y = 0
    g.moveTo(x, y)
    while (y < h) {
      y += 40
      x += Math.sin(i * 2.1 + y * 0.004) * 9 + (i % 2 ? 14 : -14)
      g.lineTo(x, y)
    }
    g.stroke()
  }
  // slab seams in brass
  g.strokeStyle = 'rgba(198,169,108,0.55)'
  g.lineWidth = 3
  g.strokeRect(1.5, 1.5, w - 3, h - 3)
  g.beginPath()
  g.moveTo(w / 2, 0)
  g.lineTo(w / 2, h)
  g.stroke()
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  t.wrapS = THREE.RepeatWrapping
  t.wrapT = THREE.RepeatWrapping
  t.anisotropy = 8
  return t
}

// Warm backlight for the inside of a case: brightest at the top.
const backlightTex = () =>
  canvasTex(64, 256, (g, w, h) => {
    const grd = g.createLinearGradient(0, 0, 0, h)
    grd.addColorStop(0, '#ffe2b0')
    grd.addColorStop(0.35, '#a8784a')
    grd.addColorStop(1, '#2a1c12')
    g.fillStyle = grd
    g.fillRect(0, 0, w, h)
  })

const marbleTex = () =>
  canvasTex(512, 512, (g, w, h) => {
    g.fillStyle = '#0f0f10'
    g.fillRect(0, 0, w, h)
    g.strokeStyle = 'rgba(220,215,205,.18)'
    for (let i = 0; i < 14; i++) {
      g.lineWidth = 0.6 + (i % 3)
      g.beginPath()
      let x = (i * 97) % w
      g.moveTo(x, 0)
      for (let y = 0; y <= h; y += 32) {
        x += Math.sin(i * 1.7 + y * 0.03) * 18
        g.lineTo(x, y)
      }
      g.stroke()
    }
  })

// ---------------------------------------------------------------- exhibits
// While a piece is being handled, its idle spin stops.
const HeldContext = createContext(false)

function Spin({ speed = 0.4, children }) {
  const ref = useRef()
  const held = useContext(HeldContext)
  useFrame((_, dt) => {
    if (!ref.current || reduceMotion) return
    if (held) ref.current.rotation.y = THREE.MathUtils.damp(ref.current.rotation.y, Math.round(ref.current.rotation.y / (Math.PI * 2)) * Math.PI * 2, 4, dt)
    else ref.current.rotation.y += dt * speed
  })
  return <group ref={ref}>{children}</group>
}

// Drag to turn a selected piece any way you like; it eases back when you step away.
// `pivot` is the height it turns about, `limit` caps the tilt (for wall pieces).
function Turntable({ active, pivot = 0.3, limit = Infinity, grow = 1.15, children }) {
  const g = useRef()
  const drag = useRef({ on: false, x: 0, y: 0, vx: 0, vy: 0, rx: 0, ry: 0 })
  const gl = useThree((s) => s.gl)
  useEffect(() => {
    if (!active) return
    const el = gl.domElement
    const d = drag.current
    const down = (e) => {
      d.on = true
      d.x = e.clientX
      d.y = e.clientY
      d.vx = 0
      d.vy = 0
    }
    const move = (e) => {
      if (!d.on) return
      d.vx = (e.clientX - d.x) * 0.012
      d.vy = (e.clientY - d.y) * 0.012
      d.ry += d.vx
      d.rx += d.vy
      d.x = e.clientX
      d.y = e.clientY
    }
    const up = () => (d.on = false)
    el.addEventListener('pointerdown', down)
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
    return () => {
      el.removeEventListener('pointerdown', down)
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
      d.on = false
    }
  }, [active, gl])
  useFrame((_, dt) => {
    const d = drag.current
    if (!active) {
      d.rx = THREE.MathUtils.damp(d.rx, 0, 4, dt)
      d.ry = THREE.MathUtils.damp(d.ry, Math.round(d.ry / (Math.PI * 2)) * Math.PI * 2, 4, dt)
    } else if (!d.on) {
      d.ry += d.vx
      d.rx += d.vy
      d.vx *= 0.92
      d.vy *= 0.92
    }
    d.rx = THREE.MathUtils.clamp(d.rx, -limit, limit)
    if (limit !== Infinity) d.ry = THREE.MathUtils.clamp(d.ry, -limit, limit)
    if (!g.current) return
    g.current.rotation.set(d.rx, d.ry, 0)
    const s = THREE.MathUtils.damp(g.current.scale.x, active ? grow : 1, 5, dt)
    g.current.scale.setScalar(s)
  })
  return (
    <HeldContext.Provider value={active}>
      <group position={[0, pivot, 0]}>
        <group ref={g}>
          <group position={[0, -pivot, 0]}>{children}</group>
        </group>
      </group>
    </HeldContext.Provider>
  )
}

// Rova: the brand pin (the V mark), loaded from its GLB and fitted to the plinth.
function RovaPin({ size = 0.58 }) {
  const { scene } = useGLTF('/residence/rova-pin.glb')
  const { obj, scale, offset } = useMemo(() => {
    const o = scene.clone(true)
    o.traverse((n) => {
      if (n.isMesh) n.castShadow = true
    })
    const box = new THREE.Box3().setFromObject(o)
    const sz = box.getSize(new THREE.Vector3())
    const c = box.getCenter(new THREE.Vector3())
    const s = size / Math.max(sz.x, sz.y, sz.z)
    return { obj: o, scale: s, offset: [-c.x * s, -box.min.y * s + 0.08, -c.z * s] }
  }, [scene, size])
  return (
    <Spin speed={0.45}>
      <group position={offset}>
        <primitive object={obj} scale={scale} />
      </group>
    </Spin>
  )
}

function F1({ m }) {
  return (
    <Spin speed={0.5}>
      <group position={[0, 0.12, 0]} scale={0.95}>
        <mesh position={[0, 0.06, 0]} material={m.red} castShadow>
          <boxGeometry args={[0.24, 0.1, 1.0]} />
        </mesh>
        <mesh position={[0, 0.06, -0.6]} rotation={[-Math.PI / 2, 0, 0]} material={m.red}>
          <coneGeometry args={[0.08, 0.36, 12]} />
        </mesh>
        {[-1, 1].map((s) => (
          <mesh key={s} position={[s * 0.2, 0.05, 0.05]} material={m.red}>
            <boxGeometry args={[0.14, 0.08, 0.5]} />
          </mesh>
        ))}
        <mesh position={[0, 0.02, -0.74]} material={m.goldFlat}>
          <boxGeometry args={[0.6, 0.02, 0.1]} />
        </mesh>
        <mesh position={[0, 0.22, 0.5]} material={m.black}>
          <boxGeometry args={[0.5, 0.03, 0.12]} />
        </mesh>
        {[-0.18, 0.18].map((x) => (
          <mesh key={x} position={[x, 0.13, 0.5]} material={m.black}>
            <boxGeometry args={[0.02, 0.16, 0.08]} />
          </mesh>
        ))}
        <mesh position={[0, 0.16, -0.05]} rotation={[0, 0, 0]} material={m.black}>
          <torusGeometry args={[0.09, 0.012, 8, 24, Math.PI]} />
        </mesh>
        {[[-0.25, -0.42], [0.25, -0.42], [-0.26, 0.38], [0.26, 0.38]].map(([x, z]) => (
          <mesh key={`${x}${z}`} position={[x, 0.07, z]} rotation={[0, 0, Math.PI / 2]} material={m.tyre}>
            <cylinderGeometry args={[0.09, 0.09, 0.1, 20]} />
          </mesh>
        ))}
      </group>
    </Spin>
  )
}

function Graph({ m }) {
  const { nodes, edges } = useMemo(() => {
    const n = [[0, 0.55, 0], [0.3, 0.3, 0.1], [-0.28, 0.35, -0.12], [0.1, 0.1, -0.3], [-0.1, 0.75, 0.25], [0.32, 0.72, -0.18], [-0.34, 0.08, 0.2], [0.22, 0.95, 0.05], [-0.18, 0.98, -0.1]]
    const e = [[0, 1], [0, 2], [0, 4], [0, 5], [1, 3], [2, 6], [1, 5], [4, 7], [5, 7], [4, 8], [2, 8], [3, 6], [7, 8]].map(([a, b]) => {
      const va = new THREE.Vector3(...n[a])
      const vb = new THREE.Vector3(...n[b])
      return { mid: va.clone().add(vb).multiplyScalar(0.5), len: va.distanceTo(vb), q: new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), vb.clone().sub(va).normalize()) }
    })
    return { nodes: n, edges: e }
  }, [])
  return (
    <Spin speed={0.3}>
      <group position={[0, 0.05, 0]}>
        {nodes.map((p, i) => (
          <mesh key={i} position={p} material={m.gold}>
            <sphereGeometry args={[i ? 0.045 : 0.07, 16, 12]} />
          </mesh>
        ))}
        {edges.map(({ mid, len, q }, i) => (
          <mesh key={i} position={mid} quaternion={q} material={m.steel}>
            <cylinderGeometry args={[0.008, 0.008, len, 6]} />
          </mesh>
        ))}
      </group>
    </Spin>
  )
}

function Surface() {
  const geo = useMemo(() => {
    const g = new THREE.PlaneGeometry(0.9, 0.9, 28, 28)
    const p = g.attributes.position
    const colors = []
    const c = new THREE.Color()
    for (let i = 0; i < p.count; i++) {
      const x = p.getX(i) / 0.45
      const y = p.getY(i) / 0.45
      const z = 0.18 + 0.22 * Math.exp(-2.2 * x * x) * (1 - 0.3 * y) + 0.12 * y * y
      p.setZ(i, z)
      c.setHSL(0.02 + 1.1 * (0.5 - z), 0.85, 0.42)
      colors.push(c.r, c.g, c.b)
    }
    g.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3))
    g.computeVertexNormals()
    return g
  }, [])
  return (
    <Spin speed={0.25}>
      <group rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]}>
        <mesh geometry={geo}>
          <meshStandardMaterial vertexColors side={THREE.DoubleSide} roughness={0.35} metalness={0.1} />
        </mesh>
        <mesh geometry={geo}>
          <meshBasicMaterial color="#ffe2b0" wireframe transparent opacity={0.25} />
        </mesh>
      </group>
    </Spin>
  )
}

function Candles({ m }) {
  const data = [0.3, 0.38, 0.33, 0.46, 0.52, 0.47, 0.6, 0.72, 0.68]
  return (
    <group position={[0, 0.05, 0]}>
      {data.map((v, i) => {
        const prev = i ? data[i - 1] : v - 0.05
        const up = v >= prev
        const lo = Math.min(v, prev)
        const h = Math.max(0.05, Math.abs(v - prev))
        const x = (i - 4) * 0.1
        return (
          <group key={i}>
            <mesh position={[x, lo + h / 2, 0]} material={up ? m.green : m.redFlat}>
              <boxGeometry args={[0.06, h, 0.06]} />
            </mesh>
            <mesh position={[x, lo + h / 2, 0]} material={m.steel}>
              <boxGeometry args={[0.008, h + 0.12, 0.008]} />
            </mesh>
          </group>
        )
      })}
      <mesh position={[0, 0.0, 0]} material={m.black}>
        <boxGeometry args={[1.0, 0.02, 0.3]} />
      </mesh>
    </group>
  )
}

function News({ m, paper, tablet }) {
  return (
    <group position={[0, 0.02, 0]}>
      {[0, 1, 2, 3].map((i) => (
        <mesh key={i} position={[-0.1 + i * 0.02, 0.025 + i * 0.03, 0.05 - i * 0.02]} rotation={[-Math.PI / 2, 0, 0.1 * i - 0.15]}>
          <planeGeometry args={[0.6, 0.45]} />
          <meshStandardMaterial map={paper} roughness={0.9} side={THREE.DoubleSide} />
        </mesh>
      ))}
      <group position={[0.18, 0.12, -0.1]} rotation={[-0.4, -0.3, 0]}>
        <mesh material={m.black}>
          <boxGeometry args={[0.5, 0.36, 0.03]} />
        </mesh>
        <mesh position={[0, 0, 0.016]}>
          <planeGeometry args={[0.46, 0.32]} />
          <meshStandardMaterial map={tablet} emissive="#ffffff" emissiveMap={tablet} emissiveIntensity={0.7} toneMapped={false} />
        </mesh>
      </group>
    </group>
  )
}

function Podium({ m }) {
  return (
    <group position={[0, 0.0, 0]}>
      {[
        [0, 0.36, m.gold],
        [-0.3, 0.24, m.silver],
        [0.3, 0.16, m.bronze],
      ].map(([x, h, mat]) => (
        <group key={x}>
          <mesh position={[x, h / 2, 0]} material={m.black} castShadow>
            <boxGeometry args={[0.28, h, 0.28]} />
          </mesh>
          <mesh position={[x, h + 0.09, 0]} material={mat}>
            <sphereGeometry args={[0.09, 24, 16]} />
          </mesh>
        </group>
      ))}
    </group>
  )
}

function Asl({ m, hand }) {
  return (
    <group position={[0, 0.02, 0]}>
      <group position={[0.12, 0.42, 0.05]} rotation={[0, -0.25, 0]}>
        <mesh material={m.black}>
          <boxGeometry args={[0.62, 0.48, 0.03]} />
        </mesh>
        <mesh position={[0, 0, 0.016]}>
          <planeGeometry args={[0.58, 0.44]} />
          <meshStandardMaterial map={hand} emissive="#ffffff" emissiveMap={hand} emissiveIntensity={0.9} toneMapped={false} />
        </mesh>
        <mesh position={[0, -0.32, -0.05]} material={m.steel}>
          <boxGeometry args={[0.04, 0.2, 0.04]} />
        </mesh>
      </group>
      {[-0.08, 0.08].map((dz, i) => (
        <mesh key={i} position={[-0.3, 0.14, -0.1 + dz]} rotation={[dz * 3, 0, 0.12]} material={m.steel}>
          <cylinderGeometry args={[0.008, 0.008, 0.3, 8]} />
        </mesh>
      ))}
      <mesh position={[-0.3, 0.32, -0.1]} material={m.black}>
        <boxGeometry args={[0.14, 0.08, 0.08]} />
      </mesh>
      <mesh position={[-0.3, 0.32, -0.05]} rotation={[Math.PI / 2, 0, 0]} material={m.glassLens}>
        <cylinderGeometry args={[0.025, 0.025, 0.03, 16]} />
      </mesh>
    </group>
  )
}

function Padlock({ m }) {
  return (
    <Spin speed={0.35}>
      <group position={[0, 0.05, 0]}>
        <mesh position={[0, 0.25, 0]} material={m.goldFlat} castShadow>
          <boxGeometry args={[0.44, 0.38, 0.18]} />
        </mesh>
        <mesh position={[0, 0.48, 0]} material={m.steel}>
          <torusGeometry args={[0.15, 0.035, 12, 32, Math.PI]} />
        </mesh>
        {[-0.15, 0.15].map((x) => (
          <mesh key={x} position={[x, 0.46, 0]} material={m.steel}>
            <cylinderGeometry args={[0.035, 0.035, 0.06, 12]} />
          </mesh>
        ))}
        <mesh position={[0, 0.22, 0.092]} material={m.black}>
          <cylinderGeometry args={[0.03, 0.03, 0.01, 16]} />
        </mesh>
      </group>
    </Spin>
  )
}

// VouchStudio: its V mark in brass, standing on a one-page résumé.
const VOUCH_SHAPES = (() => {
  const s = 1 / 50
  const P = (x, y) => [(x - 32) * s, (33.5 - y) * s]
  const a = new THREE.Shape()
  a.moveTo(...P(2, 12))
  a.lineTo(...P(20, 12))
  a.lineTo(...P(31, 34))
  a.lineTo(...P(34.2, 29.6))
  a.lineTo(...P(42.2, 40.2))
  a.lineTo(...P(35.4, 51.6))
  a.bezierCurveTo(...P(33.4, 55.2), ...P(28.6, 55.2), ...P(26.6, 51.6))
  a.closePath()
  const b = new THREE.Shape()
  b.moveTo(...P(36.6, 26.4))
  b.lineTo(...P(46.4, 12))
  b.lineTo(...P(62, 12))
  b.lineTo(...P(44.6, 37.4))
  b.closePath()
  return [a, b]
})()

const resumeSheetTex = () =>
  canvasTex(340, 440, (g, w, h) => {
    g.fillStyle = '#f6f2ea'
    g.fillRect(0, 0, w, h)
    g.fillStyle = '#1b1a17'
    g.fillRect(30, 34, 170, 14)
    g.fillStyle = '#c6a96c'
    g.fillRect(30, 60, w - 60, 2)
    for (let i = 0; i < 16; i++) {
      g.fillStyle = i % 5 === 0 ? 'rgba(27,26,23,.55)' : 'rgba(27,26,23,.2)'
      g.fillRect(30, 84 + i * 21, i % 5 === 0 ? 110 : w - 60 - (i % 3) * 40, i % 5 === 0 ? 8 : 6)
    }
    g.strokeStyle = '#2e9e5b'
    g.lineWidth = 7
    g.beginPath()
    g.arc(w - 58, h - 56, 26, 0, Math.PI * 2)
    g.stroke()
    g.beginPath()
    g.moveTo(w - 70, h - 56)
    g.lineTo(w - 61, h - 46)
    g.lineTo(w - 45, h - 66)
    g.stroke()
  })

function VouchMark({ m }) {
  const geo = useMemo(() => new THREE.ExtrudeGeometry(VOUCH_SHAPES, { depth: 0.08, bevelEnabled: true, bevelSize: 0.008, bevelThickness: 0.008, bevelSegments: 2 }), [])
  const sheet = useMemo(() => resumeSheetTex(), [])
  return (
    <group position={[0, 0.02, 0]}>
      <group position={[0, 0.25, -0.16]} rotation={[-0.18, 0, 0]}>
        <mesh>
          <planeGeometry args={[0.46, 0.6]} />
          <meshStandardMaterial map={sheet} roughness={0.9} />
        </mesh>
        <mesh position={[0, 0, -0.01]} material={m.black}>
          <boxGeometry args={[0.5, 0.64, 0.01]} />
        </mesh>
      </group>
      <Spin speed={0.4}>
        <mesh geometry={geo} position={[0, 0.5, -0.04]} material={m.gold} />
      </Spin>
    </group>
  )
}

// ---------------------------------------------------------------- the corridor
const LEN = DOOR_Z - END_Z
const MID = (DOOR_Z + END_Z) / 2

function Corridor({ m }) {
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, MID]}>
        <planeGeometry args={[HALF * 2, LEN]} />
        <MeshReflectorMaterial
          map={m.slab}
          blur={[300, 80]}
          resolution={512}
          mixBlur={1}
          mixStrength={1.4}
          mixContrast={1}
          roughness={0.55}
          metalness={0.35}
          depthScale={0.8}
          minDepthThreshold={0.4}
          maxDepthThreshold={1.4}
          color="#ffffff"
        />
      </mesh>
      {/* walls behind the cases, the end wall and the ceiling */}
      {[-1, 1].map((s) => (
        <mesh key={s} position={[s * WALL, CEIL / 2, MID]} rotation={[0, -s * (Math.PI / 2), 0]} material={m.wood}>
          <planeGeometry args={[LEN, CEIL]} />
        </mesh>
      ))}
      <mesh position={[0, CEIL / 2, END_Z]} material={m.marble}>
        <planeGeometry args={[WALL * 2, CEIL]} />
      </mesh>
      <mesh position={[0, CEIL, MID]} rotation={[Math.PI / 2, 0, 0]} material={m.ceiling}>
        <planeGeometry args={[WALL * 2, LEN]} />
      </mesh>
      {/* recessed centre coffer and cove lines */}
      <mesh position={[0, CEIL - 0.01, MID]} rotation={[Math.PI / 2, 0, 0]} material={m.coffer}>
        <planeGeometry args={[1.4, LEN - 1]} />
      </mesh>
      {[-1, 1].map((s) => (
        <group key={s}>
          <mesh position={[s * 0.72, CEIL - 0.015, MID]} rotation={[Math.PI / 2, 0, 0]} material={m.led}>
            <planeGeometry args={[0.03, LEN - 1]} />
          </mesh>
          <mesh position={[s * (HALF - 0.05), CEIL - 0.015, MID]} rotation={[Math.PI / 2, 0, 0]} material={m.led}>
            <planeGeometry args={[0.04, LEN]} />
          </mesh>
          {/* glow line along the floor at the foot of the cases */}
          <mesh position={[s * (HALF - 0.04), 0.012, MID]} rotation={[-Math.PI / 2, 0, 0]} material={m.led}>
            <planeGeometry args={[0.035, LEN]} />
          </mesh>
          {/* the band above the cases */}
          <mesh position={[s * (HALF + 0.3), 3.4, MID]} material={m.wood}>
            <boxGeometry args={[0.6, 0.8, LEN]} />
          </mesh>
          {/* end-alcove panels between the last case and Rova */}
          <mesh position={[s * (HALF + 0.3), CEIL / 2, (SANCTUM_Z + END_Z) / 2]} material={m.wood}>
            <boxGeometry args={[0.6, CEIL, SANCTUM_Z - END_Z]} />
          </mesh>
          {[-1.9, -3.1, -4.3, -5.5].map((z) => (
            <mesh key={z} position={[s * (HALF - 0.005), 1.9, z]} rotation={[0, -s * (Math.PI / 2), 0]} material={m.led}>
              <planeGeometry args={[0.04, 2.4]} />
            </mesh>
          ))}
          {PILLARS.map((z) => (
            <mesh key={z} position={[s * (HALF + 0.3), 1.5, z]} material={m.wood}>
              <boxGeometry args={[0.62, 3.0, 0.4]} />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  )
}

// Recessed pot lights down the middle of the ceiling: a brass bezel, a bright
// lens and a soft cone of light under each. Only a few of them cast real light.
const POTS = [7.2, 5.2, 3.2, 1.2, -0.8, -2.8, -4.8]

function PotLights({ m }) {
  return (
    <group>
      {POTS.map((z) => (
        <group key={z} position={[0, CEIL, z]}>
          <mesh position={[0, -0.012, 0]} rotation={[Math.PI / 2, 0, 0]} material={m.brass}>
            <torusGeometry args={[0.12, 0.018, 8, 32]} />
          </mesh>
          <mesh position={[0, -0.014, 0]} rotation={[Math.PI / 2, 0, 0]} material={m.lens}>
            <circleGeometry args={[0.1, 28]} />
          </mesh>
          <mesh position={[0, -1.3, 0]} material={m.beam}>
            <cylinderGeometry args={[0.1, 0.75, 2.55, 28, 1, true]} />
          </mesh>
        </group>
      ))}
      {[5.2, 1.2, -2.8].map((z) => (
        <pointLight key={z} position={[0, CEIL - 0.3, z]} intensity={6} distance={6} decay={1.5} color="#fff4e2" />
      ))}
    </group>
  )
}

// A few gold bars, instanced: at the foot of the Rova sculpture and of the big cases.
function Gold({ m }) {
  const ref = useRef()
  const bar = useMemo(() => {
    const g = new THREE.CylinderGeometry(0.075, 0.1, 0.07, 4, 1)
    g.rotateY(Math.PI / 4)
    g.scale(1.9, 1, 0.75)
    return g
  }, [])
  const layout = useMemo(() => {
    const out = []
    const pile = (cx, cy, cz, base, rot = 0) => {
      for (let lvl = 0; lvl < base; lvl++) {
        const n = base - lvl
        for (let i = 0; i < n; i++) out.push([cx + Math.cos(rot) * (i - (n - 1) / 2) * 0.29, cy + 0.035 + lvl * 0.07, cz - Math.sin(rot) * (i - (n - 1) / 2) * 0.29, rot])
      }
    }
    pile(-1.25, 0, END_Z + 0.45, 4)
    pile(1.25, 0, END_Z + 0.45, 4)
    for (const c of CASES.filter((x) => x.big)) pile(c.side * (HALF + 0.27), 0.58, c.z + 0.72, 2, Math.PI / 2)
    return out
  }, [])
  useEffect(() => {
    const mat = new THREE.Matrix4()
    const q = new THREE.Quaternion()
    layout.forEach(([x, y, z, r], i) => {
      q.setFromAxisAngle(new THREE.Vector3(0, 1, 0), r)
      mat.compose(new THREE.Vector3(x, y, z), q, new THREE.Vector3(1, 1, 1))
      ref.current.setMatrixAt(i, mat)
    })
    ref.current.instanceMatrix.needsUpdate = true
  }, [layout])
  return <instancedMesh ref={ref} args={[bar, m.gold, layout.length]} />
}

// Banded cash stacked on the floor either side of the Rova sculpture.
function Cash({ m }) {
  return (
    <group>
      {[-1, 1].map((s) => (
        <group key={s} position={[s * 1.85, 0, END_Z + 0.4]}>
          {Array.from({ length: 10 }, (_, i) => (
            <mesh key={i} position={[(i % 2) * 0.17 - 0.085, 0.04 + Math.floor(i / 2) * 0.075, 0]} material={m.cash}>
              <boxGeometry args={[0.16, 0.07, 0.34]} />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  )
}

const hoverProps = (id, onHover, onSelect) => ({
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
})

// ---------------------------------------------------------------- a display case
function Case({ c, project, hovered, selected, onHover, onSelect, m, tex }) {
  const back = useRef()
  const W = c.big ? BIG_W : SMALL_W
  const y0 = c.big ? 0.35 : 0.85
  const y1 = c.big ? 3.0 : 2.45
  const H = y1 - y0
  const D = WALL - HALF - 0.06
  const lit = hovered === c.id || selected === c.id
  const plaque = useMemo(
    () => labelTexture({ key: `hof-${c.id}`, w: 768, h: 128, bg: '#c6a96c', lines: [{ text: project.name.toUpperCase(), size: project.name.length > 14 ? 44 : 54, font: 'sans', weight: 600, color: '#2a2118', spacing: 4 }] }),
    [c.id, project.name],
  )
  useFrame((state, dt) => {
    if (!back.current) return
    const breathe = 0.55 + 0.12 * Math.sin(state.clock.elapsedTime * 2 + c.z)
    back.current.emissiveIntensity = THREE.MathUtils.damp(back.current.emissiveIntensity, lit ? 1.15 : breathe, 8, dt)
  })
  const scale = c.big ? 1.1 : 0.72
  const obj = {
    vouch: <VouchMark m={m} />,
    lapzero: <F1 m={m} />,
    codegraphrag: <Graph m={m} />,
    heston: <Surface />,
    news: <News m={m} paper={tex.paper} tablet={tex.news} />,
    asl: <Asl m={m} hand={tex.hand} />,
    ict: <Candles m={m} />,
    automl: <Podium m={m} />,
    padlock: <Padlock m={m} />,
    invasion: (
      <group scale={0.36} position={[0, 0.47, 0]}>
        <ArcadeCabinet />
      </group>
    ),
  }[c.id]
  const pedH = c.big ? 0.75 : 0.25
  return (
    // local frame: the case opens toward +z, then turns to face the corridor
    <group position={[c.side * HALF, 0, c.z]} rotation={[0, -c.side * (Math.PI / 2), 0]} {...hoverProps(c.id, onHover, onSelect)}>
      {/* base below the case, with the brass plaque */}
      <mesh position={[0, y0 / 2, -D / 2]} material={m.wood}>
        <boxGeometry args={[W, y0, D]} />
      </mesh>
      <mesh position={[0, c.big ? 0.2 : 0.55, 0.002]}>
        <planeGeometry args={[Math.min(W - 0.3, 1.5), 0.17]} />
        <meshStandardMaterial map={plaque} metalness={0.7} roughness={0.3} />
      </mesh>
      {/* backlit back, sides and top */}
      <mesh position={[0, y0 + H / 2, -D]}>
        <planeGeometry args={[W, H]} />
        <meshStandardMaterial ref={back} map={tex.backlight} emissiveMap={tex.backlight} emissive="#ffffff" emissiveIntensity={0.6} roughness={0.8} />
      </mesh>
      {[-1, 1].map((s) => (
        <mesh key={s} position={[(s * W) / 2, y0 + H / 2, -D / 2]} rotation={[0, -s * (Math.PI / 2), 0]} material={m.caseSide}>
          <planeGeometry args={[D, H]} />
        </mesh>
      ))}
      <mesh position={[0, y1, -D / 2]} rotation={[Math.PI / 2, 0, 0]} material={m.caseSide}>
        <planeGeometry args={[W, D]} />
      </mesh>
      <mesh position={[0, y1 - 0.02, -0.06]} rotation={[Math.PI / 2, 0, 0]} material={m.led}>
        <planeGeometry args={[W - 0.1, 0.035]} />
      </mesh>
      {/* above the small cases, and between them and the band, more wood */}
      {!c.big && (
        <mesh position={[0, (y1 + 3.0) / 2, -D / 2]} material={m.wood}>
          <boxGeometry args={[W, 3.0 - y1, D]} />
        </mesh>
      )}
      {/* pedestal and object */}
      <mesh position={[0, y0 + pedH / 2, -D / 2]} material={m.black}>
        <boxGeometry args={[c.big ? 0.8 : 0.6, pedH, 0.36]} />
      </mesh>
      <group position={[0, y0 + pedH + 0.01, -D / 2 + 0.02]} scale={scale}>
        <Turntable active={selected === c.id}>
          <Suspense fallback={null}>{obj}</Suspense>
        </Turntable>
      </group>
      {/* glass front and its brass edge */}
      <mesh position={[0, y0 + H / 2, 0]} material={m.glass}>
        <planeGeometry args={[W, H]} />
      </mesh>
      {[y0, y1].map((y) => (
        <mesh key={y} position={[0, y, 0.01]} material={m.brass}>
          <boxGeometry args={[W, 0.025, 0.025]} />
        </mesh>
      ))}
      {c.big && <pointLight position={[0, y1 - 0.3, -0.25]} intensity={lit ? 5 : 3} distance={2.8} decay={1.6} color="#ffd9a8" />}
    </group>
  )
}

// ---------------------------------------------------------------- Rova, at the end of the walk
// Rova's pin floats over a glass pedestal under a white spotlight, in front of a
// backlit onyx niche, behind a short arc of velvet rope.
const PED_Z = END_Z + 1.3

// A backlit onyx niche set into the black marble end wall, behind the pedestal.
const onyxTex = () =>
  canvasTex(256, 512, (g, w, h) => {
    const grd = g.createLinearGradient(0, h, 0, 0)
    grd.addColorStop(0, '#5a3a1c')
    grd.addColorStop(0.55, '#e8c48a')
    grd.addColorStop(1, '#fff1d6')
    g.fillStyle = grd
    g.fillRect(0, 0, w, h)
    for (let i = 0; i < 12; i++) {
      g.strokeStyle = `rgba(${i % 2 ? '255,248,232' : '120,80,40'},${0.04 + (i % 4) * 0.02})`
      g.lineWidth = 1 + (i % 3)
      g.beginPath()
      let x = (i * 37) % w
      g.moveTo(x, 0)
      for (let y = 0; y <= h; y += 16) {
        x += Math.sin(i * 1.3 + y * 0.006) * 3
        g.lineTo(x, y)
      }
      g.stroke()
    }
  })

function RopeArc({ m }) {
  const posts = [-1.15, -0.4, 0.4, 1.15].map((a) => [Math.sin(a) * 1.15, PED_Z + Math.cos(a) * 1.15])
  const ropes = useMemo(
    () =>
      posts.slice(0, -1).map(([x, z], i) => {
        const [x2, z2] = posts[i + 1]
        const a = new THREE.Vector3(x, 0.86, z)
        const b = new THREE.Vector3(x2, 0.86, z2)
        const mid = a.clone().add(b).multiplyScalar(0.5).add(new THREE.Vector3(0, -0.18, 0))
        return new THREE.TubeGeometry(new THREE.QuadraticBezierCurve3(a, mid, b), 16, 0.022, 6, false)
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )
  return (
    <group>
      {posts.map(([x, z]) => (
        <group key={x} position={[x, 0, z]}>
          <mesh position={[0, 0.02, 0]} material={m.brass}>
            <cylinderGeometry args={[0.12, 0.14, 0.04, 20]} />
          </mesh>
          <mesh position={[0, 0.45, 0]} material={m.brass}>
            <cylinderGeometry args={[0.024, 0.024, 0.86, 10]} />
          </mesh>
          <mesh position={[0, 0.9, 0]} material={m.brass}>
            <sphereGeometry args={[0.05, 14, 10]} />
          </mesh>
        </group>
      ))}
      {ropes.map((g, i) => (
        <mesh key={i} geometry={g} material={m.velvet} />
      ))}
    </group>
  )
}

function RovaEnd({ project, hovered, selected, onHover, onSelect, m }) {
  const halo = useRef()
  const ring = useRef()
  const pin = useRef()
  const lit = hovered === 'rova' || selected === 'rova'
  const onyx = useMemo(() => onyxTex(), [])
  const plaque = useMemo(() => labelTexture({ key: 'hof-rova', w: 768, h: 128, bg: '#c6a96c', lines: [{ text: 'ROVA · PLAN LESS. GO OUT MORE.', size: 44, font: 'sans', weight: 600, color: '#2a2118', spacing: 4 }] }), [])
  const target = useMemo(() => new THREE.Object3D(), [])
  useFrame((state, dt) => {
    const t = state.clock.elapsedTime
    if (halo.current) halo.current.opacity = THREE.MathUtils.damp(halo.current.opacity, (lit ? 0.95 : 0.78) + 0.05 * Math.sin(t * 0.8), 4, dt)
    if (ring.current) ring.current.opacity = THREE.MathUtils.damp(ring.current.opacity, lit ? 0.95 : 0.55 + 0.2 * Math.sin(t * 2), 6, dt)
    if (pin.current) pin.current.position.y = 1.32 + (reduceMotion ? 0 : 0.04 * Math.sin(t * 1.4))
  })
  if (!project) return null
  return (
    <group {...hoverProps('rova', onHover, onSelect)}>
      {/* backlit onyx niche in the end wall, framed in brass */}
      <mesh position={[0, 2.0, END_Z + 0.03]} material={m.brass}>
        <boxGeometry args={[1.86, 3.06, 0.04]} />
      </mesh>
      <mesh position={[0, 2.0, END_Z + 0.055]}>
        <planeGeometry args={[1.76, 2.96]} />
        <meshBasicMaterial ref={halo} map={onyx} transparent opacity={0.85} toneMapped={false} />
      </mesh>
      <Sparkles count={22} scale={[1.2, 1.4, 1.2]} position={[0, 1.4, PED_Z]} size={1.8} speed={0.2} opacity={0.8} color="#fff4dc" />

      {/* glass pedestal, floating pin, halo ring */}
      <mesh position={[0, 0.5, PED_Z]} material={m.pedestalGlass}>
        <cylinderGeometry args={[0.28, 0.28, 1.0, 40]} />
      </mesh>
      {[0.01, 1.0].map((y) => (
        <mesh key={y} position={[0, y, PED_Z]} material={m.brass}>
          <cylinderGeometry args={[0.31, 0.31, 0.025, 40]} />
        </mesh>
      ))}
      <mesh position={[0, 0.16, PED_Z + 0.29]} rotation={[0, 0, 0]}>
        <planeGeometry args={[0.52, 0.085]} />
        <meshStandardMaterial map={plaque} metalness={0.7} roughness={0.3} />
      </mesh>
      <group ref={pin} position={[0, 1.32, PED_Z]}>
        <Turntable active={selected === 'rova'} pivot={0.3} grow={1.25}>
          <Suspense fallback={null}>
            <RovaPin size={0.62} />
          </Suspense>
        </Turntable>
      </group>
      <mesh position={[0, 1.62, PED_Z]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.46, 0.008, 8, 72]} />
        <meshBasicMaterial ref={ring} color="#fff3dc" transparent opacity={0.6} toneMapped={false} />
      </mesh>
      {/* the spotlight, with a faint visible beam */}
      <primitive object={target} position={[0, 1.2, PED_Z]} />
      <spotLight position={[0, CEIL - 0.05, PED_Z + 0.3]} target={target} angle={0.32} penumbra={0.6} intensity={lit ? 40 : 30} distance={6} decay={1.4} color="#ffffff" />
      <mesh position={[0, (CEIL + 0.9) / 2, PED_Z + 0.15]}>
        <cylinderGeometry args={[0.06, 0.6, CEIL - 0.9, 32, 1, true]} />
        <meshBasicMaterial color="#fff6e6" transparent opacity={0.05} depthWrite={false} side={THREE.DoubleSide} blending={THREE.AdditiveBlending} />
      </mesh>
      <mesh position={[0, 0.006, PED_Z]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.75, 48]} />
        <meshBasicMaterial color="#fff1d6" transparent opacity={0.08} depthWrite={false} />
      </mesh>
      <RopeArc m={m} />
      <pointLight position={[0, 2.6, END_Z + 1.2]} intensity={4} distance={4} decay={1.6} color="#ffe2b8" />
    </group>
  )
}

// ---------------------------------------------------------------- the top three
// A glass vitrine on a black plinth, turned toward the walk, with its rank in brass.
function Tower({ top, project, hovered, selected, onHover, onSelect, m }) {
  const glow = useRef()
  const lit = hovered === top.id || selected === top.id
  const plaque = useMemo(
    () =>
      labelTexture({
        key: `top-${top.id}`,
        w: 768,
        h: 192,
        bg: '#c6a96c',
        lines: [
          { text: `Nº ${top.rank}`, size: 40, font: 'mono', weight: 500, color: '#5a4320', spacing: 6 },
          { text: project.name.toUpperCase(), size: 54, font: 'sans', weight: 600, color: '#2a2118', spacing: 4 },
        ],
      }),
    [top.id, top.rank, project.name],
  )
  useFrame((state, dt) => {
    if (!glow.current) return
    glow.current.opacity = THREE.MathUtils.damp(glow.current.opacity, lit ? 0.9 : 0.35 + 0.15 * Math.sin(state.clock.elapsedTime * 2 + top.pos[0]), 8, dt)
  })
  const obj = top.id === 'vouch' ? <VouchMark m={m} /> : <F1 m={m} />
  const target = useMemo(() => new THREE.Object3D(), [])
  return (
    <group position={[top.pos[0], 0, top.pos[1]]} rotation={[0, top.rot, 0]} {...hoverProps(top.id, onHover, onSelect)}>
      <mesh position={[0, 0.45, 0]} material={m.black}>
        <boxGeometry args={[1.0, 0.9, 1.0]} />
      </mesh>
      <mesh position={[0, 0.905, 0]} material={m.brass}>
        <boxGeometry args={[1.04, 0.02, 1.04]} />
      </mesh>
      <mesh position={[0, 0.58, 0.502]}>
        <planeGeometry args={[0.8, 0.2]} />
        <meshStandardMaterial map={plaque} metalness={0.7} roughness={0.3} />
      </mesh>
      {/* the vitrine */}
      <mesh position={[0, 1.42, 0]} material={m.pedestalGlass}>
        <boxGeometry args={[0.98, 1.0, 0.98]} />
      </mesh>
      <mesh position={[0, 1.93, 0]} material={m.brass}>
        <boxGeometry args={[1.02, 0.025, 1.02]} />
      </mesh>
      <group position={[0, 0.93, 0]} scale={0.72}>
        <Turntable active={selected === top.id} pivot={0.3} grow={1.2}>
          <Suspense fallback={null}>{obj}</Suspense>
        </Turntable>
      </group>
      <mesh position={[0, 0.006, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.72, 0.77, 48]} />
        <meshBasicMaterial ref={glow} color="#e0b874" transparent opacity={0.4} depthWrite={false} />
      </mesh>
      <primitive object={target} position={[0, 1.2, 0]} />
      <spotLight position={[0, CEIL - 0.05, 0.4]} target={target} angle={0.36} penumbra={0.7} intensity={lit ? 26 : 18} distance={5} decay={1.4} color="#ffffff" />
    </group>
  )
}

// ---------------------------------------------------------------- camera
function Rig({ selected, walk }) {
  const pos = useMemo(() => new THREE.Vector3(), [])
  const look = useMemo(() => new THREE.Vector3(), [])
  const curLook = useRef(new THREE.Vector3(0, 1.5, 0))
  const w = useRef(0)
  useFrame((state, dt) => {
    const c = CASES.find((x) => x.id === selected)
    if (c) {
      const cy = c.big ? 1.55 : 1.6
      pos.set(-c.side * 0.85, 1.65, c.z + 0.7)
      look.set(c.side * (HALF + 0.25), cy, c.z)
    } else if (TOP.some((x) => x.id === selected)) {
      const tp = TOP.find((x) => x.id === selected)
      const [x, z] = tp.pos
      pos.set(x + Math.sin(tp.rot) * 2.3, 1.7, z + Math.cos(tp.rot) * 2.3)
      look.set(x, 1.35, z)
    } else if (selected === 'rova') {
      pos.set(0, 1.75, END_Z + 4.4)
      look.set(0, 1.6, END_Z)
    } else {
      w.current = THREE.MathUtils.damp(w.current, walk.current, reduceMotion ? 30 : 4, dt)
      const z = walkZ(w.current)
      pos.set(state.pointer.x * 0.3, 1.7 + state.pointer.y * 0.12, z)
      look.set(state.pointer.x * 0.6, 1.5, Math.max(END_Z, z - 7))
    }
    const k = 1 - Math.exp(-(reduceMotion ? 20 : 3) * Math.min(dt, 0.1))
    state.camera.position.lerp(pos, k)
    curLook.current.lerp(look, k)
    state.camera.lookAt(curLook.current)
  })
  return null
}

function Scene({ projects, hovered, selected, onHover, onSelect }) {
  const imgs = useTexture(['/residence/news.jpg'], (ts) => {
    ;(Array.isArray(ts) ? ts : [ts]).forEach((t) => (t.colorSpace = THREE.SRGBColorSpace))
  })
  const tex = useMemo(() => ({ news: imgs[0], paper: paperTex(), hand: handTex(), backlight: backlightTex() }), [imgs])
  const m = useMemo(() => {
    const slab = slabTex()
    slab.repeat.set(1, LEN / (HALF * 2))
    return {
      slab,
      wood: new THREE.MeshStandardMaterial({ color: '#17110d', roughness: 0.55, metalness: 0.15 }),
      marble: new THREE.MeshStandardMaterial({ map: marbleTex(), roughness: 0.2, metalness: 0.3 }),
      ceiling: new THREE.MeshStandardMaterial({ color: '#e9e1d3', roughness: 0.9 }),
      coffer: new THREE.MeshStandardMaterial({ color: '#f5eee2', emissive: '#f5e6cc', emissiveIntensity: 0.25, roughness: 0.9 }),
      led: new THREE.MeshBasicMaterial({ color: '#ffd9a0', toneMapped: false }),
      lens: new THREE.MeshBasicMaterial({ color: '#fff8ec', toneMapped: false }),
      beam: new THREE.MeshBasicMaterial({ color: '#fff3dc', transparent: true, opacity: 0.035, depthWrite: false, side: THREE.DoubleSide, blending: THREE.AdditiveBlending }),
      pedestalGlass: new THREE.MeshPhysicalMaterial({ color: '#dfe8ee', metalness: 0, roughness: 0.04, transparent: true, opacity: 0.22, clearcoat: 1, depthWrite: false }),
      ivoryPolished: new THREE.MeshPhysicalMaterial({ color: '#f1e7d6', roughness: 0.15, clearcoat: 1, metalness: 0.1 }),
      velvet: new THREE.MeshStandardMaterial({ color: '#6e1219', roughness: 0.85 }),
      caseSide: new THREE.MeshStandardMaterial({ color: '#3a2a1c', roughness: 0.7 }),
      glass: new THREE.MeshStandardMaterial({ color: '#ffffff', transparent: true, opacity: 0.06, roughness: 0.02, metalness: 1, depthWrite: false }),
      plinth: new THREE.MeshStandardMaterial({ color: '#1c1d1f', roughness: 0.5, metalness: 0.4 }),
      brass: new THREE.MeshStandardMaterial({ color: '#c6a96c', metalness: 1, roughness: 0.25 }),
      gold: new THREE.MeshStandardMaterial({ color: '#e0b552', metalness: 1, roughness: 0.18 }),
      goldFlat: new THREE.MeshStandardMaterial({ color: '#c9a24a', metalness: 0.9, roughness: 0.3 }),
      silver: new THREE.MeshStandardMaterial({ color: '#c9ccd1', metalness: 1, roughness: 0.2 }),
      bronze: new THREE.MeshStandardMaterial({ color: '#a8683a', metalness: 1, roughness: 0.3 }),
      steel: new THREE.MeshStandardMaterial({ color: '#8a8e93', metalness: 0.9, roughness: 0.3 }),
      black: new THREE.MeshStandardMaterial({ color: '#0e0e0f', roughness: 0.35, metalness: 0.4 }),
      tyre: new THREE.MeshStandardMaterial({ color: '#0d0d0d', roughness: 0.85 }),
      red: new THREE.MeshPhysicalMaterial({ color: '#8a1e16', metalness: 0.5, roughness: 0.25, clearcoat: 1 }),
      redFlat: new THREE.MeshStandardMaterial({ color: '#c0392b', roughness: 0.5, emissive: '#5a120d', emissiveIntensity: 0.6 }),
      green: new THREE.MeshStandardMaterial({ color: '#2e9e5b', roughness: 0.5, emissive: '#0f3a22', emissiveIntensity: 0.6 }),
      glassLens: new THREE.MeshPhysicalMaterial({ color: '#203040', roughness: 0.05, metalness: 0.5 }),
      cash: new THREE.MeshStandardMaterial({ map: cashTex(), roughness: 0.85 }),
    }
  }, [])
  const pick = (id) => projects.find((x) => x.id === id)
  return (
    <>
      <Corridor m={m} />
      <PotLights m={m} />
      <Gold m={m} />
      <Cash m={m} />
      {CASES.map((c) => pick(c.id) && <Case key={c.id} c={c} project={pick(c.id)} hovered={hovered} selected={selected} onHover={onHover} onSelect={onSelect} m={m} tex={tex} />)}
      {TOP.map((tp) => pick(tp.id) && <Tower key={tp.id} top={tp} project={pick(tp.id)} hovered={hovered} selected={selected} onHover={onHover} onSelect={onSelect} m={m} />)}
      <RovaEnd project={pick('rova')} hovered={hovered} selected={selected} onHover={onHover} onSelect={onSelect} m={m} />
    </>
  )
}

// Walk position of the thing that is selected, so stepping back leaves you beside it.
function walkOf(id) {
  const c = CASES.find((x) => x.id === id)
  if (c) return walkFor(c.z + 2.4)
  if (id === 'rova' || TOP.some((x) => x.id === id)) return 1
  return null
}

export default function VaultRoomScene({ projects, hovered, selected, onHover, onSelect, onWalk }) {
  const walk = useRef(0)
  const wrap = useRef()

  useEffect(() => {
    const w = walkOf(selected)
    if (w != null) walk.current = w
    onWalk?.(walk.current)
  }, [selected, onWalk])

  useEffect(() => {
    const el = wrap.current
    const step = (d) => {
      if (selected) onSelect(null)
      walk.current = THREE.MathUtils.clamp(walk.current + d, 0, 1)
      onWalk?.(walk.current)
    }
    const onWheel = (e) => {
      e.preventDefault()
      step(e.deltaY * 0.0011)
    }
    const onKey = (e) => {
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') step(0.1)
      else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') step(-0.1)
    }
    el.addEventListener('wheel', onWheel, { passive: false })
    window.addEventListener('keydown', onKey)
    return () => {
      el.removeEventListener('wheel', onWheel)
      window.removeEventListener('keydown', onKey)
    }
  }, [selected, onSelect, onWalk])

  return (
    <div ref={wrap} className="absolute inset-0">
      <Canvas dpr={[1, 1.6]} camera={{ position: [0, 1.7, WALK_FROM], fov: 56 }} gl={{ antialias: true }} onPointerMissed={() => onSelect(null)}>
        <color attach="background" args={['#0b0a09']} />
        <fog attach="fog" args={['#0b0a09', 16, 30]} />
        <hemisphereLight args={['#f3e6d2', '#1a1512', 0.4]} />
        <Environment resolution={256} frames={1}>
          <Lightformer form="rect" intensity={2.2} color="#fff1dc" position={[0, 4, 3]} scale={[8, 3, 1]} />
          <Lightformer form="rect" intensity={1.2} color="#e8a35a" position={[-5, 1, 1]} rotation-y={Math.PI / 2} scale={[6, 4, 1]} />
          <Lightformer form="ring" intensity={1.4} color="#ffffff" position={[0, 1, 6]} scale={2.5} />
        </Environment>
        <Rig selected={selected} walk={walk} />
        <Suspense fallback={null}>
          <Scene projects={projects} hovered={hovered} selected={selected} onHover={onHover} onSelect={onSelect} />
        </Suspense>
      </Canvas>
    </div>
  )
}

useGLTF.preload('/residence/rova-pin.glb')
