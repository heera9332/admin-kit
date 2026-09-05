export interface NavItem {
  title: string
  href: string
  disabled?: boolean
  external?: boolean
  label?: string
  description?: string
}

export interface NavSection {
  title: string
  items: NavItem[]
}

export const marketingNav: NavItem[] = [
  {
    title: "Features",
    href: "#features",
  },
  {
    title: "Dashboards",
    href: "#dashboards",
  },
  {
    title: "Components",
    href: "#components",
  },
  {
    title: "Documentation",
    href: "#documentation",
  },
]

export const footerNav: NavSection[] = [
  {
    title: "Product",
    items: [
      { title: "Features", href: "#features" },
      { title: "Dashboards", href: "#dashboards" },
      { title: "Components", href: "#components" },
    ],
  },
  {
    title: "Resources",
    items: [
      { title: "Documentation", href: "#documentation" },
      { title: "GitHub", href: "https://github.com/heera9332/admin-kit", external: true },
    ],
  },
  {
    title: "Company",
    items: [
      { title: "About", href: "#" },
      { title: "Changelog", href: "#" },
    ],
  },
]

export const dashboardTypes = [
  {
    title: "SaaS",
    description: "Subscription metrics, MRR growth, churn rates, and user engagement tracking.",
    href: "/dashboard",
    badge: "Popular",
    icon: "Boxes",
  },
  {
    title: "Analytics",
    description: "Deep-dive cohort analysis, conversion funnels, event tracking, and session depth.",
    href: "/dashboard",
    badge: "Real-time",
    icon: "BarChart3",
  },
  {
    title: "E-commerce",
    description: "SKU-level performance, order fulfillment, refund flows, and inventory alerts.",
    href: "/dashboard",
    badge: "Transactional",
    icon: "ShoppingBag",
  },
  {
    title: "CRM",
    description: "Contact lifecycles, deal stages, pipeline velocity, and team quotas.",
    href: "/dashboard",
    badge: "Pipelines",
    icon: "Users",
  },
  {
    title: "Project Management",
    description: "Sprint velocity, milestone tracking, resource allocation, and task boards.",
    href: "/dashboard",
    badge: "Agile",
    icon: "Kanban",
  },
  {
    title: "Finance",
    description: "Cash flow reconciliations, invoice management, tax reporting, and balance sheets.",
    href: "/dashboard",
    badge: "Audit-ready",
    icon: "Landmark",
  },
] as const
