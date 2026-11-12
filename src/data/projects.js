// Projects. Descriptions come from the previous site's project data.
// `contribution` stays null until confirmed by the owner, and the UI hides it when null.
// The Vault shows the projects listed in `vaultDisplays`, in order.

export const projects = [
  {
    id: 'rova',
    name: 'Rova',
    kind: 'AI outing planner',
    status: 'In progress',
    year: 2026,
    image: '/residence/rova-brand.jpg',
    icon: '/residence/rova-icon.jpg',
    tagline: 'Plan less. Go out more.',
    oneLiner: 'Tell it your mood and get a real, timed plan for a night out from places near you.',
    problem: 'Planning an outing means juggling maps, venue listings and event sites, then stitching a schedule together by hand.',
    description:
      'Set where, budget, radius, who and mood, or just describe what you feel like. Rova builds a timed plan from live venues and events nearby, with a route map of the stops. A “What’s on” view lists live events from Ticketmaster and the City of Toronto festivals feed, and an optional taste survey turns answers into planner defaults.',
    architecture: [
      'FastAPI backend serving a static web front end',
      'PostgreSQL + PostGIS for radius and route queries over venues',
      'Redis for caching live venue and event lookups',
      'Ticketmaster and City of Toronto festivals feeds for live events',
    ],
    stack: ['Python', 'FastAPI', 'PostgreSQL', 'PostGIS', 'Redis'],
    contribution: null,
    links: {},
    // The Vault shows Rova as an archive feed; each post is one real feature.
    archive: [
      { id: 'brand', kind: 'image', image: '/residence/rova-wordmark.jpg', title: 'Rova', body: 'Plan less. Go out more.' },
      { id: 'plan', kind: 'text', title: 'Your night, planned', body: 'Describe the mood, or set where, budget, radius and who. Rova builds a real, timed plan from live venues nearby.' },
      { id: 'mark', kind: 'photo', image: '/residence/rova-mark.jpg', title: 'The mark' },
      { id: 'whatson', kind: 'text', title: 'What’s on', body: 'Live events from Ticketmaster and the City of Toronto festivals feed, in one view.' },
      { id: 'phone', kind: 'photo', image: '/residence/rova-phone.jpg', title: 'On the home screen' },
      { id: 'route', kind: 'route', title: 'Every stop, mapped', body: 'Each plan comes with a route map of its stops.' },
      { id: 'flow', kind: 'photo', wide: true, image: '/residence/rova-flow.jpg', title: 'Logo animation flow' },
      { id: 'taste', kind: 'text', title: 'A taste survey', body: 'Optional questions that turn your answers into planner defaults.' },
      { id: 'icon', kind: 'photo', image: '/residence/rova-icon.jpg', title: 'App icon' },
      { id: 'stack', kind: 'stack', title: 'Under the hood', body: 'FastAPI, PostgreSQL + PostGIS and Redis behind a static web front end.' },
    ],
  },
  {
    id: 'vouch',
    name: 'VouchStudio',
    kind: 'Evidence-based job matching',
    status: 'Live',
    year: 2026,
    image: '/residence/vouch.jpg',
    tagline: 'Better jobs. Smarter search.',
    oneLiner: 'Scores open roles against the evidence in your résumé, then builds a one-page résumé tailored to the job from verified facts only.',
    problem: 'Job boards rank postings by keywords, and tailored résumés drift away from what you can actually back up.',
    description:
      'A job board that pulls public postings from Greenhouse, Ashby, Simplify and Jooble across the US and Canada and scores each one against your résumé. Every requirement is matched to a line of your profile, and a skill counts only when a verified line backs it. For a chosen job it builds a one-page LaTeX résumé where every claim traces back to your master profile.',
    architecture: [
      'Deterministic scoring engine in standard-library Python: no LLMs, same profile and posting always give the same score',
      'Next.js on Vercel for pages and API, with the engine as a Vercel Python Function',
      'Neon Postgres for accounts, jobs, cached scores and reviews; Cloudflare R2 for files behind five-minute links',
      'LaTeX tailoring that must compile, fit exactly one page, read cleanly in ATS and lay out cleanly',
    ],
    stack: ['Python', 'Next.js', 'TypeScript', 'Postgres (Neon)', 'Cloudflare R2', 'LaTeX'],
    contribution: null,
    links: { github: 'https://github.com/ssaillesh/VouchStudio', live: 'https://vouchstudio.vercel.app/' },
  },
  {
    id: 'lapzero',
    name: 'LapZero',
    kind: 'Autonomous racing RL',
    status: 'Open source',
    year: 2026,
    image: '/residence/lapzero.jpg',
    oneLiner: 'A reinforcement-learning race driver that only ships a new champion if it proves it is robust.',
    problem: 'RL policies that look fast in training often fall apart on new tracks or different grip, so “faster” needs evidence before it ships.',
    description:
      'An autonomous racing policy for the F1TENTH simulator. It learns from human laps with behaviour cloning, then fine-tunes with PPO across several tracks and randomised tyre friction. A release gate promotes a new champion only if it passes a friction-sweep robustness check and a pace check.',
    architecture: [
      'Behaviour cloning from human laps, then PPO fine-tuning',
      'Domain randomisation across tracks and tyre friction',
      'Release gate: friction-sweep robustness + pace check, evidence recorded in the MLflow model registry',
      'FastAPI + PostgreSQL backend feeding a React dashboard with leaderboard, lap replays and model governance',
    ],
    results: [
      { value: '120 / 120', label: 'laps on a track it never trained on' },
      { value: '0.50 – 1.05', label: 'tyre friction range survived' },
      { value: '1.71%', label: 'faster than the champion it replaced' },
    ],
    stack: ['Python', 'PyTorch', 'PPO', 'MLflow', 'FastAPI', 'PostgreSQL', 'React'],
    contribution: null,
    links: { github: 'https://github.com/ssaillesh/lapzero', live: 'https://lapzero-six.vercel.app/' },
  },
  {
    id: 'codegraphrag',
    name: 'CodeGraphRAG',
    kind: 'Code understanding with RAG',
    status: 'In progress',
    year: 2026,
    image: '/residence/codegraphrag.jpg',
    oneLiner: 'Reads a codebase, retrieves its semantic structure and drafts the documentation.',
    problem: 'Documentation drifts away from the code it describes, and writing it by hand is the first thing teams skip.',
    description:
      'An AI system that analyses codebases, retrieves their semantic structure through retrieval-augmented generation, and generates documentation automatically. Built for engineers who want clarity, not manual documentation.',
    architecture: [
      'Codebase analysis into a structural representation',
      'Retrieval over that structure (RAG) to ground the model',
      'LLM generation of documentation from the retrieved context',
    ],
    stack: ['Python', 'LLM', 'RAG'],
    contribution: null,
    links: { github: 'https://github.com/ssaillesh/CodeGraphRAG' },
  },
]

