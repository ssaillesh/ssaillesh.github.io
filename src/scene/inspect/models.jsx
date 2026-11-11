import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import * as THREE from 'three'
import { bookCoverTexture, certificateTexture, foilBagTexture, labelTexture, ledStripTexture, medalFaceTexture, resumePageTexture } from './textures.js'

// Close-up models for the inspection view. Each is authored to fit roughly a
// 2.4-unit box centred on the origin, facing +z (towards the viewer).

const M = {
  walnut: () => new THREE.MeshStandardMaterial({ color: '#4a3426', roughness: 0.45 }),
  gold: () => new THREE.MeshStandardMaterial({ color: '#d4af5f', metalness: 1, roughness: 0.2 }),
  silver: () => new THREE.MeshStandardMaterial({ color: '#c9ccd1', metalness: 1, roughness: 0.22 }),
  steel: () => new THREE.MeshStandardMaterial({ color: '#7b7f84', metalness: 0.9, roughness: 0.3 }),
  black: () => new THREE.MeshStandardMaterial({ color: '#141414', roughness: 0.5 }),
  ivory: () => new THREE.MeshStandardMaterial({ color: '#efe9dd', roughness: 0.9 }),
  leather: () => new THREE.MeshStandardMaterial({ color: '#5b3522', roughness: 0.55 }),
  glass: () => new THREE.MeshPhysicalMaterial({ color: '#e6eef2', roughness: 0.04, transmission: 0.9, thickness: 0.4, transparent: true, opacity: 0.6 }),
  rubber: () => new THREE.MeshStandardMaterial({ color: '#0c0c0c', roughness: 0.85 }),
}
const useMats = () => useMemo(() => Object.fromEntries(Object.entries(M).map(([k, f]) => [k, f()])), [])

function Spin({ speed = 0.4, children }) {
  const ref = useRef()
  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.y += dt * speed
  })
  return <group ref={ref}>{children}</group>
}

// ---------------------------------------------------------------- frames
function FramedCertificate({ texture, frame = 'walnut', seal = true }) {
  const m = useMats()
  return (
    <group>
      <mesh material={m[frame]} castShadow>
        <boxGeometry args={[2.5, 1.86, 0.1]} />
      </mesh>
      <mesh position={[0, 0, 0.052]} material={m.ivory}>
        <boxGeometry args={[2.3, 1.66, 0.01]} />
      </mesh>
      <mesh position={[0, 0, 0.06]}>
        <planeGeometry args={[2.1, 1.5]} />
        <meshStandardMaterial map={texture} roughness={0.85} />
      </mesh>
      <mesh position={[0, 0, 0.075]}>
        <planeGeometry args={[2.3, 1.66]} />
        <meshPhysicalMaterial color="#ffffff" roughness={0.02} transparent opacity={0.08} />
      </mesh>
      {seal && (
        <group position={[0.74, -0.47, 0.07]}>
          <mesh rotation={[Math.PI / 2, 0, 0]} material={m.gold}>
            <cylinderGeometry args={[0.16, 0.16, 0.02, 40]} />
          </mesh>
          <mesh position={[0, 0, 0.012]} material={m.gold}>
            <torusGeometry args={[0.16, 0.012, 8, 40]} />
          </mesh>
          {[-1, 1].map((s) => (
            <mesh key={s} position={[s * 0.06, -0.2, -0.005]} rotation={[0, 0, s * 0.25]}>
              <planeGeometry args={[0.07, 0.24]} />
              <meshStandardMaterial color="#7a2420" roughness={0.8} />
            </mesh>
          ))}
        </group>
      )}
    </group>
  )
}

export function Degree() {
  const tex = certificateTexture({
    key: 'degree',
    eyebrow: 'UNIVERSITY OF WATERLOO',
    lines: [
      { text: 'This is to certify that', size: 40, italic: true, color: '#5a4a35', gap: 90 },
      { text: 'Saillesh Somasundaram', size: 104, gap: 140 },
      { text: 'has been admitted to the degree of', size: 40, italic: true, color: '#5a4a35', gap: 100 },
      { text: 'Bachelor of Science', size: 84, gap: 90 },
      { text: 'HONOURS PHYSICS · CO-OP', size: 30, font: 'sans', color: '#7a5a22', spacing: 8, gap: 60 },
    ],
  })
  return <FramedCertificate texture={tex} />
}

