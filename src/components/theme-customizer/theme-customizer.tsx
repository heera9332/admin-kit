"use client"

import * as React from "react"
import Link from "next/link"
import {
  Palette,
  Sun,
  Moon,
  Laptop,
  Check,
  RotateCcw,
  Maximize2,
  Minimize2,
  ExternalLink,
  PanelLeft,
  LayoutTemplate,
  SquareDashedBottomCode,
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
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

interface ThemeCustomizerProps {
  className?: string
}

export function ThemeCustomizer({ className }: ThemeCustomizerProps) {
  const [open, setOpen] = React.useState(false)
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

  if (!isMounted) {
    return (
      <Button
        variant="ghost"
        size="icon-sm"
        className={className}
        aria-label="Customize theme"
      >
        <Palette className="size-4 text-muted-foreground" />
      </Button>
    )
  }

  const currentColorConfig =
    THEME_COLORS.find((c) => c.name === themeColor) ?? THEME_COLORS[0]
  const currentActiveHex =
    theme === "dark"
      ? currentColorConfig.activeColor.dark
      : currentColorConfig.activeColor.light

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button
            variant="ghost"
            size="icon-sm"
            className={cn("relative", className)}
            aria-label="Customize theme"
          />
        }
      >
        <Palette className="size-4 text-muted-foreground transition-transform hover:scale-110" />
      </SheetTrigger>
      <SheetContent
        side="right"
        className="w-full sm:max-w-md flex flex-col p-6 overflow-y-auto"
      >
        <SheetHeader className="p-0 text-left border-b pb-4">
          <div className="flex items-center justify-between pr-6">
            <SheetTitle className="text-base font-semibold">Theme Settings</SheetTitle>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon-xs"
                onClick={resetThemeSettings}
                title="Reset to default"
                aria-label="Reset theme settings"
              >
                <RotateCcw className="size-3.5 text-muted-foreground" />
              </Button>
            </div>
          </div>
          <SheetDescription className="text-xs text-muted-foreground mt-1">
            Adjust appearance, colors, and layout. All changes apply live and save automatically.
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-col gap-5 py-5 flex-1">
          {/* Mode */}
          <div className="space-y-2.5">
            <span className="text-xs font-semibold text-foreground">Theme Mode</span>
            <div className="grid grid-cols-3 gap-2">
              <Button
                variant={theme === "light" ? "default" : "outline"}
                size="sm"
                onClick={() => setTheme("light")}
                className="h-8 gap-1.5 text-xs justify-center"
              >
                <Sun className="size-3.5 text-amber-500" />
                <span>Light</span>
              </Button>
              <Button
                variant={theme === "dark" ? "default" : "outline"}
                size="sm"
                onClick={() => setTheme("dark")}
                className="h-8 gap-1.5 text-xs justify-center"
              >
                <Moon className="size-3.5 text-blue-400" />
                <span>Dark</span>
              </Button>
              <Button
                variant={theme === "system" ? "default" : "outline"}
                size="sm"
                onClick={() => setTheme("system")}
                className="h-8 gap-1.5 text-xs justify-center"
              >
                <Laptop className="size-3.5 text-muted-foreground" />
                <span>System</span>
              </Button>
            </div>
          </div>

          <Separator />

          {/* Color Palette with Dropdown */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-foreground">Color Palette</span>
              <Select
                value={themeColor}
                onValueChange={(val) => setThemeColor(val as ThemeColor)}
              >
                <SelectTrigger className="w-32 h-7 text-xs">
                  <div className="flex items-center gap-1.5">
                    <span
                      className="size-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: currentActiveHex }}
                    />
                    <SelectValue placeholder="Color" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {THEME_COLORS.map((c) => {
                    const hex =
                      theme === "dark"
                        ? c.activeColor.dark
                        : c.activeColor.light
                    return (
                      <SelectItem key={c.name} value={c.name} className="text-xs">
                        <div className="flex items-center gap-1.5">
                          <span
                            className="size-2.5 rounded-full shrink-0"
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

            <div className="grid grid-cols-3 gap-2">
              {THEME_COLORS.map((c) => {
                const isSelected = themeColor === c.name
                const activeHex =
                  theme === "dark" ? c.activeColor.dark : c.activeColor.light

                return (
                  <button
                    key={c.name}
                    type="button"
                    onClick={() => setThemeColor(c.name as ThemeColor)}
                    className={cn(
                      "flex items-center gap-2 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-all text-left cursor-pointer",
                      isSelected
                        ? "border-primary bg-primary/10 text-foreground font-semibold shadow-2xs ring-1 ring-primary/30"
                        : "border-border/80 bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground"
                    )}
                  >
                    <span
                      className="flex size-3.5 shrink-0 items-center justify-center rounded-full"
                      style={{ backgroundColor: activeHex }}
                    >
                      {isSelected && <Check className="size-2.5 text-white stroke-[3]" />}
                    </span>
                    <span className="truncate text-[11px]">{c.label}</span>
                  </button>
                )
              })}
            </div>
          </div>

          <Separator />

          {/* Sidebar Variant (inset, floating, default) */}
          <div className="space-y-2.5">
            <span className="text-xs font-semibold text-foreground">Sidebar Variant</span>
            <div className="grid grid-cols-3 gap-2">
              {SIDEBAR_VARIANTS.map((item) => {
                const isSelected = sidebarVariant === item.value

                return (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => setSidebarVariant(item.value as SidebarVariant)}
                    className={cn(
                      "flex flex-col items-center justify-center gap-1 py-2 px-1 rounded-lg border text-xs font-medium transition-all cursor-pointer text-center",
                      isSelected
                        ? "border-primary bg-primary/5 text-foreground font-semibold ring-1 ring-primary/20"
                        : "border-border/80 bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground"
                    )}
                  >
                    {item.value === "default" && <PanelLeft className="size-3.5 text-primary" />}
                    {item.value === "inset" && <LayoutTemplate className="size-3.5 text-primary" />}
                    {item.value === "floating" && <SquareDashedBottomCode className="size-3.5 text-primary" />}
                    <span className="text-[11px]">{item.label}</span>
                  </button>
                )
              })}
            </div>
          </div>

          <Separator />

          {/* Typography: Font and Display Font */}
          <div className="space-y-3">
            <span className="text-xs font-semibold text-foreground">Typography</span>
            <div className="grid grid-cols-2 gap-2.5">
              <div className="space-y-1">
                <span className="text-[11px] text-muted-foreground font-medium">
                  Body Font
                </span>
                <Select
                  value={font}
                  onValueChange={(val) => setFont(val as ThemeFont)}
                >
                  <SelectTrigger className="w-full text-xs h-8">
                    <SelectValue placeholder="Base Font" />
                  </SelectTrigger>
                  <SelectContent>
                    {THEME_FONTS.map((f) => (
                      <SelectItem key={f.value} value={f.value} className="text-xs">
                        <span style={{ fontFamily: f.family }}>{f.label}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <span className="text-[11px] text-muted-foreground font-medium">
                  Display Font
                </span>
                <Select
                  value={displayFont}
                  onValueChange={(val) => setDisplayFont(val as ThemeFont)}
                >
                  <SelectTrigger className="w-full text-xs h-8">
                    <SelectValue placeholder="Display Font" />
                  </SelectTrigger>
                  <SelectContent>
                    {THEME_FONTS.map((f) => (
                      <SelectItem key={f.value} value={f.value} className="text-xs">
                        <span style={{ fontFamily: f.family }}>{f.label}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <Separator />

          {/* Radius */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-foreground">Radius</span>
              <span className="text-[11px] font-mono text-muted-foreground">
                {radius}rem
              </span>
            </div>
            <div className="grid grid-cols-5 gap-1.5">
              {THEME_RADII.map((r) => {
                const isSelected = radius === r.value

                return (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => setRadius(r.value as ThemeRadius)}
                    className={cn(
                      "flex flex-col items-center justify-center py-1.5 rounded-lg border text-xs font-medium transition-all cursor-pointer",
                      isSelected
                        ? "border-primary bg-primary text-primary-foreground font-semibold shadow-2xs"
                        : "border-border/80 bg-card text-foreground hover:border-primary/40 hover:bg-muted/50"
                    )}
                  >
                    <span>{r.label}</span>
                  </button>
                )
              })}
            </div>
          </div>

          <Separator />

          {/* Layout Mode */}
          <div className="space-y-2.5">
            <span className="text-xs font-semibold text-foreground">Layout Style</span>
            <div className="grid grid-cols-2 gap-2">
              {THEME_LAYOUTS.map((item) => {
                const isSelected = layout === item.value

                return (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => setLayout(item.value as ThemeLayout)}
                    className={cn(
                      "flex items-center gap-2 rounded-lg border p-2 text-left transition-all cursor-pointer",
                      isSelected
                        ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                        : "border-border/80 bg-card hover:border-primary/40"
                    )}
                  >
                    {item.value === "fluid" ? (
                      <Maximize2 className="size-3.5 text-muted-foreground" />
                    ) : (
                      <Minimize2 className="size-3.5 text-muted-foreground" />
                    )}
                    <span className="text-xs font-medium">{item.label}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Footer Link */}
        <div className="pt-3 border-t">
          <Link
            href="/dashboard/settings/appearance"
            onClick={() => setOpen(false)}
            className="flex items-center justify-between text-xs text-muted-foreground hover:text-primary transition-colors py-1"
          >
            <span>Open Appearance Settings</span>
            <ExternalLink className="size-3" />
          </Link>
        </div>
      </SheetContent>
    </Sheet>
  )
}
