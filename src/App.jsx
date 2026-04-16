import React, { useEffect, useMemo, useRef, useState } from 'react'
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
const resumeUrl = '/resume/Saillesh_dev_resume.pdf'

const aboutData = {
  name: 'Saillesh Somasundaram',
  title: 'Physics Student · Software Engineer · Builder of Things',
  subtitle: '5+ Projects · 3 Years Coding · 1 Physics Degree in Progress',
  bio: [
    'Saillesh is a physics student with a deep passion for software engineering, drawn to the intersection of mathematical thinking and real-world problem-solving. He approaches his craft with the same intensity he brings to every challenge: focused, competitive, and relentlessly curious.',
    'With hands-on experience across DevOps, automation, analytics, and software engineering, he builds systems that are both practical and scalable. His work spans CI/CD hardening, anomaly detection pipelines, data-driven optimization, and interactive engineering tooling.',
    'When he is not building software or solving complex technical problems, he is training, swimming, travelling, and exploring ideas that connect science, design, and technology.',
  ],
  portraitPhoto: '/about/IMG_0146.jpg',
  stats: {
    projects: 8,
    languages: 5,
    countries: 10,
    yearsOfCoding: 3,
    physicsCourses: 14,
    coffee: 999,
  },
  whoIAm: [
    {
      id: 1,
      title: 'Passionate About My Craft',
      meta: 'Physics · Engineering',
      detail:
        'I approach work with intentional focus, from debugging distributed systems to refining user experience details. Craft matters to me, and I treat every project as an opportunity to improve both outcome and process.',
    },
    {
      id: 2,
      title: 'Physics Degree in Progress',
      meta: 'University',
      detail:
        'My physics training sharpens how I model systems, reason from first principles, and make structured decisions under complexity. It has become a core advantage in my engineering mindset.',
    },
    {
      id: 3,
      title: 'Software Engineering Enthusiast',
      meta: 'Full Stack · AI/ML',
      detail:
        'I enjoy building across the stack, from reliable backend automations to polished frontend interactions. I am especially interested in applied AI and practical developer tooling.',
    },
    {
      id: 4,
      title: 'Always Building Something',
      meta: 'Side Projects',
      detail:
        'I stay hands-on outside formal roles through side projects that explore new frameworks, data workflows, and interaction patterns. Building consistently helps me learn fast.',
    },
    {
      id: 5,
      title: 'Driven by Curiosity',
      meta: 'Research · Learning',
      detail:
        'Curiosity is my operating system. I actively test new ideas, compare approaches, and challenge assumptions so each project ships with better clarity and stronger fundamentals.',
    },
  ],
  inspirations: [
    { name: 'Richard Feynman', role: 'Physicist', reason: 'First-principles thinking and relentless curiosity.' },
    { name: 'Margaret Hamilton', role: 'Software Engineer', reason: 'Precision engineering under mission-critical constraints.' },
    { name: 'Roger Federer', role: 'Athlete', reason: 'Consistency, composure, and mastery over long horizons.' },
  ],
}

const aboutPhotoMoments = [
  {
    src: '/about/IMG_9654.jpeg',
    label: 'Exploring',
    caption: 'Exploring immersive spaces and turning everyday moments into creative energy.',
  },
  {
    src: '/about/IMG_0235.jpeg',
    label: 'Travelling',
    caption: 'Travelling keeps me curious and grounded; every city teaches me something new.',
  },
  {
    src: '/about/IMG_6712.jpeg',
    label: 'Night Adventures',
    caption: 'Late-night skyline sessions where ideas, ambition, and adventure collide.',
  },
  {
    src: '/about/IMG_0268.jpeg',
    label: 'Creating',
    caption: 'Creating with focus and intent, one project and one story at a time.',
  },
]

function InteractiveBanner() {
  const canvasRef = useRef(null)
  const animRef = useRef(null)
  const mouse = useRef({ x: null, y: null, down: false })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let width = 0
    let height = 0
    let dpr = window.devicePixelRatio || 1

    const particles = []
    const PARTICLE_COUNT = 60
    let pulseAmp = 0
    let lastTime = null

    function resize() {
      dpr = window.devicePixelRatio || 1
      width = canvas.clientWidth
      height = canvas.clientHeight
      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    function rand(min, max) {
      return Math.random() * (max - min) + min
    }

    function createParticles() {
      particles.length = 0
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push({
          x: rand(0, width),
          y: rand(0, height),
          vx: rand(-0.3, 0.3),
          vy: rand(-0.3, 0.3),
          r: rand(6, 28),
          hue: Math.floor(rand(160, 210)),
          alpha: rand(0.35, 0.9),
          phase: rand(0, Math.PI * 2),
        })
      }
    }

    function draw(time) {
      if (!lastTime) lastTime = time
      const dt = (time - lastTime) / 1000
      lastTime = time

      // decay pulse amplitude
      pulseAmp *= Math.max(0, 1 - dt * 0.8)

      ctx.clearRect(0, 0, width, height)
      // background pulse based on time and pulseAmp
      const base = 0.05 + Math.abs(Math.sin(time * 0.001)) * 0.02 + pulseAmp * 0.12
      const g = ctx.createLinearGradient(0, 0, width, height)
      g.addColorStop(0, `rgba(${10 + base * 60},${16 + base * 40},${32 + base * 40},1)`)
      g.addColorStop(1, `rgba(${6 + base * 20},${6 + base * 20},${18 + base * 20},1)`)
      ctx.fillStyle = g
      ctx.fillRect(0, 0, width, height)

      for (const p of particles) {
        // attraction to mouse
        if (mouse.current.x !== null) {
          const dx = mouse.current.x - p.x
          const dy = mouse.current.y - p.y
          const dist = Math.sqrt(dx * dx + dy * dy) || 1
          const max = 140
          if (dist < max) {
            const force = (1 - dist / max) * 0.9
            p.vx += (dx / dist) * force * 0.06
            p.vy += (dy / dist) * force * 0.06
            // amplify pulse when near mouse
            pulseAmp = Math.min(1.2, pulseAmp + (1 - dist / max) * 0.08)
          }
        }

        p.x += p.vx
        p.y += p.vy

        // friction
        p.vx *= 0.985
        p.vy *= 0.985

        // gentle oscillation (pulse)
        const pulse = 1 + Math.sin(time * 0.002 + p.phase) * 0.08 * (1 + pulseAmp)
        const radius = p.r * pulse

        // wrap
        if (p.x < -50) p.x = width + 50
        if (p.x > width + 50) p.x = -50
        if (p.y < -50) p.y = height + 50
        if (p.y > height + 50) p.y = -50

        // draw glow circle
        ctx.beginPath()
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, radius)
        grad.addColorStop(0, `hsla(${p.hue},80%,64%,${p.alpha})`)
        grad.addColorStop(0.2, `hsla(${p.hue},70%,48%,${p.alpha * 0.7})`)
        grad.addColorStop(1, 'rgba(6,10,18,0)')
        ctx.fillStyle = grad
        ctx.arc(p.x, p.y, radius, 0, Math.PI * 2)
        ctx.fill()
      }

      animRef.current = requestAnimationFrame(draw)
    }

    function onMove(e) {
      const rect = canvas.getBoundingClientRect()
      const clientX = e.touches ? e.touches[0].clientX : e.clientX
      const clientY = e.touches ? e.touches[0].clientY : e.clientY
      mouse.current.x = clientX - rect.left
      mouse.current.y = clientY - rect.top
    }

    function onLeave() {
      mouse.current.x = null
      mouse.current.y = null
    }

    function onClick(e) {
      const rect = canvas.getBoundingClientRect()
      const x = (e.clientX || (e.touches && e.touches[0].clientX)) - rect.left
      const y = (e.clientY || (e.touches && e.touches[0].clientY)) - rect.top
      // spawn a few particles burst
      for (let i = 0; i < 6; i++) {
        particles.push({
          x,
          y,
          vx: rand(-1.2, 1.2),
          vy: rand(-1.2, 1.2),
          r: rand(6, 18),
          hue: Math.floor(rand(160, 220)),
          alpha: rand(0.6, 1),
          phase: rand(0, Math.PI * 2),
        })
      }
      // create a larger pulse
      pulseAmp = Math.min(1.6, pulseAmp + 0.9)
    }

    resize()
    createParticles()
    window.addEventListener('resize', resize)
    canvas.addEventListener('mousemove', onMove)
    canvas.addEventListener('touchmove', onMove, { passive: true })
    canvas.addEventListener('mouseleave', onLeave)
    canvas.addEventListener('touchend', onLeave)
    canvas.addEventListener('click', onClick)
    canvas.addEventListener('touchstart', onClick)

    animRef.current = requestAnimationFrame(draw)

    return () => {
      window.removeEventListener('resize', resize)
      canvas.removeEventListener('mousemove', onMove)
      canvas.removeEventListener('touchmove', onMove)
      canvas.removeEventListener('mouseleave', onLeave)
      canvas.removeEventListener('touchend', onLeave)
      canvas.removeEventListener('click', onClick)
      canvas.removeEventListener('touchstart', onClick)
      if (animRef.current) cancelAnimationFrame(animRef.current)
    }
  }, [])

  return (
    <canvas ref={canvasRef} className="absolute inset-0 h-full w-full block" style={{ display: 'block' }} />
  )
}


