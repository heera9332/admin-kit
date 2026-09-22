"use client"

import { Download } from "lucide-react"
import { useTranslations } from "next-intl"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { buttonVariants } from "@/components/ui/button"
import { SearchButton } from "@/components/layout/search-button"
import { ProfileDropdown } from "@/components/layout/profile-dropdown"
import { ThemeToggle } from "@/components/theme-toggle"
import { ThemeCustomizer } from "@/components/theme-customizer"
import { LocaleSwitcher } from "@/components/locale-switcher"
import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"

export function SiteHeader() {
  const t = useTranslations("common")

  return (
    <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center justify-between gap-2 border-b bg-background/95 px-3 sm:px-4 backdrop-blur-sm transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
      <div className="flex items-center gap-2 sm:gap-3">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="hidden h-4 data-vertical:h-4 data-vertical:self-auto md:block"
        />
      </div>

      <div className="flex items-center gap-1 sm:gap-2 shrink-0">
        <SearchButton />
        <LocaleSwitcher />
        <ThemeCustomizer />
        <ThemeToggle />
        <a
          href={siteConfig.links.store}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            buttonVariants({ variant: "default", size: "sm" }),
            "h-8 gap-1.5 px-2 text-xs font-medium sm:px-2.5 shadow-xs"
          )}
          aria-label={t("download")}
          title={t("download")}
        >
          <Download className="size-3.5" />
          <span className="hidden sm:inline">{t("download")}</span>
        </a>
        <ProfileDropdown />
      </div>
    </header>
  )
}
