// Projects. Descriptions come from the previous site's project data.
// `contribution` stays null until confirmed by the owner, and the UI hides it when null.
// The Vault shows the projects listed in `vaultBoxes`, in order; a null slot is sealed.

export const projects = [
  {
    id: 'rova',
    name: 'Rova',
    kind: 'AI outing planner',
    status: 'In progress',
    year: 2026,
    image: '/residence/rova.jpg',
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
      { id: 'plan', kind: 'image', title: 'Your night, planned', body: 'Describe the mood, or set where, budget, radius and who. Rova builds a real, timed plan from live venues nearby.' },
      { id: 'whatson', kind: 'text', title: 'What’s on', body: 'Live events from Ticketmaster and the City of Toronto festivals feed, in one view.' },
      { id: 'route', kind: 'route', title: 'Every stop, mapped', body: 'Each plan comes with a route map of its stops.' },
      { id: 'taste', kind: 'text', title: 'A taste survey', body: 'Optional questions that turn your answers into planner defaults.' },
      { id: 'stack', kind: 'stack', title: 'Under the hood', body: 'FastAPI, PostgreSQL + PostGIS and Redis behind a static web front end.' },
    ],
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

export const vaultBoxes = ['rova', 'lapzero', null]
