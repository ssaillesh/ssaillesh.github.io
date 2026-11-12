// Projects. Descriptions come from each project's GitHub README (checked 2026-11-12)
// and the previous site's project data.
// `contribution` stays null until confirmed by the owner, and the UI hides it when null.
// The Vault shows the projects listed in `vaultDisplays`, in order.
//
// Adding a project: id, name, kind, oneLiner and stack are enough. Everything else is optional
// and hidden when missing. In the plain view:
//   - screenshots are picked up from src/assets/projects/<id>.jpg (cover), <id>-2.jpg, <id>-3.jpg …
//   - `featured: true` puts it on the home page; `live: true` (or status 'Live') adds the Live badge
//   - projects are listed newest `year` first

export const projects = [
  {
    id: 'rova',
    name: 'Rova',
    kind: 'AI outing planner',
    status: 'In progress',
    live: true, // running for real people; the plain view flags it, the 3D Vault still reads `status`
    featured: true,
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
    links: { live: 'https://traviq.vercel.app' },
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
    featured: true,
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
    results: [
      { value: '4', label: 'job sources: Greenhouse, Ashby, Simplify and Jooble' },
      { value: '0', label: 'LLM calls in scoring: same input, same score' },
      { value: '4', label: 'checks every tailored PDF must pass' },
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
    featured: true,
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
      { value: '1,147', label: 'Python tests passing, 99% line coverage' },
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
    oneLiner: 'Point it at a repository and it writes the documentation, then publishes it to Confluence.',
    problem: 'Documentation drifts away from the code it describes, and writing it by hand is the first thing teams skip.',
    description:
      'A FastAPI app that clones or opens a Git repository, parses its files into symbols, modules and dependencies, and indexes the code for semantic retrieval. Documentation is generated from that retrieved evidence and can be published straight to Confluence. Indexing is incremental, so only changed files are reprocessed.',
    architecture: [
      'Repository loader and AST parser that extract symbols, modules and dependencies',
      'Sentence Transformers embeddings in a FAISS vector store, updated incrementally',
      'Retrieval-grounded documentation generation from repository evidence',
      'Optional Celery + Redis queue and Confluence publishing',
    ],
    stack: ['Python', 'FastAPI', 'FAISS', 'Sentence Transformers', 'Celery', 'Redis'],
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
    problem: 'Black–Scholes assumes constant volatility, so it misses the smile and skew real option prices show.',
    description:
      'Prices European options under the Heston model with three independent engines and checks them against each other. A Flask API and browser UI cover pricing, Greeks, a 3D implied-volatility surface, Monte Carlo paths and validation, with market data from Yahoo Finance and FRED to estimate parameters.',
    architecture: [
      'Fourier inversion of the characteristic function, an ADI finite-difference PDE solver, and Monte Carlo with the QE scheme',
      'Greeks including Vanna and Volga',
      'Validation: put-call parity, Black–Scholes comparison and a live Feller-condition check',
      'Flask API with a Plotly front end for surfaces and paths',
    ],
    results: [
      { value: '3', label: 'independent pricing engines' },
      { value: '7', label: 'Greeks, including Vanna and Volga' },
    ],
    stack: ['Python', 'NumPy', 'SciPy', 'Flask', 'Plotly'],
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
    links: {}, // the repository is not public
  },
  {
    id: 'news',
    name: 'News Engine',
    kind: 'News archive with FinBERT sentiment',
    status: 'In progress',
    live: true,
    year: 2026,
    image: '/residence/news.jpg',
    oneLiner: 'A continuously running archive of public records and news coverage, scored for sentiment with FinBERT.',
    problem: 'The original source blocked automated access, so the archive had to be rebuilt on sources that allow it, without scraping around the block.',
    description:
      'Archives public records and news coverage of the US president from five compliant sources into one searchable archive. Ingest is incremental and checkpointed, robots.txt is respected, and a detected block halts the client instead of evading it. Offline passes score headlines with FinBERT and condense longer articles with distilbart, stored apart from the original text.',
    architecture: [
      'Five sources: GovInfo, the Federal Register, White House RSS, Google News RSS and publisher RSS',
      'Normalised 18-table schema with Alembic migrations, portable between SQLite and PostgreSQL',
      'Shared HTTP client with rate limiting, retry and block detection',
      'Offline FinBERT sentiment and distilbart summaries, incremental and re-derivable',
      'Dashboard and JSON API, deployed on Vercel',
    ],
    results: [
      { value: '16,000+', label: 'stories archived' },
      { value: '5', label: 'compliant sources' },
      { value: '18', label: 'tables in the normalised schema' },
    ],
    stack: ['Python', 'PostgreSQL', 'Alembic', 'FinBERT', 'Transformers', 'Vercel'],
    contribution: null,
    links: { github: 'https://github.com/ssaillesh/News_Engine', live: 'https://news-engine-nine.vercel.app/' },
  },
  {
    id: 'automl',
    name: 'AutoML Researcher',
    kind: 'Multi-agent AutoML',
    status: 'Completed',
    year: 2026,
    image: '/residence/automl.jpg',
    oneLiner: 'Give it a CSV and a target column; a team of agents trains, tunes and ranks the models.',
    problem: 'Benchmarking models on a new tabular dataset is a slow loop of setup, tuning and comparison.',
    description:
      'A local-first AutoML system for tabular data with a web UI and CLI. Agents profile the data, propose model families, tune them with Optuna, evaluate and try ensembles, and an optimizer agent decides whether to keep going or stop when gains stall. Every run is tracked in MLflow with the optimizer’s reasoning.',
    architecture: [
      'Six agents: data, model, train, eval, ensemble and optimizer, sharing one experiment state',
      'Optuna tuning with parallel training, and an optional FLAML baseline',
      'Convergence policy that stops when improvements stall',
      'MLflow tracking; Nemotron reasoning when configured, with a deterministic fallback',
    ],
    results: [{ value: '6', label: 'cooperating agents per run' }],
    stack: ['Python', 'Optuna', 'MLflow', 'scikit-learn', 'XGBoost', 'LightGBM', 'Flask'],
    contribution: null,
    links: { github: 'https://github.com/ssaillesh/AutoML-Researcher' },
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
    results: [
      { value: '21', label: 'hand landmarks tracked per frame' },
      { value: '0.8 s', label: 'hold to confirm a gesture, so output does not flicker' },
    ],
    stack: ['Python', 'MediaPipe', 'scikit-learn', 'Tkinter', 'Text-to-speech'],
    contribution: null,
    links: { github: 'https://github.com/ssaillesh/ASL-Recognition-' },
  },
  {
    id: 'padlock',
    name: 'Pad-Lock',
    kind: 'Embedded keypad lock',
    status: 'Completed',
    year: 2021,
    image: null,
    oneLiner: 'A digital padlock: type the code on a keypad and a servo opens the latch.',
    description:
      'A microcontroller lock wired on a breadboard: a keypad takes a four-digit code, a 16×2 LCD shows prompts, a servo turns the latch, and LEDs and a buzzer signal right and wrong attempts. Designed and simulated in Tinkercad.',
    stack: ['Arduino', 'C++', 'Tinkercad'],
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
    links: {}, // the repository is not public
  },
)

// Order of the displays inside the Vault.
export const vaultDisplays = ['rova', 'vouch', 'lapzero', 'heston', 'codegraphrag', 'news', 'asl', 'ict', 'automl', 'padlock', 'invasion']
// In the hall of fame: Rova at the end of the walk, big lit cases for the featured
// projects, and smaller cases near the door for the rest.
export const vaultFeatured = ['rova', 'vouch', 'lapzero', 'heston', 'codegraphrag', 'news', 'asl']
export const vaultBoxed = ['ict', 'automl', 'padlock', 'invasion']
// Cases on the right-hand wall: their details panel opens on the left so it never covers them.
export const vaultRightWall = ['lapzero', 'heston', 'news', 'padlock', 'invasion']



// A project counts as live when it is running for real people. The plain view flags only these.
export const isLive = (p) => !!p.live || p.status === 'Live'
