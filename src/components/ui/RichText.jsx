// Renders **double-asterisk** spans as <strong>. Used for technology names in experience bullets.
export function RichText({ text }) {
  const parts = text.split(/\*\*(.+?)\*\*/g)
  return parts.map((part, index) =>
    index % 2 === 1 ? (
      <strong key={index} className="font-semibold text-ink">
        {part}
      </strong>
    ) : (
      part
    ),
  )
}
