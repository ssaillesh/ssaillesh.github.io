// True once the first render has committed. A project panel that mounts on the very first
// render came from a direct visit or a refresh, so it skips the shared-element transition.
let firstRenderDone = false

export const markFirstRenderDone = () => {
  firstRenderDone = true
}

export const isFirstRender = () => !firstRenderDone