const contactData = {
  headline: 'Let\'s Build Something.',
  subheading:
    "I love getting to know people, and I genuinely don't bite. Whether you want to talk code, physics, hockey, or just say hi, my inbox is always open.",
  email: 's5somasu@uwaterloo.ca',
  linkedin: 'https://www.linkedin.com/in/sailleshsomasundaram/', // TODO: Add LinkedIn URL
  status: 'Open to Opportunities',
  personalNote:
    "Seriously though, I love getting to know people. Whether you're a recruiter, a fellow student, a dev, or just someone who stumbled onto this page, reach out.",
}

const sideNav = [
  { icon: Wrench, label: 'Projects' },
]

const pinned = [
  { title: 'Resume.pdf', href: resumeUrl, subtitle: 'One-page profile snapshot' },
  { title: 'GitHub', href: 'https://github.com/ssaillesh', subtitle: 'Code, commits, experiments' },
  { title: 'LinkedIn', href: 'https://linkedin.com', subtitle: 'Professional timeline' },
]

const quickStats = [
  { title: 'Languages Known', value: 'Python, Java, JavaScript, SQL' },
  { title: 'Accomplishments', value: 'Presidential Scholarship, Certification of Excellence: Autonomous Robotics' },
  { title: 'Focus', value: 'Physics, software engineering, Quntitative modeling, and practical AI applications' },
]

const experienceEntries = [
  {
    id: 'symcor-devops',
    role: 'DevOps Engineer',
    org: 'Symcor Inc',
    logo: '/logos/symcor.png',
    accent: '#0072ce',
    companyUrl: 'https://www.symcor.ca/',
    companyAbout:
      'Symcor provides secure, scalable technology and operations solutions for highly regulated industries in Canada, including payments, fraud detection, open banking, document processing, and advisory services.',
    period: 'Sep 2025 - Present',
    highlights: [
      'Implemented CI/CD quality gates and secret scanning at merge time across 100+ repositories.',
      'Built GitLab Runner health telemetry and reduced CI brownouts and stalled jobs by 40%.',
      'Modernized Java pipelines with Maven + JaCoCo and expanded reusable Ansible automation.',
    ],
    stack: ['GitLab CI/CD', 'SonarQube', 'Bash', 'Ansible', 'Maven', 'JaCoCo'],
    description:
      'Hardened CI/CD across 100+ repositories by enforcing quality gates, secret scanning, and SonarQube reporting. Built GitLab Runner health telemetry that reduced pipeline brownouts and stalled jobs by 40%. Modernized Java workflows with Maven and JaCoCo integration while extending Ansible automation for reliable environment parity.',
  },
  {
    id: 'omniabio-qa',
    role: 'Quality Automation Engineer',
    org: 'OmniaBio',
    logo: '/logos/omniabio.png',
    accent: '#2b6cb0',
    companyUrl: 'https://omniabio.com/',
    companyAbout:
      'OmniaBio is a cell and gene therapy CDMO focused on AI-enabled development and GMP manufacturing, helping teams move from early-stage development to commercial-scale therapeutic production.',
    period: 'Aug 2024 - Dec 2024',
    highlights: [
      'Engineered Python anomaly detection for 8K+ pharmaceutical samples with SPC techniques.',
      'Automated validation and outlier checks to cut GMP inspection turnaround by 35%.',
      'Delivered 99.8% compliance while reducing manual QC review cycles by 60%.',
    ],
    stack: ['Python', 'Statistical Process Control', 'Data Validation', 'Automation'],
    description:
      'Engineered a Python-based anomaly detection system for 8K+ pharmaceutical samples using control charts and Z-score methods. Automated schema validation and outlier detection pipelines to accelerate GMP inspection turnaround by 35%. Maintained 99.8% compliance while significantly reducing manual QC review cycles.',
  },
  {
    id: 'pepsico-data',
    role: 'Data Analyst',
    org: 'PepsiCo Inc',
    logo: '/logos/pepsico.png',
    accent: '#003e7e',
    companyUrl: 'https://www.pepsico.com/',
    companyAbout:
      'PepsiCo is a global food and beverage company with a broad brand portfolio, focused on delivering products at scale while driving sustainability and long-term business resilience through PepsiCo Positive.',
    period: 'Jan 2023 - Apr 2024',
    highlights: [
      'Built optimized SQL aggregation layers for faster BI drill-down and reporting performance.',
      'Used regression and time-series analysis to identify process bottlenecks and labor inefficiency.',
      'Automated SLA-critical reporting for 500K+ users across 15 markets with 99.9% delivery.',
    ],
    stack: ['SQL', 'Power BI', 'Regression', 'Time-Series', 'Reporting Automation'],
    description:
      'Designed optimized SQL aggregation layers powering Power BI analytics and faster KPI drill-down performance. Applied regression and time-series analysis to uncover bottlenecks driving labor inefficiency. Automated mission-critical reporting with 99.9% SLA reliability for 500K+ internal users across 15 markets.',
  },
  {
    id: 'uwaft-swe',
    role: 'Software Engineer (Design Team)',
    org: 'UWAFT',
    logo: '/logos/uwaft.png',
    accent: '#2e8b57',
    companyUrl: 'https://avtcseries.org/',
    companyAbout:
      'AVTC (Advanced Vehicle Technology Competitions) is a North American collegiate automotive engineering program run with Argonne National Laboratory and the U.S. Department of Energy, building workforce-ready engineers through hands-on vehicle innovation challenges.',
    period: 'Sep 2022 - Jan 2023',
    highlights: [
      'Developed a React VR simulation front-end for autonomous vehicle validation workflows.',
      'Designed Ansible automation for inventories, host grouping, and service mapping.',
      'Added reliability observability with Prometheus and Grafana for pipeline health trends.',
    ],
    stack: ['React', 'Ansible', 'Prometheus', 'Grafana', 'Automation'],
    description:
      'Developed a React-based VR simulation front-end to support autonomous vehicle testing workflows. Designed Ansible automation for inventories, host grouping, and service mappings across environments. Instrumented reliability metrics with Prometheus and Grafana to surface recurring pipeline failure patterns.',
  },
]

