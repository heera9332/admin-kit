"use client"

import { useTranslations } from "next-intl"
import { Link, useRouter } from "@/i18n/routing"
import { Button } from "@/components/ui/button"

export default function ForbiddenPage() {
  const router = useRouter()
  const t = useTranslations("errors.forbidden")
  const tActions = useTranslations("errors.actions")

  return (
    <div className="flex flex-col items-center justify-center text-center gap-2">
      <span className="text-7xl sm:text-8xl font-black tracking-tighter text-amber-500/80 font-mono">
        {t("code")}
      </span>
      <h1 className="text-xl font-bold tracking-tight">{t("title")}</h1>
      <p className="text-xs sm:text-sm text-muted-foreground max-w-xs leading-relaxed">
        {t("description")}
      </p>
      <div className="mt-6 flex items-center gap-3">
        <Button variant="outline" size="sm" onClick={() => router.back()} className="text-xs">
          {tActions("goBack")}
        </Button>
        <Button size="sm" render={<Link href="/dashboard" />} className="text-xs">
          <span>{tActions("backToDashboard")}</span>
        </Button>
      </div>
    </div>
  )
}
