"use client"

import * as React from "react"
import { useTranslations } from "next-intl"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { FolderTree, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { AppDialog } from "@/components/app-dialog"
import { AppSheet } from "@/components/app-sheet"
import { Badge } from "@/components/ui/badge"
import { DynamicForm } from "@/components/forms"
import type { FormFieldsConfig } from "@/types/form"
import type { Category } from "../data/cms-data"

const categoryFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  description: z.string().optional(),
})

type CategoryFormValues = z.infer<typeof categoryFormSchema>

function getCategoryFormFields(
  t: (key: string) => string
): FormFieldsConfig<CategoryFormValues> {
  return [
    {
      name: "name",
      type: "text",
      label: t("fields.name"),
      placeholder: t("dialog.namePlaceholder"),
      required: true,
      colSpan: 2,
    },
    {
      name: "slug",
      type: "text",
      label: t("fields.slug"),
      placeholder: t("dialog.slugPlaceholder"),
      required: true,
      colSpan: 2,
    },
    {
      name: "description",
      type: "textarea",
      label: t("fields.description"),
      placeholder: t("dialog.descPlaceholder"),
      rows: 3,
      colSpan: 2,
    },
  ]
}

interface CreateCategoryDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreate: (category: Category) => void
}

function CreateCategoryForm({
  onOpenChange,
  onCreate,
}: {
  onOpenChange: (open: boolean) => void
  onCreate: (category: Category) => void
}) {
  const t = useTranslations("cms.categories")
  const tCommon = useTranslations("common")

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
    },
  })

  React.useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === "name" && !form.getFieldState("slug").isDirty && value.name) {
        const generated = value.name
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "")
        form.setValue("slug", generated, { shouldValidate: true })
      }
    })
    return () => subscription.unsubscribe()
  }, [form])

  const fields = React.useMemo(() => getCategoryFormFields(t), [t])

  const onSubmit = (data: CategoryFormValues) => {
    onCreate({
      id: `cat-${Date.now()}`,
      name: data.name.trim(),
      slug: data.slug.trim(),
      description: (data.description || "").trim(),
      postCount: 0,
    })
    form.reset()
    onOpenChange(false)
  }

  return (
    <DynamicForm<CategoryFormValues>
      form={form}
      fields={fields}
      onSubmit={onSubmit}
      submitLabel={t("dialog.create")}
      columns={2}
      secondaryAction={
        <Button
          type="button"
          variant="outline"
          onClick={() => onOpenChange(false)}
        >
          {tCommon("cancel")}
        </Button>
      }
    />
  )
}

export function CreateCategoryDialog({
  open,
  onOpenChange,
  onCreate,
}: CreateCategoryDialogProps) {
  const t = useTranslations("cms.categories")

  return (
    <AppDialog
      open={open}
      onOpenChange={onOpenChange}
      title={t("dialog.createTitle")}
      description={t("dialog.createDescription")}
      size="md"
    >
      <CreateCategoryForm
        key={open ? "open" : "closed"}
        onOpenChange={onOpenChange}
        onCreate={onCreate}
      />
    </AppDialog>
  )
}

interface EditCategoryDialogProps {
  category: Category | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpdate: (category: Category) => void
}

function EditCategoryForm({
  category,
  onOpenChange,
  onUpdate,
}: {
  category: Category
  onOpenChange: (open: boolean) => void
  onUpdate: (category: Category) => void
}) {
  const t = useTranslations("cms.categories")
  const tCommon = useTranslations("common")

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name: category.name,
      slug: category.slug,
      description: category.description || "",
    },
  })

  const fields = React.useMemo(() => getCategoryFormFields(t), [t])

  const onSubmit = (data: CategoryFormValues) => {
    onUpdate({
      ...category,
      name: data.name.trim(),
      slug: data.slug.trim(),
      description: (data.description || "").trim(),
    })
    onOpenChange(false)
  }

  return (
    <DynamicForm<CategoryFormValues>
      form={form}
      fields={fields}
      onSubmit={onSubmit}
      submitLabel={tCommon("save")}
      columns={2}
      secondaryAction={
        <Button
          type="button"
          variant="outline"
          onClick={() => onOpenChange(false)}
        >
          {tCommon("cancel")}
        </Button>
      }
    />
  )
}

export function EditCategoryDialog({
  category,
  open,
  onOpenChange,
  onUpdate,
}: EditCategoryDialogProps) {
  const t = useTranslations("cms.categories")

  return (
    <AppDialog
      open={open}
      onOpenChange={onOpenChange}
      title={t("actions.edit")}
      description="Update category name, URL slug, and description."
      size="md"
    >
      {category && (
        <EditCategoryForm
          key={category.id}
          category={category}
          onOpenChange={onOpenChange}
          onUpdate={onUpdate}
        />
      )}
    </AppDialog>
  )
}

interface ViewCategorySheetProps {
  category: Category | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onDelete?: (id: string) => void
}

export function ViewCategorySheet({
  category,
  open,
  onOpenChange,
  onDelete,
}: ViewCategorySheetProps) {
  const t = useTranslations("cms.categories")
  const tCommon = useTranslations("common")

  if (!category) return null

  return (
    <AppSheet
      open={open}
      onOpenChange={onOpenChange}
      side="right"
      size="md"
      title={category.name}
      description={`/${category.slug}`}
      footer={
        <div className="flex items-center justify-between w-full gap-2">
          {onDelete ? (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => {
                onOpenChange(false)
                onDelete(category.id)
              }}
              className="gap-1.5"
            >
              <Trash2 className="size-3.5" />
              <span>{tCommon("delete")}</span>
            </Button>
          ) : <div />}

          <Button
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
          >
            {tCommon("close")}
          </Button>
        </div>
      }
    >
      <div className="flex flex-col gap-4 py-2">
        <div className="flex items-center gap-3 p-4 rounded-xl border bg-card shadow-xs">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <FolderTree className="size-6" />
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="text-base font-semibold truncate">{category.name}</h4>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="font-mono text-xs text-muted-foreground truncate">
                /{category.slug}
              </span>
              <Badge variant="secondary" className="text-[10px] font-mono px-1.5 py-0">
                {category.postCount} {t("fields.postCount").toLowerCase()}
              </Badge>
            </div>
          </div>
        </div>

        <div className="space-y-1.5">
          <span className="text-xs font-medium text-muted-foreground">
            {t("fields.description")}
          </span>
          <p className="text-sm leading-relaxed text-foreground bg-muted/30 p-3 rounded-lg border">
            {category.description || "No description provided."}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded-lg border bg-card space-y-1">
            <span className="text-muted-foreground block text-[11px] font-medium">
              Category ID
            </span>
            <span className="font-mono text-xs font-semibold">{category.id}</span>
          </div>

          <div className="p-3 rounded-lg border bg-card space-y-1">
            <span className="text-muted-foreground block text-[11px] font-medium">
              {t("sheet.postsCount")}
            </span>
            <span className="font-mono text-xs font-semibold">
              {category.postCount}
            </span>
          </div>
        </div>
      </div>
    </AppSheet>
  )
}
