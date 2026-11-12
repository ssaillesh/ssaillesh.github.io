import * as THREE from 'three'

// Text and surface textures for the close-up models, drawn on a canvas so no
// font or image files are fetched. Uses the site's fonts once they are loaded.
const SERIF = '"Instrument Serif", Georgia, serif'
const SANS = '"DM Sans", Helvetica, Arial, sans-serif'
const MONO = '"JetBrains Mono", Menlo, monospace'

const cache = new Map()

function make(key, w, h, draw) {
  if (cache.has(key)) return cache.get(key)
  const c = document.createElement('canvas')
  c.width = w
  c.height = h
  const g = c.getContext('2d')
  draw(g, w, h)
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  t.anisotropy = 8
  cache.set(key, t)
  return t
}

const centered = (g, text, y, font, color, spacing = 0) => {
  g.font = font
  g.fillStyle = color
  g.textAlign = 'center'
  g.textBaseline = 'middle'
  if ('letterSpacing' in g) g.letterSpacing = `${spacing}px`
  g.fillText(text, g.canvas.width / 2, y)
  if ('letterSpacing' in g) g.letterSpacing = '0px'
}

const paperGrain = (g, w, h, base) => {
  g.fillStyle = base
  g.fillRect(0, 0, w, h)
  for (let i = 0; i < 6000; i++) {
    g.fillStyle = `rgba(80,60,30,${Math.random() * 0.035})`
    g.fillRect(Math.random() * w, Math.random() * h, 1.5, 1.5)
  }
}

// Diploma-style certificate. Deliberately generic: no crest, no signatures.
export const certificateTexture = ({ key, eyebrow, lines, accent = '#7a5a22' }) =>
  make(key, 1400, 1000, (g, w, h) => {
    paperGrain(g, w, h, '#f3ecdc')
    g.strokeStyle = accent
    g.lineWidth = 6
    g.strokeRect(46, 46, w - 92, h - 92)
    g.lineWidth = 1.5
    g.strokeRect(66, 66, w - 132, h - 132)
    centered(g, eyebrow, 170, `500 30px ${SANS}`, accent, 10)
    let y = 300
    for (const l of lines) {
      centered(g, l.text, y, l.font === 'mono' ? `400 ${l.size}px ${MONO}` : l.font === 'sans' ? `400 ${l.size}px ${SANS}` : `${l.italic ? 'italic ' : ''}400 ${l.size}px ${SERIF}`, l.color || '#2a2118', l.spacing || 0)
      y += l.gap || l.size * 1.5
    }
    g.strokeStyle = 'rgba(42,33,24,.5)'
    g.lineWidth = 2
    g.beginPath()
    g.moveTo(250, h - 190)
    g.lineTo(560, h - 190)
    g.stroke()
  })

// Engraved medal face: ring text plus a central word.
export const medalFaceTexture = (opts) => {
  const t = medalFaceRaw(opts)
  // cylinder caps map the canvas a quarter-turn off; turn it upright
  t.center.set(0.5, 0.5)
  t.rotation = Math.PI / 2
  return t
}

const medalFaceRaw = ({ key, base, ink, ring, center, sub }) =>
  make(key, 1024, 1024, (g, w) => {
    const r = w / 2
    const grd = g.createRadialGradient(r * 0.8, r * 0.7, 40, r, r, r)
    grd.addColorStop(0, base[0])
    grd.addColorStop(1, base[1])
    g.fillStyle = grd
    g.fillRect(0, 0, w, w)
    g.strokeStyle = ink
    g.lineWidth = 10
    g.beginPath()
    g.arc(r, r, r * 0.92, 0, Math.PI * 2)
    g.stroke()
    g.lineWidth = 4
    g.beginPath()
    g.arc(r, r, r * 0.66, 0, Math.PI * 2)
    g.stroke()
    // ring text
    g.font = `600 64px ${SANS}`
    g.fillStyle = ink
    g.textAlign = 'center'
    g.textBaseline = 'middle'
    const chars = ring.split('')
    const span = Math.min(Math.PI * 1.7, chars.length * 0.14)
    chars.forEach((ch, i) => {
      const a = -Math.PI / 2 - span / 2 + (i + 0.5) * (span / chars.length)
      g.save()
      g.translate(r + Math.cos(a) * r * 0.79, r + Math.sin(a) * r * 0.79)
      g.rotate(a + Math.PI / 2)
      g.fillText(ch, 0, 0)
      g.restore()
    })
    centered(g, center, r - (sub ? 20 : 0), `400 ${center.length > 4 ? 150 : 230}px ${SERIF}`, ink)
    if (sub) centered(g, sub, r + 120, `500 46px ${SANS}`, ink, 8)
  })

