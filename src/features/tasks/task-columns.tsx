"use client"

import type { ColumnDef } from "@tanstack/react-table"
import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  CheckCircle2,
  Circle,
  Clock,
  HelpCircle,
  MoreHorizontal,
  XCircle,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { DataTableColumnHeader } from "@/components/shared/data-table/data-table-column-header"
import type { Task } from "./data/tasks"

export const statusIcons: Record<Task["status"], React.ReactNode> = {
  backlog: <HelpCircle className="size-3.5 text-muted-foreground" />,
  todo: <Circle className="size-3.5 text-muted-foreground" />,
  "in progress": <Clock className="size-3.5 text-amber-500" />,
  done: <CheckCircle2 className="size-3.5 text-emerald-500" />,
  canceled: <XCircle className="size-3.5 text-red-500" />,
}

export const priorityIcons: Record<Task["priority"], React.ReactNode> = {
  low: <ArrowDown className="size-3.5 text-muted-foreground" />,
  medium: <ArrowRight className="size-3.5 text-blue-500" />,
  high: <ArrowUp className="size-3.5 text-red-500" />,
}

interface GetTaskColumnsOptions {
  onDelete?: (id: string) => void
}

export function getTaskColumns({ onDelete }: GetTaskColumnsOptions = {}): ColumnDef<Task>[] {
  return [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          indeterminate={table.getIsSomePageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
          className="translate-y-[2px]"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="translate-y-[2px]"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "id",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Task" />
      ),
      cell: ({ row }) => (
        <span className="w-20 font-mono text-xs font-medium">
          {row.getValue("id")}
        </span>
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "title",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Title" />
      ),
      cell: ({ row }) => {
        const label = row.original.label
        return (
          <div className="flex items-center space-x-2">
            <Badge
              variant="outline"
              className="text-[10px] font-normal capitalize"
            >
              {label}
            </Badge>
            <span className="max-w-[450px] truncate font-medium text-xs sm:text-sm">
              {row.getValue("title")}
            </span>
          </div>
        )
      },
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Status" />
      ),
      cell: ({ row }) => {
        const status = row.original.status
        return (
          <div className="flex items-center gap-1.5 text-xs capitalize text-muted-foreground">
            {statusIcons[status]}
            <span>{status}</span>
          </div>
        )
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id))
      },
    },
    {
      accessorKey: "priority",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Priority" />
      ),
      cell: ({ row }) => {
        const priority = row.original.priority
        return (
          <div className="flex items-center gap-1.5 text-xs capitalize text-muted-foreground">
            {priorityIcons[priority]}
            <span>{priority}</span>
          </div>
        )
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id))
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const task = row.original
        return (
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-8 ml-auto"
                />
              }
            >
              <MoreHorizontal className="size-4" />
              <span className="sr-only">Open menu</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[160px]">
              <DropdownMenuLabel className="text-xs">Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(task.id)}
              >
                Copy Task ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                variant="destructive"
                onClick={() => onDelete?.(task.id)}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]
}
