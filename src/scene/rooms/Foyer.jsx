import { Box, Cyl, Ball, Plant, Rug } from '../primitives.jsx'
import Interactive from '../Interactive.jsx'

// ROOM 01, FOYER: x[-4, 4], z[4, 9]. Entrance on the south face.
export default function Foyer({ mats, ctx }) {
  const it = (id) => ({ id, enabled: ctx.active, hovered: ctx.hovered, selected: ctx.selected, onHover: ctx.onHover, onSelect: ctx.onSelect })
  return (
    <group>
      <Rug p={[0, 0.02, 6.6]} s={[3.4, 2.6]} m={mats.rugIvory} />

      {/* Name monolith: blackened steel with a brass inlay */}
      <Interactive {...it('intro')} label="A brass nameplate" sub="Select" ring={[1.9, 6.2, 1.1]}>
        <Box p={[1.9, 0, 6.2]} s={[1.5, 0.08, 0.5]} m={mats.stone} />
        <Box p={[1.9, 0.08, 6.2]} s={[1.4, 2.0, 0.2]} m={mats.steel} />
        <Box p={[1.9, 1.2, 6.31]} s={[1.0, 0.05, 0.01]} m={mats.brass} cast={false} />
        <Box p={[1.9, 1.32, 6.31]} s={[0.6, 0.02, 0.01]} m={mats.brass} cast={false} />
      </Interactive>

      {/* Console with a leather résumé folio */}
      <Box p={[-3.6, 0, 6.6]} s={[0.5, 0.8, 2.2]} m={mats.walnut} />
      <mesh position={[-3.9, 1.85, 6.6]} rotation={[0, Math.PI / 2, 0]}>
        <torusGeometry args={[0.55, 0.035, 12, 48]} />
        <primitive object={mats.brass} attach="material" />
      </mesh>
      <mesh position={[-3.91, 1.85, 6.6]} rotation={[0, Math.PI / 2, 0]}>
        <circleGeometry args={[0.53, 48]} />
        <meshStandardMaterial color="#3b3a38" metalness={1} roughness={0.08} />
      </mesh>
      <Ball p={[-3.6, 1.0, 7.3]} radius={0.16} m={mats.stone} />
      <Cyl p={[-3.6, 0.8, 7.3]} radius={0.09} h={0.1} m={mats.stone} />
      <Interactive {...it('resume')} label="A leather folio" sub="Select" ring={[-3.6, 6.1, 0.6]}>
        <Box p={[-3.6, 0.8, 6.1]} s={[0.34, 0.04, 0.46]} m={mats.leather} />
        <Box p={[-3.6, 0.84, 6.1]} s={[0.3, 0.005, 0.42]} m={mats.ivory} cast={false} />
      </Interactive>

      <Box p={[3.6, 0, 7.4]} s={[0.45, 0.42, 1.8]} m={mats.walnut} />
      <Box p={[3.6, 0.42, 7.4]} s={[0.42, 0.06, 1.7]} m={mats.leather} />
      <Plant p={[3.4, 0, 8.4]} mats={mats} scale={1.1} />
      <Plant p={[-3.35, 0, 8.4]} mats={mats} scale={0.9} />

      {/* Running shoes left by the door */}
      <Interactive {...it('active')} label="Running shoes" sub="Pick up" ring={[-2.0, 8.3, 0.55]}>
        {[[-2.12, 0.15], [-1.86, -0.1]].map(([x, r]) => (
          <group key={x} position={[x, 0.02, 8.3]} rotation={[0, r, 0]}>
            <Box p={[0, 0, 0]} s={[0.12, 0.035, 0.3]} m={mats.ivory} />
            <Box p={[0, 0.035, -0.02]} s={[0.11, 0.08, 0.24]} m={mats.leather} />
            <Box p={[0, 0.035, 0.11]} s={[0.1, 0.05, 0.07]} m={mats.leather} />
          </group>
        ))}
      </Interactive>
    </group>
  )
}
