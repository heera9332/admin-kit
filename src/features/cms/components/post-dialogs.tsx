"use client"

import * as React from "react"
import { useTranslations } from "next-intl"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import {
  FileText,
  Trash2,
  Eye,
  User,
  Calendar,
  Tag,
  ExternalLink,
  Edit,
  Sparkles,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { AppDialog } from "@/components/app-dialog"
import { AppSheet } from "@/components/app-sheet"
import { Badge } from "@/components/ui/badge"
import { StatusBadge } from "@/components/status-badge"
import { DynamicForm } from "@/components/forms"
import type { FormFieldsConfig } from "@/types/form"
import type { Post } from "@/data/cms"

const postFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  status: z.enum(["published", "draft", "archived"] as const),
  featuredImage: z.string().nullable().optional(),
  content: z.string().optional(),
})

type PostFormValues = z.infer<typeof postFormSchema>

function getPostFormFields(
  t: (key: string) => string
): FormFieldsConfig<PostFormValues> {
  return [
    {
      name: "title",
      type: "text",
      label: t("fields.title"),
      placeholder: t("dialog.titlePlaceholder"),
      required: true,
      colSpan: 2,
    },
    {
      name: "status",
      type: "select",
      label: t("fields.status"),
      required: true,
      colSpan: 2,
      options: [
        { value: "published", label: t("statuses.published") },
        { value: "draft", label: t("statuses.draft") },
        { value: "archived", label: t("statuses.archived") },
      ],
    },
    {
      name: "featuredImage",
      type: "upload",
      label: t("editor.featuredImageLabel"),
      placeholder: "Choose or upload featured image",
      allowedTypes: ["image"],
      colSpan: 2,
    },
    {
      name: "content",
      type: "richtext",
      label: t("editor.contentLabel"),
      placeholder: t("dialog.contentPlaceholder"),
      minHeight: "min-h-[220px]",
      colSpan: 2,
    },
  ]
}

interface QuickEditPostDialogProps {
  post: Post | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (updated: Post) => void
  onFullEdit?: (post: Post) => void
}

interface QuickEditFormProps {
  post: Post
  onSave: (updated: Post) => void
  onClose: () => void
  onFullEdit?: (post: Post) => void
}

function QuickEditForm({ post, onSave, onClose, onFullEdit }: QuickEditFormProps) {
  const t = useTranslations("cms.posts")
  const tCommon = useTranslations("common")

  const form = useForm<PostFormValues>({
    resolver: zodResolver(postFormSchema),
    defaultValues: {
      title: post.title || "",
      status: post.status || "draft",
      featuredImage: post.featuredImage || null,
      content: post.content || "",
    },
  })

  const fields = React.useMemo(() => getPostFormFields(t), [t])

  const onSubmit = (data: PostFormValues) => {
    onSave({
      ...post,
      title: data.title.trim(),
      status: data.status,
      featuredImage: data.featuredImage || null,
      content: data.content || "",
    })
    onClose()
  }

  return (
    <DynamicForm<PostFormValues>
      form={form}
      fields={fields}
      onSubmit={onSubmit}
      submitLabel={t("dialog.save")}
      columns={2}
      secondaryAction={
        <div className="flex items-center gap-2">
          {onFullEdit && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                onClose()
                onFullEdit(post)
              }}
              className="gap-1.5 text-xs cursor-pointer"
            >
              <ExternalLink className="size-3.5" />
              <span>{t("dialog.openFullEdit")}</span>
            </Button>
          )}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="cursor-pointer text-xs"
          >
            {tCommon("cancel")}
          </Button>
        </div>
      }
    />
  )
}

