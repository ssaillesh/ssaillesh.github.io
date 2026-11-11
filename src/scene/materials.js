import * as THREE from 'three'

// Procedural canvas textures keep the scene free of large image downloads.
const canvasTexture = (size, draw, repeat = [1, 1]) => {
  const c = document.createElement('canvas')
  c.width = c.height = size
  const g = c.getContext('2d')
  draw(g, size)
  const t = new THREE.CanvasTexture(c)
  t.wrapS = t.wrapT = THREE.RepeatWrapping
  t.repeat.set(repeat[0], repeat[1])
  t.colorSpace = THREE.SRGBColorSpace
  t.anisotropy = 4
  return t
}

const rand = (() => {
  let s = 7
  return () => ((s = (s * 16807) % 2147483647) / 2147483647)
})()

const concreteDraw = (base, spread) => (g, n) => {
  g.fillStyle = base
  g.fillRect(0, 0, n, n)
  for (let i = 0; i < 2200; i++) {
    const a = rand() * spread
    g.fillStyle = rand() > 0.5 ? `rgba(255,255,255,${a})` : `rgba(0,0,0,${a})`
    const r = rand() * 2.2
    g.fillRect(rand() * n, rand() * n, r, r)
  }
  for (let i = 0; i < 14; i++) {
    const x = rand() * n, y = rand() * n, r = 30 + rand() * 90
    const grd = g.createRadialGradient(x, y, 0, x, y, r)
    grd.addColorStop(0, `rgba(0,0,0,${0.05 + rand() * 0.05})`)
    grd.addColorStop(1, 'rgba(0,0,0,0)')
    g.fillStyle = grd
    g.fillRect(0, 0, n, n)
  }
}

const walnutDraw = (g, n) => {
  g.fillStyle = '#4a3426'
  g.fillRect(0, 0, n, n)
  for (let y = 0; y < n; y += 1) {
    const v = Math.sin(y * 0.09) * 0.5 + Math.sin(y * 0.031 + 2) * 0.5
    g.fillStyle = `rgba(${v > 0 ? '20,10,5' : '120,80,50'},${Math.abs(v) * 0.16})`
    g.fillRect(0, y, n, 1)
  }
}

const plankDraw = (base) => (g, n) => {
  g.fillStyle = base
  g.fillRect(0, 0, n, n)
  const rows = 8
  for (let r = 0; r < rows; r++) {
    const y = (r * n) / rows
    g.fillStyle = `rgba(0,0,0,${0.04 + rand() * 0.06})`
    g.fillRect(0, y, n, n / rows)
    g.fillStyle = 'rgba(0,0,0,0.35)'
    g.fillRect(0, y, n, 1)
    const off = rand() * n
    g.fillRect(off, y, 1, n / rows)
  }
}

let cache = null

