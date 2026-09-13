"use client"

import type { Table } from "@tanstack/react-table"
import { X } from "lucide-react"
import type * as React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DataTableFacetedFilter } from "./data-table-faceted-filter"
import { DataTableViewOptions } from "./data-table-view-options"
import type { DataTableFilter, DataTableSearchConfig } from "./types"

interface DataTableToolbarProps<TData> {
  table: Table<TData>
  search?: DataTableSearchConfig
  filters?: DataTableFilter[]
  children?: React.ReactNode
}

export function DataTableToolbar<TData>({
  table,
  search,
  filters,
  children,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0
  const searchColumn = search ? table.getColumn(search.column) : undefined

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-1 flex-wrap items-center gap-2">
        {search && searchColumn && (
          <Input
            placeholder={search.placeholder ?? `Filter ${search.column}...`}
            value={(searchColumn.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              searchColumn.setFilterValue(event.target.value)
            }
            className="h-8 w-full sm:w-[150px] lg:w-[250px] text-xs"
          />
        )}
        {filters?.map((filter) => {
          const column = table.getColumn(filter.column)
          if (!column) return null

          return (
            <DataTableFacetedFilter
              key={filter.column}
              column={column}
              title={filter.title}
              options={filter.options}
            />
          )
        })}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3 text-xs"
          >
            Reset
            <X className="ml-2 size-3.5" />
          </Button>
        )}
      </div>
      <div className="flex items-center gap-2 self-end sm:self-auto">
        {children}
        <DataTableViewOptions table={table} />
      </div>
    </div>
  )
}
