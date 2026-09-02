import Link from "next/link"
import {
  ArrowUpRight,
  Boxes,
  BarChart3,
  ShoppingBag,
  Users2,
  KanbanSquare,
  Landmark,
  CheckCircle2,
} from "lucide-react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface DashboardCardProps {
  title: string
  category: string
  description: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  preview: React.ReactNode
}

const dashboards: DashboardCardProps[] = [
  {
    title: "SaaS",
    category: "Subscription Analytics",
    description: "Track MRR growth, churn rates, ARPU, and recurring subscription cohorts.",
    href: "/dashboard",
    icon: Boxes,
    preview: (
      <div className="space-y-3 rounded-lg border border-border/70 bg-background/80 p-3 text-xs">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Monthly Recurring Revenue</span>
          <Badge variant="secondary" className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono">
            +18.4%
          </Badge>
        </div>
        <div className="font-heading text-xl font-bold text-foreground">$42,850</div>
        <div className="space-y-1.5 pt-1">
          <div className="flex justify-between text-[11px] text-muted-foreground">
            <span>Enterprise (55%)</span>
            <span>Pro (35%)</span>
            <span>Starter (10%)</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-muted flex">
            <div className="bg-primary w-[55%]" />
            <div className="bg-primary/60 w-[35%]" />
            <div className="bg-primary/30 w-[10%]" />
          </div>
        </div>
      </div>
    ),
  },
  {
    title: "Analytics",
    category: "Traffic & Performance",
    description: "Deep-dive session duration, cohort retention, bounce rate, and referrer breakdown.",
    href: "/dashboard",
    icon: BarChart3,
    preview: (
      <div className="space-y-3 rounded-lg border border-border/70 bg-background/80 p-3 text-xs">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Total Pageviews</span>
          <span className="font-mono text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
            +32.1%
          </span>
        </div>
        <div className="font-heading text-xl font-bold text-foreground">482,900</div>
        {/* Mini Bars */}
        <div className="flex items-end gap-1.5 h-10 pt-2">
          {[35, 45, 60, 40, 75, 90, 65, 80, 95, 100, 85, 92].map((h, i) => (
            <div
              key={i}
              className="flex-1 bg-primary/20 hover:bg-primary transition-colors rounded-t-sm"
              style={{ height: `${h}%` }}
            />
          ))}
        </div>
      </div>
    ),
  },
  {
    title: "E-commerce",
    category: "Store & Inventory",
    description: "Order fulfillment status, SKU inventory monitoring, returns, and customer LTV.",
    href: "/dashboard",
    icon: ShoppingBag,
    preview: (
      <div className="space-y-3 rounded-lg border border-border/70 bg-background/80 p-3 text-xs">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Gross Sales</span>
          <Badge variant="outline" className="text-[10px] font-mono">
            3,410 Orders
          </Badge>
        </div>
        <div className="font-heading text-xl font-bold text-foreground">$118,420</div>
        <div className="rounded border border-border/60 p-2 bg-muted/30 flex items-center justify-between text-[11px]">
          <div className="truncate">
            <p className="font-medium text-foreground truncate">Order #8491</p>
            <p className="text-muted-foreground">Nike Air Pegasus • $149</p>
          </div>
          <Badge variant="secondary" className="text-[10px] text-emerald-600 dark:text-emerald-400">
            Delivered
          </Badge>
        </div>
      </div>
    ),
  },
  {
    title: "CRM",
    category: "Deals & Pipelines",
    description: "Lead lifecycles, weighted pipeline opportunity value, and team quota progress.",
    href: "/dashboard",
    icon: Users2,
    preview: (
      <div className="space-y-3 rounded-lg border border-border/70 bg-background/80 p-3 text-xs">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Weighted Pipeline</span>
          <span className="text-muted-foreground text-[11px]">Win Rate 41%</span>
        </div>
        <div className="font-heading text-xl font-bold text-foreground">$340,000</div>
        <div className="grid grid-cols-3 gap-1.5 text-center text-[10px]">
          <div className="rounded bg-muted/50 p-1.5">
            <div className="font-bold text-foreground">18</div>
            <div className="text-muted-foreground">Qualified</div>
          </div>
          <div className="rounded bg-muted/50 p-1.5">
            <div className="font-bold text-foreground">7</div>
            <div className="text-muted-foreground">Proposal</div>
          </div>
          <div className="rounded bg-primary/10 p-1.5 text-primary">
            <div className="font-bold">12</div>
            <div>Closed</div>
          </div>
        </div>
      </div>
    ),
  },
  {
    title: "Project Management",
    category: "Agile & Delivery",
    description: "Sprint velocity burndown, milestone completion, task boards, and member workload.",
    href: "/dashboard",
    icon: KanbanSquare,
    preview: (
      <div className="space-y-3 rounded-lg border border-border/70 bg-background/80 p-3 text-xs">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Sprint 14 Velocity</span>
          <span className="font-mono text-[11px] text-foreground font-medium">92% Done</span>
        </div>
        <div className="font-heading text-xl font-bold text-foreground">84 / 92 Tasks</div>
        <div className="flex items-center justify-between pt-1">
          <div className="flex -space-x-1.5">
            {["JD", "MK", "AL"].map((initials, idx) => (
              <Avatar key={idx} size="sm" className="size-5 text-[9px] border border-background">
                <AvatarFallback className="text-[9px] bg-muted font-semibold">
                  {initials}
                </AvatarFallback>
              </Avatar>
            ))}
          </div>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
            <CheckCircle2 className="size-3" />
            On Schedule
          </span>
        </div>
      </div>
    ),
  },
  {
    title: "Finance",
    category: "Invoices & Cashflow",
    description: "Real-time receivables, expense categorization, balance sheets, and audit exports.",
    href: "/dashboard",
    icon: Landmark,
    preview: (
      <div className="space-y-3 rounded-lg border border-border/70 bg-background/80 p-3 text-xs">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Operating Cash Flow</span>
          <span className="font-mono text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
            +32.4%
          </span>
        </div>
        <div className="font-heading text-xl font-bold text-foreground">$164,280</div>
        <div className="grid grid-cols-2 gap-2 pt-1 text-[11px]">
          <div className="rounded border border-border/60 p-1.5 bg-background/50">
            <p className="text-muted-foreground text-[10px]">Invoiced</p>
            <p className="font-semibold text-foreground">$82.4k</p>
          </div>
          <div className="rounded border border-border/60 p-1.5 bg-background/50">
            <p className="text-muted-foreground text-[10px]">Collected</p>
            <p className="font-semibold text-foreground">$79.1k</p>
          </div>
        </div>
      </div>
    ),
  },
]

