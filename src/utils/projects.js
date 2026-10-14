import { projects, tapeOrder } from '../data/projects'

export const getProject = (slug) => projects.find((project) => project.slug === slug) ?? null

// Every project, in shelf order. Tapes are drawn, so a project without a screenshot still gets one.
export const tapes = tapeOrder.map(getProject).filter(Boolean)

// The tape before or after this one, wrapping around the shelf (rewind and fast-forward).
export function getAdjacentProject(slug, step) {
  if (tapes.length < 2) return null
  const index = tapes.findIndex((project) => project.slug === slug)
  if (index === -1) return tapes[0]
  return tapes[(index + step + tapes.length) % tapes.length]
}

export const tapePosition = (slug) => tapes.findIndex((project) => project.slug === slug) + 1

export const tapeLayoutId = (prefix, slug) => (prefix ? `${prefix}-${slug}` : undefined)
