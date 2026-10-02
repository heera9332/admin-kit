"use client"

import * as React from "react"
import { useTranslations } from "next-intl"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import {
  Package,
  Edit,
  Trash2,
  Tag,
  FolderTree,
  Boxes,
  Star,
  ExternalLink,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { AppDialog } from "@/components/app-dialog"
import { AppSheet } from "@/components/app-sheet"
import { Badge } from "@/components/ui/badge"
import { StatusBadge } from "@/components/status-badge"
import { DynamicForm } from "@/components/forms"
import type { FormFieldsConfig } from "@/types/form"
import type { Product, ProductCategory, Brand } from "@/data/ecommerce"

const productFormSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  sku: z.string().min(1, "SKU is required"),
  price: z.number().min(0, "Price must be positive"),
  compareAtPrice: z.number().min(0).optional(),
  stock: z.number().min(0, "Stock cannot be negative"),
  category: z.string().min(1, "Category is required"),
  brand: z.string().min(1, "Brand is required"),
  status: z.enum(["published", "draft", "out_of_stock", "archived"] as const),
  image: z.string().nullable().optional(),
  description: z.string().optional(),
})

type ProductFormValues = z.infer<typeof productFormSchema>

function getProductFormFields(
  t: (key: string) => string,
  categories: ProductCategory[],
  brands: Brand[]
): FormFieldsConfig<ProductFormValues> {
  return [
    {
      name: "name",
      type: "text",
      label: t("fields.name"),
      placeholder: "e.g. Wireless Noise-Canceling Headphones",
      required: true,
      colSpan: 2,
    },
    {
      name: "sku",
      type: "text",
      label: t("fields.sku"),
      placeholder: "e.g. AUD-WH-001",
      required: true,
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
        { value: "out_of_stock", label: t("statuses.out_of_stock") },
        { value: "archived", label: t("statuses.archived") },
      ],
    },
    {
      name: "price",
      type: "number",
      label: t("fields.price"),
      placeholder: "0.00",
      step: 0.01,
      required: true,
      colSpan: 1,
    },
    {
      name: "compareAtPrice",
      type: "number",
      label: t("fields.compareAtPrice"),
      placeholder: "0.00",
      step: 0.01,
      colSpan: 1,
    },
    {
      name: "stock",
      type: "number",
      label: t("fields.stock"),
      placeholder: "0",
      step: 1,
      required: true,
      colSpan: 1,
    },
    {
      name: "category",
      type: "select",
      label: t("fields.category"),
      required: true,
      colSpan: 1,
      options: categories.map((c) => ({ value: c.name, label: c.name })),
    },
    {
      name: "brand",
      type: "select",
      label: t("fields.brand"),
      required: true,
      colSpan: 2,
      options: brands.map((b) => ({ value: b.name, label: b.name })),
    },
    {
      name: "image",
      type: "upload",
      label: t("fields.image"),
      placeholder: "Choose or upload product image",
      allowedTypes: ["image"],
      colSpan: 2,
    },
    {
      name: "description",
      type: "richtext",
      label: t("fields.description"),
      placeholder: "Detailed product specifications, materials, and benefits...",
      minHeight: "min-h-[160px]",
      colSpan: 2,
    },
  ]
}

interface CreateProductDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  categories: ProductCategory[]
  brands: Brand[]
  onCreate: (product: Omit<Product, "id" | "createdAt" | "updatedAt">) => void
  onOpenFullCreate?: () => void
}

