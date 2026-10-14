// Remembers which control opened the project panel so focus can go back to it on close.
let target = null

export function rememberFocus(element) {
  target = element ?? null
}

export function restoreFocus() {
  const element = target
  target = null
  if (element && element.isConnected) element.focus({ preventScroll: true })
}