export const labelTexture = ({ key, w = 1024, h = 512, bg, lines, align = 'center' }) =>
  make(key, w, h, (g) => {
    if (bg) {
      g.fillStyle = bg
      g.fillRect(0, 0, w, h)
    } else g.clearRect(0, 0, w, h)
    let y = h * 0.5 - ((lines.length - 1) * 0.5 * (lines[0]?.size || 60) * 1.4)
    for (const l of lines) {
      const font = l.font === 'mono' ? MONO : l.font === 'sans' ? SANS : SERIF
      g.font = `${l.weight || 400} ${l.size}px ${font}`
      g.fillStyle = l.color || '#111'
      g.textBaseline = 'middle'
      if ('letterSpacing' in g) g.letterSpacing = `${l.spacing || 0}px`
      if (align === 'left') {
        g.textAlign = 'left'
        g.fillText(l.text, w * 0.08, y)
      } else {
        g.textAlign = 'center'
        g.fillText(l.text, w / 2, y)
      }
      y += l.gap || l.size * 1.4
    }
  })

// A résumé page: name, header rule and grey "text" bars (not real content).
export const resumePageTexture = () =>
  make('resume-page', 850, 1100, (g, w, h) => {
    paperGrain(g, w, h, '#f6f2ea')
    centered(g, 'Saillesh Somasundaram', 110, `400 64px ${SERIF}`, '#1b1a17')
    centered(g, 'RÉSUMÉ', 175, `500 22px ${SANS}`, '#7a5a22', 8)
    g.fillStyle = '#1b1a17'
    g.fillRect(80, 215, w - 160, 2)
    let y = 270
    for (const section of ['EXPERIENCE', 'EDUCATION', 'PROJECTS', 'SKILLS']) {
      g.font = `600 20px ${SANS}`
      g.fillStyle = '#7a5a22'
      g.textAlign = 'left'
      g.fillText(section, 80, y)
      y += 34
      const rows = section === 'EXPERIENCE' ? 9 : 4
      for (let i = 0; i < rows; i++) {
        g.fillStyle = 'rgba(27,26,23,.18)'
        g.fillRect(80, y, (w - 160) * (0.55 + Math.random() * 0.45), 9)
        y += 22
      }
      y += 26
    }
  })

export const foilBagTexture = ({ key, title, sub, band = '#8f2a22' }) =>
  make(key, 1024, 1280, (g, w, h) => {
    const grd = g.createLinearGradient(0, 0, w, h)
    grd.addColorStop(0, '#e2b63e')
    grd.addColorStop(0.5, '#f0cc5a')
    grd.addColorStop(1, '#c99a2a')
    g.fillStyle = grd
    g.fillRect(0, 0, w, h)
    g.fillStyle = band
    g.fillRect(0, h * 0.36, w, h * 0.3)
    g.fillStyle = 'rgba(255,255,255,.18)'
    g.beginPath()
    g.ellipse(w * 0.3, h * 0.2, w * 0.35, h * 0.08, -0.3, 0, Math.PI * 2)
    g.fill()
    centered(g, title, h * 0.47, `400 120px ${SERIF}`, '#fbf3df')
    centered(g, sub, h * 0.57, `500 40px ${SANS}`, '#f6dca0', 6)
    // illustrated chips
    for (let i = 0; i < 5; i++) {
      g.fillStyle = `rgba(250,220,140,${0.8 - i * 0.08})`
      g.beginPath()
      g.ellipse(w * (0.22 + i * 0.14), h * 0.82, 70, 46, i * 0.6, 0, Math.PI * 2)
      g.fill()
      g.strokeStyle = 'rgba(160,110,30,.5)'
      g.lineWidth = 4
      g.stroke()
    }
  })

export const ledStripTexture = () =>
  make('led-strip', 512, 64, (g, w, h) => {
    g.fillStyle = '#0c0d0e'
    g.fillRect(0, 0, w, h)
    for (let i = 0; i < 16; i++) {
      g.fillStyle = i % 5 === 3 ? '#e8a35a' : i % 3 === 0 ? '#7fcf98' : '#2b3a30'
      g.beginPath()
      g.arc(24 + i * 30, h / 2, 7, 0, Math.PI * 2)
      g.fill()
    }
  })

export const bookCoverTexture = ({ key, title, sub }) =>
  make(key, 800, 1000, (g, w, h) => {
    g.fillStyle = '#3a2a22'
    g.fillRect(0, 0, w, h)
    for (let i = 0; i < 4000; i++) {
      g.fillStyle = `rgba(0,0,0,${Math.random() * 0.12})`
      g.fillRect(Math.random() * w, Math.random() * h, 2, 2)
    }
    g.strokeStyle = '#c6a96c'
    g.lineWidth = 4
    g.strokeRect(60, 60, w - 120, h - 120)
    centered(g, title, h * 0.44, `400 84px ${SERIF}`, '#d9bd7e')
    centered(g, sub, h * 0.56, `500 28px ${SANS}`, '#c6a96c', 8)
  })

