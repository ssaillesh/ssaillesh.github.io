import { useEffect, useRef } from 'react'
import { motion as Motion, useReducedMotion } from 'framer-motion'
import { navigation } from '../../data/profile'
import { EASE_OUT } from '../../utils/motion'
import { SocialLinks } from '../ui/SocialLinks'

// A sheet that drops from under the header. The page behind is inert while it is open
// (see HomeLayout), so Tab stays within the header and the sheet.
export function MobileNavigation({ id, activeSection, onNavigate, onClose }) {
  const reduceMotion = useReducedMotion()
  const firstLinkRef = useRef(null)

  useEffect(() => {
    firstLinkRef.current?.focus({ preventScroll: true })
  }, [])

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose()
    }
    const desktop = window.matchMedia('(min-width: 768px)')
    const onResize = () => desktop.matches && onClose()
    document.addEventListener('keydown', onKeyDown)
    desktop.addEventListener('change', onResize)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      desktop.removeEventListener('change', onResize)
    }
  }, [onClose])

  const sheetMotion = {
    initial: { opacity: 0, transform: reduceMotion ? 'translateY(0px)' : 'translateY(-8px)' },
    animate: { opacity: 1, transform: 'translateY(0px)', transition: { duration: 0.22, ease: EASE_OUT } },
    exit: { opacity: 0, transform: reduceMotion ? 'translateY(0px)' : 'translateY(-6px)', transition: { duration: 0.15, ease: EASE_OUT } },
  }

  return (
    <>
      <Motion.div
        aria-hidden="true"
        onClick={onClose}
        className="fixed inset-x-0 top-[var(--header-height)] bottom-0 z-30 bg-black/60 md:hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { duration: 0.2 } }}
        exit={{ opacity: 0, transition: { duration: 0.15 } }}
      />
      <Motion.nav
        id={id}
        aria-label="Primary"
        className="absolute inset-x-0 top-full z-40 origin-top bg-surface px-[var(--edge)] pt-2 pb-6 shadow-[0_24px_48px_-24px_rgba(0,0,0,0.8)] md:hidden"
        {...sheetMotion}
      >
        <ul role="list">
          {navigation.map((item, index) => (
            <li key={item.id}>
              <a
                ref={index === 0 ? firstLinkRef : undefined}
                href={`#${item.id}`}
                onClick={(event) => onNavigate(event, item.id)}
                aria-current={activeSection === item.id ? 'location' : undefined}
                className={`flex h-14 items-center text-head font-semibold ${
                  activeSection === item.id ? 'text-accent' : 'text-ink'
                }`}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
        <SocialLinks className="mt-4 -ml-3" />
      </Motion.nav>
    </>
  )
}
