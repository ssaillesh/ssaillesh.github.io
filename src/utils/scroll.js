export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

// Scrolls to a homepage section and moves focus to its heading, so keyboard and
// screen-reader users land where sighted users do.
export function scrollToSection(id) {
  const section = document.getElementById(id)
  if (!section) return
  section.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' })
  const heading = section.querySelector('h2') ?? section
  if (!heading.hasAttribute('tabindex')) heading.setAttribute('tabindex', '-1')
  heading.focus({ preventScroll: true })
}

const preloaded = new Set()

// Warms the cache for the detail-view image before the panel opens.
export function preloadImage(src) {
  if (!src || preloaded.has(src)) return
  preloaded.add(src)
  const image = new Image()
  image.decoding = 'async'
  image.src = src
}
