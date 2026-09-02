import Link from "next/link"
import { ArrowRight, Sparkles, LayoutGrid } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-12 pb-10 sm:pt-16 sm:pb-14 lg:pt-20 lg:pb-16">
      {/* Background subtle radial glow (no giant colorful blobs) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 transform-gpu overflow-hidden blur-3xl"
      >
        <div className="relative left-[calc(50%-15rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-primary/10 to-muted opacity-40 sm:left-[calc(50%-25rem)] sm:w-[50rem]" />
      </div>

      <div className="container mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
        {/* Eyebrow */}
        <div className="inline-flex items-center gap-2 mb-6">
          <Badge
            variant="outline"
            className="rounded-full px-3.5 py-1 text-xs font-semibold tracking-wider uppercase border-border/80 bg-background/80 text-muted-foreground shadow-xs"
          >
            <Sparkles className="size-3 text-primary" />
            THE MODERN NEXT.JS ADMIN TEMPLATE
          </Badge>
        </div>

        {/* Headline */}
        <h1 className="font-heading text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl text-foreground text-balance">
          Build powerful admin panels.
          <br className="hidden sm:inline" />
          <span className="text-muted-foreground block sm:inline sm:ml-3">
            Ship products faster.
          </span>
        </h1>

        {/* Supporting text */}
        <p className="mx-auto mt-6 max-w-2xl text-base sm:text-lg lg:text-xl text-muted-foreground text-balance leading-relaxed">
          A production-ready admin foundation built with Next.js, TypeScript, Tailwind CSS, and shadcn/ui.
        </p>

        {/* Primary and Secondary CTA buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
          <Link
            href="/dashboard"
            className={buttonVariants({
              variant: "default",
              size: "lg",
              className: "w-full sm:w-auto h-11 px-6 text-sm font-semibold shadow-sm hover:shadow-md transition-shadow gap-2",
            })}
          >
            <span>Get Started</span>
            <ArrowRight className="size-4" />
          </Link>

          <Link
            href="/dashboard"
            className={buttonVariants({
              variant: "outline",
              size: "lg",
              className: "w-full sm:w-auto h-11 px-6 text-sm font-medium gap-2 border-border/80 hover:bg-muted/80",
            })}
          >
            <LayoutGrid className="size-4 text-muted-foreground" />
            <span>Explore Dashboards</span>
          </Link>
        </div>

        {/* Small technology stack line */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-medium text-muted-foreground/80">
          <span className="flex items-center gap-1.5">
            <span className="size-1.5 rounded-full bg-primary/60" />
            Next.js
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-1.5 rounded-full bg-primary/60" />
            TypeScript
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-1.5 rounded-full bg-primary/60" />
            Tailwind CSS
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-1.5 rounded-full bg-primary/60" />
            shadcn/ui
          </span>
        </div>
      </div>
    </section>
  )
}
