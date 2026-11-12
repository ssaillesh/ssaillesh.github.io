import * as THREE from 'three'

// Side profile of a low coupe, extruded across its width. Nose points to -x.
// Used by the car on the Garage lift and by its close-up model.
export function carBodyGeometry({ length = 3.6, width = 1.6, height = 1.2 } = {}) {
  const L = length / 2.4
  const H = height / 0.8
  const s = new THREE.Shape()
  s.moveTo(-1.2 * L, 0.14 * H)
  s.lineTo(-1.18 * L, 0.32 * H)
  s.quadraticCurveTo(-0.75 * L, 0.42 * H, -0.36 * L, 0.6 * H)
  s.quadraticCurveTo(0.05 * L, 0.78 * H, 0.5 * L, 0.6 * H)
  s.quadraticCurveTo(0.95 * L, 0.5 * H, 1.2 * L, 0.42 * H)
  s.lineTo(1.2 * L, 0.14 * H)
  s.lineTo(-1.2 * L, 0.14 * H)
  const bevel = 0.06 * Math.min(L, H)
  const g = new THREE.ExtrudeGeometry(s, { depth: width - bevel * 2, bevelEnabled: true, bevelSize: bevel, bevelThickness: bevel, bevelSegments: 4, curveSegments: 18 })
  g.translate(0, 0, -(width - bevel * 2) / 2)
  return g
}

export const wheelPositions = ({ length = 3.6, width = 1.6 } = {}) => {
  const x = length * 0.31
  const z = width / 2 + 0.01
  return [
    [-x, z],
    [x, z],
    [-x, -z],
    [x, -z],
  ]
}
