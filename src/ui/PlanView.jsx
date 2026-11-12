import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion, useScroll, useSpring } from 'framer-motion'
import { ArrowRight, ArrowUpRight, Bot, Box, Briefcase, Download, GraduationCap, Github, Layers, Linkedin, Mail, Trophy, User } from 'lucide-react'
import { profile, skills } from '../data/profile.js'
import { experience } from '../data/experience.js'
import { projects } from '../data/projects.js'
import { education } from '../data/education.js'
import { awards } from '../data/awards.js'
import { photos } from '../data/lounge.js'
import { CountUp, Reveal, Sheet } from './plan/parts.jsx'
import { useMediaQuery } from './plan/hooks.js'
import { JobSheet } from './plan/Sheets.jsx'
import { ProjectPage, ProjectsPage } from './plan/ProjectPages.jsx'
import { Aurora, LetterRise, RoleTicker, VaultCards, Welcome } from './plan/fx.jsx'
import { Ambient, RoomChip, RoomHeader, RoomRail } from './plan/rooms.jsx'
import { walkByRoom, walkStep } from './plan/walk.js'
import { featuredProjects, projectById } from './plan/projectMeta.js'

const Motion = motion

// The plain view: the residence as one page you walk through, room by room
// (Foyer → Garage → Vault → Study → Lab → Den). For phones, and for anyone who wants the facts
// without the 3D tour. It never touches WebGL.
//   #/                 the walk through
//   #/projects         every project
//   #/projects/<id>    one project

const TABS = [
  { id: 'work', label: 'Work', icon: Briefcase, section: 'work' },
  { id: 'projects', label: 'Projects', icon: Layers, section: 'projects' },
  { id: 'about', label: 'About', icon: User, section: 'about' },
  { id: 'contact', label: 'Contact', icon: Mail, section: 'contact' },
]

const JOB_BG = ['#3a2a1b', '#1d3a33', '#26304a', '#3a2438', '#2a3a22']
const WELCOME_KEY = 'plain-view-welcomed'

