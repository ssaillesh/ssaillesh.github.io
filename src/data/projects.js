// Every claim here is traceable to the project's repository (README, file tree or commit
// history), my résumé, or the previous version of this site. Optional fields that could not be
// verified (live URLs, repositories, metrics) are left out rather than guessed.

// Screenshots come in 960 and 1600px widths; gallery-only images need just the 1600px file.
const img = (name, width, height, alt, { thumb = true } = {}) => ({
  full: `/images/projects/${name}-1600.webp`,
  thumb: thumb ? `/images/projects/${name}-960.webp` : null,
  width,
  height,
  alt,
})

export const projects = [
  {
    slug: 'reposcribe',
    tape: { shell: '#2a2a2e', stripe: '#d9472b' },
    title: 'RepoScribe',
    formerNames: ['RAGForge', 'CodeGraphRAG'],
    pitch: 'A codebase-to-README generator grounded in retrieval over the repository itself.',
    teaser: 'Codebase in, documentation out.',
    description:
      'I built RepoScribe to turn a repository into readable documentation without writing it by hand. It indexes the code, retrieves evidence for each section, and can publish the result to Confluence.',
    tags: ['Python', 'FastAPI', 'FAISS', 'Sentence Transformers', 'Celery', 'Redis'],
    image: img(
      'reposcribe-pipeline-dashboard',
      1600,
      975,
      'RepoScribe dashboard with a node inspector, pipeline snapshot and live execution console',
    ),
    gallery: [],
    github: 'https://github.com/ssaillesh/CodeGraphRAG',
    problem:
      'Documentation drifts because writing it is slow. RepoScribe takes a Git URL or local path, parses supported files into symbols, modules and dependencies, embeds the chunks for semantic search, and generates documentation from what the retriever finds. A browser UI runs the workflow, and a finished page tree can be published straight to Confluence.',
    build: [
      'A FastAPI app serves the browser UI and a REST API for health checks, ingestion, generation and Confluence pages.',
      'A documentation pipeline keeps each stage separate: repository loading, file and AST parsing, chunking, embedding, retrieval, generation and publishing.',
      'Chunks are embedded with Sentence Transformers (all-MiniLM-L6-v2) into a FAISS index, and a semantic retriever pulls evidence for every section it writes.',
      'Run state lives in SQLite: file hashes and chunk identifiers from earlier runs decide what needs reprocessing.',
      'Celery and Redis can run the pipeline as background jobs, and a repository watcher can follow a branch for changes.',
    ],
    challenges: [
      {
        title: 'Re-indexing everything on every run',
        body: 'The first pass over a large repository is slow, and repeating it for one changed file is wasteful. I made indexing incremental: the pipeline compares file hashes against the previous run and only re-chunks and re-embeds what changed.',
      },
      {
        title: 'Keeping generated text tied to the code',
        body: 'Generation works from retrieved repository evidence rather than the model’s general knowledge, so each section is assembled from chunks the retriever found in this codebase.',
      },
    ],
    results: [
      'Runs end to end from a repository URL or path to a Confluence-ready page tree.',
      'A pytest suite covers the AST parser, file parser, GitHub loader and run-state store.',
    ],
  },
  {
    slug: 'automl-researcher',
    tape: { shell: '#e6e1d6', stripe: '#2d6a8f' },
    title: 'AutoML Researcher',
    pitch: 'A local multi-agent AutoML lab that trains, tunes and ranks models on tabular data.',
    teaser: 'Agents that train, tune and rank models.',
    description:
      'I built AutoML Researcher to go from a raw CSV or Parquet file to ranked model candidates, with every optimisation step visible: metrics, artifacts, convergence and the reasoning behind each decision.',
    tags: ['Python', 'Optuna', 'MLflow', 'XGBoost', 'LightGBM', 'Flask'],
    image: img(
      'automl-researcher-run-summary',
      1600,
      981,
      'AutoML Researcher run summary showing a completed classification job and the model leaderboard',
    ),
    gallery: [],
    github: 'https://github.com/ssaillesh/AutoML-Researcher',
    problem:
      'Given a dataset and a target column, it profiles the data, infers whether the task is classification or regression, proposes model families, tunes them, ranks them on a leaderboard, tries ensembles, and stops when improvements stall. It runs from a CLI or a browser UI with background jobs, and keeps every run on disk.',
    build: [
      'Six agents (data, model, train, eval, ensemble and optimizer) share one experiment state and iteration history, coordinated by a single orchestrator loop.',
      'Candidates train in parallel with Optuna tuning across logistic regression, random forest, XGBoost, LightGBM, SVM and KNN, with an optional FLAML baseline.',
      'Voting and stacked ensembles are evaluated from the top candidates each iteration.',
      'MLflow tracks experiments locally; model artifacts, metrics and optimizer explanations are persisted per run.',
      'Classification ranks on weighted F1 (with accuracy and ROC-AUC); regression ranks on RMSE (with R2).',
    ],
    challenges: [
      {
        title: 'Using a reasoning model without depending on it',
        body: 'The optimizer asks NVIDIA Nemotron for strategy when an API key is configured and falls back to deterministic rules when it is not, so a run never fails for lack of a key. The model guides decisions; it never trains anything.',
      },
      {
        title: 'Knowing when to stop',
        body: 'Hyperparameter search has no natural end. A convergence policy ends the run when improvement stalls past a patience limit or the iteration cap is reached, and records why it stopped.',
      },
    ],
    results: [
      'Handles classification and regression on CSV and Parquet input, from the CLI or the web UI.',
      'Every run leaves a leaderboard, iteration decisions, a final optimizer explanation and the convergence reason.',
    ],
  },
  {
    slug: 'careloop',
    tape: { shell: '#f0a830', stripe: '#1c1c1f' },
    title: 'CareLoop',
    pitch: 'A multi-tenant practice-management platform for dental clinics.',
    teaser: 'Practice management for dental clinics.',
    description:
      'CareLoop runs scheduling, patient intake, documents, billing, reminders and analytics for dental practices, with an AI phone assistant and Google Calendar sync. I built it with a teammate.',
    impact:
      'My part: the session middleware and the auth, role and service-account guards; the voice assistant’s telephony routes; the multi-tenant schema; and clinical features such as treatment plans.',
    tags: ['Next.js', 'NestJS', 'PostgreSQL', 'Prisma', 'Redis', 'BullMQ', 'Twilio', 'ElevenLabs'],
    image: img(
      'careloop-dashboard',
      1600,
      891,
      'CareLoop admin dashboard with patient, appointment, call and message counts, recent activity and the day’s schedule',
    ),
    gallery: [
      {
        ...img('careloop-demo-roles', 1600, 1084, 'CareLoop demo landing page offering admin, doctor, nurse and receptionist roles', {
          thumb: false,
        }),
        caption: 'Role-based demo entry: admin, doctor, nurse and receptionist.',
      },
    ],
    github: 'https://github.com/aarya127/CareLoop',
    live: 'https://care-loop-api.vercel.app/',
    problem:
      'Each practice is its own tenant. Staff sign up, invite their team by role, and run scheduling, patient intake, insurance and claims, billing and reminders from one app. Patients get a separate portal and a public intake form that autosaves as they go, and an AI phone assistant built on Twilio and ElevenLabs answers calls.',
    build: [
      'A pnpm and Turborepo monorepo: Next.js 15 with React 19 for the web app, NestJS 10 on Fastify for the core API, and BullMQ workers for reminders, calendar sync, transcripts and KPIs.',
      'Prisma over PostgreSQL, Redis for sessions, throttling and queues, and S3-compatible storage for documents (MinIO locally).',
      'Opaque server-side sessions rather than JWTs, with management, front-office and clinical role groups enforced by a global roles guard.',
      'Vitest suites cover tenant isolation, RBAC, the claims lifecycle and webhook signature verification, and CI runs them against Postgres and Redis service containers.',
    ],
    challenges: [
      {
        title: 'Scoping every request to one practice',
        body: 'In a multi-tenant app, one missed check leaks another clinic’s patients. I implemented the session-management middleware and the auth, role and service-account guards that scope each staff request to its practice and gate sensitive endpoints by role.',
      },
      {
        title: 'Slow logins',
        body: 'Sign-in was noticeably slow. I fixed latency in the session auth guard and the client auth context, and switched password verification to native bcrypt.',
      },
      {
        title: 'Patient data near a language model',
        body: 'I added the API’s AI module: an LLM service with a dedicated PHI-redaction step, wired into the EMR service.',
      },
    ],
    results: [
      'Shipped the multi-tenant dental practice schema and seed data, an availability-slots API, Google OAuth and cookie-security improvements, S3 document storage and treatment plans with timeline tracking.',
      'Built the telephony webhook, gather and audio routes behind the AI phone assistant.',
      'The live demo is deployed on Vercel.',
    ],
  },
  {
    slug: 'roamly',
    tape: { shell: '#d4563a', stripe: '#f0a830' },
    title: 'Roamly',
    pitch: 'Give it a budget and a vibe, and get a real, mapped night out that sticks to it.',
    teaser: 'A budget-locked plan for tonight.',
    description:
      'Roamly is a hyper-local, budget-locked itinerary generator for spontaneous nights out.',
    tags: ['Python', 'FastAPI', 'PostGIS'],
    image: img('roamly-landing', 1600, 865, 'Roamly landing page with the headline “Your night, planned.” and a chat preview'),
    gallery: [],
    problem:
      'Instead of acting as a broad, all-knowing travel guide, Roamly works as a programmatic matchmaker between the cash you have right now and a single neighbourhood’s active venues. It does not try to curate everything. It solves one high-friction problem: “I have $60 and two hours right now. Where do I go next so I don’t waste my night staring at my phone?”',
    build: [],
    challenges: [],
    results: [],
  },
  {
    slug: 'heston-engine',
    tape: { shell: '#2c4f73', stripe: '#c9a227' },
    title: 'Heston Engine',
    pitch: 'Option pricing under the Heston model, with three independent solvers and an audited validation suite.',
    teaser: 'Stochastic volatility, priced three ways.',
    description:
      'A numerical pricing and analysis toolkit for the Heston stochastic volatility model, with a Flask API and a browser UI for pricing, Greeks, volatility surfaces, Monte Carlo paths and market-data-assisted parameter estimates.',
    tags: ['Python', 'NumPy', 'SciPy', 'Flask', 'Plotly.js', 'yfinance'],
    image: img(
      'heston-market-data',
      1600,
      1056,
      'Heston Engine market data page with spot price, dividend yield, historical volatility, VIX and risk-free rate for NVDA',
    ),
    gallery: [
      {
        ...img('heston-model-parameters', 1600, 960, 'Heston Engine parameter form with Heston, market and option inputs and a Feller condition check', {
          thumb: false,
        }),
        caption: 'Model, market and option inputs, with the live Feller condition check.',
      },
    ],
    github: 'https://github.com/ssaillesh/heston_engine',
    problem:
      'Black-Scholes assumes constant volatility, so it cannot reproduce the smile and skew in real option prices. This engine prices European options under the Heston (1993) model, where variance follows its own mean-reverting process correlated with the price, and wraps it in tools for Greeks, implied volatility surfaces, Monte Carlo paths and parameter estimation from live market data.',
    build: [
      'Three independent pricers: characteristic-function Fourier inversion, a finite-difference PDE solver with ADI splitting, and Monte Carlo with Andersen’s QE variance scheme.',
      'Greeks (delta, gamma, vega, theta, rho) plus the higher-order vanna and volga.',
      'Market data adapters pull spot, dividends, option chains and historical volatility from Yahoo Finance, Treasury rates from FRED, and VIX proxies.',
      'A live Feller condition check (2κθ > σ²) flags parameter sets where variance can reach zero.',
    ],
    challenges: [
      {
        title: 'Trusting three solvers',
        body: 'With three pricers, any one can be quietly wrong. I wrote one validation script per case so each check can be audited on its own, cross-checked the solvers against each other, and benchmarked the analytical and Monte Carlo prices against QuantLib.',
      },
      {
        title: 'Keeping simulated variance valid',
        body: 'Naive discretisation of the variance process can go negative. The Monte Carlo engine uses the QE scheme, and a dedicated test asserts the minimum simulated variance never drops below zero.',
      },
    ],
    results: [
      'Nine validation cases, each in its own script. The QuantLib benchmark passes only with analytical prices under 0.10% mean absolute percentage error and 0.50% maximum relative error, and Monte Carlo within 1.5%.',
      'The suite also checks put-call parity (error under 0.01), convergence to Black-Scholes within 1% as vol-of-vol approaches zero, and PDE and Monte Carlo agreement within 2% of the analytical price.',
      'A grid-refinement case requires the fine PDE grid to beat the coarse one, and a positivity case requires simulated variance to stay non-negative.',
    ],
  },
  {
    slug: 'news-engine',
    tape: { shell: '#3d6b52', stripe: '#26262a' },
    title: 'News Engine',
    pitch: 'Entity-level sentiment on financial news, clustered into events and ranked by a hot score.',
    teaser: 'Financial news, scored per company.',
    description:
      'I built News Engine to read financial news the way a desk would: which companies an article is about, how it treats each one, and which stories are heating up.',
    tags: ['Python', 'FinBERT', 'FastAPI', 'HDBSCAN', 'FAISS', 'Redis'],
    image: img(
      'news-engine-price-chart',
      1600,
      910,
      'News Engine price chart for AAPL with moving-average overlays, volume and a stock information panel',
    ),
    gallery: [
      {
        ...img('news-engine-sentiment-feed', 1600, 970, 'News Engine sentiment view with bullish, neutral and bearish counts and scored headlines', {
          thumb: false,
        }),
        caption: 'Sentiment view: overall reading, distribution and the strongest signal.',
      },
      {
        ...img('news-engine-earnings', 1600, 1112, 'News Engine earnings view with revenue, margins, cash flow and analyst guidance for NVIDIA', {
          thumb: false,
        }),
        caption: 'Earnings view with fundamentals and analyst guidance.',
      },
      {
        ...img('news-engine-sentiment-detail', 1600, 1243, 'Scored articles with per-article confidence and positive, neutral and negative probabilities', {
          thumb: false,
        }),
        caption: 'Per-article scores with the full positive, neutral and negative distribution.',
      },
    ],
    github: 'https://github.com/ssaillesh/News_Engine',
    problem:
      'One article often names several companies and treats them differently, so a single sentiment score per article blurs the signal. News Engine ingests financial news from Alpha Vantage, Finnhub and yfinance, finds the companies each article mentions, scores sentiment for each company separately, groups related articles into events, and ranks those events by how hot they are. A terminal-style dashboard shows sentiment, price charts and earnings data.',
    build: [
      'Ingestion merges and de-duplicates articles from three sources, then streams them through Redis to an NLP worker.',
      'dslim/bert-base-NER extracts organisation entities, and ProsusAI/finbert scores sentiment on two sentences either side of each mention.',
      'Sentiment rolls up from mention to article (mention-weighted) to event, with HDBSCAN clustering related articles into events.',
      'A hot score weights mention volume (30%), velocity (25%), sentiment strength (20%), source diversity (15%) and novelty (10%).',
      'An analysis module aligns sentiment with the next trading day’s price move, and FastAPI serves events, company sentiment trends and article detail.',
    ],
    challenges: [
      {
        title: 'Article-level sentiment blurs companies together',
        body: 'Scoring a window of two sentences around each entity mention gives every company in an article its own reading, which then rolls up to the article and the event.',
      },
      {
        title: 'Reprocessing without refetching',
        body: 'I kept raw API responses immutable and separate from the NLP, vector and event stores, so each processed layer can be rebuilt from the originals.',
      },
      {
        title: 'Testing without API keys',
        body: 'The test suite runs on mock data, covering normalisation, sentence splitting, context windows, sentiment rollup and model validation.',
      },
    ],
    results: [
      'Built to ingest 10K+ news articles a day, using asyncio for concurrent requests to the news APIs.',
    ],
  },
  {
    slug: 'asl-recognition',
    tape: { shell: '#b7b0a1', stripe: '#d4563a' },
    title: 'ASL Recognition',
    pitch: 'Real-time ASL fingerspelling recognition with sentence building and text-to-speech.',
    teaser: 'Live ASL fingerspelling to speech.',
    description:
      'A desktop app that recognises American Sign Language fingerspelling from a live webcam feed and turns it into sentences you can hear.',
    tags: ['Python', 'MediaPipe', 'scikit-learn', 'OpenCV', 'Tkinter'],
    image: null,
    gallery: [],
    github: 'https://github.com/ssaillesh/ASL-Recognition-',
    problem:
      'It tracks 21 hand landmarks with MediaPipe and predicts fingerspelled letters, showing the top three guesses with confidence. Confirmed letters build sentences that can be read aloud, a practice mode scores you with streaks, and a searchable ASL reference sits beside the camera feed.',
    build: [
      'MediaPipe hand tracking feeds 21 landmarks per frame to a RandomForest classifier.',
      'Special gestures handle space, clear and confirm while building sentences, and confirmed sentences play through text-to-speech.',
      'A training pipeline converts the Kaggle ASL Fingerspelling parquet landmarks to CSV and trains a custom model, which the app loads on restart.',
      'A two-panel Tkinter interface pairs the camera feed with a searchable ASL reference guide.',
    ],
    challenges: [
      {
        title: 'Flickering predictions',
        body: 'Frame-by-frame predictions jump between letters. A 0.8 second hold before a gesture is confirmed turns them into stable input.',
      },
    ],
    results: [],
  },
]

// Shelf order: the strongest, most complete work first.
export const tapeOrder = [
  'careloop',
  'reposcribe',
  'automl-researcher',
  'news-engine',
  'heston-engine',
  'roamly',
  'asl-recognition',
]
