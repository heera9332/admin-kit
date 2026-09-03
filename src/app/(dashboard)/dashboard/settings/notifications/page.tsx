"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"

export default function NotificationsSettingsPage() {
  const [saved, setSaved] = React.useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-base font-semibold">Notifications</h3>
        <p className="text-xs text-muted-foreground">
          Configure how you receive activity notifications and operational digests.
        </p>
      </div>

      <Separator />

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-4 max-w-xl">
          <div className="flex items-center justify-between rounded-lg border p-3.5 shadow-2xs">
            <div className="space-y-0.5">
              <span className="text-xs font-medium">Communication emails</span>
              <p className="text-[11px] text-muted-foreground">
                Receive emails about your account activity and project mentions.
              </p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between rounded-lg border p-3.5 shadow-2xs">
            <div className="space-y-0.5">
              <span className="text-xs font-medium">Marketing emails</span>
              <p className="text-[11px] text-muted-foreground">
                Receive promotional messages about new features, updates, and releases.
              </p>
            </div>
            <Switch />
          </div>

          <div className="flex items-center justify-between rounded-lg border p-3.5 shadow-2xs">
            <div className="space-y-0.5">
              <span className="text-xs font-medium">Social notifications</span>
              <p className="text-[11px] text-muted-foreground">
                Get notified when contacts message you or add you to workspace teams.
              </p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between rounded-lg border p-3.5 shadow-2xs">
            <div className="space-y-0.5">
              <span className="text-xs font-medium">Security alerts</span>
              <p className="text-[11px] text-muted-foreground">
                Critical notifications about unrecognized login sessions or API key changes.
              </p>
            </div>
            <Switch defaultChecked disabled />
          </div>
        </div>

        <div className="pt-2 flex items-center gap-3">
          <Button type="submit" size="sm" className="text-xs">
            Update notifications
          </Button>
          {saved && (
            <span className="text-xs text-emerald-500 font-medium">
              Notification preferences saved!
            </span>
          )}
        </div>
      </form>
    </div>
  )
}
