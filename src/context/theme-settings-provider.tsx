"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import {
  DEFAULT_THEME_SETTINGS,
  THEME_COLORS,
  THEME_RADII,
  THEME_LAYOUTS,
  SIDEBAR_VARIANTS,
  THEME_FONTS,
  type ThemeColor,
  type ThemeLayout,
  type ThemeRadius,
  type SidebarVariant,
  type ThemeFont,
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
  sidebarVariant: SidebarVariant
  setSidebarVariant: (variant: SidebarVariant) => void
  font: ThemeFont
  setFont: (font: ThemeFont) => void
  displayFont: ThemeFont
  setDisplayFont: (font: ThemeFont) => void
  resetThemeSettings: () => void
  isMounted: boolean
}

const STORAGE_KEYS = {
  COLOR: "theme-color",
  RADIUS: "theme-radius",
  LAYOUT: "theme-layout",
  SIDEBAR_VARIANT: "theme-sidebar-variant",
  FONT: "theme-font",
  DISPLAY_FONT: "theme-display-font",
} as const

function applyThemeToDocument(
  color: ThemeColor,
  radius: ThemeRadius,
  layout: ThemeLayout,
  sidebarVariant: SidebarVariant,
  font: ThemeFont,
  displayFont: ThemeFont
) {
  if (typeof document === "undefined") return

  const root = document.documentElement
  root.setAttribute("data-theme", color)
  root.setAttribute("data-layout", layout)
  root.setAttribute("data-sidebar-variant", sidebarVariant)
  root.setAttribute("data-font", font)
  root.setAttribute("data-display-font", displayFont)
  root.style.setProperty("--radius", `${radius}rem`)
}

type Listener = () => void

class ThemeStore {
  color: ThemeColor = DEFAULT_THEME_SETTINGS.color
  radius: ThemeRadius = DEFAULT_THEME_SETTINGS.radius
  layout: ThemeLayout = DEFAULT_THEME_SETTINGS.layout
  sidebarVariant: SidebarVariant = DEFAULT_THEME_SETTINGS.sidebarVariant
  font: ThemeFont = DEFAULT_THEME_SETTINGS.font
  displayFont: ThemeFont = DEFAULT_THEME_SETTINGS.displayFont

  private listeners: Set<Listener> = new Set()
  private initialized = false

