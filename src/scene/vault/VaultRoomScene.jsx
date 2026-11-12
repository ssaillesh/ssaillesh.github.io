import { Suspense, useLayoutEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, Lightformer, useTexture } from '@react-three/drei'
import * as THREE from 'three'
import { labelTexture } from '../inspect/textures.js'
import { ArcadeCabinet } from '../inspect/models.jsx'

// Inside the vault: a steel room lined with safe-deposit boxes, pallets of cash,
// pyramids of gold, and ten exhibits on plinths, one object per project.
// Camera looks in from the door; selecting an exhibit glides up to it.

const reduceMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

// Exhibit placement: back wall (facing +z), left wall (facing +x), right wall (facing -x).
const EXHIBITS = [
  { id: 'rova', pos: [-3.3, 0, -3.9], face: [0, 0, 1] },
  { id: 'lapzero', pos: [-1.1, 0, -3.9], face: [0, 0, 1] },
  { id: 'codegraphrag', pos: [1.1, 0, -3.9], face: [0, 0, 1] },
  { id: 'heston', pos: [3.3, 0, -3.9], face: [0, 0, 1] },
  { id: 'ict', pos: [-4.9, 0, -2.0], face: [1, 0, 0] },
  { id: 'news', pos: [-4.9, 0, 0.2], face: [1, 0, 0] },
  { id: 'automl', pos: [-4.9, 0, 2.4], face: [1, 0, 0] },
  { id: 'asl', pos: [4.9, 0, -2.0], face: [-1, 0, 0] },
  { id: 'padlock', pos: [4.9, 0, 0.2], face: [-1, 0, 0] },
  { id: 'invasion', pos: [4.9, 0, 2.4], face: [-1, 0, 0] },
]

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

const boxesTex = () =>
  canvasTex(512, 512, (g) => {
    g.fillStyle = '#3a3d41'
    g.fillRect(0, 0, 512, 512)
    for (let y = 0; y < 10; y++)
      for (let x = 0; x < 8; x++) {
        const px = 6 + x * 63
        const py = 6 + y * 50
        const grd = g.createLinearGradient(px, py, px, py + 44)
        grd.addColorStop(0, '#5a5e63')
        grd.addColorStop(1, '#43474b')
        g.fillStyle = grd
        g.fillRect(px, py, 58, 44)
        g.strokeStyle = '#25272a'
        g.lineWidth = 2
        g.strokeRect(px, py, 58, 44)
        g.fillStyle = '#c6a96c'
        g.beginPath()
        g.arc(px + 48, py + 22, 3.2, 0, Math.PI * 2)
        g.fill()
        g.fillStyle = '#25272a'
        g.font = '10px monospace'
        g.fillText(String(100 + y * 8 + x), px + 6, py + 14)
      }
  })

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

// ---------------------------------------------------------------- the room
function Room({ m }) {
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -0.5]} receiveShadow material={m.floor}>
        <planeGeometry args={[12, 9.5]} />
      </mesh>
      <mesh position={[0, 2.2, -4.75]} material={m.boxes}>
        <planeGeometry args={[12, 4.4]} />
      </mesh>
      {[-1, 1].map((s) => (
        <mesh key={s} position={[s * 6, 2.2, -0.5]} rotation={[0, -s * (Math.PI / 2), 0]} material={m.boxes}>
          <planeGeometry args={[9.5, 4.4]} />
        </mesh>
      ))}
      <mesh position={[0, 4.4, -0.5]} rotation={[Math.PI / 2, 0, 0]} material={m.ceiling}>
        <planeGeometry args={[12, 9.5]} />
      </mesh>
      {/* ceiling light strips */}
      {[-2.5, 0, 2.5].map((x) => (
        <mesh key={x} position={[x, 4.38, -0.5]} rotation={[Math.PI / 2, 0, 0]} material={m.strip}>
          <planeGeometry args={[0.12, 8]} />
        </mesh>
      ))}
      {/* brass floor inlay */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, -0.2]} material={m.brass}>
        <ringGeometry args={[2.0, 2.06, 72]} />
      </mesh>
    </group>
  )
}

