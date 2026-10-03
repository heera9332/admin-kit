"use client"

import * as React from "react"
import { useTranslations } from "next-intl"
import type { ColumnDef } from "@tanstack/react-table"
import {
  Tag as TagIcon,
  Plus,
  MoreHorizontal,
  Pencil,
  Trash2,
  Eye,
  LayoutGrid,
  List,
  ExternalLink,
  Package,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { DataTable } from "@/components/shared/data-table"
import { DataTableColumnHeader } from "@/components/shared/data-table/data-table-column-header"
import { useEcommerce } from "@/context/ecommerce-provider"
import type { Brand } from "@/data/ecommerce"
import {
  CreateBrandDialog,
  EditBrandDialog,
  ViewBrandSheet,
} from "./components/brand-dialogs"

export function BrandsFeature() {
  const t = useTranslations("ecommerce.brands")
  const { brands, addBrand, updateBrand, deleteBrand } = useEcommerce()

  const [createOpen, setCreateOpen] = React.useState(false)
  const [viewOpen, setViewOpen] = React.useState(false)
  const [selectedBrand, setSelectedBrand] = React.useState<Brand | null>(null)
  const [editingBrand, setEditingBrand] = React.useState<Brand | null>(null)
  const [viewMode, setViewMode] = React.useState<"table" | "grid">("table")

  const handleView = React.useCallback((brand: Brand) => {
    setSelectedBrand(brand)
    setViewOpen(true)
  }, [])

  const handleEdit = React.useCallback((brand: Brand) => {
    setEditingBrand(brand)
  }, [])

  const columns = React.useMemo<ColumnDef<Brand>[]>(
    () => [
      {
        accessorKey: "name",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t("fields.name")} />
        ),
        cell: ({ row }) => {
          const brand = row.original
          return (
            <div className="flex items-center gap-3 max-w-[280px]">
              {brand.logo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={brand.logo}
                  alt={brand.name}
                  className="size-8 rounded-lg object-contain p-1 border shrink-0 bg-muted/20"
                />
              ) : (
                <div className="size-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <TagIcon className="size-4" />
                </div>
              )}
              <div className="space-y-0.5 min-w-0">
                <button
                  type="button"
                  onClick={() => handleView(brand)}
                  className="font-semibold text-xs text-foreground hover:text-primary transition-colors text-left block truncate cursor-pointer"
                >
                  {brand.name}
                </button>
                <div className="text-[11px] text-muted-foreground font-mono truncate">
                  #{brand.slug}
                </div>
              </div>
            </div>
          )
        },
      },
      {
        accessorKey: "website",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t("fields.website")} />
        ),
        cell: ({ row }) => {
          const site = row.original.website
          if (!site) return <span className="text-xs text-muted-foreground">—</span>
          return (
            <a
              href={site}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-primary hover:underline font-mono"
            >
              <span>{site.replace(/^https?:\/\//, "")}</span>
              <ExternalLink className="size-3" />
            </a>
          )
        },
      },
      {
        accessorKey: "productCount",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t("fields.productCount")} />
        ),
        cell: ({ row }) => (
          <Badge variant="secondary" className="text-xs font-mono">
            {row.original.productCount} products
          </Badge>
        ),
      },
      {
        accessorKey: "featured",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t("fields.featured")} />
        ),
        cell: ({ row }) =>
          row.original.featured ? (
            <Badge variant="default" className="text-[11px]">
              Featured
            </Badge>
          ) : (
            <span className="text-xs text-muted-foreground">Standard</span>
          ),
      },
      {
        id: "actions",
        header: () => <span className="sr-only">{t("fields.actions")}</span>,
        cell: ({ row }) => {
          const brand = row.original
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
                    onClick={() => handleView(brand)}
                    className="gap-2 cursor-pointer text-xs"
                  >
                    <Eye className="size-3.5" />
                    <span>View</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleEdit(brand)}
                    className="gap-2 cursor-pointer text-xs"
                  >
                    <Pencil className="size-3.5" />
                    <span>Edit</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      if (confirm(t("dialog.deleteConfirm"))) {
                        deleteBrand(brand.id)
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
    [t, handleView, handleEdit, deleteBrand]
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
          <div className="flex items-center rounded-lg border bg-muted/40">
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
            <span>{t("newBrand")}</span>
          </Button>
        </div>
      </div>

      {/* Main Content */}
      {viewMode === "table" ? (
        <DataTable
          columns={columns}
          data={brands}
          search={{
            placeholder: t("searchPlaceholder"),
            column: "name",
          }}
          pagination={{ pageSize: 10 }}
          sorting
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {brands.map((brand) => (
            <Card
              key={brand.id}
              className="group hover:border-primary/50 transition-all hover:shadow-xs flex flex-col justify-between"
            >
              <div className="space-y-3 p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    {brand.logo ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={brand.logo}
                        alt={brand.name}
                        className="size-10 rounded-lg object-contain p-1 border bg-muted/20"
                      />
                    ) : (
                      <div className="size-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                        <TagIcon className="size-5" />
                      </div>
                    )}
                    <div>
                      <h3 className="font-semibold text-sm text-foreground">
                        {brand.name}
                      </h3>
                      <p className="text-[11px] text-muted-foreground font-mono">
                        #{brand.slug}
                      </p>
                    </div>
                  </div>

                  {brand.featured && (
                    <Badge variant="default" className="text-[10px]">
                      Featured
                    </Badge>
                  )}
                </div>

                <p className="text-xs text-muted-foreground line-clamp-2">
                  {brand.description || "No description provided."}
                </p>

                {brand.website && (
                  <a
                    href={brand.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] text-primary hover:underline font-mono"
                  >
                    <span>{brand.website.replace(/^https?:\/\//, "")}</span>
                    <ExternalLink className="size-3" />
                  </a>
                )}
              </div>

              <CardFooter className="p-4 pt-0 border-t mt-auto flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-mono">
                  <Package className="size-3.5" />
                  <span>{brand.productCount} items</span>
                </div>

                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-7 cursor-pointer text-muted-foreground hover:text-foreground"
                    onClick={() => handleView(brand)}
                  >
                    <Eye className="size-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-7 cursor-pointer text-muted-foreground hover:text-foreground"
                    onClick={() => handleEdit(brand)}
                  >
                    <Pencil className="size-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-7 cursor-pointer text-muted-foreground hover:text-destructive"
                    onClick={() => {
                      if (confirm(t("dialog.deleteConfirm"))) {
                        deleteBrand(brand.id)
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
      <CreateBrandDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onCreate={addBrand}
      />

      <EditBrandDialog
        brand={editingBrand}
        open={Boolean(editingBrand)}
        onOpenChange={(open) => !open && setEditingBrand(null)}
        onUpdate={updateBrand}
      />

      <ViewBrandSheet
        brand={selectedBrand}
        open={viewOpen}
        onOpenChange={setViewOpen}
        onEdit={(b) => setEditingBrand(b)}
        onDelete={deleteBrand}
      />
    </div>
  )
}
