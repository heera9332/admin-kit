"use client"

import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { SearchButton } from "@/components/layout/search-button"
import { ProfileDropdown } from "@/components/layout/profile-dropdown"
import { ThemeToggle } from "@/components/theme-toggle"
import { ThemeCustomizer } from "@/components/theme-customizer"
import { LocaleSwitcher } from "@/components/locale-switcher"

export function SiteHeader() {
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
        <ProfileDropdown />
      </div>
    </header>
  )
}
