import {
  ArrowDown,
  Globe,
  Layout,
  Layers,
  Cpu,
  Server,
  Database,
} from "lucide-react"

const architectureLayers = [
  {
    step: "01",
    title: "Next.js 16+",
    subtitle: "App Router & Runtime",
    desc: "Server Components, static optimization, edge routing, and streaming SSR.",
    icon: Globe,
  },
  {
    step: "02",
    title: "Admin Shell",
    subtitle: "Application Framework",
    desc: "Responsive sidebar, breadcrumbs, command palette, and user session controls.",
    icon: Layout,
  },
  {
    step: "03",
    title: "Reusable UI",
    subtitle: "Component Primitives",
    desc: "Accessible shadcn/ui components, TanStack tables, and Recharts visualization.",
    icon: Layers,
  },
  {
    step: "04",
    title: "Feature Modules",
    subtitle: "Domain Logic",
    desc: "Isolated business features: SaaS, CRM, E-commerce, Analytics, Projects, and Billing.",
    icon: Cpu,
  },
  {
    step: "05",
    title: "Services / API",
    subtitle: "Data Access Layer",
    desc: "Type-safe repositories, server actions, and schema validations.",
    icon: Server,
  },
  {
    step: "06",
    title: "Database",
    subtitle: "Persistence Engine",
    desc: "Flexible data source integration: Drizzle ORM, PostgreSQL, or REST endpoints.",
    icon: Database,
  },
]

export function Architecture() {
  return (
    <section className="border-t border-border/50 bg-muted/10 py-20 lg:py-28">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">
            System Design
          </p>
          <h2 className="font-heading mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl text-foreground">
            Built to scale with your application
          </h2>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed text-balance">
            A clean layered architecture designed so you can replace or extend any tier without rewriting the rest of the application.
          </p>
        </div>

        {/* Visual Stack Flow */}
        <div className="mt-14 max-w-3xl mx-auto space-y-3">
          {architectureLayers.map((layer, index) => {
            const Icon = layer.icon
            const isLast = index === architectureLayers.length - 1

            return (
              <div key={layer.title} className="flex flex-col items-center">
                <div className="w-full flex items-center gap-4 rounded-xl border border-border/70 bg-card p-4 shadow-xs transition-all hover:border-border hover:shadow-sm">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="size-5" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-semibold text-primary">
                          {layer.step}
                        </span>
                        <h3 className="font-heading text-sm font-bold text-foreground">
                          {layer.title}
                        </h3>
                        <span className="text-muted-foreground text-xs hidden sm:inline">
                          —
                        </span>
                        <span className="text-xs text-muted-foreground font-medium">
                          {layer.subtitle}
                        </span>
                      </div>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                      {layer.desc}
                    </p>
                  </div>
                </div>

                {!isLast && (
                  <div className="py-1.5 text-muted-foreground/60">
                    <ArrowDown className="size-4 animate-bounce duration-1000" />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
