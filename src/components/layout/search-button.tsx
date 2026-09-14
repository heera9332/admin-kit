"use client"

import * as React from "react"
import { useTranslations } from "next-intl"
import { Search } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useSearch } from "@/context/search-provider"

interface SearchButtonProps extends React.ComponentProps<typeof Button> {
  placeholder?: string
}

export function SearchButton({
  className,
  placeholder,
  ...props
}: SearchButtonProps) {
  const { setOpen } = useSearch()
  const t = useTranslations("common")
  const displayPlaceholder = placeholder ?? t("search")

  return (
    <Button
      variant="outline"
      className={cn(
        "relative h-8 w-8 p-0 rounded-md bg-muted/30 text-xs text-muted-foreground shadow-none hover:bg-accent sm:h-8 sm:w-44 sm:px-3 sm:justify-start md:w-56 lg:w-64",
        className
      )}
      onClick={() => setOpen(true)}
      aria-label={displayPlaceholder}
      {...props}
    >
      <Search className="size-4 shrink-0 sm:mr-2 sm:size-3.5" />
      <span className="hidden sm:inline-block truncate">{displayPlaceholder}</span>
      <span className="sr-only sm:hidden">{displayPlaceholder}</span>
      <kbd className="pointer-events-none absolute right-1.5 top-1.5 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
        <span className="text-xs">⌘</span>K
      </kbd>
    </Button>
  )
}
