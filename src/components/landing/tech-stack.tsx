import {
  Code2,
  Layers,
  Palette,
  Atom,
  Terminal,
} from "lucide-react"

const technologies = [
  {
    name: "Next.js",
    version: "16+ (App Router & Turbopack)",
    icon: Terminal,
    desc: "Server Components & Server Actions",
  },
  {
    name: "React",
    version: "19",
    icon: Atom,
    desc: "Concurrent rendering & Actions",
  },
  {
    name: "TypeScript",
    version: "5.x Strict",
    icon: Code2,
    desc: "Strict type safety end-to-end",
  },
  {
    name: "Tailwind CSS",
    version: "v4",
    icon: Palette,
    desc: "Zero-runtime CSS theme tokens",
  },
  {
    name: "shadcn/ui",
    version: "Base Nova",
    icon: Layers,
    desc: "Accessible primitives & design system",
  },
]

export function TechStack() {
  return (
    <section id="tech" className="border-y border-border/50 bg-muted/20 py-12">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Built on a modern developer stack
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {technologies.map((tech) => {
            const Icon = tech.icon
            return (
              <div
                key={tech.name}
                className="group flex flex-col items-center justify-center rounded-xl border border-border/60 bg-card/60 p-4 text-center transition-all hover:border-border hover:bg-card hover:shadow-xs"
              >
                <div className="mb-2.5 flex size-9 items-center justify-center rounded-lg bg-primary/5 text-primary transition-transform group-hover:scale-110">
                  <Icon className="size-4.5" />
                </div>
                <h3 className="font-heading text-sm font-semibold text-foreground">
                  {tech.name}
                </h3>
                <span className="font-mono text-[11px] text-primary/80 font-medium">
                  {tech.version}
                </span>
                <p className="mt-1 text-[11px] text-muted-foreground leading-tight">
                  {tech.desc}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
