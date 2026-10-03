"use client"

import * as React from "react"
import { Clock } from "lucide-react"
import { Link } from "@/i18n/routing"
import { useEcommerce } from "@/context/ecommerce-provider"
import { cn } from "@/lib/utils"

export function SiteVisibilityBadge({ className }: { className?: string }) {
  const { settings } = useEcommerce()

  const showBadge = settings.showVisibilityBadgeInAdminBar ?? true
  const isComingSoon = (settings.siteVisibility || "coming_soon") === "coming_soon"

  if (!showBadge) return null

  return (
    <Link
      href="/dashboard/ecommerce/settings/site-visibility"
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-all shadow-2xs select-none cursor-pointer",
        isComingSoon
          ? "border border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20"
          : "border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20",
        className
      )}
      title={`Site visibility: ${isComingSoon ? "Coming soon" : "Live"}. Click to manage.`}
      aria-label={`Site visibility: ${isComingSoon ? "Coming soon" : "Live"}`}
    >
      {isComingSoon ? (
        <>
          <Clock className="size-3 shrink-0" />
          <span className="hidden xs:inline">Coming soon</span>
        </>
      ) : (
        <>
          <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
          <span className="hidden xs:inline">Live</span>
        </>
      )}
    </Link>
  )
}
