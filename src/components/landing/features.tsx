import {
  ShieldCheck,
  Smartphone,
  Moon,
  Table2,
  FileCheck2,
  Code2,
} from "lucide-react"
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

const featureList = [
  {
    icon: ShieldCheck,
    title: "Production Ready",
    description: "Clean architecture designed for real applications.",
    details:
      "Engineered with strict separation of concerns, repository patterns, and full error and loading boundaries.",
  },
  {
    icon: Smartphone,
    title: "Responsive by Default",
    description: "Every layout works across desktop, tablet, and mobile.",
    details:
      "Carefully tested viewports from 320px to ultra-wide displays with collapsible navigation drawers.",
  },
  {
    icon: Moon,
    title: "Dark Mode",
    description: "Light, dark, and system themes included.",
    details:
      "Engineered using semantic CSS design tokens with flawless contrast and zero theme flickering.",
  },
  {
    icon: Table2,
    title: "Powerful Data Tables",
    description: "Sorting, filtering, pagination, selection, and bulk actions.",
    details:
      "Full TanStack Table integration supporting URL query state, column visibility, and row selections.",
  },
  {
    icon: FileCheck2,
    title: "Flexible Forms",
    description: "Reusable forms with React Hook Form and Zod validation.",
    details:
      "Pre-configured form components, accessible validation states, and type-safe server actions.",
  },
  {
    icon: Code2,
    title: "Developer Friendly",
    description: "TypeScript-first architecture with clear customization points.",
    details:
      "Centralized configurations, strict ESLint standards, and clean modular feature boundaries.",
  },
]

export function Features() {
  return (
    <section id="features" className="py-20 lg:py-28">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">
            Architecture & Primitives
          </p>
          <h2 className="font-heading mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl text-foreground">
            Everything you need to build your admin
          </h2>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed text-balance">
            Reusable infrastructure for building modern SaaS and business applications without starting from scratch.
          </p>
        </div>

        {/* 6 Feature Cards Grid */}
        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featureList.map((feature) => {
            const Icon = feature.icon
            return (
              <Card
                key={feature.title}
                className="group relative border-border/70 bg-card/60 transition-all hover:border-border hover:bg-card hover:shadow-sm"
              >
                <CardHeader className="space-y-3 p-6">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary transition-transform group-hover:scale-105">
                    <Icon className="size-5" />
                  </div>
                  <div className="space-y-1.5">
                    <CardTitle className="text-lg font-semibold tracking-tight">
                      {feature.title}
                    </CardTitle>
                    <CardDescription className="text-sm font-medium text-foreground/80">
                      {feature.description}
                    </CardDescription>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed pt-1">
                    {feature.details}
                  </p>
                </CardHeader>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