  init() {
    if (this.initialized || typeof window === "undefined") return
    this.initialized = true

    try {
      const storedColor = localStorage.getItem(STORAGE_KEYS.COLOR) as ThemeColor | null
      const storedRadius = localStorage.getItem(STORAGE_KEYS.RADIUS)
      const storedLayout = localStorage.getItem(STORAGE_KEYS.LAYOUT) as ThemeLayout | null
      const storedSidebar = localStorage.getItem(STORAGE_KEYS.SIDEBAR_VARIANT) as SidebarVariant | null
      const storedFont = localStorage.getItem(STORAGE_KEYS.FONT) as ThemeFont | null
      const storedDisplayFont = localStorage.getItem(STORAGE_KEYS.DISPLAY_FONT) as ThemeFont | null

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

      if (storedSidebar && SIDEBAR_VARIANTS.some((s) => s.value === storedSidebar)) {
        this.sidebarVariant = storedSidebar
      }

      if (storedFont && THEME_FONTS.some((f) => f.value === storedFont)) {
        this.font = storedFont
      }

      if (storedDisplayFont && THEME_FONTS.some((f) => f.value === storedDisplayFont)) {
        this.displayFont = storedDisplayFont
      }

      applyThemeToDocument(
        this.color,
        this.radius,
        this.layout,
        this.sidebarVariant,
        this.font,
        this.displayFont
      )
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
    return `${this.color}:${this.radius}:${this.layout}:${this.sidebarVariant}:${this.font}:${this.displayFont}`
  }

  setColor(newColor: ThemeColor) {
    this.color = newColor
    try {
      localStorage.setItem(STORAGE_KEYS.COLOR, newColor)
    } catch {
      // Ignore
    }
    applyThemeToDocument(
      this.color,
      this.radius,
      this.layout,
      this.sidebarVariant,
      this.font,
      this.displayFont
    )
    this.emitChange()
  }

  setRadius(newRadius: ThemeRadius) {
    this.radius = newRadius
    try {
      localStorage.setItem(STORAGE_KEYS.RADIUS, newRadius.toString())
    } catch {
      // Ignore
    }
    applyThemeToDocument(
      this.color,
      this.radius,
      this.layout,
      this.sidebarVariant,
      this.font,
      this.displayFont
    )
    this.emitChange()
  }

  setLayout(newLayout: ThemeLayout) {
    this.layout = newLayout
    try {
      localStorage.setItem(STORAGE_KEYS.LAYOUT, newLayout)
    } catch {
      // Ignore
    }
    applyThemeToDocument(
      this.color,
      this.radius,
      this.layout,
      this.sidebarVariant,
      this.font,
      this.displayFont
    )
    this.emitChange()
  }

  setSidebarVariant(newVariant: SidebarVariant) {
    this.sidebarVariant = newVariant
    try {
      localStorage.setItem(STORAGE_KEYS.SIDEBAR_VARIANT, newVariant)
    } catch {
      // Ignore
    }
    applyThemeToDocument(
      this.color,
      this.radius,
      this.layout,
      this.sidebarVariant,
      this.font,
      this.displayFont
    )
    this.emitChange()
  }

  setFont(newFont: ThemeFont) {
    this.font = newFont
    try {
      localStorage.setItem(STORAGE_KEYS.FONT, newFont)
    } catch {
      // Ignore
    }
    applyThemeToDocument(
      this.color,
      this.radius,
      this.layout,
      this.sidebarVariant,
      this.font,
      this.displayFont
    )
    this.emitChange()
  }

  setDisplayFont(newDisplayFont: ThemeFont) {
    this.displayFont = newDisplayFont
    try {
      localStorage.setItem(STORAGE_KEYS.DISPLAY_FONT, newDisplayFont)
    } catch {
      // Ignore
    }
    applyThemeToDocument(
      this.color,
      this.radius,
      this.layout,
      this.sidebarVariant,
      this.font,
      this.displayFont
    )
    this.emitChange()
  }

  reset(setThemeFn: (t: string) => void) {
    setThemeFn("system")
    this.color = DEFAULT_THEME_SETTINGS.color
    this.radius = DEFAULT_THEME_SETTINGS.radius
    this.layout = DEFAULT_THEME_SETTINGS.layout
    this.sidebarVariant = DEFAULT_THEME_SETTINGS.sidebarVariant
    this.font = DEFAULT_THEME_SETTINGS.font
    this.displayFont = DEFAULT_THEME_SETTINGS.displayFont

    try {
      localStorage.setItem(STORAGE_KEYS.COLOR, DEFAULT_THEME_SETTINGS.color)
      localStorage.setItem(STORAGE_KEYS.RADIUS, DEFAULT_THEME_SETTINGS.radius.toString())
      localStorage.setItem(STORAGE_KEYS.LAYOUT, DEFAULT_THEME_SETTINGS.layout)
      localStorage.setItem(STORAGE_KEYS.SIDEBAR_VARIANT, DEFAULT_THEME_SETTINGS.sidebarVariant)
      localStorage.setItem(STORAGE_KEYS.FONT, DEFAULT_THEME_SETTINGS.font)
      localStorage.setItem(STORAGE_KEYS.DISPLAY_FONT, DEFAULT_THEME_SETTINGS.displayFont)
    } catch {
      // Ignore
    }

    applyThemeToDocument(
      this.color,
      this.radius,
      this.layout,
      this.sidebarVariant,
      this.font,
      this.displayFont
    )
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

  if (typeof window !== "undefined") {
    themeStore.init()
  }

  React.useSyncExternalStore(
    themeStore.subscribe,
    themeStore.getSnapshot,
    () =>
      `${DEFAULT_THEME_SETTINGS.color}:${DEFAULT_THEME_SETTINGS.radius}:${DEFAULT_THEME_SETTINGS.layout}:${DEFAULT_THEME_SETTINGS.sidebarVariant}:${DEFAULT_THEME_SETTINGS.font}:${DEFAULT_THEME_SETTINGS.displayFont}`
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

  const setSidebarVariant = React.useCallback((s: SidebarVariant) => {
    themeStore.setSidebarVariant(s)
  }, [])

  const setFont = React.useCallback((f: ThemeFont) => {
    themeStore.setFont(f)
  }, [])

  const setDisplayFont = React.useCallback((f: ThemeFont) => {
    themeStore.setDisplayFont(f)
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
      sidebarVariant: themeStore.sidebarVariant,
      setSidebarVariant,
      font: themeStore.font,
      setFont,
      displayFont: themeStore.displayFont,
      setDisplayFont,
      resetThemeSettings,
      isMounted,
    }),
    [
      theme,
      setTheme,
      setThemeColor,
      setRadius,
      setLayout,
      setSidebarVariant,
      setFont,
      setDisplayFont,
      resetThemeSettings,
      isMounted,
    ]
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
