import { ArrowUpRight, FileText, Github, Linkedin, Mail } from 'lucide-react'
import { profile } from '../../data/profile'
import { asset } from '../../utils/asset'
import { prefersReducedMotion } from '../../utils/scroll'
import { Monogram } from '../ui/Monogram'
import { Reveal } from '../ui/Reveal'

const channels = [
  { label: 'Email', value: profile.email, href: `mailto:${profile.email}`, icon: Mail, external: false },
  { label: 'GitHub', value: profile.githubHandle, href: profile.github, icon: Github, external: true },
  { label: 'LinkedIn', value: profile.linkedinHandle, href: profile.linkedin, icon: Linkedin, external: true },
  { label: 'Resume', value: 'PDF, one page', href: asset(profile.resume), icon: FileText, external: true },
]

export function ContactSection({ inert }) {
  return (
    <footer id="contact" aria-labelledby="contact-title" className="section section-end bg-surface" inert={inert}>
      <div className="page-width">
        <Reveal>
          <h2 id="contact-title" className="text-display font-bold text-ink">
            Let&rsquo;s build something
          </h2>
          <p className="mt-5 text-lead text-ink-2">
            {profile.location} · {profile.availability}
          </p>
        </Reveal>

        <Reveal delay={0.08}>
          <ul className="mt-12 grid max-w-[56rem] gap-1 md:mt-16" role="list">
            {channels.map(({ label, value, href, icon, external }) => {
              const Icon = icon
              return (
                <li key={label}>
                  <a
                    href={href}
                    {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                    className="group -mx-4 flex min-h-16 items-center gap-4 rounded-card px-4 py-3 transition-colors duration-200 hover:bg-raised"
                  >
                    <Icon size={22} strokeWidth={1.75} aria-hidden="true" className="shrink-0 text-ink-2 group-hover:text-accent" />
                    <span className="w-24 shrink-0 text-lead font-semibold text-ink">{label}</span>
                    <span className="min-w-0 flex-1 truncate text-right text-ink-2 sm:text-left">{value}</span>
                    <ArrowUpRight
                      size={20}
                      aria-hidden="true"
                      className="hidden shrink-0 text-ink-3 transition-transform duration-200 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent sm:block"
                    />
                  </a>
                </li>
              )
            })}
          </ul>
        </Reveal>

        <div className="mt-16 flex items-center justify-between gap-4 text-small text-ink-3 md:mt-24">
          <span className="flex items-center gap-3">
            <Monogram className="h-7 opacity-80" />
            {profile.name}
          </span>
          <a
            href="#/"
            onClick={(event) => {
              event.preventDefault()
              window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? 'auto' : 'smooth' })
            }}
            className="rounded-full px-3 py-2 hover:text-ink"
          >
            Back to top
          </a>
        </div>
      </div>
    </footer>
  )
}