// Code editor screen: SQL with syntax colours, plus a small results chart.
export const sqlScreenTexture = () =>
  make('sql-screen', 1280, 800, (g, w, h) => {
    g.fillStyle = '#0f1216'
    g.fillRect(0, 0, w, h)
    g.fillStyle = '#171b21'
    g.fillRect(0, 0, w, 46)
    ;['#d97757', '#e8a35a', '#7fcf98'].forEach((c, i) => {
      g.fillStyle = c
      g.beginPath()
      g.arc(26 + i * 24, 23, 7, 0, Math.PI * 2)
      g.fill()
    })
    g.font = `400 20px ${MONO}`
    g.fillStyle = '#8e8a84'
    g.textAlign = 'left'
    g.textBaseline = 'middle'
    g.fillText('truckload_planning.sql — SQL Server', 110, 23)
    const K = '#c6a96c', F = '#9fb4c2', N = '#e8a35a', T = '#e6e1d6', C = '#5c574d'
    const lines = [
      [[C, '-- weekly load plan by lane']],
      [[K, 'SELECT '], [T, 'lane_id,']],
      [[T, '       '], [F, 'SUM'], [T, '(cases) '], [K, 'AS '], [T, 'cases,']],
      [[T, '       '], [F, 'AVG'], [T, '(fill_rate) '], [K, 'AS '], [T, 'avg_fill']],
      [[K, 'FROM '], [T, 'ops.shipments s']],
      [[K, 'JOIN '], [T, 'ops.lanes l '], [K, 'ON '], [T, 'l.id = s.lane_id']],
      [[K, 'WHERE '], [T, 'ship_date >= '], [F, 'DATEADD'], [T, '(week, '], [N, '-12'], [T, ', '], [F, 'GETDATE'], [T, '())']],
      [[K, 'GROUP BY '], [T, 'lane_id']],
      [[K, 'ORDER BY '], [T, 'avg_fill '], [K, 'DESC'], [T, ';']],
    ]
    g.font = `400 30px ${MONO}`
    lines.forEach((parts, i) => {
      let x = 90
      g.fillStyle = '#3a3631'
      g.fillText(String(i + 1).padStart(2, ' '), 30, 100 + i * 44)
      for (const [c, s] of parts) {
        g.fillStyle = c
        g.fillText(s, x, 100 + i * 44)
        x += g.measureText(s).width
      }
    })
    // results chart
    g.fillStyle = '#171b21'
    g.fillRect(0, h - 290, w, 290)
    g.fillStyle = '#8e8a84'
    g.font = `400 20px ${MONO}`
    g.fillText('RESULTS · avg_fill by lane', 40, h - 260)
    const bars = [0.92, 0.86, 0.81, 0.77, 0.7, 0.66, 0.6, 0.52, 0.47, 0.41]
    bars.forEach((v, i) => {
      g.fillStyle = i === 0 ? '#c6a96c' : '#4d5a66'
      const bh = v * 190
      g.fillRect(40 + i * 118, h - 40 - bh, 84, bh)
    })
  })

// CI pipeline on a dark terminal: every stage passing.
export const pipelineScreenTexture = () =>
  make('pipeline-screen', 1280, 800, (g, w, h) => {
    g.fillStyle = '#0f1114'
    g.fillRect(0, 0, w, h)
    g.font = `400 22px ${MONO}`
    g.fillStyle = '#8e8a84'
    g.textAlign = 'left'
    g.textBaseline = 'middle'
    g.fillText('pipeline #4821 · main · passed', 60, 60)
    const stages = ['lint', 'test', 'sonarqube', 'secrets', 'build', 'deploy']
    stages.forEach((s, i) => {
      const x = 60 + i * 200
      g.strokeStyle = '#7fcf98'
      g.lineWidth = 4
      g.beginPath()
      g.arc(x + 40, 200, 34, 0, Math.PI * 2)
      g.stroke()
      g.beginPath()
      g.moveTo(x + 24, 200)
      g.lineTo(x + 36, 214)
      g.lineTo(x + 58, 186)
      g.stroke()
      if (i < stages.length - 1) {
        g.strokeStyle = '#2b3a30'
        g.beginPath()
        g.moveTo(x + 80, 200)
        g.lineTo(x + 196, 200)
        g.stroke()
      }
      g.fillStyle = '#e6e1d6'
      g.font = `400 24px ${MONO}`
      g.textAlign = 'center'
      g.fillText(s, x + 40, 270)
      g.textAlign = 'left'
    })
    const log = [
      ['#7fcf98', '✓ quality gate passed'],
      ['#7fcf98', '✓ no secrets detected in diff'],
      ['#c6a96c', '→ rbac: grant reviewer on group/platform (dry run ok)'],
      ['#7fcf98', '✓ runner pool healthy · 0 stalled jobs'],
    ]
    g.font = `400 28px ${MONO}`
    log.forEach(([c, s], i) => {
      g.fillStyle = c
      g.fillText(s, 60, 400 + i * 56)
    })
    g.fillStyle = '#c6a96c'
    g.fillRect(60, h - 120, 18, 34)
  })

