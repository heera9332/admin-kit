"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import {
  DEFAULT_THEME_SETTINGS,
  THEME_COLORS,
  THEME_RADII,
  THEME_LAYOUTS,
  type ThemeColor,
  type ThemeLayout,
  type ThemeRadius,
} from "@/config/themes"

interface ThemeSettingsContextType {
  theme: string | undefined
  setTheme: (theme: string) => void
  themeColor: ThemeColor
  setThemeColor: (color: ThemeColor) => void
  radius: ThemeRadius
  setRadius: (radius: ThemeRadius) => void
  layout: ThemeLayout
  setLayout: (layout: ThemeLayout) => void
  resetThemeSettings: () => void
  isMounted: boolean
}

const STORAGE_KEYS = {
  COLOR: "theme-color",
  RADIUS: "theme-radius",
  LAYOUT: "theme-layout",
} as const

function applyThemeToDocument(color: ThemeColor, radius: ThemeRadius, layout: ThemeLayout) {
  if (typeof document === "undefined") return

  const root = document.documentElement
  root.setAttribute("data-theme", color)
  root.setAttribute("data-layout", layout)
  root.style.setProperty("--radius", `${radius}rem`)
}

type Listener = () => void

class ThemeStore {
  color: ThemeColor = DEFAULT_THEME_SETTINGS.color
  radius: ThemeRadius = DEFAULT_THEME_SETTINGS.radius
  layout: ThemeLayout = DEFAULT_THEME_SETTINGS.layout
  private listeners: Set<Listener> = new Set()
  private initialized = false

  init() {
    if (this.initialized || typeof window === "undefined") return
    this.initialized = true

    try {
      const storedColor = localStorage.getItem(STORAGE_KEYS.COLOR) as ThemeColor | null
      const storedRadius = localStorage.getItem(STORAGE_KEYS.RADIUS)
      const storedLayout = localStorage.getItem(STORAGE_KEYS.LAYOUT) as ThemeLayout | null

      if (storedColor && THEME_COLORS.some((c) => c.name === storedColor)) {
        this.color = storedColor
      }

      const parsedRadius = storedRadius ? parseFloat(storedRadius) : NaN
      if (!isNaN(parsedRadius) && THEME_RADII.some((r) => r.value === parsedRadius)) {
        this.radius = parsedRadius as ThemeRadius
      }

      if (storedLayout && THEME_LAYOUTS.some((l) => l.value === storedLayout)) {
        this.layout = storedLayout
      }

      applyThemeToDocument(this.color, this.radius, this.layout)
    } catch {
      // Ignore
    }
  }

  subscribe = (listener: Listener) => {
    this.listeners.add(listener)
    return () => {
      this.listeners.delete(listener)
    }
  }

  getSnapshot = () => {
    return `${this.color}:${this.radius}:${this.layout}`
  }

  setColor(newColor: ThemeColor) {
    this.color = newColor
    try {
      localStorage.setItem(STORAGE_KEYS.COLOR, newColor)
    } catch {
      // Ignore
    }
    applyThemeToDocument(this.color, this.radius, this.layout)
    this.emitChange()
  }

  setRadius(newRadius: ThemeRadius) {
    this.radius = newRadius
    try {
      localStorage.setItem(STORAGE_KEYS.RADIUS, newRadius.toString())
    } catch {
      // Ignore
    }
    applyThemeToDocument(this.color, this.radius, this.layout)
    this.emitChange()
  }

  setLayout(newLayout: ThemeLayout) {
    this.layout = newLayout
    try {
      localStorage.setItem(STORAGE_KEYS.LAYOUT, newLayout)
    } catch {
      // Ignore
    }
    applyThemeToDocument(this.color, this.radius, this.layout)
    this.emitChange()
  }

  reset(setThemeFn: (t: string) => void) {
    setThemeFn("system")
    this.color = DEFAULT_THEME_SETTINGS.color
    this.radius = DEFAULT_THEME_SETTINGS.radius
    this.layout = DEFAULT_THEME_SETTINGS.layout

    try {
      localStorage.setItem(STORAGE_KEYS.COLOR, DEFAULT_THEME_SETTINGS.color)
      localStorage.setItem(STORAGE_KEYS.RADIUS, DEFAULT_THEME_SETTINGS.radius.toString())
      localStorage.setItem(STORAGE_KEYS.LAYOUT, DEFAULT_THEME_SETTINGS.layout)
    } catch {
      // Ignore
    }

    applyThemeToDocument(this.color, this.radius, this.layout)
    this.emitChange()
  }

  private emitChange() {
    for (const listener of this.listeners) {
      listener()
    }
  }
}

const themeStore = new ThemeStore()

const ThemeSettingsContext = React.createContext<ThemeSettingsContextType | null>(null)

const emptySubscribe = () => () => {}

export function ThemeSettingsProvider({ children }: { children: React.ReactNode }) {
  const { theme, setTheme } = useTheme()

  const isMounted = React.useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  )

  // Initialize store on client side once
  if (typeof window !== "undefined") {
    themeStore.init()
  }

  React.useSyncExternalStore(
    themeStore.subscribe,
    themeStore.getSnapshot,
    () => `${DEFAULT_THEME_SETTINGS.color}:${DEFAULT_THEME_SETTINGS.radius}:${DEFAULT_THEME_SETTINGS.layout}`
  )

  const setThemeColor = React.useCallback((color: ThemeColor) => {
    themeStore.setColor(color)
  }, [])

  const setRadius = React.useCallback((r: ThemeRadius) => {
    themeStore.setRadius(r)
  }, [])

  const setLayout = React.useCallback((l: ThemeLayout) => {
    themeStore.setLayout(l)
  }, [])

  const resetThemeSettings = React.useCallback(() => {
    themeStore.reset(setTheme)
  }, [setTheme])

  const contextValue = React.useMemo<ThemeSettingsContextType>(
    () => ({
      theme,
      setTheme,
      themeColor: themeStore.color,
      setThemeColor,
      radius: themeStore.radius,
      setRadius,
      layout: themeStore.layout,
      setLayout,
      resetThemeSettings,
      isMounted,
    }),
    [theme, setTheme, setThemeColor, setRadius, setLayout, resetThemeSettings, isMounted]
  )

  return (
    <ThemeSettingsContext.Provider value={contextValue}>
      {children}
    </ThemeSettingsContext.Provider>
  )
}

export function useThemeSettings() {
  const context = React.useContext(ThemeSettingsContext)
  if (!context) {
    throw new Error("useThemeSettings must be used within ThemeSettingsProvider")
  }
  return context
}
