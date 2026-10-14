import { useRef } from 'react'
import { motion as Motion, useReducedMotion } from 'framer-motion'
import { ArrowUpRight, Github } from 'lucide-react'
import { Link, useLocation } from 'react-router'
import { asset } from '../../utils/asset'
import { rememberFocus } from '../../utils/focusReturn'
import { sharedLayoutTransition } from '../../utils/motion'
import { sharedIds } from '../../utils/projects'
import { projectPath } from '../../utils/routes'
import { preloadImage } from '../../utils/scroll'

const actionClass =
  'pressable grid size-9 place-items-center rounded-full bg-black/70 text-ink hover:bg-ink hover:text-background'

export function ProjectCard({ project }) {
  const reduceMotion = useReducedMotion()
  const location = useLocation()
  const linkRef = useRef(null)
  const ids = sharedIds(reduceMotion ? null : 'project', project.slug)
  const { image } = project

  const warm = () => preloadImage(asset(image.full))

  return (
    <li data-card className="project-card w-[78vw] max-w-[440px] sm:w-[340px] lg:w-[420px] xl:w-[460px]" onPointerEnter={warm} onFocus={warm}>
      <Link
        ref={linkRef}
        to={projectPath(project.slug)}
        state={{ backgroundLocation: location, layoutPrefix: 'project', depth: 1, fromHome: true }}
        onClick={() => rememberFocus(linkRef.current)}
        className="block rounded-card"
      >
        <Motion.div
          layoutId={ids.image}
          transition={sharedLayoutTransition}
          style={{ borderRadius: 12 }}
          className="relative aspect-video overflow-hidden bg-raised"
        >
          <img
            src={asset(image.thumb)}
            srcSet={`${asset(image.small)} 640w, ${asset(image.thumb)} 960w, ${asset(image.full)} 1600w`}
            sizes="(min-width: 1280px) 460px, (min-width: 1024px) 420px, (min-width: 640px) 340px, 78vw"
            width={image.width}
            height={image.height}
            alt={image.alt}
            loading="lazy"
            decoding="async"
            className="size-full object-cover object-top"
          />
        </Motion.div>
        <div className="pt-3 pr-2">
          <Motion.h4
            layoutId={ids.title}
            transition={sharedLayoutTransition}
            className="inline-block text-body font-semibold whitespace-nowrap text-ink"
          >
            {project.title}
          </Motion.h4>
          <p className="mt-0.5 line-clamp-1 text-small text-ink-2">{project.teaser}</p>
        </div>
      </Link>

      {/* Revealed on hover (after a short delay) or keyboard focus. Siblings of the card link, never nested in it. */}
      <div className="card-reveal pointer-events-none absolute inset-x-0 top-0 aspect-video overflow-hidden rounded-card">
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 bg-[linear-gradient(to_top,rgb(0_0_0/0.88),rgb(0_0_0/0.55)_55%,transparent)] px-3 pt-12 pb-3">
          <ul className="flex min-w-0 flex-wrap gap-1.5" role="list" aria-label={`${project.title} technologies`}>
            {project.tags.slice(0, 3).map((tag) => (
              <li key={tag} className="rounded-full bg-black/60 px-2.5 py-0.5 text-small text-ink">
                {tag}
              </li>
            ))}
          </ul>
          <div className="pointer-events-auto flex shrink-0 gap-1.5">
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${project.title} on GitHub`}
                className={actionClass}
              >
                <Github size={16} aria-hidden="true" />
              </a>
            )}
            {project.live && (
              <a
                href={project.live}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${project.title} live demo`}
                className={actionClass}
              >
                <ArrowUpRight size={16} aria-hidden="true" />
              </a>
            )}
          </div>
        </div>
      </div>
    </li>
  )
}
