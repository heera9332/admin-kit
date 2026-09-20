import * as React from "react"
import { z } from "zod"
import {
  Check,
  Laptop,
  LayoutTemplate,
  Maximize2,
  Minimize2,
  Moon,
  PanelLeft,
  SquareDashedBottomCode,
  Sun,
} from "lucide-react"

import type { FormFieldsConfig } from "@/types/form"
import {
  THEME_COLORS,
  THEME_FONTS,
  THEME_LAYOUTS,
  THEME_RADII,
  SIDEBAR_VARIANTS,
  type ThemeColor,
  type ThemeRadius,
  type ThemeLayout,
  type SidebarVariant,
} from "@/config/themes"
import { cn } from "@/lib/utils"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export const themeSettingsSchema = z.object({
  theme: z.enum(["light", "dark", "system"]),
  color: z.enum([
    "zinc",
    "slate",
    "stone",
    "gray",
    "neutral",
    "red",
    "rose",
    "orange",
    "green",
    "blue",
    "yellow",
    "violet",
  ]),
  radius: z.union([
    z.literal(0),
    z.literal(0.3),
    z.literal(0.5),
    z.literal(0.75),
    z.literal(1.0),
  ]),
  layout: z.enum(["fluid", "boxed"]),
  sidebarVariant: z.enum(["default", "inset", "floating"]),
  font: z.enum([
    "lexend",
    "inter",
    "geist",
    "plus-jakarta-sans",
    "manrope",
    "outfit",
    "dm-sans",
  ]),
  displayFont: z.enum([
    "lexend",
    "inter",
    "geist",
    "plus-jakarta-sans",
    "manrope",
    "outfit",
    "dm-sans",
  ]),
})

export type ThemeFormValues = z.infer<typeof themeSettingsSchema>

interface ThemeFormFieldsOptions {
  currentTheme?: string
  tAppearance?: (key: string) => string
}

