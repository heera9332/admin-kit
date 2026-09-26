"use client"

import * as React from "react"
import { usePathname, Link } from "@/i18n/routing"
import { useTranslations } from "next-intl"
import type { LucideIcon } from "lucide-react"
import { ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

export interface SidebarNavItem {
  /** The displayed title or fallback label */
  title: string
  /** Translation key for the title (optional) */
  titleKey?: string
  /** The URL destination */
  href: string
  /** Lucide icon component */
  icon?: LucideIcon
  /** Optional secondary helper text / description */
  description?: string
  /** Translation key for description (optional) */
  descriptionKey?: string
  /** Optional badge text or counter */
  badge?: string | number | React.ReactNode
  /** Variant of the badge */
  badgeVariant?: "default" | "secondary" | "destructive" | "outline"
  /** Whether the item is disabled */
  disabled?: boolean
  /** Whether the link points to an external site */
  external?: boolean
}

export interface SidebarNavGroup {
  /** Section heading title */
  title?: string
  /** Translation key for the group heading */
  titleKey?: string
  /** List of items under this group */
  items: SidebarNavItem[]
}

export interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  /** Flat list of navigation items */
  items?: SidebarNavItem[]
  /** Grouped navigation items with section headers */
  groups?: SidebarNavGroup[]
  /** Visual variant style */
  variant?: "pills" | "indicator" | "cards"
  /** Display orientation: vertical stack, horizontal row, or auto (horizontal on mobile, vertical on desktop) */
  orientation?: "vertical" | "horizontal" | "auto"
  /** Whether to show descriptions beneath the titles */
  showDescriptions?: boolean
  /** Whether to render leading icons */
  showIcons?: boolean
  /** Whether to render badges */
  showBadges?: boolean
  /** Active indicator chevron on the right */
  showChevron?: boolean
  /** Translation namespace for next-intl (default: "settings") */
  translationNamespace?: string
  /** Custom class for item links */
  itemClassName?: string
  /** Custom class for active item link */
  activeItemClassName?: string
  /** Optional click callback */
  onItemClick?: (item: SidebarNavItem) => void
}

