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
import { Link } from "@/i18n/routing"
import { buttonVariants } from "@/components/ui/button"
import { ShieldCheck, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"

export default function ProfileSettingsPage() {
  const t = useTranslations("settings.profile")
  const { profile, updateProfile } = useSettingsProfile()

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="border-b pb-4">
          <CardTitle className="text-base font-semibold">{t("title")}</CardTitle>
          <CardDescription className="text-xs text-muted-foreground">
            {t("description")}
          </CardDescription>
        </CardHeader>
        <ProfileInfoForm initialData={profile} onSave={updateProfile} />
      </Card>

      {/* Security & 2FA Quick Access Card */}
      <Card className="border-dashed bg-muted/10">
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
                <ShieldCheck className="size-4" />
              </div>
              <div className="space-y-0.5">
                <CardTitle className="text-sm font-semibold">
                  {t("securitySectionTitle")}
                </CardTitle>
                <CardDescription className="text-xs text-muted-foreground">
                  {t("securitySectionDesc")}
                </CardDescription>
              </div>
            </div>

            <Link
              href="/dashboard/settings/security"
              className={cn(buttonVariants({ variant: "outline", size: "sm" }), "text-xs h-8 gap-1.5 shrink-0 self-start sm:self-auto cursor-pointer")}
            >
              <span>{t("manageSecurityBtn")}</span>
              <ArrowRight className="size-3" />
            </Link>
          </div>
        </CardHeader>
      </Card>
    </div>
  )
}