export function Presidential() {
  const tex = certificateTexture({
    key: 'presidential',
    eyebrow: 'UNIVERSITY OF WATERLOO',
    accent: '#4d5a66',
    lines: [
      { text: 'Presidential Scholarship', size: 92, gap: 130 },
      { text: 'awarded to', size: 40, italic: true, color: '#5a4a35', gap: 100 },
      { text: 'Saillesh Somasundaram', size: 96, gap: 120 },
    ],
  })
  return <FramedCertificate texture={tex} frame="steel" seal={false} />
}

export function Distinction() {
  const m = useMats()
  const cover = bookCoverTexture({ key: 'distinction', title: 'Term Distinction', sub: 'UNIVERSITY OF WATERLOO' })
  return (
    <group rotation={[0.15, -0.35, 0]}>
      <mesh material={m.ivory} castShadow>
        <boxGeometry args={[1.5, 1.9, 0.26]} />
      </mesh>
      <mesh position={[0, 0, 0.136]}>
        <planeGeometry args={[1.56, 1.96]} />
        <meshStandardMaterial map={cover} roughness={0.6} />
      </mesh>
      <mesh position={[-0.77, 0, 0]} material={m.leather}>
        <boxGeometry args={[0.06, 1.96, 0.3]} />
      </mesh>
      <mesh position={[0, 0, -0.136]} rotation={[0, Math.PI, 0]} material={m.leather}>
        <planeGeometry args={[1.56, 1.96]} />
      </mesh>
    </group>
  )
}

// ---------------------------------------------------------------- medals
function Medal({ face, metal = 'gold', ribbon = '#7a2420' }) {
  const m = useMats()
  const faceMat = useMemo(() => new THREE.MeshStandardMaterial({ map: face, metalness: 0.85, roughness: 0.28 }), [face])
  return (
    <group>
      {/* ribbon */}
      {[-1, 1].map((s) => (
        <mesh key={s} position={[s * 0.22, 1.05, -0.05]} rotation={[0, 0, s * -0.32]}>
          <planeGeometry args={[0.34, 1.3]} />
          <meshStandardMaterial color={ribbon} roughness={0.75} side={THREE.DoubleSide} />
        </mesh>
      ))}
      <mesh position={[0, 0.72, 0]} material={m[metal]}>
        <torusGeometry args={[0.1, 0.03, 10, 24]} />
      </mesh>
      <group rotation={[Math.PI / 2, 0, 0]}>
        <mesh material={[m[metal], faceMat, m[metal]]} castShadow>
          <cylinderGeometry args={[0.66, 0.66, 0.09, 72]} />
        </mesh>
      </group>
      <mesh position={[0, 0, 0.046]} material={m[metal]}>
        <torusGeometry args={[0.66, 0.025, 10, 72]} />
      </mesh>
    </group>
  )
}

export function IdealMedal() {
  const face = medalFaceTexture({ key: 'ideal', base: ['#f1d68f', '#b88d3e'], ink: '#6a4f1d', ring: 'IDEAL SCHOLARSHIP', center: 'IDEAL', sub: 'SCHOLAR' })
  return <Medal face={face} />
}

export function CobaltMedallion() {
  const face = medalFaceTexture({ key: 'cobalt', base: ['#5a7fc0', '#1f3a6b'], ink: '#d8e2f2', ring: 'COBALT MEDALLION', center: 'Co' })
  return <Medal face={face} metal="silver" ribbon="#263d63" />
}

export function SecondPlace() {
  const face = medalFaceTexture({ key: 'second', base: ['#eef0f3', '#9ea3aa'], ink: '#3d4247', ring: 'AUTONOMOUS ROBOTICS', center: '2nd', sub: 'PLACE' })
  return (
    <group>
      <group position={[-0.5, 0.1, 0]} scale={0.85}>
        <Medal face={face} metal="silver" ribbon="#263d63" />
      </group>
      <group position={[0.95, -0.75, 0.2]} rotation={[0, -0.6, 0]}>
        <RobotModel />
      </group>
    </group>
  )
}

