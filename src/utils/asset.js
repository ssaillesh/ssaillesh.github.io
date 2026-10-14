// Public files are served from Vite's base path; prefixing keeps every reference correct if it changes.
export const asset = (path) => (path ? `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}` : path)
