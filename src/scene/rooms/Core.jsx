import { Box, Cyl, Ball } from '../primitives.jsx'

// Central circulation: an open hall organised around a sunken-feeling
// centrepiece — a stone planter with an olive tree and a curved walnut bench —
// framed by four blackened-steel columns.
export default function Core({ mats }) {
  const benchSegs = Array.from({ length: 9 }, (_, i) => i)
  return (
    <group>
      {/* inlaid stone disc and brass ring in the floor */}
      <Cyl p={[0, 0.02, 0.5]} radius={2.3} h={0.01} m={mats.stone} cast={false} />
      <mesh position={[0, 0.035, 0.5]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.28, 2.34, 72]} />
        <primitive object={mats.brass} attach="material" />
      </mesh>

      {/* planter + olive tree */}
      <Cyl p={[0, 0, 0.5]} radius={0.85} h={0.5} m={mats.wall} />
      <Cyl p={[0, 0.5, 0.5]} radius={0.78} h={0.02} m={mats.terracotta} cast={false} />
      <Cyl p={[0, 0.5, 0.5]} radius={0.09} h={1.4} m={mats.walnut} />
      <Ball p={[0, 2.25, 0.5]} radius={0.75} m={mats.plant} />
      <Ball p={[0.45, 2.0, 0.75]} radius={0.5} m={mats.plantDark} />
      <Ball p={[-0.5, 2.05, 0.3]} radius={0.48} m={mats.plant} />
      <Ball p={[0.1, 2.6, 0.1]} radius={0.45} m={mats.plantDark} />

      {/* curved bench wrapping the planter's south side */}
      {benchSegs.map((i) => {
        const a = Math.PI * 0.15 + (i / (benchSegs.length - 1)) * Math.PI * 0.7
        const r = 1.45
        return (
          <group key={i} position={[Math.cos(a) * r, 0, 0.5 + Math.sin(a) * r]} rotation={[0, -a + Math.PI / 2, 0]}>
            <Box p={[0, 0.38, 0]} s={[0.56, 0.06, 0.48]} m={mats.walnut} />
            <Box p={[0, 0, 0]} s={[0.5, 0.38, 0.36]} m={mats.stone} />
          </group>
        )
      })}

      {[[-3.3, -2.3], [3.3, -2.3], [-3.3, 3.3], [3.3, 3.3]].map(([x, z]) => (
        <Box key={`${x}${z}`} p={[x, 0, z]} s={[0.26, 3.4, 0.26]} m={mats.steel} />
      ))}

      {/* ---- scenery: two tall floor vases flanking the way to the vault ---- */}
      {[-2.7, 2.7].map((x) => (
        <group key={x} position={[x, 0, -2.35]}>
          <Cyl p={[0, 0, 0]} radius={0.22} h={0.9} m={mats.terracotta} />
          <Cyl p={[0, 0.9, 0]} radius={0.12} h={0.18} m={mats.terracotta} />
          {[-0.08, 0.03, 0.1].map((dx, i) => (
            <Cyl key={dx} p={[dx, 1.05, i * 0.04 - 0.04]} radius={0.008} h={0.7 + i * 0.12} m={mats.walnut} r={[0, 0, dx * 1.6]} />
          ))}
        </group>
      ))}
    </group>
  )
}
