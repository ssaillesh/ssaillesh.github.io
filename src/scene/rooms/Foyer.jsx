import { Box, Cyl, Ball, Plant, Rug } from '../primitives.jsx'
import Interactive from '../Interactive.jsx'

// ROOM 01, FOYER: x[-4, 4], z[4, 9]. Entrance on the south face.
export default function Foyer({ mats, ctx }) {
  const it = (id) => ({ id, enabled: ctx.active, hovered: ctx.hovered, selected: ctx.selected, onHover: ctx.onHover, onSelect: ctx.onSelect })
  return (
    <group>
      <Rug p={[0, 0.02, 6.6]} s={[3.4, 2.6]} m={mats.rugIvory} />


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
      {/* An envelope left on the console: a short intro */}
      <Interactive {...it('intro')} label="A sealed envelope" sub="Pick up" ring={[-3.6, 6.1, 0.6]}>
        <Box p={[-3.6, 0.8, 6.1]} s={[0.32, 0.012, 0.46]} m={mats.ivory} r={[0, 0.25, 0]} />
        <Cyl p={[-3.6, 0.81, 6.1]} radius={0.05} h={0.012} m={mats.carRed} />
      </Interactive>

      <Box p={[3.6, 0, 7.4]} s={[0.45, 0.42, 1.8]} m={mats.walnut} />
      <Box p={[3.6, 0.42, 7.4]} s={[0.42, 0.06, 1.7]} m={mats.leather} />
      <Plant p={[3.4, 0, 8.4]} mats={mats} scale={1.1} />
      <Plant p={[-3.35, 0, 8.4]} mats={mats} scale={0.9} />

      {/* Running shoes left by the door (scenery) */}
      <group>
        {[[-2.12, 0.15], [-1.86, -0.1]].map(([x, r]) => (
          <group key={x} position={[x, 0.02, 8.3]} rotation={[0, r, 0]}>
            <Box p={[0, 0, 0]} s={[0.12, 0.035, 0.3]} m={mats.ivory} />
            <Box p={[0, 0.035, -0.02]} s={[0.11, 0.08, 0.24]} m={mats.leather} />
            <Box p={[0, 0.035, 0.11]} s={[0.1, 0.05, 0.07]} m={mats.leather} />
          </group>
        ))}
      </group>

      {/* ---- scenery (not pick-ups) ---- */}
      {/* coat stand in the corner by the east wall, a jacket on one hook */}
      <group position={[3.45, 0, 4.75]}>
        <Cyl p={[0, 0, 0]} radius={0.2} h={0.03} m={mats.blackMatte} />
        <Cyl p={[0, 0, 0]} radius={0.025} h={1.85} m={mats.blackMatte} />
        {[0, 1.57, 3.14, 4.71].map((a) => (
          <Box key={a} p={[Math.cos(a) * 0.1, 1.66, Math.sin(a) * 0.1]} s={[0.16, 0.02, 0.02]} m={mats.brass} r={[0, -a, 0.5]} />
        ))}
        <Box p={[-0.14, 0.95, 0]} s={[0.1, 0.72, 0.44]} m={mats.leather} r={[0, 0, 0.06]} />
      </group>
      {/* umbrella stand by the door */}
      <Cyl p={[2.35, 0, 8.55]} radius={0.13} h={0.5} m={mats.steel} />
      <Cyl p={[2.31, 0.15, 8.55]} radius={0.018} h={0.78} m={mats.blackMatte} r={[0, 0, 0.12]} />
      <Cyl p={[2.4, 0.15, 8.5]} radius={0.018} h={0.72} m={mats.walnut} r={[0.1, 0, -0.1]} />
      {/* an abstract print over the bench */}
      <Box p={[3.89, 1.05, 7.4]} s={[0.04, 0.9, 1.3]} m={mats.walnut} />
      <Box p={[3.865, 1.11, 7.4]} s={[0.01, 0.78, 1.18]} m={mats.ivory} cast={false} />
      <Box p={[3.858, 1.3, 7.15]} s={[0.005, 0.36, 0.52]} m={mats.terracotta} cast={false} />
      <Box p={[3.858, 1.22, 7.68]} s={[0.005, 0.24, 0.34]} m={mats.blackMatte} cast={false} />
      <Box p={[3.858, 1.62, 7.6]} s={[0.005, 0.03, 0.62]} m={mats.brass} cast={false} />
      {/* a key bowl on the console */}
      <Cyl p={[-3.6, 0.8, 5.75]} radius={0.12} h={0.04} m={mats.stone} />
    </group>
  )
}
