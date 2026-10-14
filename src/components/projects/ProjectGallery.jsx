import { asset } from '../../utils/asset'

// Extra screenshots, loaded only once the panel is open. Each opens at full size in a new tab.
export function ProjectGallery({ images }) {
  return (
    <ul className={`grid gap-6 ${images.length > 1 ? 'sm:grid-cols-2' : ''}`} role="list">
      {images.map((image) => (
        <li key={image.full}>
          <figure>
            <a
              href={asset(image.full)}
              target="_blank"
              rel="noopener noreferrer"
              className="group block overflow-hidden rounded-card bg-raised"
            >
              <img
                src={asset(image.full)}
                width={image.width}
                height={image.height}
                alt={image.alt}
                loading="lazy"
                decoding="async"
                className="aspect-[16/10] w-full object-cover object-top transition-transform duration-300 ease-out group-hover:scale-[1.02]"
              />
              <span className="sr-only"> (opens full size in a new tab)</span>
            </a>
            {image.caption && <figcaption className="mt-2.5 text-small text-ink-2">{image.caption}</figcaption>}
          </figure>
        </li>
      ))}
    </ul>
  )
}
