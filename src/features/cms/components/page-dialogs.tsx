"use client"

import * as React from "react"
import { useTranslations } from "next-intl"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import {
  FileCode,
  Trash2,
  CornerDownRight,
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
import type { CmsPage, PageTemplate } from "@/data/cms"

const pageFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().optional(),
  status: z.enum(["published", "draft", "archived", "private"] as const),
  template: z.enum(["default", "full_width", "landing", "contact", "sidebar_left", "sidebar_right"] as const),
  parentId: z.string().nullable().optional(),
  order: z.number().int().min(0),
  featuredImage: z.string().nullable().optional(),
  excerpt: z.string().optional(),
  content: z.string().optional(),
})

type PageFormValues = z.infer<typeof pageFormSchema>

function getPageFormFields(
  t: (key: string) => string,
  pages: CmsPage[],
  currentPageId?: string
): FormFieldsConfig<PageFormValues> {
  const eligibleParents = pages
    .filter((p) => p.id !== currentPageId)
    .map((p) => ({ value: p.id, label: p.title }))

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
      name: "slug",
      type: "text",
      label: t("editor.slugLabel"),
      placeholder: t("dialog.slugPlaceholder"),
      colSpan: 1,
    },
    {
      name: "status",
      type: "select",
      label: t("fields.status"),
      required: true,
      colSpan: 1,
      options: [
        { value: "published", label: t("statuses.published") },
        { value: "draft", label: t("statuses.draft") },
        { value: "private", label: t("statuses.private") },
        { value: "archived", label: t("statuses.archived") },
      ],
    },
    {
      name: "template",
      type: "select",
      label: t("fields.template"),
      required: true,
      colSpan: 1,
      options: [
        { value: "default", label: t("templates.default") },
        { value: "full_width", label: t("templates.full_width") },
        { value: "landing", label: t("templates.landing") },
        { value: "contact", label: t("templates.contact") },
        { value: "sidebar_left", label: t("templates.sidebar_left") },
        { value: "sidebar_right", label: t("templates.sidebar_right") },
      ],
    },
    {
      name: "parentId",
      type: "select",
      label: t("fields.parent"),
      colSpan: 1,
      options: [
        { value: "", label: t("editor.noParent") },
        ...eligibleParents,
      ],
    },
    {
      name: "order",
      type: "number",
      label: t("fields.order"),
      placeholder: "0",
      colSpan: 1,
    },
    {
      name: "featuredImage",
      type: "upload",
      label: t("editor.featuredImageLabel"),
      placeholder: "Choose or upload header banner",
      allowedTypes: ["image"],
      colSpan: 1,
    },
    {
      name: "excerpt",
      type: "textarea",
      label: t("editor.excerptLabel"),
      placeholder: t("dialog.excerptPlaceholder"),
      rows: 2,
      colSpan: 2,
    },
    {
      name: "content",
      type: "richtext",
      label: t("editor.contentLabel"),
      placeholder: t("dialog.contentPlaceholder"),
      colSpan: 2,
    },
  ]
}

/* ========================================================================= */
/* QUICK EDIT PAGE DIALOG (WordPress-Style)                                  */
/* ========================================================================= */
interface QuickEditPageDialogProps {
  page: CmsPage | null
  pages: CmsPage[]
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (updatedPage: CmsPage) => void
  onFullEdit?: (page: CmsPage) => void
}

