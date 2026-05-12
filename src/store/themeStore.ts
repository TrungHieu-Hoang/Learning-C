import { create } from 'zustand'

export type AppTheme = 'mocha' | 'latte' | 'ocean'

interface ThemeState {
  theme: AppTheme
  setTheme: (theme: AppTheme) => void
}

function getInitialTheme(): AppTheme {
  if (typeof window === 'undefined') return 'mocha'
  try {
    const stored = localStorage.getItem('app-theme')
    if (stored === 'mocha' || stored === 'latte' || stored === 'ocean') {
      // Apply class immediately to prevent flash
      const cls = stored === 'mocha' ? '' : `theme-${stored}`
      document.documentElement.className = cls
      return stored
    }
  } catch {}
  if (window.matchMedia?.('(prefers-color-scheme: light)').matches) return 'latte'
  return 'mocha'
}

export const useThemeStore = create<ThemeState>((set) => ({
  theme: getInitialTheme(),
  setTheme: (theme) => {
    try {
      localStorage.setItem('app-theme', theme)
    } catch {}
    const cls = theme === 'mocha' ? '' : `theme-${theme}`
    document.documentElement.className = cls
    set({ theme })
  },
}))
