"use client"

import * as React from "react"
import { useTranslations } from "next-intl"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { FolderTree, Edit, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { AppDialog } from "@/components/app-dialog"
import { AppSheet } from "@/components/app-sheet"
import { StatusBadge } from "@/components/status-badge"
import { DynamicForm } from "@/components/forms"
import type { FormFieldsConfig } from "@/types/form"
import type { ProductCategory } from "@/data/ecommerce"

const categoryFormSchema = z.object({
  name: z.string().min(1, "Category name is required"),
  slug: z.string().min(1, "Slug is required"),
  description: z.string().optional(),
  image: z.string().nullable().optional(),
  status: z.enum(["active", "inactive"] as const),
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
      placeholder: "e.g. Electronics",
      required: true,
      colSpan: 1,
    },
    {
      name: "slug",
      type: "text",
      label: t("fields.slug"),
      placeholder: "e.g. electronics",
      required: true,
      colSpan: 1,
    },
    {
      name: "status",
      type: "select",
      label: t("fields.status"),
      required: true,
      colSpan: 2,
      options: [
        { value: "active", label: t("statuses.active") },
        { value: "inactive", label: t("statuses.inactive") },
      ],
    },
    {
      name: "image",
      type: "upload",
      label: t("fields.image"),
      placeholder: "Upload category cover image",
      allowedTypes: ["image"],
      colSpan: 2,
    },
    {
      name: "description",
      type: "textarea",
      label: t("fields.description"),
      placeholder: "Brief description of the merchandise category...",
      rows: 3,
      colSpan: 2,
    },
  ]
}

interface CreateCategoryDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreate: (category: Omit<ProductCategory, "id">) => void
}

export function CreateCategoryDialog({
  open,
  onOpenChange,
  onCreate,
}: CreateCategoryDialogProps) {
  const t = useTranslations("ecommerce.categories")

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      image: null,
      status: "active",
    },
  })

  const fields = React.useMemo(() => getCategoryFormFields(t), [t])

  const onSubmit = (data: CategoryFormValues) => {
    onCreate({
      name: data.name.trim(),
      slug: (data.slug || data.name).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
      description: data.description || "",
      image: data.image || undefined,
      productCount: 0,
      status: data.status,
    })
    form.reset()
    onOpenChange(false)
  }

  return (
    <AppDialog
      open={open}
      onOpenChange={onOpenChange}
      size="xl"
      title={
        <div className="flex items-center gap-2">
          <div className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <FolderTree className="size-4" />
          </div>
          <span className="font-semibold text-base">{t("dialog.createTitle")}</span>
        </div>
      }
      description={t("dialog.createDescription")}
    >
      <DynamicForm<CategoryFormValues>
        form={form}
        fields={fields}
        onSubmit={onSubmit}
        submitLabel={t("newCategory")}
        columns={2}
        secondaryAction={
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="cursor-pointer"
          >
            Cancel
          </Button>
        }
      />
    </AppDialog>
  )
}

interface EditCategoryDialogProps {
  category: ProductCategory | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpdate: (id: string, updates: Partial<ProductCategory>) => void
}

export function EditCategoryDialog({
  category,
  open,
  onOpenChange,
  onUpdate,
}: EditCategoryDialogProps) {
  const t = useTranslations("ecommerce.categories")

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    values: category
      ? {
          name: category.name,
          slug: category.slug,
          description: category.description,
          image: category.image || null,
          status: category.status,
        }
      : undefined,
  })

  const fields = React.useMemo(() => getCategoryFormFields(t), [t])

  if (!category) return null

  const onSubmit = (data: CategoryFormValues) => {
    onUpdate(category.id, {
      name: data.name.trim(),
      slug: data.slug.trim(),
      description: data.description || "",
      image: data.image || undefined,
      status: data.status,
    })
    onOpenChange(false)
  }

  return (
    <AppDialog
      open={open}
      onOpenChange={onOpenChange}
      size="xl"
      title={
        <div className="flex items-center gap-2">
          <div className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Edit className="size-4" />
          </div>
          <span className="font-semibold text-base">{t("dialog.editTitle")}</span>
        </div>
      }
      description={t("dialog.editDescription")}
    >
      <DynamicForm<CategoryFormValues>
        form={form}
        fields={fields}
        onSubmit={onSubmit}
        submitLabel="Save Changes"
        columns={2}
        secondaryAction={
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="cursor-pointer"
          >
            Cancel
          </Button>
        }
      />
    </AppDialog>
  )
}

interface ViewCategorySheetProps {
  category: ProductCategory | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onEdit?: (category: ProductCategory) => void
  onDelete?: (id: string) => void
}

export function ViewCategorySheet({
  category,
  open,
  onOpenChange,
  onEdit,
  onDelete,
}: ViewCategorySheetProps) {
  const t = useTranslations("ecommerce.categories")

  if (!category) return null

  return (
    <AppSheet
      open={open}
      onOpenChange={onOpenChange}
      size="md"
      title={
        <div className="flex items-center gap-2">
          <div className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <FolderTree className="size-4" />
          </div>
          <span className="font-semibold text-base truncate">{category.name}</span>
        </div>
      }
      description={`Slug: /category/${category.slug} • ${category.productCount} products`}
    >
      <div className="space-y-5 pt-4">
        {category.image && (
          <div className="relative aspect-video w-full overflow-hidden rounded-xl border bg-muted/20">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={category.image}
              alt={category.name}
              className="size-full object-cover"
            />
          </div>
        )}

        <div className="flex items-center justify-between p-3.5 rounded-xl border bg-card/60">
          <div>
            <span className="text-xs text-muted-foreground block mb-0.5">Status</span>
            <StatusBadge
              variant={category.status === "active" ? "success" : "neutral"}
              size="sm"
            >
              {t(`statuses.${category.status}`)}
            </StatusBadge>
          </div>

          <div className="text-right">
            <span className="text-xs text-muted-foreground block mb-0.5">Catalog Size</span>
            <span className="font-semibold text-sm font-mono">
              {category.productCount} Products
            </span>
          </div>
        </div>

        <div className="space-y-1.5">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Description
          </span>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {category.description || "No description provided."}
          </p>
        </div>

        <div className="flex items-center justify-end gap-2 pt-4 border-t">
          {onDelete && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                if (confirm(t("dialog.deleteConfirm"))) {
                  onDelete(category.id)
                  onOpenChange(false)
                }
              }}
              className="text-destructive hover:bg-destructive/10 cursor-pointer"
            >
              <Trash2 className="size-3.5 mr-1" />
              <span>Delete</span>
            </Button>
          )}

          {onEdit && (
            <Button
              type="button"
              size="sm"
              onClick={() => {
                onOpenChange(false)
                onEdit(category)
              }}
              className="cursor-pointer gap-1.5"
            >
              <Edit className="size-3.5" />
              <span>Edit Category</span>
            </Button>
          )}
        </div>
      </div>
    </AppSheet>
  )
}