const skillGroups = [
  {
    title: 'Full Stack',
    chips: [
      'React',
      'Tailwind CSS',
      'Framer Motion',
      'TypeScript',
      'Node.js',
      'Express',
      'Java Spring',
      'REST APIs',
    ],
  },
  { title: 'Tools', chips: ['Azure', 'Docker', 'Postman', 'Figma', "ELK Stack", 'Linux'] },
  { title: 'Languages (Within Skills)', chips: ['Python', 'Java', 'JavaScript', 'SQL'] },
]

const educationItems = [
  {
    id: 'uw-physics',
    title: 'Bachelor of Science in Honors Physics',
    provider: 'University of Waterloo',
    period: '2021 -  2026',
    badge: 'Bachelor of Science',
    color: 'from-yellow-500/35 via-black/25 to-black/70',
    logo: '',
    schoolHighlights: [
      'Recognized as one of North America\'s strongest physics-focused institutions.',
      'Elite co-op ecosystem connecting students with top engineering and research teams.',
      'Strong reputation in mathematical modeling, computing, and applied science.',
    ],
    degreeOverview:
      'This degree blends rigorous physics fundamentals with computational problem-solving. The program emphasizes analytical modeling, quantitative reasoning, and building intuition for complex real-world systems.',
    learningModules: [
      'Classical mechanics, electromagnetism, and thermodynamics',
      'Quantum physics, modern physics, and mathematical methods',
      'Computational physics, simulations, and scientific programming',
      'Signals, systems, and data-driven modeling techniques',
    ],
    classesTaken: [
      'MATH 237 - Calculus 3',
      'PHYS 233 - Quantum Mechanics',
      'PHYS 249 - Computational Physics and Linear Algebra',
      'PHYS 349 - Electricity and Magnetism',
      'AMATH/BIOL 382 - Computational Modeling',
      'AMATH 250 - Differential Equations',
    ],
    details:
      'Completed a Bachelor of Science in Honors Physics at the University of Waterloo, with strong focus on signals and systems, data structures, algorithms, computational physics, and computational modeling. Awarded Presidential Scholarship and Term Distinction.',
    link: 'https://uwaterloo.ca/',
  },
]



/// TODO: Add project categories and filter projects by those instead of just 'Trending in My World' for better organization and display control. For example, categories could be 'Web & Frontend', 'AI & Machine Learning', 'Tools & Utilities', etc., and each project can belong to one or more categories. Then we can create rows based on these categories instead of just 'Trending in My World'.
const projectCatalog = [
   {
    id: 1,
    title: 'ICT Displacement and Liquidity Sweep Detector',
    description:
      'A project focused on detecting and analyzing ICT displacement and liquidity sweep patterns in financial markets. Built to enhance understanding of market dynamics and improve trading strategies.',
    teaser: 'Financial market analysis tool.',
    image: '/project/ict_read.png',
    tags: ['JavaScript', 'Data Analysis', 'Finance'],
    github: 'https://github.com/ssaillesh/ICT-Displacement-and-Liquidity-Sweep-Detector',
    liveUrl: '',
    category: ['Web & Frontend', 'Trending in My World'],
    year: 2024,
    status: 'In Progress',
    featured: false,
    duration: '3 months',
    complexity: 'Entry Level',
  },
   {
    id: 2,
    title: 'Financial Market News Sentiment Analyzer and Stock Correlation Dashboard',
    description:
      'A project focused on analyzing financial market news sentiment and correlating it with stock performance. Built to provide insights into how news events impact market movements and to assist in making informed trading decisions.',
    teaser: 'Financial market analysis tool.',
    image: '/project/news.png',
    tags: ['JavaScript', 'Data Analysis', 'Finance'],
    github: 'https://github.com/ssaillesh/ICT-Displacement-and-Liquidity-Sweep-Detector',
    liveUrl: '',
    category: ['Web & Frontend', 'Trending in My World'],
    year: 2024,
    status: 'In Progress',
    featured: false,
    duration: '3 months',
    complexity: 'Entry Level',
  },
  {
    id: 3,
    title: 'Heston Stochastic Volatility Model Engine',
    description:
      'Numerical pricing and analysis toolkit for the Heston stochastic volatility model, with a Flask API + browser UI for pricing, Greeks, volatility surface visualization, Monte Carlo simulation, validation, and market-data-assisted parameter estimation. Built to deepen understanding of quantitative finance and practical implementation of complex mathematical models.',
    teaser: 'Simulation and Analytics Engine.',
    image: '/project/Heston_front.png',
    tags: ['Python', 'Stochastic Mathematics', 'Analytics'],
    github: 'https://github.com/ssaillesh/heston_engine',
    liveUrl: '',
    category: ['Trending in My World', 'Tools & Utilities', 'Web & Frontend'],
    year: 2024,
    status: 'Open Source',
    featured: true,
    duration: '5 months',
    complexity: 'Intermediate',
  },
  {
    id: 4,
    title: 'Care_Loop: ',
    description:
      'A utility-oriented project focused on practical, human-centered workflows. Built to simplify user tasks with clean interactions and reliable execution.',
    teaser: 'Human-centered utility solution.',
    image: '/project/careloop_intro.png'  ,
    tags: ['React', 'Node.js', 'Python', 'Java'],
    github: 'https://github.com/aarya127/CareLoop',
    liveUrl: '',
    category: ['Web & Frontend', 'Tools & Utilities', 'Trending in My World'],
    year: 2024,
    status: 'Open Source',
    featured: false,
    duration: '2 months',
    complexity: 'Advanced',
  },
  {
    id: 5,
    title: 'Pad-Lock',
    description:
      'A secure lock and access management project focused on safer credential and key handling workflows. Built to make everyday security controls more practical and user friendly.',
    teaser: 'Access management and security workflow project.',
    image: null,
    tags: ['React', 'Node.js', 'Security'],
    github: 'https://github.com/ssaillesh/Pad-Lock',
    liveUrl: '',
    category: ['Trending in My World', 'Tools & Utilities'],
    year: 2024,
    status: 'Completed',
    featured: false,
    duration: '4 months',
    complexity: 'Entry',
  },

  {
    id: 6,
    title: 'Interactive-Hand-Gesture-Recognition',
    description:
      'A real-time hand gesture recognition project using computer vision to detect and interpret gestures. Built for intuitive human-computer interaction experiments.',
    teaser: 'Real-time computer vision gesture recognition.',
    image: null,
    tags: ['Python', 'FastAPI', 'OpenCV'],
    github: 'https://github.com/ssaillesh/Interactive-Hand-Gesture-Recognition',
    liveUrl: '',
    category: ['Trending in My World', 'Web & Frontend'],
    year: 2024,
    status: 'Completed',
    featured: true,
    duration: '5 months',
    complexity: 'intermediate',
  },
 
  {
    id: 7,
    title: 'Invasion-game',
    description:
      'A game project centered around gameplay mechanics, progression, and immersive interaction loops. Created to sharpen real-time logic and UI responsiveness.',
    teaser: 'Arcade-style gameplay project.',
    image: null,
    tags: ['JavaScript', 'Game Dev', 'Frontend'],
    github: 'https://github.com/ssaillesh/Invasion-game',
    liveUrl: '',
    category: ['Web & Frontend', 'Trending in My World'],
    year: 2024,
    status: 'In Progress',
    featured: false,
    duration: '3 months',
    complexity: 'Entry Level',
  },
  {
    id: 8,
    title: 'AutoML Researcher',
    description:
      'Local multi-agent AutoML lab for guided optimization loops. The app trains, compares, and ranks models across iterations, tracks run health and status, and surfaces leaderboard artifacts for reproducible research workflows.',
    teaser: 'Guided AutoML optimization and model leaderboard.',
    image: '/project/automl_researcher.png',
    tags: ['Python', 'AutoML', 'Classification'],
    github: '',
    liveUrl: '',
    category: ['Trending in My World', 'Tools & Utilities', 'Web & Frontend'],
    year: 2026,
    status: 'Completed',
    featured: true,
    duration: '1 month',
    complexity: 'Advanced',
  },
 
]

