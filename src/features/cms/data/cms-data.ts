export interface Post {
  id: string
  title: string
  slug: string
  category: string
  author: string
  status: "published" | "draft" | "archived"
  publishedAt: string
  views: number
}

export interface Category {
  id: string
  name: string
  slug: string
  description: string
  postCount: number
}

export interface Tag {
  id: string
  name: string
  slug: string
  count: number
}

export const initialPosts: Post[] = [
  {
    id: "post-1",
    title: "Introducing Next.js 16 and Modern Web Patterns",
    slug: "introducing-nextjs-16-modern-web-patterns",
    category: "Engineering",
    author: "Heera Singh",
    status: "published",
    publishedAt: "2026-09-15",
    views: 4820,
  },
  {
    id: "post-2",
    title: "Design Systems in 2026: The Rise of Fluid Design Tokens",
    slug: "design-systems-2026-fluid-design-tokens",
    category: "Design",
    author: "Sarah Chen",
    status: "published",
    publishedAt: "2026-09-10",
    views: 3150,
  },
  {
    id: "post-3",
    title: "Optimizing Full-Stack Server Components for Edge Latency",
    slug: "optimizing-server-components-edge-latency",
    category: "Performance",
    author: "Alex Rivera",
    status: "draft",
    publishedAt: "2026-09-02",
    views: 0,
  },
  {
    id: "post-4",
    title: "A Complete Guide to Internationalization in App Router",
    slug: "complete-guide-i18n-app-router",
    category: "Engineering",
    author: "Heera Singh",
    status: "published",
    publishedAt: "2026-08-28",
    views: 6420,
  },
  {
    id: "post-5",
    title: "Legacy REST to GraphQL Migration Strategies",
    slug: "legacy-rest-to-graphql-migration",
    category: "Architecture",
    author: "Elena Rostov",
    status: "archived",
    publishedAt: "2026-06-12",
    views: 890,
  },
]

export const initialCategories: Category[] = [
  {
    id: "cat-1",
    name: "Engineering",
    slug: "engineering",
    description: "Deep technical articles on frontend architectures and scalable backend services.",
    postCount: 14,
  },
  {
    id: "cat-2",
    name: "Design",
    slug: "design",
    description: "UI/UX principles, design system tokens, typography, and accessibility guidelines.",
    postCount: 8,
  },
  {
    id: "cat-3",
    name: "Performance",
    slug: "performance",
    description: "Benchmarks, web vitals optimizations, hydration metrics, and CDN tuning.",
    postCount: 6,
  },
  {
    id: "cat-4",
    name: "Architecture",
    slug: "architecture",
    description: "System design patterns, micro-frontends, domain-driven design, and cloud setups.",
    postCount: 5,
  },
]

export const initialTags: Tag[] = [
  { id: "tag-1", name: "Next.js", slug: "nextjs", count: 18 },
  { id: "tag-2", name: "TypeScript", slug: "typescript", count: 24 },
  { id: "tag-3", name: "Tailwind CSS", slug: "tailwindcss", count: 12 },
  { id: "tag-4", name: "React 19", slug: "react-19", count: 16 },
  { id: "tag-5", name: "Performance", slug: "performance", count: 9 },
  { id: "tag-6", name: "Architecture", slug: "architecture", count: 7 },
  { id: "tag-7", name: "Accessibility", slug: "accessibility", count: 11 },
]
