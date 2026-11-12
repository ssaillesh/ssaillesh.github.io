import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import * as THREE from 'three'
import { carBodyGeometry, wheelPositions } from '../carGeometry.js'
import { reportPageTexture, introCardTexture, bookCoverTexture, certificateTexture, drawerLabelTexture, foilBagTexture, labelTexture, ledStripTexture, medalFaceTexture, phoneCardTexture, pipelineScreenTexture, resumePageTexture, spineTexture, sqlScreenTexture } from './textures.js'

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

// IDEAL Scholar Award, presented as the Cobalt Medallion
export function IdealMedal() {
  const face = medalFaceTexture({ key: 'ideal-cobalt', base: ['#5a7fc0', '#1f3a6b'], ink: '#e2e9f4', ring: 'IDEAL SCHOLAR · COBALT MEDALLION', center: 'IDEAL', sub: 'SCHOLAR' })
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

// ---------------------------------------------------------------- new artifacts
function Screen({ texture, w = 2.2, h = 1.375 }) {
  return (
    <mesh position={[0, 0, 0.026]}>
      <planeGeometry args={[w, h]} />
      <meshStandardMaterial map={texture} emissive="#ffffff" emissiveMap={texture} emissiveIntensity={0.75} roughness={0.35} toneMapped={false} />
    </mesh>
  )
}

// PepsiCo, Data Analyst: a monitor full of SQL
export function SqlMonitor() {
  const m = useMats()
  const tex = sqlScreenTexture()
  return (
    <group rotation={[0.05, -0.3, 0]} position={[0, 0.1, 0]}>
      <mesh material={m.black} castShadow>
        <boxGeometry args={[2.34, 1.5, 0.05]} />
      </mesh>
      <Screen texture={tex} />
      <mesh position={[0, -0.95, -0.1]} material={m.steel}>
        <boxGeometry args={[0.12, 0.45, 0.06]} />
      </mesh>
      <mesh position={[0, -1.18, 0]} material={m.steel} castShadow>
        <boxGeometry args={[0.8, 0.04, 0.45]} />
      </mesh>
    </group>
  )
}

// Symcor: a laptop running a passing CI pipeline, and a hardware security key
export function LaptopKey() {
  const m = useMats()
  const tex = pipelineScreenTexture()
  const keyLabel = labelTexture({ key: 'key-label', w: 256, h: 128, bg: '#c6a96c', lines: [{ text: 'IAM', size: 64, font: 'mono', weight: 600, color: '#1b1a17' }] })
  return (
    <group rotation={[0.35, -0.45, 0]} position={[0, -0.25, 0]}>
      {/* base with keyboard */}
      <mesh material={m.steel} castShadow>
        <boxGeometry args={[2.2, 0.06, 1.45]} />
      </mesh>
      <mesh position={[0, 0.032, 0.12]} rotation={[-Math.PI / 2, 0, 0]} material={m.black}>
        <planeGeometry args={[1.9, 0.7]} />
      </mesh>
      <mesh position={[0, 0.032, 0.6]} rotation={[-Math.PI / 2, 0, 0]} material={m.black}>
        <planeGeometry args={[0.6, 0.3]} />
      </mesh>
      {/* lid */}
      <group position={[0, 0.03, -0.72]} rotation={[-0.32, 0, 0]}>
        <mesh position={[0, 0.7, -0.02]} material={m.steel} castShadow>
          <boxGeometry args={[2.2, 1.4, 0.04]} />
        </mesh>
        <group position={[0, 0.7, 0]}>
          <Screen texture={tex} w={2.04} h={1.27} />
        </group>
      </group>
      {/* security key */}
      <group position={[1.45, 0.02, 0.5]} rotation={[0, -0.5, 0]}>
        <mesh material={m.black} castShadow>
          <boxGeometry args={[0.22, 0.05, 0.5]} />
        </mesh>
        <mesh position={[0, 0.026, 0.06]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.07, 24]} />
          <meshStandardMaterial color="#c6a96c" metalness={1} roughness={0.25} />
        </mesh>
        <mesh position={[0, 0, -0.3]} material={m.silver}>
          <boxGeometry args={[0.14, 0.03, 0.14]} />
        </mesh>
        <mesh position={[0, 0.026, 0.16]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.16, 0.08]} />
          <meshStandardMaterial map={keyLabel} />
        </mesh>
      </group>
    </group>
  )
}

