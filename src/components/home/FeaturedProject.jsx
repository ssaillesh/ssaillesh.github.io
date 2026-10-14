import { useRef } from 'react'
import { motion as Motion, useReducedMotion } from 'framer-motion'
import { ArrowRight, ArrowUpRight, Github } from 'lucide-react'
import { Link, useLocation } from 'react-router'
import { asset } from '../../utils/asset'
import { rememberFocus } from '../../utils/focusReturn'
import { sharedLayoutTransition } from '../../utils/motion'
import { sharedIds } from '../../utils/projects'
import { projectPath } from '../../utils/routes'
import { preloadImage } from '../../utils/scroll'
import { ButtonLink } from '../ui/Button'
import { buttonClass } from '../ui/buttonStyles'
import { Reveal } from '../ui/Reveal'
import { TagList } from '../ui/TagList'

// The billboard: copy on the left, the product framed on the right. The screenshot never sits
// behind text, so its own headings never compete with ours.
export function FeaturedProject({ project }) {
  const reduceMotion = useReducedMotion()
  const location = useLocation()
  const primaryRef = useRef(null)
  const ids = sharedIds(reduceMotion ? null : 'featured', project.slug)
  const state = { backgroundLocation: location, layoutPrefix: 'featured', depth: 1, fromHome: true }
  const open = () => rememberFocus(primaryRef.current)
  const warm = () => preloadImage(asset(project.image.full))

  return (
    <article aria-labelledby="featured-title" className="page-width grid items-center gap-8 lg:grid-cols-12 lg:gap-14">
      <Reveal className="lg:order-2 lg:col-span-7">
        <Link
          to={projectPath(project.slug)}
          state={state}
          onClick={open}
          onPointerEnter={warm}
          tabIndex={-1}
          aria-hidden="true"
          className="pressable block rounded-[18px] bg-raised p-2 shadow-[0_48px_96px_-40px_rgba(0,0,0,0.9)] md:p-2.5"
        >
          <Motion.div
            layoutId={ids.image}
            transition={sharedLayoutTransition}
            style={{ borderRadius: 10 }}
            className="relative aspect-video overflow-hidden bg-surface"
          >
            <img
              src={asset(project.image.full)}
              srcSet={`${asset(project.image.small)} 640w, ${asset(project.image.thumb)} 960w, ${asset(project.image.full)} 1600w`}
              sizes="(min-width: 1024px) 58vw, 100vw"
              width={project.image.width}
              height={project.image.height}
              alt={project.image.alt}
              loading="lazy"
              decoding="async"
              className="size-full object-cover object-top"
            />
          </Motion.div>
        </Link>
      </Reveal>

      <Reveal className="lg:order-1 lg:col-span-5" delay={0.06}>
        <Motion.h3
          id="featured-title"
          layoutId={ids.title}
          transition={sharedLayoutTransition}
          className="inline-block text-head font-bold whitespace-nowrap text-ink"
        >
          {project.title}
        </Motion.h3>
        <p className="mt-3 text-lead text-ink">{project.pitch}</p>
        <TagList tags={project.tags.slice(0, 3)} className="mt-5" />
        {project.impact && <p className="mt-5 max-w-[56ch] text-ink-2">{project.impact}</p>}
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            ref={primaryRef}
            to={projectPath(project.slug)}
            state={state}
            onClick={open}
            onPointerEnter={warm}
            onFocus={warm}
            className={buttonClass({ size: 'md', className: 'xl:h-12 xl:px-6 xl:text-body' })}
          >
            View project
            <ArrowRight size={18} aria-hidden="true" />
          </Link>
          {project.live && (
            <ButtonLink href={project.live} variant="secondary" size="md" className="xl:h-12 xl:px-6 xl:text-body">
              Live demo
              <ArrowUpRight size={18} aria-hidden="true" />
            </ButtonLink>
          )}
          {project.github && (
            <ButtonLink href={project.github} variant="secondary" size="md" className="xl:h-12 xl:px-6 xl:text-body">
              <Github size={18} aria-hidden="true" />
              GitHub
            </ButtonLink>
          )}
        </div>
      </Reveal>
    </article>
  )
}
