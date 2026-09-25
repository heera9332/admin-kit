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
import { cn } from "@/lib/utils"
import { getSidebarIconColor } from "@/lib/icon-colors"
import { useRBAC } from "@/context/rbac-provider"
import type { NavGroup as NavGroupType } from "./types"

export function NavGroup({ title, titleKey, items }: NavGroupType) {
  const pathname = usePathname()
  const { setOpenMobile } = useSidebar()
  const t = useTranslations("nav")

  let rbac: ReturnType<typeof useRBAC> | null = null
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    rbac = useRBAC()
  } catch {
    rbac = null
  }

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

  const visibleItems = items.filter((item) => {
    if (item.permission && rbac && !rbac.hasPermission(item.permission)) {
      return false
    }
    if (item.items) {
      const allowedSubs = item.items.filter((sub) =>
        sub.permission ? (rbac ? rbac.hasPermission(sub.permission) : true) : true
      )
      return allowedSubs.length > 0
    }
    return true
  })

  if (visibleItems.length === 0) return null

  return (
    <SidebarGroup>
      <SidebarGroupLabel>{groupLabel}</SidebarGroupLabel>
      <SidebarMenu>
        {visibleItems.map((item) => {
          const itemLabel = getLabel(item.titleKey, item.title)

          if (!item.items) {
            const Icon = item.icon
            const iconColor = getSidebarIconColor(item.titleKey || item.title || item.url)
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
                  {Icon && (
                    <Icon
                      className={cn("size-4 shrink-0 transition-colors", iconColor)}
                    />
                  )}
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
          const iconColor = getSidebarIconColor(item.titleKey || item.title)
          const visibleSubItems = item.items.filter((sub) =>
            sub.permission ? (rbac ? rbac.hasPermission(sub.permission) : true) : true
          )
          const isGroupActive = visibleSubItems.some((sub) =>
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
                {Icon && (
                  <Icon
                    className={cn("size-4 shrink-0 transition-colors", iconColor)}
                  />
                )}
                <span>{itemLabel}</span>
                <ChevronRight className="ml-auto size-4 transition-transform duration-200 group-data-open/collapsible:rotate-90" />
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  {visibleSubItems.map((subItem) => {
                    const isSubActive = pathname === subItem.url
                    const subLabel = getLabel(subItem.titleKey, subItem.title)
                    const SubIcon = subItem.icon
                    const subIconColor = getSidebarIconColor(
                      subItem.titleKey || subItem.title || subItem.url
                    )

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
                          {SubIcon && (
                            <SubIcon
                              className={cn(
                                "size-4 shrink-0 transition-colors",
                                subIconColor
                              )}
                            />
                          )}
                          <span>{subLabel}</span>
                          {subItem.badge && (
                            <Badge variant="secondary" className="ml-auto px-1.5 py-0 text-[10px] font-mono">
                              {subItem.badge}
                            </Badge>
                          )}
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