export function CreateProductDialog({
  open,
  onOpenChange,
  categories,
  brands,
  onCreate,
  onOpenFullCreate,
}: CreateProductDialogProps) {
  const t = useTranslations("ecommerce.products")

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: "",
      sku: "",
      price: 0,
      compareAtPrice: undefined,
      stock: 10,
      category: categories[0]?.name || "Electronics",
      brand: brands[0]?.name || "General",
      status: "published",
      image: null,
      description: "",
    },
  })

  const fields = React.useMemo(
    () => getProductFormFields(t, categories, brands),
    [t, categories, brands]
  )

  const onSubmit = (data: ProductFormValues) => {
    onCreate({
      name: data.name.trim(),
      slug: data.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
      sku: data.sku.trim(),
      price: Number(data.price),
      compareAtPrice: data.compareAtPrice ? Number(data.compareAtPrice) : undefined,
      stock: Number(data.stock),
      category: data.category,
      brand: data.brand,
      status: data.status,
      image: data.image || undefined,
      description: data.description || "",
      rating: 5.0,
      reviewsCount: 0,
    })
    form.reset()
    onOpenChange(false)
  }

  return (
    <AppDialog
      open={open}
      onOpenChange={onOpenChange}
      size="3xl"
      scrollable
      title={
        <div className="flex items-center gap-2">
          <div className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Package className="size-4" />
          </div>
          <span className="font-semibold text-base">{t("dialog.createTitle")}</span>
        </div>
      }
      description={t("dialog.createDescription")}
    >
      <DynamicForm<ProductFormValues>
        form={form}
        fields={fields}
        onSubmit={onSubmit}
        submitLabel={t("newProduct")}
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
              Cancel
            </Button>
          </div>
        }
      />
    </AppDialog>
  )
}

export interface QuickEditProductDialogProps {
  product: Product | null
  open: boolean
  onOpenChange: (open: boolean) => void
  categories: ProductCategory[]
  brands: Brand[]
  onUpdate: (id: string, updates: Partial<Product>) => void
  onFullEdit?: (product: Product) => void
}

export type EditProductDialogProps = QuickEditProductDialogProps

export function EditProductDialog({
  product,
  open,
  onOpenChange,
  categories,
  brands,
  onUpdate,
  onFullEdit,
}: EditProductDialogProps) {
  const t = useTranslations("ecommerce.products")

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    values: product
      ? {
          name: product.name,
          sku: product.sku,
          price: product.price,
          compareAtPrice: product.compareAtPrice,
          stock: product.stock,
          category: product.category,
          brand: product.brand,
          status: product.status,
          image: product.image || null,
          description: product.description || "",
        }
      : undefined,
  })

  const fields = React.useMemo(
    () => getProductFormFields(t, categories, brands),
    [t, categories, brands]
  )

  if (!product) return null

  const onSubmit = (data: ProductFormValues) => {
    onUpdate(product.id, {
      name: data.name.trim(),
      sku: data.sku.trim(),
      price: Number(data.price),
      compareAtPrice: data.compareAtPrice ? Number(data.compareAtPrice) : undefined,
      stock: Number(data.stock),
      category: data.category,
      brand: data.brand,
      status: data.status,
      image: data.image || undefined,
      description: data.description || "",
    })
    onOpenChange(false)
  }

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
          <span className="font-semibold text-base">{t("dialog.quickEditTitle")}</span>
        </div>
      }
      description={t("dialog.quickEditDescription")}
    >
      <DynamicForm<ProductFormValues>
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
                  onOpenChange(false)
                  onFullEdit(product)
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
              Cancel
            </Button>
          </div>
        }
      />
    </AppDialog>
  )
}

export const QuickEditProductDialog = EditProductDialog

export interface ViewProductSheetProps {
  product: Product | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onEdit?: (product: Product) => void
  onQuickEdit?: (product: Product) => void
  onFullEdit?: (product: Product) => void
  onDelete?: (product: Product) => void
}

