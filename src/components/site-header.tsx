"use client"

import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { TopNav } from "@/components/layout/top-nav"
import { SearchButton } from "@/components/layout/search-button"
import { ProfileDropdown } from "@/components/layout/profile-dropdown"
import { ThemeToggle } from "@/components/theme-toggle"

export function SiteHeader() {
  return (
    <header className="flex h-14 shrink-0 items-center justify-between gap-2 border-b bg-background/95 px-4 backdrop-blur-sm transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
      <div className="flex items-center gap-3">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="h-4 data-vertical:h-4 data-vertical:self-auto"
        />
        <TopNav />
      </div>

      <div className="flex items-center gap-2">
        <SearchButton />
        <ThemeToggle />
        <ProfileDropdown />
      </div>
    </header>
  )
}
