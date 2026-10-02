"use client"

import * as React from "react"
import { useTranslations } from "next-intl"
import type { ColumnDef } from "@tanstack/react-table"
import {
  Package,
  Plus,
  MoreHorizontal,
  Pencil,
  Trash2,
  Eye,
  Star,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { StatusBadge } from "@/components/status-badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { DataTable } from "@/components/shared/data-table"
import { DataTableColumnHeader } from "@/components/shared/data-table/data-table-column-header"
import { useEcommerce } from "@/context/ecommerce-provider"
import type { Product } from "@/data/ecommerce"
import {
  CreateProductDialog,
  EditProductDialog,
  ViewProductSheet,
} from "./components/product-dialogs"

export function ProductsFeature() {
  const t = useTranslations("ecommerce.products")
  const { products, categories, brands, addProduct, updateProduct, deleteProduct } =
    useEcommerce()

  const [createOpen, setCreateOpen] = React.useState(false)
  const [viewOpen, setViewOpen] = React.useState(false)
  const [selectedProduct, setSelectedProduct] = React.useState<Product | null>(null)
  const [editingProduct, setEditingProduct] = React.useState<Product | null>(null)

  const handleView = React.useCallback((product: Product) => {
    setSelectedProduct(product)
    setViewOpen(true)
  }, [])

  const handleEdit = React.useCallback((product: Product) => {
    setEditingProduct(product)
  }, [])

  const columns = React.useMemo<ColumnDef<Product>[]>(
    () => [
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
                  onClick={() => handleView(product)}
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
        filterFn: (row, id, value) => {
          return value.includes(row.getValue(id))
        },
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
        filterFn: (row, id, value) => {
          return value.includes(row.getValue(id))
        },
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
        header: () => <span className="sr-only">{t("fields.actions")}</span>,
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
                  <span className="sr-only">Actions</span>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-36">
                  <DropdownMenuItem
                    onClick={() => handleView(product)}
                    className="gap-2 cursor-pointer text-xs"
                  >
                    <Eye className="size-3.5" />
                    <span>View Details</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleEdit(product)}
                    className="gap-2 cursor-pointer text-xs"
                  >
                    <Pencil className="size-3.5" />
                    <span>Edit</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      if (confirm(t("dialog.deleteConfirm"))) {
                        deleteProduct(product.id)
                      }
                    }}
                    className="gap-2 text-destructive focus:text-destructive cursor-pointer text-xs"
                  >
                    <Trash2 className="size-3.5" />
                    <span>Delete</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )
        },
      },
    ],
    [t, handleView, handleEdit, deleteProduct]
  )

  const categoryOptions = React.useMemo(
    () =>
      categories.map((c) => ({
        label: c.name,
        value: c.name,
      })),
    [categories]
  )

  const statusOptions = React.useMemo(
    () => [
      { label: t("statuses.published"), value: "published" },
      { label: t("statuses.draft"), value: "draft" },
      { label: t("statuses.out_of_stock"), value: "out_of_stock" },
      { label: t("statuses.archived"), value: "archived" },
    ],
    [t]
  )

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
            {t("title")}
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            {t("description")}
          </p>
        </div>

        <Button
          onClick={() => setCreateOpen(true)}
          size="sm"
          className="cursor-pointer gap-1.5 self-start sm:self-auto"
        >
          <Plus className="size-4" />
          <span>{t("newProduct")}</span>
        </Button>
      </div>

      {/* Reusable DataTable */}
      <DataTable
        columns={columns}
        data={products}
        search={{
          placeholder: t("searchPlaceholder"),
          column: "name",
        }}
        filters={[
          {
            column: "category",
            title: "Category",
            options: categoryOptions,
          },
          {
            column: "status",
            title: "Status",
            options: statusOptions,
          },
        ]}
        pagination={{ pageSize: 10 }}
        sorting
      />

      {/* Modals & Sheets */}
      <CreateProductDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        categories={categories}
        brands={brands}
        onCreate={addProduct}
      />

      <EditProductDialog
        product={editingProduct}
        open={Boolean(editingProduct)}
        onOpenChange={(open) => !open && setEditingProduct(null)}
        categories={categories}
        brands={brands}
        onUpdate={updateProduct}
      />

      <ViewProductSheet
        product={selectedProduct}
        open={viewOpen}
        onOpenChange={setViewOpen}
        onEdit={(p) => setEditingProduct(p)}
        onDelete={deleteProduct}
      />
    </div>
  )
}
