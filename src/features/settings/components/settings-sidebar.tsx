"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { UserCog, Wrench, Palette, Bell, Monitor } from "lucide-react"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

const navItems = [
  {
    title: "Profile",
    href: "/dashboard/settings",
    icon: UserCog,
  },
  {
    title: "Account",
    href: "/dashboard/settings/account",
    icon: Wrench,
  },
  {
    title: "Appearance",
    href: "/dashboard/settings/appearance",
    icon: Palette,
  },
  {
    title: "Notifications",
    href: "/dashboard/settings/notifications",
    icon: Bell,
  },
  {
    title: "Display",
    href: "/dashboard/settings/display",
    icon: Monitor,
  },
]

export function SettingsSidebar() {
  const pathname = usePathname()

  return (
    <nav className="flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1 overflow-x-auto pb-2 lg:pb-0">
      {navItems.map((item) => {
        const Icon = item.icon
        const isActive =
          item.href === "/dashboard/settings"
            ? pathname === "/dashboard/settings"
            : pathname === item.href

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
            <span>{item.title}</span>
          </Link>
        )
      })}
    </nav>
  )
}
