import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, Github } from 'lucide-react'
import { isLive } from '../../data/projects.js'
import { Chips } from '../bits.jsx'
import { Disclosure, LiveBadge, Reveal, Results } from './parts.jsx'
import { Bullets, LinkButton } from './Sheets.jsx'
import { FILTERS, coverBackground, projectById, projectHref, shotsFor, sortedProjects, tagsFor } from './projectMeta.js'

const Motion = motion

// A screenshot when there is one, otherwise a cover generated from the project's id.
export function ProjectCover({ p, eager = false }) {
  const shot = shotsFor(p)[0]
  if (shot) {
    return <img src={shot} alt="" loading={eager ? 'eager' : 'lazy'} className="absolute inset-0 h-full w-full object-cover object-top" />
  }
  return (
    <span className="absolute inset-0" style={{ background: coverBackground(p.id) }}>
      <span
        className="absolute inset-0"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.05) 1px, transparent 1px)',
          backgroundSize: '22px 22px',
          maskImage: 'linear-gradient(160deg,#000 0%,transparent 65%)',
          WebkitMaskImage: 'linear-gradient(160deg,#000 0%,transparent 65%)',
        }}
      />
      <span className="absolute right-4 top-1 font-display text-[88px] font-bold leading-none text-ivory/15">{p.name[0]}</span>
    </span>
  )
}

export function ProjectTile({ p, wide = false, className = '' }) {
  return (
    <Motion.a
      layout
      href={projectHref(p.id)}
      whileTap={{ scale: 0.97 }}
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.25 }}
      className={`group flex flex-col overflow-hidden rounded-[22px] border border-line bg-char-2 text-left transition-colors hover:border-ivory/25 ${wide ? 'col-span-2' : ''} ${className}`}
    >
      <span className={`relative block overflow-hidden border-b border-line ${wide ? 'aspect-[16/8]' : 'aspect-[4/3] lg:aspect-[16/10]'}`}>
        <span className="absolute inset-0 transition-transform duration-500 group-hover:scale-[1.04]">
          <ProjectCover p={p} />
        </span>
        {isLive(p) && <LiveBadge className="absolute left-3 top-3 border-[#7fc79a]/50 bg-charcoal/80 backdrop-blur-sm" />}
      </span>
      <span className="flex flex-1 flex-col p-3.5 lg:p-5">
        <span className={`block font-display font-semibold leading-tight tracking-[-0.025em] ${wide ? 'text-[26px] lg:text-[32px]' : 'text-[18px] lg:text-[22px]'}`}>{p.name}</span>
        <span className="mt-1 line-clamp-2 text-[12px] leading-snug text-concrete lg:text-[13px]">{p.kind}</span>
      </span>
    </Motion.a>
  )
}

export function BackLink({ href, children }) {
  return (
    <a href={href} className="label-mono inline-flex min-h-[40px] items-center gap-2 text-[10.5px] text-stone transition-colors hover:text-ivory">
      <ArrowLeft size={14} strokeWidth={1.8} aria-hidden />
      {children}
    </a>
  )
}

export function ProjectsPage() {
  const [filter, setFilter] = useState('All')
  const all = sortedProjects()
  const shown = all.filter((p) => filter === 'All' || tagsFor(p).includes(filter))
  const filters = FILTERS.filter((f) => f === 'All' || all.some((p) => tagsFor(p).includes(f)))

  return (
    <div className="mx-auto w-full max-w-[1120px] px-5 pb-16 pt-20 lg:px-10 lg:pt-28">
      <BackLink href="#/">Home</BackLink>
      <Reveal>
        <p className="label-mono mt-2 text-[10.5px] text-brass">Projects · The Vault</p>
        <h1 className="mt-2 font-display text-[44px] font-bold leading-none tracking-[-0.035em] lg:text-[64px]">Built</h1>
        <p className="mt-3 max-w-[36rem] text-[15px] leading-relaxed text-stone">Everything I have shipped or am building, newest first. Open one for the problem, the results and how it works.</p>
      </Reveal>

      <div className="hide-scrollbar -mx-5 mt-6 flex gap-2 overflow-x-auto px-5 lg:mx-0 lg:px-0" role="group" aria-label="Filter projects">
        {filters.map((f) => (
          <button
            key={f}
            type="button"
            aria-pressed={filter === f}
            onClick={() => setFilter(f)}
            className={`min-h-[38px] shrink-0 rounded-full border px-4 text-[13px] transition-colors ${filter === f ? 'border-ivory bg-ivory text-charcoal' : 'border-line text-ivory-2 hover:border-ivory/40'}`}
          >
            {f}
          </button>
        ))}
      </div>
      <p className="label-mono mt-4 text-[10.5px] text-concrete" aria-live="polite">
        {shown.length} {shown.length === 1 ? 'project' : 'projects'}
      </p>

      <Motion.div layout className="mt-3 grid grid-cols-2 gap-2.5 lg:grid-cols-3 lg:gap-4">
        <AnimatePresence mode="popLayout">
          {shown.map((p, i) => (
            <ProjectTile key={p.id} p={p} wide={i === 0 && filter === 'All'} />
          ))}
        </AnimatePresence>
      </Motion.div>
    </div>
  )
}

