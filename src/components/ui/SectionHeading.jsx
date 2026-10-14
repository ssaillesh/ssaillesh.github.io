export function SectionHeading({ id, title, description, className = '' }) {
  return (
    <div className={className}>
      <h2 id={id} className="text-head font-semibold text-ink">
        {title}
      </h2>
      {description && <p className="mt-3 max-w-[62ch] text-ink-2">{description}</p>}
    </div>
  )
}
