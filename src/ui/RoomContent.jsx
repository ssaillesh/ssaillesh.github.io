import { motion } from 'framer-motion'
import { profile, skills } from '../data/profile.js'
import { education } from '../data/education.js'
import { experience } from '../data/experience.js'
import { vaultBoxes } from '../data/projects.js'
import { interests, photos } from '../data/lounge.js'
import { awards } from '../data/awards.js'
import { rooms, roomById } from '../data/rooms.js'
import { artifactById, artifactsIn, roomIntro } from '../data/artifacts.js'
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

// ---------------------------------------------------------------- the room: only what is there
function Inventory({ room, onItem, onRoom }) {
  const list = artifactsIn(room)
  const r = roomById[room]
  return (
    <div className="flex flex-col gap-8">
      <Reveal>
        <h2 className="font-serif text-[44px] leading-[0.95] text-ivory">{r.name}</h2>
        <p className="mt-4 text-[15.5px] leading-relaxed text-stone">{roomIntro[room]}</p>
      </Reveal>
      <Reveal delay={0.08}>
        <SectionLabel>What’s here · {list.length} things</SectionLabel>
        <ul>
          {list.map((a, i) => (
            <li key={a.id}>
              <ItemRow onClick={() => onItem(a.id)} eyebrow={`${String(i + 1).padStart(2, '0')} · ${a.where}`} title={a.object} meta="Pick up →" />
            </li>
          ))}
        </ul>
      </Reveal>
      {room === 'foyer' && onRoom && (
        <Reveal delay={0.14}>
          <SectionLabel>The other rooms</SectionLabel>
          <ul>
            {rooms.slice(1).map((x) => (
              <li key={x.id}>
                <ItemRow onClick={() => onRoom(x.id)} eyebrow={`${x.number} · ${x.kicker}`} title={x.name} />
              </li>
            ))}
          </ul>
        </Reveal>
      )}
    </div>
  )
}

// ---------------------------------------------------------------- details, by kind
function Bullets({ items }) {
  return (
    <ul className="flex flex-col gap-3">
      {items.map((r) => (
        <li key={r} className="grid grid-cols-[14px_1fr] gap-2 text-[14.5px] leading-relaxed text-ivory-2">
          <span className="mt-[9px] h-px w-2.5 bg-brass" aria-hidden />
          {r}
        </li>
      ))}
    </ul>
  )
}