function Shoe({ x, r, flip, m, knit, accent }) {
  // rounded sole + a curved knit upper, laces and a brass side stripe
  return (
    <group position={[x, -0.55, 0]} rotation={[0, r, 0]} scale={[flip ? -1 : 1, 1, 1]}>
      <mesh position={[0, 0.07, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[1, 1, 0.32]} material={m.ivory} castShadow>
        <capsuleGeometry args={[0.26, 1.0, 8, 24]} />
      </mesh>
      <mesh position={[0, 0.25, -0.12]} scale={[0.25, 0.24, 0.62]} material={knit} castShadow>
        <sphereGeometry args={[1, 32, 24]} />
      </mesh>
      <mesh position={[0, 0.36, -0.42]} rotation={[0.3, 0, 0]} material={knit}>
        <torusGeometry args={[0.17, 0.035, 10, 28]} />
      </mesh>
      <mesh position={[flip ? -0.245 : 0.245, 0.24, -0.08]} rotation={[0, Math.PI / 2, -0.12]} material={accent}>
        <planeGeometry args={[0.8, 0.05]} />
      </mesh>
      {[0, 1, 2, 3].map((i) => (
        <mesh key={i} position={[0, 0.49 - i * 0.012, -0.12 + i * 0.1]} rotation={[0.2, 0, 0]} material={m.ivory}>
          <boxGeometry args={[0.2, 0.015, 0.025]} />
        </mesh>
      ))}
    </group>
  )
}

export function RunningShoes() {
  const m = useMats()
  const knit = useMemo(() => new THREE.MeshStandardMaterial({ color: '#3a4652', roughness: 0.9 }), [])
  const accent = useMemo(() => new THREE.MeshStandardMaterial({ color: '#c6a96c', roughness: 0.5, metalness: 0.3 }), [])
  return (
    <group rotation={[0.25, 0.75, 0]} position={[0, 0.15, 0]} scale={1.2}>
      <Shoe x={-0.4} r={0.25} m={m} knit={knit} accent={accent} />
      <Shoe x={0.45} r={-0.15} flip m={m} knit={knit} accent={accent} />
    </group>
  )
}

export function Textbooks() {
  const books = [
    { title: 'Signals & Systems', color: '#2f3b3a', h: 0.32 },
    { title: 'Data Structures', color: '#5b3a2a', h: 0.28 },
    { title: 'Algorithms', color: '#3a2e2a', h: 0.34 },
    { title: 'Computational Physics', color: '#4a4f4a', h: 0.3 },
    { title: 'Computational Modeling', color: '#6b3c2c', h: 0.27 },
  ]
  let y = -0.9
  return (
    <group rotation={[0.25, -0.5, 0]}>
      {books.map((b, i) => {
        const yy = y + b.h / 2
        y += b.h
        const spine = spineTexture({ key: `spine-${i}`, title: b.title, color: b.color })
        return (
          <group key={b.title} position={[(i % 2 ? 0.06 : -0.05), yy, 0]} rotation={[0, (i - 2) * 0.06, 0]}>
            <mesh castShadow>
              <boxGeometry args={[2.0, b.h, 1.4]} />
              <meshStandardMaterial color={b.color} roughness={0.7} />
            </mesh>
            <mesh position={[0, 0, 0.701]}>
              <planeGeometry args={[2.0, b.h]} />
              <meshStandardMaterial map={spine} roughness={0.6} />
            </mesh>
            <mesh position={[1.001, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
              <planeGeometry args={[1.36, b.h - 0.04]} />
              <meshStandardMaterial color="#efe6d2" roughness={0.95} />
            </mesh>
          </group>
        )
      })}
    </group>
  )
}

export function Microscope() {
  const m = useMats()
  const enamel = useMemo(() => new THREE.MeshStandardMaterial({ color: '#e9e5dd', roughness: 0.35 }), [])
  return (
    <group position={[0, -1.1, 0]} rotation={[0, -0.6, 0]}>
      <mesh position={[0, 0.06, 0.1]} material={enamel} castShadow>
        <boxGeometry args={[1.0, 0.12, 1.1]} />
      </mesh>
      <mesh position={[0, 0.8, -0.3]} rotation={[0.15, 0, 0]} material={enamel} castShadow>
        <boxGeometry args={[0.26, 1.5, 0.3]} />
      </mesh>
      <mesh position={[0, 0.75, 0.15]} material={m.black}>
        <boxGeometry args={[0.7, 0.05, 0.6]} />
      </mesh>
      <mesh position={[0, 0.79, 0.15]}>
        <boxGeometry args={[0.36, 0.01, 0.12]} />
        <meshPhysicalMaterial color="#cfe0ea" transparent opacity={0.6} roughness={0.05} />
      </mesh>
      <mesh position={[0, 1.45, 0.05]} rotation={[0.55, 0, 0]} material={m.black} castShadow>
        <cylinderGeometry args={[0.11, 0.13, 0.9, 32]} />
      </mesh>
      <mesh position={[0, 1.86, -0.2]} rotation={[0.55, 0, 0]} material={m.silver}>
        <cylinderGeometry args={[0.07, 0.07, 0.25, 24]} />
      </mesh>
      {[-0.08, 0, 0.08].map((x, i) => (
        <mesh key={x} position={[x, 1.02, 0.3]} material={m.silver}>
          <cylinderGeometry args={[0.03, 0.025, 0.18 + i * 0.03, 16]} />
        </mesh>
      ))}
      <mesh position={[0.19, 0.55, -0.3]} rotation={[0, 0, Math.PI / 2]} material={m.silver}>
        <cylinderGeometry args={[0.12, 0.12, 0.06, 24]} />
      </mesh>
    </group>
  )
}

export function ToolChest() {
  const m = useMats()
  const red = useMemo(() => new THREE.MeshStandardMaterial({ color: '#8f2a22', roughness: 0.35, metalness: 0.4 }), [])
  const drawers = ['PYTHON · SQL · BASH', 'GITLAB CI · DOCKER', 'K8S · TERRAFORM', 'ANSIBLE · VAULT', 'PROMETHEUS · GRAFANA']
  return (
    <group rotation={[0.15, -0.5, 0]} position={[0, -0.1, 0]}>
      <mesh material={red} castShadow>
        <boxGeometry args={[1.9, 2.0, 1.0]} />
      </mesh>
      {drawers.map((d, i) => {
        const y = 0.72 - i * 0.36
        const label = drawerLabelTexture({ key: `drawer-${i}`, text: d })
        return (
          <group key={d} position={[0, y, 0.505]}>
            <mesh>
              <boxGeometry args={[1.75, 0.3, 0.02]} />
              <primitive object={red} attach="material" />
            </mesh>
            <mesh position={[0, 0.06, 0.012]}>
              <planeGeometry args={[1.5, 0.12]} />
              <meshStandardMaterial map={label} />
            </mesh>
            <mesh position={[0, -0.07, 0.03]} material={m.silver}>
              <boxGeometry args={[1.2, 0.035, 0.04]} />
            </mesh>
          </group>
        )
      })}
      <mesh position={[0, 1.03, 0]} material={m.black}>
        <boxGeometry args={[1.94, 0.06, 1.04]} />
      </mesh>
    </group>
  )
}

export function RotaryPhone() {
  const m = useMats()
  const card = phoneCardTexture()
  const handset = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.8, 0.0, 0),
      new THREE.Vector3(-0.55, 0.22, 0),
      new THREE.Vector3(0, 0.3, 0),
      new THREE.Vector3(0.55, 0.22, 0),
      new THREE.Vector3(0.8, 0.0, 0),
    ])
    return new THREE.TubeGeometry(curve, 40, 0.09, 16, false)
  }, [])
  return (
    <group rotation={[0.45, -0.4, 0]} position={[0, -0.5, 0]}>
      <mesh position={[0, 0.25, 0]} material={m.black} castShadow>
        <boxGeometry args={[1.5, 0.5, 1.2]} />
      </mesh>
      <mesh position={[0, 0.52, 0.18]} rotation={[0.5, 0, 0]} material={m.silver}>
        <cylinderGeometry args={[0.42, 0.42, 0.05, 48]} />
      </mesh>
      {Array.from({ length: 10 }, (_, i) => {
        const a = (i / 12) * Math.PI * 2 + 0.6
        return (
          <mesh key={i} position={[Math.cos(a) * 0.3, 0.56 + Math.sin(a) * 0.3 * Math.sin(0.5) * -1, 0.18 + Math.sin(a) * 0.3 * Math.cos(0.5)]} rotation={[0.5, 0, 0]} material={m.black}>
            <cylinderGeometry args={[0.05, 0.05, 0.02, 16]} />
          </mesh>
        )
      })}
      <mesh geometry={handset} position={[0, 0.62, -0.32]} material={m.black} castShadow />
      {[-0.8, 0.8].map((x) => (
        <mesh key={x} position={[x, 0.6, -0.32]} material={m.black}>
          <cylinderGeometry args={[0.16, 0.13, 0.12, 24]} />
        </mesh>
      ))}
      <mesh position={[1.3, 0.02, 0.5]} rotation={[-Math.PI / 2, 0, -0.25]}>
        <planeGeometry args={[0.9, 0.45]} />
        <meshStandardMaterial map={card} roughness={0.9} />
      </mesh>
    </group>
  )
}

