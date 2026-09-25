"use client"

import * as React from "react"
import type { Table } from "@tanstack/react-table"
import { X } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export interface DataTableFloatingBarProps<TData> {
  table: Table<TData>
  children?: React.ReactNode
  className?: string
  entityName?: string
}

export function DataTableFloatingBar<TData>({
  table,
  children,
  className,
  entityName = "item",
}: DataTableFloatingBarProps<TData>) {
  const selectedRows = table.getFilteredSelectedRowModel().rows
  const selectedCount = selectedRows.length

  if (selectedCount === 0) return null

  return (
    <div
      role="toolbar"
      aria-label="Bulk actions toolbar"
      className={cn(
        "fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 sm:gap-3 rounded-full border bg-background/95 px-3 py-1.5 sm:py-2 shadow-2xl backdrop-blur-md transition-all duration-300 animate-in fade-in slide-in-from-bottom-4 border-primary/20",
        className
      )}
    >
      <div className="flex items-center gap-1.5 pr-1 text-xs font-medium">
        <Badge
          variant="secondary"
          className="font-mono text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20"
        >
          {selectedCount}
        </Badge>
        <span className="hidden sm:inline text-muted-foreground">
          {selectedCount === 1 ? entityName : `${entityName}s`} selected
        </span>
      </div>

      <div className="h-4 w-px bg-border shrink-0" />

      {/* Bulk action buttons / dropdowns */}
      <div className="flex items-center gap-1.5">{children}</div>

      <div className="h-4 w-px bg-border shrink-0" />

      {/* Clear selection */}
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="size-7 sm:size-8 rounded-full text-muted-foreground hover:text-foreground cursor-pointer"
        onClick={() => table.resetRowSelection()}
        title="Clear selection"
      >
        <X className="size-3.5" />
        <span className="sr-only">Clear selection</span>
      </Button>
    </div>
  )
}
