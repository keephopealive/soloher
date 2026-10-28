import { useCallback, useState } from 'react'

export type Theme = 'light' | 'dark'

function applyTheme(theme: Theme) {
  const root = document.documentElement
  root.classList.add('theme-switching')
  window.setTimeout(() => root.classList.remove('theme-switching'), 500)
  root.dataset.theme = theme
}

/**
 * Light or dark theme. Every visit starts in dark mode (set in index.html before
 * React loads, so there is no flash); the toggle switches it for the current visit.
 */
export function useTheme() {
  const [theme, setTheme] = useState<Theme>(
    () => (document.documentElement.dataset.theme === 'light' ? 'light' : 'dark'),
  )

  const toggle = useCallback(() => {
    setTheme(prev => {
      const next: Theme = prev === 'dark' ? 'light' : 'dark'
      applyTheme(next)
      return next
    })
  }, [])

  return { theme, toggle }
}
