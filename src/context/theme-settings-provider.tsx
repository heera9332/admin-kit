"use client"

import * as React from "react"
import { usePathname } from "next/navigation"
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
  type ThemeMode,
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

type Listener = () => void

class ThemeStore {
  theme: ThemeMode = DEFAULT_THEME_SETTINGS.theme ?? "system"
  color: ThemeColor = DEFAULT_THEME_SETTINGS.color
  radius: ThemeRadius = DEFAULT_THEME_SETTINGS.radius
  layout: ThemeLayout = DEFAULT_THEME_SETTINGS.layout
  sidebarVariant: SidebarVariant = DEFAULT_THEME_SETTINGS.sidebarVariant
  font: ThemeFont = DEFAULT_THEME_SETTINGS.font
  displayFont: ThemeFont = DEFAULT_THEME_SETTINGS.displayFont

  private listeners: Set<Listener> = new Set()
  private initialized = false
  private observer: MutationObserver | null = null
  private isApplying = false
  private mediaQueryList: MediaQueryList | null = null

  private save() {
    try {
      const settings: ThemeSettings = {
        theme: this.theme,
        color: this.color,
        radius: this.radius,
        layout: this.layout,
        sidebarVariant: this.sidebarVariant,
        font: this.font,
        displayFont: this.displayFont,
      }
      localStorage.setItem(THEME_SETTINGS_STORAGE_KEY, JSON.stringify(settings))
      try {
        localStorage.setItem("theme", this.theme)
      } catch {
        // Ignore
      }
    } catch {
      // Ignore
    }
  }