// Foyer: the envelope left on the console, a card sliding out with a short intro
export function Envelope() {
  const card = introCardTexture({
    name: 'Saillesh.',
    motto: 'Engineering through curiosity',
    descriptor: 'Physics-trained. Systems-minded. Builder by nature.',
    lines: ['A multidisciplinary engineer with a foundation in physics,', 'working across software, DevOps, automation, data', 'and intelligent systems. Have a look around.'],
  })
  const paper = useMemo(() => new THREE.MeshStandardMaterial({ color: '#e9dfca', roughness: 0.9 }), [])
  const wax = useMemo(() => new THREE.MeshStandardMaterial({ color: '#7a1f17', roughness: 0.4, metalness: 0.1 }), [])
  const logo = useTexture('/logos/sai-logo.png', (t) => {
    t.colorSpace = THREE.SRGBColorSpace
  })
  const slide = useRef()
  const t0 = useRef(0)
  useFrame((_, dt) => {
    if (!slide.current) return
    t0.current = Math.min(1, t0.current + dt * 0.7)
    const e = 1 - Math.pow(1 - t0.current, 3)
    slide.current.position.y = THREE.MathUtils.lerp(-0.25, 0.82, e)
  })
  return (
    <group rotation={[-0.2, -0.25, 0]} position={[0, -0.25, 0]}>
      {/* back of the envelope */}
      <mesh position={[0, 0, -0.02]} material={paper} castShadow>
        <boxGeometry args={[2.4, 1.5, 0.02]} />
      </mesh>
      {/* the card */}
      <group ref={slide} position={[0, -0.25, 0]}>
        <mesh position={[0, 0, 0.005]}>
          <planeGeometry args={[2.2, 1.52]} />
          <meshStandardMaterial map={card} roughness={0.85} />
        </mesh>
      </group>
      {/* front pocket and open flap */}
      <mesh position={[0, -0.33, 0.02]} material={paper}>
        <boxGeometry args={[2.4, 0.84, 0.01]} />
      </mesh>
      <mesh position={[0, 0.75, -0.04]} rotation={[-0.5, 0, 0]}>
        <shapeGeometry args={[new THREE.Shape([new THREE.Vector2(-1.2, 0), new THREE.Vector2(1.2, 0), new THREE.Vector2(0, 0.7)])]} />
        <meshStandardMaterial color="#e2d6bd" roughness={0.9} side={THREE.DoubleSide} />
      </mesh>
      {/* wax seal with the SM mark */}
      <group position={[0, -0.3, 0.04]}>
        <mesh rotation={[Math.PI / 2, 0, 0]} material={wax}>
          <cylinderGeometry args={[0.2, 0.22, 0.05, 32]} />
        </mesh>
        <mesh position={[0, 0, 0.027]}>
          <planeGeometry args={[0.24, 0.28]} />
          <meshStandardMaterial map={logo} transparent color="#d9a08f" roughness={0.5} />
        </mesh>
      </group>
    </group>
  )
}

