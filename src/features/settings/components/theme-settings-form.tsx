"use client"

import * as React from "react"
import { RotateCcw } from "lucide-react"
import { useTranslations } from "next-intl"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { useThemeSettings } from "@/context/theme-settings-provider"
import { DynamicForm } from "@/components/forms/dynamic-form"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
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
    setNotification("")
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
      } else if (name === "color" && values.color) {
        setThemeColor(values.color as ThemeColor)
      } else if (name === "radius" && values.radius !== undefined) {
        setRadius(Number(values.radius) as ThemeRadius)
      } else if (name === "layout" && values.layout) {
        setLayout(values.layout as ThemeLayout)
      } else if (name === "sidebarVariant" && values.sidebarVariant) {
        setSidebarVariant(values.sidebarVariant as SidebarVariant)
      } else if (name === "font" && values.font) {
        setFont(values.font as ThemeFont)
      } else if (name === "displayFont" && values.displayFont) {
        setDisplayFont(values.displayFont as ThemeFont)
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
      <Card className="  animate-pulse">
        <div className="p-6 border-b space-y-2">
          <div className="h-5 w-40 rounded bg-muted" />
          <div className="h-3.5 w-72 rounded bg-muted" />
        </div>
        <div className="p-6 space-y-4">
          <div className="h-32 rounded-lg bg-muted" />
        </div>
      </Card>
    )
  }

  return (
    <Card className="">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b pb-4">
        <div>
          <CardTitle className="text-base font-semibold">{tAppearance("title")}</CardTitle>
          <CardDescription className="text-xs text-muted-foreground">
            {tAppearance("description")}
          </CardDescription>
        </div>

        <div className="flex items-center gap-2"> 
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
      </CardHeader>

      <CardContent className="space-y-8 pt-6">
        <DynamicForm<ThemeFormValues>
          form={form}
          fields={fields}
          onSubmit={() => {}}
          showSubmitButton={false}
          columns={2}
        />

        <Separator />

        {/* Live Preview Section */}
        <ThemePreviewCard />
      </CardContent>
    </Card>
  )
}