export function QuickEditPostDialog({
  post,
  open,
  onOpenChange,
  onSave,
  onFullEdit,
}: QuickEditPostDialogProps) {
  const t = useTranslations("cms.posts")

  if (!post) return null

  return (
    <AppDialog
      open={open}
      onOpenChange={onOpenChange}
      size="3xl"
      scrollable
      title={
        <div className="flex items-center gap-2">
          <div className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Edit className="size-4" />
          </div>
          <span className="font-semibold text-base">
            {t("dialog.quickEditTitle")}
          </span>
        </div>
      }
      description={t("dialog.quickEditDescription")}
    >
      <QuickEditForm
        key={post.id}
        post={post}
        onSave={onSave}
        onClose={() => onOpenChange(false)}
        onFullEdit={onFullEdit}
      />
    </AppDialog>
  )
}

interface CreatePostDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreate: (postData: Partial<Post> & { title: string }) => void
  onOpenFullCreate?: () => void
}

function CreatePostForm({
  onOpenChange,
  onCreate,
  onOpenFullCreate,
}: {
  onOpenChange: (open: boolean) => void
  onCreate: (postData: Partial<Post> & { title: string }) => void
  onOpenFullCreate?: () => void
}) {
  const t = useTranslations("cms.posts")
  const tCommon = useTranslations("common")

  const form = useForm<PostFormValues>({
    resolver: zodResolver(postFormSchema),
    defaultValues: {
      title: "",
      status: "draft",
      featuredImage: null,
      content: "",
    },
  })

  const fields = React.useMemo(() => getPostFormFields(t), [t])

  const onSubmit = (data: PostFormValues) => {
    onCreate({
      title: data.title.trim(),
      status: data.status,
      featuredImage: data.featuredImage || null,
      content: data.content || "",
    })
    form.reset()
    onOpenChange(false)
  }

  return (
    <DynamicForm<PostFormValues>
      form={form}
      fields={fields}
      onSubmit={onSubmit}
      submitLabel={t("dialog.create")}
      columns={2}
      secondaryAction={
        <div className="flex items-center gap-2">
          {onOpenFullCreate && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                onOpenChange(false)
                onOpenFullCreate()
              }}
              className="gap-1.5 text-xs cursor-pointer"
            >
              <ExternalLink className="size-3.5" />
              <span>{t("dialog.openFullEdit")}</span>
            </Button>
          )}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="cursor-pointer text-xs"
          >
            {tCommon("cancel")}
          </Button>
        </div>
      }
    />
  )
}

export function CreatePostDialog({
  open,
  onOpenChange,
  onCreate,
  onOpenFullCreate,
}: CreatePostDialogProps) {
  const t = useTranslations("cms.posts")

  return (
    <AppDialog
      open={open}
      onOpenChange={onOpenChange}
      size="3xl"
      scrollable
      title={
        <div className="flex items-center gap-2">
          <div className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Sparkles className="size-4" />
          </div>
          <span className="font-semibold text-base">{t("dialog.createTitle")}</span>
        </div>
      }
      description={t("dialog.createDescription")}
    >
      <CreatePostForm
        key={open ? "open" : "closed"}
        onOpenChange={onOpenChange}
        onCreate={onCreate}
        onOpenFullCreate={onOpenFullCreate}
      />
    </AppDialog>
  )
}

interface ViewPostSheetProps {
  post: Post | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onDelete?: (post: Post) => void
  onQuickEdit?: (post: Post) => void
  onFullEdit?: (post: Post) => void
}