export function SidebarNav({
  items,
  groups,
  variant = "pills",
  orientation = "auto",
  showDescriptions = false,
  showIcons = true,
  showBadges = true,
  showChevron = false,
  translationNamespace = "settings",
  className,
  itemClassName,
  activeItemClassName,
  onItemClick,
  ...props
}: SidebarNavProps) {
  const pathname = usePathname()
  const t = useTranslations(translationNamespace as any)

  // Normalize into groups: if flat items passed, wrap in single nameless group
  const navGroups: SidebarNavGroup[] = React.useMemo(() => {
    if (groups && groups.length > 0) return groups
    if (items && items.length > 0) return [{ items }]
    return []
  }, [groups, items])

  const getLabel = (key?: string, fallback = "") => {
    if (!key) return fallback
    try {
      type KeyType = Parameters<typeof t>[0]
      return t.has(key as KeyType) ? t(key as KeyType) : fallback
    } catch {
      return fallback
    }
  }

  const checkIsActive = (href: string) => {
    // If exact root settings path
    if (href === "/dashboard/settings") {
      return pathname === "/dashboard/settings"
    }
    // Sub-routes match exactly or starts with href + "/"
    return pathname === href || pathname.startsWith(`${href}/`)
  }

  if (navGroups.length === 0) return null

  // Determine container layout classes based on orientation
  const isAuto = orientation === "auto"
  const isHorizontal = orientation === "horizontal"

  return (
    <nav
      role="navigation"
      aria-label="Settings sub-navigation"
      className={cn(
        "w-full",
        isAuto && "flex flex-col gap-6",
        orientation === "vertical" && "flex flex-col gap-6",
        isHorizontal && "flex flex-row overflow-x-auto gap-2 pb-2",
        className
      )}
      {...props}
    >
      {/* Mobile Horizontal View (Shown when orientation="auto" on small screens) */}
      {isAuto && (
        <div className="lg:hidden w-full overflow-x-auto scrollbar-none py-0.5">
          <div className="flex items-center gap-1 min-w-max">
            {navGroups.flatMap((group) => group.items).map((item) => {
              const isActive = checkIsActive(item.href)
              const label = getLabel(item.titleKey, item.title)
              const Icon = item.icon

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => onItemClick?.(item)}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 select-none",
                    isActive
                      ? "bg-primary/10 text-primary font-semibold dark:bg-primary/20"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/60",
                    item.disabled && "pointer-events-none opacity-50"
                  )}
                >
                  {showIcons && Icon && (
                    <Icon
                      className={cn(
                        "size-3.5 shrink-0 transition-colors",
                        isActive ? "text-primary" : "text-muted-foreground"
                      )}
                    />
                  )}
                  <span>{label}</span>
                  {showBadges && item.badge && (
                    <span className="ml-1 inline-flex size-1.5 rounded-full bg-primary" />
                  )}
                </Link>
              )
            })}
          </div>
        </div>
      )}

      {/* Desktop View (or Vertical View) */}
      <div
        className={cn(
          isAuto ? "hidden lg:flex lg:flex-col lg:gap-6" : "flex flex-col gap-6",
          isHorizontal && "hidden"
        )}
      >
        {navGroups.map((group, groupIdx) => {
          const groupTitle = getLabel(group.titleKey, group.title)

          return (
            <div key={group.title || groupIdx} className="space-y-1.5">
              {groupTitle && (
                <div className="px-3 pb-1">
                  <h4 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/80">
                    {groupTitle}
                  </h4>
                </div>
              )}

              <div className="flex flex-col gap-1">
                {group.items.map((item) => {
                  const isActive = checkIsActive(item.href)
                  const label = getLabel(item.titleKey, item.title)
                  const desc = getLabel(item.descriptionKey, item.description)
                  const Icon = item.icon

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => onItemClick?.(item)}
                      aria-current={isActive ? "page" : undefined}
                      className={cn(
                        // Base item styles
                        showDescriptions
                          ? "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-medium transition-all duration-200 outline-hidden select-none"
                          : "group relative flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs font-medium transition-all duration-150 outline-hidden select-none",
                        "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",

                        // Variant: Pills (modern soft background highlight)
                        variant === "pills" && [
                          isActive
                            ? "bg-primary/10 text-primary font-semibold dark:bg-primary/20"
                            : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
                        ],

                        // Variant: Indicator (accent line on left)
                        variant === "indicator" && [
                          isActive
                            ? "bg-muted/80 text-foreground font-semibold before:absolute before:left-0 before:top-2 before:bottom-2 before:w-1 before:rounded-r-full before:bg-primary"
                            : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
                        ],

                        // Variant: Cards (card-like container with subtle borders)
                        variant === "cards" && [
                          "border",
                          isActive
                            ? "bg-card text-foreground font-semibold border-primary/40 shadow-xs ring-1 ring-primary/20"
                            : "bg-card/50 text-muted-foreground border-border/50 hover:bg-card hover:border-border hover:text-foreground",
                        ],

                        item.disabled && "pointer-events-none opacity-50",
                        isActive && activeItemClassName,
                        itemClassName
                      )}
                    >
                      {/* Leading Icon */}
                      {showIcons && Icon && (
                        showDescriptions ? (
                          <div
                            className={cn(
                              "flex size-8 shrink-0 items-center justify-center rounded-lg transition-all duration-200",
                              isActive
                                ? "bg-primary text-primary-foreground shadow-xs shadow-primary/25"
                                : "bg-muted/70 text-muted-foreground group-hover:bg-muted group-hover:text-foreground"
                            )}
                          >
                            <Icon className="size-4" />
                          </div>
                        ) : (
                          <Icon
                            className={cn(
                              "size-4 shrink-0 transition-colors",
                              isActive
                                ? "text-primary"
                                : "text-muted-foreground group-hover:text-foreground"
                            )}
                          />
                        )
                      )}

                      {/* Title & Description Container */}
                      <div className="flex-1 min-w-0">
                        <span
                          className={cn(
                            "truncate text-xs font-medium block",
                            isActive && "font-semibold text-primary"
                          )}
                        >
                          {label}
                        </span>
                        {showDescriptions && desc && (
                          <p
                            className={cn(
                              "text-[11px] font-normal leading-tight line-clamp-1 mt-0.5 transition-colors",
                              isActive
                                ? "text-muted-foreground"
                                : "text-muted-foreground/70 group-hover:text-muted-foreground"
                            )}
                          >
                            {desc}
                          </p>
                        )}
                      </div>

                      {/* Optional Trailing Badge */}
                      {showBadges && item.badge && (
                        <Badge
                          variant={item.badgeVariant || (isActive ? "default" : "secondary")}
                          className={cn(
                            "ml-auto text-[10px] px-1.5 py-0 h-5 font-medium shrink-0",
                            !isActive && "text-muted-foreground bg-muted/80"
                          )}
                        >
                          {item.badge}
                        </Badge>
                      )}

                      {/* Optional Trailing Chevron */}
                      {showChevron && (
                        <ChevronRight
                          className={cn(
                            "size-4 shrink-0 transition-transform duration-200 text-muted-foreground/50",
                            isActive ? "text-primary translate-x-0.5" : "group-hover:translate-x-0.5 group-hover:text-foreground"
                          )}
                        />
                      )}
                    </Link>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </nav>
  )
}
