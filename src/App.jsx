import React, { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
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
  Linkedin,
  MoreHorizontal,
  Play,
  Plus,
  Shuffle,
  ThumbsUp,
  Wrench,
  X,
} from 'lucide-react'

const Motion = motion
const navPills = ['About Me', 'Projects']

const techTags = [
  { name: 'Linux (Ubuntu/RHEL)', url: 'https://ubuntu.com/server/docs', color: '#4B5563' },
  { name: 'GitLab CI/CD', url: 'https://docs.gitlab.com/ee/ci/', color: '#F97316' },
  { name: 'Jenkins', url: 'https://www.jenkins.io/doc/', color: '#B91C1C' },
  { name: 'Docker', url: 'https://docs.docker.com/', color: '#0EA5E9' },
  { name: 'Kubernetes', url: 'https://kubernetes.io/docs/home/', color: '#2563EB' },
  { name: 'Helm', url: 'https://helm.sh/docs/', color: '#0EA5E9' },
  { name: 'ArgoCD', url: 'https://argo-cd.readthedocs.io/en/stable/', color: '#2563EB' },
  { name: 'Terraform', url: 'https://developer.hashicorp.com/terraform/docs', color: '#7C3AED' },
  { name: 'Ansible', url: 'https://docs.ansible.com/', color: '#374151' },
  { name: 'AWS (EC2, S3, Lambda, ECS, CloudWatch)', url: 'https://docs.aws.amazon.com/', color: '#B45309' },
  { name: 'Azure (AKS)', url: 'https://learn.microsoft.com/en-us/azure/aks/', color: '#0284C7' },
  { name: 'Prometheus', url: 'https://prometheus.io/docs/introduction/overview/', color: '#F97316' },
  { name: 'Grafana', url: 'https://grafana.com/docs/grafana/latest/', color: '#F59E0B' },
  { name: 'ELK Stack', url: 'https://www.elastic.co/docs', color: '#0F766E' },
  { name: 'GitOps', url: 'https://opengitops.dev/', color: '#334155' },
  { name: 'C++', url: 'https://en.cppreference.com/w/', color: '#1D4ED8' },
  { name: 'Python', url: 'https://docs.python.org/3/', color: '#1E3A8A' },
  { name: 'PyTorch', url: 'https://pytorch.org/docs/stable/index.html', color: '#9A3412' },
  { name: 'scikit-learn', url: 'https://scikit-learn.org/stable/documentation.html', color: '#0C4A6E' },
  { name: 'HuggingFace', url: 'https://huggingface.co/docs', color: '#A16207' },
  { name: 'MLflow', url: 'https://mlflow.org/docs/latest/index.html', color: '#1D4ED8' },
  { name: 'TorchServe', url: 'https://pytorch.org/serve/', color: '#7C2D12' },
  { name: 'FastAPI', url: 'https://fastapi.tiangolo.com/', color: '#065F46' },
  { name: 'MediaPipe', url: 'https://ai.google.dev/edge/mediapipe', color: '#155E75' },
  { name: 'OpenCV', url: 'https://docs.opencv.org/', color: '#0F766E' },
  { name: 'SQL', url: 'https://www.postgresql.org/docs/', color: '#0369A1' },
  { name: 'Bash', url: 'https://www.gnu.org/software/bash/manual/', color: '#14532D' },
  { name: 'PowerShell', url: 'https://learn.microsoft.com/en-us/powershell/', color: '#075985' },
  { name: 'JavaScript', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript', color: '#854D0E' },
  { name: 'Scala', url: 'https://docs.scala-lang.org/', color: '#991B1B' },
  { name: 'Ruby', url: 'https://www.ruby-lang.org/en/documentation/', color: '#BE123C' },
  { name: 'Java', url: 'https://docs.oracle.com/en/java/', color: '#92400E' },
]

const contactData = {
  email: 's5somasu@uwaterloo.ca',
  linkedin: 'https://www.linkedin.com/in/sailleshsomasundaram/',
}

const experienceEntries = [
  {
    id: 'symcor-devops',
    role: 'DevOps Engineer',
    org: 'Symcor Inc',
    logo: '/logos/symcor.png',
    accent: '#0072ce',
    companyUrl: 'https://www.symcor.ca/',
    companyAbout: 'Symcor builds secure technology and operations for highly regulated industries.',
    period: 'Sep 2025 - Present',
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
    id: 4,
    title: 'Care_Loop',
    description: 'Utility-oriented project for human-centered workflows and reliable execution.',
    teaser: 'Human-centered utility solution.',
    image: '/project/careloop_intro.png',
    tags: ['React', 'Node.js', 'Python', 'Java'],
    github: 'https://github.com/aarya127/CareLoop',
    liveUrl: '',
    category: ['Web & Frontend', 'Tools & Utilities', 'Trending in My World'],
    year: 2024,
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
    title: 'Interactive-Hand-Gesture-Recognition',
    description: 'Real-time hand gesture recognition with computer vision.',
    teaser: 'Computer vision interaction.',
    image: null,
    tags: ['Python', 'FastAPI', 'OpenCV'],
    github: 'https://github.com/ssaillesh/Interactive-Hand-Gesture-Recognition',
    liveUrl: '',
    category: ['Trending in My World', 'Web & Frontend'],
    year: 2024,
    status: 'Completed',
    featured: true,
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
]

const projectRows = ['Trending in My World', 'Web & Frontend', 'Tools & Utilities', 'Coming Soon']

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
    <div className={`flex h-full w-full items-center justify-center bg-gradient-to-br ${getProjectGradient(project)} p-4`}>
      <div className="text-center">
        <p className="text-lg font-bold text-white drop-shadow-sm">{project.title}</p>
        <p className="mt-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/80">{project.tags.join(' • ')}</p>
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

function ProjectCard({ project, index, count, onOpenModal }) {
  return (
    <Motion.article
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: index * 0.04 }}
      className="group overflow-hidden rounded-xl border border-white/10 bg-[#191919] shadow-lg transition hover:-translate-y-1 hover:border-white/25"
    >
      <div className="aspect-video w-full">
        <ProjectCover project={project} />
      </div>
      <div className="space-y-3 p-4">
        <h4 className="line-clamp-2 text-base font-semibold text-white">{project.title}</h4>
        <p className="line-clamp-2 text-xs leading-relaxed text-[#bcbcbc]">{project.teaser || project.description}</p>
        <div className="flex items-center gap-2 pt-1">
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-md bg-white px-3 py-1.5 text-xs font-semibold text-black"
            onClick={() => window.open(project.liveUrl || project.github, '_blank', 'noreferrer')}
          >
            <Play size={12} fill="currentColor" />
            View
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-md border border-white/30 px-3 py-1.5 text-xs font-semibold text-white"
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

function ProjectRow({ title, projects, onOpenModal, delay }) {
  return (
    <Motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay }}
      className="relative"
    >
      <div className="mb-3 flex items-center justify-between gap-3">
        <h3 className="text-base font-semibold text-white sm:text-lg">{title}</h3>
        <p className="text-xs text-[#9f9f9f]">Showing {projects.length}</p>
      </div>

      {projects.length === 0 ? (
        <div className="rounded-xl border border-dashed border-white/15 bg-[#171717] p-5 text-sm text-[#a3a3a3]">
          Projects for this section are coming soon.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {projects.map((project, index) => (
            <ProjectCard
              key={`${title}-${project.id}`}
              project={project}
              index={index}
              count={projects.length}
              onOpenModal={onOpenModal}
            />
          ))}
        </div>
      )}
    </Motion.section>
  )
}

