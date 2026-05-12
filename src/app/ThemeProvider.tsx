'use client'
import { useEffect, type ReactNode } from 'react'
import { useThemeStore } from '@/store/themeStore'

export function ThemeProvider({ children }: { children: ReactNode }) {
  const theme = useThemeStore((s) => s.theme)

  useEffect(() => {
    const cls = theme === 'mocha' ? '' : `theme-${theme}`
    document.documentElement.className = cls
  }, [theme])

  return <>{children}</>
}
