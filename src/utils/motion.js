// Shared motion vocabulary. The ease-out curve matches --ease-out-strong in index.css.
export const EASE_OUT = [0.22, 1, 0.36, 1]

// The signature shared-element move and the stagger beneath it.
export const SHARED_DURATION = 0.45
export const STAGGER = 0.06

// Reduced motion keeps opacity changes and drops travel and scale.
export const REDUCED_DURATION = 0.15

export const sharedLayoutTransition = { layout: { duration: SHARED_DURATION, ease: EASE_OUT } }
