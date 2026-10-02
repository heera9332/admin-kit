"use client"

import * as React from "react"
import { useTranslations } from "next-intl"
import type { ColumnDef } from "@tanstack/react-table"
import {
  FolderTree,
  Plus,
  MoreHorizontal,
  Pencil,
  Trash2,
  Eye,
  LayoutGrid,
  List,
  Package,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardFooter } from "@/components/ui/card"
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
import type { ProductCategory } from "@/data/ecommerce"
import {
  CreateCategoryDialog,
  EditCategoryDialog,
  ViewCategorySheet,
} from "./components/category-dialogs"

export function CategoriesFeature() {
  const t = useTranslations("ecommerce.categories")
  const { categories, addCategory, updateCategory, deleteCategory } = useEcommerce()

  const [createOpen, setCreateOpen] = React.useState(false)
  const [viewOpen, setViewOpen] = React.useState(false)
  const [selectedCategory, setSelectedCategory] = React.useState<ProductCategory | null>(null)
  const [editingCategory, setEditingCategory] = React.useState<ProductCategory | null>(null)
  const [viewMode, setViewMode] = React.useState<"table" | "grid">("table")

  const handleView = React.useCallback((category: ProductCategory) => {
    setSelectedCategory(category)
    setViewOpen(true)
  }, [])

  const handleEdit = React.useCallback((category: ProductCategory) => {
    setEditingCategory(category)
  }, [])

  const columns = React.useMemo<ColumnDef<ProductCategory>[]>(
    () => [
      {
        accessorKey: "name",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t("fields.name")} />
        ),
        cell: ({ row }) => {
          const category = row.original
          return (
            <div className="flex items-center gap-3 max-w-[280px]">
              {category.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={category.image}
                  alt={category.name}
                  className="size-9 rounded-lg object-cover border shrink-0 bg-muted/20"
                />
              ) : (
                <div className="size-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <FolderTree className="size-4.5" />
                </div>
              )}
              <div className="space-y-0.5 min-w-0">
                <button
                  type="button"
                  onClick={() => handleView(category)}
                  className="font-semibold text-xs text-foreground hover:text-primary transition-colors text-left block truncate cursor-pointer"
                >
                  {category.name}
                </button>
                <div className="text-[11px] text-muted-foreground font-mono truncate">
                  /{category.slug}
                </div>
              </div>
            </div>
          )
        },
      },
      {
        accessorKey: "description",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t("fields.description")} />
        ),
        cell: ({ row }) => (
          <span className="text-xs text-muted-foreground line-clamp-1 max-w-[320px]">
            {row.original.description || "—"}
          </span>
        ),
      },
      {
        accessorKey: "productCount",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t("fields.productCount")} />
        ),
        cell: ({ row }) => (
          <Badge variant="secondary" className="text-xs font-mono">
            {row.original.productCount} items
          </Badge>
        ),
      },
      {
        accessorKey: "status",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t("fields.status")} />
        ),
        cell: ({ row }) => {
          const status = row.original.status
          return (
            <StatusBadge variant={status === "active" ? "success" : "neutral"} size="sm">
              {t(`statuses.${status}`)}
            </StatusBadge>
          )
        },
      },
      {
        id: "actions",
        header: () => <span className="sr-only">{t("fields.actions")}</span>,
        cell: ({ row }) => {
          const category = row.original
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
                    onClick={() => handleView(category)}
                    className="gap-2 cursor-pointer text-xs"
                  >
                    <Eye className="size-3.5" />
                    <span>View</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleEdit(category)}
                    className="gap-2 cursor-pointer text-xs"
                  >
                    <Pencil className="size-3.5" />
                    <span>Edit</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      if (confirm(t("dialog.deleteConfirm"))) {
                        deleteCategory(category.id)
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
    [t, handleView, handleEdit, deleteCategory]
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

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {/* View Mode Toggle */}
          <div className="flex items-center rounded-lg border bg-muted/40 p-0.5">
            <Button
              type="button"
              variant={viewMode === "table" ? "secondary" : "ghost"}
              size="icon"
              className="size-7 cursor-pointer"
              onClick={() => setViewMode("table")}
              title="Table View"
            >
              <List className="size-3.5" />
            </Button>
            <Button
              type="button"
              variant={viewMode === "grid" ? "secondary" : "ghost"}
              size="icon"
              className="size-7 cursor-pointer"
              onClick={() => setViewMode("grid")}
              title="Grid View"
            >
              <LayoutGrid className="size-3.5" />
            </Button>
          </div>

          <Button
            onClick={() => setCreateOpen(true)}
            size="sm"
            className="cursor-pointer gap-1.5"
          >
            <Plus className="size-4" />
            <span>{t("newCategory")}</span>
          </Button>
        </div>
      </div>

      {/* Main Content */}
      {viewMode === "table" ? (
        <DataTable
          columns={columns}
          data={categories}
          search={{
            placeholder: t("searchPlaceholder"),
            column: "name",
          }}
          pagination={{ pageSize: 10 }}
          sorting
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.map((category) => (
            <Card
              key={category.id}
              className="overflow-hidden group hover:border-primary/50 transition-all hover:shadow-xs flex flex-col justify-between"
            >
              <div className="space-y-3 p-4">
                <div className="relative aspect-video w-full overflow-hidden rounded-lg border bg-muted/20">
                  {category.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={category.image}
                      alt={category.name}
                      className="size-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="size-full flex items-center justify-center text-primary/40">
                      <FolderTree className="size-10" />
                    </div>
                  )}
                  <div className="absolute top-2 right-2">
                    <StatusBadge
                      variant={category.status === "active" ? "success" : "neutral"}
                      size="sm"
                      appearance="solid"
                    >
                      {t(`statuses.${category.status}`)}
                    </StatusBadge>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-sm text-foreground truncate">
                    {category.name}
                  </h3>
                  <p className="text-[11px] text-muted-foreground font-mono">
                    /{category.slug}
                  </p>
                </div>

                <p className="text-xs text-muted-foreground line-clamp-2">
                  {category.description || "No description provided."}
                </p>
              </div>

              <CardFooter className="p-4 pt-0 border-t mt-auto flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-mono">
                  <Package className="size-3.5" />
                  <span>{category.productCount} items</span>
                </div>

                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-7 cursor-pointer text-muted-foreground hover:text-foreground"
                    onClick={() => handleView(category)}
                  >
                    <Eye className="size-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-7 cursor-pointer text-muted-foreground hover:text-foreground"
                    onClick={() => handleEdit(category)}
                  >
                    <Pencil className="size-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-7 cursor-pointer text-muted-foreground hover:text-destructive"
                    onClick={() => {
                      if (confirm(t("dialog.deleteConfirm"))) {
                        deleteCategory(category.id)
                      }
                    }}
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Dialogs */}
      <CreateCategoryDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onCreate={addCategory}
      />

      <EditCategoryDialog
        category={editingCategory}
        open={Boolean(editingCategory)}
        onOpenChange={(open) => !open && setEditingCategory(null)}
        onUpdate={updateCategory}
      />

      <ViewCategorySheet
        category={selectedCategory}
        open={viewOpen}
        onOpenChange={setViewOpen}
        onEdit={(c) => setEditingCategory(c)}
        onDelete={deleteCategory}
      />
    </div>
  )
}
