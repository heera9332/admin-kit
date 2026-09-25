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
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { DataTable } from "@/components/shared/data-table"
import { DataTableColumnHeader } from "@/components/shared/data-table/data-table-column-header"
import { initialCategories, type Category } from "./data/cms-data"
import { CreateCategoryDialog, ViewCategorySheet } from "./components/category-dialogs"

export function CategoriesFeature() {
  const t = useTranslations("cms.categories")
  const [categories, setCategories] = React.useState<Category[]>(initialCategories)
  const [createOpen, setCreateOpen] = React.useState(false)
  const [viewOpen, setViewOpen] = React.useState(false)
  const [selectedCategory, setSelectedCategory] = React.useState<Category | null>(null)
  const [viewMode, setViewMode] = React.useState<"table" | "grid">("table")

  const handleCreate = (newCategory: Category) => {
    setCategories((prev) => [newCategory, ...prev])
  }

  const handleView = React.useCallback((category: Category) => {
    setSelectedCategory(category)
    setViewOpen(true)
  }, [])

  const handleDelete = React.useCallback((id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id))
    setSelectedCategory((prev) => (prev?.id === id ? null : prev))
  }, [])

  const columns = React.useMemo<ColumnDef<Category>[]>(
    () => [
      {
        accessorKey: "name",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t("fields.name")} />
        ),
        cell: ({ row }) => {
          const category = row.original
          return (
            <div className="flex items-center gap-2.5 max-w-[280px]">
              <div className="size-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <FolderTree className="size-4" />
              </div>
              <div className="space-y-0.5 min-w-0">
                <div className="font-semibold text-xs truncate">{category.name}</div>
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
          <span className="text-xs text-muted-foreground line-clamp-1 max-w-[360px]">
            {row.getValue("description") || "—"}
          </span>
        ),
      },
      {
        accessorKey: "postCount",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t("fields.postCount")} />
        ),
        cell: ({ row }) => (
          <Badge variant="secondary" className="text-[11px] font-mono">
            {row.getValue("postCount")} posts
          </Badge>
        ),
      },
      {
        id: "actions",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t("fields.actions")} />
        ),
        cell: ({ row }) => {
          const category = row.original
          return (
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-7 text-muted-foreground ml-auto"
                    onClick={(e) => e.stopPropagation()}
                  />
                }
              >
                <MoreHorizontal className="size-3.5" />
                <span className="sr-only">Actions</span>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="text-xs w-32">
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation()
                    handleView(category)
                  }}
                  className="justify-between gap-2 cursor-pointer"
                >
                  <span>{t("actions.view")}</span>
                  <Eye className="size-3.5" />
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation()
                    alert(`Edit ${category.name}`)
                  }}
                  className="justify-between gap-2 cursor-pointer"
                >
                  <span>{t("actions.edit")}</span>
                  <Pencil className="size-3.5" />
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDelete(category.id)
                  }}
                  className="justify-between gap-2 text-destructive focus:text-destructive cursor-pointer"
                >
                  <span>{t("actions.delete")}</span>
                  <Trash2 className="size-3.5" />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )
        },
      },
    ],
    [handleView, handleDelete, t]
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            {t("title")}
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            {t("description")}
          </p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="flex items-center border rounded-md p-0.5 bg-muted/40">
            <Button
              variant={viewMode === "table" ? "secondary" : "ghost"}
              size="icon"
              className="size-7 cursor-pointer"
              onClick={() => setViewMode("table")}
              title="Table view"
            >
              <List className="size-3.5" />
            </Button>
            <Button
              variant={viewMode === "grid" ? "secondary" : "ghost"}
              size="icon"
              className="size-7 cursor-pointer"
              onClick={() => setViewMode("grid")}
              title="Grid view"
            >
              <LayoutGrid className="size-3.5" />
            </Button>
          </div>
          <Button
            onClick={() => setCreateOpen(true)}
            size="sm"
            className="gap-1.5 text-xs h-8 cursor-pointer"
          >
            <Plus className="size-3.5" />
            <span>{t("newCategory")}</span>
          </Button>
        </div>
      </div>

      {viewMode === "table" ? (
        <DataTable
          data={categories}
          columns={columns}
          sorting
          pagination={{
            pageSize: 8,
            pageSizeOptions: [8, 16, 24, 48],
          }}
          onRowClick={handleView}
          search={{
            column: "name",
            placeholder: t("searchPlaceholder"),
          }}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => (
            <Card
              key={category.id}
              className="flex flex-col justify-between cursor-pointer hover:border-primary/50 hover:shadow-xs transition-all select-none"
              onClick={() => handleView(category)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <FolderTree className="size-4.5" />
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      render={
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-7 text-muted-foreground"
                          onClick={(e) => e.stopPropagation()}
                        />
                      }
                    >
                      <MoreHorizontal className="size-3.5" />
                      <span className="sr-only">Actions</span>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="text-xs w-32">
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation()
                          handleView(category)
                        }}
                        className="justify-between gap-2 cursor-pointer"
                      >
                        <span>{t("actions.view")}</span>
                        <Eye className="size-3.5" />
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation()
                          alert(`Edit ${category.name}`)
                        }}
                        className="justify-between gap-2 cursor-pointer"
                      >
                        <span>{t("actions.edit")}</span>
                        <Pencil className="size-3.5" />
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDelete(category.id)
                        }}
                        className="justify-between gap-2 text-destructive focus:text-destructive cursor-pointer"
                      >
                        <span>{t("actions.delete")}</span>
                        <Trash2 className="size-3.5" />
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <CardTitle className="text-sm font-semibold mt-2">
                  {category.name}
                </CardTitle>
                <CardDescription className="text-xs line-clamp-2">
                  {category.description}
                </CardDescription>
              </CardHeader>
              <CardFooter className="pt-2 border-t flex items-center justify-between text-xs text-muted-foreground">
                <span className="font-mono text-[11px]">/{category.slug}</span>
                <Badge variant="secondary" className="text-[10px] font-mono">
                  {category.postCount} posts
                </Badge>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {categories.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center border rounded-lg border-dashed">
          <FolderTree className="size-8 text-muted-foreground/60 mb-2" />
          <h3 className="text-sm font-semibold">{t("empty")}</h3>
          <p className="text-xs text-muted-foreground mt-1">{t("emptyDesc")}</p>
        </div>
      )}

      <CreateCategoryDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onCreate={handleCreate}
      />

      <ViewCategorySheet
        category={selectedCategory}
        open={viewOpen}
        onOpenChange={setViewOpen}
        onDelete={handleDelete}
      />
    </div>
  )
}
