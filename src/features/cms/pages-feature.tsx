"use client"

import * as React from "react"
import { useTranslations } from "next-intl"
import {
  Plus,
  FileCode,
  CheckCircle,
  FileEdit,
  Layers,
  Sparkles,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DataTable } from "@/components/shared/data-table"
import { useRouter } from "@/i18n/routing"
import { toast } from "@/components/ui/toast"
import { useCms } from "@/context/cms-provider"
import { getPagesColumns } from "./pages-columns"
import type { CmsPage } from "@/data/cms"
import {
  ViewPageSheet,
  QuickEditPageDialog,
  CreatePageDialog,
} from "./components/page-dialogs"
import { cn } from "@/lib/utils"

export function PagesFeature() {
  const t = useTranslations("cms.pages")
  const router = useRouter()
  const { pages, updatePage, createPage, deletePage } = useCms()

  const [selectedPage, setSelectedPage] = React.useState<CmsPage | null>(null)
  const [quickEditingPage, setQuickEditingPage] = React.useState<CmsPage | null>(null)
  const [createDialogOpen, setCreateDialogOpen] = React.useState(false)
  const [activeTab, setActiveTab] = React.useState<"all" | "published" | "draft" | "archived">("all")

  const handleDelete = React.useCallback(
    (page: CmsPage) => {
      deletePage(page.id)
      if (selectedPage?.id === page.id) {
        setSelectedPage(null)
      }
      toast.add({
        title: t("editor.pageDeletedSuccess"),
        description: `"${page.title}" has been moved to trash.`,
      })
    },
    [deletePage, selectedPage, t]
  )

  const handleQuickEditSave = React.useCallback(
    (updated: CmsPage) => {
      updatePage(updated.id, updated)
      if (selectedPage?.id === updated.id) {
        setSelectedPage(updated)
      }
      toast.add({
        title: t("editor.pageSavedSuccess"),
        description: `Saved changes to "${updated.title}".`,
      })
    },
    [updatePage, selectedPage, t]
  )

  const handleCreatePage = React.useCallback(
    (pageData: Partial<CmsPage> & { title: string }) => {
      const created = createPage(pageData)
      toast.add({
        title: t("editor.pageCreatedSuccess"),
        description: `Created page "${created.title}".`,
      })
    },
    [createPage, t]
  )

  const handleDuplicate = React.useCallback(
    (page: CmsPage) => {
      const duplicateData: Partial<CmsPage> & { title: string } = {
        ...page,
        id: `page-${Date.now().toString().slice(-4)}`,
        title: `${page.title} (Copy)`,
        slug: `${page.slug}-copy`,
        status: "draft",
        views: 0,
        publishedAt: new Date().toISOString().split("T")[0],
        updatedAt: new Date().toISOString().split("T")[0],
      }
      const duplicated = createPage(duplicateData)
      toast.add({
        title: "Page duplicated",
        description: `Created draft copy "${duplicated.title}".`,
      })
    },
    [createPage]
  )

  const handleFullEdit = React.useCallback(
    (page: CmsPage) => {
      router.push(`/dashboard/cms/pages/${page.id}`)
    },
    [router]
  )

  const handleFullCreate = React.useCallback(() => {
    router.push("/dashboard/cms/pages/new")
  }, [router])

  const columns = React.useMemo(
    () =>
      getPagesColumns({
        pages,
        onView: (p) => setSelectedPage(p),
        onQuickEdit: (p) => setQuickEditingPage(p),
        onFullEdit: (p) => handleFullEdit(p),
        onDelete: handleDelete,
        onDuplicate: handleDuplicate,
        t,
      }),
    [handleDelete, handleDuplicate, handleFullEdit, pages, t]
  )

  const totalCount = pages.length
  const publishedCount = pages.filter((p) => p.status === "published").length
  const draftCount = pages.filter((p) => p.status === "draft").length
  const archivedCount = pages.filter((p) => p.status === "archived").length

  const filteredPages = React.useMemo(() => {
    if (activeTab === "published") return pages.filter((p) => p.status === "published")
    if (activeTab === "draft") return pages.filter((p) => p.status === "draft")
    if (activeTab === "archived") return pages.filter((p) => p.status === "archived")
    return pages
  }, [pages, activeTab])

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground font-heading">
              {t("title")}
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            {t("description")}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={() => setCreateDialogOpen(true)}
            variant="outline"
            size="sm"
            className="h-8 gap-1.5 text-xs cursor-pointer"
          >
            <Plus className="size-3.5" />
            <span>Quick Page</span>
          </Button>
          <Button
            onClick={handleFullCreate}
            size="sm"
            className="h-8 gap-1.5 text-xs cursor-pointer shadow-xs"
          >
            <Sparkles className="size-3.5" />
            <span>{t("newPage")}</span>
          </Button>
        </div>
      </div>

      {/* WordPress-style Status Tabs */}
      <div className="flex items-center gap-1 border-b pb-2 overflow-x-auto text-xs scrollbar-none">
        <button
          type="button"
          onClick={() => setActiveTab("all")}
          className={cn(
            "px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer flex items-center gap-1.5",
            activeTab === "all"
              ? "bg-primary text-primary-foreground shadow-2xs"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
          )}
        >
          <span>All</span>
          <span className="font-mono text-[11px] opacity-80">({totalCount})</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("published")}
          className={cn(
            "px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer flex items-center gap-1.5",
            activeTab === "published"
              ? "bg-primary text-primary-foreground shadow-2xs"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
          )}
        >
          <span>Published</span>
          <span className="font-mono text-[11px] opacity-80">({publishedCount})</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("draft")}
          className={cn(
            "px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer flex items-center gap-1.5",
            activeTab === "draft"
              ? "bg-primary text-primary-foreground shadow-2xs"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
          )}
        >
          <span>Drafts</span>
          <span className="font-mono text-[11px] opacity-80">({draftCount})</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("archived")}
          className={cn(
            "px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer flex items-center gap-1.5",
            activeTab === "archived"
              ? "bg-primary text-primary-foreground shadow-2xs"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
          )}
        >
          <span>Trash / Archived</span>
          <span className="font-mono text-[11px] opacity-80">({archivedCount})</span>
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card className="shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              Total Pages
            </CardTitle>
            <FileCode className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono">{totalCount}</div>
          </CardContent>
        </Card>
        <Card className="shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              Published
            </CardTitle>
            <CheckCircle className="size-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
              {publishedCount}
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              Drafts
            </CardTitle>
            <FileEdit className="size-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono text-amber-600 dark:text-amber-400">
              {draftCount}
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              Subpages
            </CardTitle>
            <Layers className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono text-muted-foreground">
              {pages.filter((p) => Boolean(p.parentId)).length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Data Table */}
      <DataTable
        data={filteredPages}
        columns={columns}
        search={{
          column: "title",
          placeholder: t("searchPlaceholder"),
        }}
        filters={[
          {
            column: "status",
            title: t("fields.status"),
            options: [
              { label: t("statuses.published"), value: "published" },
              { label: t("statuses.draft"), value: "draft" },
              { label: t("statuses.private"), value: "private" },
              { label: t("statuses.archived"), value: "archived" },
            ],
          },
          {
            column: "template",
            title: t("fields.template"),
            options: [
              { label: t("templates.default"), value: "default" },
              { label: t("templates.full_width"), value: "full_width" },
              { label: t("templates.landing"), value: "landing" },
              { label: t("templates.contact"), value: "contact" },
              { label: t("templates.sidebar_left"), value: "sidebar_left" },
              { label: t("templates.sidebar_right"), value: "sidebar_right" },
            ],
          },
        ]}
        sorting
        pagination={{
          pageSize: 10,
          pageSizeOptions: [10, 20, 50],
        }}
        onRowClick={(page) => setSelectedPage(page)}
        toolbarActions={
          <div className="flex items-center gap-1.5">
            <Button
              onClick={() => setCreateDialogOpen(true)}
              size="sm"
              className="h-8 gap-1.5 text-xs cursor-pointer shadow-xs"
            >
              <Plus className="size-3.5" />
              <span>{t("newPage")}</span>
            </Button>
          </div>
        }
      />

      {/* View Page Sheet */}
      <ViewPageSheet
        page={selectedPage}
        pages={pages}
        open={Boolean(selectedPage)}
        onOpenChange={(open) => !open && setSelectedPage(null)}
        onDelete={handleDelete}
        onQuickEdit={(p) => setQuickEditingPage(p)}
        onFullEdit={(p) => handleFullEdit(p)}
      />

      {/* Quick Edit Dialog */}
      <QuickEditPageDialog
        page={quickEditingPage}
        pages={pages}
        open={Boolean(quickEditingPage)}
        onOpenChange={(open) => !open && setQuickEditingPage(null)}
        onSave={handleQuickEditSave}
        onFullEdit={handleFullEdit}
      />

      {/* Create Page Dialog */}
      <CreatePageDialog
        pages={pages}
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onCreate={handleCreatePage}
        onOpenFullCreate={handleFullCreate}
      />
    </div>
  )
}
