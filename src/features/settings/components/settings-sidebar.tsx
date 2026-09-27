"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import {
  SidebarNav,
  type SidebarNavGroup,
  type SidebarNavItem,
} from "@/components/navigation/sidebar-nav"
import {
  settingsNavGroups,
  settingsNavItems,
} from "@/features/settings/config/settings-nav"
import { Card } from "@/components/ui/card"

export interface SettingsSidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Custom flat navigation items (defaults to settingsNavItems) */
  items?: SidebarNavItem[]
  /** Custom grouped navigation (if grouped display is desired) */
  groups?: SidebarNavGroup[]
  /** Visual presentation style */
  variant?: "pills" | "indicator" | "cards"
  /** Whether to show descriptive sub-text below each item (default: false for minimal sidebar) */
  showDescriptions?: boolean
}

export function SettingsSidebar({
  items = settingsNavItems,
  groups = settingsNavGroups,
  variant = "pills",
  showDescriptions = false,
  className,
  ...props
}: SettingsSidebarProps) {
  return (
    <Card
      className={cn(
        "p-4 overflow-hidden",
        className
      )}
      {...props}
    >
      <SidebarNav
        items={groups ? undefined : items}
        groups={groups}
        variant={variant}
        orientation="auto"
        showDescriptions={showDescriptions}
        showIcons={true}
        showBadges={true}
        translationNamespace="settings"
      />
    </Card>
  )
}

export { settingsNavGroups, settingsNavItems }
