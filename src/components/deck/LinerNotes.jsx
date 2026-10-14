import { motion as Motion, useReducedMotion } from 'framer-motion'
import { ArrowUpRight, Github } from 'lucide-react'
import { Link } from 'react-router'
import { asset } from '../../utils/asset'
import { EASE_OUT, REDUCED_DURATION, STAGGER } from '../../utils/motion'
import { tapes } from '../../utils/projects'
import { HOME_LOCATION, projectPath } from '../../utils/routes'
import { buttonClass } from '../ui/buttonStyles'
import { ProjectGallery } from './ProjectGallery'

// Paper tones for the insert. Body text keeps at least 4.5:1 against the paper.
const paper = { bg: '#f2ede1', ink: '#1b1b1b', soft: '#5a5449', chip: '#e3dccb' }

function useItem() {
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

function NoteSection({ title, children }) {
  const item = useItem()
  return (
    <Motion.section variants={item} className="grid gap-3 md:grid-cols-[11rem_minmax(0,1fr)] md:gap-10">
      <h2 className="font-marker text-lead leading-tight" style={{ color: paper.ink }}>
        {title}
      </h2>
      <div className="min-w-0">{children}</div>
    </Motion.section>
  )
}

function Bullets({ items, accent }) {
  return (
    <ul className="tabular max-w-[64ch] space-y-3" role="list">
      {items.map((text) => (
        <li key={text} className="flex gap-3">
          <span aria-hidden="true" className="mt-[0.7em] size-1.5 shrink-0 rounded-full" style={{ backgroundColor: accent }} />
          <span>{text}</span>
        </li>
      ))}
    </ul>
  )
}

function MissingTape({ slug }) {
  return (
    <div className="space-y-5">
      <h1 id="project-title" className="font-marker text-head" style={{ color: paper.ink }}>
        No tape called &ldquo;{slug}&rdquo;
      </h1>
      <p className="max-w-[56ch]" style={{ color: paper.soft }}>
        It may have been renamed. These are the tapes on the shelf:
      </p>
      <ul className="flex flex-wrap gap-2" role="list">
        {tapes.map((project) => (
          <li key={project.slug}>
            <Link
              to={projectPath(project.slug)}
              replace
              state={{ backgroundLocation: HOME_LOCATION, layoutPrefix: null, depth: 0, fromHome: false }}
              className="pressable inline-flex h-10 items-center rounded-full px-4 text-small font-semibold"
              style={{ backgroundColor: paper.chip, color: paper.ink }}
            >
              {project.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function LinerNotes({ project, slug }) {
  const item = useItem()
  const container = {
    hidden: {},
    show: { transition: { staggerChildren: STAGGER, delayChildren: 0.18 } },
    exit: { opacity: 0, transition: { duration: 0.15 } },
  }
  const accent = project?.tape.stripe ?? paper.ink

  return (
    <Motion.article
      variants={container}
      initial="hidden"
      animate="show"
      exit="exit"
      className="relative mx-3 mt-4 rounded-[14px] px-5 py-8 md:mx-6 md:mt-6 md:px-12 md:py-12"
      style={{ backgroundColor: paper.bg, color: paper.ink }}
    >
      {!project ? (
        <MissingTape slug={slug} />
      ) : (
        <div className="space-y-12 md:space-y-14">
          <Motion.header variants={item}>
            <h1 id="project-title" className="font-marker text-head leading-tight">
              {project.title}
            </h1>
            <span aria-hidden="true" className="mt-3 block h-1.5 w-16 rounded-full" style={{ backgroundColor: accent }} />
            <p className="mt-5 max-w-[60ch] text-lead">{project.pitch}</p>
            <ul className="mt-5 flex flex-wrap gap-2" role="list">
              {project.tags.map((tag) => (
                <li key={tag} className="rounded-full px-3 py-1 text-small" style={{ backgroundColor: paper.chip, color: '#3d382f' }}>
                  {tag}
                </li>
              ))}
            </ul>
            {(project.live || project.github) && (
              <div className="mt-7 flex flex-wrap gap-3">
                {project.live && (
                  <a href={project.live} target="_blank" rel="noopener noreferrer" className={buttonClass({ size: 'lg' })}>
                    Live demo
                    <ArrowUpRight size={18} aria-hidden="true" />
                  </a>
                )}
                {project.github && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={buttonClass({ size: 'lg', variant: 'ink' })}
                  >
                    <Github size={18} aria-hidden="true" />
                    GitHub
                  </a>
                )}
              </div>
            )}
            {project.formerNames && (
              <p className="mt-4 text-small" style={{ color: paper.soft }}>
                Previously {project.formerNames.join(' and ')}.
              </p>
            )}
          </Motion.header>

          {project.image && (
            <Motion.figure variants={item}>
              <img
                src={asset(project.image.thumb)}
                srcSet={`${asset(project.image.thumb)} 960w, ${asset(project.image.full)} 1600w`}
                sizes="(min-width: 1000px) 830px, 92vw"
                width={project.image.width}
                height={project.image.height}
                alt={project.image.alt}
                decoding="async"
                className="aspect-video w-full rounded-[10px] object-cover object-top shadow-[0_18px_40px_-18px_rgba(0,0,0,0.45)]"
              />
            </Motion.figure>
          )}

          <NoteSection title="What it does">
            <div className="max-w-[64ch] space-y-4">
              <p>{project.description}</p>
              <p style={{ color: paper.soft }}>{project.problem}</p>
            </div>
          </NoteSection>

          {project.impact && (
            <NoteSection title="My part">
              <p className="max-w-[64ch]">{project.impact.replace(/^My part:\s*/, '')}</p>
            </NoteSection>
          )}

          {project.build.length > 0 && (
            <NoteSection title="How it's built">
              <Bullets items={project.build} accent={accent} />
            </NoteSection>
          )}

          {project.challenges.length > 0 && (
            <NoteSection title="Challenges">
              <div className="max-w-[64ch] space-y-6">
                {project.challenges.map((challenge) => (
                  <div key={challenge.title}>
                    <h3 className="font-semibold">{challenge.title}</h3>
                    <p className="mt-1.5" style={{ color: paper.soft }}>
                      {challenge.body}
                    </p>
                  </div>
                ))}
              </div>
            </NoteSection>
          )}

          {project.results.length > 0 && (
            <NoteSection title="Results">
              <Bullets items={project.results} accent={accent} />
            </NoteSection>
          )}

          {project.gallery.length > 0 && (
            <NoteSection title="More screens">
              <ProjectGallery images={project.gallery} />
            </NoteSection>
          )}
        </div>
      )}
    </Motion.article>
  )
}
