// The homepage as a location object. Used as the background when a project URL is opened
// directly, so the panel always has the portfolio behind it.
export const HOME_LOCATION = { pathname: '/', search: '', hash: '', state: null, key: 'home' }

// Section ids that can also arrive as hash routes (for example /#work opened in a new tab).
export const SECTION_IDS = ['tapes', 'experience', 'contact', 'main']

export const projectPath = (slug) => `/project/${slug}`