export function DashboardShowcase() {
  return (
    <section id="dashboards" className="border-t border-border/50 bg-muted/10 py-20 lg:py-28">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">
            Turnkey Verticals
          </p>
          <h2 className="font-heading mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl text-foreground">
            One foundation. Multiple products.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed text-balance">
            Start with a proven admin shell and adapt it to your product.
          </p>
        </div>

        {/* 6 Dashboard Cards */}
        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dashboards.map((item) => {
            const Icon = item.icon
            return (
              <Card
                key={item.title}
                className="group relative flex flex-col justify-between border-border/70 bg-card transition-all hover:border-border hover:shadow-md"
              >
                <div>
                  <CardHeader className="p-5 pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex size-9 items-center justify-center rounded-lg bg-muted text-foreground transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                        <Icon className="size-4.5" />
                      </div>
                      <Badge variant="outline" className="text-[11px] font-normal">
                        {item.category}
                      </Badge>
                    </div>

                    <CardTitle className="mt-3 text-lg font-bold tracking-tight">
                      {item.title}
                    </CardTitle>
                    <CardDescription className="text-xs text-muted-foreground leading-relaxed">
                      {item.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="p-5 pt-2">
                    {item.preview}
                  </CardContent>
                </div>

                <div className="border-t border-border/60 p-4 pt-3 flex items-center justify-between text-xs font-medium">
                  <Link
                    href={item.href}
                    className="inline-flex items-center gap-1 text-primary hover:underline group-hover:translate-x-0.5 transition-transform"
                  >
                    <span>View {item.title} Dashboard</span>
                    <ArrowUpRight className="size-3.5" />
                  </Link>
                </div>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
