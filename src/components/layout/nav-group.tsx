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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useTranslations } from "next-intl"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { getSidebarIconColor } from "@/lib/icon-colors"
import { useRBAC } from "@/context/rbac-provider"
import type { NavCollapsible, NavGroup as NavGroupType } from "./types"

function checkIsActive(pathname: string, url: string) {
  if (url === "/dashboard") {
    return pathname === "/dashboard"
  }
  return pathname === url || pathname.startsWith(`${url}/`)
}

interface NavCollapsibleItemProps {
  item: NavCollapsible
  pathname: string
  isCollapsed: boolean
  getLabel: (key?: string, fallback?: string) => string
  setOpenMobile: (open: boolean) => void
  rbac: ReturnType<typeof useRBAC> | null
}

function NavCollapsibleItem({
  item,
  pathname,
  isCollapsed,
  getLabel,
  setOpenMobile,
  rbac,
}: NavCollapsibleItemProps) {
  const [dropdownOpen, setDropdownOpen] = React.useState(false)

  const visibleSubItems = item.items.filter((sub) =>
    sub.permission ? (rbac ? rbac.hasPermission(sub.permission) : true) : true
  )

  if (visibleSubItems.length === 0) return null

  const itemLabel = getLabel(item.titleKey, item.title)
  const Icon = item.icon
  const iconColor = getSidebarIconColor(item.titleKey || item.title)
  const isGroupActive = visibleSubItems.some((sub) => checkIsActive(pathname, sub.url))

  if (isCollapsed) {
    return (
      <SidebarMenuItem key={item.title}>
        <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen} modal={false}>
          <DropdownMenuTrigger
            render={
              <SidebarMenuButton
                isActive={isGroupActive}
                className="cursor-pointer data-popup-open:bg-sidebar-accent data-popup-open:text-sidebar-accent-foreground"
              />
            }
          >
            {Icon && (
              <Icon
                className={cn("size-4 shrink-0 transition-colors", iconColor)}
              />
            )}
            <span>{itemLabel}</span>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            side="right"
            align="start"
            sideOffset={4}
            className="w-48 rounded-lg shadow-lg"
          >
            <DropdownMenuLabel className="flex items-center justify-between font-semibold text-xs text-foreground px-2 py-1.5">
              <span>{itemLabel}</span>
              {item.badge && (
                <Badge variant="secondary" className="ml-auto px-1.5 py-0 text-[10px] font-mono">
                  {item.badge}
                </Badge>
              )}
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="my-1" />
            {visibleSubItems.map((subItem) => {
              const isSubActive = checkIsActive(pathname, subItem.url)
              const subLabel = getLabel(subItem.titleKey, subItem.title)
              const SubIcon = subItem.icon
              const subIconColor = getSidebarIconColor(
                subItem.titleKey || subItem.title || subItem.url
              )

              return (
                <DropdownMenuItem
                  key={subItem.title}
                  render={
                    <Link
                      href={subItem.url}
                      onClick={() => {
                        setDropdownOpen(false)
                        setOpenMobile(false)
                      }}
                    />
                  }
                  className={cn(
                    "cursor-pointer flex items-center gap-2 px-2 py-1.5 text-sm",
                    isSubActive && "bg-accent font-medium text-accent-foreground"
                  )}
                >
                  {SubIcon && (
                    <SubIcon
                      className={cn(
                        "size-4 shrink-0 transition-colors",
                        subIconColor
                      )}
                    />
                  )}
                  <span className="flex-1 truncate">{subLabel}</span>
                  {subItem.badge && (
                    <Badge variant="secondary" className="ml-auto px-1.5 py-0 text-[10px] font-mono">
                      {subItem.badge}
                    </Badge>
                  )}
                </DropdownMenuItem>
              )
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    )
  }

  return (
    <Collapsible
      key={item.title}
      defaultOpen={isGroupActive}
      className="group/collapsible"
      render={<SidebarMenuItem />}
    >
      <CollapsibleTrigger
        render={<SidebarMenuButton tooltip={itemLabel} isActive={isGroupActive} />}
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
            const isSubActive = checkIsActive(pathname, subItem.url)
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
}

export function NavGroup({ title, titleKey, items }: NavGroupType) {
  const pathname = usePathname()
  const { state, isMobile, setOpenMobile } = useSidebar()
  const isCollapsed = state === "collapsed" && !isMobile
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
            const isActive = checkIsActive(pathname, item.url)

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
          return (
            <NavCollapsibleItem
              key={item.title}
              item={item as NavCollapsible}
              pathname={pathname}
              isCollapsed={isCollapsed}
              getLabel={getLabel}
              setOpenMobile={setOpenMobile}
              rbac={rbac}
            />
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}
