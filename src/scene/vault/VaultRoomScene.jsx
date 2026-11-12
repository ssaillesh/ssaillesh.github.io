import { Suspense, useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, Lightformer, useGLTF, useTexture } from '@react-three/drei'
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
const WALK_TO = -3.0

// side -1 = left wall, +1 = right wall. z is the case centre along the corridor.
const CASES = [
  { id: 'vouch', side: -1, z: -2.2, big: true },
  { id: 'lapzero', side: 1, z: -2.2, big: true },
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
const PILLARS = [8.0, 6.4, 4.8, 2.0, -0.8, -3.6]

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


// Chevron marble: black and white bands meeting in a V down the corridor, with brass seams.
const chevronTex = () => {
  const w = 512
  const h = 512
  const c = document.createElement('canvas')
  c.width = w
  c.height = h
  const g = c.getContext('2d')
  const img = g.createImageData(w, h)
  const band = 36
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++) {
      const d = y + Math.abs(x - w / 2)
      const k = Math.floor(d / band)
      const f = (d % band) / band
      const vein = 0.5 + 0.5 * Math.sin(x * 0.045 + y * 0.02 + Math.sin(y * 0.013 + x * 0.007) * 4)
      let r
      let gg
      let b
      if (f < 0.035 || Math.abs(x - w / 2) < 1.5) {
        r = 198
        gg = 169
        b = 108
      } else if (k % 2) {
        const v = 226 + vein * 18
        r = v
        gg = v - 3
        b = v - 9
      } else {
        const v = 20 + vein * 16
        r = v
        gg = v
        b = v + 2
      }
      const i = (y * w + x) * 4
      img.data[i] = r
      img.data[i + 1] = gg
      img.data[i + 2] = b
      img.data[i + 3] = 255
    }
  g.putImageData(img, 0, 0)
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
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
function Spin({ speed = 0.4, children }) {
  const ref = useRef()
  useFrame((_, dt) => {
    if (ref.current && !reduceMotion) ref.current.rotation.y += dt * speed
  })
  return <group ref={ref}>{children}</group>
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
        <mesh position={[0, 0.06, -0.6]} rotation={[Math.PI / 2, 0, 0]} material={m.red}>
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
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, MID]} material={m.chevron}>
        <planeGeometry args={[HALF * 2, LEN]} />
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
          <mesh position={[s * (HALF + 0.3), CEIL / 2, (-3.8 + END_Z) / 2]} material={m.wood}>
            <boxGeometry args={[0.6, CEIL, -3.8 - END_Z]} />
          </mesh>
          {[-4.6, -5.9].map((z) => (
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

function Pendants({ m }) {
  return (
    <group>
      {[5.0, 1.8, -1.4, -4.4].map((z) =>
        [0, 1].map((i) => {
          const y = i ? 2.55 : 2.9
          const dz = i ? 0.18 : -0.18
          return (
            <group key={`${z}${i}`} position={[0, 0, z + dz]}>
              <mesh position={[0, (CEIL + y) / 2, 0]} material={m.brass}>
                <cylinderGeometry args={[0.006, 0.006, CEIL - y, 6]} />
              </mesh>
              <mesh position={[0, y, 0]} material={m.globe}>
                <sphereGeometry args={[0.11, 20, 14]} />
              </mesh>
              <mesh position={[0, y + 0.12, 0]} material={m.brass}>
                <cylinderGeometry args={[0.03, 0.05, 0.05, 14]} />
              </mesh>
            </group>
          )
        }),
      )}
      {[2.7, -2.5].map((z) => (
        <pointLight key={z} position={[0, 2.6, z]} intensity={5} distance={7} decay={1.6} color="#ffd9a8" />
      ))}
    </group>
  )
}

// A few gold bars, instanced: on the Rova console and at the foot of the big cases.
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
    pile(-0.75, 0.9, END_Z + 0.32, 3)
    pile(0.75, 0.9, END_Z + 0.32, 3)
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

// Banded cash stacked on the floor either side of the Rova console.
function Cash({ m }) {
  return (
    <group>
      {[-1, 1].map((s) => (
        <group key={s} position={[s * 1.55, 0, END_Z + 0.45]}>
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
        <Suspense fallback={null}>{obj}</Suspense>
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
function RovaEnd({ project, hovered, selected, onHover, onSelect, m, tex }) {
  const ring = useRef()
  const lit = hovered === 'rova' || selected === 'rova'
  const plaque = useMemo(() => labelTexture({ key: 'hof-rova', w: 512, h: 96, bg: '#c6a96c', lines: [{ text: 'ROVA', size: 54, font: 'sans', weight: 600, color: '#2a2118', spacing: 10 }] }), [])
  useFrame((state, dt) => {
    if (!ring.current) return
    const breathe = 0.3 + 0.15 * Math.sin(state.clock.elapsedTime * 2.2)
    ring.current.opacity = THREE.MathUtils.damp(ring.current.opacity, lit ? 0.9 : breathe, 8, dt)
  })
  if (!project) return null
  return (
    <group {...hoverProps('rova', onHover, onSelect)}>
      {/* the framed portrait */}
      <mesh position={[0, 2.15, END_Z + 0.03]} material={m.brass}>
        <boxGeometry args={[2.72, 1.12, 0.04]} />
      </mesh>
      <mesh position={[0, 2.15, END_Z + 0.055]}>
        <planeGeometry args={[2.6, 1.0]} />
        <meshStandardMaterial map={tex.rova} emissiveMap={tex.rova} emissive="#ffffff" emissiveIntensity={0.35} roughness={0.6} />
      </mesh>
      {/* the console and the pin */}
      <mesh position={[0, 0.45, END_Z + 0.3]} material={m.black}>
        <boxGeometry args={[2.0, 0.9, 0.5]} />
      </mesh>
      <mesh position={[0, 0.905, END_Z + 0.3]} material={m.brass}>
        <boxGeometry args={[2.04, 0.02, 0.54]} />
      </mesh>
      <mesh position={[0, 0.62, END_Z + 0.552]}>
        <planeGeometry args={[0.7, 0.13]} />
        <meshStandardMaterial map={plaque} metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.95, END_Z + 0.32]} material={m.black}>
        <cylinderGeometry args={[0.16, 0.19, 0.08, 28]} />
      </mesh>
      <group position={[0, 0.99, END_Z + 0.32]}>
        <Suspense fallback={null}>
          <RovaPin size={0.72} />
        </Suspense>
      </group>
      <mesh position={[0, 0.006, END_Z + 1.3]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.8, 0.86, 56]} />
        <meshBasicMaterial ref={ring} color="#e0b874" transparent opacity={0.3} depthWrite={false} />
      </mesh>
      <pointLight position={[0, 2.8, END_Z + 1.6]} intensity={lit ? 8 : 6} distance={4.5} decay={1.6} color="#ffe2b8" />
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
    } else if (selected === 'rova') {
      pos.set(0, 1.7, END_Z + 3.4)
      look.set(0, 1.55, END_Z)
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
  const imgs = useTexture(['/residence/news.jpg', '/residence/rova-wordmark.jpg'], (ts) => {
    ;(Array.isArray(ts) ? ts : [ts]).forEach((t) => (t.colorSpace = THREE.SRGBColorSpace))
  })
  const tex = useMemo(() => ({ news: imgs[0], rova: imgs[1], paper: paperTex(), hand: handTex(), backlight: backlightTex() }), [imgs])
  const m = useMemo(() => {
    const chevron = chevronTex()
    chevron.repeat.set(1, LEN / (HALF * 2))
    return {
      chevron: new THREE.MeshStandardMaterial({ map: chevron, roughness: 0.18, metalness: 0.25 }),
      wood: new THREE.MeshStandardMaterial({ color: '#17110d', roughness: 0.55, metalness: 0.15 }),
      marble: new THREE.MeshStandardMaterial({ map: marbleTex(), roughness: 0.2, metalness: 0.3 }),
      ceiling: new THREE.MeshStandardMaterial({ color: '#e9e1d3', roughness: 0.9 }),
      coffer: new THREE.MeshStandardMaterial({ color: '#f5eee2', emissive: '#f5e6cc', emissiveIntensity: 0.25, roughness: 0.9 }),
      led: new THREE.MeshBasicMaterial({ color: '#ffd9a0', toneMapped: false }),
      globe: new THREE.MeshStandardMaterial({ color: '#fff1d6', emissive: '#ffd59a', emissiveIntensity: 2.2, toneMapped: false }),
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
      <Pendants m={m} />
      <Gold m={m} />
      <Cash m={m} />
      {CASES.map((c) => pick(c.id) && <Case key={c.id} c={c} project={pick(c.id)} hovered={hovered} selected={selected} onHover={onHover} onSelect={onSelect} m={m} tex={tex} />)}
      <RovaEnd project={pick('rova')} hovered={hovered} selected={selected} onHover={onHover} onSelect={onSelect} m={m} tex={tex} />
    </>
  )
}

// Walk position of the thing that is selected, so stepping back leaves you beside it.
function walkOf(id) {
  const c = CASES.find((x) => x.id === id)
  if (c) return walkFor(c.z + 2.4)
  if (id === 'rova') return 1
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
