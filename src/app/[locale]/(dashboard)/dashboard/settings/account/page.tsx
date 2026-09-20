"use client"

import * as React from "react"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function AccountSettingsPage() {
  const t = useTranslations("settings.account")
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
          <Label htmlFor="fullName">{t("fullName")}</Label>
          <Input id="fullName" defaultValue="Adminkit" className="text-xs max-w-md" />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="dob">{t("dob")}</Label>
          <Input id="dob" type="date" defaultValue="1996-05-18" className="text-xs max-w-md" />
          <p className="text-[11px] text-muted-foreground">
            {t("dobHelp")}
          </p>
        </div>

        <div className="space-y-1.5 max-w-md">
          <Label htmlFor="language">{t("language")}</Label>
          <Select defaultValue="en">
            <SelectTrigger id="language" className="text-xs">
              <SelectValue placeholder={t("selectLanguage")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English (US)</SelectItem>
              <SelectItem value="uk">English (UK)</SelectItem>
              <SelectItem value="de">German</SelectItem>
              <SelectItem value="fr">French</SelectItem>
              <SelectItem value="es">Spanish</SelectItem>
              <SelectItem value="ja">Japanese</SelectItem>
              <SelectItem value="hi">हिन्दी (Hindi)</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-[11px] text-muted-foreground">
            {t("languageHelp")}
          </p>
        </div>

        <div className="pt-2 flex items-center gap-3">
          <Button type="submit" size="sm" className="text-xs">
            {t("updateAccount")}
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
