// Which selectable items have a close-up model, the line shown above it, and
// the title used in the close-up. Models live in src/scene/inspect/models.jsx.
import { awards } from './awards.js'
import { education } from './education.js'
import { experience } from './experience.js'
import { interests } from './lounge.js'

export const INSPECTABLE = {
  degree: 'Taken down from the Study wall',
  presidential: 'Taken down from the Study wall',
  distinction: 'Picked up from the Study desk',
  ideal: 'From the Study display table',
  cobalt: 'From the Study display table',
  physics: 'From the Study display table',
  'robotics-excellence': 'From the Study display table',
  'robotics-second': 'From the Study display table',
  symcor: 'Pulled from the Workshop rack',
  omniabio: 'From the Workshop lab bench',
  'pepsico-ops': 'Off the Workshop conveyor',
  'pepsico-data': 'From the Workshop analyst desk',
  uwaft: 'From the Workshop simulation bay',
  intro: 'From the Foyer',
  resume: 'From the Foyer console',
  cars: 'From the Lounge coffee table',
  gym: 'From the Lounge rack',
  cooking: 'From the Lounge kitchen',
  biking: 'From the Lounge window',
  exploring: 'From the Lounge credenza',
}

export function inspectLabel(id) {
  if (id === 'degree') return `${education.degree}`
  if (id === 'intro') return 'Saillesh.'
  if (id === 'resume') return 'Résumé'
  const h = education.honours.find((x) => x.id === id)
  if (h) return h.name
  const a = awards.find((x) => x.id === id)
  if (a) return a.name
  const x = experience.find((e) => e.id === id)
  if (x) return `${x.company} · ${x.title}`
  const i = interests.find((e) => e.id === id)
  if (i) return i.name
  return id
}
