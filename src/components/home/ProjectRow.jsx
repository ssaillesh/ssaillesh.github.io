import { useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { prefersReducedMotion } from '../../utils/scroll'
import { Reveal } from '../ui/Reveal'
import { ProjectCard } from './ProjectCard'

const EDGE_TOLERANCE = 8

export function ProjectRow({ row }) {
  const wrapperRef = useRef(null)
  const scrollerRef = useRef(null)
  const warmTimer = useRef(0)
  const coolTimer = useRef(0)
  const [edges, setEdges] = useState({ prev: false, next: false })
  const scrollerId = `row-${row.id}`

  useEffect(() => {
    const scroller = scrollerRef.current
    if (!scroller) return undefined
    const update = () => {
      const prev = scroller.scrollLeft > EDGE_TOLERANCE
      const next = scroller.scrollLeft + scroller.clientWidth < scroller.scrollWidth - EDGE_TOLERANCE
      setEdges((current) => (current.prev === prev && current.next === next ? current : { prev, next }))
    }
    update()
    scroller.addEventListener('scroll', update, { passive: true })
    const observer = new ResizeObserver(update)
    observer.observe(scroller)
    return () => {
      scroller.removeEventListener('scroll', update)
      observer.disconnect()
      clearTimeout(warmTimer.current)
      clearTimeout(coolTimer.current)
    }
  }, [])

  const page = (direction) => {
    const scroller = scrollerRef.current
    scroller.scrollBy({ left: direction * scroller.clientWidth * 0.8, behavior: prefersReducedMotion() ? 'auto' : 'smooth' })
  }

  // A card at the edge of the visible row grows inward so the preview is never cut off.
  const setOrigin = (card) => {
    const bounds = scrollerRef.current.getBoundingClientRect()
    const rect = card.getBoundingClientRect()
    card.dataset.origin =
      rect.left < bounds.left + EDGE_TOLERANCE ? 'start' : rect.right > bounds.right - EDGE_TOLERANCE ? 'end' : 'center'
  }

  // The first preview waits ~300ms; once one is open the row is "warm" and neighbours open instantly.
  // Written straight to the DOM so hovering never re-renders the row.
  const onPointerOver = (event) => {
    const card = event.target.closest('[data-card]')
    if (!card) return
    setOrigin(card)
    clearTimeout(coolTimer.current)
    if (wrapperRef.current.dataset.warm !== 'true') {
      clearTimeout(warmTimer.current)
      warmTimer.current = setTimeout(() => {
        wrapperRef.current.dataset.warm = 'true'
      }, 300)
    }
  }

  const onPointerLeave = () => {
    clearTimeout(warmTimer.current)
    coolTimer.current = setTimeout(() => {
      if (wrapperRef.current) wrapperRef.current.dataset.warm = 'false'
    }, 200)
  }

  const onFocus = (event) => {
    const card = event.target.closest('[data-card]')
    if (card) setOrigin(card)
  }

  const arrowClass =
    'pressable absolute top-[calc(50%-24px)] z-30 hidden size-12 -translate-y-1/2 place-items-center rounded-full bg-raised/95 text-ink shadow-[0_12px_32px_-12px_rgba(0,0,0,0.9)] opacity-0 transition-opacity duration-200 group-hover/row:opacity-100 hover:bg-[#2a2a2e] focus-visible:opacity-100 [@media(pointer:fine)]:grid'

  return (
    <div ref={wrapperRef} className="group/row" data-warm="false">
      <Reveal className="page-width">
        <h3 className="text-lead font-semibold text-ink">{row.title}</h3>
      </Reveal>
      <div className="relative mt-4" onPointerOver={onPointerOver} onPointerLeave={onPointerLeave} onFocus={onFocus}>
        <ul ref={scrollerRef} id={scrollerId} className="row-scroller" role="list" aria-label={row.title}>
          {row.projects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </ul>
        {edges.prev && (
          <button
            type="button"
            onClick={() => page(-1)}
            aria-controls={scrollerId}
            aria-label={`Scroll ${row.title} back`}
            className={`${arrowClass} left-[max(8px,calc(var(--edge)-60px))]`}
          >
            <ChevronLeft size={22} aria-hidden="true" />
          </button>
        )}
        {edges.next && (
          <button
            type="button"
            onClick={() => page(1)}
            aria-controls={scrollerId}
            aria-label={`Scroll ${row.title} forward`}
            className={`${arrowClass} right-[max(8px,calc(var(--edge)-60px))]`}
          >
            <ChevronRight size={22} aria-hidden="true" />
          </button>
        )}
      </div>
    </div>
  )
}
