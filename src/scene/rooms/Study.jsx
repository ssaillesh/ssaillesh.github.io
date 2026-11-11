import { useMemo } from 'react'
import { Box, Cyl, Chair, FloorLamp, Rug } from '../primitives.jsx'
import Interactive from '../Interactive.jsx'
import { seeded } from '../random.js'

// ROOM 02, STUDY: x[-12, -4], z[1, 9]. Bookshelves and honours on the north wall,
// desk facing the west windows and the city.
export default function Study({ mats, ctx }) {
  const it = (id) => ({ id, enabled: ctx.active, hovered: ctx.hovered, selected: ctx.selected, onHover: ctx.onHover, onSelect: ctx.onSelect })

  const books = useMemo(() => {
    const r = seeded(3)
    const out = []
    for (let shelf = 0; shelf < 5; shelf++) {
      let x = -11.4
      while (x < -8.2) {
        const w = 0.05 + r() * 0.07
        const h = 0.24 + r() * 0.16
        if (r() > 0.88) { x += 0.18; continue }
        out.push({ x: x + w / 2, y: 0.12 + shelf * 0.48, w, h, m: Math.floor(r() * 8) })
        x += w + 0.008
      }
    }
    return out
  }, [])

  return (
    <group>
      <Rug p={[-8.6, 0.02, 5.3]} s={[3.6, 3.2]} m={mats.rugWarm} />

      {/* Bookshelf */}
      <Box p={[-9.8, 0, 1.28]} s={[3.5, 2.6, 0.04]} m={mats.walnut} />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <Box key={i} p={[-9.8, 0.08 + i * 0.48, 1.45]} s={[3.5, 0.04, 0.34]} m={mats.walnut} />
      ))}
      <Box p={[-11.56, 0, 1.45]} s={[0.04, 2.6, 0.34]} m={mats.walnut} />
      <Box p={[-8.04, 0, 1.45]} s={[0.04, 2.6, 0.34]} m={mats.walnut} />
      {books.map((b, i) => (
        <Box key={i} p={[b.x, b.y, 1.45]} s={[b.w, b.h, 0.24]} m={mats.books[b.m]} cast={false} />
      ))}

      {/* Honours on the wall */}
      <Interactive {...it('ideal')} label="IDEAL Scholar Award" sub="02.A" labelAt={[-7.2, 2.4, 1.2]} ring={[-7.2, 1.7, 0.6]}>
        <Box p={[-7.2, 1.1, 1.1]} s={[0.66, 0.86, 0.04]} m={mats.brass} />
        <Box p={[-7.2, 1.16, 1.125]} s={[0.54, 0.74, 0.01]} m={mats.ivory} cast={false} />
      </Interactive>
      <Interactive {...it('presidential')} label="Presidential Scholarship" sub="02.B" labelAt={[-6.2, 2.4, 1.2]} ring={[-6.2, 1.7, 0.6]}>
        <Box p={[-6.2, 1.1, 1.1]} s={[0.66, 0.86, 0.04]} m={mats.steel} />
        <Box p={[-6.2, 1.16, 1.125]} s={[0.54, 0.74, 0.01]} m={mats.ivory} cast={false} />
      </Interactive>
      <Interactive {...it('cobalt')} label="Cobalt Medallion" sub="02.C" labelAt={[-5.0, 2.0, 1.75]} ring={[-5.0, 1.75, 0.6]}>
        <Box p={[-5.0, 0, 1.75]} s={[0.5, 1.0, 0.5]} m={mats.walnut} />
        <Box p={[-5.0, 1.0, 1.75]} s={[0.46, 0.46, 0.46]} m={mats.glass} cast={false} />
        <Cyl p={[-5.0, 1.04, 1.75]} radius={0.05} h={0.12} m={mats.brass} />
        <mesh position={[-5.0, 1.3, 1.75]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.13, 0.13, 0.025, 32]} />
          <meshStandardMaterial color="#2c4f8c" metalness={0.8} roughness={0.25} />
        </mesh>
      </Interactive>

      {/* Desk facing the windows */}
      <Box p={[-9.7, 0.72, 5.4]} s={[0.95, 0.05, 2.1]} m={mats.walnut} />
      <Box p={[-9.7, 0, 4.45]} s={[0.9, 0.72, 0.05]} m={mats.walnut} />
      <Box p={[-9.7, 0, 6.35]} s={[0.9, 0.72, 0.05]} m={mats.walnut} />
      <Chair p={[-8.9, 0, 5.3]} rot={-Math.PI / 2} mats={mats} />
      <Cyl p={[-9.9, 0.77, 4.75]} radius={0.08} h={0.02} m={mats.brass} />
      <Cyl p={[-9.9, 0.77, 4.75]} radius={0.012} h={0.42} m={mats.brass} />
      <Cyl p={[-9.9, 1.15, 4.75]} radius={0.11} h={0.12} m={mats.lampGlow} cast={false} />
      <Interactive {...it('distinction')} label="Term Distinction" sub="02.D" labelAt={[-9.7, 1.5, 5.9]} ring={[-9.7, 5.9, 0.5]}>
        <Box p={[-9.7, 0.77, 5.9]} s={[0.3, 0.06, 0.4]} m={mats.books[1]} />
        <Box p={[-9.7, 0.83, 5.9]} s={[0.28, 0.04, 0.38]} m={mats.books[4]} />
      </Interactive>

      {/* Reading corner */}
      <group position={[-6.2, 0, 7.4]} rotation={[0, -2.4, 0]}>
        <Box p={[0, 0, 0]} s={[0.9, 0.42, 0.85]} m={mats.leather} />
        <Box p={[0, 0.42, -0.34]} s={[0.9, 0.5, 0.18]} m={mats.leather} />
        <Box p={[-0.4, 0.42, 0.05]} s={[0.12, 0.2, 0.8]} m={mats.leather} />
        <Box p={[0.4, 0.42, 0.05]} s={[0.12, 0.2, 0.8]} m={mats.leather} />
      </group>
      <Cyl p={[-5.0, 0, 8.2]} radius={0.28} h={0.55} m={mats.walnut} />
      <FloorLamp p={[-7.2, 0, 8.4]} mats={mats} />
    </group>
  )
}
