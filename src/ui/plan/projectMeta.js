import { projects } from '../../data/projects.js'

// Screenshots for the quick view, picked up by file name:
//   src/assets/projects/<id>.jpg    → the cover
//   src/assets/projects/<id>-2.jpg  → more shots, in number order
// A project with no file here falls back to its `image`, then to a generated cover.
const files = import.meta.glob('../../assets/projects/*.{jpg,jpeg,png,webp}', { eager: true, import: 'default' })

const SHOTS = {}
for (const [path, url] of Object.entries(files)) {
  const base = path.split('/').pop().replace(/\.[^.]+$/, '')
  const m = /^(.+?)(?:-(\d+))?$/.exec(base)
  const id = m[1]
  const n = m[2] ? Number(m[2]) : 1
  ;(SHOTS[id] ||= []).push({ n, url })
}
for (const id of Object.keys(SHOTS)) SHOTS[id] = SHOTS[id].sort((a, b) => a.n - b.n).map((s) => s.url)

export const shotsFor = (p) => SHOTS[p.id] || (p.image ? [p.image] : [])

// Filter chips. A project can set its own `tags`; these fill in for the existing ones.
export const FILTERS = ['All', 'AI / ML', 'Full-stack', 'Quant', 'Hardware']
const TAGS = {
  rova: ['Full-stack'],
  vouch: ['Full-stack'],
  lapzero: ['AI / ML', 'Full-stack'],
  codegraphrag: ['AI / ML'],
  automl: ['AI / ML'],
  asl: ['AI / ML'],
  news: ['AI / ML', 'Full-stack'],
  heston: ['Quant'],
  ict: ['Quant'],
  padlock: ['Hardware'],
  invasion: [],
}
export const tagsFor = (p) => p.tags || TAGS[p.id] || []

// Newest year first; within a year, the order in projects.js.
export const sortedProjects = () =>
  projects
    .map((p, i) => ({ p, i }))
    .sort((a, b) => (b.p.year || 0) - (a.p.year || 0) || a.i - b.i)
    .map((x) => x.p)

// Featured on the home page: projects marked `featured`, or the newest three if none are.
export const featuredProjects = () => {
  const f = projects.filter((p) => p.featured)
  return f.length ? f : sortedProjects().slice(0, 3)
}

export const projectHref = (id) => `#/projects/${encodeURIComponent(id)}`

export const projectById = (id) => projects.find((p) => p.id === id) || null

// A generated cover: each project gets its own colour from its id.
const hash = (s) => [...s].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7)
export const coverBackground = (id) => {
  const h = hash(id) % 360
  const h2 = (h + 40) % 360
  return `radial-gradient(90% 80% at 80% 0%, hsl(${h} 45% 26%), transparent 70%), linear-gradient(160deg, hsl(${h2} 30% 13%), #0d0d0e)`
}
