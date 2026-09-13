import type { ColumnDef } from "@tanstack/react-table"
import type * as React from "react"

export interface DataTableFilterOption {
  label: string
  value: string
  icon?: React.ComponentType<{ className?: string }>
}

export interface DataTableFilter {
  column: string
  title: string
  options: DataTableFilterOption[]
}

export interface DataTableSearchConfig {
  column: string
  placeholder?: string
}

export interface DataTablePaginationConfig {
  pageSize?: number
  pageSizeOptions?: number[]
}

export interface DataTableProps<TData, TValue = unknown> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  search?: DataTableSearchConfig
  filters?: DataTableFilter[]
  sorting?: boolean
  pagination?: boolean | DataTablePaginationConfig
  emptyMessage?: string
  toolbarActions?: React.ReactNode
  onRowClick?: (row: TData) => void
}
