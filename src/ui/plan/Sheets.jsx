import { ArrowUpRight } from 'lucide-react'
import { Chips } from '../bits.jsx'
import { Disclosure, Results } from './parts.jsx'

export function Bullets({ items }) {
  return (
    <ul className="flex flex-col gap-3 pl-4 text-[14px] leading-relaxed text-ivory-2">
      {items.map((t) => (
        <li key={t} className="list-disc marker:text-brass">
          {t}
        </li>
      ))}
    </ul>
  )
}

export function LinkButton({ href, children, primary }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={`inline-flex h-11 items-center gap-2 rounded-full px-4 text-[14px] transition-colors ${
        primary ? 'bg-ivory font-medium text-charcoal hover:bg-brass-2' : 'border border-ivory/25 text-ivory hover:border-brass hover:text-brass-2'
      }`}
    >
      {children}
      <ArrowUpRight size={15} strokeWidth={1.6} aria-hidden />
    </a>
  )
}

export function JobSheet({ x }) {
  return (
    <div>
      <p className="label-mono text-[10.5px] text-brass">
        {x.type} · {x.location}
      </p>
      <h2 className="mt-2 font-display text-[44px] font-bold leading-none tracking-[-0.035em]">{x.company}</h2>
      <p className="mt-2 text-[15px] text-ivory-2">{x.title}</p>
      <p className="label-mono mt-1 text-[10.5px] text-stone">{x.period}</p>

      <Results items={x.results} className="mt-7" />

      <div className="mt-7">
        <Chips items={x.stack} />
      </div>

      <div className="mt-7">
        <Disclosure label="What I did">
          <Bullets items={x.responsibilities} />
        </Disclosure>
        <Disclosure label={`About ${x.company}`}>
          <p className="text-[14px] leading-relaxed text-ivory-2">{x.companyAbout}</p>
          <div className="mt-3">
            <LinkButton href={x.url}>Visit site</LinkButton>
          </div>
        </Disclosure>
      </div>
    </div>
  )
}