export function getMaterials() {
  if (cache) return cache
  const std = (o) => new THREE.MeshStandardMaterial(o)
  const concreteMap = canvasTexture(256, concreteDraw('#7f7a73', 0.08), [3, 3])
  const wallMap = canvasTexture(256, concreteDraw('#8a857d', 0.06), [2, 1])
  const polishedMap = canvasTexture(256, concreteDraw('#6a645c', 0.05), [2, 2])
  const walnutMap = canvasTexture(128, walnutDraw, [1, 1])
  const oakFloor = canvasTexture(256, plankDraw('#6b4a33'), [3, 3])
  const darkFloor = canvasTexture(256, plankDraw('#3b2a1f'), [3, 3])

  cache = {
    slab: std({ color: '#3c3935', roughness: 0.9 }),
    concreteFloor: std({ map: concreteMap, roughness: 0.82 }),
    polished: std({ map: polishedMap, roughness: 0.42, metalness: 0.04 }),
    oakFloor: std({ map: oakFloor, roughness: 0.6 }),
    darkFloor: std({ map: darkFloor, roughness: 0.55 }),
    wall: std({ map: wallMap, roughness: 0.88 }),
    wallCap: std({ color: '#2a2724', roughness: 0.7 }),
    walnut: std({ map: walnutMap, roughness: 0.5 }),
    steel: std({ color: '#1b1b1c', roughness: 0.38, metalness: 0.75 }),
    blackMatte: std({ color: '#141414', roughness: 0.7 }),
    brass: std({ color: '#c6a96c', roughness: 0.28, metalness: 1 }),
    ivory: std({ color: '#e6dfd1', roughness: 0.9 }),
    linen: std({ color: '#b9b0a2', roughness: 0.95 }),
    leather: std({ color: '#5b3522', roughness: 0.55 }),
    marble: std({ color: '#e9e5dd', roughness: 0.22 }),
    stone: std({ color: '#5c5852', roughness: 0.75 }),
    plant: std({ color: '#3f5638', roughness: 0.85 }),
    plantDark: std({ color: '#2f4229', roughness: 0.85 }),
    terracotta: std({ color: '#7a4c34', roughness: 0.9 }),
    rugWarm: std({ color: '#6e6256', roughness: 1 }),
    rugIvory: std({ color: '#cbc2b2', roughness: 1 }),
    whiteLab: std({ color: '#d9d6cf', roughness: 0.5 }),
    rubber: std({ color: '#0c0c0c', roughness: 0.9 }),
    chipFoil: std({ color: '#d6a634', roughness: 0.32, metalness: 0.45 }),
    chipBand: std({ color: '#9e2f26', roughness: 0.4, metalness: 0.2 }),
    carRed: std({ color: '#7a1f17', roughness: 0.25, metalness: 0.6 }),
    carGrey: std({ color: '#2c2f33', roughness: 0.3, metalness: 0.7 }),
    glass: new THREE.MeshPhysicalMaterial({ color: '#9fb0bd', roughness: 0.05, metalness: 0, transparent: true, opacity: 0.12, depthWrite: false }),
    screen: std({ color: '#0b0d10', emissive: '#d9b77a', emissiveIntensity: 0.35, roughness: 0.3 }),
    screenCool: std({ color: '#0b0d10', emissive: '#9fb4c2', emissiveIntensity: 0.35, roughness: 0.3 }),
    lampGlow: std({ color: '#fff1d6', emissive: '#ffc983', emissiveIntensity: 2.2 }),
    fire: std({ color: '#2a1206', emissive: '#ff8a3c', emissiveIntensity: 2.4 }),
    led: std({ color: '#0b0b0b', emissive: '#e8a35a', emissiveIntensity: 1.6 }),
    ledGreen: std({ color: '#0b0b0b', emissive: '#7fcf98', emissiveIntensity: 1.4 }),
    books: ['#5b3a2a', '#2f3b3a', '#7d6a4f', '#3a2e2a', '#8a7a62', '#4a4f4a', '#6b3c2c', '#2c2c30'].map((c) => std({ color: c, roughness: 0.8 })),
  }
  return cache
}

export function makeWindowTexture() {
  return canvasTexture(128, (g, n) => {
    g.fillStyle = '#07080a'
    g.fillRect(0, 0, n, n)
    const cols = 8, rows = 16
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const on = rand()
        if (on < 0.62) continue
        const warm = rand() > 0.25
        const a = 0.35 + rand() * 0.65
        g.fillStyle = warm ? `rgba(255,${180 + rand() * 50},${110 + rand() * 50},${a})` : `rgba(200,215,230,${a * 0.7})`
        g.fillRect(c * (n / cols) + 3, r * (n / rows) + 2, n / cols - 6, n / rows - 4)
      }
    }
  })
}

export function makeCarPrintTexture() {
  return canvasTexture(512, (g, n) => {
    g.fillStyle = '#121212'
    g.fillRect(0, 0, n, n)
    g.strokeStyle = '#c6a96c'
    g.lineWidth = 5
    g.lineCap = 'round'
    g.lineJoin = 'round'
    const y = n * 0.62
    g.beginPath()
    g.moveTo(n * 0.08, y)
    g.lineTo(n * 0.14, y - n * 0.05)
    g.quadraticCurveTo(n * 0.3, y - n * 0.09, n * 0.38, y - n * 0.17)
    g.quadraticCurveTo(n * 0.52, y - n * 0.24, n * 0.66, y - n * 0.15)
    g.quadraticCurveTo(n * 0.82, y - n * 0.1, n * 0.92, y - n * 0.04)
    g.lineTo(n * 0.92, y)
    g.stroke()
    for (const cx of [0.26, 0.76]) {
      g.beginPath()
      g.arc(n * cx, y + n * 0.01, n * 0.065, 0, Math.PI * 2)
      g.stroke()
    }
    g.fillStyle = '#8e8a84'
    g.font = `${n * 0.035}px monospace`
    g.fillText('STUDY IN PROPORTION', n * 0.08, n * 0.88)
  })
}
