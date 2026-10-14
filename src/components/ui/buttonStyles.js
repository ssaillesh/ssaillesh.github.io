// One button language for the whole site: flat fill, fully round, press feedback.
const base =
  'pressable inline-flex shrink-0 items-center justify-center gap-2 rounded-full font-semibold whitespace-nowrap select-none disabled:pointer-events-none disabled:opacity-40'

const variants = {
  primary: 'bg-accent text-accent-ink hover:bg-accent-hover',
  secondary: 'bg-raised text-ink hover:bg-[#28282c]',
  quiet: 'text-ink-2 hover:bg-raised hover:text-ink',
}

const sizes = {
  sm: 'h-10 px-4 text-small',
  md: 'h-11 px-5 text-small',
  lg: 'h-12 px-6 text-body',
  icon: 'size-11',
}

export function buttonClass({ variant = 'primary', size = 'md', className = '' } = {}) {
  return [base, variants[variant], sizes[size], className].filter(Boolean).join(' ')
}