// ---------------------------------------------------------------- garage round
// Symcor: a rack-mount server blade with a hardware security key beside it
export function RackAndKey() {
  const m = useMats()
  return (
    <group>
      <group position={[0, 0.15, 0]}>
        <ServerBlade />
      </group>
      <group position={[0.9, -0.55, 0.75]} rotation={[0.3, -0.6, 0]}>
        <mesh material={m.black} castShadow>
          <boxGeometry args={[0.26, 0.06, 0.6]} />
        </mesh>
        <mesh position={[0, 0.032, 0.08]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.08, 24]} />
          <meshStandardMaterial color="#c6a96c" metalness={1} roughness={0.25} />
        </mesh>
        <mesh position={[0, 0, -0.36]} material={m.silver}>
          <boxGeometry args={[0.16, 0.035, 0.16]} />
        </mesh>
      </group>
    </group>
  )
}

// OmniaBio: a two-tier test-tube rack, tubes standing in a neat row
export function TubeRack() {
  const m = useMats()
  const liquids = ['#7fb7c9', '#c9a24a', '#9fc4a0', '#d97757', '#7fb7c9', '#c9a24a']
  const card = labelTexture({ key: 'omniabio-card2', w: 1024, h: 300, bg: '#f3efe6', align: 'left', lines: [
    { text: 'OMNIABIO · QC', size: 70, font: 'sans', weight: 600, color: '#1b1a17', spacing: 6, gap: 90 },
    { text: 'batch check · control chart', size: 46, font: 'mono', color: '#5c574d' },
  ] })
  const white = useMemo(() => new THREE.MeshStandardMaterial({ color: '#e9e6df', roughness: 0.4 }), [])
  return (
    <group rotation={[0.3, -0.45, 0]} position={[0, -0.55, 0]}>
      <mesh position={[0, 0.04, 0]} material={white} castShadow>
        <boxGeometry args={[2.3, 0.08, 0.7]} />
      </mesh>
      {[0.55, 1.0].map((y) => (
        <mesh key={y} position={[0, y, 0]} material={white}>
          <boxGeometry args={[2.3, 0.05, 0.6]} />
        </mesh>
      ))}
      {[-1.12, 1.12].map((x) => (
        <mesh key={x} position={[x, 0.55, 0]} material={white}>
          <boxGeometry args={[0.06, 1.0, 0.6]} />
        </mesh>
      ))}
      {liquids.map((c, i) => {
        const x = -0.9 + i * 0.36
        const lift = i === 3 ? 0.35 : 0
        return (
          <group key={i} position={[x, 0.1 + lift, 0]}>
            <mesh position={[0, 0.55, 0]} material={m.glass}>
              <cylinderGeometry args={[0.1, 0.1, 1.1, 28]} />
            </mesh>
            <mesh position={[0, 0.04, 0]} material={m.glass}>
              <sphereGeometry args={[0.1, 20, 12, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2]} />
            </mesh>
            <mesh position={[0, 0.32, 0]}>
              <cylinderGeometry args={[0.085, 0.085, 0.55, 28]} />
              <meshStandardMaterial color={c} roughness={0.2} transparent opacity={0.85} />
            </mesh>
            <mesh position={[0, 1.13, 0]}>
              <cylinderGeometry args={[0.11, 0.11, 0.08, 28]} />
              <meshStandardMaterial color={i % 2 ? '#c6a96c' : '#1b1a17'} roughness={0.5} />
            </mesh>
          </group>
        )
      })}
      <mesh position={[0, 0.25, 0.36]} rotation={[-0.1, 0, 0]}>
        <planeGeometry args={[1.5, 0.44]} />
        <meshStandardMaterial map={card} roughness={0.9} />
      </mesh>
    </group>
  )
}

