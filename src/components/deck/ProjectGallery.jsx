import { asset } from '../../utils/asset'

// Extra screenshots on the liner notes, loaded only once the deck is open. Each opens full size in a new tab.
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
              className="group block overflow-hidden rounded-[10px] bg-[#e3dccb]"
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
            {image.caption && <figcaption className="mt-2.5 text-small text-[#5a5449]">{image.caption}</figcaption>}
          </figure>
        </li>
      ))}
    </ul>
  )
}
