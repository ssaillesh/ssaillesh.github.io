// Close-up copy, derived from the artifacts list. Models live in
// src/scene/inspect/models.jsx and are registered in registry.js.
import { artifacts } from './artifacts.js'
import { awards } from './awards.js'
import { education } from './education.js'
import { experience } from './experience.js'
import { interests } from './lounge.js'
import { roomById } from './rooms.js'
import { projects } from './projects.js'

export const INSPECTABLE = Object.fromEntries(artifacts.map((a) => [a.id, `${roomById[a.room].name} · ${a.where}`]))

export function inspectLabel(id) {
  const a = artifacts.find((x) => x.id === id)
  if (!a) return id
  switch (a.kind) {
    case 'intro':
      return 'Saillesh.'
    case 'resume':
      return 'Résumé'
    case 'degree':
      return education.degree
    case 'specialization':
      return education.focusArea
    case 'coursework':
      return 'Technical coursework'
    case 'toolkit':
      return 'The toolkit'
    case 'contact':
      return 'Get in touch'
    case 'honour':
      return education.honours.find((h) => h.id === a.ref)?.name || id
    case 'award':
      return awards.find((x) => x.id === a.ref)?.name || id
    case 'experience': {
      const x = experience.find((e) => e.id === a.ref)
      return x ? `${x.company} · ${x.title}` : id
    }
    case 'interest':
      return interests.find((i) => i.id === a.ref)?.name || id
    case 'project':
      return projects.find((p) => p.id === a.ref)?.name || id
    default:
      return id
  }
}
