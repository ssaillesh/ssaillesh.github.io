import { useId } from 'react'

const PAPER = '#f3eee2'
const INK = '#1b1b1b'
const WINDOW = '#0f0f10'
const SPOOL = '#3b2a20'
const HUB = '#ecebe6'

// One reel hub: a ring with six teeth. Rotates around its own centre when the tape plays.
function Hub({ cx, cy }) {
  return (
    <g className="reel">
      <circle cx={cx} cy={cy} r="13" fill={HUB} />
      <circle cx={cx} cy={cy} r="7.5" fill={WINDOW} />
      {[0, 60, 120, 180, 240, 300].map((angle) => (
        <rect key={angle} x={cx - 1.4} y={cy - 7.5} width="2.8" height="3.6" rx="0.6" fill={HUB} transform={`rotate(${angle} ${cx} ${cy})`} />
      ))}
    </g>
  )
}

// A compact cassette drawn in SVG, with its label written as real text on top.
// spin: 'off' | 'slow' | 'fast' (hover spinning on the shelf is handled in CSS).
export function Cassette({ title, subtitle, colors, spin = 'off', className = '' }) {
  const clipId = `win${useId().replace(/[^a-zA-Z0-9]/g, '')}`
  const shell = colors.shell
  const shade = `color-mix(in oklab, ${shell}, black 24%)`
  const shine = `color-mix(in oklab, ${shell}, white 22%)`

  return (
    <div className={`cassette @container relative aspect-[400/254] w-full select-none ${className}`} data-spin={spin}>
      <svg viewBox="0 0 400 254" className="absolute inset-0 size-full" aria-hidden="true" focusable="false">
        <defs>
          <clipPath id={clipId}>
            <rect x="106" y="90" width="188" height="58" rx="29" />
          </clipPath>
        </defs>

        {/* Shell, with a faint inner edge where the two halves meet */}
        <rect width="400" height="254" rx="18" fill={shell} />
        <rect x="8" y="8" width="384" height="238" rx="13" fill="none" stroke={shade} strokeWidth="2" opacity="0.55" />
        <rect x="18" y="6" width="364" height="3" rx="1.5" fill={shine} opacity="0.5" />

        {/* Corner screws */}
        {[
          [20, 20],
          [380, 20],
          [20, 234],
          [380, 234],
        ].map(([x, y]) => (
          <g key={`${x}-${y}`}>
            <circle cx={x} cy={y} r="6" fill={shade} />
            <path d={`M${x - 3.5} ${y}h7`} stroke={shine} strokeWidth="1.6" strokeLinecap="round" />
          </g>
        ))}

        {/* Paper label and its colour band */}
        <rect x="28" y="24" width="344" height="150" rx="8" fill={PAPER} />
        <rect x="28" y="154" width="344" height="12" fill={colors.stripe} />

        {/* The window, with tape wound mostly on the left spool */}
        <rect x="102" y="86" width="196" height="66" rx="33" fill={WINDOW} />
        <g clipPath={`url(#${clipId})`}>
          <rect x="106" y="90" width="188" height="58" fill="#19191b" />
          <circle cx="156" cy="119" r="40" fill={SPOOL} />
          <circle cx="156" cy="119" r="40" fill="none" stroke="#2a1e17" strokeWidth="2" />
          <circle cx="244" cy="119" r="24" fill={SPOOL} />
        </g>
        <Hub cx={156} cy={119} />
        <Hub cx={244} cy={119} />

        {/* Lower housing with the head and guide holes */}
        <path d="M84 254 L100 205 Q102 199 108 199 L292 199 Q298 199 300 205 L316 254 Z" fill={shade} />
        <circle cx="128" cy="230" r="7" fill={WINDOW} />
        <circle cx="272" cy="230" r="7" fill={WINDOW} />
        <rect x="174" y="222" width="14" height="14" rx="2" fill={WINDOW} />
        <rect x="212" y="222" width="14" height="14" rx="2" fill={WINDOW} />
        <circle cx="200" cy="244" r="4.5" fill={WINDOW} opacity="0.6" />
      </svg>

      <div className="pointer-events-none absolute inset-x-[10%] top-[11.5%] flex items-center gap-[2.2cqw]">
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
      </div>
      {subtitle && (
        <p className="pointer-events-none absolute inset-x-[10%] top-[26.5%] truncate text-[3.1cqw] font-medium text-[#5b554a]">
          {subtitle}
        </p>
      )}
    </div>
  )
}
