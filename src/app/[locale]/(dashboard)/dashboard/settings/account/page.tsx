"use client"

import * as React from "react"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
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
    <Card className="">
      <CardHeader className="border-b pb-4">
        <CardTitle className="text-base font-semibold">{t("title")}</CardTitle>
        <CardDescription className="text-xs text-muted-foreground">
          {t("description")}
        </CardDescription>
      </CardHeader>

      <CardContent className=" ">
        <form id="account-form" onSubmit={handleSubmit} className="space-y-4 max-w-md">
          <div className="space-y-1.5">
            <Label htmlFor="fullName" className="text-xs font-medium">
              {t("fullName")}
            </Label>
            <Input id="fullName" defaultValue="Adminkit" className="text-xs" />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="dob" className="text-xs font-medium">
              {t("dob")}
            </Label>
            <Input id="dob" type="date" defaultValue="1996-05-18" className="text-xs" />
            <p className="text-[11px] text-muted-foreground">
              {t("dobHelp")}
            </p>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="language" className="text-xs font-medium">
              {t("language")}
            </Label>
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
        </form>
      </CardContent>

      <CardFooter className="flex items-center justify-between border-t px-6 py-3.5 bg-muted/20">
        <div className="flex items-center gap-3">
          <Button type="submit" form="account-form" size="sm" className="text-xs font-medium">
            {t("updateAccount")}
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
