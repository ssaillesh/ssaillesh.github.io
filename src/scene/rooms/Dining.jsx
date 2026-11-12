import { Box, Cyl, Chair, Plant, Rug, Stool } from '../primitives.jsx'
import Interactive from '../Interactive.jsx'

// ROOM 06, DINING: x[-12, -4], z[-9, 1], the Lounge's kitchen and dining room.
// A kitchen run under the north glass, a marble island with the cast-iron pan
// (cooking), and a six-seat walnut dining table.
export default function Dining({ mats, ctx }) {
  const it = (id) => ({ id, enabled: ctx.active, hovered: ctx.hovered, selected: ctx.selected, onHover: ctx.onHover, onSelect: ctx.onSelect })
  return (
    <group>
      {/* kitchen run along the north glass, tall pantry on the west */}
      <Box p={[-9.0, 0, -8.5]} s={[5.2, 0.9, 0.65]} m={mats.walnut} />
      <Box p={[-9.0, 0.9, -8.5]} s={[5.24, 0.04, 0.69]} m={mats.marble} />
      <Box p={[-10.4, 0.94, -8.5]} s={[0.7, 0.01, 0.45]} m={mats.blackMatte} cast={false} />
      {[-10.6, -10.2].map((x) => (
        <Cyl key={x} p={[x, 0.95, -8.5]} radius={0.09} h={0.005} m={mats.steel} cast={false} />
      ))}
      <Box p={[-7.6, 0.94, -8.45]} s={[0.55, 0.02, 0.4]} m={mats.steel} cast={false} />
      <Box p={[-11.6, 0, -6.9]} s={[0.65, 2.4, 1.3]} m={mats.walnut} />

      {/* the island, with the pan on the hob */}
      <Interactive {...it('cooking')} label="A cast-iron pan" sub="Pick up" ring={[-8.6, -5.6, 1.6]}>
        <Box p={[-8.6, 0, -5.6]} s={[2.6, 0.9, 1.0]} m={mats.walnut} />
        <Box p={[-8.6, 0.9, -5.6]} s={[2.7, 0.05, 1.1]} m={mats.marble} />
        <Box p={[-9.2, 0.95, -5.6]} s={[0.6, 0.01, 0.5]} m={mats.blackMatte} cast={false} />
        <Cyl p={[-9.2, 0.96, -5.6]} radius={0.17} h={0.06} m={mats.blackMatte} />
        <Box p={[-8.85, 0.98, -5.6]} s={[0.4, 0.03, 0.05]} m={mats.walnut} />
        <Box p={[-8.0, 0.95, -5.5]} s={[0.45, 0.03, 0.3]} m={mats.walnut} />
        {[-9.4, -8.6, -7.8].map((x) => (
          <Stool key={x} p={[x, 0, -4.85]} mats={mats} />
        ))}
      </Interactive>

      {/* dining table for six */}
      <Rug p={[-8.0, 0.02, -1.6]} s={[3.6, 2.4]} m={mats.rugWarm} />
      <Box p={[-8.0, 0.72, -1.6]} s={[2.4, 0.05, 1.0]} m={mats.walnut} />
      {[-8.9, -7.1].map((x) => (
        <Box key={x} p={[x, 0, -1.6]} s={[0.08, 0.72, 0.8]} m={mats.steel} />
      ))}
      {[-8.8, -8.0, -7.2].map((x) => (
        <group key={x}>
          <Chair p={[x, 0, -2.4]} rot={0} mats={mats} seat="linen" />
          <Chair p={[x, 0, -0.8]} rot={Math.PI} mats={mats} seat="linen" />
        </group>
      ))}
      <Cyl p={[-8.0, 0.77, -1.6]} radius={0.12} h={0.18} m={mats.stone} />
      <Plant p={[-11.4, 0, 0.3]} mats={mats} scale={1.1} />
      <Plant p={[-4.6, 0, -8.4]} mats={mats} />
    </group>
  )
}