function RobotModel() {
  const m = useMats()
  const led = useMemo(() => new THREE.MeshStandardMaterial({ color: '#111', emissive: '#e8a35a', emissiveIntensity: 2 }), [])
  return (
    <group scale={0.9}>
      <mesh position={[0, 0.16, 0]} material={m.steel} castShadow>
        <boxGeometry args={[0.7, 0.18, 0.5]} />
      </mesh>
      <mesh position={[0.05, 0.33, 0]} material={m.black}>
        <boxGeometry args={[0.36, 0.16, 0.34]} />
      </mesh>
      <mesh position={[0.2, 0.46, 0]} rotation={[0, 0, 0]} material={m.black}>
        <cylinderGeometry args={[0.07, 0.07, 0.1, 20]} />
      </mesh>
      <mesh position={[0.36, 0.18, 0]} material={led}>
        <boxGeometry args={[0.02, 0.04, 0.3]} />
      </mesh>
      {[[-0.24, 0.28], [0.24, 0.28], [-0.24, -0.28], [0.24, -0.28]].map(([x, z]) => (
        <mesh key={`${x}${z}`} position={[x, 0.1, z]} rotation={[Math.PI / 2, 0, 0]} material={m.rubber}>
          <cylinderGeometry args={[0.1, 0.1, 0.07, 20]} />
        </mesh>
      ))}
    </group>
  )
}

export function PhysicsCrystal() {
  const m = useMats()
  const etch = labelTexture({
    key: 'physics-etch',
    w: 512,
    h: 768,
    lines: [
      { text: 'EXCELLENCE', size: 46, font: 'sans', weight: 600, color: 'rgba(255,255,255,.85)', spacing: 8, gap: 110 },
      { text: '100%', size: 170, color: 'rgba(255,255,255,.92)', gap: 150 },
      { text: 'PHYSICS', size: 52, font: 'sans', weight: 600, color: 'rgba(255,255,255,.85)', spacing: 12 },
    ],
  })
  return (
    <group position={[0, -0.1, 0]}>
      <mesh position={[0, -0.95, 0]} material={m.black} castShadow>
        <boxGeometry args={[1.3, 0.22, 0.6]} />
      </mesh>
      <mesh position={[0, 0.2, 0]} material={m.glass} castShadow>
        <boxGeometry args={[1.0, 2.1, 0.34]} />
      </mesh>
      <mesh position={[0, 0.2, 0.01]}>
        <planeGeometry args={[0.86, 1.3]} />
        <meshBasicMaterial map={etch} transparent depthWrite={false} />
      </mesh>
    </group>
  )
}

export function RoboticsTrophy() {
  const m = useMats()
  const cup = useMemo(() => {
    const pts = [
      [0, 0], [0.18, 0], [0.18, 0.06], [0.07, 0.12], [0.06, 0.55], [0.1, 0.62], [0.42, 0.75],
      [0.55, 1.05], [0.58, 1.35], [0.56, 1.38], [0.52, 1.36], [0.5, 1.08], [0.38, 0.82], [0, 0.78],
    ].map(([x, y]) => new THREE.Vector2(x, y))
    return new THREE.LatheGeometry(pts, 64)
  }, [])
  const plaque = labelTexture({
    key: 'robotics-plaque',
    w: 1024,
    h: 256,
    bg: '#c6a96c',
    lines: [
      { text: 'EXCELLENCE AWARD', size: 64, font: 'sans', weight: 600, color: '#2a2118', spacing: 8, gap: 86 },
      { text: 'Robotics', size: 78, color: '#2a2118' },
    ],
  })
  return (
    <group position={[0, -1.0, 0]}>
      <mesh position={[0, 0.2, 0]} material={m.black} castShadow>
        <boxGeometry args={[1.1, 0.4, 1.1]} />
      </mesh>
      <mesh position={[0, 0.2, 0.555]}>
        <planeGeometry args={[0.9, 0.24]} />
        <meshStandardMaterial map={plaque} metalness={0.6} roughness={0.35} />
      </mesh>
      <mesh geometry={cup} position={[0, 0.4, 0]} castShadow>
        <meshStandardMaterial color="#d4af5f" metalness={1} roughness={0.18} side={THREE.DoubleSide} />
      </mesh>
      {[-1, 1].map((s) => (
        <mesh key={s} position={[s * 0.62, 1.55, 0]} rotation={[0, 0, s * 0.2]} material={m.gold}>
          <torusGeometry args={[0.2, 0.035, 12, 32, Math.PI * 1.3]} />
        </mesh>
      ))}
    </group>
  )
}

