import { useCallback, useEffect, useState } from 'react'

export type Theme = 'light' | 'dark'

const STORAGE_KEY = 'soloher-theme'

function savedTheme(): Theme | null {
  try {
    const t = localStorage.getItem(STORAGE_KEY)
    return t === 'light' || t === 'dark' ? t : null
  } catch {
    return null
  }
}

function applyTheme(theme: Theme, animate: boolean) {
  const root = document.documentElement
  if (animate) {
    root.classList.add('theme-switching')
    window.setTimeout(() => root.classList.remove('theme-switching'), 500)
  }
  root.dataset.theme = theme
}

/**
 * Light or dark theme. index.html sets the initial theme before React loads
 * (saved choice, else the device setting) so there is no flash; this hook
 * keeps it in sync and remembers the visitor's choice.
 */
export function useTheme() {
  const [theme, setTheme] = useState<Theme>(
    () => (document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light'),
  )

  // Until the visitor picks a theme, follow the device setting as it changes
  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = () => {
      if (savedTheme()) return
      const next: Theme = media.matches ? 'dark' : 'light'
      applyTheme(next, true)
      setTheme(next)
    }
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [])

  const toggle = useCallback(() => {
    setTheme(prev => {
      const next: Theme = prev === 'dark' ? 'light' : 'dark'
      applyTheme(next, true)
      try {
        localStorage.setItem(STORAGE_KEY, next)
      } catch {
        // storage unavailable (private mode); the choice lasts for this visit only
      }
      return next
    })
  }, [])

  return { theme, toggle }
}
