"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { Copy, Eye, MoreHorizontal, Trash2, Download, ExternalLink } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { DataTableColumnHeader } from "@/components/shared/data-table/data-table-column-header"
import { FileTypeIcon } from "@/components/media/file-type-icon"
import type { MediaItem } from "@/data/media"
import { formatBytes } from "@/lib/media-utils"

interface GetMediaColumnsOptions {
  onView?: (item: MediaItem) => void
  onDelete?: (id: string) => void
  t?: (key: string) => string
}

export function getMediaColumns({
  onView,
  onDelete,
  t = (key) => key,
}: GetMediaColumnsOptions = {}): ColumnDef<MediaItem>[] {
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
          onClick={(e) => e.stopPropagation()}
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("fields.name")} />
      ),
      cell: ({ row }) => {
        const item = row.original
        return (
          <div className="flex items-center gap-3 max-w-[280px]">
            <div className="size-9 rounded-lg overflow-hidden border bg-muted/20 shrink-0 flex items-center justify-center">
              {item.type === "image" ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={item.thumbnailUrl || item.url}
                  alt={item.name}
                  className="size-full object-cover"
                />
              ) : (
                <FileTypeIcon
                  type={item.type}
                  extension={item.extension}
                  className="size-full"
                  iconClassName="size-4.5"
                />
              )}
            </div>
            <div className="space-y-0.5 min-w-0">
              <span className="font-semibold text-xs text-foreground block truncate">
                {item.title || item.name}
              </span>
              <span className="text-[11px] text-muted-foreground font-mono block truncate">
                {item.name}
              </span>
            </div>
          </div>
        )
      },
    },
    {
      accessorKey: "type",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("fields.type")} />
      ),
      cell: ({ row }) => {
        const item = row.original
        return (
          <Badge variant="outline" className="text-[11px] font-mono capitalize">
            {item.extension.toUpperCase()}
          </Badge>
        )
      },
      filterFn: (row, id, value) => value.includes(row.getValue(id)),
    },
    {
      accessorKey: "size",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("fields.size")} />
      ),
      cell: ({ row }) => (
        <span className="text-xs text-muted-foreground font-mono">
          {formatBytes(row.getValue<number>("size"))}
        </span>
      ),
    },
    {
      accessorKey: "uploadedAt",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("fields.uploadedAt")} />
      ),
      cell: ({ row }) => (
        <span className="text-xs text-muted-foreground font-mono">
          {row.getValue("uploadedAt")}
        </span>
      ),
    },
    {
      accessorKey: "author",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("fields.author")} />
      ),
      cell: ({ row }) => (
        <span className="text-xs font-medium text-foreground truncate block max-w-[120px]">
          {row.getValue("author")}
        </span>
      ),
    },
    {
      id: "actions",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("fields.actions")} />
      ),
      cell: ({ row }) => {
        const item = row.original
        return (
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-8 ml-auto"
                  onClick={(e) => e.stopPropagation()}
                />
              }
            >
              <MoreHorizontal className="size-4" />
              <span className="sr-only">Open menu</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="text-xs w-40">
              <DropdownMenuLabel className="text-xs font-semibold">
                {t("fields.actions")}
              </DropdownMenuLabel>
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation()
                  onView?.(item)
                }}
                className="cursor-pointer"
              >
                <Eye className="size-3.5 mr-2" />
                <span>{t("details.sheetTitle")}</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={async (e) => {
                  e.stopPropagation()
                  await navigator.clipboard.writeText(item.url)
                }}
                className="cursor-pointer"
              >
                <Copy className="size-3.5 mr-2" />
                <span>{t("details.copyUrl")}</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation()
                  window.open(item.url, "_blank")
                }}
                className="cursor-pointer"
              >
                <ExternalLink className="size-3.5 mr-2" />
                <span>Open in Tab</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation()
                  onDelete?.(item.id)
                }}
                className="text-destructive focus:text-destructive cursor-pointer"
              >
                <Trash2 className="size-3.5 mr-2" />
                <span>{t("details.delete")}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]
}
