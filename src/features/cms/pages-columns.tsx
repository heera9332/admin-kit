"use client"

import * as React from "react"
import type { ColumnDef } from "@tanstack/react-table"
import {
  Eye,
  MoreHorizontal,
  Trash2,
  FileCode,
  Edit,
  CornerDownRight,
  Copy,
  Layers,
  Layout,
  LayoutTemplate,
  Contact,
  Sidebar as SidebarIcon,
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
import { StatusBadge } from "@/components/status-badge"
import { DataTableColumnHeader } from "@/components/shared/data-table/data-table-column-header"
import type { CmsPage, PageTemplate } from "@/data/cms"

interface GetPagesColumnsOptions {
  pages?: CmsPage[]
  onView?: (page: CmsPage) => void
  onEdit?: (page: CmsPage) => void
  onQuickEdit?: (page: CmsPage) => void
  onFullEdit?: (page: CmsPage) => void
  onDelete?: (page: CmsPage) => void
  onDuplicate?: (page: CmsPage) => void
  t?: (key: string) => string
}

function getTemplateBadge(template: PageTemplate) {
  switch (template) {
    case "landing":
      return { label: "Landing Page", icon: LayoutTemplate, variant: "secondary" as const }
    case "full_width":
      return { label: "Full Width", icon: Layout, variant: "outline" as const }
    case "contact":
      return { label: "Contact Page", icon: Contact, variant: "outline" as const }
    case "sidebar_left":
      return { label: "Sidebar Left", icon: SidebarIcon, variant: "outline" as const }
    case "sidebar_right":
      return { label: "Sidebar Right", icon: SidebarIcon, variant: "outline" as const }
    case "default":
    default:
      return { label: "Default Template", icon: Layers, variant: "outline" as const }
  }
}

export function getPagesColumns({
  pages = [],
  onView,
  onQuickEdit,
  onFullEdit,
  onDelete,
  onDuplicate,
  t = (key) => key,
}: GetPagesColumnsOptions = {}): ColumnDef<CmsPage>[] {
  const pageMap = new Map<string, CmsPage>(pages.map((p) => [p.id, p]))

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
        const page = row.original
        const isChild = Boolean(page.parentId)
        const parentPage = page.parentId ? pageMap.get(page.parentId) : null

        return (
          <div className="flex items-start gap-2.5 max-w-[340px] group/title py-1">
            <div
              className={`size-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                isChild
                  ? "bg-muted text-muted-foreground ml-3"
                  : "bg-primary/10 text-primary"
              }`}
            >
              {isChild ? (
                <CornerDownRight className="size-4" />
              ) : (
                <FileCode className="size-4" />
              )}
            </div>

            <div className="space-y-1 min-w-0 flex-1">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="font-semibold text-xs truncate text-foreground hover:text-primary transition-colors cursor-pointer"
                  onClick={() => onFullEdit?.(page)}
                >
                  {isChild && <span className="text-muted-foreground mr-1">—</span>}
                  {page.title}
                </span>

                {page.status === "draft" && (
                  <Badge variant="secondary" className="text-[10px] h-4.5 px-1.5 bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20">
                    Draft
                  </Badge>
                )}
                {page.status === "private" && (
                  <Badge variant="secondary" className="text-[10px] h-4.5 px-1.5 bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20">
                    Private
                  </Badge>
                )}
              </div>

              <div className="text-[11px] text-muted-foreground font-mono truncate">
                /{parentPage ? `${parentPage.slug}/` : ""}{page.slug}
              </div>

              {/* WordPress-style Quick Row Actions on hover / accessible */}
              <div className="flex items-center gap-2 pt-0.5 text-[11px] text-muted-foreground">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    onFullEdit?.(page)
                  }}
                  className="hover:text-primary transition-colors font-medium cursor-pointer"
                >
                  Edit
                </button>
                <span>|</span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    onQuickEdit?.(page)
                  }}
                  className="hover:text-primary transition-colors font-medium cursor-pointer"
                >
                  Quick Edit
                </button>
                <span>|</span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    onDelete?.(page)
                  }}
                  className="hover:text-destructive transition-colors font-medium cursor-pointer text-destructive/80"
                >
                  Trash
                </button>
                <span>|</span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    onView?.(page)
                  }}
                  className="hover:text-foreground transition-colors cursor-pointer"
                >
                  View
                </button>
              </div>
            </div>
          </div>
        )
      },
      filterFn: (row, id, filterValue) => {
        const page = row.original
        const query = String(filterValue || "").toLowerCase()
        return (
          page.title.toLowerCase().includes(query) ||
          page.slug.toLowerCase().includes(query) ||
          page.author.toLowerCase().includes(query)
        )
      },
    },
    {
      accessorKey: "author",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("fields.author")} />
      ),
      cell: ({ row }) => (
        <span className="text-xs font-medium text-muted-foreground">
          {row.getValue("author")}
        </span>
      ),
    },
    {
      accessorKey: "template",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("fields.template")} />
      ),
      cell: ({ row }) => {
        const template = row.getValue("template") as PageTemplate
        const badgeInfo = getTemplateBadge(template)
        const Icon = badgeInfo.icon
        return (
          <Badge variant={badgeInfo.variant} className="text-[11px] font-normal gap-1">
            <Icon className="size-3 text-muted-foreground" />
            <span>{badgeInfo.label}</span>
          </Badge>
        )
      },
      filterFn: (row, id, filterValue) => {
        if (!filterValue || filterValue.length === 0) return true
        return filterValue.includes(row.getValue(id))
      },
    },
    {
      accessorKey: "parentId",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("fields.parent")} />
      ),
      cell: ({ row }) => {
        const parentId = row.getValue("parentId") as string | null
        if (!parentId) {
          return <span className="text-xs text-muted-foreground">—</span>
        }
        const parent = pageMap.get(parentId)
        return (
          <span className="text-xs font-medium text-foreground truncate max-w-[120px] block" title={parent?.title}>
            {parent?.title || "Parent Page"}
          </span>
        )
      },
    },
    {
      accessorKey: "order",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("fields.order")} />
      ),
      cell: ({ row }) => (
        <span className="text-xs font-mono text-muted-foreground">
          {row.getValue("order")}
        </span>
      ),
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("fields.status")} />
      ),
      cell: ({ row }) => {
        const status = row.getValue("status") as string
        return (
          <StatusBadge
            status={
              status === "published"
                ? "success"
                : status === "draft"
                ? "warning"
                : status === "private"
                ? "info"
                : "neutral"
            }
          >
            {status === "published"
              ? "Published"
              : status === "draft"
              ? "Draft"
              : status === "private"
              ? "Private"
              : "Archived"}
          </StatusBadge>
        )
      },
      filterFn: (row, id, filterValue) => {
        if (!filterValue || filterValue.length === 0) return true
        return filterValue.includes(row.getValue(id))
      },
    },
    {
      accessorKey: "publishedAt",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("fields.publishedAt")} />
      ),
      cell: ({ row }) => {
        const page = row.original
        return (
          <div className="space-y-0.5 text-xs text-muted-foreground">
            <div>{page.publishedAt}</div>
            {page.updatedAt && (
              <div className="text-[10px] font-mono text-muted-foreground/75">
                Updated {page.updatedAt}
              </div>
            )}
          </div>
        )
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const page = row.original

        return (
          <div className="flex items-center justify-end" onClick={(e) => e.stopPropagation()}>
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-8 text-muted-foreground hover:text-foreground cursor-pointer"
                  />
                }
              >
                <MoreHorizontal className="size-4" />
                <span className="sr-only">Open menu</span>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44">
                <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
                  Page Actions
                </DropdownMenuLabel>
                <DropdownMenuItem
                  onClick={() => onView?.(page)}
                  className="text-xs gap-2 cursor-pointer"
                >
                  <Eye className="size-3.5 text-muted-foreground" />
                  <span>View Details</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onFullEdit?.(page)}
                  className="text-xs gap-2 cursor-pointer"
                >
                  <Edit className="size-3.5 text-muted-foreground" />
                  <span>Full Editor</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onQuickEdit?.(page)}
                  className="text-xs gap-2 cursor-pointer"
                >
                  <FileCode className="size-3.5 text-muted-foreground" />
                  <span>Quick Edit</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onDuplicate?.(page)}
                  className="text-xs gap-2 cursor-pointer"
                >
                  <Copy className="size-3.5 text-muted-foreground" />
                  <span>Duplicate</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => onDelete?.(page)}
                  className="text-xs gap-2 text-destructive focus:text-destructive cursor-pointer"
                >
                  <Trash2 className="size-3.5" />
                  <span>Move to Trash</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )
      },
    },
  ]
}
