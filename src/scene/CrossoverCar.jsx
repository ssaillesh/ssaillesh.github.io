import { useMemo } from 'react'
import * as THREE from 'three'

// A detailed electric crossover: arched body, tinted glasshouse with chrome
// trim, vertical light blades and a lit grille up front, a full-width tail
// light, multi-spoke wheels. Generic styling (no badges). Nose points to -x,
// about 4 units long before `scale`. Optional roof lidar mount.

const LEN = 4.0
const WID = 1.8

function grilleTexture() {
  const c = document.createElement('canvas')
  c.width = 512
  c.height = 160
  const g = c.getContext('2d')
  g.fillStyle = '#0b0c0d'
  g.fillRect(0, 0, 512, 160)
  g.strokeStyle = 'rgba(220,225,230,.75)'
  g.lineWidth = 2
  for (let x = -160; x < 680; x += 12) {
    g.beginPath()
    g.moveTo(x, 0)
    g.lineTo(x < 256 ? x + 80 : x - 80, 160)
    g.stroke()
  }
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  return t
}

function bodyGeometry() {
  const s = new THREE.Shape()
  s.moveTo(-2.0, 0.3)
  s.lineTo(-2.04, 0.6)
  s.quadraticCurveTo(-2.04, 0.8, -1.82, 0.83)
  s.quadraticCurveTo(-1.3, 0.94, -0.82, 0.98)
  s.lineTo(1.66, 1.04)
  s.quadraticCurveTo(1.98, 1.04, 2.0, 0.84)
  s.lineTo(2.0, 0.32)
  s.lineTo(1.72, 0.32)
  s.absarc(1.25, 0.36, 0.47, -0.08, Math.PI + 0.08, false)
  s.lineTo(-0.78, 0.32)
  s.absarc(-1.25, 0.36, 0.47, -0.08, Math.PI + 0.08, false)
  s.lineTo(-2.0, 0.3)
  const bevel = 0.09
  const g = new THREE.ExtrudeGeometry(s, { depth: WID - bevel * 2, bevelEnabled: true, bevelSize: bevel, bevelThickness: bevel, bevelSegments: 6, curveSegments: 24 })
  g.translate(0, 0, -(WID - bevel * 2) / 2)
  return g
}

function cabinGeometry() {
  const s = new THREE.Shape()
  s.moveTo(-0.8, 0.98)
  s.quadraticCurveTo(-0.42, 1.3, -0.1, 1.5)
  s.quadraticCurveTo(0.6, 1.58, 1.25, 1.5)
  s.quadraticCurveTo(1.66, 1.36, 1.8, 1.05)
  s.lineTo(-0.8, 0.98)
  const w = WID - 0.34
  const bevel = 0.08
  const g = new THREE.ExtrudeGeometry(s, { depth: w - bevel * 2, bevelEnabled: true, bevelSize: bevel, bevelThickness: bevel, bevelSegments: 5, curveSegments: 24 })
  g.translate(0, 0, -(w - bevel * 2) / 2)
  return g
}

function trimCurve(points, z) {
  const curve = new THREE.CatmullRomCurve3(points.map(([x, y]) => new THREE.Vector3(x, y, z)))
  return new THREE.TubeGeometry(curve, 48, 0.018, 8, false)
}

function Wheel({ position, mats }) {
  const spokes = Array.from({ length: 10 }, (_, i) => (i / 10) * Math.PI * 2)
  const out = position[2] > 0 ? 1 : -1
  return (
    <group position={position}>
      <mesh rotation={[Math.PI / 2, 0, 0]} material={mats.tyre} castShadow>
        <cylinderGeometry args={[0.43, 0.43, 0.28, 40]} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, out * 0.142]} material={mats.rimDark}>
        <cylinderGeometry args={[0.33, 0.33, 0.01, 40]} />
      </mesh>
      {spokes.map((a) => (
        <mesh key={a} position={[Math.cos(a) * 0.17, Math.sin(a) * 0.17, out * 0.148]} rotation={[0, 0, a + (out > 0 ? 0.12 : -0.12)]} material={mats.rim}>
          <boxGeometry args={[0.32, 0.035, 0.012]} />
        </mesh>
      ))}
      <mesh position={[0, 0, out * 0.15]} material={mats.rim}>
        <torusGeometry args={[0.33, 0.014, 8, 48]} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, out * 0.152]} material={mats.rim}>
        <cylinderGeometry args={[0.06, 0.06, 0.02, 24]} />
      </mesh>
    </group>
  )
}

