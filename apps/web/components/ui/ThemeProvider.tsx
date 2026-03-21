'use client'

import { createContext, useContext, useEffect, useState, useCallback } from 'react'

type Theme = 'dark' | 'light'

interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'dark',
  toggleTheme: () => {},
})

export const useTheme = () => useContext(ThemeContext)

export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [theme, setTheme] = useState<Theme>('dark')

  useEffect(() => {
    const stored = localStorage.getItem('nbs-theme') as Theme | null
    if (stored === 'light' || stored === 'dark') {
      setTheme(stored)
      document.documentElement.setAttribute('data-theme', stored)
    } else {
      // Detect OS preference if no stored preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)')
      const osTheme: Theme = prefersDark.matches ? 'dark' : 'light'
      setTheme(osTheme)
      document.documentElement.setAttribute('data-theme', osTheme)

      // Listen for OS theme changes
      const handleChange = (e: MediaQueryListEvent) => {
        const newTheme: Theme = e.matches ? 'dark' : 'light'
        if (!localStorage.getItem('nbs-theme')) {
          setTheme(newTheme)
          document.documentElement.setAttribute('data-theme', newTheme)
        }
      }
      prefersDark.addEventListener('change', handleChange)
      return () => prefersDark.removeEventListener('change', handleChange)
    }
  }, [])

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark'
      localStorage.setItem('nbs-theme', next)
      document.documentElement.setAttribute('data-theme', next)
      return next
    })
  }, [])

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}
