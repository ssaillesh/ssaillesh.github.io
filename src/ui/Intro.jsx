import { AnimatePresence, motion } from 'framer-motion'
import { profile } from '../data/profile.js'

const Motion = motion
const line = (delay) => ({
  initial: { opacity: 0, y: 18, filter: 'blur(6px)' },
  animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
  transition: { duration: 1.1, delay, ease: [0.2, 0.7, 0.2, 1] },
})

// Cinematic title card shown over the 3D scene while it loads.
export default function Intro({ show, ready, onEnter }) {
  return (
    <AnimatePresence>
      {show && (
        <Motion.section
          key="intro"
          aria-label="Introduction"
          exit={{ opacity: 0, transition: { duration: 1.1, ease: [0.4, 0, 0.2, 1] } }}
          className="grain fixed inset-0 z-50 flex flex-col items-center justify-center bg-[radial-gradient(ellipse_at_50%_60%,rgba(13,13,14,.55)_0%,rgba(13,13,14,.92)_70%)] px-6 text-center"
        >
          <Motion.p {...line(0.2)} className="label-mono text-[11px] text-brass">
            {profile.school} · {profile.location}
          </Motion.p>
          <Motion.h1 {...line(0.45)} className="mt-6 font-serif text-[clamp(72px,13vw,200px)] leading-[0.85] tracking-[-0.02em] text-ivory">
            {profile.name}.
          </Motion.h1>
          <Motion.p {...line(0.85)} className="label-mono mt-8 text-[13px] tracking-[0.4em] text-ivory-2">
            {profile.residence}
          </Motion.p>
          <Motion.p {...line(1.15)} className="mt-4 font-serif text-[clamp(22px,2.6vw,34px)] italic text-stone">
            {profile.motto}
          </Motion.p>

          <Motion.div {...line(1.5)} className="mt-14 flex flex-col items-center gap-5">
            <button
              type="button"
              onClick={onEnter}
              disabled={!ready}
              className="group inline-flex h-14 items-center gap-4 rounded-full border border-brass/60 pl-7 pr-2 text-[15px] text-ivory transition-colors enabled:hover:border-brass enabled:hover:bg-brass/10 disabled:cursor-wait"
            >
              {ready ? 'Enter the residence' : 'Preparing the residence'}
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brass text-charcoal">
                {ready ? (
                  <span aria-hidden>→</span>
                ) : (
                  <span aria-hidden className="h-4 w-4 animate-spin rounded-full border-2 border-charcoal/30 border-t-charcoal" />
                )}
              </span>
            </button>
            <p className="text-[13px] text-stone">
              In a hurry?{' '}
              <a href={profile.links.resume} className="text-ivory-2 underline decoration-brass/60 underline-offset-4 hover:text-ivory">
                Open the résumé
              </a>{' '}
              or{' '}
              <a href="?plan" className="text-ivory-2 underline decoration-brass/60 underline-offset-4 hover:text-ivory">
                read the plain version
              </a>
              .
            </p>
          </Motion.div>
        </Motion.section>
      )}
    </AnimatePresence>
  )
}
