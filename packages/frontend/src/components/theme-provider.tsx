/**
 * Theme Provider - Manages dark/light theme
 */
import { ReactNode } from 'react'

interface ThemeProviderProps {
  children: ReactNode
  defaultTheme?: string
  storageKey?: string
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  return <>{children}</>
}
