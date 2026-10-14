import { motion as Motion, useReducedMotion } from 'framer-motion'
import { EASE_OUT } from '../../utils/motion'

// Fade plus a 16px rise, once, as the block enters the viewport. Transform strings keep the
// animation on the compositor.
export function Reveal({ as = 'div', delay = 0, children, ...props }) {
  const reduceMotion = useReducedMotion()
  const Component = Motion[as]

  return (
    <Component
      initial={{ opacity: 0, transform: reduceMotion ? 'translateY(0px)' : 'translateY(16px)' }}
      whileInView={{ opacity: 1, transform: 'translateY(0px)' }}
      viewport={{ once: true, margin: '0px 0px -8% 0px' }}
      transition={{ duration: reduceMotion ? 0.2 : 0.6, ease: EASE_OUT, delay }}
      {...props}
    >
      {children}
    </Component>
  )
}
