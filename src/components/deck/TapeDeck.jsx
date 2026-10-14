import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion as Motion, useReducedMotion } from 'framer-motion'
import { FastForward, Pause, Play, Rewind } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router'
import { profile } from '../../data/profile'
import { useEscape } from '../../hooks/useEscape'
import { useLockBodyScroll } from '../../hooks/useLockBodyScroll'
import { isFirstRender } from '../../utils/appState'
import { EASE_OUT, REDUCED_DURATION, SHARED_DURATION, sharedLayoutTransition } from '../../utils/motion'
import { getAdjacentProject, getProject, tapeLayoutId, tapePosition, tapes } from '../../utils/projects'
import { HOME_LOCATION, projectPath } from '../../utils/routes'
import { Cassette } from '../tape/Cassette'
import { Monogram } from '../ui/Monogram'
import { LinerNotes } from './LinerNotes'

function EjectIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" {...props}>
      <path d="M12 5 5 13h14z" />
      <path d="M5 18h14" strokeLinecap="round" />
    </svg>
  )
}

function DeckKey({ label, ariaLabel, onClick, icon: Icon, accent = false, pressed }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      aria-pressed={pressed}
      title={ariaLabel}
      className={`deck-key flex h-14 flex-col items-center justify-center gap-1 rounded-[10px] text-small font-semibold ${
        accent ? 'bg-accent text-accent-ink hover:bg-accent-hover' : 'bg-raised text-ink hover:bg-[#26262a]'
      }`}
    >
      <Icon size={18} aria-hidden="true" />
      <span aria-hidden="true">{label}</span>
    </button>
  )
}

// The deck's little display. The counter runs while the reels turn, like a real tape counter.
function DeckDisplay({ title, playing, winding }) {
  const [ticks, setTicks] = useState(0)

  useEffect(() => {
    if (!playing && !winding) return undefined
    const id = setInterval(() => setTicks((value) => value + 1), winding ? 90 : 1000)
    return () => clearInterval(id)
  }, [playing, winding])

  const status = winding ? 'Winding' : playing ? 'Playing' : 'Paused'

  return (
    <div
      aria-hidden="true"
      className="flex items-center justify-between gap-4 rounded-[14px] bg-[#12160f] px-4 py-3 md:flex-col md:items-stretch md:justify-between md:p-5"
      style={{ color: '#f5b84a' }}
    >
      <div className="min-w-0">
        <p className="text-small font-semibold">
          {winding ? '⏩' : playing ? '▶' : '⏸'} {status}
        </p>
        <p className="mt-1 truncate font-marker text-lead leading-tight text-[#ffd28c] md:mt-3 md:line-clamp-2 md:whitespace-normal">
          {title ?? 'No tape'}
        </p>
      </div>
      <div className="flex shrink-0 items-end justify-between gap-3">
        <span className="hidden text-small opacity-70 md:inline">Counter</span>
        <span className="tabular text-head leading-none font-bold">{String(ticks % 1000).padStart(3, '0')}</span>
      </div>
    </div>
  )
}

