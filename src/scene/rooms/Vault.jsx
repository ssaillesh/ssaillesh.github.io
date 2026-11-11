import { useMemo } from 'react'
import * as THREE from 'three'
import { Box, Cyl } from '../primitives.jsx'
import Interactive from '../Interactive.jsx'

// ROOM 04, VAULT: x[-4, 4], z[-9, -3]. A steel vault chamber against the north
// glazing with its round door swung open. Clicking it opens the Vault page.

const DOOR_R = 1.2
const CENTER = [0, 1.55, -6.4]

function depositBoxTexture() {
  const c = document.createElement('canvas')
  c.width = 256
  c.height = 256
  const g = c.getContext('2d')
  g.fillStyle = '#3d4044'
  g.fillRect(0, 0, 256, 256)
  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 6; x++) {
      const px = 8 + x * 41
      const py = 8 + y * 31
      g.fillStyle = '#4a4e53'
      g.fillRect(px, py, 36, 26)
      g.strokeStyle = '#2a2c2f'
      g.lineWidth = 2
      g.strokeRect(px, py, 36, 26)
      g.fillStyle = '#c6a96c'
      g.beginPath()
      g.arc(px + 30, py + 13, 2.4, 0, Math.PI * 2)
      g.fill()
    }
  }
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  return t
}

function Door({ m }) {
  const bolts = Array.from({ length: 18 }, (_, i) => (i / 18) * Math.PI * 2)
  return (
    // hinge on the east edge of the opening; door swung out towards the visitor
    <group position={[CENTER[0] + DOOR_R + 0.08, CENTER[1], CENTER[2] + 0.12]} rotation={[0, 1.75, 0]}>
      <group position={[-DOOR_R, 0, 0.22]}>
        <mesh rotation={[Math.PI / 2, 0, 0]} castShadow material={m.steel}>
          <cylinderGeometry args={[DOOR_R, DOOR_R, 0.44, 64]} />
        </mesh>
        {/* stepped face */}
        <mesh position={[0, 0, 0.23]} rotation={[Math.PI / 2, 0, 0]} material={m.face}>
          <cylinderGeometry args={[DOOR_R * 0.82, DOOR_R * 0.82, 0.04, 64]} />
        </mesh>
        {/* locking bolts around the rim */}
        {bolts.map((a) => (
          <mesh key={a} position={[Math.cos(a) * (DOOR_R + 0.06), Math.sin(a) * (DOOR_R + 0.06), 0]} rotation={[0, 0, a + Math.PI / 2]} material={m.chrome}>
            <cylinderGeometry args={[0.05, 0.05, 0.16, 12]} />
          </mesh>
        ))}
        {/* spoked wheel */}
        <mesh position={[0, 0, 0.36]} material={m.chrome}>
          <torusGeometry args={[0.42, 0.035, 12, 48]} />
        </mesh>
        {[0, Math.PI / 3, (2 * Math.PI) / 3].map((a) => (
          <mesh key={a} position={[0, 0, 0.34]} rotation={[0, 0, a]} material={m.chrome}>
            <boxGeometry args={[0.84, 0.035, 0.035]} />
          </mesh>
        ))}
        <mesh position={[0, 0, 0.3]} rotation={[Math.PI / 2, 0, 0]} material={m.brass}>
          <cylinderGeometry args={[0.1, 0.1, 0.12, 24]} />
        </mesh>
      </group>
      {/* hinge barrels */}
      {[-0.55, 0.55].map((y) => (
        <mesh key={y} position={[0, y, 0.1]} material={m.chrome}>
          <cylinderGeometry args={[0.08, 0.08, 0.4, 16]} />
        </mesh>
      ))}
    </group>
  )
}

export default function Vault({ mats, ctx }) {
  const m = useMemo(
    () => ({
      steel: new THREE.MeshStandardMaterial({ color: '#6c7074', metalness: 0.85, roughness: 0.32 }),
      face: new THREE.MeshStandardMaterial({ color: '#7b7f84', metalness: 0.9, roughness: 0.22 }),
      chrome: new THREE.MeshStandardMaterial({ color: '#b9bcc0', metalness: 1, roughness: 0.18 }),
      chamber: new THREE.MeshStandardMaterial({ color: '#45484c', metalness: 0.7, roughness: 0.4 }),
      boxes: new THREE.MeshStandardMaterial({ map: depositBoxTexture(), metalness: 0.6, roughness: 0.4 }),
      glow: new THREE.MeshBasicMaterial({ color: '#ffcf8a' }),
      spill: new THREE.MeshBasicMaterial({ color: '#ffb969', transparent: true, opacity: 0.22, depthWrite: false }),
      brass: mats.brass,
    }),
    [mats],
  )
  const hover = { enabled: ctx.active, hovered: ctx.hovered, selected: ctx.selected, onHover: ctx.onHover, onSelect: ctx.onSelect }

  return (
    <group>
      <Interactive id="inside" label="Open the vault" sub="The Vault" ring={[0, -5.4, 1.6]} {...hover}>
        {/* chamber */}
        <Box p={[0, 0, -7.7]} s={[5.4, 3.3, 2.6]} m={m.chamber} />
        <mesh position={[2.701, 1.65, -7.7]} rotation={[0, Math.PI / 2, 0]} material={m.boxes}>
          <planeGeometry args={[2.5, 3.2]} />
        </mesh>
        <mesh position={[0, 1.65, -6.399]} material={m.boxes}>
          <planeGeometry args={[5.3, 3.2]} />
        </mesh>
        {/* door frame ring and lit interior */}
        <mesh position={[CENTER[0], CENTER[1], CENTER[2] + 0.02]} material={m.chrome}>
          <torusGeometry args={[DOOR_R + 0.14, 0.14, 16, 72]} />
        </mesh>
        <mesh position={[CENTER[0], CENTER[1], CENTER[2] + 0.01]} material={m.glow} userData={{ noGlow: true }}>
          <circleGeometry args={[DOOR_R + 0.02, 64]} />
        </mesh>
        <Door m={m} />
        <Box p={[0, 3.3, -7.7]} s={[5.6, 0.1, 2.8]} m={mats.steel} />
      </Interactive>

      {/* light spilling out across the floor */}
      <mesh position={[0, 0.03, -5.2]} rotation={[-Math.PI / 2, 0, 0]} material={m.spill}>
        <circleGeometry args={[1.6, 48]} />
      </mesh>
      <pointLight position={[0, 1.5, -5.6]} intensity={6} distance={6} decay={1.6} color="#ffc27a" />

      {/* stanchions with a rope */}
      {[-2.5, -0.3].map((x) => (
        <group key={x}>
          <Cyl p={[x, 0, -4.4]} radius={0.16} h={0.04} m={mats.brass} />
          <Cyl p={[x, 0, -4.4]} radius={0.03} h={0.95} m={mats.brass} />
        </group>
      ))}
      <mesh position={[-1.4, 0.85, -4.4]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.03, 0.03, 2.2, 10]} />
        <meshStandardMaterial color="#6e1f1a" roughness={0.8} />
      </mesh>
    </group>
  )
}
