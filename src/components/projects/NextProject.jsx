import { ArrowRight } from 'lucide-react'
import { Link, useLocation } from 'react-router'
import { asset } from '../../utils/asset'
import { getNextProject } from '../../utils/projects'
import { HOME_LOCATION, projectPath } from '../../utils/routes'

export function NextProject({ slug }) {
  const location = useLocation()
  const next = getNextProject(slug)
  if (!next) return null

  const current = location.state ?? {}
  // Each step deeper adds one history entry, so closing can return to the homepage in one move.
  const state = {
    backgroundLocation: current.backgroundLocation ?? HOME_LOCATION,
    layoutPrefix: null,
    depth: (current.depth ?? 0) + 1,
    fromHome: Boolean(current.fromHome),
  }

  return (
    <section aria-labelledby="next-project-title" className="mt-16 md:mt-20">
      <h2 id="next-project-title" className="text-small font-semibold text-ink-3">
        Next project
      </h2>
      <Link
        to={projectPath(next.slug)}
        state={state}
        className={`pressable group mt-3 grid items-center gap-4 rounded-card bg-raised p-3 transition-colors duration-200 hover:bg-[#232327] sm:gap-6 sm:pr-6 ${
          next.image ? 'sm:grid-cols-[minmax(0,14rem)_minmax(0,1fr)_auto]' : 'p-5 sm:grid-cols-[minmax(0,1fr)_auto] sm:p-6'
        }`}
      >
        {next.image && (
          <img
            src={asset(next.image.small)}
            width={next.image.width}
            height={next.image.height}
            alt=""
            loading="lazy"
            decoding="async"
            className="aspect-video w-full rounded-[8px] object-cover object-top"
          />
        )}
        <span className="block px-1 sm:px-0">
          <span className="block text-lead font-semibold text-ink">{next.title}</span>
          <span className="mt-1 block text-ink-2">{next.pitch}</span>
        </span>
        <ArrowRight
          size={22}
          aria-hidden="true"
          className="hidden text-ink-2 transition-transform duration-200 ease-out group-hover:translate-x-1 group-hover:text-accent sm:block"
        />
      </Link>
    </section>
  )
}
