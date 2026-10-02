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
  Image,
  UserCog,
  BookOpen,
  Receipt,
  Truck,
  CreditCard,
  ShoppingBag,
  Tag,
  Ticket,
  Star,
  BarChart3,
  ShoppingCart,
  Store,
  MapPin,
  Coins,
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
  media: {
    titleKey: "media",
    defaultTitle: "Media",
    href: "/dashboard/media",
    icon: Image,
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
  ecommerce: {
    titleKey: "ecommerce",
    defaultTitle: "E-Commerce",
    href: "/dashboard/ecommerce",
    icon: ShoppingBag,
  },
  products: {
    titleKey: "products",
    defaultTitle: "Products",
    href: "/dashboard/ecommerce/products",
    icon: Package,
  },
  brands: {
    titleKey: "brands",
    defaultTitle: "Brands",
    href: "/dashboard/ecommerce/brands",
    icon: Tag,
  },
  orders: {
    titleKey: "orders",
    defaultTitle: "Orders",
    href: "/dashboard/ecommerce/orders",
    icon: ShoppingCart,
  },
  customers: {
    titleKey: "customers",
    defaultTitle: "Customers",
    href: "/dashboard/ecommerce/customers",
    icon: Users,
  },
  coupons: {
    titleKey: "coupons",
    defaultTitle: "Coupons",
    href: "/dashboard/ecommerce/coupons",
    icon: Ticket,
  },
  reviews: {
    titleKey: "reviews",
    defaultTitle: "Reviews",
    href: "/dashboard/ecommerce/reviews",
    icon: Star,
  },
  reports: {
    titleKey: "reports",
    defaultTitle: "Reports",
    href: "/dashboard/ecommerce/reports",
    icon: BarChart3,
  },
  store: {
    defaultTitle: "Store Settings",
    href: "/dashboard/ecommerce/settings/store",
    icon: Store,
  },
  payments: {
    defaultTitle: "Payments",
    href: "/dashboard/ecommerce/settings/payments",
    icon: CreditCard,
  },
  address: {
    defaultTitle: "Store Address",
    href: "/dashboard/ecommerce/settings/address",
    icon: MapPin,
  },
  currency: {
    defaultTitle: "Currency",
    href: "/dashboard/ecommerce/settings/currency",
    icon: Coins,
  },
  settings: {
    titleKey: "settings",
    defaultTitle: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
  profile: {
    titleKey: "profile",
    defaultTitle: "Profile",
    href: "/dashboard/settings/profile",
    icon: UserCog,
  },
  billing: {
    titleKey: "billing",
    defaultTitle: "Billing",
    href: "/dashboard/settings/billing",
    icon: Receipt,
  },
  shipping: {
    titleKey: "shipping",
    defaultTitle: "Shipping",
    href: "/dashboard/settings/shipping",
    icon: Truck,
  },
  payment: {
    titleKey: "payment",
    defaultTitle: "Payment",
    href: "/dashboard/settings/payment",
    icon: CreditCard,
  },
  overview: {
    titleKey: "overview",
    defaultTitle: "Overview",
    href: "/dashboard/settings/overview",
    icon: BookOpen,
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
