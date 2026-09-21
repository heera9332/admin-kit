"use client"

import * as React from "react"
import { useTranslations } from "next-intl"
import { Plus, Newspaper, CheckCircle, FileEdit, Archive } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DataTable } from "@/components/shared/data-table"
import { getPostsColumns } from "./posts-columns"
import { initialPosts, type Post } from "./data/cms-data"

export function PostsFeature() {
  const t = useTranslations("cms.posts")
  const [posts, setPosts] = React.useState<Post[]>(initialPosts)

  const handleDelete = React.useCallback((post: Post) => {
    setPosts((prev) => prev.filter((p) => p.id !== post.id))
  }, [])

  const columns = React.useMemo(
    () =>
      getPostsColumns({
        onView: (p) => alert(`Viewing: ${p.title}`),
        onEdit: (p) => alert(`Editing: ${p.title}`),
        onDelete: handleDelete,
        t,
      }),
    [handleDelete, t]
  )

  const totalCount = posts.length
  const publishedCount = posts.filter((p) => p.status === "published").length
  const draftCount = posts.filter((p) => p.status === "draft").length
  const archivedCount = posts.filter((p) => p.status === "archived").length

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
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              Total Posts
            </CardTitle>
            <Newspaper className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono">{totalCount}</div>
          </CardContent>
        </Card>
        <Card>
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
        <Card>
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
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              Archived
            </CardTitle>
            <Archive className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono text-muted-foreground">
              {archivedCount}
            </div>
          </CardContent>
        </Card>
      </div>

      <DataTable
        data={posts}
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
              { label: t("statuses.archived"), value: "archived" },
            ],
          },
        ]}
        sorting
        pagination={{
          pageSize: 6,
          pageSizeOptions: [6, 10, 20],
        }}
        toolbarActions={
          <Button
            onClick={() => alert("Create post modal / action")}
            size="sm"
            className="h-8 gap-1.5 text-xs"
          >
            <Plus className="size-3.5" />
            <span>{t("newPost")}</span>
          </Button>
        }
      />
    </div>
  )
}
