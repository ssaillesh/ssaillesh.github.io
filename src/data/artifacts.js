// Every object in the residence that stands for something about Saillesh.
// A room's panel lists only `object` and `where` (what is there); the details
// appear once the visitor picks the object up. `kind` tells the panel which
// detail view to show; `ref` points at the record it is about.

export const artifacts = [
  // 01 Foyer
  { id: 'intro', room: 'foyer', object: 'A brass nameplate', where: 'By the entrance', kind: 'intro' },
  { id: 'resume', room: 'foyer', object: 'A leather folio', where: 'On the console', kind: 'resume' },
  { id: 'active', room: 'foyer', object: 'Running shoes', where: 'By the door', kind: 'interest', ref: 'active' },

  // 02 Study
  { id: 'degree', room: 'study', object: 'A framed certificate', where: 'North wall', kind: 'degree' },
  { id: 'presidential', room: 'study', object: 'A steel-framed letter', where: 'North wall', kind: 'honour', ref: 'presidential' },
  { id: 'ideal', room: 'study', object: 'A cobalt medal', where: 'Achievement shelf', kind: 'award', ref: 'ideal' },
  { id: 'robotics-second', room: 'study', object: 'A silver medal and a small robot', where: 'Achievement shelf', kind: 'award', ref: 'robotics-second' },
  { id: 'robotics-excellence', room: 'study', object: 'A gold trophy', where: 'Achievement shelf', kind: 'award', ref: 'robotics-excellence' },
  { id: 'physics', room: 'study', object: 'A crystal block', where: 'On the desk', kind: 'award', ref: 'physics' },
  { id: 'distinction', room: 'study', object: 'A bound book', where: 'On the desk', kind: 'honour', ref: 'distinction' },
  { id: 'coursework', room: 'study', object: 'Five well-used textbooks', where: 'Bookshelf', kind: 'coursework' },
  { id: 'specialization', room: 'study', object: 'A microscope', where: 'Side table, reading corner', kind: 'specialization' },

  // 03 Workshop
  { id: 'symcor', room: 'workshop', object: 'A laptop and a security key', where: 'Platform console', kind: 'experience', ref: 'symcor' },
  { id: 'omniabio', room: 'workshop', object: 'A rack of sample vials', where: 'Lab bench', kind: 'experience', ref: 'omniabio' },
  { id: 'pepsico-ops', room: 'workshop', object: 'A bag of chips', where: 'On the conveyor', kind: 'experience', ref: 'pepsico-ops' },
  { id: 'pepsico-data', room: 'workshop', object: 'A monitor full of SQL', where: 'Analyst desk', kind: 'experience', ref: 'pepsico-data' },
  { id: 'uwaft', room: 'workshop', object: 'A lidar sensor', where: 'Simulation bay', kind: 'experience', ref: 'uwaft' },
  { id: 'toolkit', room: 'workshop', object: 'A tool chest', where: 'Under the north window', kind: 'toolkit' },

  // 05 Lounge
  { id: 'cars', room: 'lounge', object: 'A scale model car', where: 'Coffee table', kind: 'interest', ref: 'cars' },
  { id: 'gym', room: 'lounge', object: 'A dumbbell rack', where: 'By the windows', kind: 'interest', ref: 'gym' },
  { id: 'cooking', room: 'lounge', object: 'A cast-iron pan', where: 'Kitchen island', kind: 'interest', ref: 'cooking' },
  { id: 'biking', room: 'lounge', object: 'A bicycle', where: 'By the east window', kind: 'interest', ref: 'biking' },
  { id: 'exploring', room: 'lounge', object: 'Two photographs', where: 'Credenza', kind: 'interest', ref: 'exploring' },
  { id: 'contact', room: 'lounge', object: 'A rotary phone', where: 'Side table by the sofa', kind: 'contact' },
]

export const artifactById = Object.fromEntries(artifacts.map((a) => [a.id, a]))
export const artifactsIn = (room) => artifacts.filter((a) => a.room === room)

// One-line room descriptions for the panel: atmosphere, not answers.
export const roomIntro = {
  foyer: 'The way in. A few things left by the door.',
  study: 'Books, a desk by the windows, and things kept on the walls and shelves.',
  workshop: 'Five workstations and a tool chest. Each bench has something left on it.',
  vault: 'A bank vault, door open. Three deposit boxes inside.',
  lounge: 'Where the day ends. Look around.',
}
