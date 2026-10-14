import { useLayoutEffect } from 'react'
import { motion as Motion, useReducedMotion } from 'framer-motion'
import { ArrowUpRight, Github } from 'lucide-react'
import { Link } from 'react-router'
import { projects } from '../../data/projects'
import { EASE_OUT, REDUCED_DURATION, STAGGER, sharedLayoutTransition } from '../../utils/motion'
import { sharedIds } from '../../utils/projects'
import { HOME_LOCATION, projectPath } from '../../utils/routes'
import { Button, ButtonLink } from '../ui/Button'
import { TagList } from '../ui/TagList'
import { NextProject } from './NextProject'
import { ProjectGallery } from './ProjectGallery'
import { ProjectHeroMedia } from './ProjectHeroMedia'

function useItemVariants() {
  const reduceMotion = useReducedMotion()
  return {
    hidden: { opacity: 0, transform: reduceMotion ? 'translateY(0px)' : 'translateY(12px)' },
    show: {
      opacity: 1,
      transform: 'translateY(0px)',
      transition: { duration: reduceMotion ? REDUCED_DURATION : 0.45, ease: EASE_OUT },
    },
  }
}

function DetailSection({ title, children }) {
  const item = useItemVariants()
  return (
    <Motion.section variants={item} className="grid gap-4 md:grid-cols-[12rem_minmax(0,1fr)] md:gap-10">
      <h2 className="text-lead font-semibold text-ink">{title}</h2>
      <div className="min-w-0">{children}</div>
    </Motion.section>
  )
}

function ProjectNotFound({ slug, onClose }) {
  return (
    <div className="relative px-5 pt-24 pb-16 md:px-12">
      <h1 id="project-title" className="text-head font-bold text-ink">
        Project not found
      </h1>
      <p className="mt-3 max-w-[56ch] text-ink-2">
        There is no project called &ldquo;{slug}&rdquo;. It may have been renamed. These are the ones I can show you:
      </p>
      <ul className="mt-6 flex flex-wrap gap-2" role="list">
        {projects.map((project) => (
          <li key={project.slug}>
            <Link
              to={projectPath(project.slug)}
              replace
              state={{ backgroundLocation: HOME_LOCATION, layoutPrefix: null, depth: 0, fromHome: false }}
              className="pressable inline-flex h-10 items-center rounded-full bg-raised px-4 text-small font-semibold text-ink hover:bg-[#28282c]"
            >
              {project.title}
            </Link>
          </li>
        ))}
      </ul>
      <Button onClick={onClose} size="lg" className="mt-10">
        Back to the portfolio
      </Button>
    </div>
  )
}

export function ProjectDetails({ project, slug, layoutPrefix, wide, onClose, scrollerRef }) {
  const item = useItemVariants()

  // A new project (from "Next project") starts at the top of the panel.
  useLayoutEffect(() => {
    if (scrollerRef.current) scrollerRef.current.scrollTop = 0
  }, [scrollerRef])

  if (!project) return <ProjectNotFound slug={slug} onClose={onClose} />

  const ids = sharedIds(layoutPrefix, project.slug)
  const container = {
    hidden: {},
    show: { transition: { staggerChildren: STAGGER, delayChildren: layoutPrefix ? 0.16 : 0.06 } },
    exit: { opacity: 0, transition: { duration: 0.15 } },
  }

  return (
    <Motion.article className="relative pb-16" variants={container} initial="hidden" animate="show" exit="exit">
      {project.image ? (
        <ProjectHeroMedia image={project.image} layoutId={ids.image} radius={wide ? 20 : 0} />
      ) : (
        <div aria-hidden="true" className="h-16 md:h-20" />
      )}

      <div className="px-5 pt-7 md:px-12 md:pt-10">
        <Motion.h1
          id="project-title"
          layoutId={ids.title}
          layoutCrossfade={false}
          transition={sharedLayoutTransition}
          className="inline-block text-head font-bold whitespace-nowrap text-ink"
        >
          {project.title}
        </Motion.h1>

        <Motion.p variants={item} className="mt-3 max-w-[60ch] text-lead text-ink">
          {project.pitch}
        </Motion.p>
        <Motion.div variants={item}>
          <TagList tags={project.tags} className="mt-5" />
        </Motion.div>
        {(project.live || project.github) && (
          <Motion.div variants={item} className="mt-7 flex flex-wrap gap-3">
            {project.live && (
              <ButtonLink href={project.live} size="lg">
                Live demo
                <ArrowUpRight size={18} aria-hidden="true" />
              </ButtonLink>
            )}
            {project.github && (
              <ButtonLink href={project.github} variant="secondary" size="lg">
                <Github size={18} aria-hidden="true" />
                GitHub
              </ButtonLink>
            )}
          </Motion.div>
        )}
        {project.formerNames && (
          <Motion.p variants={item} className="mt-4 text-small text-ink-3">
            Previously {project.formerNames.join(' and ')}.
          </Motion.p>
        )}

        <div className="mt-12 grid gap-12 md:mt-16 md:gap-14">
          <DetailSection title="What it does">
            <div className="max-w-[66ch] space-y-4 text-ink">
              <p>{project.description}</p>
              <p className="text-ink-2">{project.problem}</p>
            </div>
          </DetailSection>

          {project.build.length > 0 && (
            <DetailSection title="How it's built">
              <ul className="max-w-[66ch] list-disc space-y-3 pl-5 text-ink-2 marker:text-accent">
                {project.build.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </DetailSection>
          )}

          {project.challenges.length > 0 && (
            <DetailSection title="Challenges and how I solved them">
              <div className="max-w-[66ch] space-y-6">
                {project.challenges.map((challenge) => (
                  <div key={challenge.title}>
                    <h3 className="font-semibold text-ink">{challenge.title}</h3>
                    <p className="mt-1.5 text-ink-2">{challenge.body}</p>
                  </div>
                ))}
              </div>
            </DetailSection>
          )}

          {project.results.length > 0 && (
            <DetailSection title="Results">
              <ul className="tabular max-w-[66ch] list-disc space-y-3 pl-5 text-ink-2 marker:text-accent">
                {project.results.map((result) => (
                  <li key={result}>{result}</li>
                ))}
              </ul>
            </DetailSection>
          )}

          {project.gallery.length > 0 && (
            <DetailSection title="Gallery">
              <ProjectGallery images={project.gallery} />
            </DetailSection>
          )}
        </div>

        <Motion.div variants={item}>
          <NextProject slug={project.slug} />
        </Motion.div>
      </div>
    </Motion.article>
  )
}
