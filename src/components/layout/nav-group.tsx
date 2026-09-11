"use client"

import * as React from "react"
import { Link, usePathname } from "@/i18n/routing"
import { ChevronRight } from "lucide-react"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { useTranslations } from "next-intl"
import { Badge } from "@/components/ui/badge"
import type { NavGroup as NavGroupType } from "./types"

export function NavGroup({ title, titleKey, items }: NavGroupType) {
  const pathname = usePathname()
  const { setOpenMobile } = useSidebar()
  const t = useTranslations("nav")

  const getLabel = (key?: string, fallback = "") => {
    if (!key) return fallback
    try {
      type NavKey = Parameters<typeof t>[0]
      return t.has(key as NavKey) ? t(key as NavKey) : fallback
    } catch {
      return fallback
    }
  }

  const groupLabel = getLabel(titleKey, title)

  return (
    <SidebarGroup>
      <SidebarGroupLabel>{groupLabel}</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          const itemLabel = getLabel(item.titleKey, item.title)

          if (!item.items) {
            const Icon = item.icon
            const isActive =
              item.url === "/dashboard"
                ? pathname === "/dashboard"
                : pathname.startsWith(item.url)

            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  render={<Link href={item.url} onClick={() => setOpenMobile(false)} />}
                  isActive={isActive}
                  tooltip={itemLabel}
                >
                  {Icon && <Icon className="size-4" />}
                  <span>{itemLabel}</span>
                  {item.badge && (
                    <Badge variant="secondary" className="ml-auto px-1.5 py-0 text-[10px] font-mono">
                      {item.badge}
                    </Badge>
                  )}
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          }

          // Collapsible group
          const Icon = item.icon
          const isGroupActive = item.items.some((sub) =>
            pathname === sub.url || pathname.startsWith(`${sub.url}/`)
          )

          return (
            <Collapsible
              key={item.title}
              defaultOpen={isGroupActive}
              className="group/collapsible"
              render={<SidebarMenuItem />}
            >
              <CollapsibleTrigger
                render={<SidebarMenuButton tooltip={itemLabel} />}
              >
                {Icon && <Icon className="size-4" />}
                <span>{itemLabel}</span>
                <ChevronRight className="ml-auto size-4 transition-transform duration-200 group-data-open/collapsible:rotate-90" />
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  {item.items.map((subItem) => {
                    const isSubActive = pathname === subItem.url
                    const subLabel = getLabel(subItem.titleKey, subItem.title)

                    return (
                      <SidebarMenuSubItem key={subItem.title}>
                        <SidebarMenuSubButton
                          render={
                            <Link
                              href={subItem.url}
                              onClick={() => setOpenMobile(false)}
                            />
                          }
                          isActive={isSubActive}
                        >
                          <span>{subLabel}</span>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    )
                  })}
                </SidebarMenuSub>
              </CollapsibleContent>
            </Collapsible>
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}
