"use client"

import * as React from "react"
import {
  type ColumnFiltersState,
  type PaginationState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { DataTablePagination } from "./data-table-pagination"
import { DataTableToolbar } from "./data-table-toolbar"
import type { DataTableProps } from "./types"

export function DataTable<TData, TValue = unknown>({
  columns,
  data,
  search,
  filters,
  sorting = false,
  pagination = false,
  emptyMessage = "No results found.",
  toolbarActions,
  onRowClick,
}: DataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = React.useState({})
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [sortingState, setSortingState] = React.useState<SortingState>([])

  const isPaginationEnabled = Boolean(pagination)
  const paginationConfig = typeof pagination === "object" ? pagination : undefined
  const defaultPageSize = paginationConfig?.pageSize ?? 10
  const pageSizeOptions = paginationConfig?.pageSizeOptions ?? [10, 20, 30, 50, 100]

  const [paginationState, setPaginationState] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: defaultPageSize,
  })

  const isSortingEnabled = Boolean(sorting)

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting: isSortingEnabled ? sortingState : undefined,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination: isPaginationEnabled ? paginationState : undefined,
    },
    defaultColumn: {
      filterFn: (row, columnId, filterValue) => {
        if (Array.isArray(filterValue)) {
          if (filterValue.length === 0) return true
          const rowValue = row.getValue(columnId)
          return filterValue.includes(rowValue)
        }
        const rowValue = row.getValue(columnId)
        return String(rowValue ?? "")
          .toLowerCase()
          .includes(String(filterValue ?? "").toLowerCase())
      },
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: isSortingEnabled ? setSortingState : undefined,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: isPaginationEnabled ? setPaginationState : undefined,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: isPaginationEnabled ? getPaginationRowModel() : undefined,
    getSortedRowModel: isSortingEnabled ? getSortedRowModel() : undefined,
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  })

  return (
    <div className="space-y-4">
      <DataTableToolbar
        table={table}
        search={search}
        filters={filters}
      >
        {toolbarActions}
      </DataTableToolbar>
      <div className="rounded-md border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className={onRowClick ? "cursor-pointer" : undefined}
                  onClick={() => onRowClick?.(row.original)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      onClick={
                        cell.column.id === "select" || cell.column.id === "actions"
                          ? (e) => e.stopPropagation()
                          : undefined
                      }
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-sm text-muted-foreground"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {isPaginationEnabled && (
        <DataTablePagination
          table={table}
          pageSizeOptions={pageSizeOptions}
        />
      )}
    </div>
  )
}
