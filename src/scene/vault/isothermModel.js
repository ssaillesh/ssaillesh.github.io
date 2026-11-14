// The 4-rack slice of Isotherm's recirculation and GPU models that the playable
// demo (public/isotherm/index.html) runs, ported as-is so the rack in the Vault
// shows the same temperatures. Keep the two in step if the parameters change.

export const RACKS = 4
export const SLOTS = 4
const N = RACKS * SLOTS
export const SUPPLY_C = 25 // the demo's stress-test supply air
export const INLET_LIMIT_C = 27
// cool to hot, as the demo paints its servers
export const RAMP = ['#1C3C44', '#24545A', '#4E5A4A', '#8A6236', '#C2742E', '#E8913A']
export const OVER = '#C9362E'
// The 3D rack in the Vault, in metres: same proportions as a rack front in the demo.
export const RACK_SIZE = { w: 0.7, h: 2.1, d: 0.88 }

function buildModel() {
  const k = 0.7 * 1005
  const mf = 0.25
  const L = 1.5
  const hb = 1.0
  const eb = 0.5
  const rack = []
  const slot = []
  for (let r = 0; r < RACKS; r++)
    for (let s = 0; s < SLOTS; s++) {
      rack.push(r)
      slot.push(s)
    }
  const w = rack.map((r, i) => 1 + (hb * slot[i]) / (SLOTS - 1) + eb * (r === 0 || r === RACKS - 1 ? 1 : 0))
  const wmax = Math.max(...w)
  const A = []
  for (let i = 0; i < N; i++) {
    const g = []
    let sum = 0
    for (let j = 0; j < N; j++) {
      const v = w[j] * Math.exp(-Math.hypot(rack[i] - rack[j], slot[i] - slot[j]) / L)
      g.push(v)
      sum += v
    }
    const fi = (mf * w[i]) / wmax
    A.push(g.map((v) => (fi * v) / sum))
  }
  // D = (K − AᵀK)⁻¹Aᵀ by Gauss-Jordan elimination
  const M = []
  const B = []
  for (let a = 0; a < N; a++) {
    M.push([])
    B.push([])
    for (let b = 0; b < N; b++) {
      M[a].push((a === b ? 1 : 0) - A[b][a])
      B[a].push(A[b][a] / k)
    }
  }
  for (let c = 0; c < N; c++) {
    let p = c
    for (let q = c + 1; q < N; q++) if (Math.abs(M[q][c]) > Math.abs(M[p][c])) p = q
    ;[M[c], M[p]] = [M[p], M[c]]
    ;[B[c], B[p]] = [B[p], B[c]]
    const piv = M[c][c]
    for (let j = 0; j < N; j++) {
      M[c][j] /= piv
      B[c][j] /= piv
    }
    for (let q = 0; q < N; q++) {
      if (q === c) continue
      const f = M[q][c]
      if (!f) continue
      for (let j = 0; j < N; j++) {
        M[q][j] -= f * M[c][j]
        B[q][j] -= f * B[c][j]
      }
    }
  }
  const gpu = (i) => (rack[i] < 2 ? { tdp: 700, R: 0.075, thr: 87 } : { tdp: 400, R: 0.12, thr: 85 })
  return { D: B, gpu }
}

let model
const get = () => (model ||= buildModel())

// util: one number per server, 0 idle to 1 flat out. Returns inlet and GPU temperatures.
export function evaluate(util, supply = SUPPLY_C) {
  const m = get()
  const gp = (i) => 0.1 * m.gpu(i).tdp + util[i] * 0.9 * m.gpu(i).tdp
  const P = util.map((_, i) => 1500 + 8 * gp(i))
  const tin = m.D.map((row) => supply + row.reduce((acc, d, j) => acc + d * P[j], 0))
  const over = []
  const tg = tin.map((t, i) => {
    const v = t + gp(i) * m.gpu(i).R
    over.push(t > INLET_LIMIT_C || v >= m.gpu(i).thr)
    return Math.min(v, m.gpu(i).thr)
  })
  let head = INLET_LIMIT_C - Math.max(...tin)
  tg.forEach((t, i) => (head = Math.min(head, m.gpu(i).thr - t)))
  return { tin, tg, over, head }
}

export const emptyRow = () => Array.from({ length: N }, () => 0)

// Isotherm's choice for the next job: the free server that leaves the row the most headroom.
export function placeNext(util, supply = SUPPLY_C) {
  let best = -1
  let bestHead = -Infinity
  for (let c = 0; c < N; c++) {
    if (util[c] > 0) continue
    const trial = util.slice()
    trial[c] = 0.95
    const h = evaluate(trial, supply).head
    if (h > bestHead) {
      bestHead = h
      best = c
    }
  }
  return best
}

// One rack's servers, slot 0 at the bottom: colour, busy flag and the rack's hottest inlet.
export function rackView(util, rackIndex = 0, supply = SUPPLY_C) {
  const ev = evaluate(util, supply)
  const servers = []
  let maxIn = 0
  for (let s = 0; s < SLOTS; s++) {
    const i = rackIndex * SLOTS + s
    const level = Math.max(0, Math.min(5, Math.round(((ev.tg[i] - 30) / 55) * 5)))
    servers.push({ color: ev.over[i] ? OVER : RAMP[level], busy: util[i] > 0, over: ev.over[i] })
    maxIn = Math.max(maxIn, ev.tin[i])
  }
  return { servers, maxIn, head: ev.head }
}