// ---------------------------------------------------------------- workshop
export function ServerBlade() {
  const m = useMats()
  const leds = ledStripTexture()
  const tag = labelTexture({ key: 'symcor-tag', w: 1024, h: 256, bg: '#1c1d1f', align: 'left', lines: [
    { text: 'SYMCOR · DEVOPS ENGINEER', size: 54, font: 'mono', color: '#c6a96c', gap: 80 },
    { text: 'runner-fleet · rbac · vault', size: 40, font: 'mono', color: '#8e8a84' },
  ] })
  const ledMat = useMemo(() => new THREE.MeshStandardMaterial({ map: leds, emissive: '#ffffff', emissiveMap: leds, emissiveIntensity: 1.4 }), [leds])
  return (
    <group rotation={[0.18, -0.28, 0]} scale={1.05}>
      <mesh material={m.steel} castShadow>
        <boxGeometry args={[2.4, 0.3, 1.5]} />
      </mesh>
      <mesh position={[0, 0.02, 0.751]} material={ledMat}>
        <planeGeometry args={[1.1, 0.09]} />
      </mesh>
      <mesh position={[0.62, -0.06, 0.751]}>
        <planeGeometry args={[0.95, 0.15]} />
        <meshStandardMaterial map={tag} />
      </mesh>
      {[-1.1, 1.1].map((x) => (
        <mesh key={x} position={[x, 0, 0.8]} material={m.silver}>
          <boxGeometry args={[0.08, 0.24, 0.12]} />
        </mesh>
      ))}
      {Array.from({ length: 9 }, (_, i) => (
        <mesh key={i} position={[-0.95 + i * 0.24, 0.152, 0]} material={m.black}>
          <boxGeometry args={[0.16, 0.005, 1.3]} />
        </mesh>
      ))}
    </group>
  )
}

export function VialRack() {
  const m = useMats()
  const liquids = ['#7fb7c9', '#c9a24a', '#9fc4a0', '#d97757', '#7fb7c9', '#c9a24a', '#9fc4a0', '#d97757']
  const card = labelTexture({ key: 'omniabio-card', w: 1024, h: 384, bg: '#f3efe6', align: 'left', lines: [
    { text: 'OMNIABIO · QC', size: 70, font: 'sans', weight: 600, color: '#1b1a17', spacing: 6, gap: 96 },
    { text: 'anomaly check · Z-score', size: 50, font: 'mono', color: '#5c574d' },
  ] })
  return (
    <group rotation={[0.3, -0.4, 0]} position={[0, -0.3, 0]}>
      <mesh position={[0, 0, 0]} material={m.steel} castShadow>
        <boxGeometry args={[2.2, 0.08, 0.8]} />
      </mesh>
      <mesh position={[0, 0.5, 0]} material={m.steel}>
        <boxGeometry args={[2.2, 0.04, 0.8]} />
      </mesh>
      {liquids.map((c, i) => {
        const x = -0.84 + (i % 4) * 0.56
        const z = i < 4 ? -0.18 : 0.18
        return (
          <group key={i} position={[x, 0.05, z]}>
            <mesh position={[0, 0.45, 0]} material={m.glass}>
              <cylinderGeometry args={[0.09, 0.09, 0.9, 24]} />
            </mesh>
            <mesh position={[0, 0.28, 0]}>
              <cylinderGeometry args={[0.075, 0.075, 0.5, 24]} />
              <meshStandardMaterial color={c} roughness={0.2} transparent opacity={0.85} />
            </mesh>
            <mesh position={[0, 0.94, 0]} material={m.black}>
              <cylinderGeometry args={[0.1, 0.1, 0.08, 24]} />
            </mesh>
          </group>
        )
      })}
      <mesh position={[0, -0.25, 0.45]} rotation={[-0.2, 0, 0]}>
        <planeGeometry args={[1.4, 0.52]} />
        <meshStandardMaterial map={card} roughness={0.9} />
      </mesh>
    </group>
  )
}

