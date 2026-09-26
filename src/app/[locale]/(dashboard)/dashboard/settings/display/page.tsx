"use client"

import * as React from "react"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function DisplaySettingsPage() {
  const t = useTranslations("settings.display")

  const sidebarDisplayItems = [
    { id: "dashboard", label: t("items.dashboard") },
    { id: "tasks", label: t("items.tasks") },
    { id: "apps", label: t("items.apps") },
    { id: "chats", label: t("items.chats") },
    { id: "users", label: t("items.users") },
  ]

  const [selectedItems, setSelectedItems] = React.useState<string[]>([
    "dashboard",
    "tasks",
    "apps",
    "chats",
    "users",
  ])
  const [saved, setSaved] = React.useState(false)

  const toggleItem = (id: string) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <Card className="border shadow-xs bg-card">
      <CardHeader className="border-b pb-4">
        <CardTitle className="text-base font-semibold">{t("title")}</CardTitle>
        <CardDescription className="text-xs text-muted-foreground">
          {t("description")}
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-6">
        <form id="display-form" onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-3 max-w-md">
            <div className="space-y-1 mb-3">
              <span className="text-xs font-semibold text-foreground">{t("sidebarItems")}</span>
              <p className="text-[11px] text-muted-foreground">
                {t("sidebarItemsDesc")}
              </p>
            </div>

            <div className="space-y-2.5">
              {sidebarDisplayItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center space-x-2.5 p-2 rounded-lg border border-border/50 hover:bg-muted/40 transition-colors"
                >
                  <Checkbox
                    id={item.id}
                    checked={selectedItems.includes(item.id)}
                    onCheckedChange={() => toggleItem(item.id)}
                  />
                  <label
                    htmlFor={item.id}
                    className="text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex-1"
                  >
                    {item.label}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </form>
      </CardContent>

      <CardFooter className="flex items-center justify-between border-t px-6 py-3.5 bg-muted/20">
        <div className="flex items-center gap-3">
          <Button type="submit" form="display-form" size="sm" className="text-xs font-medium">
            {t("updateDisplay")}
          </Button>
          {saved && (
            <span className="text-xs text-emerald-500 font-medium animate-in fade-in">
              {t("success")}
            </span>
          )}
        </div>
      </CardFooter>
    </Card>
  )
}
