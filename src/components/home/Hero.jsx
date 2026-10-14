import { motion as Motion, useReducedMotion } from 'framer-motion'
import { ArrowDown } from 'lucide-react'
import { profile } from '../../data/profile'
import { asset } from '../../utils/asset'
import { EASE_OUT } from '../../utils/motion'
import { scrollToSection } from '../../utils/scroll'
import { ButtonLink } from '../ui/Button'
import { buttonClass } from '../ui/buttonStyles'
import { SocialLinks } from '../ui/SocialLinks'

export function Hero() {
  const reduceMotion = useReducedMotion()

  // Three beats: name and role, then the title-card line and intro, then the actions.
  const rise = (step) => ({
    initial: { opacity: 0, transform: reduceMotion ? 'translateY(0px)' : 'translateY(18px)' },
    animate: { opacity: 1, transform: 'translateY(0px)' },
    transition: { duration: reduceMotion ? 0.2 : 0.7, ease: EASE_OUT, delay: reduceMotion ? 0 : 0.08 + step * 0.09 },
  })

  const { portrait } = profile

  return (
    <section aria-labelledby="hero-title" className="relative">
      <div className="lg:grid lg:min-h-[min(calc(100svh-var(--header-height)),780px)] lg:grid-cols-2">
        <div className="relative h-[45svh] min-h-[300px] max-h-[520px] overflow-hidden lg:order-2 lg:h-auto lg:max-h-none">
          <Motion.img
            src={asset(portrait.small)}
            srcSet={`${asset(portrait.small)} 760w, ${asset(portrait.medium)} 860w, ${asset(portrait.large)} 1044w`}
            sizes="(min-width: 1024px) 50vw, 100vw"
            width={portrait.width}
            height={portrait.height}
            alt={portrait.alt}
            fetchPriority="high"
            loading="eager"
            className="absolute inset-0 size-full object-cover object-[50%_40%]"
            // Visible from the first paint (it is the largest thing on screen); only a slow settle in scale.
            initial={{ transform: reduceMotion ? 'scale(1)' : 'scale(1.05)' }}
            animate={{ transform: 'scale(1)' }}
            transition={{ duration: reduceMotion ? 0 : 1.4, ease: EASE_OUT }}
          />
          {/* Scrims: fade into the page below on phones, and from the left on desktop so text sits on solid ground. */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_50%,var(--background)_100%)] lg:bg-[linear-gradient(to_right,var(--background)_0%,rgb(11_11_12/0.55)_22%,transparent_55%),linear-gradient(to_top,var(--background)_0%,transparent_22%)]"
          />
        </div>

        <div className="relative px-[var(--edge)] pt-2 pb-4 lg:order-1 lg:flex lg:flex-col lg:justify-center lg:py-16 lg:pr-12">
          <div className="max-w-[38rem]">
            <Motion.div {...rise(0)}>
              <h1 id="hero-title" className="text-display font-bold text-ink">
                {profile.name}
              </h1>
              <p className="mt-5 text-lead font-medium text-ink">{profile.role}</p>
            </Motion.div>

            <Motion.div {...rise(1)}>
              <p className="tabular mt-3 text-ink-2">{profile.meta.join(' · ')}</p>
              <p className="mt-6 max-w-[62ch] text-ink">{profile.intro}</p>
            </Motion.div>

            <Motion.div {...rise(2)} className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href="#work"
                onClick={(event) => {
                  event.preventDefault()
                  scrollToSection('work')
                }}
                className={buttonClass({ size: 'lg' })}
              >
                View work
                <ArrowDown size={18} aria-hidden="true" />
              </a>
              <ButtonLink href={asset(profile.resume)} variant="secondary" size="lg">
                Resume
              </ButtonLink>
              <SocialLinks className="sm:ml-2" />
            </Motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