export function ViewProductSheet({
  product,
  open,
  onOpenChange,
  onEdit,
  onQuickEdit,
  onFullEdit,
  onDelete,
}: ViewProductSheetProps) {
  const t = useTranslations("ecommerce.products")

  if (!product) return null

  return (
    <AppSheet
      open={open}
      onOpenChange={onOpenChange}
      size="lg"
      title={
        <div className="flex items-center gap-2">
          <div className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Package className="size-4" />
          </div>
          <span className="font-semibold text-base truncate">{product.name}</span>
        </div>
      }
      description={`SKU: ${product.sku} • Created on ${product.createdAt}`}
    >
      <div className="space-y-6 pt-4">
        {/* Product Image */}
        {product.image && (
          <div className="relative aspect-video w-full overflow-hidden rounded-xl border bg-muted/20">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={product.image}
              alt={product.name}
              className="size-full object-cover"
            />
          </div>
        )}

        {/* Pricing & Stock Card */}
        <div className="grid grid-cols-2 gap-3 p-4 rounded-xl border bg-card/60">
          <div>
            <span className="text-xs text-muted-foreground block mb-1">Pricing</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-foreground">
                ${product.price.toFixed(2)}
              </span>
              {product.compareAtPrice && (
                <span className="text-sm text-muted-foreground line-through">
                  ${product.compareAtPrice.toFixed(2)}
                </span>
              )}
            </div>
          </div>

          <div>
            <span className="text-xs text-muted-foreground block mb-1">Inventory</span>
            <div className="flex items-center gap-2">
              <Boxes className="size-4 text-muted-foreground" />
              <span className="text-lg font-semibold">{product.stock} units</span>
              <StatusBadge
                variant={
                  product.stock > 10
                    ? "success"
                    : product.stock > 0
                      ? "warning"
                      : "destructive"
                }
                size="sm"
              >
                {product.stock > 10
                  ? "In Stock"
                  : product.stock > 0
                    ? "Low Stock"
                    : "Out of Stock"}
              </StatusBadge>
            </div>
          </div>
        </div>

        {/* Meta badges */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <Badge variant="outline" className="gap-1 px-2 py-1">
            <FolderTree className="size-3 text-muted-foreground" />
            <span>{product.category}</span>
          </Badge>

          <Badge variant="outline" className="gap-1 px-2 py-1">
            <Tag className="size-3 text-muted-foreground" />
            <span>{product.brand}</span>
          </Badge>

          <Badge variant="secondary" className="gap-1 px-2 py-1">
            <Star className="size-3 text-amber-500 fill-amber-500" />
            <span>{product.rating} ({product.reviewsCount} reviews)</span>
          </Badge>

          <StatusBadge
            variant={
              product.status === "published"
                ? "success"
                : product.status === "draft"
                  ? "neutral"
                  : product.status === "out_of_stock"
                    ? "destructive"
                    : "warning"
            }
          >
            {t(`statuses.${product.status}`)}
          </StatusBadge>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Description
          </span>
          <div
            className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground text-xs leading-relaxed"
            dangerouslySetInnerHTML={{ __html: product.description || "<p>No description provided.</p>" }}
          />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between w-full gap-2 pt-4 border-t">
          {onDelete ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                onOpenChange(false)
                onDelete(product)
              }}
              className="text-destructive hover:bg-destructive/10 cursor-pointer text-xs"
            >
              <Trash2 className="size-3.5 mr-1" />
              <span>Delete</span>
            </Button>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-2">
            {(onQuickEdit || onEdit) && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  onOpenChange(false)
                  if (onQuickEdit) {
                    onQuickEdit(product)
                  } else {
                    onEdit?.(product)
                  }
                }}
                className="cursor-pointer gap-1.5 text-xs"
              >
                <Edit className="size-3.5" />
                <span>{t("actions.quickEdit")}</span>
              </Button>
            )}
            {onFullEdit && (
              <Button
                type="button"
                size="sm"
                onClick={() => {
                  onOpenChange(false)
                  onFullEdit(product)
                }}
                className="cursor-pointer gap-1.5 text-xs"
              >
                <ExternalLink className="size-3.5" />
                <span>{t("actions.fullEdit")}</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </AppSheet>
  )
}