const scrollToSection = (id) => {
  if (id === 'top') window.scrollTo({ top: 0, behavior: 'smooth' })
  else document.getElementById(`sec-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

const seenWelcome = () => {
  try {
    return sessionStorage.getItem(WELCOME_KEY) === '1'
  } catch {
    return false
  }
}

function Container({ as = 'div', children, className = '', ...rest }) {
  const Tag = as
  return (
    <Tag className={`mx-auto w-full max-w-[1120px] px-5 lg:px-10 ${className}`} {...rest}>
      {children}
    </Tag>
  )
}

// One room of the walk: its threshold header, then its contents.
function Room({ room, section, children, className = '' }) {
  return (
    <Container as="section" id={`sec-${section}`} data-room={room} className={`scroll-mt-20 pt-24 lg:scroll-mt-24 lg:pt-36 ${className}`}>
      <RoomHeader room={room} step={walkStep(room)} />
      {children}
    </Container>
  )
}

const Label = ({ children, className = '' }) => <p className={`label-mono text-[10.5px] text-stone ${className}`}>{children}</p>

function IconButton({ href, icon, label, sub, primary, ...rest }) {
  const Icon = icon
  const ext = href.startsWith('http')
  return (
    <a
      href={href}
      {...(ext ? { target: '_blank', rel: 'noreferrer' } : {})}
      {...rest}
      className={`flex min-h-[78px] flex-col items-center justify-center gap-2 rounded-[18px] border px-2 text-center text-[12px] backdrop-blur-sm transition-[transform,border-color,background-color] active:scale-[0.97] ${
        primary ? 'border-brass bg-brass font-medium text-charcoal hover:bg-brass-2' : 'border-line bg-char-2/80 text-ivory-2 hover:border-ivory/30'
      }`}
    >
      <Icon size={24} strokeWidth={1.6} className={primary ? 'text-charcoal' : 'text-brass'} aria-hidden />
      <span>{label}</span>
      {sub && <span className={`-mt-1.5 max-w-full break-all text-[10.5px] ${primary ? 'text-charcoal/65' : 'text-concrete'}`}>{sub}</span>}
    </a>
  )
}

function ActionIcons({ big }) {
  return (
    <div className={`grid gap-2 ${big ? 'grid-cols-2 lg:grid-cols-4' : 'grid-cols-4'}`}>
      <IconButton icon={Download} label="Résumé" sub={big ? 'PDF' : undefined} primary href={profile.links.resume} download="Saillesh_Somasundaram_Resume.pdf" />
      <IconButton icon={Mail} label="Email" sub={big ? profile.links.email : undefined} href={`mailto:${profile.links.email}`} />
      <IconButton icon={Linkedin} label="LinkedIn" sub={big ? 'in/saillesh' : undefined} href={profile.links.linkedin} />
      <IconButton icon={Github} label="GitHub" sub={big ? 'ssaillesh' : undefined} href={profile.links.github} />
    </div>
  )
}

function JobTile({ x, i, onOpen }) {
  const lead = x.results?.[0]
  const wide = i === 0
  return (
    <Reveal delay={(i % 3) * 0.06} className={`h-full ${wide ? 'col-span-2' : ''}`}>
      <Motion.button
        type="button"
        onClick={() => onOpen(x)}
        whileTap={{ scale: 0.97 }}
        className={`group relative flex h-full w-full flex-col justify-between gap-6 overflow-hidden rounded-[22px] border border-line p-4 text-left transition-colors hover:border-ivory/25 lg:min-h-[240px] lg:p-5 ${wide ? 'min-h-[176px]' : 'min-h-[200px]'}`}
        style={{ background: `linear-gradient(160deg,${JOB_BG[i % JOB_BG.length]},#121110)` }}
      >
        <span className="flex items-start justify-between">
          <span className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-white/10 font-display text-[19px] font-bold">{x.company[0]}</span>
          <ArrowUpRight size={18} strokeWidth={1.6} className="text-ivory-2/70 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
        </span>
        <span>
          {lead && (
            <span className={`block whitespace-nowrap font-display font-bold leading-none tracking-[-0.03em] text-brass-2 ${wide ? 'text-[44px] lg:text-[56px]' : 'text-[30px] lg:text-[36px]'}`}>{lead.value}</span>
          )}
          {lead && <span className="mt-1 line-clamp-2 block text-[11.5px] leading-snug text-ivory-2/80 lg:text-[12.5px]">{lead.label}</span>}
          <span className={`mt-3 block font-display font-semibold leading-none tracking-[-0.02em] ${wide ? 'text-[26px]' : 'text-[20px] lg:text-[22px]'}`}>{x.company}</span>
          <span className="mt-1 block text-[12px] leading-snug text-ivory-2/90">
            {x.title.split(' / ')[0]}
            <span className="label-mono mt-1 block text-[9.5px] text-ivory-2/70">{x.period}</span>
          </span>
        </span>
      </Motion.button>
    </Reveal>
  )
}

function AwardCard({ a }) {
  return (
    <div className="flex items-start gap-2.5 rounded-[16px] border border-line bg-char-2/70 p-3.5">
      <Trophy size={16} strokeWidth={1.6} className="mt-0.5 shrink-0 text-brass" aria-hidden />
      <span>
        <span className="block text-[13px] leading-snug text-ivory">{a.name}</span>
        {a.detail && <span className="mt-0.5 block text-[11.5px] leading-snug text-concrete">{a.detail}</span>}
      </span>
    </div>
  )
}

function Walkthrough({ onJob, canTour }) {
  const featured = featuredProjects()
  const labAwards = awards.filter((a) => a.kind === 'Robotics')
  const studyAwards = awards.filter((a) => a.kind !== 'Robotics')

  return (
    <>
      {/* 01 · Foyer */}
      <section id="sec-top" data-room="foyer" className="relative overflow-hidden">
        <Aurora />
        <Container className="relative flex min-h-[88dvh] flex-col justify-end pb-10 pt-24 lg:min-h-[90dvh] lg:pb-16">
          <Motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }} className="label-mono mb-4 text-[10.5px] text-brass">
            01 · The Foyer
          </Motion.p>
          <Motion.span
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-[#7fc79a]/35 bg-[#7fc79a]/10 px-3 py-1.5 text-[12px] text-[#7fc79a] backdrop-blur-sm"
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#7fc79a] opacity-60" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#7fc79a]" />
            </span>
            {profile.availability}
          </Motion.span>
          <LetterRise text={`${profile.name}.`} delay={0.15} className="font-display text-[clamp(68px,20vw,176px)] font-bold leading-[0.88] tracking-[-0.05em]" />
          <Motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.75 }} className="mt-5 max-w-[40rem] font-display text-[22px] font-semibold leading-tight tracking-[-0.02em] lg:text-[30px]">
            <span className="block text-ivory-2">{profile.motto} Focused on</span>
            <RoleTicker items={profile.focusAreas} className="text-brass-2" />
          </Motion.div>
          <Motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.95 }} className="mt-7 max-w-[560px]">
            <ActionIcons />
            {canTour && (
              <a href="?3d" className="mt-5 inline-flex items-center gap-2 text-[13.5px] text-ivory-2 transition-colors hover:text-brass-2">
                <Box size={15} strokeWidth={1.7} className="text-brass" aria-hidden />
                Prefer to explore? Take the 3D tour
                <ArrowRight size={14} strokeWidth={1.7} aria-hidden />
              </a>
            )}
          </Motion.div>
        </Container>
        <Container className="relative">
          <div className="grid grid-cols-3 divide-x divide-line border-y border-line">
            {[
              [experience.length, 'roles'],
              [projects.length, 'projects'],
              [awards.length, 'awards'],
            ].map(([n, label]) => (
              <div key={label} className="px-3 py-6 text-center lg:py-8">
                <b className="block font-display text-[38px] font-bold leading-none tracking-[-0.03em] text-brass lg:text-[52px]">
                  <CountUp value={String(n)} />
                </b>
                <span className="mt-1.5 block text-[11.5px] text-concrete lg:text-[13px]">{label}</span>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* 02 · Garage: experience */}
      <Room room="garage" section="work">
        <div className="mt-10 grid grid-cols-2 gap-2.5 lg:mt-14 lg:grid-cols-3 lg:gap-4">
          {experience.map((x, i) => (
            <JobTile key={x.id} x={x} i={i} onOpen={onJob} />
          ))}
        </div>
      </Room>

      {/* 03 · Vault: projects */}
      <Room room="vault" section="projects">
        <VaultCards items={featured} />
        <Reveal className="mt-16 flex justify-center lg:mt-24">
          <a
            href="#/projects"
            className="group inline-flex min-h-[54px] items-center gap-3 rounded-full border border-brass/50 px-7 text-[15px] text-ivory transition-colors hover:border-brass hover:bg-brass/10"
          >
            Open the whole vault · {projects.length} projects
            <ArrowRight size={16} strokeWidth={1.7} className="text-brass transition-transform group-hover:translate-x-1" aria-hidden />
          </a>
        </Reveal>
      </Room>

      {/* 04 · Study: education and toolbox */}
      <Room room="study" section="about">
        <div className="mt-10 grid gap-10 lg:mt-14 lg:grid-cols-2 lg:gap-14">
          <div>
            <Reveal>
              <div className="flex items-center gap-4 rounded-[20px] border border-line bg-char-2/70 p-4">
                <span className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-[14px] bg-brass text-charcoal">
                  <GraduationCap size={26} strokeWidth={1.6} aria-hidden />
                </span>
                <span>
                  <b className="block text-[16px] font-semibold">{education.school}</b>
                  <span className="mt-0.5 block text-[13px] text-concrete">
                    {education.program} · {education.period}
                  </span>
                </span>
              </div>
            </Reveal>
            <Reveal className="mt-3">
              <div className="grid grid-cols-2 gap-2">
                {studyAwards.map((a) => (
                  <AwardCard key={a.id} a={a} />
                ))}
                {education.honours.map((h) => (
                  <AwardCard key={h.id} a={{ name: h.name }} />
                ))}
              </div>
            </Reveal>
            <Reveal className="mt-8">
              <Label>On the shelf</Label>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {education.coursework.map((c) => (
                  <span key={c} className="rounded-full border border-line px-3 py-1.5 text-[12.5px] text-ivory-2">
                    {c}
                  </span>
                ))}
              </div>
            </Reveal>
          </div>
          <Reveal>
            <Label>Toolbox</Label>
            <div className="mt-3 flex flex-col gap-5">
              {skills.map((g) => (
                <div key={g.group}>
                  <p className="mb-2 text-[12.5px] text-concrete">{g.group}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {g.items.map((s) => (
                      <span key={s} className="rounded-[10px] border border-line bg-char-2/70 px-2.5 py-1.5 font-mono text-[11.5px] text-ivory-2">
                        {s.replace(/ \(.*\)/, '')}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </Room>

      {/* 05 · Lab: robotics */}
      <Room room="lab" section="lab">
        <div className="mt-10 grid gap-4 lg:mt-14 lg:grid-cols-[1fr_1.4fr] lg:items-center lg:gap-14">
          <Reveal>
            <p className="max-w-[30rem] text-[16px] leading-relaxed text-ivory-2 lg:text-[18px]">
              Where it started: building and programming autonomous robots for competition, long before the CI pipelines.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="grid gap-3 sm:grid-cols-2">
              {labAwards.map((a) => (
                <div key={a.id} className="rounded-[20px] border border-line bg-char-2/70 p-5">
                  <Bot size={22} strokeWidth={1.5} className="text-brass" aria-hidden />
                  <p className="mt-4 font-display text-[22px] font-semibold leading-tight tracking-[-0.02em]">{a.name}</p>
                  {a.detail && <p className="mt-1.5 text-[13px] leading-snug text-concrete">{a.detail}</p>}
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </Room>

      {/* 06 · Den: the person, then contact */}
      <Room room="lounge" section="den">
        <Reveal className="mt-10 lg:mt-14">
          <Label>Off the clock</Label>
          <div className="hide-scrollbar -mx-5 mt-3 flex snap-x snap-mandatory gap-2.5 overflow-x-auto px-5 lg:mx-0 lg:grid lg:grid-cols-2 lg:gap-4 lg:px-0">
            {photos.map((ph) => (
              <img key={ph.src} src={ph.src} alt={ph.alt} loading="lazy" className="h-[240px] w-[72%] shrink-0 snap-start rounded-[20px] border border-line object-cover lg:h-[340px] lg:w-full" />
            ))}
          </div>
        </Reveal>

        <div id="sec-contact" className="flex min-h-[70dvh] scroll-mt-20 flex-col justify-center py-20 lg:items-center lg:text-center">
          <Reveal>
            <Label className="text-brass">The way out</Label>
            <h2 className="mt-3 font-display text-[clamp(64px,18vw,148px)] font-bold leading-[0.9] tracking-[-0.05em]">Let&rsquo;s talk.</h2>
            <p className="mt-4 text-[16px] text-ivory-2 lg:text-[18px]">Open to new grad roles in platform, DevOps and software engineering.</p>
          </Reveal>
          <Reveal delay={0.1} className="mt-8 w-full lg:max-w-[760px]">
            <ActionIcons big />
            {canTour && (
              <a href="?3d" className="mt-6 inline-flex items-center gap-2 text-[13.5px] text-ivory-2 transition-colors hover:text-brass-2">
                <Box size={15} strokeWidth={1.7} className="text-brass" aria-hidden />
                Walk the same rooms in 3D
                <ArrowRight size={14} strokeWidth={1.7} aria-hidden />
              </a>
            )}
            <p className="label-mono mt-5 text-[10.5px] text-concrete">
              {profile.location} · {profile.school}
            </p>
          </Reveal>
        </div>
      </Room>
    </>
  )
}

export default function PlanView({ route }) {
  const view = route.page === 'projects' ? (route.project ? 'project' : 'projects') : 'home'
  const canTour = useMediaQuery('(min-width: 861px) and (any-pointer: fine)')
  const reduce = useReducedMotion()

  // The welcome shows once per visit, on the home page, unless the visitor already chose the
  // plain view from the 3D intro (?plan) or followed a link straight into the house.
  const [welcome, setWelcome] = useState(
    () => view === 'home' && !route.room && !new URLSearchParams(window.location.search).has('plan') && !seenWelcome(),
  )
  const enter = useCallback(() => {
    try {
      sessionStorage.setItem(WELCOME_KEY, '1')
    } catch {
      /* private mode: show it again next time */
    }
    setWelcome(false)
  }, [])

  // Old links like #/garage/symcor open the matching job on first load.
  const [job, setJob] = useState(() => experience.find((e) => e.id === route.item) || null)
  const [room, setRoom] = useState('foyer')
  const pending = useRef(null)

  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 })
  const closeJob = useCallback(() => setJob(null), [])

  // New page: start at the top, or at the section a tab asked for.
  useEffect(() => {
    const target = pending.current
    pending.current = null
    requestAnimationFrame(() => (target && view === 'home' ? scrollToSection(target) : window.scrollTo(0, 0)))
  }, [view, route.project])

  // Old room links land in the matching room.
  useEffect(() => {
    const w = route.room && walkByRoom[route.room]
    if (w) requestAnimationFrame(() => scrollToSection(w.section))
  }, [route.room])

  useEffect(() => {
    const p = view === 'project' ? projectById(route.project) : null
    document.title = p ? `${p.name} · Saillesh` : view === 'projects' ? 'Projects · Saillesh' : 'Saillesh · Plain view'
  }, [view, route.project])

  // Which room you are in follows what is in the middle of the screen.
  useEffect(() => {
    if (view !== 'home' || welcome) return undefined
    const io = new IntersectionObserver((entries) => entries.forEach((e) => e.isIntersecting && setRoom(e.target.dataset.room)), { rootMargin: '-45% 0px -50% 0px' })
    document.querySelectorAll('[data-room]').forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [view, welcome])

  const goSection = (section) => {
    setJob(null)
    if (view === 'home') scrollToSection(section)
    else {
      pending.current = section
      window.location.assign('#/')
    }
  }
  const here = view === 'home' ? room : 'vault'
  const activeTab = walkByRoom[here]?.tab
  const tabFor = (t) => t.id === activeTab

  return (
    <div className="relative isolate min-h-screen pb-28 lg:pb-0">
      <Ambient current={here} />
      <Motion.div style={{ scaleX: reduce ? scrollYProgress : progress }} className="fixed inset-x-0 top-0 z-40 h-[2px] origin-left bg-brass" />

      {/* header */}
      <header className="fixed inset-x-0 top-0 z-30 bg-gradient-to-b from-charcoal/95 via-charcoal/70 to-transparent pb-6 pt-[max(0.75rem,env(safe-area-inset-top))] lg:border-b lg:border-line lg:bg-charcoal/75 lg:bg-none lg:pb-3 lg:backdrop-blur-md">
        <Container className="flex items-center justify-between gap-4 lg:gap-6">
          <a href="#/" onClick={(e) => view === 'home' && (e.preventDefault(), scrollToSection('top'))} className="flex items-center gap-2.5" aria-label="Home">
            <img src="/logos/sai-logo.png" alt="" className="h-8 w-auto" />
            <span className="hidden font-display text-[20px] font-bold tracking-[-0.03em] lg:inline">{profile.name}.</span>
          </a>
          <RoomChip current={here} />
          <nav aria-label="Sections" className="hidden items-center gap-1 lg:flex">
            {TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => goSection(t.section)}
                aria-current={tabFor(t) ? 'true' : undefined}
                className={`h-9 rounded-full px-4 text-[14px] transition-colors ${tabFor(t) ? 'bg-ivory/10 text-ivory' : 'text-stone hover:text-ivory'}`}
              >
                {t.label}
              </button>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            {canTour && (
              <a href="?3d" className="hidden h-9 items-center gap-2 rounded-full border border-ivory/25 px-4 text-[13px] text-ivory transition-colors hover:border-brass hover:text-brass-2 lg:inline-flex">
                <Box size={14} strokeWidth={1.8} aria-hidden />
                3D tour
              </a>
            )}
            <a
              href={profile.links.resume}
              download="Saillesh_Somasundaram_Resume.pdf"
              className="inline-flex h-9 items-center gap-2 rounded-full bg-brass px-4 text-[13px] font-medium text-charcoal transition-colors hover:bg-brass-2"
            >
              <Download size={14} strokeWidth={1.8} aria-hidden />
              Résumé
            </a>
          </div>
        </Container>
      </header>

      <RoomRail current={here} onJump={(r) => goSection(walkByRoom[r].section)} />

      <main>
        {view === 'home' && !welcome && <Walkthrough onJob={setJob} canTour={canTour} />}
        {view === 'projects' && <ProjectsPage />}
        {view === 'project' && <ProjectPage key={route.project} id={route.project} />}
      </main>

      {view !== 'home' && (
        <footer className="border-t border-line">
          <Container className="flex flex-col items-start justify-between gap-4 py-8 sm:flex-row sm:items-center">
            <p className="font-display text-[22px] font-semibold tracking-[-0.02em]">Like what you see?</p>
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={() => goSection('contact')} className="inline-flex h-11 items-center rounded-full bg-ivory px-5 text-[14px] font-medium text-charcoal transition-colors hover:bg-brass-2">
                Get in touch
              </button>
              <button type="button" onClick={() => goSection('top')} className="inline-flex h-11 items-center rounded-full border border-ivory/25 px-5 text-[14px] text-ivory transition-colors hover:border-brass">
                Back to the walk-through
              </button>
            </div>
          </Container>
        </footer>
      )}

      <Sheet open={!!job} onClose={closeJob} label={job ? `${job.company}, ${job.title}` : ''}>
        {job && <JobSheet x={job} />}
      </Sheet>

      <AnimatePresence>{welcome && <Welcome key="welcome" onEnter={enter} />}</AnimatePresence>

      {/* phone tab bar */}
      <nav aria-label="Sections" className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-charcoal/92 backdrop-blur-md lg:hidden">
        <ul className="mx-auto grid max-w-[40rem] grid-cols-4 px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2">
          {TABS.map((t) => {
            const Icon = t.icon
            const on = tabFor(t)
            return (
              <li key={t.id}>
                <button
                  type="button"
                  onClick={() => (t.id === 'projects' && view !== 'home' ? window.location.assign('#/projects') : goSection(t.section))}
                  aria-current={on ? 'true' : undefined}
                  className={`flex min-h-[52px] w-full flex-col items-center justify-center gap-1 rounded-xl text-[11px] transition-colors ${on ? 'text-brass' : 'text-concrete'}`}
                >
                  <Icon size={22} strokeWidth={1.6} aria-hidden />
                  {t.label}
                </button>
              </li>
            )
          })}
        </ul>
      </nav>
    </div>
  )
}
