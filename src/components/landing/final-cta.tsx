import { Link } from "@/i18n/routing"
import { ArrowRight, BookOpen, Sparkles } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"

export function FinalCta() {
  return (
    <section id="documentation" className="border-t border-border/50 bg-muted/20 py-20 lg:py-28">
      <div className="container mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-border/80 bg-card p-8 sm:p-12 lg:p-16 shadow-xl relative overflow-hidden">
          {/* Subtle background glow */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center blur-3xl opacity-20"
          >
            <div className="size-96 rounded-full bg-primary" />
          </div>

          <div className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-background/80 px-3.5 py-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-6">
            <Sparkles className="size-3 text-primary" />
            <span>Ready to Deploy</span>
          </div>

          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground text-balance">
            Start building your next admin application.
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-base sm:text-lg text-muted-foreground text-balance leading-relaxed">
            Skip the repetitive setup and start with a production-ready foundation.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <Link
              href="/dashboard"
              className={buttonVariants({
                variant: "default",
                size: "lg",
                className: "w-full sm:w-auto h-11 px-7 text-sm font-semibold shadow-sm gap-2",
              })}
            >
              <span>Get Started</span>
              <ArrowRight className="size-4" />
            </Link>

            <Link
              href="#documentation"
              className={buttonVariants({
                variant: "outline",
                size: "lg",
                className: "w-full sm:w-auto h-11 px-7 text-sm font-medium gap-2 border-border hover:bg-muted",
              })}
            >
              <BookOpen className="size-4 text-muted-foreground" />
              <span>View Documentation</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
