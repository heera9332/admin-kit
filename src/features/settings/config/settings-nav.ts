import { UserCog, Wrench, Palette, Bell, Monitor } from "lucide-react"
import type {
  SidebarNavItem,
  SidebarNavGroup,
} from "@/components/navigation/sidebar-nav"

/**
 * All settings navigation items with routes, icons, translation keys, and helper descriptions.
 */
export const settingsNavItems: SidebarNavItem[] = [
  {
    title: "Profile",
    titleKey: "sidebar.profile",
    description: "Public workspace profile, personal info, and contact details",
    descriptionKey: "profile.description",
    href: "/dashboard/settings",
    icon: UserCog,
  },
  {
    title: "Account",
    titleKey: "sidebar.account",
    description: "Language, date of birth, and regional formats",
    descriptionKey: "account.description",
    href: "/dashboard/settings/account",
    icon: Wrench,
  },
  {
    title: "Appearance",
    titleKey: "sidebar.appearance",
    description: "Themes, fonts, dark mode, and interface styling",
    descriptionKey: "appearance.description",
    href: "/dashboard/settings/appearance",
    icon: Palette,
    badge: "Live",
    badgeVariant: "secondary",
  },
  {
    title: "Notifications",
    titleKey: "sidebar.notifications",
    description: "Email updates, activity alerts, and marketing digests",
    descriptionKey: "notifications.description",
    href: "/dashboard/settings/notifications",
    icon: Bell,
  },
  {
    title: "Display",
    titleKey: "sidebar.display",
    description: "Sidebar item visibility and screen display preferences",
    descriptionKey: "display.description",
    href: "/dashboard/settings/display",
    icon: Monitor,
  },
]

/**
 * Grouped navigation structure for settings sidebar.
 */
export const settingsNavGroups: SidebarNavGroup[] = [
  {
    title: "Account & Identity",
    titleKey: "groups.personal",
    items: [settingsNavItems[0], settingsNavItems[1]],
  },
  {
    title: "Preferences",
    titleKey: "groups.preferences",
    items: [settingsNavItems[2], settingsNavItems[3], settingsNavItems[4]],
  },
]
