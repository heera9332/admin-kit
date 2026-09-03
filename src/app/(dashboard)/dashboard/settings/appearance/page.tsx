"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

function useMounted() {
  return React.useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  )
}

export default function AppearanceSettingsPage() {
  const { theme, setTheme } = useTheme()
  const mounted = useMounted()

  if (!mounted) {
    return null
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-base font-semibold">Appearance</h3>
        <p className="text-xs text-muted-foreground">
          Customize the appearance of the dashboard. Automatically switch between light and dark themes.
        </p>
      </div>

      <Separator />

      <div className="space-y-4">
        <h4 className="text-xs font-semibold text-foreground">Theme</h4>
        <p className="text-xs text-muted-foreground">Select the theme for your dashboard workspace.</p>

        <div className="grid max-w-md grid-cols-3 gap-4">
          {/* Light Theme Card */}
          <button
            type="button"
            onClick={() => setTheme("light")}
            className="flex flex-col items-center gap-2 cursor-pointer group"
          >
            <div
              className={cn(
                "w-full aspect-4/3 rounded-lg border-2 p-2 flex flex-col justify-between bg-white text-neutral-900 transition-all shadow-xs",
                theme === "light" ? "border-primary ring-2 ring-primary/20" : "border-border/80 group-hover:border-primary/50"
              )}
            >
              <div className="h-2 w-12 rounded-sm bg-neutral-200" />
              <div className="space-y-1.5">
                <div className="h-1.5 w-full rounded-sm bg-neutral-100" />
                <div className="h-1.5 w-2/3 rounded-sm bg-neutral-100" />
              </div>
            </div>
            <span className="text-xs font-medium">Light</span>
          </button>

          {/* Dark Theme Card */}
          <button
            type="button"
            onClick={() => setTheme("dark")}
            className="flex flex-col items-center gap-2 cursor-pointer group"
          >
            <div
              className={cn(
                "w-full aspect-4/3 rounded-lg border-2 p-2 flex flex-col justify-between bg-neutral-950 text-white transition-all shadow-xs",
                theme === "dark" ? "border-primary ring-2 ring-primary/20" : "border-border/80 group-hover:border-primary/50"
              )}
            >
              <div className="h-2 w-12 rounded-sm bg-neutral-800" />
              <div className="space-y-1.5">
                <div className="h-1.5 w-full rounded-sm bg-neutral-900" />
                <div className="h-1.5 w-2/3 rounded-sm bg-neutral-900" />
              </div>
            </div>
            <span className="text-xs font-medium">Dark</span>
          </button>

          {/* System Theme Card */}
          <button
            type="button"
            onClick={() => setTheme("system")}
            className="flex flex-col items-center gap-2 cursor-pointer group"
          >
            <div
              className={cn(
                "w-full aspect-4/3 rounded-lg border-2 p-2 flex justify-between overflow-hidden bg-gradient-to-r from-white via-neutral-200 to-neutral-950 transition-all shadow-xs",
                theme === "system" ? "border-primary ring-2 ring-primary/20" : "border-border/80 group-hover:border-primary/50"
              )}
            />
            <span className="text-xs font-medium">System</span>
          </button>
        </div>
      </div>
    </div>
  )
}
