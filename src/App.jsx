import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { AnimatePresence, MotionConfig, motion as Motion, useReducedMotion } from 'framer-motion'
import { HashRouter, Route, Routes, matchPath, useLocation, useNavigate } from 'react-router'
import { TapeDeck } from './components/deck/TapeDeck'
import { ContactSection } from './components/home/ContactSection'
import { ExperienceSection } from './components/home/ExperienceSection'
import { Intro } from './components/home/Intro'
import { TapeShelf } from './components/home/TapeShelf'
import { Header } from './components/layout/Header'
import { NotFound } from './components/layout/NotFound'
import { navigation, profile } from './data/profile'
import { useActiveSection } from './hooks/useActiveSection'
import { markFirstRenderDone } from './utils/appState'
import { restoreFocus } from './utils/focusReturn'
import { EASE_OUT, SHARED_DURATION } from './utils/motion'
import { HOME_LOCATION, SECTION_IDS } from './utils/routes'
import { scrollToSection } from './utils/scroll'

const NAV_IDS = navigation.map((item) => item.id)

// Where the middle of the viewport sits within the page, as a 0-1 fraction. The page scales
// back around this point, so it recedes in place rather than towards the top of the document.
const viewportCentre = () => {
  const height = document.documentElement.scrollHeight || 1
  return Math.min(1, Math.max(0, (window.scrollY + window.innerHeight / 2) / height))
}

function HomeLayout({ overlayOpen }) {
  const reduceMotion = useReducedMotion()
  const activeSection = useActiveSection(NAV_IDS)
  // A direct visit to a project starts at the top of the page, so the page recedes towards the top.
  const [origin, setOrigin] = useState(overlayOpen ? 0 : 0.5)
  const [wasOpen, setWasOpen] = useState(overlayOpen)

  if (overlayOpen !== wasOpen) {
    setWasOpen(overlayOpen)
    if (overlayOpen) setOrigin(viewportCentre())
  }

  useEffect(() => {
    if (!overlayOpen) document.title = `${profile.name} | Software Engineer`
  }, [overlayOpen])

  return (
    <Motion.div
      className="min-h-svh"
      inert={overlayOpen}
      style={{ originX: 0.5, originY: origin }}
      animate={{ scale: overlayOpen && !reduceMotion ? 0.96 : 1 }}
      transition={{ duration: SHARED_DURATION, ease: EASE_OUT }}
    >
      <Header activeSection={activeSection} />
      <main id="main" tabIndex={-1} className="outline-none">
        <Intro />
        <TapeShelf />
        <ExperienceSection />
      </main>
      <ContactSection />
    </Motion.div>
  )
}

function AppShell() {
  const location = useLocation()
  const navigate = useNavigate()
  const projectMatch = matchPath('/project/:slug', location.pathname)
  const sectionMatch = matchPath('/:section', location.pathname)
  const sectionLink = sectionMatch && SECTION_IDS.includes(sectionMatch.params.section) ? sectionMatch.params.section : null
  const overlayOpen = Boolean(projectMatch)

  // Background-location pattern. While a project is open, the routes below render the location
  // the visitor came from, so the homepage stays mounted (scroll position and all) behind the
  // panel. A direct visit carries no such state and falls back to the homepage, so a shared link
  // opens the same way.
  const backgroundLocation = location.state?.backgroundLocation ?? (overlayOpen || sectionLink ? HOME_LOCATION : location)

  useEffect(() => {
    markFirstRenderDone()
  }, [])

  // Hash links such as /#work (a header link opened in a new tab) land on their section.
  useEffect(() => {
    if (!sectionLink) return
    navigate('/', { replace: true })
    requestAnimationFrame(() => scrollToSection(sectionLink))
  }, [sectionLink, navigate])

  const closeProject = useCallback(() => {
    const state = location.state
    if (state?.fromHome && state.depth > 0) navigate(-state.depth)
    else navigate('/', { replace: true })
  }, [location.state, navigate])

  // Return focus to the tape that opened the deck once the homepage is interactive again.
  const wasOpen = useRef(overlayOpen)
  useEffect(() => {
    if (wasOpen.current && !overlayOpen) requestAnimationFrame(restoreFocus)
    wasOpen.current = overlayOpen
  }, [overlayOpen])

  // Tapes on the shelf hold still from the moment the deck opens until it has fully closed (see index.css).
  useLayoutEffect(() => {
    if (overlayOpen) document.documentElement.dataset.overlay = ''
  }, [overlayOpen])

  const clearOverlayFlag = useCallback(() => {
    delete document.documentElement.dataset.overlay
  }, [])

  return (
    <>
      <Routes location={backgroundLocation}>
        <Route path="/" element={<HomeLayout overlayOpen={overlayOpen} />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <AnimatePresence onExitComplete={clearOverlayFlag}>
        {projectMatch && <TapeDeck key="tape-deck" slug={projectMatch.params.slug} onClose={closeProject} />}
      </AnimatePresence>
    </>
  )
}

export default function App() {
  return (
    <HashRouter>
      <MotionConfig reducedMotion="user">
        <AppShell />
      </MotionConfig>
    </HashRouter>
  )
}
