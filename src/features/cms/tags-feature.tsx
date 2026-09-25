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
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
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
import { initialTags, type Tag } from "./data/cms-data"
import { CreateTagDialog, ViewTagSheet } from "./components/tag-dialogs"

export function TagsFeature() {
  const t = useTranslations("cms.tags")
  const [tags, setTags] = React.useState<Tag[]>(initialTags)
  const [createOpen, setCreateOpen] = React.useState(false)
  const [viewOpen, setViewOpen] = React.useState(false)
  const [selectedTag, setSelectedTag] = React.useState<Tag | null>(null)
  const [viewMode, setViewMode] = React.useState<"table" | "grid">("table")

  const handleCreate = (newTag: Tag) => {
    setTags((prev) => [newTag, ...prev])
  }

  const handleView = React.useCallback((tag: Tag) => {
    setSelectedTag(tag)
    setViewOpen(true)
  }, [])

  const handleDelete = React.useCallback((id: string) => {
    setTags((prev) => prev.filter((tag) => tag.id !== id))
    setSelectedTag((prev) => (prev?.id === id ? null : prev))
  }, [])

  const columns = React.useMemo<ColumnDef<Tag>[]>(
    () => [
      {
        accessorKey: "name",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t("fields.name")} />
        ),
        cell: ({ row }) => {
          const tag = row.original
          return (
            <div className="flex items-center gap-2.5 max-w-[280px]">
              <div className="size-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <TagIcon className="size-4" />
              </div>
              <div className="space-y-0.5 min-w-0">
                <div className="font-semibold text-xs truncate">{tag.name}</div>
                <div className="text-[11px] text-muted-foreground font-mono truncate">
                  #{tag.slug}
                </div>
              </div>
            </div>
          )
        },
      },
      {
        accessorKey: "count",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t("fields.count")} />
        ),
        cell: ({ row }) => (
          <Badge variant="secondary" className="text-[11px] font-mono">
            {row.getValue("count")} {t("fields.count").toLowerCase()}
          </Badge>
        ),
      },
      {
        id: "actions",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t("fields.actions")} />
        ),
        cell: ({ row }) => {
          const tag = row.original
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
                    handleView(tag)
                  }}
                  className="justify-between gap-2 cursor-pointer"
                >
                  <span>{t("actions.view")}</span>
                  <Eye className="size-3.5" />
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation()
                    alert(`Edit ${tag.name}`)
                  }}
                  className="justify-between gap-2 cursor-pointer"
                >
                  <span>{t("actions.edit")}</span>
                  <Pencil className="size-3.5" />
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDelete(tag.id)
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
            <span>{t("newTag")}</span>
          </Button>
        </div>
      </div>

      {viewMode === "table" ? (
        <DataTable
          data={tags}
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
        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {tags.map((tag) => (
            <Card
              key={tag.id}
              className="flex flex-col justify-between cursor-pointer hover:border-primary/50 hover:shadow-xs transition-all select-none"
              onClick={() => handleView(tag)}
            >
              <CardHeader className="p-3.5 pb-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="flex size-7 items-center justify-center rounded-md bg-primary/10 text-primary shrink-0">
                      <TagIcon className="size-3.5" />
                    </div>
                    <div className="min-w-0">
                      <CardTitle className="text-xs font-semibold truncate">
                        {tag.name}
                      </CardTitle>
                      <span className="font-mono text-[10px] text-muted-foreground block truncate">
                        #{tag.slug}
                      </span>
                    </div>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger
                      render={
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-6 text-muted-foreground shrink-0"
                          onClick={(e) => e.stopPropagation()}
                        />
                      }
                    >
                      <MoreHorizontal className="size-3" />
                      <span className="sr-only">Actions</span>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="text-xs w-28">
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation()
                          handleView(tag)
                        }}
                        className="justify-between gap-2 cursor-pointer"
                      >
                        <span>{t("actions.view")}</span>
                        <Eye className="size-3" />
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation()
                          alert(`Edit ${tag.name}`)
                        }}
                        className="justify-between gap-2 cursor-pointer"
                      >
                        <span>{t("actions.edit")}</span>
                        <Pencil className="size-3" />
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDelete(tag.id)
                        }}
                        className="justify-between gap-2 text-destructive focus:text-destructive cursor-pointer"
                      >
                        <span>{t("actions.delete")}</span>
                        <Trash2 className="size-3" />
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardFooter className="p-3.5 pt-2 border-t flex items-center justify-between text-[11px] text-muted-foreground">
                <span>{t("fields.count")}</span>
                <Badge variant="secondary" className="text-[10px] font-mono px-1.5 py-0">
                  {tag.count}
                </Badge>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {tags.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center border rounded-lg border-dashed">
          <TagIcon className="size-8 text-muted-foreground/60 mb-2" />
          <h3 className="text-sm font-semibold">{t("empty")}</h3>
          <p className="text-xs text-muted-foreground mt-1">{t("emptyDesc")}</p>
        </div>
      )}

      <CreateTagDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onCreate={handleCreate}
      />

      <ViewTagSheet
        tag={selectedTag}
        open={viewOpen}
        onOpenChange={setViewOpen}
        onDelete={handleDelete}
      />
    </div>
  )
}