// A pillowed snack bag: a subdivided plane pushed out into a cushion.
function SnackBag({ title, sub, keyName }) {
  const tex = foilBagTexture({ key: keyName, title, sub })
  const geo = useMemo(() => {
    const g = new THREE.PlaneGeometry(1.7, 2.2, 40, 48)
    const p = g.attributes.position
    for (let i = 0; i < p.count; i++) {
      const x = p.getX(i) / 0.85
      const y = p.getY(i) / 1.1
      const puff = Math.max(0, (1 - x * x) * (1 - Math.pow(Math.abs(y), 3)))
      p.setZ(i, puff * 0.32)
    }
    g.computeVertexNormals()
    return g
  }, [])
  const mat = useMemo(() => new THREE.MeshStandardMaterial({ map: tex, metalness: 0.45, roughness: 0.32, side: THREE.DoubleSide }), [tex])
  const back = useMemo(() => new THREE.MeshStandardMaterial({ color: '#c99a2a', metalness: 0.45, roughness: 0.35, side: THREE.DoubleSide }), [])
  const crimp = useMemo(() => {
    const c = document.createElement('canvas')
    c.width = 256
    c.height = 16
    const g = c.getContext('2d')
    for (let i = 0; i < 64; i++) {
      g.fillStyle = i % 2 ? '#b8892a' : '#e9c35a'
      g.fillRect(i * 4, 0, 4, 16)
    }
    const t = new THREE.CanvasTexture(c)
    t.colorSpace = THREE.SRGBColorSpace
    return t
  }, [])
  return (
    <group rotation={[0.08, -0.35, 0.05]}>
      <mesh geometry={geo} material={mat} castShadow />
      <mesh geometry={geo} material={back} rotation={[0, Math.PI, 0]} />
      {[1.13, -1.13].map((y) => (
        <mesh key={y} position={[0, y, 0]}>
          <boxGeometry args={[1.74, 0.1, 0.03]} />
          <meshStandardMaterial map={crimp} metalness={0.5} roughness={0.35} />
        </mesh>
      ))}
    </group>
  )
}

export const ChipsOps = () => <SnackBag keyName="bag-ops" title="PepsiCo" sub="SOFTWARE & OPERATIONS · 2024" />
export const ChipsData = () => <SnackBag keyName="bag-data" title="PepsiCo" sub="DATA ANALYST · 2023" />

export function LidarPuck() {
  const m = useMats()
  const band = useMemo(() => new THREE.MeshStandardMaterial({ color: '#101418', emissive: '#203040', emissiveIntensity: 0.6, metalness: 0.3, roughness: 0.1 }), [])
  return (
    <group position={[0, -0.6, 0]}>
      <mesh position={[0, 0.15, 0]} material={m.black} castShadow>
        <cylinderGeometry args={[0.75, 0.8, 0.3, 64]} />
      </mesh>
      <Spin speed={1.6}>
        <mesh position={[0, 0.6, 0]} material={band}>
          <cylinderGeometry args={[0.66, 0.66, 0.6, 64]} />
        </mesh>
        <mesh position={[0.67, 0.6, 0]}>
          <boxGeometry args={[0.02, 0.3, 0.12]} />
          <meshStandardMaterial color="#111" emissive="#e8a35a" emissiveIntensity={2.5} />
        </mesh>
      </Spin>
      <mesh position={[0, 1.0, 0]} material={m.steel}>
        <cylinderGeometry args={[0.7, 0.7, 0.2, 64]} />
      </mesh>
      <mesh position={[0, 1.12, 0]} material={m.black}>
        <cylinderGeometry args={[0.3, 0.3, 0.04, 40]} />
      </mesh>
    </group>
  )
}

// ---------------------------------------------------------------- foyer
export function NamePlate() {
  const m = useMats()
  const plate = labelTexture({ key: 'nameplate', w: 1024, h: 512, bg: '#c6a96c', lines: [
    { text: 'Saillesh.', size: 190, color: '#2a2118', gap: 170 },
    { text: 'ENGINEERING THROUGH CURIOSITY', size: 40, font: 'sans', weight: 600, color: '#4a3a22', spacing: 10 },
  ] })
  return (
    <group rotation={[0.1, -0.3, 0]}>
      <mesh material={m.black} castShadow>
        <boxGeometry args={[2.4, 1.3, 0.16]} />
      </mesh>
      <mesh position={[0, 0, 0.082]}>
        <planeGeometry args={[2.1, 1.05]} />
        <meshStandardMaterial map={plate} metalness={0.85} roughness={0.3} />
      </mesh>
    </group>
  )
}

