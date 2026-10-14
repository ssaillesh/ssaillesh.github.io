import { useRef } from 'react'
import { motion as Motion, useReducedMotion, useSpring } from 'framer-motion'
import { Link, useLocation } from 'react-router'
import { rememberFocus } from '../../utils/focusReturn'
import { EASE_OUT, sharedLayoutTransition } from '../../utils/motion'
import { tapeLayoutId, tapes } from '../../utils/projects'
import { projectPath } from '../../utils/routes'
import { Cassette } from '../tape/Cassette'
import { Reveal } from '../ui/Reveal'
import { SectionHeading } from '../ui/SectionHeading'

// How each tape lies on the desk: a slight angle and a small vertical offset, so the shelf
// looks set down by hand rather than gridded.
const RESTING = [
  { rotate: -2.2, drop: 0 },
  { rotate: 1.6, drop: 22 },
  { rotate: -1.1, drop: -4 },
  { rotate: 2.3, drop: 12 },
  { rotate: -1.7, drop: -6 },
  { rotate: 1.2, drop: 16 },
  { rotate: -2.5, drop: 6 },
]

const tiltSpring = { stiffness: 260, damping: 22, mass: 0.6 }

function ShelfTape({ project, index }) {
  const reduceMotion = useReducedMotion()
  const location = useLocation()
  const linkRef = useRef(null)
  const resting = RESTING[index % RESTING.length]
  const tiltX = useSpring(0, tiltSpring)
  const tiltY = useSpring(0, tiltSpring)
  const lift = useSpring(0, tiltSpring)

  // The tape leans towards the pointer and lifts off the desk; it settles before it flies.
  const lean = (event) => {
    if (reduceMotion || event.pointerType !== 'mouse') return
    const bounds = event.currentTarget.getBoundingClientRect()
    const x = (event.clientX - bounds.left) / bounds.width - 0.5
    const y = (event.clientY - bounds.top) / bounds.height - 0.5
    tiltY.set(x * 14)
    tiltX.set(-y * 12)
    lift.set(-8)
  }
  const settle = () => {
    tiltX.set(0)
    tiltY.set(0)
    lift.set(0)
  }

  return (
    <Motion.li
      className="w-full max-w-[24rem] sm:w-[calc(50%-1.5rem)] lg:mt-[var(--drop)] lg:w-[21.5rem]"
      style={{ '--drop': `${resting.drop}px` }}
      initial={{ opacity: 0, transform: reduceMotion ? 'translateY(0px)' : 'translateY(48px)' }}
      whileInView={{ opacity: 1, transform: 'translateY(0px)' }}
      viewport={{ once: true, margin: '0px 0px -8% 0px' }}
      transition={{ duration: reduceMotion ? 0.2 : 0.75, ease: EASE_OUT, delay: reduceMotion ? 0 : (index % 3) * 0.09 }}
    >
      <Link
        ref={linkRef}
        to={projectPath(project.slug)}
        state={{ backgroundLocation: location, layoutPrefix: 'tape', depth: 1, fromHome: true }}
        onClick={() => rememberFocus(linkRef.current)}
        onPointerMove={lean}
        onPointerLeave={settle}
        onPointerDown={settle}
        aria-label={`${project.title}: ${project.pitch} Press to play.`}
        className="tape-link group relative block rounded-[16px] outline-offset-8"
      >
        <span aria-hidden="true" className="tape-shadow absolute inset-x-[8%] -bottom-[5%] h-[16%] rounded-[50%] bg-black blur-xl" />
        <Motion.div
          layoutId={tapeLayoutId(reduceMotion ? null : 'tape', project.slug)}
          transition={sharedLayoutTransition}
          style={{ rotate: resting.rotate }}
          className="relative"
        >
          <Motion.div style={{ rotateX: tiltX, rotateY: tiltY, y: lift, transformPerspective: 900 }}>
            <Cassette title={project.title} subtitle={project.tags.slice(0, 3).join(' · ')} colors={project.tape} />
          </Motion.div>
        </Motion.div>
        <span className="mt-5 flex items-baseline justify-between gap-4 px-1">
          <span className="text-small text-ink-2">{project.teaser}</span>
          <span aria-hidden="true" className="play-hint shrink-0 text-small font-semibold text-accent">
            Play &#9654;
          </span>
        </span>
      </Link>
    </Motion.li>
  )
}

export function TapeShelf() {
  return (
    <section id="tapes" aria-labelledby="tapes-title" className="section">
      <Reveal className="page-width">
        <SectionHeading
          id="tapes-title"
          title="My tapes"
          description="Projects I've built, one tape each. Press one to play it."
        />
      </Reveal>
      <ul className="page-width mt-12 flex flex-wrap justify-center gap-x-12 gap-y-16 md:mt-16 lg:gap-x-14" role="list">
        {tapes.map((project, index) => (
          <ShelfTape key={project.slug} project={project} index={index} />
        ))}
      </ul>
    </section>
  )
}
