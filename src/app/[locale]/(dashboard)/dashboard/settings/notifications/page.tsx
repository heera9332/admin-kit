"use client"

import * as React from "react"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"

export default function NotificationsSettingsPage() {
  const t = useTranslations("settings.notifications")
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
        <div className="space-y-4 max-w-xl">
          <div className="flex items-center justify-between rounded-lg border p-3.5 shadow-2xs">
            <div className="space-y-0.5">
              <span className="text-xs font-medium">{t("communicationEmails")}</span>
              <p className="text-[11px] text-muted-foreground">
                {t("communicationEmailsDesc")}
              </p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between rounded-lg border p-3.5 shadow-2xs">
            <div className="space-y-0.5">
              <span className="text-xs font-medium">{t("marketingEmails")}</span>
              <p className="text-[11px] text-muted-foreground">
                {t("marketingEmailsDesc")}
              </p>
            </div>
            <Switch />
          </div>

          <div className="flex items-center justify-between rounded-lg border p-3.5 shadow-2xs">
            <div className="space-y-0.5">
              <span className="text-xs font-medium">{t("socialNotifications")}</span>
              <p className="text-[11px] text-muted-foreground">
                {t("socialNotificationsDesc")}
              </p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between rounded-lg border p-3.5 shadow-2xs">
            <div className="space-y-0.5">
              <span className="text-xs font-medium">{t("securityAlerts")}</span>
              <p className="text-[11px] text-muted-foreground">
                {t("securityAlertsDesc")}
              </p>
            </div>
            <Switch defaultChecked disabled />
          </div>
        </div>

        <div className="pt-2 flex items-center gap-3">
          <Button type="submit" size="sm" className="text-xs">
            {t("updateNotifications")}
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
