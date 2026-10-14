import { navigation, profile } from '../../data/profile'
import { useScrolled } from '../../hooks/useScrolled'
import { asset } from '../../utils/asset'
import { prefersReducedMotion, scrollToSection } from '../../utils/scroll'
import { ButtonLink } from '../ui/Button'
import { Monogram } from '../ui/Monogram'

// Logo, three links, one action. On phones the links drop away (the page is three short
// sections and the footer repeats them), leaving the logo and the résumé.
export function Header({ activeSection }) {
  const scrolled = useScrolled()

  const goToSection = (event, id) => {
    event.preventDefault()
    scrollToSection(id)
  }

  const goToTop = (event) => {
    event.preventDefault()
    window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? 'auto' : 'smooth' })
  }

  return (
    <header
      className={`sticky top-0 z-40 h-[var(--header-height)] transition-[background-color] duration-200 ease-out ${
        scrolled ? 'bg-surface' : 'bg-background'
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

        <div className="flex items-center gap-2">
          <nav aria-label="Primary" className="hidden md:block">
            <ul className="mr-3 flex items-center gap-1" role="list">
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
          <ButtonLink href={asset(profile.resume)} size="sm">
            Resume
          </ButtonLink>
        </div>
      </div>
    </header>
  )
}