  private loadFromStorage() {
    try {
      let settings: Partial<ThemeSettings> | null = null
      const raw = localStorage.getItem(THEME_SETTINGS_STORAGE_KEY)
      if (raw) {
        settings = JSON.parse(raw) as Partial<ThemeSettings>
      } else {
        // Fallback for migration from legacy separate keys
        const legacyTheme = localStorage.getItem("theme")
        const legacyColor = localStorage.getItem("theme-color") as ThemeColor | null
        const legacyRadius = localStorage.getItem("theme-radius")
        const legacyLayout = localStorage.getItem("theme-layout") as ThemeLayout | null
        const legacySidebar = localStorage.getItem("theme-sidebar-variant") as SidebarVariant | null
        const legacyFont = localStorage.getItem("theme-font") as ThemeFont | null
        const legacyDisplayFont = localStorage.getItem("theme-display-font") as ThemeFont | null

        if (
          legacyTheme ||
          legacyColor ||
          legacyRadius ||
          legacyLayout ||
          legacySidebar ||
          legacyFont ||
          legacyDisplayFont
        ) {
          settings = {
            ...(legacyTheme === "light" || legacyTheme === "dark" || legacyTheme === "system"
              ? { theme: legacyTheme }
              : {}),
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

      if (
        settings?.theme &&
        (settings.theme === "light" || settings.theme === "dark" || settings.theme === "system")
      ) {
        this.theme = settings.theme
      } else {
        const legacyTheme = localStorage.getItem("theme")
        if (legacyTheme === "light" || legacyTheme === "dark" || legacyTheme === "system") {
          this.theme = legacyTheme
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
    } catch {
      // Ignore
    }
  }

  private setupObserver() {
    if (typeof window === "undefined" || this.observer) return

    this.observer = new MutationObserver(() => {
      if (this.isApplying) return
      this.ensureAttributes()
    })

    this.observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: [
        "data-theme",
        "data-layout",
        "data-sidebar-variant",
        "data-font",
        "data-display-font",
        "style",
        "class",
      ],
    })
  }

  private setupMediaQuery() {
    if (typeof window === "undefined" || this.mediaQueryList) return

    try {
      this.mediaQueryList = window.matchMedia("(prefers-color-scheme: dark)")
      this.mediaQueryList.addEventListener("change", () => {
        if (this.theme === "system") {
          this.ensureAttributes()
        }
      })
    } catch {
      // Ignore
    }
  }

  ensureAttributes() {
    if (typeof document === "undefined" || this.isApplying) return

    const root = document.documentElement
    const expectedRadius = `${this.radius}rem`
    const isDark =
      this.theme === "dark" ||
      (this.theme === "system" &&
        typeof window !== "undefined" &&
        window.matchMedia?.("(prefers-color-scheme: dark)").matches)

    const needsTheme = root.getAttribute("data-theme") !== this.color
    const needsLayout = root.getAttribute("data-layout") !== this.layout
    const needsSidebar = root.getAttribute("data-sidebar-variant") !== this.sidebarVariant
    const needsFont = root.getAttribute("data-font") !== this.font
    const needsDisplayFont = root.getAttribute("data-display-font") !== this.displayFont
    const needsRadius = root.style.getPropertyValue("--radius") !== expectedRadius
    const hasDark = root.classList.contains("dark")
    const needsDark = isDark ? !hasDark : hasDark

    if (
      !needsTheme &&
      !needsLayout &&
      !needsSidebar &&
      !needsFont &&
      !needsDisplayFont &&
      !needsRadius &&
      !needsDark
    ) {
      return
    }

    this.isApplying = true
    try {
      if (needsTheme) root.setAttribute("data-theme", this.color)
      if (needsLayout) root.setAttribute("data-layout", this.layout)
      if (needsSidebar) root.setAttribute("data-sidebar-variant", this.sidebarVariant)
      if (needsFont) root.setAttribute("data-font", this.font)
      if (needsDisplayFont) root.setAttribute("data-display-font", this.displayFont)
      if (needsRadius) root.style.setProperty("--radius", expectedRadius)
      if (needsDark) {
        if (isDark) {
          root.classList.add("dark")
        } else {
          root.classList.remove("dark")
        }
      }
    } finally {
      queueMicrotask(() => {
        this.isApplying = false
      })
    }
  }

  init() {
    if (typeof window === "undefined") return

    if (!this.initialized) {
      this.initialized = true
      this.loadFromStorage()
      this.setupObserver()
      this.setupMediaQuery()
    }

    this.ensureAttributes()
    this.emitChange()
  }

  subscribe = (listener: Listener) => {
    this.listeners.add(listener)
    return () => {
      this.listeners.delete(listener)
    }
  }

  getSnapshot = () => {
    return `${this.theme}:${this.color}:${this.radius}:${this.layout}:${this.sidebarVariant}:${this.font}:${this.displayFont}`
  }

  setTheme(newTheme: ThemeMode) {
    if (this.theme === newTheme) return
    this.theme = newTheme
    this.save()
    this.ensureAttributes()
    this.emitChange()
  }

  setColor(newColor: ThemeColor) {
    if (this.color === newColor) return
    this.color = newColor
    this.save()
    this.ensureAttributes()
    this.emitChange()
  }

  setRadius(newRadius: ThemeRadius) {
    if (this.radius === newRadius) return
    this.radius = newRadius
    this.save()
    this.ensureAttributes()
    this.emitChange()
  }

  setLayout(newLayout: ThemeLayout) {
    if (this.layout === newLayout) return
    this.layout = newLayout
    this.save()
    this.ensureAttributes()
    this.emitChange()
  }

  setSidebarVariant(newVariant: SidebarVariant) {
    if (this.sidebarVariant === newVariant) return
    this.sidebarVariant = newVariant
    this.save()
    this.ensureAttributes()
    this.emitChange()
  }

  setFont(newFont: ThemeFont) {
    if (this.font === newFont) return
    this.font = newFont
    this.save()
    this.ensureAttributes()
    this.emitChange()
  }

  setDisplayFont(newDisplayFont: ThemeFont) {
    if (this.displayFont === newDisplayFont) return
    this.displayFont = newDisplayFont
    this.save()
    this.ensureAttributes()
    this.emitChange()
  }

  reset(setThemeFn: (t: string) => void) {
    this.theme = DEFAULT_THEME_SETTINGS.theme ?? "system"
    this.color = DEFAULT_THEME_SETTINGS.color
    this.radius = DEFAULT_THEME_SETTINGS.radius
    this.layout = DEFAULT_THEME_SETTINGS.layout
    this.sidebarVariant = DEFAULT_THEME_SETTINGS.sidebarVariant
    this.font = DEFAULT_THEME_SETTINGS.font
    this.displayFont = DEFAULT_THEME_SETTINGS.displayFont

    this.save()
    setThemeFn(this.theme)
    this.ensureAttributes()
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

const SERVER_SNAPSHOT = `${DEFAULT_THEME_SETTINGS.theme}:${DEFAULT_THEME_SETTINGS.color}:${DEFAULT_THEME_SETTINGS.radius}:${DEFAULT_THEME_SETTINGS.layout}:${DEFAULT_THEME_SETTINGS.sidebarVariant}:${DEFAULT_THEME_SETTINGS.font}:${DEFAULT_THEME_SETTINGS.displayFont}`

export function ThemeSettingsProvider({ children }: { children: React.ReactNode }) {
  const { theme, setTheme } = useTheme()
  const pathname = usePathname()

  const isMounted = React.useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  )

  React.useEffect(() => {
    themeStore.init()
  }, [])

  // Re-ensure attributes whenever the route / locale changes
  React.useEffect(() => {
    themeStore.ensureAttributes()
  }, [pathname])

  // Sync theme changes from next-themes into themeStore
  React.useEffect(() => {
    if (theme && (theme === "light" || theme === "dark" || theme === "system")) {
      if (themeStore.theme !== theme) {
        themeStore.setTheme(theme as ThemeMode)
      }
    }
  }, [theme])

  // On mount, if themeStore has a stored theme that differs from next-themes, sync next-themes
  React.useEffect(() => {
    if (isMounted && themeStore.theme && theme && themeStore.theme !== theme) {
      setTheme(themeStore.theme)
    }
  }, [isMounted, theme, setTheme])

  const snapshot = React.useSyncExternalStore(
    themeStore.subscribe,
    themeStore.getSnapshot,
    () => SERVER_SNAPSHOT
  )

  const handleSetTheme = React.useCallback(
    (newTheme: string) => {
      if (newTheme === "light" || newTheme === "dark" || newTheme === "system") {
        themeStore.setTheme(newTheme as ThemeMode)
      }
      setTheme(newTheme)
    },
    [setTheme]
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
      theme: themeStore.theme,
      setTheme: handleSetTheme,
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
    handleSetTheme,
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
