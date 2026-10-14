export function TagList({ tags, className = '', tone = 'raised' }) {
  const toneClass = tone === 'raised' ? 'bg-raised text-ink-2' : 'bg-surface text-ink-2'
  return (
    <ul className={`flex flex-wrap gap-2 ${className}`} role="list">
      {tags.map((tag) => (
        <li key={tag} className={`rounded-full px-3 py-1 text-small ${toneClass}`}>
          {tag}
        </li>
      ))}
    </ul>
  )
}
