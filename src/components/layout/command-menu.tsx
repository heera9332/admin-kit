"use client"

import * as React from "react"
import { useRouter } from "@/i18n/routing"
import { ArrowRight, ChevronRight, Laptop, Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { useSearch } from "@/context/search-provider"
import { AppDialog } from "@/components/app-dialog"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import { useTranslations } from "next-intl"
import { sidebarData } from "./data/sidebar-data"

export function CommandMenu() {
  const router = useRouter()
  const { setTheme } = useTheme()
  const { open, setOpen } = useSearch()
  const tNav = useTranslations("nav")

  const getLabel = (key?: string, fallback = "") => {
    if (!key) return fallback
    try {
      type NavKey = Parameters<typeof tNav>[0]
      return tNav.has(key as NavKey) ? tNav(key as NavKey) : fallback
    } catch {
      return fallback
    }
  }

  const runCommand = React.useCallback(
    (command: () => unknown) => {
      setOpen(false)
      command()
    },
    [setOpen]
  )

  return (
    <AppDialog
      open={open}
      onOpenChange={setOpen}
      title="Command Palette"
      description="Search for a command to run..."
      headerClassName="sr-only"
      size="4xl"
      className="top-[12%] sm:top-[15%] translate-y-0 w-[95vw] sm:max-w-3xl md:max-w-4xl overflow-hidden rounded-xl! p-0 gap-0 shadow-2xl border bg-popover"
      showCloseButton={false}
    >
      <Command className="w-full">
        <CommandInput placeholder="Type a command or search..." />
        <CommandList className="max-h-[420px] sm:max-h-[500px]">
          <CommandEmpty>No results found.</CommandEmpty>
          {sidebarData.navGroups.map((group) => {
            const groupTitle = getLabel(group.titleKey, group.title)

            return (
              <CommandGroup key={group.title} heading={groupTitle}>
                {group.items.map((navItem, i) => {
                  const itemTitle = getLabel(navItem.titleKey, navItem.title)

                  if (navItem.url) {
                    return (
                      <CommandItem
                        key={`${navItem.url}-${i}`}
                        value={`${navItem.title} ${itemTitle}`}
                        onSelect={() => {
                          runCommand(() => router.push(navItem.url))
                        }}
                      >
                        <div className="flex size-4 items-center justify-center mr-2">
                          <ArrowRight className="size-3 text-muted-foreground/80" />
                        </div>
                        <span>{itemTitle}</span>
                      </CommandItem>
                    )
                  }

                  return navItem.items?.map((subItem, j) => {
                    const subTitle = getLabel(subItem.titleKey, subItem.title)

                    return (
                      <CommandItem
                        key={`${navItem.title}-${subItem.url}-${j}`}
                        value={`${navItem.title} ${itemTitle} ${subItem.title} ${subTitle}`}
                        onSelect={() => {
                          runCommand(() => router.push(subItem.url))
                        }}
                      >
                        <div className="flex size-4 items-center justify-center mr-2">
                          <ArrowRight className="size-3 text-muted-foreground/80" />
                        </div>
                        <span className="text-muted-foreground">{itemTitle}</span>
                        <ChevronRight className="size-3 mx-1 text-muted-foreground" />
                        <span>{subTitle}</span>
                      </CommandItem>
                    )
                  })
                })}
              </CommandGroup>
            )
          })}
          <CommandSeparator />
          <CommandGroup heading="Theme">
            <CommandItem onSelect={() => runCommand(() => setTheme("light"))}>
              <Sun className="mr-2 size-4" />
              <span>Light</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => setTheme("dark"))}>
              <Moon className="mr-2 size-4" />
              <span>Dark</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => setTheme("system"))}>
              <Laptop className="mr-2 size-4" />
              <span>System</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
        <div className="flex items-center justify-between border-t px-4 py-2.5 bg-muted/20 text-muted-foreground text-[11px] font-mono select-none">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="rounded border bg-background px-1.5 py-0.5 text-[10px] font-medium shadow-2xs">↑↓</kbd>
              <span>navigate</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="rounded border bg-background px-1.5 py-0.5 text-[10px] font-medium shadow-2xs">↵</kbd>
              <span>select</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="rounded border bg-background px-1.5 py-0.5 text-[10px] font-medium shadow-2xs">esc</kbd>
              <span>close</span>
            </span>
          </div>
          <span className="text-[10px] text-muted-foreground/60 hidden sm:inline">
            AdminKit Command Palette
          </span>
        </div>
      </Command>
    </AppDialog>
  )
}
