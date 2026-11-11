import { motion } from 'framer-motion'
import { profile, skills } from '../data/profile.js'
import { education } from '../data/education.js'
import { experience } from '../data/experience.js'
import { projects } from '../data/projects.js'
import { interests, photos } from '../data/lounge.js'
import { rooms } from '../data/rooms.js'
import { BackRow, Chips, ContactLinks, ExternalButton, ItemRow, Kicker, Metrics, ResumeButton, SectionLabel } from './bits.jsx'

const Motion = motion
const reveal = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.55, ease: [0.2, 0.7, 0.2, 1] },
}
const Reveal = ({ delay = 0, children, className }) => (
  <Motion.div {...reveal} transition={{ ...reveal.transition, delay }} className={className}>
    {children}
  </Motion.div>
)

// ---------------------------------------------------------------- Foyer
function Foyer({ onRoom }) {
  return (
    <div className="flex flex-col gap-8">
      <Reveal>
        <h2 className="font-serif text-[64px] leading-[0.9] tracking-[-0.01em] text-ivory">{profile.name}.</h2>
        <p className="label-mono mt-4 text-[11.5px] text-brass">{profile.motto}</p>
      </Reveal>
      <Reveal delay={0.08}>
        <p className="font-serif text-[24px] italic leading-snug text-ivory-2">{profile.descriptor}</p>
        <p className="mt-4 text-[15.5px] leading-relaxed text-stone">{profile.intro}</p>
      </Reveal>
      <Reveal delay={0.14}>
        <dl className="grid grid-cols-1 gap-4 border-y border-line py-5 text-[14.5px]">
          {[
            ['Education', `${education.school} · ${education.degree}`],
            ['Focus', profile.focus],
            ['Based in', `${profile.location} · ${profile.availability}`],
          ].map(([k, v]) => (
            <div key={k} className="grid grid-cols-[92px_1fr] gap-3">
              <dt className="label-mono pt-0.5 text-[10px] text-stone">{k}</dt>
              <dd className="leading-relaxed text-ivory-2">{v}</dd>
            </div>
          ))}
        </dl>
      </Reveal>
      <Reveal delay={0.2} className="flex flex-col gap-4">
        <ResumeButton className="self-start" />
        <ContactLinks only={['linkedin', 'github']} />
      </Reveal>
      {onRoom && (
        <Reveal delay={0.26}>
          <SectionLabel>The rooms</SectionLabel>
          <ul>
            {rooms.slice(1).map((r) => (
              <li key={r.id}>
                <ItemRow onClick={() => onRoom(r.id)} eyebrow={`${r.number} · ${r.kicker}`} title={r.name} meta={r.purpose} />
              </li>
            ))}
          </ul>
        </Reveal>
      )}
    </div>
  )
}

// ---------------------------------------------------------------- Study
function Study({ item, onItem }) {
  return (
    <div className="flex flex-col gap-8">
      <Reveal>
        <h2 className="font-serif text-[44px] leading-[0.95] text-ivory">{education.school}</h2>
        <p className="mt-3 text-[16px] text-ivory-2">{education.degree}</p>
        <p className="mt-1 text-[15px] text-stone">
          {education.specialization} specialization · {education.period}
        </p>
      </Reveal>
      <Reveal delay={0.08}>
        <SectionLabel>Honours</SectionLabel>
        <ul>
          {education.honours.map((h) => (
            <li key={h.id}>
              <ItemRow selected={item === h.id} onClick={() => onItem(item === h.id ? null : h.id)} eyebrow={h.object} title={h.name} />
            </li>
          ))}
        </ul>
      </Reveal>
      <Reveal delay={0.14}>
        <SectionLabel>Technical coursework</SectionLabel>
        <Chips items={education.coursework} />
      </Reveal>
    </div>
  )
}

