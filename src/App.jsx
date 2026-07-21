import React, { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion, useMotionValue, useTransform } from 'framer-motion'
import {
  ArrowUpRight,
  BriefcaseBusiness,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Code2,
  ExternalLink,
  Github,
  GraduationCap,
  Info,
  Instagram,
  MoreHorizontal,
  Play,
  Plus,
  Shuffle,
  Sparkles,
  ThumbsUp,
  Wrench,
  X,
} from 'lucide-react'

const Motion = motion
const navPills = ['About Me', 'Projects']

const experienceEntries = [
  {
    id: 'symcor-devops',
    role: 'DevOps Engineer',
    org: 'Symcor Inc',
    logo: '/logos/symcor.png',
    accent: '#0072ce',
    companyUrl: 'https://www.symcor.ca/',
    companyAbout: 'Symcor builds secure technology and operations for highly regulated industries.',
    period: 'Sep 2025 - Apr 2026',
    highlights: [
      'Implemented CI/CD quality gates and secret scanning across 100+ repositories.',
      'Built GitLab Runner telemetry reducing pipeline brownouts by 40%.',
      'Modernized Java pipelines with Maven + JaCoCo and reusable automation.',
    ],
    stack: ['GitLab CI/CD', 'SonarQube', 'Bash', 'Ansible', 'Maven', 'JaCoCo'],
    description:
      'Hardened CI/CD across 100+ repositories by enforcing quality gates, secret scanning, and SonarQube reporting.',
  },
  {
    id: 'omniabio-qa',
    role: 'Quality Automation Engineer',
    org: 'OmniaBio',
    logo: '/logos/omniabio.png',
    accent: '#2b6cb0',
    companyUrl: 'https://omniabio.com/',
    companyAbout: 'OmniaBio is a cell and gene therapy CDMO focused on AI-enabled development and GMP manufacturing.',
    period: 'Aug 2024 - Dec 2024',
    highlights: [
      'Engineered Python anomaly detection for 8K+ pharmaceutical samples.',
      'Automated validation and outlier checks to cut GMP turnaround by 35%.',
      'Delivered 99.8% compliance while reducing manual QC cycles by 60%.',
    ],
    stack: ['Python', 'SPC', 'Validation', 'Automation'],
    description: 'Built anomaly detection and automated quality checks for GMP data pipelines.',
  },
  {
    id: 'pepsico-data',
    role: 'Data Analyst',
    org: 'PepsiCo Inc',
    logo: '/logos/pepsico.png',
    accent: '#003e7e',
    companyUrl: 'https://www.pepsico.com/',
    companyAbout: 'PepsiCo is a global food and beverage company with large-scale analytics operations.',
    period: 'Jan 2023 - Apr 2024',
    highlights: [
      'Built optimized SQL layers for faster BI drill-down and reporting.',
      'Applied regression and time-series analysis to uncover bottlenecks.',
      'Automated SLA-critical reporting for 500K+ users across 15 markets.',
    ],
    stack: ['SQL', 'Power BI', 'Regression', 'Time-Series'],
    description: 'Designed analytics and reporting systems with high SLA reliability.',
  },
]

const educationItems = [
  {
    id: 'uw-physics',
    period: '2021 - Present',
    title: 'Bachelor of Science in Honors Physics',
    provider: 'University of Waterloo',
    details:
      'Focused on computational physics, signals and systems, and mathematical modeling with practical software applications.',
  },
]