export const spineTexture = ({ key, title, color }) =>
  make(key, 1024, 128, (g, w, h) => {
    g.fillStyle = color
    g.fillRect(0, 0, w, h)
    g.fillStyle = '#c6a96c'
    g.fillRect(0, 10, w, 4)
    g.fillRect(0, h - 14, w, 4)
    centered(g, title, h / 2, `400 58px ${SERIF}`, '#ead9b0', 2)
  })

export const drawerLabelTexture = ({ key, text }) =>
  make(key, 1024, 82, (g, w, h) => {
    g.fillStyle = '#e9e2d2'
    g.fillRect(0, 0, w, h)
    centered(g, text, h / 2, `600 40px ${MONO}`, '#2a2118', 3)
  })

export const phoneCardTexture = () =>
  make('phone-card', 768, 384, (g, w, h) => {
    paperGrain(g, w, h, '#f3ecdc')
    centered(g, 'Saillesh', 120, `400 84px ${SERIF}`, '#1b1a17')
    centered(g, 's5somasu@uwaterloo.ca', 220, `400 34px ${MONO}`, '#4a3a22')
    centered(g, 'TORONTO · OPEN TO NEW GRAD ROLES', 300, `600 24px ${SANS}`, '#7a5a22', 4)
  })

// The intro card that slides out of the Foyer envelope.
export const introCardTexture = ({ name, motto, descriptor, lines }) =>
  make('intro-card', 1100, 760, (g, w, h) => {
    paperGrain(g, w, h, '#f6f1e6')
    g.strokeStyle = '#c6a96c'
    g.lineWidth = 3
    g.strokeRect(34, 34, w - 68, h - 68)
    centered(g, name, 150, `400 120px ${SERIF}`, '#1b1a17')
    centered(g, motto.toUpperCase(), 232, `600 26px ${SANS}`, '#7a5a22', 8)
    centered(g, descriptor, 320, `italic 400 44px ${SERIF}`, '#3a3226')
    g.font = `400 31px ${SANS}`
    g.fillStyle = '#3a3226'
    g.textAlign = 'center'
    lines.forEach((l, i) => g.fillText(l, w / 2, 420 + i * 48))
    centered(g, '— welcome in', h - 90, `italic 400 36px ${SERIF}`, '#7a5a22')
  })

// A printed analysis report: the SQL query and the results chart, on paper.
export const reportPageTexture = () =>
  make('report-page', 850, 1100, (g, w, h) => {
    paperGrain(g, w, h, '#f6f2ea')
    g.textAlign = 'left'
    g.textBaseline = 'middle'
    g.font = `600 22px ${SANS}`
    g.fillStyle = '#7a5a22'
    g.fillText('TRUCKLOAD PLANNING · WEEKLY', 70, 80)
    g.fillStyle = '#1b1a17'
    g.fillRect(70, 104, w - 140, 2)
    const code = [
      'SELECT lane_id,',
      '       SUM(cases)     AS cases,',
      '       AVG(fill_rate) AS avg_fill',
      'FROM ops.shipments s',
      'JOIN ops.lanes l ON l.id = s.lane_id',
      'WHERE ship_date >= DATEADD(week, -12, GETDATE())',
      'GROUP BY lane_id',
      'ORDER BY avg_fill DESC;',
    ]
    g.font = `400 22px ${MONO}`
    code.forEach((l, i) => {
      g.fillStyle = /^(SELECT|FROM|JOIN|WHERE|GROUP|ORDER)/.test(l.trim()) ? '#7a5a22' : '#2a2620'
      g.fillText(l, 70, 160 + i * 36)
    })
    g.font = `600 20px ${SANS}`
    g.fillStyle = '#7a5a22'
    g.fillText('AVG FILL BY LANE', 70, 500)
    const bars = [0.92, 0.86, 0.81, 0.77, 0.7, 0.66, 0.6, 0.52]
    bars.forEach((v, i) => {
      g.fillStyle = i === 0 ? '#c6a96c' : '#4d5a66'
      g.fillRect(70 + i * 88, 860 - v * 320, 60, v * 320)
    })
    g.fillStyle = '#1b1a17'
    g.fillRect(70, 862, w - 140, 2)
    g.fillStyle = 'rgba(27,26,23,.18)'
    for (let i = 0; i < 4; i++) g.fillRect(70, 920 + i * 30, (w - 140) * (0.5 + (i % 3) * 0.2), 10)
  })
