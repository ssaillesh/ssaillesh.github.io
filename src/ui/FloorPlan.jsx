import { BUILDING, core, rooms } from '../data/rooms.js'

// Architectural plan drawing generated from the same room data as the 3D scene.
// Rooms are real buttons so the plan doubles as navigation.
export default function FloorPlan({ active, onSelect, className = '', showLabels = true }) {
  const pad = 1.2
  const W = BUILDING.maxX - BUILDING.minX + pad * 2
  const H = BUILDING.maxZ - BUILDING.minZ + pad * 2
  const tx = (x) => x - BUILDING.minX + pad
  const tz = (z) => z - BUILDING.minZ + pad
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className={className} role="group" aria-label="Floor plan of the residence">
      <rect x={tx(BUILDING.minX)} y={tz(BUILDING.minZ)} width={BUILDING.maxX - BUILDING.minX} height={BUILDING.maxZ - BUILDING.minZ} fill="none" stroke="#c6a96c" strokeWidth="0.18" />
      <rect
        x={tx(core.bounds.minX)}
        y={tz(core.bounds.minZ)}
        width={core.bounds.maxX - core.bounds.minX}
        height={core.bounds.maxZ - core.bounds.minZ}
        fill="rgba(198,169,108,0.04)"
        stroke="#3a3631"
        strokeWidth="0.06"
        strokeDasharray="0.3 0.3"
      />
      <circle cx={tx(0)} cy={tz(0.5)} r={1.1} fill="none" stroke="#5c574d" strokeWidth="0.06" />
      {rooms.map((r) => {
        const b = r.bounds
        const on = active === r.id
        return (
          <g key={r.id}>
            <a
              href={`#/${r.id}`}
              onClick={(e) => {
                if (onSelect) {
                  e.preventDefault()
                  onSelect(r.id)
                }
              }}
              aria-label={`${r.number} ${r.name}: ${r.kicker}`}
              aria-current={on ? 'true' : undefined}
              className="cursor-pointer outline-none [&:focus-visible_rect]:stroke-[#dcc48f]"
            >
              <rect
                x={tx(b.minX) + 0.12}
                y={tz(b.minZ) + 0.12}
                width={b.maxX - b.minX - 0.24}
                height={b.maxZ - b.minZ - 0.24}
                fill={on ? 'rgba(198,169,108,0.22)' : 'rgba(239,233,221,0.03)'}
                stroke={on ? '#dcc48f' : '#4a4640'}
                strokeWidth="0.1"
                className="transition-[fill] duration-300 hover:fill-[rgba(198,169,108,0.14)]"
              />
              {showLabels && (
                <>
                  <text x={tx((b.minX + b.maxX) / 2)} y={tz((b.minZ + b.maxZ) / 2) - 0.3} textAnchor="middle" fill={on ? '#dcc48f' : '#c6a96c'} fontSize="0.9" fontFamily="JetBrains Mono, monospace">
                    {r.number}
                  </text>
                  <text x={tx((b.minX + b.maxX) / 2)} y={tz((b.minZ + b.maxZ) / 2) + 1.1} textAnchor="middle" fill="#efe9dd" fontSize="1.35" fontFamily="Instrument Serif, serif">
                    {r.name}
                  </text>
                </>
              )}
            </a>
          </g>
        )
      })}
      <path d={`M ${tx(-1.3)} ${tz(9) + 0.05} L ${tx(1.3)} ${tz(9) + 0.05}`} stroke="#0d0d0e" strokeWidth="0.4" />
      <text x={tx(0)} y={tz(9) + 1.0} textAnchor="middle" fill="#8e8a84" fontSize="0.6" fontFamily="JetBrains Mono, monospace" letterSpacing="0.15">
        ENTRANCE
      </text>
    </svg>
  )
}
