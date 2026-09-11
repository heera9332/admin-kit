"use client"

import * as React from "react"
import { useRouter } from "@/i18n/routing"
import { ArrowRight, ChevronRight, Laptop, Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { useSearch } from "@/context/search-provider"
import {
  CommandDialog,
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
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList className="max-h-80">
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
    </CommandDialog>
  )
}
