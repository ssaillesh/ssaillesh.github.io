import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion as Motion, useReducedMotion } from 'framer-motion'
import { X } from 'lucide-react'
import { useLocation } from 'react-router'
import { profile } from '../../data/profile'
import { useEscape } from '../../hooks/useEscape'
import { useLockBodyScroll } from '../../hooks/useLockBodyScroll'
import { useMediaQuery } from '../../hooks/useMediaQuery'
import { isFirstRender } from '../../utils/appState'
import { EASE_OUT, REDUCED_DURATION, SHARED_DURATION } from '../../utils/motion'
import { getProject } from '../../utils/projects'
import { ProjectDetails } from './ProjectDetails'

// The project panel. It is a modal dialog over the homepage, which stays mounted (and inert)
// underneath. The overlay itself is the scroll container, so the shared image can fly in from
// anywhere on screen without being clipped by the panel.
export function ProjectOverlay({ slug, onClose }) {
  const location = useLocation()
  const reduceMotion = useReducedMotion()
  const wide = useMediaQuery('(min-width: 768px)')
  const scrollerRef = useRef(null)
  const panelRef = useRef(null)
  const pressStartedOnBackdrop = useRef(false)

  // A panel present on the very first render is a direct visit or refresh: there is no card on
  // screen to fly from, so it uses the plain entrance.
  const [directVisit] = useState(isFirstRender)
  // Once "Next project" has swapped the content, the matching cards are hidden behind the panel,
  // so later swaps (and the close) crossfade instead of flying.
  const [openedSlug] = useState(slug)
  const [swapped, setSwapped] = useState(false)
  if (!swapped && slug !== openedSlug) setSwapped(true)
  const layoutPrefix = reduceMotion || directVisit || swapped ? null : (location.state?.layoutPrefix ?? null)
  const shared = Boolean(layoutPrefix)
  const project = getProject(slug)

  useLockBodyScroll(true)
  useEscape(onClose)

  useEffect(() => {
    panelRef.current?.focus({ preventScroll: true })
  }, [slug])

  useEffect(() => {
    document.title = project ? `${project.title} | ${profile.name}` : `Project not found | ${profile.name}`
  }, [project])

  const fade = reduceMotion ? REDUCED_DURATION : 0.3

  return (
    <>
      <Motion.div
        aria-hidden="true"
        className="fixed inset-0 z-50 bg-black/65 backdrop-blur-[3px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { duration: fade, ease: 'easeOut' } }}
        exit={{ opacity: 0, transition: { duration: reduceMotion ? REDUCED_DURATION : 0.24, ease: 'easeOut' } }}
      />

      {/* Not marked layoutScroll: Framer would treat this fixed scroller as a separate scroll root
          and measure the hero in viewport space while the card is in page space. Page scroll is
          locked while the panel is open, so both ends of the flight share one coordinate space. */}
      <Motion.div
        ref={scrollerRef}
        className="fixed inset-0 z-50 overflow-y-auto overscroll-contain md:px-6 md:pt-8"
        onPointerDown={(event) => {
          pressStartedOnBackdrop.current = event.target === event.currentTarget
        }}
        onClick={(event) => {
          if (pressStartedOnBackdrop.current && event.target === event.currentTarget) onClose()
        }}
      >
        <Motion.div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="project-title"
          tabIndex={-1}
          className="relative mx-auto min-h-svh w-full max-w-[1000px] outline-none md:min-h-[calc(100svh-2rem)]"
          initial={shared ? false : { opacity: 0, transform: reduceMotion ? 'translateY(0px)' : 'translateY(24px)' }}
          animate={{
            opacity: 1,
            transform: 'translateY(0px)',
            transition: { duration: reduceMotion ? REDUCED_DURATION : SHARED_DURATION, ease: EASE_OUT },
          }}
          exit={{ opacity: 0, transition: { duration: reduceMotion ? REDUCED_DURATION : 0.2, ease: 'easeOut' } }}
        >
          {/* The surface fades in on its own, so the image flying into place stays fully opaque. */}
          <Motion.div
            aria-hidden="true"
            className="absolute inset-0 bg-surface shadow-[0_-24px_80px_-24px_rgba(0,0,0,0.8)] md:rounded-t-panel"
            initial={shared ? { opacity: 0 } : false}
            animate={{ opacity: 1, transition: { duration: 0.32, ease: 'easeOut' } }}
          />

          <div className="sticky top-0 z-20 flex h-0 justify-end">
            <Motion.button
              type="button"
              onClick={onClose}
              aria-label="Close project"
              className="pressable mt-3 mr-3 grid size-11 place-items-center rounded-full bg-black/70 text-ink hover:bg-black/90 md:mt-4 md:mr-4"
              initial={shared ? { opacity: 0 } : false}
              animate={{ opacity: 1, transition: { duration: 0.2, delay: shared ? 0.2 : 0 } }}
            >
              <X size={20} aria-hidden="true" />
            </Motion.button>
          </div>

          {/* propagate: when the whole panel closes, the content learns it is leaving too, which hands the
              shared image back to the card so it flies home (and is shown again). */}
          <AnimatePresence mode="wait" propagate>
            <ProjectDetails
              key={slug}
              project={project}
              slug={slug}
              layoutPrefix={layoutPrefix}
              wide={wide}
              onClose={onClose}
              scrollerRef={scrollerRef}
            />
          </AnimatePresence>
        </Motion.div>
      </Motion.div>
    </>
  )
}
