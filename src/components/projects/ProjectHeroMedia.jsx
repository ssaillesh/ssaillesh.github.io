import { useState } from 'react'
import { motion as Motion } from 'framer-motion'
import { asset } from '../../utils/asset'
import { sharedLayoutTransition } from '../../utils/motion'

// The detail hero. The card's thumbnail is already decoded, so it sits underneath and the
// shared-element flight never shows an empty frame; the sharp 1600px image fades in on top.
export function ProjectHeroMedia({ image, layoutId, radius }) {
  // A freshly inserted <img> fires load even when the file is cached, so onLoad is enough.
  const [loaded, setLoaded] = useState(false)

  return (
    <Motion.div
      layoutId={layoutId}
      layoutCrossfade={false}
      transition={sharedLayoutTransition}
      initial={layoutId ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{
        borderTopLeftRadius: radius,
        borderTopRightRadius: radius,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
      }}
      className="relative aspect-video overflow-hidden bg-raised"
    >
      {image.thumb && (
        <img
          src={asset(image.thumb)}
          alt=""
          aria-hidden="true"
          width={image.width}
          height={image.height}
          className="absolute inset-0 size-full object-cover object-top"
        />
      )}
      <img
        src={asset(image.full)}
        width={image.width}
        height={image.height}
        alt={image.alt}
        decoding="async"
        onLoad={() => setLoaded(true)}
        className={`absolute inset-0 size-full object-cover object-top transition-opacity duration-300 ease-out ${
          loaded || !image.thumb ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </Motion.div>
  )
}
