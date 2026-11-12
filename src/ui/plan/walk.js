// The order you walk through the residence in the plain view. Each room is one section of the
// page: `section` is its element id (sec-<section>), `tab` is the phone tab it lights,
// `tone` and `glow` tint the page while you are in it.
export const WALK = [
  { room: 'foyer', section: 'top', tab: '', tone: '#0d0d0e', glow: 'rgba(198,169,108,0.10)' },
  { room: 'garage', section: 'work', tab: 'work', tone: '#110e0a', glow: 'rgba(232,163,90,0.11)' },
  { room: 'vault', section: 'projects', tab: 'projects', tone: '#0a0d11', glow: 'rgba(120,150,190,0.12)' },
  { room: 'study', section: 'about', tab: 'about', tone: '#0c0f0c', glow: 'rgba(127,199,154,0.08)' },
  { room: 'lab', section: 'lab', tab: 'about', tone: '#0a0f10', glow: 'rgba(110,190,200,0.09)' },
  { room: 'lounge', section: 'den', tab: 'contact', tone: '#110c0c', glow: 'rgba(214,120,110,0.09)' },
]

export const walkStep = (room) => WALK.findIndex((w) => w.room === room) + 1
export const walkByRoom = Object.fromEntries(WALK.map((w) => [w.room, w]))