function ProjectModal({ project, onClose, onOpenModal }) {
  if (!project) {
    return null
  }

  const related = projectCatalog.filter((item) => item.id !== project.id).slice(0, 4)

  return (
    <AnimatePresence>
      {(
        <Motion.div
          className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-black/75 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          onClick={onClose}
        >
          <Motion.div
            className="w-full max-w-4xl overflow-hidden rounded-xl bg-[#181818] shadow-[0_25px_80px_rgba(0,0,0,0.65)]"
            initial={{ opacity: 0, scale: 0.95, y: 26 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 20 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="relative aspect-video">
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

            <div className="grid gap-8 p-6 md:grid-cols-[1.5fr_1fr]">
              <div>
                <div className="mb-3 flex flex-wrap items-center gap-2 text-xs text-[#bcbcbc]">
                  <span className="rounded-full bg-[#333333] px-2 py-1 text-white">{project.featured ? 'Top Project' : 'Featured'}</span>
                  <span>{project.year}</span>
                  <span>{project.duration}</span>
                  <span className="rounded-md border border-white/20 px-2 py-0.5">{project.complexity}</span>
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
  const heroScale = 1 + Math.min(scrollTop * 0.00012, 0.03)

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
          <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-[#bcbcbc]">
            <span className="rounded-full bg-emerald-500/20 px-2.5 py-1 font-semibold text-emerald-300">Featured Project</span>
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

      <div className="space-y-8">
        <ProjectRow
          title="All Projects"
          projects={listedProjects}
          delay={0.05}
          onOpenModal={setSelectedProject}
        />
      </div>

      <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} onOpenModal={setSelectedProject} />
      {/* TODO: Replace image URLs with your actual project screenshots */}
      {/* TODO: Populate real projects data */}
    </Motion.div>
  )
}

function ProjectsPage({ scrollTop }) {
  return (
    <Motion.div
      key="projects-page"
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="-mx-4 -mt-6 bg-[#141414] px-4 pb-6 pt-6 sm:-mx-8 sm:px-8"
    >
      <NetflixProjectsView scrollTop={scrollTop} />
    </Motion.div>
  )
}

function AboutArtistPage({ onOpenProjects }) {
  const sectionRefs = useRef([])
  const [visibleSections, setVisibleSections] = useState({})

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        setVisibleSections((prev) => {
          const next = { ...prev }
          for (const entry of entries) {
            const key = entry.target.getAttribute('data-story')
            if (!key) continue
            next[key] = entry.isIntersecting && entry.intersectionRatio > 0.3
          }
          return next
        })
      },
      { threshold: [0.2, 0.35, 0.55], rootMargin: '-10% 0px -10% 0px' },
    )

    const nodes = sectionRefs.current.filter(Boolean)
    nodes.forEach((node) => observer.observe(node))

    return () => observer.disconnect()
  }, [])

  const isVisible = (id) => Boolean(visibleSections[id])
  const skillPyramidRows = [
    techTags.slice(0, 4),
    techTags.slice(4, 9),
    techTags.slice(9, 15),
    techTags.slice(15),
  ]
  const skillPyramidWidths = ['max-w-lg', 'max-w-2xl', 'max-w-4xl', 'max-w-5xl']

  return (
    <Motion.div
      key="about-artist"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="-mx-4 bg-[#090909] text-white sm:-mx-8"
    >
      <div className="scroll-smooth bg-[#090909]">
        <section
          ref={(node) => {
            sectionRefs.current[0] = node
          }}
          data-story="intro"
          className="relative min-h-[120vh]"
        >
          <div className="sticky top-16 flex h-[calc(100vh-64px)] items-center overflow-hidden px-6 sm:px-10">
            <img
              src="/about/IMG_6712.jpeg"
              alt=""
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-30"
            />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_24%_18%,rgba(192,132,252,0.24),transparent_40%),radial-gradient(circle_at_78%_80%,rgba(251,191,36,0.18),transparent_44%),linear-gradient(180deg,rgba(5,5,5,0.62),rgba(5,5,5,0.9))]" />
            <div className="relative mx-auto grid w-full max-w-6xl items-center gap-8 lg:grid-cols-[300px_1fr]">
              <Motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isVisible('intro') ? { opacity: 1, y: 0 } : { opacity: 0.12, y: 14 }}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                className="mx-auto w-full max-w-[300px] overflow-hidden rounded-[24px] border border-white/20 bg-white/5 p-2 backdrop-blur-sm"
              >
                <img src="/about/IMG_0146.jpg" alt="Sai portrait" className="aspect-[4/5] w-full rounded-[18px] object-cover" />
              </Motion.div>

              <Motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={isVisible('intro') ? { opacity: 1, y: 0 } : { opacity: 0.12, y: 16 }}
                transition={{ duration: 1, delay: 0.06, ease: [0.22, 1, 0.36, 1] }}
              >
                <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-white/60">Welcome.</p>
                <h1 className="mt-5 text-5xl font-semibold tracking-[-0.04em] text-white sm:text-7xl lg:text-8xl">Saillesh</h1>
                <p className="mt-4 text-sm font-medium uppercase tracking-[0.18em] text-white/70 sm:text-base">
                  Honors Physics  · University of Waterloo
                </p>
                <p className="mt-5 max-w-3xl text-base leading-relaxed tracking-[0.02em] text-white/74 sm:text-xl">
                  I design and deliver production-ready software across DevOps, data, and full-stack engineering, combining analytical rigor with execution speed to build secure, scalable systems that create measurable business impact.
                </p>
              </Motion.div>
            </div>
          </div>
        </section>

        <section
          ref={(node) => {
            sectionRefs.current[1] = node
          }}
          data-story="skills"
          className="relative min-h-[120vh]"
        >
          <div className="sticky top-16 flex h-[calc(100vh-64px)] items-center overflow-hidden px-6 sm:px-10">
            <img
              src="/about/IMG_9368.jpeg"
              alt=""
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-18"
            />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(192,132,252,0.2),transparent_35%),radial-gradient(circle_at_80%_76%,rgba(45,212,191,0.16),transparent_40%),linear-gradient(180deg,rgba(9,9,9,0.86),rgba(9,9,9,0.96))]" />
            <div className="relative mx-auto w-full max-w-6xl">
              <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-white/55">Skills</p>
              <h3 className="mt-5 text-4xl font-semibold tracking-[-0.03em] text-white sm:text-6xl">Tech Stack</h3>
              <p className="mt-3 max-w-2xl text-sm text-white/65 sm:text-base"></p>

              <div className="relative mt-10">
                <div className="pointer-events-none absolute -left-12 top-2 h-24 w-24 rounded-full bg-cyan-400/20 blur-3xl" />
                <div className="pointer-events-none absolute -right-8 bottom-1 h-28 w-28 rounded-full bg-fuchsia-400/15 blur-3xl" />
                <div className="relative space-y-4 sm:space-y-5">
                  {skillPyramidRows.map((row, rowIndex) => (
                    <div key={`pyramid-row-${rowIndex}`} className={`mx-auto w-full ${skillPyramidWidths[rowIndex]} flex flex-wrap justify-center gap-3 sm:gap-4`}>
                      {row.map((tag) => (
                        <a
                          key={tag.name}
                          href={tag.url}
                          target="_blank"
                          rel="noreferrer"
                          className="group relative inline-flex items-center rounded-full border px-4 py-2 text-xs font-semibold tracking-[0.02em] text-white transition duration-300 hover:-translate-y-1 hover:scale-[1.03] sm:text-sm"
                          style={{
                            backgroundColor: `${tag.color}33`,
                            borderColor: `${tag.color}B3`,
                          }}
                          aria-label={`Open docs for ${tag.name}`}
                        >
                          <span
                            className="pointer-events-none absolute -inset-1 rounded-full opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-100"
                            style={{ backgroundColor: `${tag.color}77` }}
                          />
                          <span
                            className="pointer-events-none absolute inset-0 rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                            style={{ boxShadow: `0 0 0 1px ${tag.color}, 0 0 20px ${tag.color}AA, 0 0 34px ${tag.color}88` }}
                          />
                          <span className="relative">{tag.name}</span>
                        </a>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          ref={(node) => {
            sectionRefs.current[2] = node
          }}
          data-story="experience"
          className="relative min-h-[145vh]"
        >
          <div className="sticky top-16 flex min-h-[calc(100vh-64px)] items-center px-6 py-10 sm:px-10 sm:py-12">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_14%_22%,rgba(45,212,191,0.14),transparent_34%),radial-gradient(circle_at_88%_70%,rgba(59,130,246,0.16),transparent_40%),linear-gradient(180deg,rgba(9,9,9,0.9),rgba(9,9,9,0.98))]" />
            <div className="relative mx-auto w-full max-w-6xl">
              <Motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={isVisible('experience') ? { opacity: 1, y: 0 } : { opacity: 0.08, y: 14 }}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              >
                <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-white/55">Experience</p>
                <h3 className="mt-5 text-4xl font-semibold tracking-[-0.03em] text-white sm:text-6xl">What I&apos;ve Done</h3>
              </Motion.div>

              <Motion.article
                initial={{ opacity: 0, y: 24 }}
                animate={isVisible('experience') ? { opacity: 1, y: 0 } : { opacity: 0.08, y: 14 }}
                transition={{ duration: 0.85, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
                className="mt-8 overflow-hidden rounded-3xl border border-white/15 bg-[linear-gradient(110deg,rgba(17,24,39,0.84),rgba(8,47,73,0.55))] p-6 backdrop-blur-sm sm:p-8"
              >
                <div className="pointer-events-none absolute -right-16 -top-16 h-52 w-52 rounded-full bg-cyan-400/15 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-20 left-10 h-56 w-56 rounded-full bg-indigo-400/15 blur-3xl" />
                <div className="relative grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
                  <div>
                    <h4 className="text-3xl font-semibold tracking-[-0.02em] text-white sm:text-4xl">Biography</h4>
                    <p className="mt-6 text-base leading-relaxed text-white/78 sm:text-[1.08rem]">
                      Saillesh is an Honors Physics student at the University of Waterloo and a software engineer focused on high-impact execution.
                      He combines analytical rigor with product-minded engineering to build systems that are reliable, scalable, and measurable in real business environments.
                    </p>
                    <p className="mt-5 text-base leading-relaxed text-white/78 sm:text-[1.08rem]">
                      Across DevOps, automation, and analytics, he has strengthened CI/CD quality and security controls at scale, shipped anomaly detection pipelines,
                      and delivered data-driven tooling that improves delivery speed, operational resilience, and decision quality.
                    </p>
                    <p className="mt-6 text-xs font-semibold uppercase tracking-[0.2em] text-white/62">Core Focus</p>
                    <p className="mt-2 text-sm leading-relaxed text-white/74 sm:text-base">
                      Platform engineering, CI/CD reliability, cloud infrastructure, software development, and optimization through data.
                    </p>
                  </div>

                  <div className="space-y-3">
                    {experienceEntries.map((entry, index) => (
                      <Motion.div
                        key={entry.id}
                        initial={{ opacity: 0, x: 16 }}
                        animate={isVisible('experience') ? { opacity: 1, x: 0 } : { opacity: 0.12, x: 10 }}
                        transition={{ duration: 0.5, delay: 0.1 + index * 0.08, ease: [0.22, 1, 0.36, 1] }}
                        className="rounded-2xl border border-white/15 bg-black/20 p-4"
                      >
                        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/55">{entry.period}</p>
                        <p className="mt-1 text-sm font-semibold text-white sm:text-base">{entry.role} · {entry.org}</p>
                      </Motion.div>
                    ))}
                  </div>
                </div>
              </Motion.article>
            </div>
          </div>
        </section>

        <section
          ref={(node) => {
            sectionRefs.current[3] = node
          }}
          data-story="cta"
          className="relative min-h-[120vh]"
        >
          <div className="sticky top-16 flex h-[calc(100vh-64px)] items-center justify-center overflow-hidden px-6 text-center sm:px-10">
            <img
              src="/about/IMG_0146.jpg"
              alt=""
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-14"
            />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(59,130,246,0.17),transparent_36%),linear-gradient(180deg,rgba(9,9,9,0.84),rgba(9,9,9,0.98))]" />
            <Motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={isVisible('cta') ? { opacity: 1, y: 0 } : { opacity: 0.08, y: 16 }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="relative"
            >
              <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-white/60">Next</p>
              <h3 className="mt-6 text-4xl font-semibold tracking-[-0.03em] text-white sm:text-6xl">View My Work</h3>
              <button
                type="button"
                onClick={onOpenProjects}
                className="mt-10 rounded-full border border-white/30 bg-white/10 px-8 py-3 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white hover:text-black sm:text-base"
              >
                View My Work
              </button>
            </Motion.div>
          </div>
        </section>
      </div>
    </Motion.div>
  )
}

function CombinedAboutJourneyPage({ onOpenProjects }) {
  return <AboutArtistPage onOpenProjects={onOpenProjects} />
}



function AppLayout() {
  const [activePill, setActivePill] = useState('About Me')
  const [activePage, setActivePage] = useState('about')
  const [transitioning, setTransitioning] = useState(false)
  const [scrollTop, setScrollTop] = useState(0)

  const scrollContainerRef = useRef(null)
  const scrollRAFRef = useRef(null)

  const handleScroll = (event) => {
    if (scrollRAFRef.current) {
      cancelAnimationFrame(scrollRAFRef.current)
    }
    scrollRAFRef.current = requestAnimationFrame(() => {
      setScrollTop(event.currentTarget.scrollTop)
    })
  }

  const handlePillClick = (pill) => {
    setTransitioning(true)

    if (pill === 'About Me') {
      setActivePill('About Me')
      setActivePage('about')
      scrollContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
      setTimeout(() => setTransitioning(false), 400)
      return
    }

    if (pill === 'Projects') {
      setActivePill('Projects')
      setActivePage('projects')
      scrollContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
      setTimeout(() => setTransitioning(false), 400)
      return
    }

    setTransitioning(false)
  }

  return (
    <Motion.div
      key="home"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -24 }}
      transition={{ duration: 0.65, ease: 'easeOut' }}
      className="min-h-screen bg-[var(--bg)] pb-20"
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
                  className="absolute inset-y-1 left-1 right-1/2 rounded-full bg-white"
                  animate={{ x: activePage === 'projects' ? '100%' : 0 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
                <button
                  type="button"
                  onClick={() => handlePillClick('About Me')}
                  className={`relative z-10 rounded-full px-4 py-1.5 text-xs font-semibold transition sm:text-sm ${
                    activePage === 'about'
                      ? 'text-black'
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
                      ? 'text-black'
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
            animate={{ opacity: transitioning ? 0.35 : 1, y: 0 }}
            transition={{ duration: 0.2, delay: 0.7 }}
            className="px-4 pb-16 pt-4 sm:px-8"
          >
            <AnimatePresence mode="wait">
              {activePage === 'projects' ? (
                <ProjectsPage
                  key="projects-screen"
                  scrollTop={scrollTop}
                />
              ) : activePage === 'about' ? (
                <Motion.div
                  key="about-screen"
                  initial={{ opacity: 0, y: 22 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                >
                  <CombinedAboutJourneyPage
                    onOpenProjects={() => handlePillClick('Projects')}
                  />
                </Motion.div>
              ) : null}
            </AnimatePresence>
          </Motion.main>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 border-t border-white/10 bg-[rgba(24,24,24,0.95)] px-4 py-3 backdrop-blur-md">
        <div className="mx-auto flex max-w-screen-2xl items-center justify-between text-xs text-[var(--text-secondary)] sm:text-sm">
          <div className="flex items-center gap-4">
            <a
              href={contactData.linkedin}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-md px-2 py-1 text-sm font-medium text-white hover:underline"
            >
              <Linkedin size={14} />
              <span className="hidden sm:inline">LinkedIn</span>
            </a>

            <a
              href="#" /* TODO: replace with your GitLab URL */
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-md px-2 py-1 text-sm font-medium text-white/90 hover:underline"
            >
              <ExternalLink size={14} />
              <span className="hidden sm:inline">GitLab</span>
            </a>

            <p className="ml-3">
              Now Playing:{' '}
              <span className="font-semibold text-white">Saillesh&apos;s Portfolio v1.0</span>
            </p>
          </div>

          <p>Bottom playbar coming soon</p>
        </div>
      </div>
      {/* TODO: Add bottom playbar section */}
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
