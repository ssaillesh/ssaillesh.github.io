import { useId } from 'react'
import { motion as Motion } from 'framer-motion'

const PAPER = '#f3eee2'
const INK = '#1b1b1b'
const SOFT = '#5b554a'
const WINDOW = '#0f0f10'
const SPOOL = '#3b2a20'

const shadeOf = (shell) => `color-mix(in oklab, ${shell}, black 26%)`
const shineOf = (shell) => `color-mix(in oklab, ${shell}, white 24%)`

// Everything a face needs to share: unique SVG ids and the shell's tones.
function useFace(colors) {
  const id = useId().replace(/[^a-zA-Z0-9]/g, '')
  return { id, shell: colors.shell, shade: shadeOf(colors.shell), shine: shineOf(colors.shell) }
}

function MetalDefs({ id }) {
  return (
    <>
      <linearGradient id={`metal${id}`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#fbfbf7" />
        <stop offset="0.45" stopColor="#c8c7bf" />
        <stop offset="0.7" stopColor="#efeee8" />
        <stop offset="1" stopColor="#a9a8a1" />
      </linearGradient>
    </>
  )
}

// Matte shell: the moulded body, the seam where the halves meet, corner screws and grip grooves.
function Shell({ face, withHousing = true }) {
  const { id, shell, shade, shine } = face
  return (
    <>
      <rect width="400" height="254" rx="18" fill={shell} />
      <rect x="8" y="8" width="384" height="238" rx="13" fill="none" stroke={shade} strokeWidth="2" opacity="0.6" />
      <rect x="20" y="5" width="360" height="2.5" rx="1.25" fill={shine} opacity="0.55" />
      {[
        [20, 20],
        [380, 20],
        [20, 234],
        [380, 234],
      ].map(([x, y]) => (
        <g key={`${x}-${y}`}>
          <circle cx={x} cy={y} r="6.2" fill={shade} />
          <circle cx={x} cy={y} r="4.6" fill={`url(#metal${id})`} />
          <path d={`M${x - 3} ${y}h6M${x} ${y - 3}v6`} stroke="#77766f" strokeWidth="1.2" strokeLinecap="round" />
        </g>
      ))}
      {withHousing && (
        <>
          <path d="M84 254 L100 205 Q102 199 108 199 L292 199 Q298 199 300 205 L316 254 Z" fill={shade} />
          {[0, 1, 2, 3, 4].map((i) => (
            <g key={i} stroke={shade} strokeWidth="2.2" strokeLinecap="round" opacity="0.9">
              <path d={`M${44 + i * 7} 206v24`} />
              <path d={`M${328 + i * 7} 206v24`} />
            </g>
          ))}
          <circle cx="128" cy="230" r="7" fill={WINDOW} />
          <circle cx="272" cy="230" r="7" fill={WINDOW} />
          <rect x="174" y="222" width="14" height="14" rx="2" fill={WINDOW} />
          <rect x="212" y="222" width="14" height="14" rx="2" fill={WINDOW} />
        </>
      )}
    </>
  )
}

// One reel hub: a brushed-metal ring with six teeth. Rotates about its own centre when playing.
function Hub({ cx, cy, id }) {
  return (
    <g className="reel">
      <circle cx={cx} cy={cy} r="13.5" fill={`url(#metal${id})`} />
      <circle cx={cx} cy={cy} r="7.5" fill={WINDOW} />
      {[0, 60, 120, 180, 240, 300].map((angle) => (
        <rect
          key={angle}
          x={cx - 1.4}
          y={cy - 7.5}
          width="2.8"
          height="3.6"
          rx="0.6"
          fill="#e7e6df"
          transform={`rotate(${angle} ${cx} ${cy})`}
        />
      ))}
    </g>
  )
}

// Side A: the cassette as it lies on the desk. spin: 'off' | 'slow' | 'fast'.
export function Cassette({ title, subtitle, colors, spin = 'off' }) {
  const face = useFace(colors)
  const clipId = `win${face.id}`

  return (
    <span className="cassette @container relative block aspect-[400/254] w-full select-none" data-spin={spin}>
      <svg viewBox="0 0 400 254" className="absolute inset-0 size-full" aria-hidden="true" focusable="false">
        <defs>
          <MetalDefs id={face.id} />
          <clipPath id={clipId}>
            <rect x="106" y="90" width="188" height="58" rx="29" />
          </clipPath>
        </defs>
        <Shell face={face} />

        {/* Paper label with a micro-shadow along its lower edge, and its colour band */}
        <rect x="28" y="26" width="344" height="150" rx="8" fill="rgba(0,0,0,0.22)" />
        <rect x="28" y="24" width="344" height="150" rx="8" fill={PAPER} />
        <rect x="28" y="154" width="344" height="12" fill={colors.stripe} />

        {/* Window: tape wound mostly onto the left spool, glass with one soft reflection */}
        <rect x="102" y="86" width="196" height="66" rx="33" fill={WINDOW} />
        <g clipPath={`url(#${clipId})`}>
          <rect x="106" y="90" width="188" height="58" fill="#19191b" />
          <circle cx="156" cy="119" r="40" fill={SPOOL} />
          <circle cx="156" cy="119" r="40" fill="none" stroke="#2a1e17" strokeWidth="2" />
          <circle cx="244" cy="119" r="24" fill={SPOOL} />
        </g>
        <Hub cx={156} cy={119} id={face.id} />
        <Hub cx={244} cy={119} id={face.id} />
        <path d="M150 90 L176 90 L140 148 L114 148 Z" fill="#ffffff" opacity="0.06" clipPath={`url(#${clipId})`} />
      </svg>

      {/* Grain over the plastic and over the paper (cached raster, cheap to transform) */}
      <span aria-hidden="true" className="grain-shell absolute inset-0" />
      <span aria-hidden="true" className="grain-paper absolute top-[9.4%] left-[7%] h-[59%] w-[86%] rounded-[1.6cqw]" />

      <span className="pointer-events-none absolute inset-x-[10%] top-[11.5%] flex items-center gap-[2.2cqw]">
        <span
          aria-hidden="true"
          className="grid size-[5.4cqw] shrink-0 place-items-center rounded-[1cqw] text-[3.1cqw] font-bold"
          style={{ backgroundColor: INK, color: PAPER }}
        >
          A
        </span>
        <span className="min-w-0 truncate font-marker text-[6.4cqw] leading-[1.2]" style={{ color: INK }}>
          {title}
        </span>
      </span>
      {subtitle && (
        <span className="pointer-events-none absolute inset-x-[10%] top-[26.5%] block truncate text-[3.1cqw] font-medium" style={{ color: SOFT }}>
          {subtitle}
        </span>
      )}
    </span>
  )
}

// Side B: the back of the same shell with a tracklist sticker carrying the project's details.
export function CassetteBack({ project, detailsId }) {
  const face = useFace(project.tape)
  const rows = [
    ['Stack', project.tags.slice(0, 3).join(' · ')],
    ['Scope', project.sideB.scope],
    ['Status', project.sideB.status],
    ['Result', project.sideB.result],
  ]

  return (
    <span className="cassette @container relative block aspect-[400/254] w-full select-none">
      <svg viewBox="0 0 400 254" className="absolute inset-0 size-full" aria-hidden="true" focusable="false">
        <defs>
          <MetalDefs id={face.id} />
        </defs>
        <Shell face={face} withHousing={false} />
      </svg>
      <span aria-hidden="true" className="grain-shell absolute inset-0" />

      <span
        id={detailsId}
        className="absolute inset-x-[5.5%] top-[7%] bottom-[8%] flex flex-col rounded-[2cqw] px-[4.4cqw] py-[3.6cqw] shadow-[0_1px_0_rgba(0,0,0,0.25),0_6px_14px_-8px_rgba(0,0,0,0.45)]"
        style={{ backgroundColor: PAPER, color: INK, transform: 'rotate(-0.6deg)' }}
      >
        <span aria-hidden="true" className="grain-paper absolute inset-0 rounded-[2cqw]" />
        <span className="relative flex items-center gap-[2.2cqw]">
          <span
            aria-hidden="true"
            className="grid size-[5.4cqw] shrink-0 place-items-center rounded-[1cqw] text-[3.1cqw] font-bold"
            style={{ backgroundColor: INK, color: PAPER }}
          >
            B
          </span>
          <span className="min-w-0 truncate font-marker text-[5.6cqw] leading-[1.2]">{project.title}</span>
        </span>
        <span aria-hidden="true" className="relative mt-[2.2cqw] block h-[1.1cqw] rounded-full" style={{ backgroundColor: project.tape.stripe }} />
        <span className="relative mt-[2.6cqw] grid grid-cols-[15cqw_minmax(0,1fr)] gap-x-[2.6cqw] gap-y-[1.7cqw] text-[3.6cqw] leading-[1.3]">
          {rows.map(([label, value]) => (
            <span key={label} className="contents">
              <span className="font-semibold" style={{ color: SOFT }}>
                {label}
              </span>
              <span className="tabular truncate">{value}</span>
            </span>
          ))}
        </span>
      </span>
    </span>
  )
}

// The cassette as a thin 3D object: front and back faces either side of the shell, with side
// edges so it reads as solid mid-flip. Backfaces are hidden, so no text shows through.
// Must sit inside an element with container-type inline-size and a perspective.
export function TapeBox({ front, back, colors, style, ...motionProps }) {
  const shade = shadeOf(colors.shell)
  return (
    <Motion.span className="tape-box relative block aspect-[400/254] w-full" style={style} {...motionProps}>
      <span aria-hidden="true" className="tape-edge tape-edge-left" style={{ backgroundColor: shade }} />
      <span aria-hidden="true" className="tape-edge tape-edge-right" style={{ backgroundColor: shade }} />
      <span className="tape-face tape-face-front">{front}</span>
      <span className="tape-face tape-face-back">{back}</span>
    </Motion.span>
  )
}
