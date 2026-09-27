"use client"

import * as React from "react"
import { useTranslations } from "next-intl"
import { Plus, Newspaper, CheckCircle, FileEdit, Archive } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DataTable } from "@/components/shared/data-table"
import { useRouter } from "@/i18n/routing"
import { toast } from "@/components/ui/toast"
import { useCms } from "@/context/cms-provider"
import { getPostsColumns } from "./posts-columns"
import type { Post } from "@/data/cms"
import {
  ViewPostSheet,
  QuickEditPostDialog,
  CreatePostDialog,
} from "./components/post-dialogs"

export function PostsFeature() {
  const t = useTranslations("cms.posts")
  const router = useRouter()
  const { posts, updatePost, createPost, deletePost } = useCms()

  const [selectedPost, setSelectedPost] = React.useState<Post | null>(null)
  const [quickEditingPost, setQuickEditingPost] = React.useState<Post | null>(null)
  const [createDialogOpen, setCreateDialogOpen] = React.useState(false)

  const handleDelete = React.useCallback(
    (post: Post) => {
      deletePost(post.id)
      if (selectedPost?.id === post.id) {
        setSelectedPost(null)
      }
      toast.add({
        title: t("editor.postDeletedSuccess"),
        description: `"${post.title}" has been removed.`,
      })
    },
    [deletePost, selectedPost, t]
  )

  const handleQuickEditSave = React.useCallback(
    (updated: Post) => {
      updatePost(updated.id, updated)
      if (selectedPost?.id === updated.id) {
        setSelectedPost(updated)
      }
      toast.add({
        title: t("editor.postSavedSuccess"),
        description: `Saved changes to "${updated.title}".`,
      })
    },
    [updatePost, selectedPost, t]
  )

  const handleCreatePost = React.useCallback(
    (postData: Partial<Post> & { title: string }) => {
      const created = createPost(postData)
      toast.add({
        title: t("editor.postCreatedSuccess"),
        description: `Created article "${created.title}".`,
      })
    },
    [createPost, t]
  )

  const handleFullEdit = React.useCallback(
    (post: Post) => {
      router.push(`/dashboard/cms/posts/${post.id}`)
    },
    [router]
  )

  const handleFullCreate = React.useCallback(() => {
    router.push("/dashboard/cms/posts/new")
  }, [router])

  const columns = React.useMemo(
    () =>
      getPostsColumns({
        onView: (p) => setSelectedPost(p),
        onQuickEdit: (p) => setQuickEditingPost(p),
        onFullEdit: (p) => handleFullEdit(p),
        onDelete: handleDelete,
        t,
      }),
    [handleDelete, handleFullEdit, t]
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

        <div className="flex items-center gap-2">
          <Button
            onClick={() => setCreateDialogOpen(true)}
            size="sm"
            className="h-8 gap-1.5 text-xs cursor-pointer"
          >
            <Plus className="size-3.5" />
            <span>{t("newPost")}</span>
          </Button>
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
        onRowClick={(post) => setSelectedPost(post)}
        toolbarActions={
          <div className="flex items-center gap-1.5">
            <Button
              onClick={() => setCreateDialogOpen(true)}
              size="sm"
              className="h-8 gap-1.5 text-xs cursor-pointer"
            >
              <Plus className="size-3.5" />
              <span>{t("newPost")}</span>
            </Button>
          </div>
        }
      />

      {/* View Post Drawer/Sheet */}
      <ViewPostSheet
        post={selectedPost}
        open={Boolean(selectedPost)}
        onOpenChange={(open) => !open && setSelectedPost(null)}
        onDelete={handleDelete}
        onQuickEdit={(p) => setQuickEditingPost(p)}
        onFullEdit={(p) => handleFullEdit(p)}
      />

      {/* Quick Edit Dialog */}
      <QuickEditPostDialog
        post={quickEditingPost}
        open={Boolean(quickEditingPost)}
        onOpenChange={(open) => !open && setQuickEditingPost(null)}
        onSave={handleQuickEditSave}
        onFullEdit={handleFullEdit}
      />

      {/* Create Post Dialog */}
      <CreatePostDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onCreate={handleCreatePost}
        onOpenFullCreate={handleFullCreate}
      />
    </div>
  )
}
