"use client"

import * as React from "react"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"

export default function ProfileSettingsPage() {
  const t = useTranslations("settings.profile")
  const [saved, setSaved] = React.useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-base font-semibold">{t("title")}</h3>
        <p className="text-xs text-muted-foreground">
          {t("description")}
        </p>
      </div>

      <Separator />

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="username">{t("username")}</Label>
          <Input id="username" defaultValue="adminkit" className="text-xs max-w-md" />
          <p className="text-[11px] text-muted-foreground">
            {t("usernameHelp")}
          </p>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="email">{t("email")}</Label>
          <Input id="email" type="email" defaultValue="heera-singh@zoro-dev.com" className="text-xs max-w-md" />
          <p className="text-[11px] text-muted-foreground">
            {t("emailHelp")}
          </p>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="bio">{t("bio")}</Label>
          <Textarea
            id="bio"
            rows={3}
            defaultValue="Software engineer & creator of Shadcn Admin. Building accessible web templates."
            className="text-xs max-w-md"
          />
          <p className="text-[11px] text-muted-foreground">
            {t("bioHelp")}
          </p>
        </div>

        <div className="pt-2 flex items-center gap-3">
          <Button type="submit" size="sm" className="text-xs">
            {t("updateProfile")}
          </Button>
          {saved && (
            <span className="text-xs text-emerald-500 font-medium">
              {t("success")}
            </span>
          )}
        </div>
      </form>
    </div>
  )
}
