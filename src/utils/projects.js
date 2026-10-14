import { projects } from '../data/projects'

export const getProject = (slug) => projects.find((project) => project.slug === slug) ?? null

export const featuredProject = projects.find((project) => project.featured && project.image) ?? null

// One collection of every project that has a real screenshot. It renders only with at least two.
const withImages = projects.filter((project) => project.image)
export const projectRow = withImages.length >= 2 ? { id: 'all', title: 'All projects', projects: withImages } : null

// Projects without a screenshot are listed in text rather than as placeholder cards.
export const textOnlyProjects = projects.filter((project) => !project.image)

export function getNextProject(slug) {
  if (projects.length < 2) return null
  const index = projects.findIndex((project) => project.slug === slug)
  if (index === -1) return projects[0]
  return projects[(index + 1) % projects.length]
}

export const sharedIds = (prefix, slug) =>
  prefix ? { image: `${prefix}-${slug}-image`, title: `${prefix}-${slug}-title` } : { image: undefined, title: undefined }