const projectCatalog = [
  {
    id: 1,
    title: 'ICT Displacement and Liquidity Sweep Detector',
    description: 'Detector and analysis tool for market displacement and liquidity sweep patterns.',
    teaser: 'Financial market analysis tool.',
    image: '/project/ict_read.png',
    tags: ['JavaScript', 'Data Analysis', 'Finance'],
    github: 'https://github.com/ssaillesh/ICT-Displacement-and-Liquidity-Sweep-Detector',
    liveUrl: '',
    category: ['Web & Frontend', 'Trending in My World'],
    year: 2024,
    status: 'In Progress',
    featured: false,
  },
  {
    id: 2,
    title: 'Financial Market News Sentiment Analyzer',
    description: 'News sentiment analyzer correlated with stock movement and dashboards.',
    teaser: 'Sentiment + market insight engine.',
    image: '/project/news.png',
    tags: ['JavaScript', 'Data Analysis', 'Finance'],
    github: 'https://github.com/ssaillesh/ICT-Displacement-and-Liquidity-Sweep-Detector',
    liveUrl: '',
    category: ['Web & Frontend', 'Trending in My World'],
    year: 2024,
    status: 'In Progress',
    featured: false,
  },
  {
    id: 3,
    title: 'Heston Stochastic Volatility Model Engine',
    description: 'Numerical pricing and analysis toolkit for Heston stochastic volatility model.',
    teaser: 'Simulation and analytics engine.',
    image: '/project/Heston2.png',
    tags: ['Python', 'Stochastic Mathematics', 'Analytics'],
    github: 'https://github.com/ssaillesh/heston_engine',
    liveUrl: '',
    category: ['Trending in My World', 'Tools & Utilities', 'Web & Frontend'],
    year: 2024,
    status: 'Open Source',
    featured: true,
  },
  {
    id: 11,
    title: 'CareLoop',
    description:
      'Multi-tenant dental practice-management platform: scheduling and availability, patient intake, documents, billing, reminders/notifications, an AI phone assistant (Twilio + ElevenLabs), Google Calendar sync, and analytics. For medical care.',
    teaser: 'Dental practice management platform.',
    image: '/project/careloop_intro.png',
    tags: ['React', 'Next.js', 'NestJS'],
    github: 'https://github.com/aarya127/CareLoop',
    liveUrl: 'https://care-loop-api.vercel.app/',
    category: ['Web & Frontend', 'Tools & Utilities', 'Trending in My World'],
    year: 2026,
    status: 'Open Source',
    featured: false,
  },
  {
    id: 5,
    title: 'Pad-Lock',
    description: 'Access management and credential handling project.',
    teaser: 'Security workflow project.',
    image: null,
    tags: ['React', 'Node.js', 'Security'],
    github: 'https://github.com/ssaillesh/Pad-Lock',
    liveUrl: '',
    category: ['Trending in My World', 'Tools & Utilities'],
    year: 2024,
    status: 'Completed',
    featured: false,
  },

   {
    id: 6,
    title: 'ASL Recognition',
    description:
      'Real-time American Sign Language recognition desktop app that tracks 21 hand landmarks with MediaPipe to predict fingerspelling gestures from a live webcam feed. Build sentences with text-to-speech output, sharpen skills in a scored practice mode with streaks, and train custom RandomForest models on the Kaggle ASL Fingerspelling dataset — all through a Tkinter interface with a built-in ASL reference guide.',
    teaser: 'Live ASL fingerspelling to speech.',
    image: null,
    tags: ['Python', 'MediaPipe', 'scikit-learn'],
    github: 'https://github.com/ssaillesh/ASL-Recognition-',
    liveUrl: '',
    category: ['Trending in My World', 'Tools & Utilities'],
    year: 2026,
    status: 'Completed',
    featured: false,
  },
  
  {
    id: 7,
    title: 'Invasion-game',
    description: 'Arcade-style gameplay project for real-time logic and UI responsiveness.',
    teaser: 'Arcade gameplay project.',
    image: null,
    tags: ['JavaScript', 'Game Dev', 'Frontend'],
    github: 'https://github.com/ssaillesh/Invasion-game',
    liveUrl: '',
    category: ['Web & Frontend', 'Trending in My World'],
    year: 2024,
    status: 'In Progress',
    featured: false,
  },
  {
    id: 8,
    title: 'AutoML Researcher',
    description: 'Guided optimization lab to train, compare, and rank models.',
    teaser: 'AutoML optimization and leaderboard.',
    image: '/project/automl.png',
    tags: ['Python', 'AutoML', 'Classification'],
    github: '',
    liveUrl: '',
    category: ['Trending in My World', 'Tools & Utilities', 'Web & Frontend'],
    year: 2026,
    status: 'Completed',
    featured: true,
  },

  {
    id: 9,
    title: 'RAGForge',
    description: 'An AI-powered system that analyzes codebases, retrieves semantic structure through RAG, and generates production-ready documentation automatically. Built for engineers who want clarity, not manual documentation',
    teaser: 'RAG documentation generator.',
    image: '/project/RAGForge.png',
    tags: ['Python', 'LLM', 'RAG'],
    github: 'https://github.com/ssaillesh/CodeGraphRAG.git',
    liveUrl: '',
    category: ['Trending in My World', 'Tools & Utilities', 'Web & Frontend'],
    year: 2026,
    status: 'In Progress',
    featured: true,
  },
 
  {
    id: 10,
    title: 'Roamly',
    description:
      'Roamly is a hyper-local, budget-locked itinerary generator for spontaneous nights out. Instead of acting as a broad, all-knowing travel guide, it operates as a programmatic matchmaker between a users immediate liquid cash and a single neighborhoods active venue ecosystem. It does not curate everything, it solves a single, high-friction problem: "I have $60 and two hours right now—where do I go next so I dont waste my night staring at my phone?"',
    teaser: 'Give us a budget and a vibe. We’ll give you a real, mapped out night that actually sticks to it',
    image: '/project/Roamly.png',
    tags: ['Python', 'FastAPI', 'PostGIS'],
    github: 'https://github.com/ssaillesh/sway',
    liveUrl: 'https://trekrank.vercel.app/',
    category: ['Web & Frontend', 'Tools & Utilities'],
    year: 2026,
    status: 'In Progress',
    featured: false,
    hero: true,
  },
]

const projectGradients = {
  React: 'from-cyan-500/45 via-cyan-700/25 to-zinc-900/60',
  Python: 'from-blue-600/40 via-indigo-700/20 to-zinc-900/65',
  'Node.js': 'from-emerald-500/40 via-green-700/20 to-zinc-900/65',
  TypeScript: 'from-blue-500/40 via-sky-700/20 to-zinc-900/65',
  Kafka: 'from-rose-500/35 via-fuchsia-600/20 to-zinc-900/65',
  default: 'from-red-500/35 via-neutral-700/20 to-zinc-900/70',
}

class AppErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, errorMessage: '' }
  }

  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      errorMessage: error instanceof Error ? error.message : 'Unknown runtime error',
    }
  }

  componentDidCatch(error) {
    console.error('Runtime render error:', error)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="grid min-h-screen place-items-center bg-[#121212] px-4 text-center text-white">
          <div className="max-w-lg rounded-xl border border-red-500/40 bg-[#181818] p-6">
            <h2 className="text-xl font-bold text-red-400">UI Runtime Error</h2>
            <p className="mt-3 text-sm text-[#bcbcbc]">
              The app hit a rendering error. Reload once and if this repeats, share this message.
            </p>
            <p className="mt-3 rounded-md bg-black/30 p-2 font-mono text-xs text-left">{this.state.errorMessage}</p>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

function getProjectGradient(project) {
  for (const tag of project.tags) {
    if (projectGradients[tag]) return projectGradients[tag]
  }
  return projectGradients.default
}

function ProjectCoverIcon({ project, ...props }) {
  const categories = project.category || []
  if (categories.includes('Tools & Utilities')) return <Wrench {...props} />
  if (categories.includes('Web & Frontend')) return <Code2 {...props} />
  return <Sparkles {...props} />
}

function ProjectCover({ project }) {
  if (project.image) {
    return (
      <img
        src={project.image}
        alt={project.title}
        className="h-full w-full object-cover"
        loading="lazy"
      />
    )
  }

  return (
    <div className={`relative flex h-full w-full items-center justify-center overflow-hidden bg-gradient-to-br ${getProjectGradient(project)}`}>
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.18]"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.55) 1px, transparent 1px)',
          backgroundSize: '14px 14px',
        }}
      />
      <span className="pointer-events-none absolute -right-2 -top-6 select-none text-[7.5rem] font-black leading-none text-white/10">
        {project.title.charAt(0)}
      </span>
      <div className="relative z-10 px-4 text-center">
        <ProjectCoverIcon project={project} className="mx-auto mb-2 text-white/85" size={26} />
        <p className="text-base font-bold text-white drop-shadow-sm">{project.title}</p>
        <p className="mt-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/75">
          {project.tags.slice(0, 3).join(' • ')}
        </p>
      </div>
    </div>
  )
}

function ExperienceAlbumCover({ logo, org }) {
  const [loadFailed, setLoadFailed] = useState(false)

  if (logo && !loadFailed) {
    return (
      <img
        src={logo}
        alt={`${org} logo`}
        className="aspect-square w-full object-cover"
        loading="lazy"
        onError={() => setLoadFailed(true)}
      />
    )
  }

  return (
    <div className="flex aspect-square w-full items-center justify-center bg-[linear-gradient(135deg,#232323,#111)]">
      <span className="text-3xl font-black text-white/90">{org.charAt(0)}</span>
    </div>
  )
}