function QuickEditForm({
  page,
  pages,
  onSave,
  onClose,
  onFullEdit,
}: {
  page: CmsPage
  pages: CmsPage[]
  onSave: (updated: CmsPage) => void
  onClose: () => void
  onFullEdit?: (page: CmsPage) => void
}) {
  const t = useTranslations("cms.pages")
  const tCommon = useTranslations("common")

  const form = useForm<PageFormValues>({
    resolver: zodResolver(pageFormSchema),
    defaultValues: {
      title: page.title || "",
      slug: page.slug || "",
      status: page.status || "draft",
      template: page.template || "default",
      parentId: page.parentId || null,
      order: page.order ?? 0,
      featuredImage: page.featuredImage || null,
      excerpt: page.excerpt || "",
      content: page.content || "",
    },
  })

  const onSubmit = (data: PageFormValues) => {
    onSave({
      ...page,
      title: data.title.trim(),
      slug: data.slug?.trim() || page.slug,
      status: data.status,
      template: data.template,
      parentId: data.parentId || null,
      order: Number(data.order) || 0,
      featuredImage: data.featuredImage || null,
      excerpt: data.excerpt || "",
      content: data.content || "",
      updatedAt: new Date().toISOString().split("T")[0],
    })
    onClose()
  }

  const eligibleParents = pages
    .filter((p) => p.id !== page.id)
    .map((p) => ({ value: p.id, label: p.title }))

  const quickFields: FormFieldsConfig<PageFormValues> = [
    {
      name: "title",
      type: "text",
      label: t("fields.title"),
      required: true,
      colSpan: 2,
    },
    {
      name: "slug",
      type: "text",
      label: t("editor.slugLabel"),
      colSpan: 1,
    },
    {
      name: "status",
      type: "select",
      label: t("fields.status"),
      required: true,
      colSpan: 1,
      options: [
        { value: "published", label: t("statuses.published") },
        { value: "draft", label: t("statuses.draft") },
        { value: "private", label: t("statuses.private") },
        { value: "archived", label: t("statuses.archived") },
      ],
    },
    {
      name: "template",
      type: "select",
      label: t("fields.template"),
      required: true,
      colSpan: 1,
      options: [
        { value: "default", label: t("templates.default") },
        { value: "full_width", label: t("templates.full_width") },
        { value: "landing", label: t("templates.landing") },
        { value: "contact", label: t("templates.contact") },
        { value: "sidebar_left", label: t("templates.sidebar_left") },
        { value: "sidebar_right", label: t("templates.sidebar_right") },
      ],
    },
    {
      name: "parentId",
      type: "select",
      label: t("fields.parent"),
      colSpan: 1,
      options: [
        { value: "", label: t("editor.noParent") },
        ...eligibleParents,
      ],
    },
    {
      name: "order",
      type: "number",
      label: t("fields.order"),
      colSpan: 2,
    },
  ]

  return (
    <div className="space-y-4">
      <DynamicForm
        form={form}
        onSubmit={onSubmit}
        fields={quickFields}
        columns={2}
        className="space-y-4"
        showSubmitButton={false}
      />

      <div className="flex items-center justify-between pt-4 border-t gap-2">
        {onFullEdit ? (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => {
              onClose()
              onFullEdit(page)
            }}
            className="text-xs gap-1.5 cursor-pointer text-muted-foreground hover:text-foreground"
          >
            <Edit className="size-3.5" />
            <span>{t("dialog.openFullEdit")}</span>
          </Button>
        ) : (
          <div />
        )}

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            className="text-xs cursor-pointer"
          >
            {tCommon("cancel")}
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={form.handleSubmit(onSubmit)}
            className="text-xs cursor-pointer shadow-xs"
          >
            {t("dialog.save")}
          </Button>
        </div>
      </div>
    </div>
  )
}

export function QuickEditPageDialog({
  page,
  pages,
  open,
  onOpenChange,
  onSave,
  onFullEdit,
}: QuickEditPageDialogProps) {
  const t = useTranslations("cms.pages")
  if (!page) return null

  return (
    <AppDialog
      open={open}
      onOpenChange={onOpenChange}
      size="lg"
      title={
        <div className="flex items-center gap-2">
          <FileCode className="size-4.5 text-primary" />
          <span>{t("dialog.quickEditTitle")}</span>
        </div>
      }
      description={t("dialog.quickEditDescription")}
    >
      <QuickEditForm
        page={page}
        pages={pages}
        onSave={onSave}
        onClose={() => onOpenChange(false)}
        onFullEdit={onFullEdit}
      />
    </AppDialog>
  )
}

/* ========================================================================= */
/* CREATE PAGE DIALOG                                                        */
/* ========================================================================= */
interface CreatePageDialogProps {
  pages: CmsPage[]
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreate: (pageData: Partial<CmsPage> & { title: string }) => void
  onOpenFullCreate?: () => void
}

