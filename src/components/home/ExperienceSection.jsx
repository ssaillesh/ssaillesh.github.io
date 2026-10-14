import { useId, useState } from 'react'
import { AnimatePresence, motion as Motion, useReducedMotion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { experience } from '../../data/experience'
import { asset } from '../../utils/asset'
import { EASE_OUT } from '../../utils/motion'
import { Reveal } from '../ui/Reveal'
import { RichText } from '../ui/RichText'
import { SectionHeading } from '../ui/SectionHeading'
import { TagList } from '../ui/TagList'

function LogoTile({ logo, className = '' }) {
  return (
    <div
      className={`grid size-12 shrink-0 place-items-center overflow-hidden rounded-[10px] p-1.5 md:size-16 md:p-2 ${className}`}
      style={{ backgroundColor: logo.background }}
    >
      {/* The company name sits beside the tile, so the logo itself is decorative. */}
      <img
        src={asset(logo.src)}
        width={logo.width}
        height={logo.height}
        alt=""
        loading="lazy"
        decoding="async"
        className="max-h-full max-w-full object-contain"
      />
    </div>
  )
}

function Role({ role }) {
  const [open, setOpen] = useState(false)
  const reduceMotion = useReducedMotion()
  const panelId = useId()

  return (
    <Reveal
      as="li"
      className="grid grid-cols-[48px_minmax(0,1fr)] gap-x-4 md:grid-cols-[9.5rem_64px_minmax(0,1fr)] md:gap-x-8"
    >
      <p className="tabular hidden pt-1 text-small text-ink-3 md:block">{role.dates}</p>
      <LogoTile logo={role.logo} />
      <div>
        <h3 className="text-lead font-semibold text-ink">{role.title}</h3>
        <p className="mt-0.5 text-ink-2">
          <a
            href={role.companyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="underline decoration-transparent underline-offset-4 transition-colors hover:text-ink hover:decoration-current"
          >
            {role.company}
          </a>
          <span aria-hidden="true"> · </span>
          {role.location}
        </p>
        <p className="tabular mt-0.5 text-small text-ink-3 md:hidden">{role.dates}</p>
        <p className="mt-3 max-w-[68ch] text-ink">{role.summary}</p>

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-controls={panelId}
          className="pressable -ml-3 mt-2 inline-flex h-10 items-center gap-1.5 rounded-full px-3 text-small font-semibold text-accent hover:bg-raised"
        >
          {open ? 'Hide highlights' : 'Show highlights'}
          <ChevronDown
            size={16}
            aria-hidden="true"
            className={`transition-transform duration-200 ease-out ${open ? 'rotate-180' : ''}`}
          />
          <span className="sr-only"> for {role.title} at {role.company}</span>
        </button>

        <AnimatePresence initial={false}>
          {open && (
            <Motion.div
              id={panelId}
              key="highlights"
              initial={{ height: 0, opacity: 0 }}
              animate={{
                height: 'auto',
                opacity: 1,
                transition: { height: { duration: reduceMotion ? 0 : 0.3, ease: EASE_OUT }, opacity: { duration: 0.2, delay: reduceMotion ? 0 : 0.06 } },
              }}
              exit={{
                height: 0,
                opacity: 0,
                transition: { height: { duration: reduceMotion ? 0 : 0.22, ease: EASE_OUT }, opacity: { duration: 0.12 } },
              }}
              className="overflow-hidden"
            >
              <ul className="max-w-[72ch] list-disc space-y-2.5 pt-3 pl-5 text-ink-2 marker:text-ink-3">
                {role.highlights.map((highlight) => (
                  <li key={highlight}>
                    <RichText text={highlight} />
                  </li>
                ))}
              </ul>
              <p className="mt-5 max-w-[72ch] text-small text-ink-3">{role.companyAbout}</p>
              <TagList tags={role.stack} tone="surface" className="mt-4 pb-1" />
            </Motion.div>
          )}
        </AnimatePresence>
      </div>
    </Reveal>
  )
}

export function ExperienceSection() {
  return (
    <section id="experience" aria-labelledby="experience-title" className="section">
      <div className="page-width">
        <Reveal>
          <SectionHeading
            id="experience-title"
            title="Experience"
            description="Five roles across platform engineering, quality automation, computer vision and analytics."
          />
        </Reveal>
        <ol className="mt-10 space-y-10 md:mt-14 md:space-y-12" role="list">
          {experience.map((role) => (
            <Role key={role.id} role={role} />
          ))}
        </ol>
      </div>
    </section>
  )
}