export function ProjectPage({ id }) {
  const p = projectById(id)
  if (!p) {
    return (
      <div className="mx-auto w-full max-w-[1120px] px-5 pb-16 pt-24 lg:px-10 lg:pt-32">
        <BackLink href="#/projects">All projects</BackLink>
        <h1 className="mt-4 font-display text-[40px] font-bold tracking-[-0.03em]">That project is not here.</h1>
        <p className="mt-3 text-stone">It may have been renamed. The full list is one tap back.</p>
      </div>
    )
  }

  const shots = shotsFor(p)
  const list = sortedProjects()
  const next = list[(list.indexOf(p) + 1) % list.length]
  const { live, github } = p.links || {}

  return (
    <article className="mx-auto w-full max-w-[1120px] px-5 pb-16 pt-20 lg:px-10 lg:pt-28">
      <BackLink href="#/projects">All projects</BackLink>

      <div className="relative -mx-5 mt-2 aspect-[16/10] overflow-hidden border-y border-line sm:mx-0 sm:rounded-[24px] sm:border lg:aspect-[16/8]">
        <ProjectCover p={p} eager />
        <span className="absolute inset-0 bg-gradient-to-t from-charcoal/70 to-transparent to-50%" />
      </div>

      <div className="mt-8 lg:grid lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-14">
        <div className="min-w-0">
          <p className="label-mono flex flex-wrap items-center gap-2 text-[10.5px] text-brass">
            {p.kind}
            {isLive(p) && <LiveBadge />}
          </p>
          <h1 className="mt-2 font-display text-[46px] font-bold leading-[0.95] tracking-[-0.04em] lg:text-[72px]">{p.name}</h1>
          <p className="mt-4 max-w-[38rem] text-[17px] leading-snug text-ivory lg:text-[20px]">{p.oneLiner}</p>

          {(live || github) && (
            <div className="mt-6 flex flex-wrap gap-2 lg:hidden">
              {live && (
                <LinkButton href={live} primary>
                  Try it live
                </LinkButton>
              )}
              {github && (
                <LinkButton href={github}>
                  <Github size={15} strokeWidth={1.6} aria-hidden /> Code
                </LinkButton>
              )}
            </div>
          )}

          <Results items={p.results} wide className="mt-9" />

          {(p.problem || p.description) && (
            <div className="mt-10 grid gap-8 sm:grid-cols-2">
              {p.problem && (
                <div>
                  <p className="label-mono text-[10.5px] text-stone">The problem</p>
                  <p className="mt-2 text-[15px] leading-relaxed text-ivory-2">{p.problem}</p>
                </div>
              )}
              {p.description && (
                <div className={p.problem ? '' : 'sm:col-span-2'}>
                  <p className="label-mono text-[10.5px] text-stone">What it does</p>
                  <p className="mt-2 text-[15px] leading-relaxed text-ivory-2">{p.description}</p>
                </div>
              )}
            </div>
          )}

          {p.architecture && (
            <div className="mt-8">
              <Disclosure label="How it is built">
                <Bullets items={p.architecture} />
              </Disclosure>
            </div>
          )}
        </div>

        <aside className="mt-8 lg:mt-1">
          <div className="lg:sticky lg:top-28">
            {(live || github) && (
              <div className="mb-6 hidden flex-col gap-2 lg:flex">
                {live && (
                  <LinkButton href={live} primary>
                    Try it live
                  </LinkButton>
                )}
                {github && (
                  <LinkButton href={github}>
                    <Github size={15} strokeWidth={1.6} aria-hidden /> Code on GitHub
                  </LinkButton>
                )}
              </div>
            )}
            <p className="label-mono mb-3 text-[10.5px] text-stone">Built with</p>
            <Chips items={p.stack} />
            {p.year && <p className="label-mono mt-6 text-[10.5px] text-concrete">{p.year}</p>}
          </div>
        </aside>
      </div>

      {shots.length > 1 && (
        <section className="mt-12">
          <p className="label-mono text-[10.5px] text-stone">More screens</p>
          <div className="hide-scrollbar -mx-5 mt-3 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 lg:mx-0 lg:grid lg:grid-cols-3 lg:overflow-visible lg:px-0">
            {shots.slice(1).map((s) => (
              <a key={s} href={s} target="_blank" rel="noreferrer" className="block w-[82%] shrink-0 snap-start overflow-hidden rounded-[18px] border border-line lg:w-auto">
                <img src={s} alt={`${p.name} screen`} loading="lazy" className="aspect-[16/10] w-full object-cover object-top transition-transform duration-500 hover:scale-[1.03]" />
              </a>
            ))}
          </div>
        </section>
      )}

      {next && next.id !== p.id && (
        <a href={projectHref(next.id)} className="group mt-14 flex items-center justify-between gap-4 border-t border-line pt-6">
          <span>
            <span className="label-mono block text-[10.5px] text-stone">Next project</span>
            <span className="mt-1 block font-display text-[28px] font-semibold tracking-[-0.03em] transition-colors group-hover:text-brass-2">{next.name}</span>
          </span>
          <ArrowRight size={22} strokeWidth={1.6} className="text-brass transition-transform group-hover:translate-x-1" aria-hidden />
        </a>
      )}
    </article>
  )
}
