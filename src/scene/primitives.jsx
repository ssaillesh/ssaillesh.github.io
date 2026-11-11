import * as THREE from 'three'

// One shared unit geometry per primitive; size comes from `scale`.
const unitBox = new THREE.BoxGeometry(1, 1, 1)
const unitCyl = new THREE.CylinderGeometry(1, 1, 1, 24)
const unitSphere = new THREE.SphereGeometry(1, 24, 16)

// Box positioned by its base centre: p = [x, bottomY, z], s = [w, h, d].
export function Box({ p = [0, 0, 0], s = [1, 1, 1], m, r, cast = true, receive = true, ...rest }) {
  return (
    <mesh
      geometry={unitBox}
      material={m}
      position={[p[0], p[1] + s[1] / 2, p[2]]}
      rotation={r}
      scale={s}
      castShadow={cast}
      receiveShadow={receive}
      {...rest}
    />
  )
}

export function Cyl({ p = [0, 0, 0], radius = 0.5, h = 1, m, r, cast = true, ...rest }) {
  return (
    <mesh
      geometry={unitCyl}
      material={m}
      position={[p[0], p[1] + h / 2, p[2]]}
      rotation={r}
      scale={[radius, h, radius]}
      castShadow={cast}
      receiveShadow
      {...rest}
    />
  )
}

export function Ball({ p = [0, 0, 0], radius = 0.5, m, ...rest }) {
  return <mesh geometry={unitSphere} material={m} position={p} scale={radius} castShadow {...rest} />
}

// ---- Furniture kit ------------------------------------------------------
// `rot` turns a piece about its own base centre.

export function Chair({ p, rot = 0, mats, seat = 'leather' }) {
  return (
    <group position={p} rotation={[0, rot, 0]}>
      <Box p={[0, 0.42, 0]} s={[0.5, 0.08, 0.5]} m={mats[seat]} />
      <Box p={[0, 0.5, -0.22]} s={[0.5, 0.45, 0.06]} m={mats[seat]} />
      {[[-0.22, -0.22], [0.22, -0.22], [-0.22, 0.22], [0.22, 0.22]].map(([x, z]) => (
        <Box key={`${x}${z}`} p={[x, 0, z]} s={[0.04, 0.42, 0.04]} m={mats.steel} />
      ))}
    </group>
  )
}

export function Stool({ p, mats }) {
  return (
    <group position={p}>
      <Cyl p={[0, 0.72, 0]} radius={0.2} h={0.06} m={mats.leather} />
      <Cyl p={[0, 0, 0]} radius={0.03} h={0.72} m={mats.steel} />
      <Cyl p={[0, 0, 0]} radius={0.18} h={0.03} m={mats.steel} />
    </group>
  )
}

export function Plant({ p, mats, scale = 1 }) {
  return (
    <group position={p} scale={scale}>
      <Cyl p={[0, 0, 0]} radius={0.24} h={0.5} m={mats.terracotta} />
      <Ball p={[0, 0.95, 0]} radius={0.42} m={mats.plant} />
      <Ball p={[0.18, 1.3, 0.08]} radius={0.3} m={mats.plantDark} />
      <Ball p={[-0.15, 1.2, -0.12]} radius={0.28} m={mats.plant} />
    </group>
  )
}

export function FloorLamp({ p, mats }) {
  return (
    <group position={p}>
      <Cyl p={[0, 0, 0]} radius={0.16} h={0.03} m={mats.brass} />
      <Cyl p={[0, 0, 0]} radius={0.015} h={1.5} m={mats.brass} />
      <Cyl p={[0, 1.45, 0]} radius={0.2} h={0.25} m={mats.lampGlow} cast={false} />
    </group>
  )
}

export function Monitor({ p, rot = 0, mats, w = 0.6, h = 0.36, screen = 'screen' }) {
  return (
    <group position={p} rotation={[0, rot, 0]}>
      <Box p={[0, 0, 0]} s={[0.16, 0.02, 0.12]} m={mats.steel} />
      <Box p={[0, 0, -0.02]} s={[0.03, 0.18, 0.03]} m={mats.steel} />
      <Box p={[0, 0.16, 0]} s={[w, h, 0.03]} m={mats.blackMatte} />
      <Box p={[0, 0.175, 0.017]} s={[w - 0.04, h - 0.03, 0.002]} m={mats[screen]} cast={false} />
    </group>
  )
}

export function Rug({ p, s, m }) {
  return <Box p={p} s={[s[0], 0.015, s[1]]} m={m} cast={false} />
}

// Generic snack bag (no branding): a pillowed foil body with crimped seams.
export function ChipBag({ p, rot = [0, 0, 0], mats, scale = 1 }) {
  return (
    <group position={p} rotation={rot} scale={scale}>
      <mesh geometry={unitSphere} material={mats.chipFoil} position={[0, 0.2, 0]} scale={[0.15, 0.19, 0.055]} castShadow />
      <mesh geometry={unitSphere} material={mats.chipBand} position={[0, 0.2, 0.004]} scale={[0.152, 0.06, 0.056]} />
      <Box p={[0, 0.375, 0]} s={[0.27, 0.035, 0.018]} m={mats.chipFoil} />
      <Box p={[0, 0.005, 0]} s={[0.27, 0.035, 0.018]} m={mats.chipFoil} />
    </group>
  )
}
