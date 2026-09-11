"use client"

import { useTranslations } from "next-intl"
import { Link, usePathname } from "@/i18n/routing"
import { UserCog, Wrench, Palette, Bell, Monitor } from "lucide-react"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

const navItems = [
  {
    key: "profile",
    title: "Profile",
    href: "/dashboard/settings",
    icon: UserCog,
  },
  {
    key: "account",
    title: "Account",
    href: "/dashboard/settings/account",
    icon: Wrench,
  },
  {
    key: "appearance",
    title: "Appearance",
    href: "/dashboard/settings/appearance",
    icon: Palette,
  },
  {
    key: "notifications",
    title: "Notifications",
    href: "/dashboard/settings/notifications",
    icon: Bell,
  },
  {
    key: "display",
    title: "Display",
    href: "/dashboard/settings/display",
    icon: Monitor,
  },
]

export function SettingsSidebar() {
  const pathname = usePathname()
  const t = useTranslations("nav")
  type NavKey = Parameters<typeof t>[0]

  return (
    <nav className="flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1 overflow-x-auto pb-2 lg:pb-0">
      {navItems.map((item) => {
        const Icon = item.icon
        const isActive =
          item.href === "/dashboard/settings"
            ? pathname === "/dashboard/settings"
            : pathname === item.href
        const label = t.has(item.key as NavKey) ? t(item.key as NavKey) : item.title

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              buttonVariants({ variant: "ghost", size: "sm" }),
              isActive
                ? "bg-muted hover:bg-muted font-semibold text-foreground"
                : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
              "justify-start gap-2 h-9 text-xs shrink-0"
            )}
          >
            <Icon className="size-4" />
            <span>{label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