// PepsiCo, Data Analyst: a clipboard holding the printed query and chart
export function Clipboard() {
  const m = useMats()
  const page = reportPageTexture()
  return (
    <group rotation={[-0.2, -0.3, 0.04]}>
      <mesh material={m.walnut} castShadow>
        <boxGeometry args={[1.7, 2.3, 0.05]} />
      </mesh>
      <mesh position={[0, -0.08, 0.03]}>
        <planeGeometry args={[1.5, 1.94]} />
        <meshStandardMaterial map={page} roughness={0.9} />
      </mesh>
      <mesh position={[0, 1.05, 0.06]} material={m.silver}>
        <boxGeometry args={[0.8, 0.16, 0.08]} />
      </mesh>
      <mesh position={[0, 1.1, 0.1]} rotation={[Math.PI / 2, 0, 0]} material={m.silver}>
        <cylinderGeometry args={[0.04, 0.04, 0.6, 16]} />
      </mesh>
      <mesh position={[0.95, -0.5, 0.15]} rotation={[0, 0, 0.6]}>
        <cylinderGeometry args={[0.03, 0.03, 1.2, 12]} />
        <meshStandardMaterial color="#1b1a17" roughness={0.4} />
      </mesh>
    </group>
  )
}

// UWAFT: the autonomous car with its roof lidar mount
const SMALL_CAR = { length: 2.6, width: 1.18, height: 0.86 }

