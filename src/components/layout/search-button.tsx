"use client"

import * as React from "react"
import { Search } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useSearch } from "@/context/search-provider"

interface SearchButtonProps extends React.ComponentProps<typeof Button> {
  placeholder?: string
}

export function SearchButton({
  className,
  placeholder = "Search...",
  ...props
}: SearchButtonProps) {
  const { setOpen } = useSearch()

  return (
    <Button
      variant="outline"
      className={cn(
        "relative h-8 w-full justify-start rounded-md bg-muted/30 text-xs text-muted-foreground shadow-none hover:bg-accent sm:w-44 md:w-56 lg:w-64",
        className
      )}
      onClick={() => setOpen(true)}
      {...props}
    >
      <Search className="mr-2 size-3.5" />
      <span className="truncate">{placeholder}</span>
      <kbd className="pointer-events-none absolute right-1.5 top-1.5 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
        <span className="text-xs">⌘</span>K
      </kbd>
    </Button>
  )
}
