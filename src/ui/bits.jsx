import { ArrowUpRight, Download, Github, Linkedin, Mail } from 'lucide-react'
import { profile } from '../data/profile.js'

export function Kicker({ children, className = '' }) {
  return <p className={`label-mono text-brass ${className}`}>{children}</p>
}

export function SectionLabel({ children }) {
  return <h3 className="label-mono mb-3 text-stone">{children}</h3>
}

export function Chip({ children }) {
  return <span className="rounded-full border border-line px-2.5 py-1 font-mono text-[11px] text-ivory-2">{children}</span>
}

export function Chips({ items }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((s) => (
        <Chip key={s}>{s}</Chip>
      ))}
    </div>
  )
}

export function Metrics({ items }) {
  if (!items?.length) return null
  return (
    <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-sm border border-line bg-line">
      {items.map((m) => (
        <div key={m.label} className="bg-char-2 p-4">
          <dt className="sr-only">{m.label}</dt>
          <dd className="font-serif text-[30px] leading-none text-ivory">{m.value}</dd>
          <dd className="mt-2 text-[12.5px] leading-snug text-stone">{m.label}</dd>
        </div>
      ))}
    </dl>
  )
}

export function ResumeButton({ className = '', size = 'md', label = 'Download résumé' }) {
  const pad = size === 'sm' ? 'h-9 px-4 text-[13px]' : 'h-12 px-5 text-[14.5px]'
  return (
    <a
      href={profile.links.resume}
      download="Saillesh_Somasundaram_Resume.pdf"
      className={`inline-flex items-center gap-2 rounded-full bg-brass font-medium text-charcoal transition-colors hover:bg-brass-2 ${pad} ${className}`}
    >
      <Download size={size === 'sm' ? 14 : 16} strokeWidth={1.8} aria-hidden />
      {label}
    </a>
  )
}

const linkRows = [
  { id: 'email', label: 'Email', meta: profile.links.email, href: `mailto:${profile.links.email}`, icon: <Mail size={16} strokeWidth={1.6} aria-hidden /> },
  { id: 'linkedin', label: 'LinkedIn', meta: 'in/saillesh', href: profile.links.linkedin, icon: <Linkedin size={16} strokeWidth={1.6} aria-hidden /> },
  { id: 'github', label: 'GitHub', meta: 'ssaillesh', href: profile.links.github, icon: <Github size={16} strokeWidth={1.6} aria-hidden /> },
]

export function ContactLinks({ only }) {
  const rows = only ? linkRows.filter((r) => only.includes(r.id)) : linkRows
  return (
    <ul className="divide-y divide-line border-y border-line">
      {rows.map(({ id, label, meta, href, icon }) => (
        <li key={id}>
          <a
            href={href}
            target={id === 'email' ? undefined : '_blank'}
            rel="noreferrer"
            className="group flex min-h-[52px] items-center gap-3 text-[15px] text-ivory transition-colors hover:text-brass-2"
          >
            <span className="text-stone group-hover:text-brass-2">{icon}</span>
            <span>{label}</span>
            <span className="ml-auto font-mono text-[12px] text-stone">{meta}</span>
            <ArrowUpRight size={15} strokeWidth={1.6} className="text-stone" aria-hidden />
          </a>
        </li>
      ))}
    </ul>
  )
}

export function ExternalButton({ href, children }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-flex h-11 items-center gap-2 rounded-full border border-ivory/25 px-4 text-[14px] text-ivory transition-colors hover:border-brass hover:text-brass-2"
    >
      {children}
      <ArrowUpRight size={15} strokeWidth={1.6} aria-hidden />
    </a>
  )
}

// A selectable row used for stations, exhibits, honours and interests.
export function ItemRow({ selected, onClick, eyebrow, title, meta, thumb }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`group flex w-full items-center gap-4 border-b border-line py-4 text-left transition-colors ${selected ? 'text-brass-2' : 'text-ivory hover:text-brass-2'}`}
    >
      {thumb && <img src={thumb} alt="" className="h-12 w-[72px] shrink-0 rounded-[2px] object-cover opacity-90" loading="lazy" />}
      <span className="min-w-0 flex-1">
        {eyebrow && <span className="label-mono block text-[10px] text-stone">{eyebrow}</span>}
        <span className="mt-1 block text-[16px] leading-snug">{title}</span>
      </span>
      {meta && <span className="shrink-0 font-mono text-[11.5px] text-stone">{meta}</span>}
    </button>
  )
}

export function BackRow({ onClick, children }) {
  return (
    <button type="button" onClick={onClick} className="label-mono mb-6 inline-flex min-h-[40px] items-center gap-2 text-stone transition-colors hover:text-ivory">
      <span aria-hidden>←</span> {children}
    </button>
  )
}
