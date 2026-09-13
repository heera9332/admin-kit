"use client"

import * as React from "react"
import { RotateCcw } from "lucide-react"
import { useTranslations } from "next-intl"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { useThemeSettings } from "@/context/theme-settings-provider"
import { DynamicForm } from "@/components/forms/dynamic-form"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ThemePreviewCard } from "./theme-preview-card"
import {
  getThemeFormFields,
  themeSettingsSchema,
  type ThemeFormValues,
} from "@/configs/theme-form"
import type {
  ThemeColor,
  ThemeFont,
  ThemeLayout,
  ThemeRadius,
  SidebarVariant,
} from "@/config/themes"

export function ThemeSettingsForm() {
  const tAppearance = useTranslations("settings.appearance")
  const tCommon = useTranslations("common")

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

  const form = useForm<ThemeFormValues>({
    resolver: zodResolver(themeSettingsSchema),
    defaultValues: {
      theme: (theme as ThemeFormValues["theme"]) ?? "system",
      color: themeColor,
      radius,
      layout,
      sidebarVariant,
      font,
      displayFont,
    },
  })

  // Sync external provider updates to form if reset or changed elsewhere
  React.useEffect(() => {
    if (isMounted) {
      form.reset({
        theme: (theme as ThemeFormValues["theme"]) ?? "system",
        color: themeColor,
        radius,
        layout,
        sidebarVariant,
        font,
        displayFont,
      })
    }
  }, [isMounted, theme, themeColor, radius, layout, sidebarVariant, font, displayFont, form])

  // Watch form changes and immediately apply to ThemeSettingsProvider
  React.useEffect(() => {
    const subscription = form.watch((values, { name }) => {
      if (!name) return

      if (name === "theme" && values.theme) {
        setTheme(values.theme)
        showFeedback(`Switched to ${values.theme} mode`)
      } else if (name === "color" && values.color) {
        setThemeColor(values.color as ThemeColor)
        showFeedback(`Theme color updated to ${values.color}`)
      } else if (name === "radius" && values.radius !== undefined) {
        setRadius(Number(values.radius) as ThemeRadius)
        showFeedback(`Border radius updated to ${values.radius}rem`)
      } else if (name === "layout" && values.layout) {
        setLayout(values.layout as ThemeLayout)
        showFeedback(`Layout set to ${values.layout}`)
      } else if (name === "sidebarVariant" && values.sidebarVariant) {
        setSidebarVariant(values.sidebarVariant as SidebarVariant)
        showFeedback(`Sidebar style set to ${values.sidebarVariant}`)
      } else if (name === "font" && values.font) {
        setFont(values.font as ThemeFont)
        showFeedback(`Font updated to ${values.font}`)
      } else if (name === "displayFont" && values.displayFont) {
        setDisplayFont(values.displayFont as ThemeFont)
        showFeedback(`Heading font updated to ${values.displayFont}`)
      }
    })

    return () => subscription.unsubscribe()
  }, [
    form,
    setTheme,
    setThemeColor,
    setRadius,
    setLayout,
    setSidebarVariant,
    setFont,
    setDisplayFont,
  ])

  const fields = React.useMemo(
    () =>
      getThemeFormFields({
        currentTheme: theme,
        tAppearance,
      }),
    [theme, tAppearance]
  )

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
          <h3 className="text-base font-semibold">{tAppearance("title")}</h3>
          <p className="text-xs text-muted-foreground">
            {tAppearance("description")}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {notification && (
            <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-primary bg-primary/10 border border-primary/20 px-2.5 py-1.5 rounded-md transition-all">
              <span className="size-1.5 rounded-full bg-primary animate-pulse" />
              <span>{notification}</span>
            </span>
          )}
          <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground bg-muted/60 border border-border/80 px-2.5 py-1.5 rounded-md">
            <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>{tCommon("autoSaved")}</span>
          </span>
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
            <span>{tCommon("reset")}</span>
          </Button>
        </div>
      </div>

      <Separator />

      {/* Config-Driven Dynamic Form */}
      <DynamicForm<ThemeFormValues>
        form={form}
        fields={fields}
        onSubmit={() => {}}
        showSubmitButton={false}
        columns={2}
      />

      <Separator />

      {/* Live Preview Card */}
      <div className="space-y-3.5">
        <div>
          <h4 className="text-xs font-semibold text-foreground">
            Interactive Live Preview
          </h4>
          <p className="text-xs text-muted-foreground">
            Real-time preview of how your theme configuration appears in application components.
          </p>
        </div>

        <ThemePreviewCard />
      </div>
    </div>
  )
}
