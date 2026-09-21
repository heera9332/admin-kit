"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { Copy, Eye, MoreHorizontal, Pencil, Trash2, FileText } from "lucide-react"

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
import { StatusBadge } from "@/components/status-badge"
import { DataTableColumnHeader } from "@/components/shared/data-table/data-table-column-header"
import type { Post } from "./data/cms-data"

interface GetPostsColumnsOptions {
  onView?: (post: Post) => void
  onEdit?: (post: Post) => void
  onDelete?: (post: Post) => void
  t?: (key: string) => string
}

export function getPostsColumns({
  onView,
  onEdit,
  onDelete,
  t = (key) => key,
}: GetPostsColumnsOptions = {}): ColumnDef<Post>[] {
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
      accessorKey: "title",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("fields.title")} />
      ),
      cell: ({ row }) => {
        const post = row.original
        return (
          <div className="flex items-start gap-2.5 max-w-[320px]">
            <div className="size-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
              <FileText className="size-4" />
            </div>
            <div className="space-y-0.5 min-w-0">
              <div className="font-semibold text-xs truncate">{post.title}</div>
              <div className="text-[11px] text-muted-foreground font-mono truncate">
                /{post.slug}
              </div>
            </div>
          </div>
        )
      },
    },
    {
      accessorKey: "category",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("fields.category")} />
      ),
      cell: ({ row }) => (
        <Badge variant="outline" className="text-xs font-normal">
          {row.getValue("category")}
        </Badge>
      ),
      filterFn: (row, id, value) => value.includes(row.getValue(id)),
    },
    {
      accessorKey: "author",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("fields.author")} />
      ),
      cell: ({ row }) => (
        <span className="text-xs text-foreground font-medium">
          {row.getValue("author")}
        </span>
      ),
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("fields.status")} />
      ),
      cell: ({ row }) => {
        const status = row.getValue<Post["status"]>("status")
        return (
          <StatusBadge status={status} size="sm" dot>
            {t(`statuses.${status}`)}
          </StatusBadge>
        )
      },
      filterFn: (row, id, value) => value.includes(row.getValue(id)),
    },
    {
      accessorKey: "publishedAt",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("fields.publishedAt")} />
      ),
      cell: ({ row }) => (
        <span className="text-xs text-muted-foreground font-mono">
          {row.getValue("publishedAt")}
        </span>
      ),
    },
    {
      id: "actions",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("fields.actions")} />
      ),
      cell: ({ row }) => {
        const post = row.original
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
            <DropdownMenuContent align="end" className="text-xs w-36">
              <DropdownMenuLabel className="text-xs font-semibold">
                {t("fields.actions")}
              </DropdownMenuLabel>
              {onView && (
                <DropdownMenuItem
                  onClick={() => onView(post)}
                  className="justify-between gap-2 cursor-pointer"
                >
                  <span>{t("actions.view")}</span>
                  <Eye className="size-3.5" />
                </DropdownMenuItem>
              )}
              {onEdit && (
                <DropdownMenuItem
                  onClick={() => onEdit(post)}
                  className="justify-between gap-2 cursor-pointer"
                >
                  <span>{t("actions.edit")}</span>
                  <Pencil className="size-3.5" />
                </DropdownMenuItem>
              )}
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(post.id)}
                className="justify-between gap-2 cursor-pointer"
              >
                <span>{t("actions.copyId")}</span>
                <Copy className="size-3.5" />
              </DropdownMenuItem>
              {onDelete && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => onDelete(post)}
                    className="justify-between gap-2 text-destructive focus:text-destructive cursor-pointer"
                  >
                    <span>{t("actions.delete")}</span>
                    <Trash2 className="size-3.5" />
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]
}
