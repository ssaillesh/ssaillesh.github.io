import { Box, Cyl } from '../primitives.jsx'

// Central circulation: open hall with a blackened-steel spiral stair to the roof
// and four structural columns marking the core.
export default function Core({ mats }) {
  const treads = Array.from({ length: 16 }, (_, i) => i)
  return (
    <group>
      <Cyl p={[0, 0, 0.5]} radius={1.7} h={0.015} m={mats.rugWarm} cast={false} />
      <Cyl p={[0, 0, 0.5]} radius={0.07} h={3.4} m={mats.steel} />
      {treads.map((i) => {
        const a = i * (Math.PI / 8)
        return (
          <group key={i} position={[0, 0.12 + i * 0.205, 0.5]} rotation={[0, -a, 0]}>
            <Box p={[0.5, 0, 0]} s={[1.0, 0.05, 0.36]} m={mats.walnut} />
            <Box p={[0.98, 0.05, 0]} s={[0.02, 0.9, 0.02]} m={mats.steel} cast={false} />
          </group>
        )
      })}
      {[[-3.3, -2.3], [3.3, -2.3], [-3.3, 3.3], [3.3, 3.3]].map(([x, z]) => (
        <Box key={`${x}${z}`} p={[x, 0, z]} s={[0.26, 3.4, 0.26]} m={mats.steel} />
      ))}
    </group>
  )
}