// Pallets of banded cash, instanced.
function CashPallets({ m }) {
  const ref = useRef()
  const spots = [
    [-4.2, 3.4],
    [4.2, 3.4],
    [-2.0, 3.7],
    [2.0, 3.7],
    [-4.6, -4.1],
    [4.6, -4.1],
  ]
  const layout = useMemo(() => {
    const out = []
    spots.forEach(([cx, cz], si) => {
      const layers = si < 4 ? 6 : 8
      for (let y = 0; y < layers; y++)
        for (let ix = 0; ix < 3; ix++)
          for (let iz = 0; iz < 4; iz++) out.push([cx - 0.36 + ix * 0.36, 0.16 + y * 0.08, cz - 0.24 + iz * 0.16])
    })
    return out
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  useLayoutEffect(() => {
    const mat = new THREE.Matrix4()
    layout.forEach((p, i) => {
      mat.makeTranslation(...p)
      ref.current.setMatrixAt(i, mat)
    })
    ref.current.instanceMatrix.needsUpdate = true
  }, [layout])
  return (
    <group>
      {spots.map(([x, z]) => (
        <mesh key={`${x}${z}`} position={[x, 0.06, z]} material={m.pallet} castShadow>
          <boxGeometry args={[1.2, 0.12, 0.75]} />
        </mesh>
      ))}
      <instancedMesh ref={ref} args={[undefined, undefined, layout.length]} material={m.cash} castShadow>
        <boxGeometry args={[0.34, 0.075, 0.15]} />
      </instancedMesh>
    </group>
  )
}

// Pyramids of gold bars, instanced.
function GoldStacks({ m }) {
  const ref = useRef()
  const bar = useMemo(() => {
    const g = new THREE.CylinderGeometry(0.11, 0.15, 0.1, 4, 1)
    g.rotateY(Math.PI / 4)
    g.scale(1.9, 1, 0.75)
    return g
  }, [])
  const layout = useMemo(() => {
    const out = []
    const pyramid = (cx, cz, base) => {
      for (let lvl = 0; lvl < base; lvl++) {
        const n = base - lvl
        for (let i = 0; i < n; i++) for (let j = 0; j < 2; j++) out.push([cx + (i - (n - 1) / 2) * 0.42, 0.05 + lvl * 0.1, cz + (j - 0.5) * 0.24])
      }
    }
    pyramid(0, 1.2, 5)
    pyramid(-2.6, 0.4, 3)
    pyramid(2.6, 0.4, 3)
    pyramid(0, -2.2, 4)
    return out
  }, [])
  useLayoutEffect(() => {
    const mat = new THREE.Matrix4()
    layout.forEach((p, i) => {
      mat.makeTranslation(...p)
      ref.current.setMatrixAt(i, mat)
    })
    ref.current.instanceMatrix.needsUpdate = true
  }, [layout])
  return <instancedMesh ref={ref} args={[bar, m.gold, layout.length]} castShadow />
}

// ---------------------------------------------------------------- exhibits
function Spin({ speed = 0.4, children }) {
  const ref = useRef()
  useFrame((_, dt) => {
    if (ref.current && !reduceMotion) ref.current.rotation.y += dt * speed
  })
  return <group ref={ref}>{children}</group>
}

function Phone({ m, tex }) {
  return (
    <group position={[0, 0.1, 0]} rotation={[-0.15, 0, 0]}>
      <mesh position={[0, 0.02, -0.05]} material={m.black}>
        <boxGeometry args={[0.24, 0.04, 0.16]} />
      </mesh>
      <mesh position={[0, 0.5, 0]} material={m.black} castShadow>
        <boxGeometry args={[0.46, 0.92, 0.05]} />
      </mesh>
      <mesh position={[0, 0.5, 0.027]}>
        <planeGeometry args={[0.42, 0.86]} />
        <meshStandardMaterial map={tex} emissive="#ffffff" emissiveMap={tex} emissiveIntensity={0.8} toneMapped={false} />
      </mesh>
    </group>
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

function Exhibit({ ex, project, hovered, selected, onHover, onSelect, m, tex }) {
  const glow = useRef()
  const [x, , z] = ex.pos
  const rotY = Math.atan2(ex.face[0], ex.face[2])
  const plaque = useMemo(() => labelTexture({ key: `vplaque-${ex.id}`, w: 768, h: 128, bg: '#c6a96c', lines: [{ text: project.name.toUpperCase(), size: 54, font: 'sans', weight: 600, color: '#2a2118', spacing: 4 }] }), [ex.id, project.name])
  const lit = hovered === ex.id || selected === ex.id
  useFrame((state, dt) => {
    if (!glow.current) return
    const breathe = 0.25 + 0.15 * Math.sin(state.clock.elapsedTime * 2.2 + x)
    glow.current.opacity = THREE.MathUtils.damp(glow.current.opacity, lit ? 0.9 : breathe, 8, dt)
  })
  const obj = {
    rova: <Phone m={m} tex={tex.rova} />,
    lapzero: <F1 m={m} />,
    codegraphrag: <Graph m={m} />,
    heston: <Surface />,
    ict: <Candles m={m} />,
    news: <News m={m} paper={tex.paper} tablet={tex.news} />,
    automl: <Podium m={m} />,
    asl: <Asl m={m} hand={tex.hand} />,
    padlock: <Padlock m={m} />,
    invasion: (
      <group scale={0.36} position={[0, 0.47, 0]}>
        <ArcadeCabinet />
      </group>
    ),
  }[ex.id]
  return (
    <group position={[x, 0, z]} rotation={[0, rotY, 0]}>
      <group
        onPointerOver={(e) => {
          e.stopPropagation()
          onHover(ex.id)
          document.body.style.cursor = 'pointer'
        }}
        onPointerOut={() => {
          onHover(null)
          document.body.style.cursor = ''
        }}
        onClick={(e) => {
          e.stopPropagation()
          onSelect(ex.id)
        }}
      >
        <mesh position={[0, 0.5, 0]} material={m.plinth} castShadow receiveShadow>
          <boxGeometry args={[0.95, 1.0, 0.95]} />
        </mesh>
        <mesh position={[0, 1.005, 0]} material={m.brass}>
          <boxGeometry args={[0.99, 0.02, 0.99]} />
        </mesh>
        <mesh position={[0, 0.82, 0.478]}>
          <planeGeometry args={[0.8, 0.13]} />
          <meshStandardMaterial map={plaque} metalness={0.7} roughness={0.3} />
        </mesh>
        <group position={[0, 1.02, 0]}>
          <Suspense fallback={null}>{obj}</Suspense>
        </group>
        {/* invisible hit box over the object */}
        <mesh position={[0, 1.5, 0]} visible={false}>
          <boxGeometry args={[1.0, 1.1, 1.0]} />
        </mesh>
      </group>
      <mesh position={[0, 0.006, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.7, 0.76, 48]} />
        <meshBasicMaterial ref={glow} color="#e0b874" transparent opacity={0.3} depthWrite={false} />
      </mesh>
      <pointLight position={[0, 2.4, 0.7]} intensity={lit ? 6 : 3.5} distance={2.8} decay={1.6} color="#ffd9a8" />
    </group>
  )
}

function Rig({ selected }) {
  const pos = useMemo(() => new THREE.Vector3(), [])
  const look = useMemo(() => new THREE.Vector3(), [])
  const curLook = useRef(new THREE.Vector3(0, 1.0, -1.5))
  useFrame((state, dt) => {
    const ex = EXHIBITS.find((e) => e.id === selected)
    if (ex) {
      const [x, , z] = ex.pos
      pos.set(x + ex.face[0] * 2.3, 1.75, z + ex.face[2] * 2.3)
      look.set(x, 1.35, z)
    } else {
      // the view from the doorway, drifting gently with the pointer
      pos.set(state.pointer.x * 0.5, 2.6 + state.pointer.y * 0.2, 8.6)
      look.set(0, 1.0, -1.5)
    }
    const k = 1 - Math.exp(-(reduceMotion ? 20 : 3) * Math.min(dt, 0.1))
    state.camera.position.lerp(pos, k)
    curLook.current.lerp(look, k)
    state.camera.lookAt(curLook.current)
  })
  return null
}

function Scene({ projects, hovered, selected, onHover, onSelect }) {
  const imgs = useTexture(['/residence/rova.jpg', '/residence/news.jpg'], (ts) => {
    ;(Array.isArray(ts) ? ts : [ts]).forEach((t) => (t.colorSpace = THREE.SRGBColorSpace))
  })
  const tex = useMemo(() => ({ rova: imgs[0], news: imgs[1], paper: paperTex(), hand: handTex() }), [imgs])
  const m = useMemo(
    () => ({
      floor: new THREE.MeshStandardMaterial({ color: '#2a2b2d', roughness: 0.28, metalness: 0.3 }),
      boxes: new THREE.MeshStandardMaterial({ map: boxesTex(), metalness: 0.6, roughness: 0.4 }),
      ceiling: new THREE.MeshStandardMaterial({ color: '#141516', roughness: 0.9 }),
      strip: new THREE.MeshBasicMaterial({ color: '#ffe2b0', toneMapped: false }),
      plinth: new THREE.MeshStandardMaterial({ color: '#1c1d1f', roughness: 0.5, metalness: 0.4 }),
      brass: new THREE.MeshStandardMaterial({ color: '#c6a96c', metalness: 1, roughness: 0.25 }),
      gold: new THREE.MeshStandardMaterial({ color: '#e0b552', metalness: 1, roughness: 0.18 }),
      goldFlat: new THREE.MeshStandardMaterial({ color: '#c9a24a', metalness: 0.9, roughness: 0.3 }),
      silver: new THREE.MeshStandardMaterial({ color: '#c9ccd1', metalness: 1, roughness: 0.2 }),
      bronze: new THREE.MeshStandardMaterial({ color: '#a8683a', metalness: 1, roughness: 0.3 }),
      steel: new THREE.MeshStandardMaterial({ color: '#8a8e93', metalness: 0.9, roughness: 0.3 }),
      black: new THREE.MeshStandardMaterial({ color: '#111213', roughness: 0.45, metalness: 0.3 }),
      tyre: new THREE.MeshStandardMaterial({ color: '#0d0d0d', roughness: 0.85 }),
      red: new THREE.MeshPhysicalMaterial({ color: '#8a1e16', metalness: 0.5, roughness: 0.25, clearcoat: 1 }),
      redFlat: new THREE.MeshStandardMaterial({ color: '#c0392b', roughness: 0.5, emissive: '#5a120d', emissiveIntensity: 0.6 }),
      green: new THREE.MeshStandardMaterial({ color: '#2e9e5b', roughness: 0.5, emissive: '#0f3a22', emissiveIntensity: 0.6 }),
      glassLens: new THREE.MeshPhysicalMaterial({ color: '#203040', roughness: 0.05, metalness: 0.5 }),
      cash: new THREE.MeshStandardMaterial({ map: cashTex(), roughness: 0.85 }),
      pallet: new THREE.MeshStandardMaterial({ color: '#8a6a45', roughness: 0.9 }),
    }),
    [],
  )
  return (
    <>
      <Room m={m} />
      <CashPallets m={m} />
      <GoldStacks m={m} />
      {EXHIBITS.map((ex) => {
        const p = projects.find((x) => x.id === ex.id)
        if (!p) return null
        return <Exhibit key={ex.id} ex={ex} project={p} hovered={hovered} selected={selected} onHover={onHover} onSelect={onSelect} m={m} tex={tex} />
      })}
    </>
  )
}

export default function VaultRoomScene({ projects, hovered, selected, onHover, onSelect }) {
  return (
    <Canvas shadows dpr={[1, 1.6]} camera={{ position: [0, 2.6, 8.6], fov: 58 }} gl={{ antialias: true }} onPointerMissed={() => onSelect(null)}>
      <color attach="background" args={['#0b0c0d']} />
      <fog attach="fog" args={['#0b0c0d', 11, 22]} />
      <hemisphereLight args={['#f3e6d2', '#1a1512', 0.45]} />
      <directionalLight position={[3, 6, 5]} intensity={1.1} color="#fff1dc" castShadow shadow-mapSize={[1024, 1024]} />
      <pointLight position={[0, 3.8, 0]} intensity={14} distance={10} decay={1.6} color="#ffd9a8" />
      <Environment resolution={256} frames={1}>
        <Lightformer form="rect" intensity={2.2} color="#fff1dc" position={[0, 4, 3]} scale={[8, 3, 1]} />
        <Lightformer form="rect" intensity={1.2} color="#e8a35a" position={[-5, 1, 1]} rotation-y={Math.PI / 2} scale={[6, 4, 1]} />
        <Lightformer form="ring" intensity={1.4} color="#ffffff" position={[0, 1, 6]} scale={2.5} />
      </Environment>
      <Rig selected={selected} />
      <Suspense fallback={null}>
        <Scene projects={projects} hovered={hovered} selected={selected} onHover={onHover} onSelect={onSelect} />
      </Suspense>
    </Canvas>
  )
}
