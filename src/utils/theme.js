const THEME_KEY = 'tradeledger-theme'

export function getStoredTheme() {
  const stored = localStorage.getItem(THEME_KEY)

  if (stored === 'light' || stored === 'dark') {
    return stored
  }

  return 'dark'
}

export function applyTheme(theme) {
  const root = document.documentElement

  root.setAttribute('data-theme', theme)
  localStorage.setItem(THEME_KEY, theme)
}

export function resolveThemeByPath(pathname = window.location.pathname) {
  const isDashboard =
    pathname.startsWith('/dash') ||
    pathname.startsWith('/accounts') ||
    pathname.startsWith('/assets') ||
    pathname.startsWith('/strategies') ||
    pathname.startsWith('/tags') ||
    pathname.startsWith('/trades') ||
    pathname.startsWith('/portfolio') ||
    pathname.startsWith('/settings')

  if (!isDashboard) {
    return 'dark'
  }

  return getStoredTheme()
}

export function syncThemeWithRoute(pathname = window.location.pathname) {
  const theme = resolveThemeByPath(pathname)
  applyTheme(theme)
  return theme
}

export function initTheme() {
  return syncThemeWithRoute(window.location.pathname)
}

export function toggleTheme() {
  const current = getStoredTheme()
  const next = current === 'dark' ? 'light' : 'dark'
  applyTheme(next)
  return next
}