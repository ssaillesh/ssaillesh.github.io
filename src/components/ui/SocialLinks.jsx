import { Github, Linkedin, Mail } from 'lucide-react'
import { profile } from '../../data/profile'
import { buttonClass } from './buttonStyles'

const links = [
  { label: 'GitHub', href: profile.github, icon: Github, external: true },
  { label: 'LinkedIn', href: profile.linkedin, icon: Linkedin, external: true },
  { label: `Email ${profile.email}`, href: `mailto:${profile.email}`, icon: Mail, external: false },
]

export function SocialLinks({ className = '' }) {
  return (
    <ul className={`flex items-center gap-1 ${className}`} role="list">
      {links.map(({ label, href, icon, external }) => {
        const Icon = icon
        return (
          <li key={label}>
            <a
              href={href}
              aria-label={label}
              title={label}
              className={buttonClass({ variant: 'quiet', size: 'icon' })}
              {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            >
              <Icon size={20} strokeWidth={1.75} aria-hidden="true" />
            </a>
          </li>
        )
      })}
    </ul>
  )
}