// The project view. It is a modal dialog over the homepage, which stays mounted and inert
// underneath. The overlay itself scrolls, so the tape can fly in from anywhere on screen.
export function TapeDeck({ slug, onClose }) {
  const location = useLocation()
  const navigate = useNavigate()
  const reduceMotion = useReducedMotion()
  const panelRef = useRef(null)
  const scrollerRef = useRef(null)
  const windTimer = useRef(0)
  const pressStartedOnBackdrop = useRef(false)
  const [playing, setPlaying] = useState(true)
  const [winding, setWinding] = useState(false)

  // The flight from the shelf only happens for the tape that opened the deck, and not on a
  // direct visit (there is no tape on screen to fly from) or under reduced motion.
  const [directVisit] = useState(isFirstRender)
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
    if (scrollerRef.current) scrollerRef.current.scrollTop = 0
  }, [slug])

  useEffect(() => {
    document.title = project ? `${project.title} | ${profile.name}` : `Tape not found | ${profile.name}`
  }, [project])

  useEffect(() => () => clearTimeout(windTimer.current), [])

  // Rewind and fast-forward: load the neighbouring tape. Each step is a history entry, so Back
  // walks the tapes and Eject returns to the homepage in one move.
  const wind = useCallback(
    (step) => {
      const target = getAdjacentProject(slug, step)
      if (!target) return
      setWinding(true)
      clearTimeout(windTimer.current)
      windTimer.current = setTimeout(() => setWinding(false), 650)
      const current = location.state ?? {}
      navigate(projectPath(target.slug), {
        state: {
          backgroundLocation: current.backgroundLocation ?? HOME_LOCATION,
          layoutPrefix: null,
          depth: (current.depth ?? 0) + 1,
          fromHome: Boolean(current.fromHome),
        },
      })
    },
    [slug, location.state, navigate],
  )

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.altKey || event.metaKey || event.ctrlKey) return
      if (event.key === 'ArrowRight') wind(1)
      if (event.key === 'ArrowLeft') wind(-1)
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [wind])

  const spin = reduceMotion ? 'off' : winding ? 'fast' : playing ? 'slow' : 'off'
  const fade = reduceMotion ? REDUCED_DURATION : 0.3

  return (
    <>
      <Motion.div
        aria-hidden="true"
        className="fixed inset-0 z-50 bg-black/70 backdrop-blur-[3px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { duration: fade, ease: 'easeOut' } }}
        exit={{ opacity: 0, transition: { duration: reduceMotion ? REDUCED_DURATION : 0.24, ease: 'easeOut' } }}
      />

      {/* Not marked layoutScroll: Framer would treat this fixed scroller as its own scroll root and
          measure the tape in viewport space while the shelf tape is in page space. Page scroll is
          locked while the deck is open, so both ends of the flight share one coordinate space. */}
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
          className="relative mx-auto flex min-h-svh w-full max-w-[960px] flex-col outline-none md:min-h-[calc(100svh-2rem)]"
          initial={shared ? false : { opacity: 0, transform: reduceMotion ? 'translateY(0px)' : 'translateY(24px)' }}
          animate={{
            opacity: 1,
            transform: 'translateY(0px)',
            transition: { duration: reduceMotion ? REDUCED_DURATION : SHARED_DURATION, ease: EASE_OUT },
          }}
          exit={{ opacity: 0, transition: { duration: reduceMotion ? REDUCED_DURATION : 0.2, ease: 'easeOut' } }}
        >
          {/* The deck body fades in on its own, so the tape flying into place stays fully opaque. */}
          <Motion.div
            aria-hidden="true"
            className="absolute inset-0 bg-[#161618] shadow-[0_-24px_80px_-24px_rgba(0,0,0,0.85)] md:rounded-t-panel"
            initial={shared ? { opacity: 0 } : false}
            animate={{ opacity: 1, transition: { duration: 0.32, ease: 'easeOut' } }}
          />

          <div className="relative flex flex-1 flex-col">
            <section aria-label="Tape deck" className="px-3 pt-4 md:px-8 md:pt-7">
              <div className="flex items-center justify-between gap-4 px-1">
                <div className="flex items-center gap-3">
                  <Monogram className="h-7" />
                  <span className="text-small font-semibold text-ink-2">Tape deck</span>
                </div>
                <span className="tabular text-small text-ink-3">
                  {project ? `Tape ${tapePosition(slug)} of ${tapes.length}` : 'No tape loaded'}
                </span>
              </div>

              <div className="mt-4 grid gap-3 md:mt-5 md:grid-cols-[minmax(0,1fr)_15rem] md:gap-5">
                <div className="relative rounded-[18px] bg-[#0b0b0c] p-[6%] shadow-[inset_0_2px_16px_rgba(0,0,0,0.9)] md:p-[5%]">
                  {project ? (
                    <AnimatePresence mode="popLayout" initial={false} propagate>
                      <Motion.div
                        key={slug}
                        layoutId={tapeLayoutId(layoutPrefix, slug)}
                        layoutCrossfade={false}
                        initial={layoutPrefix || reduceMotion ? false : { opacity: 0, transform: 'translateY(18%)' }}
                        animate={{ opacity: 1, transform: 'translateY(0%)' }}
                        exit={{ opacity: 0, transition: { duration: 0.2 } }}
                        transition={{ ...sharedLayoutTransition, default: { duration: 0.45, ease: EASE_OUT } }}
                      >
                        <Cassette
                          title={project.title}
                          subtitle={project.tags.slice(0, 3).join(' · ')}
                          colors={project.tape}
                          spin={spin}
                        />
                      </Motion.div>
                    </AnimatePresence>
                  ) : (
                    <div className="grid aspect-[400/254] place-items-center rounded-[12px] text-small text-ink-3">Empty</div>
                  )}
                  <span aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-[18px] ring-1 ring-white/[0.06] ring-inset" />
                </div>
                <DeckDisplay key={slug} title={project?.title} playing={playing} winding={winding} />
              </div>
            </section>

            <AnimatePresence mode="wait" propagate>
              <LinerNotes key={slug} project={project} slug={slug} />
            </AnimatePresence>

            <div aria-hidden="true" className="h-6 shrink-0" />

            {/* Transport keys stay pinned to the bottom of the screen while the notes scroll. */}
            <div className="sticky bottom-0 z-20 mt-auto bg-[#141416] shadow-[0_-14px_32px_-14px_rgba(0,0,0,0.9)]">
              <div role="group" aria-label="Tape controls" className="mx-auto grid max-w-[30rem] grid-cols-4 gap-2 p-3 md:gap-3">
                <DeckKey label="Prev" ariaLabel="Previous tape" onClick={() => wind(-1)} icon={Rewind} />
                <DeckKey
                  label={playing ? 'Pause' : 'Play'}
                  ariaLabel="Play"
                  pressed={playing}
                  onClick={() => setPlaying((value) => !value)}
                  icon={playing ? Pause : Play}
                  accent
                />
                <DeckKey label="Next" ariaLabel="Next tape" onClick={() => wind(1)} icon={FastForward} />
                <DeckKey label="Eject" ariaLabel="Eject tape and close" onClick={onClose} icon={EjectIcon} />
              </div>
            </div>
          </div>
        </Motion.div>
      </Motion.div>
    </>
  )
}