// ADD subcategories to projects and filter by those instead of tags for better organization and display control. For example, categories could be 'Web & Frontend', 'AI & Machine Learning', 'Tools & Utilities', etc., and each project can belong to one or more categories. Then we can create rows based on these categories instead of just 'Trending in My World'.

const projectRows = [
  'Trending in My World',
  'Web & Frontend',
  'Tools & Utilities',
  'Coming Soon',

]

const projectGradients = {
  React: 'from-cyan-500/45 via-cyan-700/25 to-zinc-900/60',
  Python: 'from-blue-600/40 via-indigo-700/20 to-zinc-900/65',
  'Node.js': 'from-emerald-500/40 via-green-700/20 to-zinc-900/65',
  TypeScript: 'from-blue-500/40 via-sky-700/20 to-zinc-900/65',
  Kafka: 'from-rose-500/35 via-fuchsia-600/20 to-zinc-900/65',
  default: 'from-red-500/35 via-neutral-700/20 to-zinc-900/70',
}

const pillToId = {}

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
    // Keep this log for local debugging when the UI fails unexpectedly.
    console.error('Runtime render error:', error)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="grid min-h-screen place-items-center bg-[#121212] px-4 text-center text-white">
          <div className="max-w-lg rounded-xl border border-red-500/40 bg-[#181818] p-6">
            <h2 className="text-xl font-bold text-red-400">UI Runtime Error</h2>
            <p className="mt-3 text-sm text-[#bcbcbc]">
              The app hit a rendering error after login. Reload once and if this repeats, share this message.
            </p>
            <p className="mt-3 rounded-md bg-black/30 p-2 font-mono text-xs text-left">{this.state.errorMessage}</p>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning, Explorer'
  if (hour < 18) return 'Good afternoon, Explorer'
  return 'Good evening, Explorer'
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
  const [expanded, setExpanded] = useState(false)
  const hoverTimerRef = useRef(null)

  const transformOrigin =
    index === 0 ? 'left center' : index === count - 1 ? 'right center' : 'center center'

  const onEnter = () => {
    hoverTimerRef.current = setTimeout(() => {
      setExpanded(true)
    }, 300)
  }

  const onLeave = () => {
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current)
      hoverTimerRef.current = null
    }
    setExpanded(false)
  }

  useEffect(() => {
    return () => {
      if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current)
    }
  }, [])

  return (
    <div className="relative h-[280px] w-[240px] shrink-0" onMouseEnter={onEnter} onMouseLeave={onLeave}>
      <Motion.div
        className="absolute left-0 top-4 w-full"
        style={{ transformOrigin }}
        animate={{
          scale: expanded ? 1.4 : 1,
          y: expanded ? -10 : 0,
          zIndex: expanded ? 40 : 1,
        }}
        transition={{ duration: 0.4, ease: [0.2, 0.7, 0.2, 1] }}
      >
        <div className="overflow-hidden rounded-md border border-white/5 bg-[#181818] shadow-lg">
          <div className="aspect-video w-full">
            <ProjectCover project={project} />
          </div>

          <AnimatePresence>
            {expanded && (
              <Motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
                className="space-y-3 p-3"
              >
                <p className="text-sm font-bold text-white">{project.title}</p>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="grid h-7 w-7 place-items-center rounded-full bg-white text-black"
                    onClick={() => window.open(project.liveUrl || project.github, '_blank', 'noreferrer')}
                  >
                    <Play size={13} fill="currentColor" />
                  </button>
                  <button type="button" className="grid h-7 w-7 place-items-center rounded-full border border-white/40 text-white">
                    <Plus size={13} />
                  </button>
                  <button type="button" className="grid h-7 w-7 place-items-center rounded-full border border-white/40 text-white">
                    <ThumbsUp size={13} />
                  </button>
                  <button
                    type="button"
                    className="ml-auto grid h-7 w-7 place-items-center rounded-full border border-white/40 text-white"
                    onClick={() => onOpenModal(project)}
                  >
                    <ChevronDown size={13} />
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {project.tags.map((tag) => (
                    <span key={tag} className="rounded-full bg-[#333333] px-2 py-0.5 text-[10px] text-[#bcbcbc]">
                      {tag}
                    </span>
                  ))}
                </div>
                <p className="line-clamp-1 text-xs text-[#bcbcbc]">{project.teaser}</p>
              </Motion.div>
            )}
          </AnimatePresence>
        </div>
      </Motion.div>
    </div>
  )
}

function ProjectRow({ title, projects, onOpenModal, delay }) {
  const trackRef = useRef(null)

  const scrollByCards = (direction) => {
    if (!trackRef.current) return
    trackRef.current.scrollBy({ left: direction * 760, behavior: 'smooth' })
  }

  return (
    <Motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay }}
      className="group relative"
    >
      <h3 className="mb-3 text-base font-semibold text-white sm:text-lg">{title}</h3>

      <button
        type="button"
        onClick={() => scrollByCards(-1)}
        className="absolute left-2 top-1/2 z-20 hidden -translate-y-1/2 rounded-full bg-black/65 p-2 text-white opacity-0 transition group-hover:opacity-100 md:block"
      >
        <ChevronLeft size={18} />
      </button>

      <div ref={trackRef} className="hide-scrollbar -mx-4 flex gap-3 overflow-x-auto px-4 pb-16 pt-4">
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

      <button
        type="button"
        onClick={() => scrollByCards(1)}
        className="absolute right-2 top-1/2 z-20 hidden -translate-y-1/2 rounded-full bg-black/65 p-2 text-white opacity-0 transition group-hover:opacity-100 md:block"
      >
        <ChevronRight size={18} />
      </button>
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
  const featuredProjects = projectCatalog.filter((project) => project.featured)
  const [featuredIndex, setFeaturedIndex] = useState(0)

  useEffect(() => {
    if (featuredProjects.length <= 1) return undefined
    const timer = setInterval(() => {
      setFeaturedIndex((current) => (current + 1) % featuredProjects.length)
    }, 8000)

    return () => clearInterval(timer)
  }, [featuredProjects.length])

  const heroProject = featuredProjects[featuredIndex] || projectCatalog[0]
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
        <Motion.div style={{ scale: heroScale }} className="absolute inset-0">
          <ProjectCover project={heroProject} />
        </Motion.div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#141414_30%,transparent)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_top,#141414_10%,transparent_48%,rgba(20,20,20,0.75)_100%)]" />

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
        {projectRows.map((row, index) => {
          const rowProjects = projectCatalog.filter((project) => project.category.includes(row))
          return (
            <ProjectRow
              key={row}
              title={row}
              projects={rowProjects}
              delay={index * 0.15}
              onOpenModal={setSelectedProject}
            />
          )
        })}
      </div>

      <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} onOpenModal={setSelectedProject} />
      {/* TODO: Replace image URLs with your actual project screenshots */}
      {/* TODO: Populate real projects data */}
    </Motion.div>
  )
}

function ProjectsPage({ scrollTop, onBack }) {
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

function CountUpValue({ value, suffix = '' }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const duration = 1200
    const start = performance.now()
    let frameId = 0

    const tick = (time) => {
      const progress = Math.min((time - start) / duration, 1)
      const eased = 1 - (1 - progress) ** 3
      setCount(Math.round(value * eased))
      if (progress < 1) {
        frameId = requestAnimationFrame(tick)
      }
    }

    frameId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frameId)
  }, [value])

  return (
    <span>
      {count}
      {suffix}
    </span>
  )
}

