import { Box, Cyl, Chair, Monitor, Stool } from '../primitives.jsx'
import Interactive from '../Interactive.jsx'

// ROOM 03, WORKSHOP: x[-12, -4], z[-9, 1]. One workstation per role.
export default function Workshop({ mats, ctx }) {
  const it = (id) => ({ id, enabled: ctx.active, hovered: ctx.hovered, selected: ctx.selected, onHover: ctx.onHover, onSelect: ctx.onSelect })
  return (
    <group>
      {/* Symcor: platform console + runner rack */}
      <Interactive {...it('symcor')} label="Symcor · DevOps Engineer" sub="03.A" labelAt={[-10.1, 2.3, -7.8]} ring={[-10.3, -7.4, 1.7]}>
        <Box p={[-10.1, 0.72, -7.9]} s={[2.6, 0.05, 0.8]} m={mats.walnut} />
        <Box p={[-11.35, 0, -7.9]} s={[0.05, 0.72, 0.76]} m={mats.steel} />
        <Box p={[-8.85, 0, -7.9]} s={[0.05, 0.72, 0.76]} m={mats.steel} />
        <Monitor p={[-10.8, 0.77, -8.1]} rot={0.25} mats={mats} />
        <Monitor p={[-10.1, 0.77, -8.15]} mats={mats} w={0.7} />
        <Monitor p={[-9.4, 0.77, -8.1]} rot={-0.25} mats={mats} />
        <Chair p={[-10.1, 0, -7.15]} rot={Math.PI} mats={mats} />
        <Box p={[-11.55, 0, -6.4]} s={[0.62, 2.0, 0.9]} m={mats.blackMatte} />
        {[0.3, 0.6, 0.9, 1.2, 1.5, 1.8].map((y, i) => (
          <Box key={y} p={[-11.23, y, -6.4]} s={[0.01, 0.03, 0.6]} m={i % 3 === 1 ? mats.ledGreen : mats.led} cast={false} />
        ))}
      </Interactive>

      {/* OmniaBio: QC lab bench */}
      <Interactive {...it('omniabio')} label="OmniaBio · Quality Automation" sub="03.B" labelAt={[-6.3, 2.3, -7.9]} ring={[-6.3, -7.6, 1.6]}>
        <Box p={[-6.3, 0, -7.9]} s={[2.6, 0.88, 0.8]} m={mats.whiteLab} />
        <Box p={[-6.3, 0.88, -7.9]} s={[2.65, 0.04, 0.84]} m={mats.stone} />
        {[-7.2, -7.0, -6.8, -6.6].map((x) =>
          [-8.05, -7.85].map((z) => <Cyl key={`${x}${z}`} p={[x, 0.92, z]} radius={0.03} h={0.16} m={mats.glass} />),
        )}
        <Box p={[-7.0, 0.92, -7.95]} s={[0.9, 0.04, 0.36]} m={mats.steel} />
        <Monitor p={[-5.6, 0.92, -8.1]} mats={mats} screen="screenCool" />
        <Stool p={[-6.3, 0, -7.1]} mats={mats} />
      </Interactive>

      {/* PepsiCo Lethbridge: computer-vision rig over a conveyor */}
      <Interactive {...it('pepsico-ops')} label="PepsiCo · Software & Operations" sub="03.C" labelAt={[-10.6, 2.4, -3.6]} ring={[-10.5, -3.6, 1.7]}>
        <Box p={[-11.1, 0, -3.6]} s={[0.8, 0.7, 2.8]} m={mats.steel} />
        {[-4.8, -4.4, -4.0, -3.6, -3.2, -2.8, -2.4].map((z) => (
          <mesh key={z} position={[-11.1, 0.72, z]} rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.04, 0.04, 0.74, 12]} />
            <primitive object={mats.brass} attach="material" />
          </mesh>
        ))}
        <Box p={[-11.1, 0.76, -4.2]} s={[0.5, 0.36, 0.5]} m={mats.terracotta} />
        <Box p={[-11.1, 0.76, -3.1]} s={[0.46, 0.3, 0.42]} m={mats.terracotta} />
        {[[-0.2, -0.2], [0.2, -0.2], [0, 0.22]].map(([dx, dz]) => (
          <Box key={`${dx}${dz}`} p={[-9.9 + dx, 0, -3.6 + dz]} s={[0.03, 1.5, 0.03]} m={mats.steel} r={[dz * 0.4, 0, dx * -0.4]} />
        ))}
        <Box p={[-9.9, 1.5, -3.6]} s={[0.3, 0.2, 0.22]} m={mats.blackMatte} />
        <mesh position={[-10.1, 1.6, -3.6]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.08, 0.08, 0.16, 20]} />
          <primitive object={mats.steel} attach="material" />
        </mesh>
        <Monitor p={[-9.6, 0, -2.3]} rot={-0.6} mats={mats} w={0.7} h={0.42} />
      </Interactive>

      {/* PepsiCo Mississauga: analyst desk */}
      <Interactive {...it('pepsico-data')} label="PepsiCo · Data Analyst" sub="03.D" labelAt={[-11.0, 2.2, -0.4]} ring={[-10.7, -0.4, 1.4]}>
        <Box p={[-11.2, 0.72, -0.4]} s={[0.8, 0.05, 2.0]} m={mats.walnut} />
        <Box p={[-11.2, 0, -1.35]} s={[0.76, 0.72, 0.05]} m={mats.steel} />
        <Box p={[-11.2, 0, 0.55]} s={[0.76, 0.72, 0.05]} m={mats.steel} />
        <Monitor p={[-11.4, 0.77, -0.8]} rot={Math.PI / 2} mats={mats} />
        <Monitor p={[-11.4, 0.77, 0.0]} rot={Math.PI / 2} mats={mats} screen="screenCool" />
        <Chair p={[-10.45, 0, -0.4]} rot={-Math.PI / 2} mats={mats} />
      </Interactive>

      {/* UWAFT: autonomous vehicle on stands */}
      <Interactive {...it('uwaft')} label="UWAFT · Software Engineer" sub="03.E" labelAt={[-6.6, 2.2, -3.4]} ring={[-6.6, -3.4, 1.9]}>
        {[[-0.4, -0.8], [0.4, -0.8], [-0.4, 0.8], [0.4, 0.8]].map(([dx, dz]) => (
          <Box key={`${dx}${dz}`} p={[-6.6 + dx, 0, -3.4 + dz]} s={[0.12, 0.36, 0.12]} m={mats.steel} />
        ))}
        <Box p={[-6.6, 0.36, -3.4]} s={[1.1, 0.28, 2.2]} m={mats.carGrey} />
        <Box p={[-6.6, 0.64, -3.55]} s={[0.9, 0.3, 1.1]} m={mats.carGrey} />
        {[[-0.6, -0.7], [0.6, -0.7], [-0.6, 0.75], [0.6, 0.75]].map(([dx, dz]) => (
          <mesh key={`w${dx}${dz}`} position={[-6.6 + dx, 0.42, -3.4 + dz]} rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.24, 0.24, 0.16, 20]} />
            <primitive object={mats.rubber} attach="material" />
          </mesh>
        ))}
        <Cyl p={[-6.6, 0.94, -3.55]} radius={0.1} h={0.12} m={mats.blackMatte} />
        <Box p={[-5.2, 0, -2.4]} s={[0.5, 0.9, 0.4]} m={mats.steel} />
        <Monitor p={[-5.2, 0.9, -2.4]} rot={-0.8} mats={mats} screen="screenCool" />
      </Interactive>

      {/* Tool wall and work lamp */}
      <Box p={[-8.0, 0, -8.6]} s={[1.0, 1.1, 0.5]} m={mats.carRed} />
      {[0.25, 0.5, 0.75, 1.0].map((y) => (
        <Box key={y} p={[-8.0, y, -8.34]} s={[0.9, 0.015, 0.01]} m={mats.steel} cast={false} />
      ))}
    </group>
  )
}