export function ViewPostSheet({
  post,
  open,
  onOpenChange,
  onDelete,
  onQuickEdit,
  onFullEdit,
}: ViewPostSheetProps) {
  const t = useTranslations("cms.posts")
  const tCommon = useTranslations("common")

  if (!post) return null

  return (
    <AppSheet
      open={open}
      onOpenChange={onOpenChange}
      side="right"
      size="md"
      title={post.title}
      description={`/${post.slug}`}
      footer={
        <div className="flex items-center justify-between w-full gap-2">
          {onDelete ? (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => {
                onOpenChange(false)
                onDelete(post)
              }}
              className="gap-1.5 cursor-pointer text-xs"
            >
              <Trash2 className="size-3.5" />
              <span>{tCommon("delete")}</span>
            </Button>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-2">
            {onQuickEdit && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  onOpenChange(false)
                  onQuickEdit(post)
                }}
                className="gap-1.5 cursor-pointer text-xs"
              >
                <Edit className="size-3.5" />
                <span>{t("actions.quickEdit")}</span>
              </Button>
            )}
            {onFullEdit && (
              <Button
                variant="default"
                size="sm"
                onClick={() => {
                  onOpenChange(false)
                  onFullEdit(post)
                }}
                className="gap-1.5 cursor-pointer text-xs"
              >
                <ExternalLink className="size-3.5" />
                <span>{t("actions.fullEdit")}</span>
              </Button>
            )}
          </div>
        </div>
      }
    >
      <div className="flex flex-col gap-4 py-2">
        {/* Hero image if exists */}
        {post.featuredImage && (
          <div className="relative aspect-video w-full rounded-xl overflow-hidden border bg-muted/30">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={post.featuredImage}
              alt={post.title}
              className="size-full object-cover"
            />
          </div>
        )}

        <div className="flex items-start gap-3 p-4 rounded-xl border bg-card shadow-xs">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary mt-0.5">
            <FileText className="size-6" />
          </div>
          <div className="min-w-0 flex-1 space-y-1.5">
            <h4 className="text-base font-semibold leading-tight">{post.title}</h4>
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-xs text-muted-foreground">
                /{post.slug}
              </span>
              <StatusBadge status={post.status} size="sm" dot>
                {t(`statuses.${post.status}`)}
              </StatusBadge>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded-lg border bg-card space-y-1">
            <div className="flex items-center gap-1.5 text-muted-foreground text-[11px] font-medium">
              <User className="size-3.5" />
              <span>{t("fields.author")}</span>
            </div>
            <span className="text-xs font-semibold block">{post.author}</span>
          </div>

          <div className="p-3 rounded-lg border bg-card space-y-1">
            <div className="flex items-center gap-1.5 text-muted-foreground text-[11px] font-medium">
              <Tag className="size-3.5" />
              <span>{t("fields.category")}</span>
            </div>
            <Badge variant="outline" className="text-xs font-normal">
              {post.category}
            </Badge>
          </div>

          <div className="p-3 rounded-lg border bg-card space-y-1">
            <div className="flex items-center gap-1.5 text-muted-foreground text-[11px] font-medium">
              <Calendar className="size-3.5" />
              <span>{t("fields.publishedAt")}</span>
            </div>
            <span className="font-mono text-xs font-semibold block">
              {post.publishedAt}
            </span>
          </div>

          <div className="p-3 rounded-lg border bg-card space-y-1">
            <div className="flex items-center gap-1.5 text-muted-foreground text-[11px] font-medium">
              <Eye className="size-3.5" />
              <span>Views</span>
            </div>
            <span className="font-mono text-xs font-semibold block">
              {post.views?.toLocaleString?.() ?? post.views}
            </span>
          </div>
        </div>

        {/* Content excerpt preview */}
        {post.content && (
          <div className="space-y-1.5">
            <span className="text-xs font-medium text-muted-foreground">
              {t("editor.contentLabel")}
            </span>
            <div
              className="p-3.5 rounded-xl border bg-muted/20 text-xs text-foreground/90 max-h-48 overflow-y-auto prose prose-sm dark:prose-invert [&_p]:my-1 [&_h2]:text-sm [&_h3]:text-xs [&_ul]:pl-4"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </div>
        )}

        <div className="space-y-1.5">
          <span className="text-xs font-medium text-muted-foreground">
            Post ID
          </span>
          <div className="font-mono text-xs text-muted-foreground bg-muted/40 p-2.5 rounded-lg border">
            {post.id}
          </div>
        </div>
      </div>
    </AppSheet>
  )
}
