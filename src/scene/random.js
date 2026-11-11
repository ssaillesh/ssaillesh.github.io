// Deterministic pseudo-random sequence so procedural layouts are identical on every load.
export function seeded(seed) {
  let s = seed
  return () => {
    s = (s * 16807) % 2147483647
    return s / 2147483647
  }
}
