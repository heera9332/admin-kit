"use client"

import * as React from "react"
import { TeamSwitcher } from "@/components/team-switcher"
import { NavGroup } from "@/components/layout/nav-group"
import { NavUser } from "@/components/nav-user"
import { sidebarData } from "@/components/layout/data/sidebar-data"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { useThemeSettings } from "@/context/theme-settings-provider"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { sidebarVariant } = useThemeSettings()

  return (
    <Sidebar
      collapsible="icon"
      variant={sidebarVariant === "default" ? "sidebar" : sidebarVariant}
      {...props}
    >
      <SidebarHeader>
        <TeamSwitcher teams={sidebarData.teams} />
      </SidebarHeader>
      <SidebarContent>
        {sidebarData.navGroups.map((group) => (
          <NavGroup key={group.title} {...group} />
        ))}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={sidebarData.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
