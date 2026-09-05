"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"

export default function ProfileSettingsPage() {
  const [saved, setSaved] = React.useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-base font-semibold">Profile</h3>
        <p className="text-xs text-muted-foreground">
          This is how others will see you on the site.
        </p>
      </div>

      <Separator />

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="username">Username</Label>
          <Input id="username" defaultValue="adminkit" className="text-xs max-w-md" />
          <p className="text-[11px] text-muted-foreground">
            This is your public display name. It can be your real name or a pseudonym.
          </p>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" defaultValue="heera-singh@zoro-dev.com" className="text-xs max-w-md" />
          <p className="text-[11px] text-muted-foreground">
            Your verified email address used for system security and recovery.
          </p>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="bio">Bio</Label>
          <Textarea
            id="bio"
            rows={3}
            defaultValue="Software engineer & creator of Shadcn Admin. Building accessible web templates."
            className="text-xs max-w-md"
          />
          <p className="text-[11px] text-muted-foreground">
            Brief description about yourself for your public workspace card.
          </p>
        </div>

        <div className="pt-2 flex items-center gap-3">
          <Button type="submit" size="sm" className="text-xs">
            Update profile
          </Button>
          {saved && (
            <span className="text-xs text-emerald-500 font-medium">
              Profile updated successfully!
            </span>
          )}
        </div>
      </form>
    </div>
  )
}
