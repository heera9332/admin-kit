import {
  LayoutDashboard,
  FolderKanban,
  ListTodo,
  Package,
  MessagesSquare,
  Users,
  Newspaper,
  Settings,
  HelpCircle,
  ShieldCheck,
  Bug,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"

export interface RouteConfig {
  titleKey?: string
  defaultTitle: string
  href?: string
  icon?: LucideIcon
  disabled?: boolean
}

/**
 * Route segment mapping for auto breadcrumb generation.
 */
export const routeConfigMap: Record<string, RouteConfig> = {
  dashboard: {
    titleKey: "dashboard",
    defaultTitle: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  projects: {
    titleKey: "projects",
    defaultTitle: "Projects",
    href: "/dashboard/projects",
    icon: FolderKanban,
  },
  tasks: {
    titleKey: "tasks",
    defaultTitle: "Tasks",
    href: "/dashboard/tasks",
    icon: ListTodo,
  },
  apps: {
    titleKey: "apps",
    defaultTitle: "Apps",
    href: "/dashboard/apps",
    icon: Package,
  },
  chats: {
    titleKey: "chats",
    defaultTitle: "Chats",
    href: "/dashboard/chats",
    icon: MessagesSquare,
  },
  users: {
    titleKey: "users",
    defaultTitle: "Users",
    href: "/dashboard/users",
    icon: Users,
  },
  cms: {
    titleKey: "cms",
    defaultTitle: "CMS",
    href: "/dashboard/cms/posts",
    icon: Newspaper,
  },
  posts: {
    titleKey: "posts",
    defaultTitle: "Posts",
    href: "/dashboard/cms/posts",
  },
  categories: {
    titleKey: "categories",
    defaultTitle: "Categories",
    href: "/dashboard/cms/categories",
  },
  tags: {
    titleKey: "tags",
    defaultTitle: "Tags",
    href: "/dashboard/cms/tags",
  },
  settings: {
    titleKey: "settings",
    defaultTitle: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
  account: {
    titleKey: "account",
    defaultTitle: "Account",
    href: "/dashboard/settings/account",
  },
  appearance: {
    titleKey: "appearance",
    defaultTitle: "Appearance",
    href: "/dashboard/settings/appearance",
  },
  notifications: {
    titleKey: "notifications",
    defaultTitle: "Notifications",
    href: "/dashboard/settings/notifications",
  },
  display: {
    titleKey: "display",
    defaultTitle: "Display",
    href: "/dashboard/settings/display",
  },
  "help-center": {
    titleKey: "helpCenter",
    defaultTitle: "Help Center",
    href: "/dashboard/help-center",
    icon: HelpCircle,
  },
  auth: {
    titleKey: "auth",
    defaultTitle: "Auth",
    icon: ShieldCheck,
    disabled: true,
  },
  errors: {
    titleKey: "errors",
    defaultTitle: "Errors",
    icon: Bug,
    disabled: true,
  },
}
