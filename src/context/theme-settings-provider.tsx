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
  type ThemeSettings,
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

const THEME_SETTINGS_STORAGE_KEY = "theme_settings"

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

  private save() {
    try {
      const settings: ThemeSettings = {
        color: this.color,
        radius: this.radius,
        layout: this.layout,
        sidebarVariant: this.sidebarVariant,
        font: this.font,
        displayFont: this.displayFont,
      }
      localStorage.setItem(THEME_SETTINGS_STORAGE_KEY, JSON.stringify(settings))
    } catch {
      // Ignore
    }
  }

  init() {
    if (this.initialized || typeof window === "undefined") return
    this.initialized = true

    try {
      let settings: Partial<ThemeSettings> | null = null
      const raw = localStorage.getItem(THEME_SETTINGS_STORAGE_KEY)
      if (raw) {
        settings = JSON.parse(raw) as Partial<ThemeSettings>
      } else {
        // Fallback for migration from legacy separate keys
        const legacyColor = localStorage.getItem("theme-color") as ThemeColor | null
        const legacyRadius = localStorage.getItem("theme-radius")
        const legacyLayout = localStorage.getItem("theme-layout") as ThemeLayout | null
        const legacySidebar = localStorage.getItem("theme-sidebar-variant") as SidebarVariant | null
        const legacyFont = localStorage.getItem("theme-font") as ThemeFont | null
        const legacyDisplayFont = localStorage.getItem("theme-display-font") as ThemeFont | null

        if (
          legacyColor ||
          legacyRadius ||
          legacyLayout ||
          legacySidebar ||
          legacyFont ||
          legacyDisplayFont
        ) {
          settings = {
            ...(legacyColor ? { color: legacyColor } : {}),
            ...(legacyRadius ? { radius: parseFloat(legacyRadius) as ThemeRadius } : {}),
            ...(legacyLayout ? { layout: legacyLayout } : {}),
            ...(legacySidebar ? { sidebarVariant: legacySidebar } : {}),
            ...(legacyFont ? { font: legacyFont } : {}),
            ...(legacyDisplayFont ? { displayFont: legacyDisplayFont } : {}),
          }
          try {
            localStorage.removeItem("theme-color")
            localStorage.removeItem("theme-radius")
            localStorage.removeItem("theme-layout")
            localStorage.removeItem("theme-sidebar-variant")
            localStorage.removeItem("theme-font")
            localStorage.removeItem("theme-display-font")
          } catch {
            // Ignore
          }
        }
      }

      if (settings?.color && THEME_COLORS.some((c) => c.name === settings.color)) {
        this.color = settings.color
      }

      if (
        settings?.radius !== undefined &&
        THEME_RADII.some((r) => r.value === settings.radius)
      ) {
        this.radius = settings.radius
      }

      if (settings?.layout && THEME_LAYOUTS.some((l) => l.value === settings.layout)) {
        this.layout = settings.layout
      }

      if (
        settings?.sidebarVariant &&
        SIDEBAR_VARIANTS.some((s) => s.value === settings.sidebarVariant)
      ) {
        this.sidebarVariant = settings.sidebarVariant
      }

      if (settings?.font && THEME_FONTS.some((f) => f.value === settings.font)) {
        this.font = settings.font
      }

      if (
        settings?.displayFont &&
        THEME_FONTS.some((f) => f.value === settings.displayFont)
      ) {
        this.displayFont = settings.displayFont
      }

      this.save()

      applyThemeToDocument(
        this.color,
        this.radius,
        this.layout,
        this.sidebarVariant,
        this.font,
        this.displayFont
      )
      this.emitChange()
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
    this.save()
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
    this.save()
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
    this.save()
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
    this.save()
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
    this.save()
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
    this.save()
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

    this.save()

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

const SERVER_SNAPSHOT = `${DEFAULT_THEME_SETTINGS.color}:${DEFAULT_THEME_SETTINGS.radius}:${DEFAULT_THEME_SETTINGS.layout}:${DEFAULT_THEME_SETTINGS.sidebarVariant}:${DEFAULT_THEME_SETTINGS.font}:${DEFAULT_THEME_SETTINGS.displayFont}`

export function ThemeSettingsProvider({ children }: { children: React.ReactNode }) {
  const { theme, setTheme } = useTheme()

  const isMounted = React.useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  )

  React.useEffect(() => {
    themeStore.init()
  }, [])

  const snapshot = React.useSyncExternalStore(
    themeStore.subscribe,
    themeStore.getSnapshot,
    () => SERVER_SNAPSHOT
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

  const contextValue = React.useMemo<ThemeSettingsContextType>(() => {
    void snapshot
    return {
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
    }
  }, [
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
    snapshot,
  ])

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
