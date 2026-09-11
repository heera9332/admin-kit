"use client"

import * as React from "react"
import { useServerInsertedHTML } from "next/navigation"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { ThemeSettingsProvider } from "@/context/theme-settings-provider"

if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
  const originalError = console.error
  console.error = (...args: unknown[]) => {
    if (typeof args[0] === "string" && args[0].includes("Encountered a script tag")) {
      return
    }
    originalError.apply(console, args)
  }
}

const themeInitScript = `try {
  var settings = null;
  try {
    var raw = localStorage.getItem('theme_settings');
    if (raw) settings = JSON.parse(raw);
  } catch (e) {}
  var color = (settings && settings.color) || localStorage.getItem('theme-color') || 'zinc';
  var radius = (settings && settings.radius !== undefined) ? settings.radius : (localStorage.getItem('theme-radius') || '0.5');
  var layout = (settings && settings.layout) || localStorage.getItem('theme-layout') || 'fluid';
  var sidebarVariant = (settings && settings.sidebarVariant) || localStorage.getItem('theme-sidebar-variant') || 'default';
  var font = (settings && settings.font) || localStorage.getItem('theme-font') || 'lexend';
  var displayFont = (settings && settings.displayFont) || localStorage.getItem('theme-display-font') || 'lexend';
  document.documentElement.setAttribute('data-theme', color);
  document.documentElement.setAttribute('data-layout', layout);
  document.documentElement.setAttribute('data-sidebar-variant', sidebarVariant);
  document.documentElement.setAttribute('data-font', font);
  document.documentElement.setAttribute('data-display-font', displayFont);
  document.documentElement.style.setProperty('--radius', radius + 'rem');
} catch (e) {}`

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  useServerInsertedHTML(() => {
    return (
      <script
        key="theme-settings-init"
        dangerouslySetInnerHTML={{ __html: themeInitScript }}
      />
    )
  })

  return (
    <NextThemesProvider {...props}>
      <ThemeSettingsProvider>{children}</ThemeSettingsProvider>
    </NextThemesProvider>
  )
}
