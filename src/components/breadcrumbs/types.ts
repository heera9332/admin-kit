import * as React from "react"
import type { LucideIcon } from "lucide-react"

export interface BreadcrumbItem {
  label: React.ReactNode
  href?: string
  icon?: LucideIcon | React.ComponentType<{ className?: string }>
  active?: boolean
  className?: string
}

export type BreadcrumbSeparatorType =
  | "chevron"
  | "slash"
  | "dot"
  | "arrow"
  | React.ReactNode

export interface AppBreadcrumbsProps {
  /**
   * Explicit override items. If provided, disables auto route generation
   * unless merged via context.
   */
  items?: BreadcrumbItem[]

  /**
   * Custom pathname to generate breadcrumbs from. Defaults to current URL pathname.
   */
  pathname?: string

  /**
   * Whether to display the root/home breadcrumb item.
   * @default true
   */
  showHome?: boolean

  /**
   * Root/home link target.
   * @default "/dashboard"
   */
  homeHref?: string

  /**
   * Custom label for root/home. Defaults to translated "Dashboard" or "Home".
   */
  homeLabel?: string

  /**
   * Whether to display text label next to the Home icon.
   * When false (default), the breadcrumb starts with just the Home icon,
   * with accessible screen-reader text and hover title.
   * @default false
   */
  showHomeLabel?: boolean

  /**
   * Icon component for root/home.
   * Set to `false` to hide icon.
   * @default Home
   */
  homeIcon?: LucideIcon | React.ComponentType<{ className?: string }> | boolean

  /**
   * Whether to render the current page (last item).
   * @default true
   */
  showCurrentPage?: boolean

  /**
   * Separator style or custom element between breadcrumb items.
   * @default "chevron"
   */
  separator?: BreadcrumbSeparatorType

  /**
   * Maximum number of visible items before collapsing intermediate items into a three-dot ellipsis dropdown.
   * When breadcrumb items exceed this number, a three-dot ellipsis button appears with a dropdown to view hidden items.
   * @default 3
   */
  maxItems?: number

  /**
   * Number of items to display before the collapsed ellipsis.
   * @default 1
   */
  itemsBeforeCollapse?: number

  /**
   * Number of items to display after the collapsed ellipsis.
   * @default 1
   */
  itemsAfterCollapse?: number

  /**
   * Custom dictionary to map route segments to human-readable labels.
   * Example: `{ "PRJ-1001": "Enterprise SaaS Platform" }`
   */
  labels?: Record<string, string>

  /**
   * Array of route paths that should NOT be clickable links.
   * Example: `["/dashboard/cms"]`
   */
  disabledPaths?: string[]

  /**
   * Whether to hide breadcrumbs when on the root dashboard page (`/dashboard`).
   * @default false
   */
  hideOnRoot?: boolean

  /**
   * Whether to auto-capitalize segment labels.
   * @default true
   */
  capitalize?: boolean

  /**
   * Additional class name for breadcrumb container.
   */
  className?: string

  /**
   * Custom renderer for individual breadcrumb items.
   */
  renderItem?: (
    item: BreadcrumbItem,
    index: number,
    isLast: boolean
  ) => React.ReactNode
}
