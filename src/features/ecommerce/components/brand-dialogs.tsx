"use client"

import * as React from "react"
import { useTranslations } from "next-intl"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Tag, Edit, Trash2, Globe, ExternalLink } from "lucide-react"

import { Button } from "@/components/ui/button"
import { AppDialog } from "@/components/app-dialog"
import { AppSheet } from "@/components/app-sheet"
import { Badge } from "@/components/ui/badge"
import { DynamicForm } from "@/components/forms"
import type { FormFieldsConfig } from "@/types/form"
import type { Brand } from "@/data/ecommerce"

const brandFormSchema = z.object({
  name: z.string().min(1, "Brand name is required"),
  slug: z.string().min(1, "Slug is required"),
  website: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  description: z.string().optional(),
  logo: z.string().nullable().optional(),
  featured: z.boolean(),
})

type BrandFormValues = z.infer<typeof brandFormSchema>

function getBrandFormFields(
  t: (key: string) => string
): FormFieldsConfig<BrandFormValues> {
  return [
    {
      name: "name",
      type: "text",
      label: t("fields.name"),
      placeholder: "e.g. Sony",
      required: true,
      colSpan: 1,
    },
    {
      name: "slug",
      type: "text",
      label: t("fields.slug"),
      placeholder: "e.g. sony",
      required: true,
      colSpan: 1,
    },
    {
      name: "website",
      type: "text",
      label: t("fields.website"),
      placeholder: "https://example.com",
      colSpan: 2,
    },
    {
      name: "logo",
      type: "upload",
      label: t("fields.logo"),
      placeholder: "Upload brand logo icon",
      allowedTypes: ["image"],
      colSpan: 2,
    },
    {
      name: "description",
      type: "textarea",
      label: t("fields.description"),
      placeholder: "Manufacturer overview, origin, and product domain...",
      rows: 3,
      colSpan: 2,
    },
    {
      name: "featured",
      type: "switch",
      label: t("fields.featured"),
      description: "Display this brand prominently in store homepage and filters",
      colSpan: 2,
    },
  ]
}

interface CreateBrandDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreate: (brand: Omit<Brand, "id">) => void
}

export function CreateBrandDialog({
  open,
  onOpenChange,
  onCreate,
}: CreateBrandDialogProps) {
  const t = useTranslations("ecommerce.brands")

  const form = useForm<BrandFormValues>({
    resolver: zodResolver(brandFormSchema),
    defaultValues: {
      name: "",
      slug: "",
      website: "",
      description: "",
      logo: null,
      featured: false,
    },
  })

  const fields = React.useMemo(() => getBrandFormFields(t), [t])

  const onSubmit = (data: BrandFormValues) => {
    onCreate({
      name: data.name.trim(),
      slug: (data.slug || data.name).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
      website: data.website || undefined,
      description: data.description || "",
      logo: data.logo || undefined,
      productCount: 0,
      featured: Boolean(data.featured),
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
            <Tag className="size-4" />
          </div>
          <span className="font-semibold text-base">{t("dialog.createTitle")}</span>
        </div>
      }
      description={t("dialog.createDescription")}
    >
      <DynamicForm<BrandFormValues>
        form={form}
        fields={fields}
        onSubmit={onSubmit}
        submitLabel={t("newBrand")}
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

interface EditBrandDialogProps {
  brand: Brand | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpdate: (id: string, updates: Partial<Brand>) => void
}

export function EditBrandDialog({
  brand,
  open,
  onOpenChange,
  onUpdate,
}: EditBrandDialogProps) {
  const t = useTranslations("ecommerce.brands")

  const form = useForm<BrandFormValues>({
    resolver: zodResolver(brandFormSchema),
    values: brand
      ? {
          name: brand.name,
          slug: brand.slug,
          website: brand.website || "",
          description: brand.description || "",
          logo: brand.logo || null,
          featured: Boolean(brand.featured),
        }
      : undefined,
  })

  const fields = React.useMemo(() => getBrandFormFields(t), [t])

  if (!brand) return null

  const onSubmit = (data: BrandFormValues) => {
    onUpdate(brand.id, {
      name: data.name.trim(),
      slug: data.slug.trim(),
      website: data.website || undefined,
      description: data.description || "",
      logo: data.logo || undefined,
      featured: Boolean(data.featured),
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
      <DynamicForm<BrandFormValues>
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

interface ViewBrandSheetProps {
  brand: Brand | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onEdit?: (brand: Brand) => void
  onDelete?: (id: string) => void
}

export function ViewBrandSheet({
  brand,
  open,
  onOpenChange,
  onEdit,
  onDelete,
}: ViewBrandSheetProps) {
  const t = useTranslations("ecommerce.brands")

  if (!brand) return null

  return (
    <AppSheet
      open={open}
      onOpenChange={onOpenChange}
      size="md"
      title={
        <div className="flex items-center gap-2">
          <div className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Tag className="size-4" />
          </div>
          <span className="font-semibold text-base truncate">{brand.name}</span>
        </div>
      }
      description={`Slug: #${brand.slug} • ${brand.productCount} products`}
    >
      <div className="space-y-5 pt-4">
        {brand.logo && (
          <div className="relative aspect-video w-full overflow-hidden rounded-xl border bg-muted/20 flex items-center justify-center p-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={brand.logo}
              alt={brand.name}
              className="max-h-24 max-w-full object-contain"
            />
          </div>
        )}

        <div className="flex items-center justify-between p-3.5 rounded-xl border bg-card/60">
          <div>
            <span className="text-xs text-muted-foreground block mb-0.5">Tier</span>
            {brand.featured ? (
              <Badge variant="default" className="text-xs">
                Featured Brand
              </Badge>
            ) : (
              <Badge variant="secondary" className="text-xs">
                Standard
              </Badge>
            )}
          </div>

          <div className="text-right">
            <span className="text-xs text-muted-foreground block mb-0.5">Products</span>
            <span className="font-semibold text-sm font-mono">
              {brand.productCount} items
            </span>
          </div>
        </div>

        {brand.website && (
          <div className="space-y-1">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Website
            </span>
            <a
              href={brand.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs text-primary hover:underline"
            >
              <Globe className="size-3.5" />
              <span>{brand.website}</span>
              <ExternalLink className="size-3" />
            </a>
          </div>
        )}

        <div className="space-y-1.5">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Description
          </span>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {brand.description || "No description provided."}
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
                  onDelete(brand.id)
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
                onEdit(brand)
              }}
              className="cursor-pointer gap-1.5"
            >
              <Edit className="size-3.5" />
              <span>Edit Brand</span>
            </Button>
          )}
        </div>
      </div>
    </AppSheet>
  )
}