export function AutonomousCar() {
  const m = useMats()
  const C = SMALL_CAR
  const body = useMemo(() => carBodyGeometry(SMALL_CAR), [])
  const paint = useMemo(() => new THREE.MeshPhysicalMaterial({ color: '#e4e1da', metalness: 0.35, roughness: 0.28, clearcoat: 1, clearcoatRoughness: 0.06 }), [])
  const led = useMemo(() => new THREE.MeshStandardMaterial({ color: '#111', emissive: '#e8a35a', emissiveIntensity: 2.5 }), [])
  return (
    <group position={[0, -0.55, 0]} rotation={[0.12, -0.6, 0]}>
      <mesh geometry={body} material={paint} castShadow />
      <mesh position={[0.1, 0.62, 0]} rotation={[0, 0, -0.06]}>
        <boxGeometry args={[1.0, 0.15, 1.0]} />
        <meshPhysicalMaterial color="#0d1115" roughness={0.05} metalness={0.2} clearcoat={1} />
      </mesh>
      {wheelPositions(C).map(([x, z]) => (
        <group key={`${x}${z}`} position={[x, 0.2, z]}>
          <mesh rotation={[Math.PI / 2, 0, 0]} material={m.rubber}>
            <cylinderGeometry args={[0.25, 0.25, 0.18, 32]} />
          </mesh>
          <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, z > 0 ? 0.092 : -0.092]} material={m.gold}>
            <cylinderGeometry args={[0.15, 0.15, 0.01, 24]} />
          </mesh>
        </group>
      ))}
      {/* the lidar mount */}
      {[-0.34, 0.34].map((z) => (
        <mesh key={z} position={[0.1, 0.72, z]} material={m.steel}>
          <boxGeometry args={[0.72, 0.04, 0.05]} />
        </mesh>
      ))}
      <mesh position={[0.1, 0.76, 0]} material={m.steel}>
        <boxGeometry args={[0.36, 0.03, 0.36]} />
      </mesh>
      <Spin speed={2}>
        <group position={[0.1, 0, 0]}>
          <mesh position={[0, 0.86, 0]} material={m.black}>
            <cylinderGeometry args={[0.12, 0.12, 0.16, 28]} />
          </mesh>
          <mesh position={[0.121, 0.86, 0]} material={led}>
            <boxGeometry args={[0.01, 0.06, 0.05]} />
          </mesh>
        </group>
      </Spin>
      <mesh position={[-1.32, 0.22, 0]} material={m.black}>
        <boxGeometry args={[0.04, 0.06, 0.2]} />
      </mesh>
    </group>
  )
}
