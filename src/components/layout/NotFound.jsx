import { useEffect } from 'react'
import { Link } from 'react-router'
import { profile } from '../../data/profile'
import { buttonClass } from '../ui/buttonStyles'
import { Monogram } from '../ui/Monogram'

export function NotFound() {
  useEffect(() => {
    document.title = `Page not found | ${profile.name}`
  }, [])

  return (
    <main className="page-width flex min-h-svh flex-col justify-center py-24">
      <Link to="/" aria-label={`${profile.name}, home`} className="pressable -ml-2 w-fit rounded-full p-2">
        <Monogram className="h-12" />
      </Link>
      <h1 className="mt-10 text-display font-bold text-ink">Page not found</h1>
      <p className="mt-5 max-w-[48ch] text-lead text-ink-2">
        There is nothing at this address. The portfolio, projects and résumé are one click away.
      </p>
      <Link to="/" className={buttonClass({ size: 'lg', className: 'mt-10 w-fit' })}>
        Back to the portfolio
      </Link>
    </main>
  )
}
