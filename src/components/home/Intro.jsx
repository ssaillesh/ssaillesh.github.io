import { motion as Motion, useReducedMotion } from 'framer-motion'
import { ArrowDown } from 'lucide-react'
import { profile } from '../../data/profile'
import { asset } from '../../utils/asset'
import { EASE_OUT } from '../../utils/motion'
import { scrollToSection } from '../../utils/scroll'
import { ButtonLink } from '../ui/Button'
import { buttonClass } from '../ui/buttonStyles'
import { SocialLinks } from '../ui/SocialLinks'

// A brush stroke under my name, in the same hand as the SM logo. Drawn once on load.
function BrushUnderline() {
  const reduceMotion = useReducedMotion()
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 300 24"
      preserveAspectRatio="none"
      className="absolute -bottom-[0.12em] left-0 h-[0.22em] w-[96%] overflow-visible"
    >
      <Motion.path
        d="M4 15 C 58 7, 118 20, 178 11 S 262 7, 296 13"
        fill="none"
        stroke="var(--accent)"
        strokeWidth="9"
        strokeLinecap="round"
        initial={{ pathLength: reduceMotion ? 1 : 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: reduceMotion ? 0 : 0.9, ease: EASE_OUT, delay: 0.55 }}
      />
    </svg>
  )
}

function Polaroid() {
  const reduceMotion = useReducedMotion()
  const { portrait } = profile
  return (
    <Motion.figure
      className="relative mx-auto w-[min(70vw,19rem)] bg-[#f6f3ec] p-3 pb-12 shadow-[0_36px_70px_-28px_rgba(0,0,0,0.85)] lg:w-full lg:max-w-[22rem]"
      initial={{ opacity: 0, transform: reduceMotion ? 'translateY(0px) rotate(3deg)' : 'translateY(28px) rotate(7deg)' }}
      animate={{ opacity: 1, transform: 'translateY(0px) rotate(3deg)' }}
      whileHover={reduceMotion ? undefined : { transform: 'translateY(-6px) rotate(0.5deg)' }}
      transition={{ duration: reduceMotion ? 0.2 : 0.8, ease: EASE_OUT, delay: reduceMotion ? 0 : 0.2 }}
    >
      {/* A strip of masking tape holding the photo down */}
      <span aria-hidden="true" className="absolute -top-4 left-1/2 h-8 w-28 -translate-x-1/2 -rotate-[4deg] bg-[#e7dbbd]/85" />
      <img
        src={asset(portrait.small)}
        srcSet={`${asset(portrait.small)} 760w, ${asset(portrait.medium)} 860w`}
        sizes="(min-width: 1024px) 352px, 70vw"
        width={portrait.width}
        height={portrait.height}
        alt={portrait.alt}
        fetchPriority="high"
        loading="eager"
        className="aspect-[4/5] w-full object-cover object-[50%_42%]"
      />
      <figcaption className="absolute inset-x-0 bottom-3 text-center font-marker text-[1.05rem] text-[#1b1b1b]">
        that&rsquo;s me
      </figcaption>
    </Motion.figure>
  )
}

export function Intro() {
  const reduceMotion = useReducedMotion()
  const rise = (step) => ({
    initial: { opacity: 0, transform: reduceMotion ? 'translateY(0px)' : 'translateY(18px)' },
    animate: { opacity: 1, transform: 'translateY(0px)' },
    transition: { duration: reduceMotion ? 0.2 : 0.7, ease: EASE_OUT, delay: reduceMotion ? 0 : 0.05 + step * 0.1 },
  })
  const [lead, ...rest] = profile.about

  return (
    <section
      aria-labelledby="intro-title"
      className="page-width grid items-center gap-14 pt-10 pb-16 md:pt-16 lg:min-h-[calc(100svh-var(--header-height)-5rem)] lg:grid-cols-[minmax(0,1.4fr)_minmax(0,0.6fr)] lg:gap-20 lg:py-12"
    >
      <div>
        <Motion.h1 id="intro-title" className="text-display font-bold text-ink" {...rise(0)}>
          Hey, I&rsquo;m{' '}
          <span className="relative inline-block">
            {profile.firstName}.
            <BrushUnderline />
          </span>
        </Motion.h1>

        <Motion.div {...rise(1)} className="mt-9 max-w-[60ch] space-y-4">
          <p className="text-lead text-ink">{lead}</p>
          {rest.map((paragraph) => (
            <p key={paragraph} className="text-ink-2">
              {paragraph}
            </p>
          ))}
        </Motion.div>

        <Motion.div {...rise(2)} className="mt-10 flex flex-wrap items-center gap-3">
          <a
            href="#tapes"
            onClick={(event) => {
              event.preventDefault()
              scrollToSection('tapes')
            }}
            className={buttonClass({ size: 'lg' })}
          >
            Play my tapes
            <ArrowDown size={18} aria-hidden="true" />
          </a>
          <ButtonLink href={asset(profile.resume)} variant="secondary" size="lg">
            Resume
          </ButtonLink>
          <SocialLinks className="sm:ml-2" />
        </Motion.div>
      </div>

      <Polaroid />
    </section>
  )
}