// ---------------------------------------------------------------- Workshop
function ExperienceDetail({ x, onBack }) {
  return (
    <div className="flex flex-col gap-7">
      {onBack && <BackRow onClick={onBack}>All workstations</BackRow>}
      <Reveal>
        <Kicker>{x.station} · {x.type}</Kicker>
        <h2 className="mt-3 font-serif text-[46px] leading-[0.95] text-ivory">{x.company}</h2>
        <p className="mt-2 text-[17px] text-ivory-2">{x.title}</p>
        <p className="mt-1 font-mono text-[12px] text-stone">
          {x.period} · {x.location}
        </p>
        <p className="mt-4 text-[15px] leading-relaxed text-stone">{x.summary}</p>
      </Reveal>
      <Reveal delay={0.08}>
        <SectionLabel>Results</SectionLabel>
        <Metrics items={x.results} />
      </Reveal>
      <Reveal delay={0.14}>
        <SectionLabel>Responsibilities</SectionLabel>
        <ul className="flex flex-col gap-3">
          {x.responsibilities.map((r) => (
            <li key={r} className="grid grid-cols-[14px_1fr] gap-2 text-[14.5px] leading-relaxed text-ivory-2">
              <span className="mt-[9px] h-px w-2.5 bg-brass" aria-hidden />
              {r}
            </li>
          ))}
        </ul>
      </Reveal>
      <Reveal delay={0.2}>
        <SectionLabel>Technologies</SectionLabel>
        <Chips items={x.stack} />
      </Reveal>
      <Reveal delay={0.24} className="flex flex-wrap items-center gap-3 border-t border-line pt-5">
        <p className="min-w-0 flex-1 text-[13px] leading-relaxed text-stone">{x.companyAbout}</p>
        <ExternalButton href={x.url}>{new URL(x.url).hostname.replace('www.', '')}</ExternalButton>
      </Reveal>
    </div>
  )
}

function Workshop({ item, onItem }) {
  const sel = experience.find((x) => x.id === item)
  if (sel) return <ExperienceDetail x={sel} onBack={() => onItem(null)} />
  return (
    <div className="flex flex-col gap-8">
      <Reveal>
        <h2 className="font-serif text-[44px] leading-[0.95] text-ivory">Where I’ve worked</h2>
        <p className="mt-4 text-[15.5px] leading-relaxed text-stone">
          Four co-op placements across financial infrastructure, biotech and manufacturing, plus an autonomous-vehicle design team. Each workstation is one role.
        </p>
      </Reveal>
      <Reveal delay={0.08}>
        <ul>
          {experience.map((x) => (
            <li key={x.id}>
              <ItemRow onClick={() => onItem(x.id)} eyebrow={`${x.station} · ${x.period}`} title={`${x.company} — ${x.title}`} />
            </li>
          ))}
        </ul>
      </Reveal>
      <Reveal delay={0.14} className="flex flex-col gap-5">
        <SectionLabel>Toolkit</SectionLabel>
        {skills.map((g) => (
          <div key={g.group}>
            <p className="mb-2 text-[13px] text-ivory-2">{g.group}</p>
            <Chips items={g.items} />
          </div>
        ))}
      </Reveal>
    </div>
  )
}

