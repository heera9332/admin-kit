import {
  CheckCircle2,
  Code2,
  FolderTree,
  ShieldCheck,
  Cpu,
  Compass,
  Sliders,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"

const devFeatures = [
  {
    title: "Clear architecture",
    desc: "Strict separation between routing, domain logic, presentation, and data repositories.",
    icon: FolderTree,
  },
  {
    title: "Feature-based organization",
    desc: "Business modules are isolated inside self-contained feature directories.",
    icon: Cpu,
  },
  {
    title: "Type-safe APIs",
    desc: "Strict TypeScript end-to-end with Zod schema validation on all inputs.",
    icon: ShieldCheck,
  },
  {
    title: "Reusable components",
    desc: "Built on accessible primitives that compose naturally without style conflicts.",
    icon: Code2,
  },
  {
    title: "Config-driven navigation",
    desc: "Modify application branding, routes, and navigation trees in one centralized file.",
    icon: Compass,
  },
  {
    title: "Easy customization",
    desc: "Swap color tokens, fonts, and layout shells using Tailwind CSS v4 variables.",
    icon: Sliders,
  },
]

export function DeveloperExperience() {
  return (
    <section className="py-20 lg:py-28">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Developer Value Props */}
          <div className="lg:col-span-6 space-y-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                DX & Maintainability
              </p>
              <h2 className="font-heading mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl text-foreground">
                Designed for developers
              </h2>
              <p className="mt-4 text-base text-muted-foreground leading-relaxed">
                We engineered this template around clean software principles: composable components, explicit types, and zero bloated runtime libraries.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {devFeatures.map((item) => {
                const Icon = item.icon
                return (
                  <div
                    key={item.title}
                    className="flex items-start gap-3 rounded-xl border border-border/60 bg-card/40 p-3.5 transition-colors hover:bg-card hover:border-border"
                  >
                    <div className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                      <Icon className="size-4" />
                    </div>
                    <div>
                      <h3 className="font-heading text-xs font-semibold text-foreground">
                        {item.title}
                      </h3>
                      <p className="mt-1 text-[11px] text-muted-foreground leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Right Column: Code Editor Visual */}
          <div className="lg:col-span-6">
            <div className="rounded-xl border border-border/80 bg-zinc-950 text-zinc-100 shadow-2xl overflow-hidden">
              {/* Window Header */}
              <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-900/80 px-4 py-3">
                <div className="flex items-center gap-2">
                  <span className="size-3 rounded-full bg-red-500/80" />
                  <span className="size-3 rounded-full bg-amber-500/80" />
                  <span className="size-3 rounded-full bg-emerald-500/80" />
                  <span className="ml-3 font-mono text-xs text-zinc-400">
                    user-management.tsx
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-[10px] font-mono border-zinc-700 text-zinc-400">
                    TypeScript
                  </Badge>
                </div>
              </div>

              {/* Code Snippets */}
              <div className="p-5 font-mono text-xs leading-relaxed overflow-x-auto space-y-6">
                <div>
                  <div className="text-zinc-500 mb-2">{"// 1. Composable Data Table"}</div>
                  <pre className="text-zinc-300">
                    <code>
                      <span className="text-purple-400">&lt;DataTable</span>
                      {"\n  "}
                      <span className="text-cyan-400">columns</span>
                      <span className="text-zinc-400">=</span>
                      <span className="text-emerald-400">&#123;columns&#125;</span>
                      {"\n  "}
                      <span className="text-cyan-400">data</span>
                      <span className="text-zinc-400">=</span>
                      <span className="text-emerald-400">&#123;users&#125;</span>
                      {"\n  "}
                      <span className="text-amber-400">searchable</span>
                      {"\n  "}
                      <span className="text-amber-400">pagination</span>
                      {"\n  "}
                      <span className="text-amber-400">filters</span>
                      {"\n"}
                      <span className="text-purple-400">/&gt;</span>
                    </code>
                  </pre>
                </div>

                <div className="border-t border-zinc-800/80 pt-4">
                  <div className="text-zinc-500 mb-2">{"// 2. Typed KPI Metric Card"}</div>
                  <pre className="text-zinc-300">
                    <code>
                      <span className="text-purple-400">&lt;StatCard</span>
                      {"\n  "}
                      <span className="text-cyan-400">title</span>
                      <span className="text-zinc-400">=</span>
                      <span className="text-emerald-300">&quot;Revenue&quot;</span>
                      {"\n  "}
                      <span className="text-cyan-400">value</span>
                      <span className="text-zinc-400">=</span>
                      <span className="text-emerald-300">&quot;$84,240&quot;</span>
                      {"\n  "}
                      <span className="text-cyan-400">trend</span>
                      <span className="text-zinc-400">=</span>
                      <span className="text-emerald-300">&quot;+12.5%&quot;</span>
                      {"\n"}
                      <span className="text-purple-400">/&gt;</span>
                    </code>
                  </pre>
                </div>
              </div>

              {/* Editor Footer Status Bar */}
              <div className="flex items-center justify-between border-t border-zinc-800 bg-zinc-900/60 px-4 py-2 font-mono text-[10px] text-zinc-500">
                <div className="flex items-center gap-3">
                  <span>UTF-8</span>
                  <span>React 19 Server Component</span>
                </div>
                <div className="flex items-center gap-1 text-emerald-400">
                  <CheckCircle2 className="size-3" />
                  <span>0 Type Errors</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
