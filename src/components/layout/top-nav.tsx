"use client"

import * as React from "react"
import { Link, usePathname } from "@/i18n/routing"
import { useTranslations } from "next-intl"
import { Menu } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const topNavLinks = [
  {
    key: "overview",
    title: "Overview",
    href: "/dashboard",
  },
  {
    key: "tasks",
    title: "Tasks",
    href: "/dashboard/tasks",
  },
  {
    key: "apps",
    title: "Apps",
    href: "/dashboard/apps",
  },
  {
    key: "settings",
    title: "Settings",
    href: "/dashboard/settings",
  },
]

export function TopNav({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname()
  const t = useTranslations("common")

  const getLabel = (key: string, fallback: string) => {
    try {
      type CommonKey = Parameters<typeof t>[0]
      return t.has(key as CommonKey) ? t(key as CommonKey) : fallback
    } catch {
      return fallback
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              size="icon"
              variant="outline"
              className={cn("size-8 lg:hidden", className)}
            />
          }
        >
          <Menu className="size-4" />
          <span className="sr-only">Toggle navigation menu</span>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="bottom" align="start">
          {topNavLinks.map((item) => {
            const isActive =
              item.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname.startsWith(item.href)
            const label = getLabel(item.key, item.title)

            return (
              <DropdownMenuItem
                key={item.href}
                render={<Link href={item.href} />}
                className={isActive ? "font-semibold text-primary" : "text-muted-foreground"}
              >
                <span>{label}</span>
              </DropdownMenuItem>
            )
          })}
        </DropdownMenuContent>
      </DropdownMenu>

      <nav
        className={cn(
          "hidden items-center space-x-4 lg:flex xl:space-x-6",
          className
        )}
        {...props}
      >
        {topNavLinks.map((item) => {
          const isActive =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(item.href)
          const label = getLabel(item.key, item.title)

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "text-xs font-medium transition-colors hover:text-primary",
                isActive ? "text-foreground font-semibold" : "text-muted-foreground"
              )}
            >
              {label}
            </Link>
          )
        })}
      </nav>
    </>
  )
}
