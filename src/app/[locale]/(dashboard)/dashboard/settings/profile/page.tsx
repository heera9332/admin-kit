"use client"

import * as React from "react"
import { useTranslations } from "next-intl"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ProfileInfoForm } from "@/features/settings/components/profile-info-form"
import { useSettingsProfile } from "@/features/settings/hooks/use-settings-profile"

export default function ProfileSettingsPage() {
  const t = useTranslations("settings.profile")
  const { profile, updateProfile } = useSettingsProfile()

  return (
    <Card>
      <CardHeader className="border-b pb-4">
        <CardTitle className="text-base font-semibold">{t("title")}</CardTitle>
        <CardDescription className="text-xs text-muted-foreground">
          {t("description")}
        </CardDescription>
      </CardHeader>
      <ProfileInfoForm initialData={profile} onSave={updateProfile} />
    </Card>
  )
}
