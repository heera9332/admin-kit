"use client"

import * as React from "react"
import {
  Sun,
  Moon,
  Laptop,
  Check,
  RotateCcw,
  Maximize2,
  Minimize2,
} from "lucide-react"
import { useThemeSettings } from "@/context/theme-settings-provider"
import {
  THEME_COLORS,
  THEME_RADII,
  THEME_LAYOUTS,
  type ThemeColor,
  type ThemeRadius,
  type ThemeLayout,
} from "@/config/themes"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { CopyCodeDialog } from "./copy-code-dialog"
import { ThemePreviewCard } from "./theme-preview-card"

export function ThemeSettingsForm() {
  const {
    theme,
    setTheme,
    themeColor,
    setThemeColor,
    radius,
    setRadius,
    layout,
    setLayout,
    resetThemeSettings,
    isMounted,
  } = useThemeSettings()

  const [notification, setNotification] = React.useState<string | null>(null)

  const showFeedback = (msg: string) => {
    setNotification(msg)
    setTimeout(() => setNotification(null), 2500)
  }

  if (!isMounted) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="space-y-2">
          <div className="h-6 w-40 rounded bg-muted" />
          <div className="h-4 w-72 rounded bg-muted" />
        </div>
        <Separator />
        <div className="h-32 rounded-lg bg-muted" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-base font-semibold">Theme Settings</h3>
          <p className="text-xs text-muted-foreground">
            Adjust the appearance and layout to suit your preferences.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <CopyCodeDialog color={themeColor} radius={radius} />
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              resetThemeSettings()
              showFeedback("Settings restored to defaults")
            }}
            className="h-8 gap-1.5 text-xs"
          >
            <RotateCcw className="size-3.5 text-muted-foreground" />
            <span>Reset</span>
          </Button>
        </div>
      </div>

      <Separator />

      {/* Theme Mode Section */}
      <div className="space-y-3.5">
        <div>
          <h4 className="text-xs font-semibold text-foreground">Color Mode</h4>
          <p className="text-xs text-muted-foreground">
            Select light, dark, or automatic system theme.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3 max-w-lg">
          {/* Light Mode */}
          <button
            type="button"
            onClick={() => setTheme("light")}
            className={cn(
              "group relative flex flex-col items-center gap-2 rounded-xl border-2 p-2.5 transition-all text-left cursor-pointer",
              theme === "light"
                ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                : "border-border/80 bg-card hover:border-primary/40"
            )}
          >
            <div className="w-full aspect-16/10 rounded-lg border border-zinc-200 bg-white p-2 flex flex-col justify-between shadow-xs overflow-hidden">
              <div className="flex items-center gap-1">
                <div className="h-2 w-2 rounded-full bg-zinc-300" />
                <div className="h-1.5 w-8 rounded-sm bg-zinc-200" />
              </div>
              <div className="space-y-1">
                <div className="h-1.5 w-full rounded-sm bg-zinc-100" />
                <div className="h-1.5 w-3/4 rounded-sm bg-zinc-200" />
              </div>
            </div>
            <div className="flex items-center justify-between w-full px-1">
              <span className="flex items-center gap-1.5 text-xs font-medium">
                <Sun className="size-3.5 text-amber-500" />
                <span>Light</span>
              </span>
              {theme === "light" && <Check className="size-3.5 text-primary" />}
            </div>
          </button>

          {/* Dark Mode */}
          <button
            type="button"
            onClick={() => setTheme("dark")}
            className={cn(
              "group relative flex flex-col items-center gap-2 rounded-xl border-2 p-2.5 transition-all text-left cursor-pointer",
              theme === "dark"
                ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                : "border-border/80 bg-card hover:border-primary/40"
            )}
          >
            <div className="w-full aspect-16/10 rounded-lg border border-zinc-800 bg-zinc-950 p-2 flex flex-col justify-between shadow-xs overflow-hidden">
              <div className="flex items-center gap-1">
                <div className="h-2 w-2 rounded-full bg-zinc-700" />
                <div className="h-1.5 w-8 rounded-sm bg-zinc-700" />
              </div>
              <div className="space-y-1">
                <div className="h-1.5 w-full rounded-sm bg-zinc-900" />
                <div className="h-1.5 w-3/4 rounded-sm bg-zinc-800" />
              </div>
            </div>
            <div className="flex items-center justify-between w-full px-1">
              <span className="flex items-center gap-1.5 text-xs font-medium">
                <Moon className="size-3.5 text-blue-400" />
                <span>Dark</span>
              </span>
              {theme === "dark" && <Check className="size-3.5 text-primary" />}
            </div>
          </button>

          {/* System Mode */}
          <button
            type="button"
            onClick={() => setTheme("system")}
            className={cn(
              "group relative flex flex-col items-center gap-2 rounded-xl border-2 p-2.5 transition-all text-left cursor-pointer",
              theme === "system"
                ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                : "border-border/80 bg-card hover:border-primary/40"
            )}
          >
            <div className="w-full aspect-16/10 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-gradient-to-r from-white via-zinc-200 to-zinc-950 p-2 flex flex-col justify-between shadow-xs overflow-hidden">
              <div className="flex items-center gap-1">
                <div className="h-2 w-2 rounded-full bg-zinc-400" />
                <div className="h-1.5 w-8 rounded-sm bg-zinc-400" />
              </div>
              <div className="space-y-1">
                <div className="h-1.5 w-full rounded-sm bg-zinc-400/50" />
                <div className="h-1.5 w-3/4 rounded-sm bg-zinc-500/50" />
              </div>
            </div>
            <div className="flex items-center justify-between w-full px-1">
              <span className="flex items-center gap-1.5 text-xs font-medium">
                <Laptop className="size-3.5 text-muted-foreground" />
                <span>System</span>
              </span>
              {theme === "system" && <Check className="size-3.5 text-primary" />}
            </div>
          </button>
        </div>
      </div>

      <Separator />

      {/* Primary Color Section */}
      <div className="space-y-3.5">
        <div>
          <h4 className="text-xs font-semibold text-foreground">Color Palette</h4>
          <p className="text-xs text-muted-foreground">
            Select the primary brand and accent color for UI components.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
          {THEME_COLORS.map((c) => {
            const isSelected = themeColor === c.name
            const activeHex = theme === "dark" ? c.activeColor.dark : c.activeColor.light

            return (
              <button
                key={c.name}
                type="button"
                onClick={() => setThemeColor(c.name as ThemeColor)}
                className={cn(
                  "flex items-center gap-2.5 rounded-lg border px-3 py-2 text-xs font-medium transition-all text-left cursor-pointer",
                  isSelected
                    ? "border-primary bg-primary/10 text-foreground font-semibold shadow-xs ring-1 ring-primary/30"
                    : "border-border/80 bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground"
                )}
              >
                <span
                  className="flex size-4.5 shrink-0 items-center justify-center rounded-full shadow-2xs"
                  style={{ backgroundColor: activeHex }}
                >
                  {isSelected && <Check className="size-3 text-white stroke-[3]" />}
                </span>
                <span className="truncate">{c.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      <Separator />

      {/* Border Radius Section */}
      <div className="space-y-3.5">
        <div>
          <h4 className="text-xs font-semibold text-foreground">Radius</h4>
          <p className="text-xs text-muted-foreground">
            Adjust the border radius across buttons, cards, dialogs, and inputs.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {THEME_RADII.map((r) => {
            const isSelected = radius === r.value

            return (
              <button
                key={r.value}
                type="button"
                onClick={() => setRadius(r.value as ThemeRadius)}
                className={cn(
                  "flex items-center gap-2 rounded-lg border px-3.5 py-1.5 text-xs font-medium transition-all cursor-pointer",
                  isSelected
                    ? "border-primary bg-primary text-primary-foreground font-semibold shadow-xs"
                    : "border-border/80 bg-card text-foreground hover:border-primary/40 hover:bg-muted/50"
                )}
              >
                <span
                  className="size-3.5 border border-current"
                  style={{
                    borderRadius: `${r.value * 0.4}rem`,
                  }}
                />
                <span>{r.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      <Separator />

      {/* Layout Style Section */}
      <div className="space-y-3.5">
        <div>
          <h4 className="text-xs font-semibold text-foreground">Layout Style</h4>
          <p className="text-xs text-muted-foreground">
            Choose how dashboard pages fit within the viewport.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg">
          {THEME_LAYOUTS.map((item) => {
            const isSelected = layout === item.value

            return (
              <button
                key={item.value}
                type="button"
                onClick={() => setLayout(item.value as ThemeLayout)}
                className={cn(
                  "flex items-start gap-3 rounded-xl border-2 p-3.5 transition-all text-left cursor-pointer",
                  isSelected
                    ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                    : "border-border/80 bg-card hover:border-primary/40"
                )}
              >
                <div className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-lg bg-muted text-foreground">
                  {item.value === "fluid" ? (
                    <Maximize2 className="size-4" />
                  ) : (
                    <Minimize2 className="size-4" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold">{item.label}</span>
                    {isSelected && <Check className="size-3.5 text-primary" />}
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      <Separator />

      {/* Live Preview Section */}
      <ThemePreviewCard />

      {/* Notification Toast Confirmation */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 rounded-lg bg-foreground text-background px-4 py-2 text-xs font-medium shadow-lg animate-in fade-in slide-in-from-bottom-2">
          {notification}
        </div>
      )}
    </div>
  )
}
