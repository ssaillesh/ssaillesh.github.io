// Floor plan of the residence, in metres. x runs west→east, z runs north→south
// (the entrance is on the south face, closest to the default camera).
// Every room's bounds feed the 3D scene, the SVG floor plan and the camera rig.

export const BUILDING = { minX: -12, maxX: 20, minZ: -9, maxZ: 9, wallHeight: 3.4 }

export const rooms = [
  {
    id: 'foyer',
    number: '01',
    name: 'Foyer',
    kicker: 'Introduction',
    purpose: 'Who I am',
    bounds: { minX: -4, maxX: 4, minZ: 4, maxZ: 9 },
  },
  {
    id: 'study',
    number: '02',
    name: 'Study',
    kicker: 'Education',
    purpose: 'The foundation',
    bounds: { minX: -12, maxX: -4, minZ: 1, maxZ: 9 },
  },
  {
    id: 'garage',
    number: '03',
    name: 'Garage',
    kicker: 'Experience',
    purpose: 'Where I’ve worked',
    bounds: { minX: 12, maxX: 20, minZ: -9, maxZ: 9 },
  },
  {
    id: 'vault',
    number: '04',
    name: 'Vault',
    kicker: 'Projects',
    purpose: 'Things I’ve built',
    bounds: { minX: -4, maxX: 4, minZ: -9, maxZ: -3 },
  },
  {
    id: 'lounge',
    number: '05',
    name: 'Lounge',
    kicker: 'Personal & contact',
    purpose: 'The person behind it',
    bounds: { minX: 4, maxX: 12, minZ: -9, maxZ: 9 },
  },
  {
    id: 'dining',
    number: '06',
    name: 'Dining',
    kicker: 'Kitchen & dining',
    purpose: 'Where the cooking happens',
    bounds: { minX: -12, maxX: -4, minZ: -9, maxZ: 1 },
  },
]

export const core = { bounds: { minX: -4, maxX: 4, minZ: -3, maxZ: 4 } }

export const roomById = Object.fromEntries(rooms.map((r) => [r.id, r]))

export const roomCenter = (room) => [
  (room.bounds.minX + room.bounds.maxX) / 2,
  0,
  (room.bounds.minZ + room.bounds.maxZ) / 2,
]

export const roomSize = (room) => [room.bounds.maxX - room.bounds.minX, room.bounds.maxZ - room.bounds.minZ]