function ExperienceDetail({ x }) {
  return (
    <div className="flex flex-col gap-7">
      <Reveal>
        <Kicker>
          {x.station} · {x.type}
        </Kicker>
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
        <Bullets items={x.responsibilities} />
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

function Card({ kicker, title, children }) {
  return (
    <div className="flex flex-col gap-6">
      <Reveal>
        <Kicker>{kicker}</Kicker>
        <h2 className="mt-3 font-serif text-[42px] leading-[1] text-ivory">{title}</h2>
      </Reveal>
      <Reveal delay={0.08} className="flex flex-col gap-6">
        {children}
      </Reveal>
    </div>
  )
}

function IntroDetail() {
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
    </div>
  )
}

function ArtifactDetail({ a }) {
  switch (a.kind) {
    case 'intro':
      return <IntroDetail />
    case 'resume':
      return (
        <Card kicker="The résumé" title="Everything, on one page">
          <p className="text-[15px] leading-relaxed text-ivory-2">Education, experience, projects and skills, as a PDF.</p>
          <ResumeButton className="self-start" />
          <ContactLinks />
        </Card>
      )
    case 'degree':
      return (
        <Card kicker="The degree" title={education.degree}>
          <p className="text-[16px] text-ivory-2">
            {education.school} · {education.location}
          </p>
          <p className="text-[15px] leading-relaxed text-stone">
            {education.specialization} specialization · {education.period}
          </p>
        </Card>
      )
    case 'specialization':
      return (
        <Card kicker="Specialization" title={education.specialization}>
          <p className="text-[15px] leading-relaxed text-ivory-2">
            The specialization within {education.degree} at the {education.school}.
          </p>
        </Card>
      )
    case 'coursework':
      return (
        <Card kicker="Technical coursework" title="What the books are about">
          <Chips items={education.coursework} />
        </Card>
      )
    case 'honour': {
      const h = education.honours.find((x) => x.id === a.ref)
      return (
        <Card kicker="Honour" title={h.name}>
          <p className="text-[15px] text-ivory-2">{education.school}</p>
        </Card>
      )
    }
    case 'award': {
      const w = awards.find((x) => x.id === a.ref)
      return (
        <Card kicker={w.kind} title={w.name}>
          {w.detail && <p className="font-serif text-[22px] italic text-ivory-2">{w.detail}</p>}
        </Card>
      )
    }
    case 'experience':
      return <ExperienceDetail x={experience.find((x) => x.id === a.ref)} />
    case 'toolkit':
      return (
        <Card kicker="The tool chest" title="The toolkit">
          {skills.map((g) => (
            <div key={g.group}>
              <p className="mb-2 text-[13px] text-ivory-2">{g.group}</p>
              <Chips items={g.items} />
            </div>
          ))}
        </Card>
      )
    case 'interest': {
      const x = interests.find((i) => i.id === a.ref)
      return (
        <Card kicker="Away from the terminal" title={x.name}>
          <p className="text-[15.5px] leading-relaxed text-ivory-2">{x.note}</p>
          {x.id === 'exploring' && (
            <div className="grid grid-cols-2 gap-2">
              {photos.map((ph) => (
                <img key={ph.src} src={ph.src} alt={ph.alt} loading="lazy" className="aspect-[4/5] w-full rounded-[2px] object-cover" />
              ))}
            </div>
          )}
        </Card>
      )
    }
    case 'contact':
      return (
        <Card kicker="The line is open" title={`${profile.location}. ${profile.availability}.`}>
          <ContactLinks />
          <ResumeButton className="self-start" />
        </Card>
      )
    default:
      return null
  }
}

// ---------------------------------------------------------------- the vault
function Vault({ onItem }) {
  return (
    <div className="flex flex-col gap-8">
      <Reveal>
        <h2 className="font-serif text-[44px] leading-[0.95] text-ivory">Vault</h2>
        <p className="mt-4 text-[15.5px] leading-relaxed text-stone">{roomIntro.vault}</p>
      </Reveal>
      <Reveal delay={0.06}>
        <button
          type="button"
          onClick={() => onItem('inside')}
          className="group flex w-full items-center justify-between gap-4 rounded-full bg-brass py-2 pl-6 pr-2 text-left text-charcoal transition-colors hover:bg-brass-2"
        >
          <span className="text-[15.5px] font-medium">Open the vault</span>
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-charcoal text-brass transition-transform group-hover:rotate-90" aria-hidden>
            ✳
          </span>
        </button>
      </Reveal>
      <Reveal delay={0.1}>
        <SectionLabel>What’s here</SectionLabel>
        <ul>
          {vaultBoxes.map((id, i) => {
            const n = String(i + 1).padStart(2, '0')
            return (
              <li key={n}>
                {id ? (
                  <ItemRow onClick={() => onItem(id)} eyebrow={`Deposit box ${n}`} title="Locked box" meta="Open →" />
                ) : (
                  <div className="flex items-center gap-4 border-b border-line py-4 text-stone">
                    <span className="min-w-0 flex-1">
                      <span className="label-mono block text-[10px]">Deposit box {n}</span>
                      <span className="mt-1 block text-[16px]">Sealed</span>
                    </span>
                  </div>
                )}
              </li>
            )
          })}
        </ul>
      </Reveal>
    </div>
  )
}

export default function RoomContent({ room, item, onItem, onRoom }) {
  if (room === 'vault') return <Vault onItem={onItem} />
  const a = item ? artifactById[item] : null
  if (a && a.room === room)
    return (
      <div>
        <BackRow onClick={() => onItem(null)}>Everything in the {roomById[room].name}</BackRow>
        <ArtifactDetail a={a} />
      </div>
    )
  return <Inventory room={room} onItem={onItem} onRoom={onRoom} />
}