// The rest of the GitHub work, shown as displays inside the Vault. Details come
// from the résumé and the previous site. `image: null` shows a placeholder
// frame; put a screenshot in public/residence/ and set its path to fill it.
projects.push(
  {
    id: 'heston',
    name: 'Heston Engine',
    kind: 'Stochastic volatility pricing',
    status: 'Open source',
    year: 2024,
    image: '/residence/heston.jpg',
    oneLiner: 'A pricing engine for the Heston stochastic volatility model, solved three independent ways.',
    description: 'Implements the Heston model with three independent solvers: ADI finite differences, Fourier inversion, and Monte Carlo with the QE scheme.',
    architecture: ['ADI finite-difference solver', 'Fourier inversion pricer', 'Monte Carlo with the QE discretisation scheme'],
    stack: ['Python', 'Numerical methods', 'Stochastic calculus'],
    contribution: null,
    links: { github: 'https://github.com/ssaillesh/heston_engine' },
  },
  {
    id: 'ict',
    name: 'ICT Sweep Detector',
    kind: 'Market structure signals',
    status: 'In progress',
    year: 2024,
    image: '/residence/ict.jpg',
    oneLiner: 'Detects market displacement and liquidity sweeps as they happen.',
    description: 'A stateful streaming signal engine that uses custom data structures to track sweep events and displacement confirmation, with deterministic long/short setups and configurable sensitivity for systematic backtesting.',
    architecture: ['Stateful streaming signal engine', 'Custom data structures for sweep and displacement events', 'Deterministic long/short setups with configurable sensitivity'],
    stack: ['TradingView', 'Pine Script'],
    contribution: null,
    links: { github: 'https://github.com/ssaillesh/ICT-Displacement-and-Liquidity-Sweep-Detector' },
  },
  {
    id: 'news',
    name: 'News Sentiment',
    kind: 'Event-driven NLP',
    status: 'In progress',
    year: 2024,
    image: '/residence/news.jpg',
    oneLiner: 'Financial headlines, scored and set against how the stock moved.',
    description: 'An event-driven NLP pipeline ingesting 10K+ news articles a day from Finnhub and Alpha Vantage over REST, using asyncio for concurrent processing, with sentiment correlated to stock movement and dashboards.',
    architecture: ['REST ingestion from Finnhub and Alpha Vantage', 'asyncio for concurrent processing', 'Sentiment scoring correlated with price movement'],
    stack: ['Python', 'REST APIs', 'asyncio', 'NLP'],
    contribution: null,
    links: {},
  },
  {
    id: 'automl',
    name: 'AutoML Researcher',
    kind: 'Model optimisation lab',
    status: 'Completed',
    year: 2026,
    image: '/residence/automl.jpg',
    oneLiner: 'Train, compare and rank models in one guided lab.',
    description: 'A guided optimisation lab to train, compare and rank models, with a leaderboard of the results.',
    stack: ['Python', 'AutoML', 'Classification'],
    contribution: null,
    links: {},
  },
  {
    id: 'asl',
    name: 'ASL Recognition',
    kind: 'Computer vision',
    status: 'Completed',
    year: 2026,
    image: null,
    oneLiner: 'Live ASL fingerspelling, turned into sentences and speech.',
    description: 'A real-time American Sign Language recognition desktop app that tracks 21 hand landmarks with MediaPipe to predict fingerspelling from a live webcam feed. Build sentences with text-to-speech, practise in a scored mode with streaks, and train custom RandomForest models on the Kaggle ASL Fingerspelling dataset, all through a Tkinter interface with a built-in reference guide.',
    stack: ['Python', 'MediaPipe', 'scikit-learn', 'Tkinter'],
    contribution: null,
    links: { github: 'https://github.com/ssaillesh/ASL-Recognition-' },
  },
  {
    id: 'padlock',
    name: 'Pad-Lock',
    kind: 'Access & credentials',
    status: 'Completed',
    year: 2024,
    image: null,
    oneLiner: 'Access management and credential handling.',
    description: 'An access management and credential-handling project.',
    stack: ['React', 'Node.js', 'Security'],
    contribution: null,
    links: { github: 'https://github.com/ssaillesh/Pad-Lock' },
  },
  {
    id: 'invasion',
    name: 'Invasion',
    kind: 'Arcade game',
    status: 'In progress',
    year: 2024,
    image: null,
    oneLiner: 'An arcade game built around real-time logic and a responsive UI.',
    description: 'An arcade-style game focused on real-time game logic and UI responsiveness.',
    stack: ['JavaScript', 'Game dev', 'Frontend'],
    contribution: null,
    links: { github: 'https://github.com/ssaillesh/Invasion-game' },
  },
)

// Order of the displays inside the Vault.
export const vaultDisplays = ['rova', 'vouch', 'lapzero', 'heston', 'codegraphrag', 'news', 'asl', 'ict', 'automl', 'padlock', 'invasion']
// In the hall of fame: Rova at the end of the walk, big lit cases for the featured
// projects, and smaller cases near the door for the rest.
export const vaultFeatured = ['rova', 'vouch', 'lapzero', 'heston', 'codegraphrag', 'news', 'asl']
export const vaultBoxed = ['ict', 'automl', 'padlock', 'invasion']