export function getThemeFormFields({
  currentTheme = "system",
  tAppearance = (key) => key,
}: ThemeFormFieldsOptions = {}): FormFieldsConfig<ThemeFormValues> {
  return [
    {
      name: "theme",
      label: tAppearance("themeMode"),
      description: "Select light, dark, or automatic system theme.",
      type: "custom",
      colSpan: 2,
      render: ({ value, onChange }) => {
        const selected = (value as string) || "system"
        return (
          <div className="grid grid-cols-3 gap-3 max-w-lg">
            {/* Light Mode */}
            <button
              type="button"
              onClick={() => onChange("light")}
              className={cn(
                "group relative flex flex-col items-center gap-2 rounded-xl border-2 p-2.5 transition-all text-left cursor-pointer",
                selected === "light"
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
                  <span>{tAppearance("light")}</span>
                </span>
                {selected === "light" && <Check className="size-3.5 text-primary" />}
              </div>
            </button>

            {/* Dark Mode */}
            <button
              type="button"
              onClick={() => onChange("dark")}
              className={cn(
                "group relative flex flex-col items-center gap-2 rounded-xl border-2 p-2.5 transition-all text-left cursor-pointer",
                selected === "dark"
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
                  <span>{tAppearance("dark")}</span>
                </span>
                {selected === "dark" && <Check className="size-3.5 text-primary" />}
              </div>
            </button>

            {/* System Mode */}
            <button
              type="button"
              onClick={() => onChange("system")}
              className={cn(
                "group relative flex flex-col items-center gap-2 rounded-xl border-2 p-2.5 transition-all text-left cursor-pointer",
                selected === "system"
                  ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                  : "border-border/80 bg-card hover:border-primary/40"
              )}
            >
              <div className="w-full aspect-16/10 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-linear-to-r from-white via-zinc-200 to-zinc-950 p-2 flex flex-col justify-between shadow-xs overflow-hidden">
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
                  <span>{tAppearance("system")}</span>
                </span>
                {selected === "system" && <Check className="size-3.5 text-primary" />}
              </div>
            </button>
          </div>
        )
      },
    },
    {
      name: "color",
      label: tAppearance("colorPalette"),
      description: "Select the primary brand and accent color for UI components.",
      type: "custom",
      colSpan: 2,
      render: ({ value, onChange }) => {
        const selected = (value as ThemeColor) || "zinc"
        const isDark = currentTheme === "dark"
        return (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Select
                value={selected}
                onValueChange={(val) => {
                  if (val) onChange(val as ThemeColor)
                }}
              >
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue placeholder="Select Palette" />
                </SelectTrigger>
                <SelectContent>
                  {THEME_COLORS.map((colorItem) => (
                    <SelectItem key={colorItem.name} value={colorItem.name}>
                      <div className="flex items-center gap-2">
                        <span
                          className="size-3 rounded-full shrink-0"
                          style={{
                            backgroundColor: isDark
                              ? colorItem.activeColor.dark
                              : colorItem.activeColor.light,
                          }}
                        />
                        <span>{colorItem.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )
      },
    },
    {
      name: "radius",
      label: tAppearance("radius"),
      description: "Controls the roundness of cards, dialogs, buttons, and inputs.",
      type: "custom",
      colSpan: 2,
      render: ({ value, onChange }) => {
        const selected = Number(value ?? 0.5) as ThemeRadius
        return (
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 max-w-xl">
            {THEME_RADII.map((r) => {
              const isSelected = selected === r.value
              return (
                <button
                  key={r.value}
                  type="button"
                  onClick={() => onChange(r.value)}
                  className={cn(
                    "flex flex-col items-center justify-center gap-1.5 p-3 border transition-all cursor-pointer",
                    isSelected
                      ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                      : "border-border/80 bg-card hover:border-primary/40"
                  )}
                  style={{ borderRadius: `${r.value}rem` }}
                >
                  <div
                    className="size-8 border-2 border-dashed border-primary/50 bg-primary/10 flex items-center justify-center text-[11px] font-mono font-medium text-primary"
                    style={{ borderRadius: `${r.value}rem` }}
                  >
                    {r.value}
                  </div>
                  <div className="text-center">
                    <span className="text-xs font-medium block">{r.label}</span>
                    <span className="text-[10px] text-muted-foreground block font-mono">
                      {r.value}rem
                    </span>
                  </div>
                  {isSelected && <Check className="size-3 text-primary mt-0.5" />}
                </button>
              )
            })}
          </div>
        )
      },
    },
    {
      name: "layout",
      label: tAppearance("layoutStyle"),
      description: "Choose between full width or fixed boxed application canvas.",
      type: "custom",
      colSpan: 1,
      render: ({ value, onChange }) => {
        const selected = (value as ThemeLayout) || "fluid"
        return (
          <div className="grid grid-cols-2 gap-3 max-w-md">
            {THEME_LAYOUTS.map((l) => {
              const isSelected = selected === l.value
              return (
                <button
                  key={l.value}
                  type="button"
                  onClick={() => onChange(l.value)}
                  className={cn(
                    "group relative flex flex-col items-start gap-2 rounded-xl border p-3 transition-all text-left cursor-pointer",
                    isSelected
                      ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                      : "border-border/80 bg-card hover:border-primary/40"
                  )}
                >
                  <div className="w-full h-12 rounded-md bg-muted/60 border border-border/60 flex items-center justify-center">
                    {l.value === "fluid" ? (
                      <Maximize2 className="size-4 text-muted-foreground" />
                    ) : (
                      <Minimize2 className="size-4 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex items-center justify-between w-full">
                    <span className="text-xs font-medium">{l.label}</span>
                    {isSelected && <Check className="size-3.5 text-primary" />}
                  </div>
                  <p className="text-[10px] text-muted-foreground">
                    {l.description}
                  </p>
                </button>
              )
            })}
          </div>
        )
      },
    },
    {
      name: "sidebarVariant",
      label: tAppearance("sidebarVariant"),
      description: "Customize the primary navigation sidebar visual presentation.",
      type: "custom",
      colSpan: 1,
      render: ({ value, onChange }) => {
        const selected = (value as SidebarVariant) || "default"
        return (
          <div className="grid grid-cols-3 gap-2.5 max-w-md">
            {SIDEBAR_VARIANTS.map((s) => {
              const isSelected = selected === s.value
              return (
                <button
                  key={s.value}
                  type="button"
                  onClick={() => onChange(s.value)}
                  className={cn(
                    "flex flex-col items-start gap-1.5 rounded-xl border p-2.5 transition-all text-left cursor-pointer",
                    isSelected
                      ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                      : "border-border/80 bg-card hover:border-primary/40"
                  )}
                >
                  <div className="w-full h-10 rounded-md bg-muted/60 border border-border/60 flex items-center justify-center">
                    {s.value === "default" && (
                      <PanelLeft className="size-4 text-muted-foreground" />
                    )}
                    {s.value === "inset" && (
                      <LayoutTemplate className="size-4 text-muted-foreground" />
                    )}
                    {s.value === "floating" && (
                      <SquareDashedBottomCode className="size-4 text-muted-foreground" />
                    )}
                  </div>
                  <span className="text-xs font-medium">{s.label}</span>
                </button>
              )
            })}
          </div>
        )
      },
    },
    {
      name: "font",
      label: tAppearance("typography"),
      description: "Body and UI text typeface applied across the dashboard.",
      type: "select",
      colSpan: 1,
      options: THEME_FONTS.map((f) => ({
        label: `${f.label} — ${f.description}`,
        value: f.value,
      })),
    },
    {
      name: "displayFont",
      label: "Display Font",
      description: "Heading and hero typography for high-impact titles.",
      type: "select",
      colSpan: 1,
      options: THEME_FONTS.map((f) => ({
        label: `${f.label} — ${f.description}`,
        value: f.value,
      })),
    },
  ]
}