export function ResumeFolio() {
  const m = useMats()
  const page = resumePageTexture()
  return (
    <group rotation={[-0.55, 0, 0]} position={[0, -0.2, 0]}>
      <mesh position={[-0.82, 0, 0]} rotation={[0, 0.12, 0]} material={m.leather} castShadow>
        <boxGeometry args={[1.6, 2.1, 0.06]} />
      </mesh>
      <mesh position={[0.82, 0, 0]} rotation={[0, -0.12, 0]} material={m.leather} castShadow>
        <boxGeometry args={[1.6, 2.1, 0.06]} />
      </mesh>
      <mesh position={[0.8, 0, 0.1]} rotation={[0, -0.12, 0]}>
        <planeGeometry args={[1.42, 1.86]} />
        <meshStandardMaterial map={page} roughness={0.9} />
      </mesh>
      <mesh position={[-0.8, 0.5, 0.05]} rotation={[0, 0.12, 0]} material={m.gold}>
        <boxGeometry args={[0.5, 0.04, 0.01]} />
      </mesh>
    </group>
  )
}

// ---------------------------------------------------------------- lounge
export function ScaleCar() {
  const m = useMats()
  const body = useMemo(() => {
    const s = new THREE.Shape()
    s.moveTo(-1.2, 0.12)
    s.lineTo(-1.15, 0.36)
    s.quadraticCurveTo(-0.6, 0.42, -0.3, 0.62)
    s.quadraticCurveTo(0.15, 0.78, 0.55, 0.5)
    s.quadraticCurveTo(1.0, 0.42, 1.2, 0.3)
    s.lineTo(1.2, 0.12)
    s.lineTo(-1.2, 0.12)
    const g = new THREE.ExtrudeGeometry(s, { depth: 0.78, bevelEnabled: true, bevelSize: 0.05, bevelThickness: 0.05, bevelSegments: 4 })
    g.translate(0, 0.1, -0.39)
    return g
  }, [])
  const paint = useMemo(() => new THREE.MeshPhysicalMaterial({ color: '#7a1f17', metalness: 0.6, roughness: 0.25, clearcoat: 1, clearcoatRoughness: 0.08 }), [])
  return (
    <group position={[0, -0.45, 0]} rotation={[0.12, -0.55, 0]} scale={1.1}>
      <mesh geometry={body} material={paint} castShadow />
      <mesh position={[0.05, 0.66, 0]} rotation={[0, 0, -0.08]}>
        <boxGeometry args={[0.74, 0.12, 0.7]} />
        <meshPhysicalMaterial color="#0d1115" metalness={0.2} roughness={0.05} clearcoat={1} />
      </mesh>
      {[[-0.72, 0.47], [0.78, 0.47], [-0.72, -0.47], [0.78, -0.47]].map(([x, z]) => (
        <group key={`${x}${z}`} position={[x, 0.2, z]}>
          <mesh rotation={[Math.PI / 2, 0, 0]} material={m.rubber}>
            <cylinderGeometry args={[0.21, 0.21, 0.15, 36]} />
          </mesh>
          <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, z > 0 ? 0.078 : -0.078]} material={m.gold}>
            <cylinderGeometry args={[0.13, 0.13, 0.01, 24]} />
          </mesh>
        </group>
      ))}
    </group>
  )
}

export function Dumbbell() {
  const m = useMats()
  return (
    <group rotation={[0.3, 0.4, 0.2]}>
      <mesh rotation={[0, 0, Math.PI / 2]} material={m.silver}>
        <cylinderGeometry args={[0.07, 0.07, 1.4, 24]} />
      </mesh>
      {[-1, 1].map((s) => (
        <group key={s}>
          <mesh position={[s * 0.62, 0, 0]} rotation={[0, 0, Math.PI / 2]} material={m.black} castShadow>
            <cylinderGeometry args={[0.42, 0.42, 0.28, 6]} />
          </mesh>
          <mesh position={[s * 0.82, 0, 0]} rotation={[0, 0, Math.PI / 2]} material={m.black}>
            <cylinderGeometry args={[0.36, 0.36, 0.12, 6]} />
          </mesh>
        </group>
      ))}
    </group>
  )
}