// ---------------------------------------------------------------- Gallery
function ProjectDetail({ p, onBack }) {
  return (
    <div className="flex flex-col gap-7">
      {onBack && <BackRow onClick={onBack}>All exhibits</BackRow>}
      <Reveal>
        <div className="overflow-hidden rounded-[3px] border border-line">
          <img src={p.image} alt={`${p.name} screenshot`} className="aspect-[16/9] w-full object-cover" />
        </div>
      </Reveal>
      <Reveal delay={0.06}>
        <div className="flex items-center gap-3">
          <Kicker>{p.kind}</Kicker>
          <span className="rounded-full border border-brass/40 px-2 py-0.5 font-mono text-[10.5px] text-brass-2">{p.status}</span>
        </div>
        <h2 className="mt-3 font-serif text-[48px] leading-[0.95] text-ivory">{p.name}</h2>
        <p className="mt-3 font-serif text-[21px] italic leading-snug text-ivory-2">{p.oneLiner}</p>
      </Reveal>
      <Reveal delay={0.1}>
        <SectionLabel>The problem</SectionLabel>
        <p className="text-[15px] leading-relaxed text-ivory-2">{p.problem}</p>
        <p className="mt-3 text-[14.5px] leading-relaxed text-stone">{p.description}</p>
      </Reveal>
      {p.results && (
        <Reveal delay={0.14}>
          <SectionLabel>Results</SectionLabel>
          <Metrics items={p.results} />
        </Reveal>
      )}
      <Reveal delay={0.18}>
        <SectionLabel>Architecture</SectionLabel>
        <ol className="flex flex-col">
          {p.architecture.map((a, i) => (
            <li key={a} className="grid grid-cols-[32px_1fr] gap-2 border-t border-line py-3 text-[14.5px] leading-relaxed text-ivory-2">
              <span className="font-mono text-[11px] text-brass">{String(i + 1).padStart(2, '0')}</span>
              {a}
            </li>
          ))}
        </ol>
      </Reveal>
      <Reveal delay={0.22}>
        <SectionLabel>Built with</SectionLabel>
        <Chips items={p.stack} />
      </Reveal>
      {p.contribution && (
        <Reveal delay={0.24}>
          <SectionLabel>My contribution</SectionLabel>
          <p className="text-[15px] leading-relaxed text-ivory-2">{p.contribution}</p>
        </Reveal>
      )}
      <Reveal delay={0.26} className="flex flex-wrap gap-3">
        {p.links.live && <ExternalButton href={p.links.live}>Live demo</ExternalButton>}
        {p.links.github && <ExternalButton href={p.links.github}>Source on GitHub</ExternalButton>}
        {!p.links.live && !p.links.github && <p className="font-mono text-[12px] text-stone">Private repository · not yet deployed</p>}
      </Reveal>
    </div>
  )
}

function Gallery({ item, onItem }) {
  const sel = projects.find((p) => p.id === item)
  if (sel) return <ProjectDetail p={sel} onBack={() => onItem(null)} />
  return (
    <div className="flex flex-col gap-8">
      <Reveal>
        <h2 className="font-serif text-[44px] leading-[0.95] text-ivory">Things I’ve built</h2>
        <p className="mt-4 text-[15.5px] leading-relaxed text-stone">A private exhibition of independent work. Select an exhibit for the problem, the architecture and the evidence.</p>
      </Reveal>
      <Reveal delay={0.08}>
        <ul>
          {projects.map((p, i) => (
            <li key={p.id}>
              <ItemRow onClick={() => onItem(p.id)} thumb={p.image} eyebrow={`Exhibit 0${i + 1} · ${p.kind}`} title={p.name} meta={p.status} />
            </li>
          ))}
        </ul>
      </Reveal>
    </div>
  )
}

// ---------------------------------------------------------------- Lounge
function Lounge({ item, onItem }) {
  return (
    <div className="flex flex-col gap-8">
      <Reveal>
        <h2 className="font-serif text-[44px] leading-[0.95] text-ivory">The person behind it</h2>
        <p className="mt-4 text-[15.5px] leading-relaxed text-stone">
          Away from the terminal: cars and the ambition that comes with them, the gym, cooking, getting out on the bike and finding somewhere new.
        </p>
      </Reveal>
      <Reveal delay={0.08}>
        <SectionLabel>Interests</SectionLabel>
        <ul>
          {interests.map((x) => (
            <li key={x.id}>
              <ItemRow selected={item === x.id} onClick={() => onItem(item === x.id ? null : x.id)} eyebrow={x.object} title={x.name} />
            </li>
          ))}
        </ul>
      </Reveal>
      <Reveal delay={0.12} className="grid grid-cols-2 gap-2">
        {photos.map((ph) => (
          <img key={ph.src} src={ph.src} alt={ph.alt} loading="lazy" className="aspect-[4/5] w-full rounded-[2px] object-cover" />
        ))}
      </Reveal>
      <Reveal delay={0.16} className="flex flex-col gap-4">
        <SectionLabel>Get in touch</SectionLabel>
        <p className="font-serif text-[30px] leading-tight text-ivory">
          {profile.location}. {profile.availability}.
        </p>
        <ContactLinks />
        <ResumeButton className="self-start" />
      </Reveal>
    </div>
  )
}

const BY_ROOM = { foyer: Foyer, study: Study, workshop: Workshop, gallery: Gallery, lounge: Lounge }

export default function RoomContent({ room, item, onItem, onRoom }) {
  const C = BY_ROOM[room]
  return <C item={item} onItem={onItem} onRoom={onRoom} />
}