function ExperienceModal({ experience, onClose }) {
  if (!experience) return null

  const accent = experience.accent || '#1db954'
  const overlayBg =
    experience.logo
      ? `linear-gradient(120deg, ${accent}cc 0%, rgba(16,16,16,0.92) 50%, rgba(10,10,10,0.95) 100%), url(${experience.logo})`
      : `linear-gradient(120deg, ${accent}, #1a1a1a 45%, #101010)`

  return (
    <AnimatePresence>
      <Motion.div
        className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-black/75 p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        onClick={onClose}
      >
        <Motion.div
          className="w-full max-w-4xl overflow-hidden rounded-xl bg-[#181818] shadow-[0_25px_80px_rgba(0,0,0,0.65)]"
          initial={{ opacity: 0, scale: 0.95, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.97, y: 20 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          onClick={(event) => event.stopPropagation()}
        >
          <div className="relative overflow-hidden p-6 sm:p-8" style={{ backgroundImage: overlayBg, backgroundSize: 'cover', backgroundPosition: 'center' }}>
            <div className="pointer-events-none absolute inset-0 bg-black/35" />
            <button
              type="button"
              onClick={onClose}
              className="absolute right-4 top-4 z-10 grid h-9 w-9 place-items-center rounded-full bg-black/60 text-white"
            >
              <X size={16} />
            </button>
            <div className="relative z-10 flex items-center gap-4">
              <div className="w-20 overflow-hidden rounded-md border border-white/10 sm:w-24">
                <ExperienceAlbumCover logo={experience.logo} org={experience.org} />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#bcbcbc]">Experience Spotlight</p>
                <h3 className="truncate text-2xl font-black text-white sm:text-3xl">{experience.role}</h3>
                <p className="truncate text-sm text-[#bcbcbc]">{experience.org}</p>
                <p className="mt-1 text-xs uppercase tracking-[0.16em] text-[#757575]">{experience.period}</p>
              </div>
            </div>
            <div className="relative z-10 mt-5 flex flex-wrap gap-2">
              <a
                href={experience.companyUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-semibold text-white"
                style={{ backgroundColor: accent }}
              >
                <ExternalLink size={14} />
                Visit Company
              </a>
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-md bg-zinc-500/50 px-4 py-2 text-sm font-semibold text-white"
              >
                <Info size={14} />
                Role Details
              </button>
            </div>
          </div>

          <div className="grid gap-7 p-6 md:grid-cols-[1.5fr_1fr]">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#757575]">Description</p>
              <p className="mt-2 text-sm leading-relaxed text-[#bcbcbc]">{experience.description}</p>
              <p className="mt-5 text-xs font-semibold uppercase tracking-[0.16em] text-[#757575]">Key Contributions</p>
              <ul className="mt-2 space-y-2 text-sm text-[#bcbcbc]">
                {experience.highlights.map((item) => (
                  <li key={item}>- {item}</li>
                ))}
              </ul>
            </div>

            <div className="space-y-3 text-sm text-[#bcbcbc]">
              <p>
                <span className="text-[#757575]">Company:</span> {experience.org}
              </p>
              <p>
                <span className="text-[#757575]">Website:</span>{' '}
                <a href={experience.companyUrl} target="_blank" rel="noreferrer" className="text-white hover:underline">
                  {experience.companyUrl}
                </a>
              </p>
              <p>
                <span className="text-[#757575]">About:</span> {experience.companyAbout}
              </p>
              <div>
                <p className="text-[#757575]">Tools:</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {experience.stack.map((tool) => (
                    <span key={tool} className="rounded-full bg-[#333333] px-2.5 py-1 text-xs text-[#bcbcbc]">
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Motion.div>
      </Motion.div>
    </AnimatePresence>
  )
}

function EducationModal({ item, onClose }) {
  if (!item) return null

  return (
    <AnimatePresence>
      <Motion.div
        className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-black/75 p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        onClick={onClose}
      >
        <Motion.div
          className="w-full max-w-3xl overflow-hidden rounded-xl bg-[#181818] shadow-[0_25px_80px_rgba(0,0,0,0.65)]"
          initial={{ opacity: 0, scale: 0.95, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.97, y: 20 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          onClick={(event) => event.stopPropagation()}
        >
          <div className={`relative bg-gradient-to-br ${item.color} p-6 sm:p-8`}>
            <div className="pointer-events-none absolute inset-0 bg-black/35" />
            <button
              type="button"
              onClick={onClose}
              className="absolute right-4 top-4 z-10 grid h-9 w-9 place-items-center rounded-full bg-black/60 text-white"
            >
              <X size={16} />
            </button>
            <div className="relative z-10">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#d8d8d8]">{item.badge}</p>
              <h3 className="mt-2 text-2xl font-black text-white sm:text-3xl">{item.title}</h3>
              <p className="mt-1 text-sm text-[#d8d8d8]">{item.provider}</p>
              <p className="mt-1 text-xs uppercase tracking-[0.16em] text-[#b6b6b6]">{item.period}</p>
            </div>
          </div>
          <div className="space-y-4 p-6">
            <p className="text-sm leading-relaxed text-[#bcbcbc]">{item.details}</p>
            <a
              href={item.link}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-md bg-white px-4 py-2 text-sm font-semibold text-black"
            >
              <ExternalLink size={14} />
              Visit Institution
            </a>
          </div>
        </Motion.div>
      </Motion.div>
    </AnimatePresence>
  )
}

function ProjectCard({ project, index, onOpenModal }) {
  return (
    <Motion.article
      layout
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.92 }}
      transition={{ duration: 0.3, delay: index * 0.04, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -6 }}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#191919] shadow-lg transition-colors hover:border-white/25"
    >
      <div className="relative aspect-video w-full overflow-hidden">
        <div className="h-full w-full transition-transform duration-500 ease-out group-hover:scale-105">
          <ProjectCover project={project} />
        </div>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent opacity-70 transition-opacity duration-300 group-hover:opacity-90" />
        <span className="absolute bottom-3 left-3 text-[11px] font-semibold text-white/80 drop-shadow">{project.year}</span>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <h4 className="line-clamp-1 text-base font-semibold text-white">{project.title}</h4>
        <p className="line-clamp-2 text-xs leading-relaxed text-[#bcbcbc]">{project.teaser || project.description}</p>
        <div className="flex flex-wrap gap-1.5">
          {project.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="rounded-full bg-white/[0.06] px-2 py-0.5 text-[10px] font-medium text-white/70 ring-1 ring-white/10">
              {tag}
            </span>
          ))}
        </div>
        <div className="mt-auto flex items-center gap-2 pt-1">
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-md bg-white px-3 py-1.5 text-xs font-semibold text-black transition hover:bg-zinc-200"
            onClick={() => window.open(project.liveUrl || project.github, '_blank', 'noreferrer')}
          >
            <Play size={12} fill="currentColor" />
            View
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-md border border-white/30 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-white/10"
            onClick={() => onOpenModal(project)}
          >
            <Info size={12} />
            Details
          </button>
        </div>
      </div>
    </Motion.article>
  )
}

function ProjectModal({ project, onClose, onOpenModal }) {
  const related = useMemo(() => {
    if (!project) return []
    const others = projectCatalog.filter((item) => item.id !== project.id)
    const shared = others.filter((item) => item.category.some((category) => project.category.includes(category)))
    const rest = others.filter((item) => !shared.includes(item))
    return [...shared, ...rest].slice(0, 4)
  }, [project])

  if (!project) {
    return null
  }

  return (
    <AnimatePresence>
      {(
        <Motion.div
          className="fixed inset-0 z-50 grid place-items-center bg-black/75 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          onClick={onClose}
        >
          <Motion.div
            className="flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-xl bg-[#181818] shadow-[0_25px_80px_rgba(0,0,0,0.65)]"
            initial={{ opacity: 0, scale: 0.95, y: 26 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 20 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="min-h-0 flex-1 overflow-y-auto">
              <div className="relative aspect-video shrink-0 sm:aspect-[21/9]">
                <ProjectCover project={project} />
                <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(24,24,24,1)_8%,rgba(24,24,24,0.25)_60%,transparent)]" />
                <button
                  type="button"
                  onClick={onClose}
                  className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full bg-black/70 text-white"
                >
                  <X size={16} />
                </button>
                <div className="absolute bottom-5 left-5 right-5">
                  <h3 className="text-3xl font-black text-white sm:text-4xl">{project.title}</h3>
                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      className="inline-flex items-center gap-2 rounded-md bg-[#e50914] px-4 py-2 text-sm font-semibold text-white"
                      onClick={() => window.open(project.liveUrl || project.github, '_blank', 'noreferrer')}
                    >
                      <Play size={15} fill="currentColor" />
                      View Project
                    </button>
                    <button type="button" className="grid h-9 w-9 place-items-center rounded-full border border-white/40 text-white">
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid gap-6 p-6 md:grid-cols-[1.5fr_1fr]">
                <div>
                  <div className="mb-3 flex flex-wrap items-center gap-2 text-xs text-[#bcbcbc]">
                    <span className="rounded-md border border-white/20 px-2 py-0.5">{project.year}</span>
                  </div>
                  <p className="text-sm leading-relaxed text-[#bcbcbc]">{project.description}</p>
                  <div className="mt-4">
                    <p className="text-xs uppercase tracking-[0.16em] text-[#757575]">Built With</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {project.tags.map((tag) => (
                        <span key={tag} className="rounded-full bg-[#333333] px-2.5 py-1 text-xs text-[#bcbcbc]">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <p className="mt-4 text-sm text-[#bcbcbc]">
                    <span className="text-[#757575]">Author:</span> Saillesh Somasundaram
                  </p>
                </div>

                <div className="space-y-3 text-sm text-[#bcbcbc]">
                  <p>
                    <span className="text-[#757575]">GitHub:</span>{' '}
                    <a href={project.github} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-white hover:underline">
                      <Github size={14} />
                      Repository
                    </a>
                  </p>
                  <p>
                    <span className="text-[#757575]">Live Demo:</span>{' '}
                    {project.liveUrl ? (
                      <a href={project.liveUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-white hover:underline">
                        <ExternalLink size={14} />
                        Open Link
                      </a>
                    ) : (
                      <span>Private / Not Deployed</span>
                    )}
                  </p>
                  <p>
                    <span className="text-[#757575]">Status:</span> {project.status}
                  </p>
                  <p>
                    <span className="text-[#757575]">Tags:</span> {project.category.join(', ')}
                  </p>
                  <p>
                    <span className="text-[#757575]">Year:</span> {project.year}
                  </p>
                </div>
              </div>

              <div className="border-t border-white/10 px-6 pb-6 pt-5">
                <h4 className="text-lg font-semibold text-white">More Projects</h4>
                <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-4">
                  {related.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => onOpenModal(item)}
                      className="overflow-hidden rounded-lg border border-white/10 bg-[#202020] text-left transition hover:bg-[#2a2a2a]"
                    >
                      <div className="aspect-video">
                        <ProjectCover project={item} />
                      </div>
                      <p className="p-2 text-xs font-semibold text-white">{item.title}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </Motion.div>
        </Motion.div>
      )}
    </AnimatePresence>
  )
}

function NetflixProjectsView({ scrollTop }) {
  const [selectedProject, setSelectedProject] = useState(null)

  const manualHeroProject = projectCatalog.find((project) => project.hero)
  const mostRecentProject = [...projectCatalog].sort((a, b) => (b.year - a.year) || (b.id - a.id))[0]
  const listedProjects = [...projectCatalog].sort((a, b) => (b.year - a.year) || (b.id - a.id))
  const heroProject = manualHeroProject || mostRecentProject || projectCatalog[0]
  const heroScale = useTransform(scrollTop, (value) => 1 + Math.min(value * 0.00012, 0.03))

  return (
    <Motion.div
      key="netflix-projects"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="space-y-9"
    >
      <section className="relative -mx-4 -mt-6 h-[65vh] min-h-[420px] overflow-hidden sm:-mx-8">
        <Motion.div style={{ scale: heroScale }} className="absolute inset-0 saturate-125 brightness-110 contrast-110 will-change-transform">
          <ProjectCover project={heroProject} />
        </Motion.div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#141414_10%,transparent_48%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_top,#141414_2%,transparent_45%)]" />

        <Motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="absolute bottom-12 left-6 z-10 max-w-xl sm:left-10"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#bcbcbc]">Featured Project</p>
          <h2 className="mt-3 text-4xl font-black italic leading-tight text-white drop-shadow-lg sm:text-6xl">
            {heroProject.title}
          </h2>
          <p className="mt-3 max-w-lg text-sm leading-relaxed text-white/75 drop-shadow sm:text-base">
            {heroProject.teaser || heroProject.description}
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-[#bcbcbc]">
            <span>{heroProject.year}</span>
            {heroProject.tags.map((tag) => (
              <span key={tag} className="rounded-full bg-[#333333] px-2 py-1 text-xs">
                {tag}
              </span>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-md bg-white px-5 py-2.5 text-sm font-semibold text-black transition hover:scale-[1.02] hover:bg-zinc-200"
              onClick={() => window.open(heroProject.liveUrl || heroProject.github, '_blank', 'noreferrer')}
            >
              <Play size={15} fill="currentColor" />
              View Project
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-md bg-zinc-500/50 px-5 py-2.5 text-sm font-semibold text-white transition hover:scale-[1.02] hover:bg-zinc-400/55"
              onClick={() => setSelectedProject(heroProject)}
            >
              <Info size={15} />
              More Info
            </button>
          </div>
        </Motion.div>
      </section>

      <section className="space-y-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="text-lg font-semibold text-white sm:text-xl">Browse Projects</h3>
          <p className="text-xs text-[#9f9f9f]">
            {listedProjects.length} {listedProjects.length === 1 ? 'project' : 'projects'}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {listedProjects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} onOpenModal={setSelectedProject} />
          ))}
        </div>
      </section>

      <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} onOpenModal={setSelectedProject} />
    </Motion.div>
  )
}

function ProjectsPage({ scrollTop }) {
  return (
    <Motion.div
      key="projects-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="-mx-4 -mt-6 bg-[#141414] px-4 pb-6 pt-6 sm:-mx-8 sm:px-8"
    >
      <NetflixProjectsView scrollTop={scrollTop} />
    </Motion.div>
  )
}

function InteractiveFinale({ onOpenProjects }) {
  return (
    <section
      data-story="cta"
      className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 text-center sm:px-10"
    >
      <div className="absolute inset-0">
        <img
          src="/about/IMG_0268.jpeg"
          alt=""
          aria-hidden="true"
          className="h-full w-full object-cover"
        />
      </div>

      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,#070707_0%,transparent_20%,transparent_76%,#070707_100%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,transparent_36%,rgba(3,3,10,0.62))]" />

      <span aria-hidden="true" className="pointer-events-none absolute left-[16%] top-[26%] h-40 w-40 rounded-full bg-cyan-300/20 blur-3xl" />
      <span aria-hidden="true" className="pointer-events-none absolute bottom-[20%] right-[18%] h-52 w-52 rounded-full bg-indigo-400/20 blur-3xl" />

      <div className="relative z-10">
        <p className="text-[11px] font-medium uppercase tracking-[0.34em] text-white/65">Next</p>
        <h3 className="mt-6 text-5xl font-semibold tracking-[-0.03em] text-white drop-shadow-[0_6px_34px_rgba(0,0,0,0.65)] sm:text-7xl">
          View My Work
        </h3>
        <p className="mx-auto mt-5 max-w-md text-sm leading-relaxed text-white/72 sm:text-base">
          A collection of things I&apos;ve designed, engineered, and shipped.
        </p>
        <div className="mt-10 inline-block">
          <button
            type="button"
            onClick={onOpenProjects}
            className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full border border-white/30 bg-white/10 px-9 py-3.5 text-sm font-semibold text-white backdrop-blur-md transition hover:scale-[1.06] hover:bg-white hover:text-black sm:text-base"
          >
            <span className="pointer-events-none absolute inset-0 rounded-full bg-[radial-gradient(circle_at_center,rgba(96,165,250,0.55),transparent_70%)] opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-100" />
            <span className="relative">Explore Projects</span>
            <ArrowUpRight size={18} className="relative transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </button>
        </div>
      </div>
    </section>
  )
}

function AboutArtistPage({ onOpenProjects }) {
  const [selectedExperience, setSelectedExperience] = useState(null)

  return (
    <div className="-mx-4 bg-[#070707] text-white sm:-mx-8">
      <div className="bg-[#070707]">
        {/* One continuous photo flows from Welcome (sky + skyline) into Experience (looking at the city) */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0">
            <img
              src="/about/IMG_4201.jpeg"
              alt=""
              aria-hidden="true"
              className="h-full w-full object-cover object-center"
              style={{ transform: 'scaleX(-1)' }}
            />
            {/* Vertical framing: dark under the header, clear/bright through the middle (the glowing skyline is the seam between the two sections), fading into the finale */}
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(5,5,7,0.85)_0%,rgba(5,5,7,0.18)_12%,transparent_30%,transparent_58%,rgba(5,5,7,0.4)_82%,#070707_100%)]" />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_22%_14%,rgba(168,130,255,0.16),transparent_42%),radial-gradient(circle_at_82%_80%,rgba(56,130,246,0.16),transparent_46%)]" />
          </div>

          <section data-story="intro" className="relative">
            <div className="relative flex min-h-[92vh] items-center px-6 sm:px-10">
              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(5,5,7,0.78),rgba(5,5,7,0.34)_48%,transparent_82%)]" />
              <div className="relative mx-auto grid w-full max-w-6xl items-center gap-8 lg:grid-cols-[300px_1fr]">
                <div className="mx-auto w-full max-w-[300px]">
                  <div className="overflow-hidden rounded-[24px] border border-white/20 bg-white/5 p-2 backdrop-blur-sm">
                    <img
                      src="/about/IMG_0718.jpg"
                      alt="Sai portrait"
                      className="aspect-[4/5] w-full rounded-[18px] object-cover"
                      loading="lazy"
                    />
                  </div>
                </div>

                <div>
                  <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-white/60">Welcome.</p>
                  <h1 className="mt-5 text-5xl font-semibold tracking-[-0.04em] text-white sm:text-7xl lg:text-8xl">Saillesh</h1>
                  <p className="mt-4 text-sm font-medium uppercase tracking-[0.18em] text-white/70 sm:text-base">
                    Honors Physics  · University of Waterloo
                  </p>
                  <p className="mt-5 max-w-3xl text-base leading-relaxed tracking-[0.02em] text-white/74 sm:text-xl">
                    I design and deliver production-ready software across DevOps, data, and full-stack engineering, combining analytical rigor with execution speed to build secure, scalable systems that create measurable business impact.
                  </p>
                </div>
              </div>

              <div className="absolute bottom-7 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-white/50">
                <span className="text-[10px] font-medium uppercase tracking-[0.3em]">Scroll</span>
                <ChevronDown size={20} />
              </div>
            </div>
          </section>

          <section data-story="experience" className="relative">
            <div className="relative flex min-h-[100vh] flex-col justify-center px-6 py-20 sm:px-10">
              {/* Left scrim keeps the text legible while the right of the frame — me looking at the skyline — stays visible */}
              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(5,5,7,0.92),rgba(5,5,7,0.55)_44%,transparent_80%)]" />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-[linear-gradient(to_top,#070707,transparent)]" />
              <div className="relative mx-auto w-full max-w-6xl">
                <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-white/55">Experience</p>

                <div className="mt-8 grid gap-10 lg:grid-cols-[1.05fr_0.95fr]">
                  <div>
                    <h4 className="text-3xl font-semibold tracking-[-0.02em] text-white sm:text-4xl">Biography</h4>
                    <p className="mt-6 max-w-xl text-base leading-relaxed text-white/82 sm:text-[1.08rem]">
                      Saillesh is an Honors Physics student at the University of Waterloo and a software engineer focused on high-impact execution.
                      He combines analytical rigor with product-minded engineering to build systems that are reliable, scalable, and measurable in real business environments.
                    </p>
                    <p className="mt-5 max-w-xl text-base leading-relaxed text-white/82 sm:text-[1.08rem]">
                      Across DevOps, automation, and analytics, he has strengthened CI/CD quality and security controls at scale, shipped anomaly detection pipelines,
                      and delivered data-driven tooling that improves delivery speed, operational resilience, and decision quality.
                    </p>
                    <p className="mt-6 text-xs font-semibold uppercase tracking-[0.2em] text-white/62">Core Focus</p>
                    <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/74 sm:text-base">
                      Platform engineering, CI/CD reliability, cloud infrastructure, software development, and optimization through data.
                    </p>
                  </div>

                  <div aria-hidden="true" className="hidden lg:block lg:col-start-2" />
                </div>

                <div className="relative mt-12">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/55">Where I&apos;ve Worked</p>
                    <p className="hidden text-[11px] text-white/40 sm:block">Tap a role for details</p>
                  </div>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {experienceEntries.map((entry) => (
                      <button
                        key={entry.id}
                        type="button"
                        onClick={() => setSelectedExperience(entry)}
                        className="group relative overflow-hidden rounded-2xl border border-white/12 bg-black/40 p-4 text-left backdrop-blur-md transition-colors hover:border-white/30"
                      >
                        <span
                          className="pointer-events-none absolute -right-8 -top-8 h-20 w-20 rounded-full opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-70"
                          style={{ backgroundColor: entry.accent }}
                        />
                        <div className="relative flex items-center gap-3">
                          <div className="h-11 w-11 shrink-0 overflow-hidden rounded-xl border border-white/15">
                            <ExperienceAlbumCover logo={entry.logo} org={entry.org} />
                          </div>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-white">{entry.role}</p>
                            <p className="truncate text-xs text-white/55">{entry.org}</p>
                          </div>
                          <ArrowUpRight
                            size={18}
                            className="ml-auto shrink-0 text-white/35 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white"
                          />
                        </div>
                        <p className="relative mt-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/45">{entry.period}</p>
                        <p className="relative mt-2 line-clamp-2 text-xs leading-relaxed text-white/60">{entry.description}</p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        <InteractiveFinale onOpenProjects={onOpenProjects} />
      </div>

      <ExperienceModal experience={selectedExperience} onClose={() => setSelectedExperience(null)} />
    </div>
  )
}

function CombinedAboutJourneyPage({ onOpenProjects }) {
  return <AboutArtistPage onOpenProjects={onOpenProjects} />
}


function AppLayout() {
  const [activePill, setActivePill] = useState('About Me')
  const [activePage, setActivePage] = useState('about')
  const [pageDirection, setPageDirection] = useState(1)
  const scrollTop = useMotionValue(0)

  const scrollContainerRef = useRef(null)

  const handleScroll = (event) => {
    scrollTop.set(event.currentTarget.scrollTop)
  }

  const handlePillClick = (pill) => {
    const nextPage = pill === 'Projects' ? 'projects' : 'about'
    if (nextPage === activePage) return

    setPageDirection(nextPage === 'projects' ? 1 : -1)

    if (pill === 'About Me') {
      setActivePill('About Me')
      setActivePage('about')
      scrollContainerRef.current?.scrollTo({ top: 0, behavior: 'auto' })
      return
    }

    if (pill === 'Projects') {
      setActivePill('Projects')
      setActivePage('projects')
      scrollContainerRef.current?.scrollTo({ top: 0, behavior: 'auto' })
      return
    }
  }

  const handleViewMyWorkTransition = () => {
    if (activePage === 'projects') return

    setPageDirection(1)
    setActivePill('Projects')
    setActivePage('projects')
    scrollContainerRef.current?.scrollTo({ top: 0, behavior: 'auto' })
  }

  const pageTransitionVariants = {
    enter: (direction) => ({
      x: direction === 0 ? 0 : direction > 0 ? '16%' : '-16%',
      opacity: 0.6,
      filter: 'blur(2px)',
    }),
    center: {
      x: 0,
      opacity: 1,
      filter: 'blur(0px)',
    },
    exit: (direction) => ({
      x: direction === 0 ? 0 : direction > 0 ? '-16%' : '16%',
      opacity: 0.55,
      filter: 'blur(2px)',
    }),
  }

  return (
    <Motion.div
      key="home"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -24 }}
      transition={{ duration: 0.65, ease: 'easeOut' }}
      className="min-h-screen bg-[var(--bg)]"
    >
      <div className="grid min-h-screen grid-cols-1">
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          style={{ backgroundColor: activePage === 'projects' ? '#141414' : '#121212', scrollBehavior: 'smooth' }}
          className="relative h-screen overflow-y-auto transition-colors duration-300"
        >
          <Motion.header
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="sticky top-0 z-30 border-b border-white/10 bg-[rgba(18,18,18,0.75)] px-4 py-3 backdrop-blur-xl sm:px-8"
          >
            <div className="mx-auto flex w-full max-w-screen-2xl items-center justify-between gap-3">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/65">Sai Portfolio</p>
              <div className="relative inline-flex items-center rounded-full bg-white/5 p-1">
                <Motion.div
                  layout
                  layoutId="switch-background"
                  className="absolute inset-y-1 left-1 right-1/2 rounded-full"
                  animate={{
                    x: activePage === 'projects' ? '100%' : 0,
                    backgroundColor: activePage === 'about' ? '#3B82F6' : '#F59E0B',
                  }}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
                <button
                  type="button"
                  onClick={() => handlePillClick('About Me')}
                  className={`relative z-10 rounded-full px-4 py-1.5 text-xs font-semibold transition sm:text-sm ${
                    activePage === 'about'
                      ? 'text-white'
                      : 'text-white/80 hover:text-white'
                  }`}
                >
                  About Me
                </button>
                <button
                  type="button"
                  onClick={() => handlePillClick('Projects')}
                  className={`relative z-10 rounded-full px-4 py-1.5 text-xs font-semibold transition sm:text-sm ${
                    activePage === 'projects'
                      ? 'text-white'
                      : 'text-white/80 hover:text-white'
                  }`}
                >
                  Projects
                </button>
              </div>
            </div>
          </Motion.header>

          <Motion.main
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="px-4 pb-16 pt-4 sm:px-8"
          >
            <AnimatePresence mode="wait" initial={false} custom={pageDirection}>
              <Motion.div
                key={activePage}
                custom={pageDirection}
                variants={pageTransitionVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: pageDirection === 0 ? 0.3 : 0.42, ease: [0.22, 1, 0.36, 1] }}
                className="will-change-transform"
              >
                {activePage === 'projects' ? (
                  <ProjectsPage
                    key="projects-screen"
                    scrollTop={scrollTop}
                  />
                ) : (
                  <CombinedAboutJourneyPage
                    onOpenProjects={handleViewMyWorkTransition}
                  />
                )}
              </Motion.div>
            </AnimatePresence>
          </Motion.main>
        </div>
      </div>
    </Motion.div>
  )
}

function App() {
  useEffect(() => {
    document.documentElement.style.background = '#121212'
  }, [])

  return (
    <AppErrorBoundary>
      <AppLayout />
    </AppErrorBoundary>
  )
}

export default App