export function CastIronPan() {
  const m = useMats()
  const iron = useMemo(() => new THREE.MeshStandardMaterial({ color: '#1c1b1a', roughness: 0.6, metalness: 0.4 }), [])
  return (
    <group rotation={[0.6, -0.3, 0]} position={[-0.2, 0, 0]}>
      <mesh material={iron} castShadow>
        <cylinderGeometry args={[0.85, 0.75, 0.2, 64, 1, true]} />
      </mesh>
      <mesh position={[0, -0.1, 0]} material={iron}>
        <cylinderGeometry args={[0.75, 0.75, 0.04, 64]} />
      </mesh>
      <mesh position={[1.25, 0.02, 0]} rotation={[0, 0, Math.PI / 2 - 0.1]} material={m.walnut}>
        <cylinderGeometry args={[0.07, 0.09, 0.8, 20]} />
      </mesh>
      <mesh position={[0.82, 0.03, 0]} rotation={[0, 0, Math.PI / 2]} material={iron}>
        <cylinderGeometry args={[0.06, 0.06, 0.2, 16]} />
      </mesh>
    </group>
  )
}

export function Bicycle() {
  const m = useMats()
  const tube = (a, b, r = 0.03) => {
    const va = new THREE.Vector3(...a)
    const vb = new THREE.Vector3(...b)
    const mid = va.clone().add(vb).multiplyScalar(0.5)
    const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), vb.clone().sub(va).normalize())
    return { mid, q, len: va.distanceTo(vb), r }
  }
  const tubes = [
    tube([-0.62, 0, 0], [-0.1, 0.05, 0]),
    tube([-0.62, 0, 0], [-0.2, 0.6, 0]),
    tube([-0.1, 0.05, 0], [-0.2, 0.6, 0]),
    tube([-0.1, 0.05, 0], [0.45, 0.62, 0]),
    tube([-0.2, 0.6, 0], [0.45, 0.62, 0]),
    tube([0.45, 0.62, 0], [0.62, 0, 0], 0.025),
    tube([-0.2, 0.6, 0], [-0.24, 0.78, 0], 0.025),
    tube([0.45, 0.62, 0], [0.42, 0.82, 0], 0.025),
  ]
  return (
    <group position={[0, -0.3, 0]} rotation={[0, -0.5, 0]} scale={1.4}>
      {[-0.62, 0.62].map((x) => (
        <group key={x} position={[x, 0, 0]}>
          <mesh material={m.rubber}>
            <torusGeometry args={[0.36, 0.03, 12, 60]} />
          </mesh>
          <mesh material={m.silver}>
            <torusGeometry args={[0.33, 0.008, 6, 60]} />
          </mesh>
          {Array.from({ length: 8 }, (_, i) => (
            <mesh key={i} rotation={[0, 0, (i / 8) * Math.PI]} material={m.silver}>
              <boxGeometry args={[0.66, 0.004, 0.004]} />
            </mesh>
          ))}
        </group>
      ))}
      {tubes.map((t, i) => (
        <mesh key={i} position={t.mid} quaternion={t.q} material={m.gold} castShadow>
          <cylinderGeometry args={[t.r, t.r, t.len, 12]} />
        </mesh>
      ))}
      <mesh position={[-0.24, 0.8, 0]} material={m.leather}>
        <boxGeometry args={[0.22, 0.04, 0.1]} />
      </mesh>
      <mesh position={[0.42, 0.84, 0]} rotation={[Math.PI / 2, 0, 0]} material={m.black}>
        <cylinderGeometry args={[0.02, 0.02, 0.4, 10]} />
      </mesh>
    </group>
  )
}

export function Photograph() {
  const m = useMats()
  const tex = useTexture('/residence/explore-lake.jpg', (t) => {
    t.colorSpace = THREE.SRGBColorSpace
  })
  return (
    <group rotation={[0, -0.25, 0]}>
      <mesh material={m.black} castShadow>
        <boxGeometry args={[2.3, 1.8, 0.08]} />
      </mesh>
      <mesh position={[0, 0, 0.041]} material={m.ivory}>
        <planeGeometry args={[2.14, 1.64]} />
      </mesh>
      <mesh position={[0, 0, 0.045]}>
        <planeGeometry args={[1.9, 1.42]} />
        <meshStandardMaterial map={tex} roughness={0.7} />
      </mesh>
    </group>
  )
}
