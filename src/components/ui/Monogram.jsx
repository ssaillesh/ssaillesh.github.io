import { asset } from '../../utils/asset'

// The original brush-stroke SM logo. Decorative here: every link that wraps it carries the name.
export function Monogram({ className = 'h-8' }) {
  return (
    <img
      src={asset('/images/logo-sm.webp')}
      width={107}
      height={128}
      alt=""
      aria-hidden="true"
      decoding="async"
      className={`w-auto select-none ${className}`}
    />
  )
}
