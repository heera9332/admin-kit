"use client"

import * as React from "react"
import { Link } from "@/i18n/routing"
import { ArrowRight, Sparkles, X } from "lucide-react"

export function AnnouncementBar() {
  const [isVisible, setIsVisible] = React.useState(true)

  if (!isVisible) return null

  return (
    <div className="relative isolate flex items-center justify-center gap-x-3 bg-muted/60 px-4 py-2 text-xs font-medium text-muted-foreground border-b border-border/50 transition-all">
      <Link
        href="#features"
        className="inline-flex items-center gap-2 hover:text-foreground transition-colors group"
      >
        <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-semibold text-primary">
          <Sparkles className="size-3" />
          Template
        </span>
        <span className="font-normal text-foreground/90">
          Built with Next.js 16, TypeScript & shadcn/ui
        </span>
        <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
      </Link>
      <button
        type="button"
        onClick={() => setIsVisible(false)}
        className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground focus:outline-none"
        aria-label="Dismiss announcement"
      >
        <X className="size-3.5" />
      </button>
    </div>
  )
}
