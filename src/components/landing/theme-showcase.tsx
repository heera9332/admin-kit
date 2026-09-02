"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import { Sun, Moon, Sparkles, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"

export function ThemeShowcase() {
  const { theme, setTheme } = useTheme()

  return (
    <section className="py-20 lg:py-28">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">
            Color System & Contrast
          </p>
          <h2 className="font-heading mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl text-foreground">
            Built for light and dark interfaces.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed text-balance">
            Every component uses OKLCH design tokens for perfect contrast in both daylight and night mode. Zero layout shifts, zero CSS flickering.
          </p>

          {/* Quick Active Theme Switcher Controls */}
          <div className="mt-6 inline-flex items-center gap-2 rounded-xl border border-border bg-card p-1.5 shadow-xs">
            <Button
              variant={theme === "light" ? "default" : "ghost"}
              size="sm"
              onClick={() => setTheme("light")}
              className="gap-1.5 text-xs h-7"
            >
              <Sun className="size-3.5" />
              <span>Light</span>
            </Button>
            <Button
              variant={theme === "dark" ? "default" : "ghost"}
              size="sm"
              onClick={() => setTheme("dark")}
              className="gap-1.5 text-xs h-7"
            >
              <Moon className="size-3.5" />
              <span>Dark</span>
            </Button>
            <Button
              variant={theme === "system" ? "default" : "ghost"}
              size="sm"
              onClick={() => setTheme("system")}
              className="gap-1.5 text-xs h-7"
            >
              <Sparkles className="size-3.5" />
              <span>System</span>
            </Button>
          </div>
        </div>

        {/* Side-by-Side Comparison */}
        <div className="mt-14 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Light Theme Card Preview */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-md text-zinc-900">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-100">
              <div className="flex items-center gap-2">
                <Sun className="size-4 text-amber-500" />
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-600">
                  Light Theme
                </span>
              </div>
              <span className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-[11px] font-medium text-zinc-600">
                Contrast AA
              </span>
            </div>

            <div className="mt-6 space-y-4">
              <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4">
                <div className="flex items-center justify-between text-xs text-zinc-500">
                  <span>Monthly Active Users</span>
                  <span className="text-emerald-600 font-semibold font-mono">+14.2%</span>
                </div>
                <div className="mt-1 text-2xl font-bold text-zinc-900 font-heading">
                  12,480
                </div>
                <div className="mt-3 flex items-center gap-2 text-xs text-zinc-500">
                  <div className="h-1.5 flex-1 rounded-full bg-zinc-200 overflow-hidden">
                    <div className="h-full bg-zinc-900 rounded-full w-3/4" />
                  </div>
                  <span className="font-mono text-[11px]">75% target</span>
                </div>
              </div>

              <div className="flex items-center justify-between rounded-xl border border-zinc-200 p-3 bg-white">
                <div className="flex items-center gap-2.5">
                  <div className="flex size-7 items-center justify-center rounded-lg bg-zinc-100 text-zinc-800">
                    <TrendingUp className="size-3.5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-zinc-900">Enterprise Pipeline</p>
                    <p className="text-[11px] text-zinc-500">8 pending deals</p>
                  </div>
                </div>
                <span className="font-semibold text-xs text-zinc-900">$142,000</span>
              </div>
            </div>
          </div>

          {/* Dark Theme Card Preview */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6 shadow-md text-zinc-100">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <Moon className="size-4 text-blue-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                  Dark Theme
                </span>
              </div>
              <span className="rounded-full bg-zinc-900 border border-zinc-800 px-2.5 py-0.5 text-[11px] font-medium text-zinc-400">
                Contrast AA
              </span>
            </div>

            <div className="mt-6 space-y-4">
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
                <div className="flex items-center justify-between text-xs text-zinc-400">
                  <span>Monthly Active Users</span>
                  <span className="text-emerald-400 font-semibold font-mono">+14.2%</span>
                </div>
                <div className="mt-1 text-2xl font-bold text-zinc-100 font-heading">
                  12,480
                </div>
                <div className="mt-3 flex items-center gap-2 text-xs text-zinc-400">
                  <div className="h-1.5 flex-1 rounded-full bg-zinc-800 overflow-hidden">
                    <div className="h-full bg-zinc-100 rounded-full w-3/4" />
                  </div>
                  <span className="font-mono text-[11px]">75% target</span>
                </div>
              </div>

              <div className="flex items-center justify-between rounded-xl border border-zinc-800 p-3 bg-zinc-900/40">
                <div className="flex items-center gap-2.5">
                  <div className="flex size-7 items-center justify-center rounded-lg bg-zinc-800 text-zinc-200">
                    <TrendingUp className="size-3.5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-zinc-100">Enterprise Pipeline</p>
                    <p className="text-[11px] text-zinc-400">8 pending deals</p>
                  </div>
                </div>
                <span className="font-semibold text-xs text-zinc-100">$142,000</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
