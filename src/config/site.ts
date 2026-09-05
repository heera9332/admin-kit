export const siteConfig = {
  name: "AdminKit",
  tagline: "The Modern Next.js Admin Template",
  description:
    "A production-ready Next.js admin template for building SaaS, CRM, analytics, e-commerce, and internal applications.",
  url: "https://adminkit.dev",
  links: {
    github: "https://github.com/heera9332/admin-kit",
    docs: "#documentation",
    dashboard: "/dashboard",
  },
  author: {
    name: "AdminKit",
    url: "https://adminkit.zoro-dev.com",
  },
} as const

export type SiteConfig = typeof siteConfig