function CreatePageForm({
  pages,
  onCreate,
  onClose,
  onOpenFullCreate,
}: {
  pages: CmsPage[]
  onCreate: (data: Partial<CmsPage> & { title: string }) => void
  onClose: () => void
  onOpenFullCreate?: () => void
}) {
  const t = useTranslations("cms.pages")
  const tCommon = useTranslations("common")

  const form = useForm<PageFormValues>({
    resolver: zodResolver(pageFormSchema),
    defaultValues: {
      title: "",
      slug: "",
      status: "published",
      template: "default",
      parentId: null,
      order: 0,
      featuredImage: null,
      excerpt: "",
      content: "",
    },
  })

  const onSubmit = (data: PageFormValues) => {
    onCreate({
      title: data.title.trim(),
      slug: data.slug?.trim() || undefined,
      status: data.status,
      template: data.template,
      parentId: data.parentId || null,
      order: Number(data.order) || 0,
      featuredImage: data.featuredImage || null,
      excerpt: data.excerpt || "",
      content: data.content || "",
    })
    form.reset()
    onClose()
  }

  const fields = getPageFormFields(t, pages)

  return (
    <div className="space-y-4">
      <DynamicForm
        form={form}
        onSubmit={onSubmit}
        fields={fields}
        columns={2}
        className="space-y-4"
        showSubmitButton={false}
      />

      <div className="flex items-center justify-between pt-4 border-t gap-2">
        {onOpenFullCreate ? (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => {
              onClose()
              onOpenFullCreate()
            }}
            className="text-xs gap-1.5 cursor-pointer text-muted-foreground hover:text-foreground"
          >
            <Sparkles className="size-3.5" />
            <span>{t("dialog.openFullEdit")}</span>
          </Button>
        ) : (
          <div />
        )}

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            className="text-xs cursor-pointer"
          >
            {tCommon("cancel")}
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={form.handleSubmit(onSubmit)}
            className="text-xs cursor-pointer shadow-xs"
          >
            {t("dialog.create")}
          </Button>
        </div>
      </div>
    </div>
  )
}

export function CreatePageDialog({
  pages,
  open,
  onOpenChange,
  onCreate,
  onOpenFullCreate,
}: CreatePageDialogProps) {
  const t = useTranslations("cms.pages")

  return (
    <AppDialog
      open={open}
      onOpenChange={onOpenChange}
      size="2xl"
      title={
        <div className="flex items-center gap-2">
          <FileCode className="size-4.5 text-primary" />
          <span>{t("dialog.createTitle")}</span>
        </div>
      }
      description={t("dialog.createDescription")}
    >
      <CreatePageForm
        pages={pages}
        onCreate={onCreate}
        onClose={() => onOpenChange(false)}
        onOpenFullCreate={onOpenFullCreate}
      />
    </AppDialog>
  )
}

/* ========================================================================= */
/* VIEW PAGE SHEET (Right Drawer)                                            */
/* ========================================================================= */
interface ViewPageSheetProps {
  page: CmsPage | null
  pages?: CmsPage[]
  open: boolean
  onOpenChange: (open: boolean) => void
  onDelete?: (page: CmsPage) => void
  onQuickEdit?: (page: CmsPage) => void
  onFullEdit?: (page: CmsPage) => void
}

function getTemplateLabel(template: PageTemplate) {
  switch (template) {
    case "landing":
      return "Landing Page"
    case "full_width":
      return "Full Width"
    case "contact":
      return "Contact Page"
    case "sidebar_left":
      return "Sidebar Left"
    case "sidebar_right":
      return "Sidebar Right"
    case "default":
    default:
      return "Default Template"
  }
}