function AboutArtistPage({ onOpenProjects, setActivePill }) {
  const [activeTab, setActiveTab] = useState('About Me')
  const [expandedWho, setExpandedWho] = useState(1)
  const [activeInspiration, setActiveInspiration] = useState(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [surpriseFlash, setSurpriseFlash] = useState(null)
  const [portraitLoadFailed, setPortraitLoadFailed] = useState(false)
  const [activeMomentIndex, setActiveMomentIndex] = useState(0)
  const [momentLoadFailed, setMomentLoadFailed] = useState(false)
  const [bioPhotoFailed, setBioPhotoFailed] = useState(false)

  const activeMoment = aboutPhotoMoments[activeMomentIndex]

  useEffect(() => {
    if (aboutPhotoMoments.length <= 1) return undefined

    const timer = setInterval(() => {
      setActiveMomentIndex((current) => (current + 1) % aboutPhotoMoments.length)
    }, 4300)

    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    setMomentLoadFailed(false)
  }, [activeMomentIndex])

  const surpriseMe = () => {
    const pick = aboutData.whoIAm[Math.floor(Math.random() * aboutData.whoIAm.length)]
    setExpandedWho(pick.id)
    setSurpriseFlash(pick.id)
    setTimeout(() => setSurpriseFlash(null), 1200)
  }

  return (
    <Motion.div
      key="about-artist"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="-mx-4 -mt-6 pb-8 sm:-mx-8"
    >
      <Motion.section
        initial={{ opacity: 0, y: 22, scale: 1.02 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative h-[55vh] min-h-[390px] overflow-hidden"
      >
        <div className="absolute inset-0">
          <InteractiveBanner />
          <Motion.div
            className="absolute inset-0 opacity-55"
            animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
            transition={{ duration: 14, repeat: Infinity, ease: 'linear' }}
            style={{
              backgroundImage:
                'radial-gradient(circle at 16% 18%, rgba(16,185,129,0.25), transparent 42%), radial-gradient(circle at 78% 74%, rgba(14,165,233,0.2), transparent 46%), radial-gradient(circle at 40% 88%, rgba(99,102,241,0.16), transparent 45%)',
              backgroundSize: '180% 180%',
            }}
          />
        </div>
        <div className="absolute inset-0 bg-[linear-gradient(to_top,#121212_15%,rgba(0,0,0,0.4)_60%,transparent_100%)]" />

        <Motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="absolute bottom-10 left-4 right-4 sm:left-8"
        >
          <h1 className="mt-4 text-4xl font-black leading-[0.95] tracking-tight text-white sm:text-6xl lg:text-7xl">{aboutData.name}</h1>
          <p className="mt-4 text-sm text-white/90 sm:text-base">{aboutData.title}</p>
          <p className="mt-2 text-xs font-medium text-[#b3b3b3] sm:text-sm">{aboutData.subtitle}</p>
        </Motion.div>
      </Motion.section>

      <div className="px-4 pt-6 sm:px-8">
        <div className="mb-5 flex flex-wrap items-center gap-3">
          <Motion.button
            type="button"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            title="See My Work"
            onClick={onOpenProjects}
            className="grid h-14 w-14 place-items-center rounded-full bg-[#1db954] text-black shadow-[0_10px_28px_rgba(29,185,84,0.35)] transition hover:bg-[#21ce60]"
          >
            <Play size={25} fill="currentColor" />
          </Motion.button>

          <div className="relative">
            <button
              type="button"
              onClick={() => setMenuOpen((current) => !current)}
              className="grid h-10 w-10 place-items-center rounded-full border border-white/20 text-[#b3b3b3] transition hover:border-white/35 hover:text-white"
            >
              <MoreHorizontal size={18} />
            </button>
            <AnimatePresence>
              {menuOpen && (
                <Motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  className="absolute left-0 top-12 z-30 w-48 rounded-md border border-white/10 bg-[#282828] p-1 text-sm shadow-xl"
                >
                  <button
                    type="button"
                    onClick={() => {
                      window.open(resumeUrl, '_blank', 'noreferrer')
                      setMenuOpen(false)
                    }}
                    className="block w-full rounded px-3 py-2 text-left text-white hover:bg-white/10"
                  >
                    Download Resume
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard?.writeText(contactData.email)
                      setMenuOpen(false)
                    }}
                    className="block w-full rounded px-3 py-2 text-left text-white hover:bg-white/10"
                  >
                    Copy Email
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard?.writeText(window.location.href)
                      setMenuOpen(false)
                    }}
                    className="block w-full rounded px-3 py-2 text-left text-white hover:bg-white/10"
                  >
                    Share Profile
                  </button>
                </Motion.div>
              )}
            </AnimatePresence>
          </div>

          <button
            type="button"
            onClick={() => {
              onOpenProjects()
            }}
            className="rounded-full border border-white/30 px-6 py-2 text-sm font-semibold text-white transition hover:border-white/55"
          >
            View Projects
          </button>

          <button
            type="button"
            onClick={surpriseMe}
            className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-sm font-semibold text-[#b3b3b3] transition hover:border-white/35 hover:text-white"
          >
            <Shuffle size={15} />
            Surprise Me
          </button>
        </div>

        <div className="mb-6 flex items-center gap-3 border-b border-[#282828] pb-3">
          {['About Me'].map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`relative px-1 pb-2 text-sm font-semibold transition ${
                activeTab === tab ? 'text-white' : 'text-[#a7a7a7] hover:text-white'
              }`}
            >
              {tab}
              {activeTab === tab ? <span className="absolute -bottom-[1px] left-0 h-0.5 w-full bg-[#1db954]" /> : null}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'Overview' && (
            <Motion.section
              key="about-overview"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <h2 className="text-2xl font-bold text-white">Who I Am</h2>
              <div className="mt-4 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
                <div className="space-y-1">
                  {aboutData.whoIAm.map((item) => {
                    const expanded = expandedWho === item.id
                    const flashed = surpriseFlash === item.id
                    return (
                      <div
                        key={item.id}
                        className={`rounded-md border-l-2 transition ${
                          expanded ? 'border-l-[#1db954] bg-[#1f1f1f]' : 'border-l-transparent'
                        } ${flashed ? 'ring-1 ring-[#1db954]/80' : ''}`}
                      >
                        <button
                          type="button"
                          onClick={() => setExpandedWho(expanded ? null : item.id)}
                          className="grid w-full grid-cols-[36px_1fr_auto] items-center gap-3 rounded-md px-3 py-3 text-left hover:bg-[#282828]"
                        >
                          <span className="text-sm font-semibold text-[#b3b3b3]">{item.id}</span>
                          <span className="text-sm font-semibold text-white sm:text-base">{item.title}</span>
                          <span className="text-xs text-[#9a9a9a]">{item.meta}</span>
                        </button>
                        <AnimatePresence>
                          {expanded && (
                            <Motion.p
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3, ease: 'easeOut' }}
                              className="overflow-hidden px-12 pb-4 text-sm leading-relaxed text-[#c5c5c5]"
                            >
                              {item.detail}
                            </Motion.p>
                          )}
                        </AnimatePresence>
                      </div>
                    )
                  })}
                </div>

                <Motion.article
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden rounded-lg border border-white/10 bg-[#181818] shadow-[0_8px_32px_rgba(0,0,0,0.6)]"
                >
                  <div className="aspect-[4/5] w-full">
                    {activeMoment && !momentLoadFailed ? (
                      <AnimatePresence mode="wait">
                        <Motion.img
                          key={activeMoment.src}
                          src={activeMoment.src}
                          alt={`Saillesh - ${activeMoment.label}`}
                          className="h-full w-full object-cover"
                          onError={() => setMomentLoadFailed(true)}
                          initial={{ opacity: 0.2, scale: 1.03 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 1.02 }}
                          transition={{ duration: 0.55, ease: 'easeOut' }}
                        />
                      </AnimatePresence>
                    ) : aboutData.portraitPhoto && !portraitLoadFailed ? (
                      <img
                        src={aboutData.portraitPhoto}
                        alt="Saillesh portrait"
                        className="h-full w-full object-cover"
                        onError={() => setPortraitLoadFailed(true)}
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-[linear-gradient(145deg,#242424,#101010)] text-xs uppercase tracking-[0.16em] text-[#7f7f7f]">
                        Add Portrait
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <p className="text-sm font-semibold text-[#d5d5d5]">{activeMoment?.label || 'Saillesh Somasundaram'}</p>
                    <p className="mt-1 text-sm italic text-[#a8a8a8]">
                      {activeMoment?.caption || 'Building at the intersection of physics and code.'}
                    </p>
                    <div className="mt-3 flex gap-1.5">
                      {aboutPhotoMoments.map((moment, index) => (
                        <span
                          key={moment.src}
                          className={`h-1.5 rounded-full transition-all ${
                            activeMomentIndex === index ? 'w-6 bg-[#1db954]' : 'w-2 bg-white/25'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </Motion.article>
              </div>
            </Motion.section>
          )}

          {activeTab === 'About Me' && (
            <Motion.section
              key="about-biography"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative overflow-hidden rounded-[24px] bg-white/[0.04] p-5 shadow-[0_24px_70px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:p-7"
            >
              <div className="pointer-events-none absolute inset-0 opacity-65">
                <div className="h-full w-full bg-[radial-gradient(circle_at_16%_22%,rgba(45,212,191,0.14),transparent_42%),radial-gradient(circle_at_83%_78%,rgba(99,102,241,0.14),transparent_50%),linear-gradient(145deg,rgba(255,255,255,0.05),rgba(255,255,255,0.01))]" />
              </div>
              <div className="relative mx-auto grid max-w-5xl gap-7 lg:grid-cols-[280px_1fr] lg:gap-10">
                <div className="overflow-hidden rounded-2xl bg-black/30 ring-1 ring-white/10">
                  {bioPhotoFailed ? (
                    <div className="grid aspect-[4/5] place-items-center text-xs uppercase tracking-[0.18em] text-[#8e8e8e]">
                      Photo Unavailable
                    </div>
                  ) : (
                    <img
                      src="/about/IMG_0146.jpg"
                      alt="Saillesh portrait in biography"
                      className="aspect-[4/5] w-full object-cover"
                      onError={() => setBioPhotoFailed(true)}
                    />
                  )}
                </div>

                <div className="flex flex-col justify-center">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/65">About Me</p>
                  <h3 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">Physics-minded builder creating focused digital experiences.</h3>
                  <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/82 sm:text-base">
                    I blend first-principles thinking from physics with practical software engineering.
                    I enjoy building systems that are clear, reliable, and genuinely useful.
                    Most days I am exploring AI workflows, quantitative tooling, and polished product UX.
                  </p>

                  <div className="mt-6 flex flex-wrap gap-2.5">
                    {['Python', 'Machine Learning', 'Systems Design', 'Quant Modeling', 'UI Engineering', 'Automation'].map((chip) => (
                      <span
                        key={chip}
                        className="rounded-full bg-white/10 px-3.5 py-1.5 text-xs font-medium tracking-[0.02em] text-white/92 transition hover:-translate-y-0.5 hover:bg-white/16"
                      >
                        {chip}
                      </span>
                    ))}
                  </div>

                  <div className="mt-7 grid gap-3 sm:grid-cols-3">
                    {[
                      { label: 'Projects', value: '8+' },
                      { label: 'Focus', value: 'AI + Physics' },
                      { label: 'Interests', value: 'Build • Learn • Ship' },
                    ].map((stat) => (
                      <article key={stat.label} className="rounded-2xl bg-black/22 px-4 py-3 ring-1 ring-white/10">
                        <p className="text-[11px] uppercase tracking-[0.16em] text-white/55">{stat.label}</p>
                        <p className="mt-1 text-sm font-semibold text-white">{stat.value}</p>
                      </article>
                    ))}
                  </div>

                  <div className="mt-7 flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={onOpenProjects}
                      className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-white/90"
                    >
                      View Projects
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        window.open(`mailto:${contactData.email}`, '_self')
                      }}
                      className="rounded-full bg-white/10 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/16"
                    >
                      Contact
                    </button>
                  </div>
                </div>
              </div>
            </Motion.section>
          )}

          {activeTab === 'Stats' && (
            <Motion.section
              key="about-stats"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
            >
              {[
                { label: 'Languages Known', value: aboutData.stats.languages, suffix: '+' },
                { label: 'Projects Shipped', value: aboutData.stats.projects, suffix: '+' },
                { label: 'Cups of Coffee', value: aboutData.stats.coffee, suffix: '+' },
                { label: 'Countries Visited', value: aboutData.stats.countries },
                { label: 'Physics Courses Completed', value: aboutData.stats.physicsCourses },
                { label: 'Years Coding', value: aboutData.stats.yearsOfCoding, suffix: '+' },
              ].map((stat, index) => (
                <Motion.article
                  key={stat.label}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="rounded-xl bg-[#181818] p-5"
                >
                  <p className="text-3xl font-black text-white">
                    <CountUpValue value={stat.value} suffix={stat.suffix} />
                  </p>
                  <p className="mt-2 text-sm text-[#9f9f9f]">{stat.label}</p>
                </Motion.article>
              ))}
            </Motion.section>
          )}
        </AnimatePresence>

      </div>
      {/* TODO: Swap in Saillesh's real bio */}
    </Motion.div>
  )
}

function CombinedAboutJourneyPage({ onOpenProjects, setActivePill, registerSection, visitorGreeting }) {
  return (
    <>
      <AboutArtistPage
        onOpenProjects={onOpenProjects}
        setActivePill={setActivePill}
      />
      <DefaultPortfolioContent registerSection={registerSection} visitorGreeting={visitorGreeting} />
    </>
  )
}

function DefaultPortfolioContent({ registerSection, visitorGreeting }) {
  const [selectedExperienceId, setSelectedExperienceId] = useState(experienceEntries[0].id)
  const [flippedExperienceId, setFlippedExperienceId] = useState(null)
  const carouselRef = useRef(null)
  const [isCarouselInteracting, setIsCarouselInteracting] = useState(false)
  const [selectedEducationId, setSelectedEducationId] = useState(educationItems[0].id)
  const [educationLogoFailed, setEducationLogoFailed] = useState(false)

  const selectedExperience = experienceEntries.find((entry) => entry.id === selectedExperienceId) || experienceEntries[0]
  const selectedEducation = educationItems.find((item) => item.id === selectedEducationId) || educationItems[0]

  useEffect(() => {
    if (experienceEntries.length <= 1) return undefined

    const timer = setInterval(() => {
      setSelectedExperienceId((current) => {
        const currentIndex = experienceEntries.findIndex((entry) => entry.id === current)
        const nextIndex = (currentIndex + 1) % experienceEntries.length
        return experienceEntries[nextIndex].id
      })
    }, 6500)

    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    if (educationItems.length <= 1) return undefined

    const timer = setInterval(() => {
      setSelectedEducationId((current) => {
        const currentIndex = educationItems.findIndex((item) => item.id === current)
        const nextIndex = (currentIndex + 1) % educationItems.length
        return educationItems[nextIndex].id
      })
    }, 6500)

    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const el = carouselRef.current
    if (!el) return undefined

    let rafId = null
    const speed = 0.4 // px per frame

    const step = () => {
      if (!isCarouselInteracting) {
        el.scrollLeft += speed
        // seamless loop when we've scrolled past half (we duplicated list)
        if (el.scrollLeft >= el.scrollWidth / 2) {
          el.scrollLeft = el.scrollLeft - el.scrollWidth / 2
        }
      }
      rafId = requestAnimationFrame(step)
    }

    rafId = requestAnimationFrame(step)

    return () => {
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [isCarouselInteracting])

  useEffect(() => {
    setEducationLogoFailed(false)
  }, [selectedEducationId])

  return (
    <Motion.div
      key="default-content"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2, ease: 'easeInOut' }}
      className="space-y-10"
    >
      

      <section
        id="skills"
        ref={(element) => registerSection('skills', element)}
      >
        <h3 className="text-xl font-bold text-white">Skills (including Languages)</h3>
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {skillGroups.map((group) => (
            <article
              key={group.title}
              className="rounded-xl border border-white/6 bg-[var(--surface)] p-4 transition duration-200 ease-out hover:-translate-y-1 hover:shadow-[0_14px_30px_rgba(29,185,84,0.2)]"
            >
              <div className="flex items-center gap-2">
                <Code2 size={16} className="text-[var(--accent)]" />
                <h4 className="text-sm font-semibold text-white">{group.title}</h4>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {group.chips.map((chip) => (
                  <span
                    key={chip}
                    className="rounded-full bg-black/25 px-2.5 py-1 text-xs font-medium text-[var(--text-secondary)]"
                  >
                    {chip}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section
        id="experience"
        ref={(element) => registerSection('experience', element)}
      >
        <h3 className="text-xl font-bold text-white">Experience</h3>
        <p className="mt-2 text-sm text-[var(--text-secondary)]">
          Dynamic view: this section rotates automatically and can also be switched manually.
        </p>
        <div
          ref={carouselRef}
          className="mt-4 hide-scrollbar flex gap-4 overflow-x-auto py-2 px-1"
          onMouseEnter={() => setIsCarouselInteracting(true)}
          onMouseLeave={() => setIsCarouselInteracting(false)}
          onPointerDown={() => setIsCarouselInteracting(true)}
          onPointerUp={() => setIsCarouselInteracting(false)}
        >
          {/** duplicate items to enable seamless looping */}
          {[...experienceEntries, ...experienceEntries].map((entry, idx) => {
            const realId = entry.id
            const isActive = realId === selectedExperienceId
            const isFlipped = flippedExperienceId === realId
            return (
              <div key={`${entry.id}-${idx}`} className="min-w-[380px] flex-shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedExperienceId(realId)
                    setFlippedExperienceId((cur) => (cur === realId ? null : realId))
                  }}
                  className="w-full h-56"
                  style={{ background: 'transparent', border: 'none', padding: 0 }}
                >
                  <Motion.div
                    animate={{ rotateY: isFlipped ? 180 : 0 }}
                    transition={{ duration: 0.45 }}
                    className="relative h-full w-full"
                    style={{ transformStyle: 'preserve-3d' }}
                  >
                    <div
                      className={`absolute inset-0 rounded-xl overflow-hidden border transition ${
                        isActive ? 'shadow-[0_14px_30px_rgba(29,185,84,0.22)]' : ''
                      }`}
                      style={{ backfaceVisibility: 'hidden' }}
                    >
                      {entry.logo ? (
                        <div className="h-full w-full flex items-center justify-center bg-black/5">
                          <img
                            src={entry.logo}
                            alt={`${entry.org} logo`}
                            className="max-h-[86%] max-w-[86%] object-contain block"
                            style={{ filter: 'saturate(1.05)' }}
                          />
                        </div>
                      ) : (
                        <div className="h-full w-full flex items-center justify-center bg-[var(--surface)]">
                          <div className="text-xs font-semibold text-white/50">Logo</div>
                        </div>
                      )}

                      <div className="absolute left-0 right-0 bottom-0 p-3 bg-gradient-to-t from-black/70 to-transparent">
                        <h4 className="text-sm font-bold text-white truncate">{entry.role}</h4>
                        <p className="text-xs text-[#d1d1d1] truncate">{entry.org}</p>
                      </div>
                    </div>

                    <div
                      className="absolute inset-0 rounded-xl border p-5 bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] text-white flex flex-col overflow-y-auto"
                      style={{ transform: 'rotateY(180deg)', backfaceVisibility: 'hidden' }}
                    >
                      <h4 className="text-base font-bold text-white leading-tight">{entry.org}</h4>
                      <p className="mt-2 text-sm leading-relaxed text-[#e0e0e0] flex-1">{entry.companyAbout}</p>
                      <div className="mt-3">
                        <p className="text-xs font-semibold text-[#1db954] uppercase tracking-wide">Key highlights:</p>
                        <ul className="mt-2 text-xs list-disc list-inside text-[#d0d0d0] space-y-1">
                          {entry.highlights.slice(0, 3).map((h) => (
                            <li key={h} className="text-[#d0d0d0]">{h}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </Motion.div>
                </button>
              </div>
            )
          })}
        </div>
      </section>

      <section
        id="education"
        ref={(element) => registerSection('education', element)}
      >
        <h3 className="text-xl font-bold text-white">Education</h3>
        <p className="mt-2 text-sm text-[var(--text-secondary)]">
          Dynamic view: this section rotates automatically and can also be switched manually.
        </p>
        <div className="mt-4 grid gap-4 lg:grid-cols-[280px_1fr]">
          <div className="space-y-3">
            {educationItems.map((item) => {
              const isActive = item.id === selectedEducationId
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedEducationId(item.id)}
                  className={`w-full rounded-xl border p-4 text-left transition ${
                    isActive
                      ? 'border-[#1db954]/55 bg-[var(--surface-hover)] shadow-[0_14px_30px_rgba(29,185,84,0.22)]'
                      : 'border-white/8 bg-[var(--surface)] hover:border-white/20 hover:bg-[var(--surface-hover)]'
                  }`}
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--text-muted)]">{item.badge}</p>
                  <h4 className="mt-2 text-sm font-bold text-white">{item.title}</h4>
                  <p className="mt-1 text-xs text-[var(--text-secondary)]">{item.provider}</p>
                </button>
              )
            })}
          </div>

          <article className="overflow-hidden rounded-xl border border-white/10 bg-[var(--surface)]">
            <div className={`relative bg-gradient-to-br ${selectedEducation.color} p-5`}>
              <div className="pointer-events-none absolute inset-0 bg-black/35" />
              <div className="relative flex items-center gap-4">
                {selectedEducation.logo && !educationLogoFailed ? (
                  <img
                    src={selectedEducation.logo}
                    alt={`${selectedEducation.provider} logo`}
                    className="h-14 w-14 rounded-md border border-white/20 bg-white/95 object-contain p-1"
                    onError={() => setEducationLogoFailed(true)}
                  />
                ) : (
                  <div className="grid h-14 w-14 place-items-center rounded-md border border-dashed border-white/45 bg-black/35 text-[10px] font-semibold uppercase tracking-[0.08em] text-white/85">
                    Add UW Logo
                  </div>
                )}
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#d9d9d9]">Education Spotlight</p>
                  <h4 className="mt-1 text-xl font-black text-white sm:text-2xl">{selectedEducation.title}</h4>
                  <p className="text-sm text-[#d9d9d9]">{selectedEducation.provider} • {selectedEducation.period}</p>
                </div>
              </div>
            </div>

            <div className="space-y-5 p-5">
              <p className="text-sm leading-relaxed text-[var(--text-secondary)]">{selectedEducation.details}</p>

              {selectedEducation.schoolHighlights ? (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--text-muted)]">School Accomplishments</p>
                  <ul className="mt-2 space-y-2 text-sm text-[var(--text-secondary)]">
                    {selectedEducation.schoolHighlights.map((item) => (
                      <li key={item}>- {item}</li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {selectedEducation.degreeOverview ? (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--text-muted)]">Physics Degree Overview</p>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">{selectedEducation.degreeOverview}</p>
                </div>
              ) : null}

              {selectedEducation.learningModules ? (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--text-muted)]">What I Learn</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {selectedEducation.learningModules.map((topic) => (
                      <span key={topic} className="rounded-full bg-black/25 px-3 py-1 text-xs text-white">
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>
              ) : null}

              {selectedEducation.classesTaken ? (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--text-muted)]">Classes Taken</p>
                  <ul className="mt-2 space-y-2 text-sm text-[var(--text-secondary)]">
                    {selectedEducation.classesTaken.map((course) => (
                      <li key={course}>- {course}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          </article>
        </div>
      </section>

      {/* TODO: Replace with real profile photo */}
    </Motion.div>
  )
}

function LoginView({ onEnter }) {
  const [loginPhotoFailed, setLoginPhotoFailed] = useState(false)

  return (
    <Motion.div
      key="login"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -18 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[var(--bg)] px-4"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(29,185,84,0.08),transparent_60%)]" />
      <div className="w-full max-w-md rounded-2xl border border-white/5 bg-[var(--surface)]/95 p-8 shadow-[0_30px_80px_rgba(0,0,0,0.6)] backdrop-blur-sm sm:p-10">
        <div className="mb-10 text-center">
          <div className="mx-auto mb-6 h-16 w-16 overflow-hidden rounded-full border border-white/20 bg-black/25">
            {loginPhotoFailed ? (
              <div className="flex h-full w-full items-center justify-center bg-white text-2xl font-extrabold text-black">S.</div>
            ) : (
              <img
                src="/about/IMG_9431.jpeg"
                alt="Saillesh"
                className="h-full w-full object-cover"
                onError={() => setLoginPhotoFailed(true)}
              />
            )}
          </div>
          <h1 className="text-balance text-3xl font-extrabold tracking-tight text-[var(--text-primary)] sm:text-4xl">
            Welcome to Saillesh&apos;s Page
          </h1>
          <p className="mt-3 text-sm text-[var(--text-secondary)] sm:text-base">Developer. Creator. Explorer.</p>
        </div>
        <button
          type="button"
          onClick={onEnter}
          className="w-full cursor-pointer rounded-full bg-[var(--accent)] px-6 py-3 text-sm font-bold tracking-wide text-black transition duration-200 ease-out hover:scale-[1.01] hover:bg-[#22d060]"
        >
          Connect with Me
        </button>
        <p className="mt-8 text-center text-xs text-[var(--text-muted)] sm:text-sm">
          Here to explore? You&apos;re already in.
        </p>
      </div>
    </Motion.div>
  )
}

function AppLayout() {
  const [activePill, setActivePill] = useState('About Me')
  const [activeSide, setActiveSide] = useState('Projects')
  const [activePage, setActivePage] = useState('about')
  const [transitioning, setTransitioning] = useState(false)
  const [scrollTop, setScrollTop] = useState(0)

  const scrollContainerRef = useRef(null)
  const sectionRefs = useRef({})

  const visitorGreeting = useMemo(() => getGreeting(), [])

  useEffect(() => {
    if (activePage !== 'home') return undefined

    const root = scrollContainerRef.current
    if (!root) return undefined

    const observer = new IntersectionObserver(
      (entries) => {
        let winningEntry = null
        for (const entry of entries) {
          if (entry.isIntersecting) {
            if (!winningEntry || entry.intersectionRatio > winningEntry.intersectionRatio) {
              winningEntry = entry
            }
          }
        }

        if (!winningEntry) return

        const nextPill = navPills.find((pill) => pillToId[pill] === winningEntry.target.id)
        if (nextPill) {
          setActivePill(nextPill)
        }
      },
      {
        root,
        threshold: [0.25, 0.4, 0.6, 0.8],
        rootMargin: '-88px 0px -30% 0px',
      },
    )

    Object.keys(pillToId).forEach((pill) => {
      const section = sectionRefs.current[pillToId[pill]]
      if (section) observer.observe(section)
    })

    return () => observer.disconnect()
  }, [activePage])

  const scrollToPillSection = (pill) => {
    const container = scrollContainerRef.current
    const sectionId = pillToId[pill]
    const section = sectionRefs.current[sectionId]
    if (!container || !section) return

    const top = Math.max(section.offsetTop - 96, 0)
    container.scrollTo({ top, behavior: 'smooth' })
  }

  const registerSection = (id, element) => {
    sectionRefs.current[id] = element
  }

  const goHomeAndScrollTo = (pill) => {
    setActivePage('home')
    setTimeout(() => {
      setActivePill(pill)
      if (pill === 'Education' || pill === 'Experience') {
        setActiveSide(pill)
      }
      scrollToPillSection(pill)
      setTimeout(() => setTransitioning(false), 220)
    }, 120)
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
      setActiveSide('Projects')
      setActivePage('projects')
      scrollContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
      setTimeout(() => setTransitioning(false), 400)
      return
    }

    if (activePage !== 'home') {
      goHomeAndScrollTo(pill)
      return
    }

    setActivePill(pill)

    if (pill === 'Projects' || pill === 'Education' || pill === 'Experience') {
      setActiveSide(pill)
    }

    scrollToPillSection(pill)
    setTimeout(() => setTransitioning(false), 220)
  }

  const handleSideClick = (label) => {
    setActiveSide(label)
    handlePillClick('Projects')
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
          onScroll={(event) => setScrollTop(event.currentTarget.scrollTop)}
          style={{ backgroundColor: activePage === 'projects' ? '#141414' : '#121212' }}
          className="relative h-screen overflow-y-auto transition-colors duration-300"
        >
          <Motion.header
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="sticky top-0 z-20 border-b border-white/5 bg-[rgba(18,18,18,0.88)] px-4 py-4 backdrop-blur-md sm:px-8"
          >
            <div className="flex items-center justify-between gap-3">
              {/* arrows removed per request */}

              <div className="hide-scrollbar flex max-w-full items-center gap-2 overflow-x-auto rounded-full bg-black/30 p-1 absolute left-1/2 transform -translate-x-1/2">
                {navPills.map((pill) => {
                  const activeClass = pill === 'Projects' ? 'bg-[#e50914] text-white' : 'bg-[#1db954] text-black shadow-[0_6px_20px_rgba(29,185,84,0.35)]'
                  return (
                    <button
                      key={pill}
                      type="button"
                      onClick={() => handlePillClick(pill)}
                      className={`cursor-pointer rounded-full px-4 py-2 text-xs font-bold transition sm:text-sm ${
                        activePill === pill
                          ? activeClass
                          : 'bg-[var(--surface)] text-[var(--text-secondary)] hover:bg-[var(--surface-hover)] hover:text-white'
                      }`}
                    >
                      {pill}
                    </button>
                  )
                })}
              </div>

              <button
                type="button"
                className="flex cursor-pointer items-center gap-2 rounded-full bg-black/50 px-2 py-1 text-sm font-semibold text-white transition hover:bg-black/70"
              >
                <div className="grid h-8 w-8 place-items-center rounded-full bg-[var(--surface-hover)] text-xs font-bold text-[var(--accent)]">
                  S
                </div>
                <span className="hidden sm:inline">Saillesh</span>
              </button>
            </div>
          </Motion.header>

          <Motion.main
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: transitioning ? 0.35 : 1, y: 0 }}
            transition={{ duration: 0.2, delay: 0.7 }}
            className="px-4 pb-16 pt-6 sm:px-8"
          >
            <AnimatePresence mode="wait">
              {activePage === 'projects' ? (
                <ProjectsPage
                  key="projects-screen"
                  scrollTop={scrollTop}
                  onBack={() => handlePillClick('About Me')}
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
                    setActivePill={setActivePill}
                    registerSection={registerSection}
                    visitorGreeting={visitorGreeting}
                  />
                </Motion.div>
              ) : (
                <DefaultPortfolioContent
                  key="home-screen"
                  registerSection={registerSection}
                  visitorGreeting={visitorGreeting}
                />
              )}
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
