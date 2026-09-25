import type { LucideIcon } from "lucide-react"

export interface BaseNavItem {
  title: string
  titleKey?: string
  badge?: string
  icon?: LucideIcon
  permission?: string
}

export interface NavLink extends BaseNavItem {
  url: string
  items?: never
}

export interface NavCollapsible extends BaseNavItem {
  items: (BaseNavItem & { url: string; titleKey?: string; permission?: string })[]
  url?: never
}

export type NavItem = NavLink | NavCollapsible

export interface NavGroup {
  title: string
  titleKey?: string
  items: NavItem[]
}

export interface Team {
  name: string
  logo: LucideIcon
  plan: string
}

export interface User {
  name: string
  email: string
  avatar: string
  role?: string
}

export interface SidebarData {
  user: User
  teams: Team[]
  navGroups: NavGroup[]
}
