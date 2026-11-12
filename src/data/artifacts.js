// Every object in the residence that stands for something about Saillesh.
// A room's panel lists only `object` and `where` (what is there); the details
// appear once the visitor picks the object up. `kind` tells the panel which
// detail view to show; `ref` points at the record it is about.

export const artifacts = [
  // 01 Foyer
  { id: 'intro', room: 'foyer', object: 'A sealed envelope', where: 'On the console', kind: 'intro' },
  { id: 'active', room: 'foyer', object: 'Running shoes', where: 'By the door', kind: 'interest', ref: 'active' },

  // 02 Study
  { id: 'degree', room: 'study', object: 'A framed certificate', where: 'North wall', kind: 'degree' },
  { id: 'cabinet', room: 'study', object: 'A lit display cabinet', where: 'North wall', kind: 'cabinet' },
  { id: 'resume', room: 'study', object: 'A leather folio', where: 'On the desk', kind: 'resume' },
  { id: 'coursework', room: 'study', object: 'Five well-used textbooks', where: 'Bookshelf', kind: 'coursework' },
  { id: 'specialization', room: 'study', object: 'A microscope', where: 'Side table, reading corner', kind: 'specialization' },

  // 03 Garage
  { id: 'symcor', room: 'garage', object: 'A server rack and a security key', where: 'Bench row, north glass', kind: 'experience', ref: 'symcor' },
  { id: 'omniabio', room: 'garage', object: 'A test-tube rack', where: 'Lab cart, north glass', kind: 'experience', ref: 'omniabio' },
  { id: 'pepsico-ops', room: 'garage', object: 'A bag of chips', where: 'On the pallet', kind: 'experience', ref: 'pepsico-ops' },
  { id: 'pepsico-data', room: 'garage', object: 'A clipboard of SQL and charts', where: 'Standing desk', kind: 'experience', ref: 'pepsico-data' },
  { id: 'uwaft', room: 'garage', object: 'An autonomous car with a lidar mount', where: 'Up on the lift', kind: 'experience', ref: 'uwaft' },
  { id: 'toolkit', room: 'garage', object: 'A tool chest', where: 'By the north glass', kind: 'toolkit' },

  // 05 Lounge
  { id: 'cars', room: 'lounge', object: 'A scale model car', where: 'Coffee table', kind: 'interest', ref: 'cars' },
  { id: 'gym', room: 'garage', object: 'A dumbbell rack', where: 'Training corner', kind: 'interest', ref: 'gym' },
  { id: 'cooking', room: 'dining', object: 'A cast-iron pan', where: 'Kitchen island', kind: 'interest', ref: 'cooking' },
  { id: 'biking', room: 'garage', object: 'A bicycle', where: 'On the wall, training corner', kind: 'interest', ref: 'biking' },
  { id: 'exploring', room: 'lounge', object: 'Two photographs', where: 'Credenza', kind: 'interest', ref: 'exploring' },
  { id: 'contact', room: 'lounge', object: 'A rotary phone', where: 'Side table by the sofa', kind: 'contact' },
]

export const artifactById = Object.fromEntries(artifacts.map((a) => [a.id, a]))
export const artifactsIn = (room) => artifacts.filter((a) => a.room === room)

// One-line room descriptions for the panel: atmosphere, not answers.
export const roomIntro = {
  foyer: 'The way in. Something has been left for you on the console.',
  study: 'Books, a desk by the windows, and a lit cabinet on the north wall.',
  garage: 'The big room. A car up on the lift, benches along the glass, a training corner and somewhere to sit.',
  dining: 'Kitchen and dining. Something is on the stove.',
  vault: 'A bank vault with PROJECTS over the door. It has to be unlocked first.',
  lounge: 'Where the day ends: the fire, the sofa, a few photographs.',
}

// Everything kept in the Study's display cabinet, in compartment order.
export const cabinetItems = [
  { id: 'ideal', kind: 'award', ref: 'ideal' },
  { id: 'robotics-excellence', kind: 'award', ref: 'robotics-excellence' },
  { id: 'physics', kind: 'award', ref: 'physics' },
  { id: 'robotics-second', kind: 'award', ref: 'robotics-second' },
  { id: 'presidential', kind: 'honour', ref: 'presidential' },
  { id: 'distinction', kind: 'honour', ref: 'distinction' },
]
