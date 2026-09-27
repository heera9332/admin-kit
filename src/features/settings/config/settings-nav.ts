import {
  UserCog,
  Wrench,
  ShieldCheck,
  Palette,
  Bell,
  Monitor,
  BookOpen,
  Receipt,
  Truck,
  CreditCard,
} from "lucide-react"
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
    href: "/dashboard/settings/profile",
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
    title: "Security & Authentication",
    titleKey: "sidebar.security",
    description: "Two-factor authentication (2FA), password update, and active sessions",
    descriptionKey: "security.description",
    href: "/dashboard/settings/security",
    icon: ShieldCheck,
  },
  {
    title: "Overview",
    titleKey: "sidebar.overview",
    description: "Summary of addresses and saved payment methods",
    descriptionKey: "addresses.subtitle",
    href: "/dashboard/settings/overview",
    icon: BookOpen,
  },
  {
    title: "Billing Address",
    titleKey: "sidebar.billing",
    description: "Invoicing and tax billing address details",
    descriptionKey: "billing.subtitle",
    href: "/dashboard/settings/billing",
    icon: Receipt,
  },
  {
    title: "Shipping Address",
    titleKey: "sidebar.shipping",
    description: "Delivery and logistics destination addresses",
    descriptionKey: "shipping.subtitle",
    href: "/dashboard/settings/shipping",
    icon: Truck,
  },
  {
    title: "Payment Methods",
    titleKey: "sidebar.payment",
    description: "Saved credit cards, PayPal, and bank transfer accounts",
    descriptionKey: "payment.savedMethodsDesc",
    href: "/dashboard/settings/payment",
    icon: CreditCard,
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
    items: [settingsNavItems[0], settingsNavItems[1], settingsNavItems[2]],
  },
  {
    title: "Billing & Addresses",
    titleKey: "groups.billing",
    items: [
      settingsNavItems[3],
      settingsNavItems[4],
      settingsNavItems[5],
      settingsNavItems[6],
    ],
  },
  {
    title: "Preferences",
    titleKey: "groups.preferences",
    items: [settingsNavItems[7], settingsNavItems[8], settingsNavItems[9]],
  },
]