export default function CrossoverCar({ paint = '#2a4741', lidar = false, ...props }) {
  const geo = useMemo(() => {
    const zSide = WID / 2 - 0.16
    return {
      body: bodyGeometry(),
      cabin: cabinGeometry(),
      beltL: trimCurve([[-0.78, 1.0], [0.4, 1.03], [1.2, 1.05], [1.78, 1.06]], zSide + 0.012),
      beltR: trimCurve([[-0.78, 1.0], [0.4, 1.03], [1.2, 1.05], [1.78, 1.06]], -zSide - 0.012),
      roofL: trimCurve([[-0.1, 1.5], [0.6, 1.57], [1.25, 1.5], [1.66, 1.32]], zSide - 0.03),
      roofR: trimCurve([[-0.1, 1.5], [0.6, 1.57], [1.25, 1.5], [1.66, 1.32]], -zSide + 0.03),
    }
  }, [])
  const mats = useMemo(
    () => ({
      paint: new THREE.MeshPhysicalMaterial({ color: paint, metalness: 0.75, roughness: 0.22, clearcoat: 1, clearcoatRoughness: 0.05 }),
      glass: new THREE.MeshPhysicalMaterial({ color: '#0a0d10', metalness: 0.3, roughness: 0.05, clearcoat: 1 }),
      chrome: new THREE.MeshStandardMaterial({ color: '#d6d9dd', metalness: 1, roughness: 0.12 }),
      black: new THREE.MeshStandardMaterial({ color: '#0e0f10', roughness: 0.45, metalness: 0.3 }),
      tyre: new THREE.MeshStandardMaterial({ color: '#111111', roughness: 0.85 }),
      rim: new THREE.MeshStandardMaterial({ color: '#c9ccd0', metalness: 1, roughness: 0.2 }),
      rimDark: new THREE.MeshStandardMaterial({ color: '#2a2c2f', metalness: 0.8, roughness: 0.3 }),
      light: new THREE.MeshStandardMaterial({ color: '#ffffff', emissive: '#f4f7ff', emissiveIntensity: 3, toneMapped: false }),
      tail: new THREE.MeshStandardMaterial({ color: '#3a0605', emissive: '#ff2a1a', emissiveIntensity: 2.4, toneMapped: false }),
      amber: new THREE.MeshStandardMaterial({ color: '#3a2205', emissive: '#ffb347', emissiveIntensity: 1.6, toneMapped: false }),
      grille: new THREE.MeshStandardMaterial({ map: grilleTexture(), metalness: 0.6, roughness: 0.3, emissive: '#ffffff', emissiveIntensity: 0.12 }),
      ledPuck: new THREE.MeshStandardMaterial({ color: '#111', emissive: '#e8a35a', emissiveIntensity: 2.2 }),
    }),
    [paint],
  )
  const halfW = WID / 2
  return (
    <group {...props}>
      <mesh geometry={geo.body} material={mats.paint} castShadow />
      <mesh geometry={geo.cabin} material={mats.glass} castShadow />
      {[geo.beltL, geo.beltR, geo.roofL, geo.roofR].map((g, i) => (
        <mesh key={i} geometry={g} material={mats.chrome} />
      ))}

      {/* front: grille, light blades, light bar, lower intake */}
      <mesh position={[-2.14, 0.56, 0]} rotation={[0, -Math.PI / 2, 0]} material={mats.grille}>
        <planeGeometry args={[1.12, 0.32]} />
      </mesh>
      {[-1, 1].map((s) => (
        <group key={s}>
          <mesh position={[-2.135, 0.55, s * 0.74]} material={mats.light}>
            <boxGeometry args={[0.04, 0.34, 0.045]} />
          </mesh>
          <mesh position={[-2.13, 0.55, s * 0.64]} material={mats.light}>
            <boxGeometry args={[0.04, 0.26, 0.02]} />
          </mesh>
          <mesh position={[-1.6, 0.64, s * (halfW + 0.005)]} material={mats.amber}>
            <boxGeometry args={[0.08, 0.025, 0.01]} />
          </mesh>
        </group>
      ))}
      <mesh position={[-1.93, 0.86, 0]} material={mats.light}>
        <boxGeometry args={[0.03, 0.015, 1.36]} />
      </mesh>
      <mesh position={[-2.135, 0.38, 0]} rotation={[0, -Math.PI / 2, 0]} material={mats.black}>
        <planeGeometry args={[1.3, 0.12]} />
      </mesh>

      {/* rear: full-width tail light and blades */}
      <mesh position={[2.1, 0.86, 0]} material={mats.tail}>
        <boxGeometry args={[0.02, 0.03, 1.5]} />
      </mesh>
      {[-1, 1].map((s) => (
        <mesh key={s} position={[2.095, 0.72, s * 0.76]} material={mats.tail}>
          <boxGeometry args={[0.03, 0.3, 0.035]} />
        </mesh>
      ))}

      {/* sides: mirrors, rocker chrome, flush handles */}
      {[-1, 1].map((s) => (
        <group key={s}>
          <mesh position={[-0.62, 1.05, s * (halfW - 0.02)]} material={mats.black} castShadow>
            <boxGeometry args={[0.2, 0.12, 0.16]} />
          </mesh>
          <mesh position={[0, 0.36, s * (halfW + 0.006)]} material={mats.chrome}>
            <boxGeometry args={[1.5, 0.025, 0.006]} />
          </mesh>
          {[-0.25, 0.75].map((x) => (
            <mesh key={x} position={[x, 0.88, s * (halfW + 0.006)]} material={mats.chrome}>
              <boxGeometry args={[0.16, 0.02, 0.006]} />
            </mesh>
          ))}
        </group>
      ))}

      {[[-1.25, halfW - 0.05], [1.25, halfW - 0.05], [-1.25, -halfW + 0.05], [1.25, -halfW + 0.05]].map(([x, z]) => (
        <Wheel key={`${x}${z}`} position={[x, 0.42, z]} mats={mats} />
      ))}

      {lidar && (
        <group>
          {[-0.45, 0.45].map((z) => (
            <mesh key={z} position={[0.6, 1.6, z]} material={mats.black}>
              <boxGeometry args={[1.1, 0.04, 0.05]} />
            </mesh>
          ))}
          <mesh position={[0.6, 1.63, 0]} material={mats.black}>
            <boxGeometry args={[0.44, 0.04, 0.44]} />
          </mesh>
          <mesh position={[0.6, 1.74, 0]} material={mats.black}>
            <cylinderGeometry args={[0.15, 0.15, 0.18, 28]} />
          </mesh>
          <mesh position={[0.6, 1.79, 0]} material={mats.ledPuck}>
            <cylinderGeometry args={[0.155, 0.155, 0.04, 28]} />
          </mesh>
        </group>
      )}
    </group>
  )
}