export function ViewPageSheet({
  page,
  pages = [],
  open,
  onOpenChange,
  onDelete,
  onQuickEdit,
  onFullEdit,
}: ViewPageSheetProps) {
  const t = useTranslations("cms.pages")

  if (!page) return null

  const wordCount = page.content
    ? page.content.replace(/<[^>]*>/g, "").split(/\s+/).filter(Boolean).length
    : 0
  const readingTime = Math.ceil(wordCount / 200) || 1

  const parentPage = page.parentId ? pages.find((p) => p.id === page.parentId) : null

  return (
    <AppSheet
      open={open}
      onOpenChange={onOpenChange}
      side="right"
      size="lg"
      title={
        <div className="flex items-center gap-2 min-w-0 pr-6">
          <FileCode className="size-4.5 text-primary shrink-0" />
          <span className="truncate">{page.title}</span>
        </div>
      }
      description={`/${parentPage ? `${parentPage.slug}/` : ""}${page.slug}`}
      footer={
        <div className="flex items-center justify-between w-full gap-2">
          {onDelete ? (
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={() => {
                onOpenChange(false)
                onDelete(page)
              }}
              className="text-xs gap-1.5 cursor-pointer"
            >
              <Trash2 className="size-3.5" />
              <span>{t("actions.delete")}</span>
            </Button>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-2">
            {onQuickEdit && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  onOpenChange(false)
                  onQuickEdit(page)
                }}
                className="text-xs cursor-pointer"
              >
                {t("actions.quickEdit")}
              </Button>
            )}
            {onFullEdit && (
              <Button
                type="button"
                size="sm"
                onClick={() => {
                  onOpenChange(false)
                  onFullEdit(page)
                }}
                className="text-xs gap-1.5 cursor-pointer shadow-xs"
              >
                <Edit className="size-3.5" />
                <span>{t("actions.fullEdit")}</span>
              </Button>
            )}
          </div>
        </div>
      }
    >
      <div className="space-y-5 py-2">
        {/* Featured Image Banner */}
        {page.featuredImage && (
          <div className="relative rounded-xl border overflow-hidden bg-muted/20 h-44 sm:h-52 flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={page.featuredImage}
              alt={page.title}
              className="w-full h-full object-cover"
            />
            <Badge className="absolute top-2.5 right-2.5 bg-background/80 text-foreground backdrop-blur-xs shadow-xs text-[10px]">
              Header Banner
            </Badge>
          </div>
        )}

        {/* Status and Attributes Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3 rounded-xl border bg-muted/15 text-xs">
          <div>
            <span className="text-[10px] uppercase font-mono text-muted-foreground block">
              Status
            </span>
            <div className="mt-1">
              <StatusBadge
                status={
                  page.status === "published"
                    ? "success"
                    : page.status === "draft"
                    ? "warning"
                    : page.status === "private"
                    ? "info"
                    : "neutral"
                }
              >
                {page.status}
              </StatusBadge>
            </div>
          </div>

          <div>
            <span className="text-[10px] uppercase font-mono text-muted-foreground block">
              Template
            </span>
            <span className="font-medium text-foreground block truncate mt-1">
              {getTemplateLabel(page.template)}
            </span>
          </div>

          <div>
            <span className="text-[10px] uppercase font-mono text-muted-foreground block">
              Order
            </span>
            <span className="font-mono text-foreground block mt-1">
              {page.order ?? 0}
            </span>
          </div>

          <div>
            <span className="text-[10px] uppercase font-mono text-muted-foreground block">
              Author
            </span>
            <span className="font-medium text-foreground block truncate mt-1">
              {page.author}
            </span>
          </div>
        </div>

        {/* Parent Page Indicator */}
        {parentPage && (
          <div className="p-3 rounded-lg border bg-muted/20 flex items-center gap-2 text-xs">
            <CornerDownRight className="size-4 text-muted-foreground shrink-0" />
            <span className="text-muted-foreground">Parent Page:</span>
            <span className="font-semibold text-foreground">{parentPage.title}</span>
            <span className="text-muted-foreground font-mono">({parentPage.slug})</span>
          </div>
        )}

        {/* Excerpt */}
        {page.excerpt && (
          <div className="space-y-1">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Summary
            </span>
            <p className="text-xs sm:text-sm text-foreground leading-relaxed italic bg-muted/20 p-3 rounded-lg border">
              &ldquo;{page.excerpt}&rdquo;
            </p>
          </div>
        )}

        {/* Content Preview */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Content Preview
            </span>
            <span className="text-[11px] text-muted-foreground font-mono">
              {wordCount} words • ~{readingTime} min read
            </span>
          </div>

          <div
            className="prose prose-sm dark:prose-invert max-w-none p-4 rounded-xl border bg-card/60 text-xs sm:text-sm leading-relaxed overflow-x-auto"
            dangerouslySetInnerHTML={{
              __html: page.content || "<p class='text-muted-foreground italic'>No content written yet.</p>",
            }}
          />
        </div>

        {/* Meta SEO info */}
        {(page.metaTitle || page.metaDescription) && (
          <div className="space-y-1.5 p-3 rounded-lg border bg-muted/10 text-xs">
            <span className="font-semibold text-[11px] uppercase tracking-wider text-muted-foreground block">
              Search Engine Listing
            </span>
            <div className="text-blue-600 dark:text-blue-400 font-medium">
              {page.metaTitle || page.title}
            </div>
            <div className="text-[11px] text-emerald-700 dark:text-emerald-400 font-mono">
              https://luminacommerce.com/{page.slug}
            </div>
            <p className="text-[11px] text-muted-foreground">
              {page.metaDescription || page.excerpt || "No description provided."}
            </p>
          </div>
        )}
      </div>
    </AppSheet>
  )
}
