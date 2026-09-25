"use client"

import * as React from "react"
import { usePathname, Link } from "@/i18n/routing"
import { useTranslations } from "next-intl"
import {
  ChevronRight,
  Slash,
  ArrowRight,
  Home,
  type LucideIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem as UIBreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
} from "@/components/ui/breadcrumb"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useBreadcrumbs } from "@/context/breadcrumb-provider"
import { routeConfigMap } from "@/config/breadcrumbs"
import type { AppBreadcrumbsProps, BreadcrumbItem, BreadcrumbSeparatorType } from "./types"

function formatSegment(str: string): string {
  return str
    .replace(/[_-]/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase())
}

function renderSeparatorIcon(separator: BreadcrumbSeparatorType) {
  if (React.isValidElement(separator)) {
    return separator
  }
  switch (separator) {
    case "slash":
      return <Slash className="size-3 -rotate-12 text-muted-foreground/50" />
    case "dot":
      return <span className="size-1 rounded-full bg-muted-foreground/50 inline-block" />
    case "arrow":
      return <ArrowRight className="size-3 text-muted-foreground/60" />
    case "chevron":
    default:
      return <ChevronRight className="size-3.5 text-muted-foreground/60" />
  }
}

export function AppBreadcrumbs({
  items: propsItems,
  pathname: propsPathname,
  showHome: propsShowHome,
  homeHref = "/dashboard",
  homeLabel,
  homeIcon = Home,
  showHomeLabel = false,
  showSegmentIcons: propsShowSegmentIcons,
  showCurrentPage = true,
  separator = "chevron",
  maxItems: propsMaxItems,
  itemsBeforeCollapse = 1,
  itemsAfterCollapse = 1,
  labels: propsLabels,
  disabledPaths = [],
  hideOnRoot = false,
  capitalize = true,
  className,
  renderItem,
}: AppBreadcrumbsProps) {
  const currentPathname = usePathname()
  const activePath = propsPathname || currentPathname || "/dashboard"
  const tNav = useTranslations("nav")
  const context = useBreadcrumbs()

  // Determine showHome, showSegmentIcons, and maxItems with context fallbacks and defaults
  const showHome =
    typeof propsShowHome === "boolean"
      ? propsShowHome
      : typeof context.showHome === "boolean"
      ? context.showHome
      : true

  const showSegmentIcons =
    typeof propsShowSegmentIcons === "boolean"
      ? propsShowSegmentIcons
      : typeof context.showSegmentIcons === "boolean"
      ? context.showSegmentIcons
      : false // Only show the main pre-icon Home; do not show icons for subsequent pages

  const maxItems =
    typeof propsMaxItems === "number"
      ? propsMaxItems
      : typeof context.maxItems === "number"
      ? context.maxItems
      : 3 // Default: collapse middle items into three-dot dropdown if > 3 items

  // Resolve Home Item
  const resolvedHomeLabel =
    homeLabel ||
    (() => {
      try {
        type NavKey = Parameters<typeof tNav>[0]
        return tNav.has("dashboard" as NavKey) ? tNav("dashboard" as NavKey) : "Home"
      } catch {
        return "Home"
      }
    })()

  const HomeIconComponent =
    homeIcon === true || homeIcon === undefined
      ? Home
      : typeof homeIcon === "function"
      ? (homeIcon as LucideIcon)
      : null

  const homeBreadcrumbItem = React.useMemo<BreadcrumbItem>(
    () => ({
      label: resolvedHomeLabel,
      href: homeHref,
      icon: HomeIconComponent || Home,
    }),
    [resolvedHomeLabel, homeHref, HomeIconComponent]
  )

  // Auto-generate items from route if not explicitly provided
  const generatedItems = React.useMemo(() => {
    const isHomeItem = (item?: BreadcrumbItem) =>
      Boolean(item && (item.href === homeHref || item.href === "/" || item.icon === Home))

    // 1. Direct props override takes highest priority
    if (propsItems && propsItems.length > 0) {
      if (showHome && !isHomeItem(propsItems[0])) {
        return [homeBreadcrumbItem, ...propsItems]
      }
      return propsItems
    }

    // 2. Context override takes next priority
    if (context.customItems && context.customItems.length > 0) {
      if (showHome && !isHomeItem(context.customItems[0])) {
        return [homeBreadcrumbItem, ...context.customItems]
      }
      return context.customItems
    }

    const segments = activePath.split("/").filter(Boolean)
    const result: BreadcrumbItem[] = []

    // If on /dashboard and hideOnRoot is requested
    if (hideOnRoot && (activePath === "/dashboard" || segments.length === 0)) {
      return []
    }

    // Add Home / Root
    if (showHome) {
      result.push({ ...homeBreadcrumbItem })
    }

    // Process route segments (skip 'dashboard' if already added as Home)
    let cumulativePath = ""
    for (let i = 0; i < segments.length; i++) {
      const segment = segments[i]
      cumulativePath += `/${segment}`

      // Skip root segment if Home already represents it
      if (segment === "dashboard" && showHome) {
        continue
      }

      // Check user labels override (from props or context)
      const customLabel =
        propsLabels?.[segment] ||
        context.customLabels?.[segment] ||
        propsLabels?.[cumulativePath] ||
        context.customLabels?.[cumulativePath]

      // Check routeConfigMap
      const config = routeConfigMap[segment]

      let labelText: React.ReactNode = customLabel
      if (!labelText) {
        if (config?.titleKey) {
          try {
            type NavKey = Parameters<typeof tNav>[0]
            labelText = tNav.has(config.titleKey as NavKey)
              ? tNav(config.titleKey as NavKey)
              : config.defaultTitle
          } catch {
            labelText = config.defaultTitle
          }
        } else {
          labelText = capitalize ? formatSegment(segment) : segment
        }
      }

      // Determine href
      const isLast = i === segments.length - 1
      const isDisabled =
        disabledPaths.includes(cumulativePath) ||
        Boolean(config?.disabled)

      let href: string | undefined = undefined
      if (!isLast && !isDisabled) {
        href = config?.href || cumulativePath
      }

      result.push({
        label: labelText,
        href,
        icon: config?.icon,
        active: isLast,
      })
    }

    // Handle single item if activePath is only /dashboard
    if (result.length === 1 && result[0].href === homeHref) {
      result[0].active = true
      result[0].href = undefined
    }

    return result
  }, [
    propsItems,
    context.customItems,
    activePath,
    hideOnRoot,
    showHome,
    homeBreadcrumbItem,
    homeHref,
    context.customLabels,
    propsLabels,
    capitalize,
    disabledPaths,
    tNav,
  ])

  // Merge prepended and appended items from context
  const finalItems = React.useMemo(() => {
    let list = [...generatedItems]
    if (context.prependItems && context.prependItems.length > 0) {
      list = [...context.prependItems, ...list]
    }
    if (context.appendItems && context.appendItems.length > 0) {
      // Mark previously active item as clickable link
      if (list.length > 0) {
        const last = list[list.length - 1]
        if (!last.href) {
          last.href = activePath
          last.active = false
        }
      }
      list = [...list, ...context.appendItems]
    }

    // Ensure the last item is marked active if showCurrentPage is enabled
    if (list.length > 0 && showCurrentPage) {
      list[list.length - 1].active = true
    }

    return list
  }, [generatedItems, context.prependItems, context.appendItems, activePath, showCurrentPage])

  // If a page explicitly hides breadcrumbs or list is empty, do not render
  if (context.isHidden || finalItems.length === 0) {
    return null
  }

  // Handle maxItems collapsing (shows three-dot ellipsis if total items exceed maxItems)
  const shouldCollapse =
    typeof maxItems === "number" &&
    maxItems > 0 &&
    finalItems.length > maxItems &&
    finalItems.length > itemsBeforeCollapse + itemsAfterCollapse

  const startItems = shouldCollapse ? finalItems.slice(0, itemsBeforeCollapse) : finalItems
  const collapsedItems = shouldCollapse
    ? finalItems.slice(itemsBeforeCollapse, finalItems.length - itemsAfterCollapse)
    : []
  const endItems = shouldCollapse
    ? finalItems.slice(finalItems.length - itemsAfterCollapse)
    : []

  return (
    <Breadcrumb className={cn("select-none text-xs", className)}>
      <BreadcrumbList className="gap-1 sm:gap-1.5">
        {/* Start items */}
        {startItems.map((item, idx) => {
          const isLast = !shouldCollapse && idx === startItems.length - 1
          const isHome = idx === 0 && showHome
          return (
            <React.Fragment key={`start-${idx}-${item.href || idx}`}>
              <UIBreadcrumbItem className={item.className}>
                {renderItemContent(item, idx, isLast, renderItem, isHome, showHomeLabel, showSegmentIcons)}
              </UIBreadcrumbItem>
              {(!isLast || shouldCollapse) && (
                <BreadcrumbSeparator className="text-muted-foreground/40">
                  {renderSeparatorIcon(separator)}
                </BreadcrumbSeparator>
              )}
            </React.Fragment>
          )
        })}

        {/* Collapsed items with interactive three-dot dropdown */}
        {shouldCollapse && collapsedItems.length > 0 && (
          <>
            <UIBreadcrumbItem>
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <button
                      type="button"
                      className="flex size-6 items-center justify-center rounded-sm hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring"
                      aria-label="View more breadcrumb items"
                    />
                  }
                >
                  <BreadcrumbEllipsis />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-auto min-w-40 p-1">
                  {collapsedItems.map((cItem, cIdx) => (
                    <DropdownMenuItem
                      key={`collapsed-${cIdx}-${cItem.href || cIdx}`}
                      render={
                        cItem.href ? (
                          <Link
                            href={cItem.href}
                            className="flex items-center gap-2 cursor-pointer w-full py-1.5"
                          />
                        ) : undefined
                      }
                    >
                      {showSegmentIcons && cItem.icon && (
                        <cItem.icon className="size-4 shrink-0 opacity-70" />
                      )}
                      <span className="truncate">{cItem.label}</span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </UIBreadcrumbItem>
            <BreadcrumbSeparator className="text-muted-foreground/40">
              {renderSeparatorIcon(separator)}
            </BreadcrumbSeparator>
          </>
        )}

        {/* End items */}
        {endItems.map((item, idx) => {
          const isLast = idx === endItems.length - 1
          const originalIndex = finalItems.length - endItems.length + idx
          return (
            <React.Fragment key={`end-${idx}-${item.href || idx}`}>
              <UIBreadcrumbItem className={item.className}>
                {renderItemContent(item, originalIndex, isLast, renderItem, false, false, showSegmentIcons)}
              </UIBreadcrumbItem>
              {!isLast && (
                <BreadcrumbSeparator className="text-muted-foreground/40">
                  {renderSeparatorIcon(separator)}
                </BreadcrumbSeparator>
              )}
            </React.Fragment>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}

function renderItemContent(
  item: BreadcrumbItem,
  index: number,
  isLast: boolean,
  renderItem?: AppBreadcrumbsProps["renderItem"],
  isHome: boolean = false,
  showHomeLabel: boolean = false,
  showSegmentIcons: boolean = false
) {
  if (renderItem) {
    return renderItem(item, index, isLast)
  }

  const Icon = showSegmentIcons ? item.icon : undefined
  const labelText = typeof item.label === "string" ? item.label : "Home"

  // Special rendering for the initial Home icon (pre-icon)
  if (isHome) {
    const HomeIconComponent = item.icon || Home
    const HomeIconEl = <HomeIconComponent className="size-4 shrink-0" />

    if (isLast || !item.href) {
      return (
        <BreadcrumbPage
          className="flex items-center gap-1.5 font-medium text-foreground p-0.5"
          title={labelText}
          aria-label={labelText}
        >
          {HomeIconEl}
          {showHomeLabel && <span>{item.label}</span>}
          {!showHomeLabel && <span className="sr-only">{item.label}</span>}
        </BreadcrumbPage>
      )
    }

    return (
      <BreadcrumbLink
        render={<Link href={item.href} />}
        className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors p-0.5 rounded-sm"
        title={labelText}
        aria-label={labelText}
      >
        {HomeIconEl}
        {showHomeLabel && <span>{item.label}</span>}
        {!showHomeLabel && <span className="sr-only">{item.label}</span>}
      </BreadcrumbLink>
    )
  }

  if (isLast || !item.href) {
    return (
      <BreadcrumbPage className="flex items-center gap-1.5 font-medium text-foreground max-w-[200px] sm:max-w-xs truncate">
        {Icon && <Icon className="size-3.5 shrink-0 opacity-75" />}
        <span className="truncate">{item.label}</span>
      </BreadcrumbPage>
    )
  }

  return (
    <BreadcrumbLink
      render={<Link href={item.href} />}
      className="flex items-center gap-1.5 hover:text-foreground transition-colors max-w-[150px] sm:max-w-[200px] truncate"
    >
      {Icon && <Icon className="size-3.5 shrink-0 opacity-75" />}
      <span className="truncate">{item.label}</span>
    </BreadcrumbLink>
  )
}
