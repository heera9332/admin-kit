"use client"

import * as React from "react"
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

export interface GridPaginationProps {
  currentPage: number
  totalItems: number
  pageSize: number
  onPageChange: (page: number) => void
  onPageSizeChange?: (pageSize: number) => void
  pageSizeOptions?: number[]
  className?: string
  itemLabel?: string
  showPageSizeSelector?: boolean
}

export function GridPagination({
  currentPage,
  totalItems,
  pageSize,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [12, 24, 36, 48],
  className,
  itemLabel = "items",
  showPageSizeSelector = true,
}: GridPaginationProps) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1
  const endItem = Math.min(totalItems, currentPage * pageSize)

  // Generate page numbers with ellipsis
  const getPageNumbers = () => {
    const pages: (number | "...")[] = []
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, "...", totalPages)
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages)
      } else {
        pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages)
      }
    }
    return pages
  }

  const pageNumbers = getPageNumbers()

  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row items-center justify-between gap-4 px-2 py-3 border-t bg-card/40 rounded-b-xl",
        className
      )}
    >
      <div className="flex-1 text-xs text-muted-foreground">
        Showing <span className="font-medium text-foreground font-mono">{startItem}</span> -{" "}
        <span className="font-medium text-foreground font-mono">{endItem}</span> of{" "}
        <span className="font-medium text-foreground font-mono">{totalItems}</span> {itemLabel}
      </div>

      <div className="flex flex-wrap items-center gap-3 sm:gap-6">
        {showPageSizeSelector && onPageSizeChange && (
          <div className="flex items-center space-x-2">
            <p className="text-xs text-muted-foreground font-medium">Per page</p>
            <Select
              value={`${pageSize}`}
              onValueChange={(val) => {
                if (val) {
                  onPageSizeChange(Number(val))
                  onPageChange(1)
                }
              }}
            >
              <SelectTrigger className="h-8 w-16 text-xs font-mono">
                <SelectValue placeholder={`${pageSize}`} />
              </SelectTrigger>
              <SelectContent side="top">
                {pageSizeOptions.map((opt) => (
                  <SelectItem key={opt} value={`${opt}`} className="text-xs font-mono">
                    {opt}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        <div className="flex items-center space-x-1">
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="size-8 cursor-pointer hidden sm:flex"
            onClick={() => onPageChange(1)}
            disabled={currentPage <= 1}
            aria-label="Go to first page"
          >
            <ChevronsLeft className="size-4" />
          </Button>

          <Button
            type="button"
            variant="outline"
            size="icon"
            className="size-8 cursor-pointer"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage <= 1}
            aria-label="Go to previous page"
          >
            <ChevronLeft className="size-4" />
          </Button>

          {/* Page numbers */}
          <div className="hidden sm:flex items-center space-x-1">
            {pageNumbers.map((page, index) => {
              if (page === "...") {
                return (
                  <span
                    key={`ellipsis-${index}`}
                    className="size-8 flex items-center justify-center text-xs text-muted-foreground select-none"
                  >
                    ...
                  </span>
                )
              }

              const isCurrent = page === currentPage
              return (
                <Button
                  key={page}
                  type="button"
                  variant={isCurrent ? "default" : "outline"}
                  size="icon"
                  className={cn(
                    "size-8 text-xs font-mono cursor-pointer",
                    isCurrent && "pointer-events-none"
                  )}
                  onClick={() => onPageChange(page)}
                  aria-label={`Page ${page}`}
                  aria-current={isCurrent ? "page" : undefined}
                >
                  {page}
                </Button>
              )
            })}
          </div>

          {/* Mobile page indicator */}
          <div className="flex sm:hidden items-center px-2 text-xs font-medium text-muted-foreground font-mono">
            {currentPage} / {totalPages}
          </div>

          <Button
            type="button"
            variant="outline"
            size="icon"
            className="size-8 cursor-pointer"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
            aria-label="Go to next page"
          >
            <ChevronRight className="size-4" />
          </Button>

          <Button
            type="button"
            variant="outline"
            size="icon"
            className="size-8 cursor-pointer hidden sm:flex"
            onClick={() => onPageChange(totalPages)}
            disabled={currentPage >= totalPages}
            aria-label="Go to last page"
          >
            <ChevronsRight className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
