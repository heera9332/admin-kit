"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { Eye, MoreHorizontal, Trash2, Package, Edit, ExternalLink, Star } from "lucide-react"

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
import type { Product } from "@/data/ecommerce"

export interface GetProductsColumnsOptions {
  onView?: (product: Product) => void
  onEdit?: (product: Product) => void
  onQuickEdit?: (product: Product) => void
  onFullEdit?: (product: Product) => void
  onDelete?: (product: Product) => void
  t?: (key: string) => string
}

export function getProductsColumns({
  onView,
  onEdit,
  onQuickEdit,
  onFullEdit,
  onDelete,
  t = (key) => key,
}: GetProductsColumnsOptions = {}): ColumnDef<Product>[] {
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
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("fields.name")} />
      ),
      cell: ({ row }) => {
        const product = row.original
        return (
          <div className="flex items-center gap-3 max-w-[320px]">
            {product.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={product.image}
                alt={product.name}
                className="size-10 rounded-lg object-cover border shrink-0 bg-muted/20"
              />
            ) : (
              <div className="size-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <Package className="size-5" />
              </div>
            )}
            <div className="space-y-0.5 min-w-0">
              <button
                type="button"
                onClick={() => (onView ? onView(product) : onFullEdit?.(product))}
                className="font-semibold text-xs text-foreground hover:text-primary transition-colors text-left block truncate cursor-pointer"
              >
                {product.name}
              </button>
              <div className="text-[11px] text-muted-foreground font-mono truncate">
                SKU: {product.sku}
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
          {row.original.category}
        </Badge>
      ),
      filterFn: (row, id, value) => value.includes(row.getValue(id)),
    },
    {
      accessorKey: "brand",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("fields.brand")} />
      ),
      cell: ({ row }) => (
        <span className="text-xs text-muted-foreground font-medium">
          {row.original.brand}
        </span>
      ),
    },
    {
      accessorKey: "price",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("fields.price")} />
      ),
      cell: ({ row }) => {
        const product = row.original
        return (
          <div className="flex items-baseline gap-1.5">
            <span className="text-xs font-semibold font-mono">
              ${product.price.toFixed(2)}
            </span>
            {product.compareAtPrice && (
              <span className="text-[10px] text-muted-foreground line-through font-mono">
                ${product.compareAtPrice.toFixed(2)}
              </span>
            )}
          </div>
        )
      },
    },
    {
      accessorKey: "stock",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("fields.stock")} />
      ),
      cell: ({ row }) => {
        const stock = row.original.stock
        const variant =
          stock > 10 ? "success" : stock > 0 ? "warning" : "destructive"
        const label =
          stock > 10
            ? `${stock} in stock`
            : stock > 0
              ? `${stock} low`
              : "Out of stock"
        return (
          <StatusBadge variant={variant} size="sm">
            {label}
          </StatusBadge>
        )
      },
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("fields.status")} />
      ),
      cell: ({ row }) => {
        const status = row.original.status
        const variant =
          status === "published"
            ? "success"
            : status === "draft"
              ? "neutral"
              : status === "out_of_stock"
                ? "destructive"
                : "warning"
        return (
          <StatusBadge variant={variant} size="sm">
            {t(`statuses.${status}`)}
          </StatusBadge>
        )
      },
      filterFn: (row, id, value) => value.includes(row.getValue(id)),
    },
    {
      accessorKey: "rating",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("fields.rating")} />
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-1 text-xs">
          <Star className="size-3 text-amber-500 fill-amber-500" />
          <span className="font-medium">{row.original.rating}</span>
          <span className="text-[10px] text-muted-foreground">
            ({row.original.reviewsCount})
          </span>
        </div>
      ),
    },
    {
      id: "actions",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("fields.actions")} />
      ),
      cell: ({ row }) => {
        const product = row.original
        return (
          <div className="flex justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-8 cursor-pointer text-muted-foreground hover:text-foreground"
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
                {onView && (
                  <DropdownMenuItem
                    onClick={() => onView(product)}
                    className="justify-between gap-2 cursor-pointer"
                  >
                    <span>{t("actions.view")}</span>
                    <Eye className="size-3.5" />
                  </DropdownMenuItem>
                )}
                {(onQuickEdit || onEdit) && (
                  <DropdownMenuItem
                    onClick={() =>
                      onQuickEdit ? onQuickEdit(product) : onEdit?.(product)
                    }
                    className="justify-between gap-2 cursor-pointer"
                  >
                    <span>{t("actions.quickEdit")}</span>
                    <Edit className="size-3.5" />
                  </DropdownMenuItem>
                )}
                {onFullEdit && (
                  <DropdownMenuItem
                    onClick={() => onFullEdit(product)}
                    className="justify-between gap-2 cursor-pointer"
                  >
                    <span>{t("actions.fullEdit")}</span>
                    <ExternalLink className="size-3.5" />
                  </DropdownMenuItem>
                )}
                {onDelete && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => onDelete(product)}
                      className="justify-between gap-2 text-destructive focus:text-destructive cursor-pointer"
                    >
                      <span>{t("actions.delete")}</span>
                      <Trash2 className="size-3.5" />
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )
      },
    },
  ]
}
