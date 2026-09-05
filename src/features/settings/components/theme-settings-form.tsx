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
  PanelLeft,
  LayoutTemplate,
  SquareDashedBottomCode,
  Type,
} from "lucide-react"
import { useThemeSettings } from "@/context/theme-settings-provider"
import {
  THEME_COLORS,
  THEME_RADII,
  THEME_LAYOUTS,
  SIDEBAR_VARIANTS,
  THEME_FONTS,
  type ThemeColor,
  type ThemeRadius,
  type ThemeLayout,
  type SidebarVariant,
  type ThemeFont,
} from "@/config/themes"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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
    sidebarVariant,
    setSidebarVariant,
    font,
    setFont,
    displayFont,
    setDisplayFont,
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

  const currentColorConfig =
    THEME_COLORS.find((c) => c.name === themeColor) ?? THEME_COLORS[0]
  const currentActiveHex =
    theme === "dark"
      ? currentColorConfig.activeColor.dark
      : currentColorConfig.activeColor.light

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-base font-semibold">Theme Settings</h3>
          <p className="text-xs text-muted-foreground">
            Adjust appearance, typography, colors, and layout. All changes apply live and save automatically.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 text-[11px] text-muted-foreground bg-muted/60 border border-border/80 px-2.5 py-1 rounded-md">
            <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Auto-saved</span>
          </span>
          <CopyCodeDialog
            color={themeColor}
            radius={radius}
            font={font}
            displayFont={displayFont}
          />
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
            onClick={() => {
              setTheme("light")
              showFeedback("Switched to Light mode")
            }}
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
            onClick={() => {
              setTheme("dark")
              showFeedback("Switched to Dark mode")
            }}
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
            onClick={() => {
              setTheme("system")
              showFeedback("Switched to System mode")
            }}
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

      {/* Primary Color Palette Section with Dropdown */}
      <div className="space-y-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h4 className="text-xs font-semibold text-foreground">Color Palette</h4>
            <p className="text-xs text-muted-foreground">
              Select the primary brand and accent color for UI components.
            </p>
          </div>

          {/* Color Palette Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-muted-foreground font-medium hidden sm:inline">
              Dropdown:
            </span>
            <Select
              value={themeColor}
              onValueChange={(val) => {
                setThemeColor(val as ThemeColor)
                const c = THEME_COLORS.find((x) => x.name === val)
                showFeedback(`Theme color changed to ${c?.label ?? val}`)
              }}
            >
              <SelectTrigger className="w-44 text-xs h-8">
                <div className="flex items-center gap-2">
                  <span
                    className="size-3.5 rounded-full shrink-0 shadow-2xs"
                    style={{ backgroundColor: currentActiveHex }}
                  />
                  <SelectValue placeholder="Select color" />
                </div>
              </SelectTrigger>
              <SelectContent>
                {THEME_COLORS.map((c) => {
                  const hex =
                    theme === "dark" ? c.activeColor.dark : c.activeColor.light
                  return (
                    <SelectItem key={c.name} value={c.name} className="text-xs">
                      <div className="flex items-center gap-2">
                        <span
                          className="size-3 rounded-full shrink-0"
                          style={{ backgroundColor: hex }}
                        />
                        <span>{c.label}</span>
                      </div>
                    </SelectItem>
                  )
                })}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Swatches Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
          {THEME_COLORS.map((c) => {
            const isSelected = themeColor === c.name
            const activeHex = theme === "dark" ? c.activeColor.dark : c.activeColor.light

            return (
              <button
                key={c.name}
                type="button"
                onClick={() => {
                  setThemeColor(c.name as ThemeColor)
                  showFeedback(`Theme color changed to ${c.label}`)
                }}
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

      {/* Sidebar Variant Section (inset, floating, default) */}
      <div className="space-y-3.5">
        <div>
          <h4 className="text-xs font-semibold text-foreground">Sidebar Variant</h4>
          <p className="text-xs text-muted-foreground">
            Choose between standard rail, inner canvas inset, or detached floating sidebar styles.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-2xl">
          {SIDEBAR_VARIANTS.map((item) => {
            const isSelected = sidebarVariant === item.value

            return (
              <button
                key={item.value}
                type="button"
                onClick={() => {
                  setSidebarVariant(item.value as SidebarVariant)
                  showFeedback(`Sidebar style changed to ${item.label}`)
                }}
                className={cn(
                  "group relative flex flex-col gap-2.5 rounded-xl border-2 p-3 transition-all text-left cursor-pointer",
                  isSelected
                    ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                    : "border-border/80 bg-card hover:border-primary/40"
                )}
              >
                {/* Visual miniature of the sidebar variant */}
                <div className="w-full aspect-16/10 rounded-lg border border-border/80 bg-muted/40 p-2 flex gap-1.5 shadow-xs overflow-hidden">
                  {item.value === "default" && (
                    <>
                      <div className="w-1/4 h-full bg-sidebar border-r border-sidebar-border rounded-l-xs flex flex-col gap-1 p-1">
                        <div className="h-1.5 w-full bg-primary/60 rounded-xs" />
                        <div className="h-1 w-2/3 bg-muted-foreground/30 rounded-xs" />
                      </div>
                      <div className="flex-1 h-full bg-background rounded-r-xs p-1 space-y-1">
                        <div className="h-1.5 w-1/3 bg-muted-foreground/20 rounded-xs" />
                        <div className="h-3 w-full bg-card border border-border/60 rounded-xs" />
                      </div>
                    </>
                  )}

                  {item.value === "inset" && (
                    <>
                      <div className="w-1/4 h-full bg-sidebar flex flex-col gap-1 p-1">
                        <div className="h-1.5 w-full bg-primary/60 rounded-xs" />
                        <div className="h-1 w-2/3 bg-muted-foreground/30 rounded-xs" />
                      </div>
                      <div className="flex-1 h-full bg-background rounded-lg border border-border shadow-2xs p-1 space-y-1">
                        <div className="h-1.5 w-1/3 bg-muted-foreground/20 rounded-xs" />
                        <div className="h-2.5 w-full bg-muted/40 rounded-xs" />
                      </div>
                    </>
                  )}

                  {item.value === "floating" && (
                    <>
                      <div className="w-1/4 h-full bg-sidebar rounded-md border border-sidebar-border shadow-xs flex flex-col gap-1 p-1">
                        <div className="h-1.5 w-full bg-primary/60 rounded-xs" />
                        <div className="h-1 w-2/3 bg-muted-foreground/30 rounded-xs" />
                      </div>
                      <div className="flex-1 h-full bg-background rounded-md p-1 space-y-1">
                        <div className="h-1.5 w-1/3 bg-muted-foreground/20 rounded-xs" />
                        <div className="h-3 w-full bg-card border border-border/60 rounded-xs" />
                      </div>
                    </>
                  )}
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-xs font-semibold">
                      {item.value === "default" && <PanelLeft className="size-3.5 text-primary" />}
                      {item.value === "inset" && <LayoutTemplate className="size-3.5 text-primary" />}
                      {item.value === "floating" && <SquareDashedBottomCode className="size-3.5 text-primary" />}
                      <span>{item.label}</span>
                    </span>
                    {isSelected && <Check className="size-3.5 text-primary" />}
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-0.5 leading-snug">
                    {item.description}
                  </p>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      <Separator />

      {/* Typography: Font and Display Font Section */}
      <div className="space-y-4">
        <div>
          <h4 className="text-xs font-semibold text-foreground flex items-center gap-1.5">
            <Type className="size-3.5 text-primary" />
            <span>Typography (Font & Display Font)</span>
          </h4>
          <p className="text-xs text-muted-foreground">
            Customize the primary body font and display font for headings and titles.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
          {/* Base Font Dropdown */}
          <div className="rounded-xl border border-border/80 bg-card p-4 space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold block">Body & UI Font</span>
                <span className="text-[11px] text-muted-foreground">
                  Applied to paragraphs, data tables, and general UI.
                </span>
              </div>
            </div>

            <Select
              value={font}
              onValueChange={(val) => {
                setFont(val as ThemeFont)
                const f = THEME_FONTS.find((x) => x.value === val)
                showFeedback(`Body font changed to ${f?.label ?? val}`)
              }}
            >
              <SelectTrigger className="w-full text-xs h-8">
                <SelectValue placeholder="Select base font" />
              </SelectTrigger>
              <SelectContent>
                {THEME_FONTS.map((f) => (
                  <SelectItem key={f.value} value={f.value} className="text-xs">
                    <span style={{ fontFamily: f.family }}>{f.label}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div
              className="p-3 rounded-lg bg-muted/50 border border-border/50 text-xs text-foreground leading-relaxed"
              style={{
                fontFamily:
                  THEME_FONTS.find((f) => f.value === font)?.family ?? "inherit",
              }}
            >
              The quick brown fox jumps over the lazy dog. 0123456789.
            </div>
          </div>

          {/* Display Font Dropdown */}
          <div className="rounded-xl border border-border/80 bg-card p-4 space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold block">Display & Heading Font</span>
                <span className="text-[11px] text-muted-foreground">
                  Applied to page titles, headings, and hero text.
                </span>
              </div>
            </div>

            <Select
              value={displayFont}
              onValueChange={(val) => {
                setDisplayFont(val as ThemeFont)
                const f = THEME_FONTS.find((x) => x.value === val)
                showFeedback(`Display font changed to ${f?.label ?? val}`)
              }}
            >
              <SelectTrigger className="w-full text-xs h-8">
                <SelectValue placeholder="Select display font" />
              </SelectTrigger>
              <SelectContent>
                {THEME_FONTS.map((f) => (
                  <SelectItem key={f.value} value={f.value} className="text-xs">
                    <span style={{ fontFamily: f.family }}>{f.label}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div
              className="p-3 rounded-lg bg-muted/50 border border-border/50 text-sm font-bold text-foreground leading-relaxed"
              style={{
                fontFamily:
                  THEME_FONTS.find((f) => f.value === displayFont)?.family ??
                  "inherit",
              }}
            >
              Transform Your Vision Into Reality.
            </div>
          </div>
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
                onClick={() => {
                  setRadius(r.value as ThemeRadius)
                  showFeedback(`Border radius changed to ${r.label}rem`)
                }}
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
                onClick={() => {
                  setLayout(item.value as ThemeLayout)
                  showFeedback(`Layout changed to ${item.label}`)
                }}
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
