import { useEffect, useRef } from 'react'
import { AnimatePresence } from 'framer-motion'
import { navigation, profile } from '../../data/profile'
import { useScrolled } from '../../hooks/useScrolled'
import { asset } from '../../utils/asset'
import { prefersReducedMotion, scrollToSection } from '../../utils/scroll'
import { ButtonLink } from '../ui/Button'
import { Monogram } from '../ui/Monogram'
import { MobileNavigation } from './MobileNavigation'

export function Header({ activeSection, menuOpen, onMenuToggle, onMenuClose }) {
  const scrolled = useScrolled()
  const toggleRef = useRef(null)
  const wasOpen = useRef(menuOpen)

  // When the sheet closes with focus inside it (Escape, backdrop), focus returns to the Menu button.
  useEffect(() => {
    const active = document.activeElement
    const focusWasInSheet = !active || active === document.body || active.closest('#mobile-navigation')
    if (wasOpen.current && !menuOpen && focusWasInSheet) toggleRef.current?.focus({ preventScroll: true })
    wasOpen.current = menuOpen
  }, [menuOpen])

  const goToSection = (event, id) => {
    event.preventDefault()
    onMenuClose()
    // Wait a frame so the page is no longer inert and the section heading can take focus.
    requestAnimationFrame(() => scrollToSection(id))
  }

  const goToTop = (event) => {
    event.preventDefault()
    onMenuClose()
    window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? 'auto' : 'smooth' })
  }

  const solid = scrolled || menuOpen

  return (
    <header
      className={`sticky top-0 z-40 h-[var(--header-height)] transition-[background-color] duration-200 ease-out ${
        solid ? 'bg-surface' : 'bg-background'
      }`}
    >
      <a
        href="#main"
        onClick={(event) => {
          event.preventDefault()
          document.getElementById('main')?.focus()
        }}
        className="absolute top-2 left-2 z-50 -translate-y-20 rounded-full bg-accent px-4 py-2 text-small font-semibold text-accent-ink focus:translate-y-0"
      >
        Skip to content
      </a>

      <div className="page-width flex h-full items-center justify-between gap-6">
        <a
          href="#/"
          onClick={goToTop}
          aria-label={`${profile.name}, back to top`}
          className="pressable -ml-2 flex h-11 items-center rounded-full px-2"
        >
          <Monogram />
        </a>

        <nav aria-label="Primary" className="hidden md:block">
          <ul className="flex items-center gap-1" role="list">
            {navigation.map((item) => {
              const current = activeSection === item.id
              return (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    onClick={(event) => goToSection(event, item.id)}
                    aria-current={current ? 'location' : undefined}
                    className={`relative flex h-10 items-center rounded-full px-4 text-small font-medium transition-colors duration-200 ${
                      current ? 'text-accent' : 'text-ink-2 hover:text-ink'
                    }`}
                  >
                    {item.label}
                    <span
                      aria-hidden="true"
                      className={`absolute inset-x-4 bottom-1 h-0.5 rounded-full bg-accent transition-opacity duration-200 ${
                        current ? 'opacity-100' : 'opacity-0'
                      }`}
                    />
                  </a>
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <ButtonLink href={asset(profile.resume)} size="sm">
            Resume
          </ButtonLink>
          <button
            ref={toggleRef}
            type="button"
            onClick={onMenuToggle}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            className="pressable flex h-10 items-center rounded-full bg-raised px-4 text-small font-semibold text-ink md:hidden"
          >
            {menuOpen ? 'Close' : 'Menu'}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <MobileNavigation
            key="mobile-navigation"
            id="mobile-navigation"
            activeSection={activeSection}
            onNavigate={goToSection}
            onClose={onMenuClose}
          />
        )}
      </AnimatePresence>
    </header>
  )
}
