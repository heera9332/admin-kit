"use client"

import * as React from "react"
import { useTranslations } from "next-intl"
import {
  ArrowLeft,
  Save,
  Eye,
  Globe,
  Tag,
  Clock,
  Copy,
  Check,
  Trash2,
  Sparkles,
  Package,
  Plus,
  Boxes,
  DollarSign,
  Barcode,
  TrendingUp,
  FolderTree,
  Star,
} from "lucide-react"

import { Button, buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { StatusBadge } from "@/components/status-badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { AppSheet } from "@/components/app-sheet"
import { MediaPickerInput } from "@/components/media/media-picker-input"
import { TiptapEditor } from "@/components/forms/tiptap-editor"
import { useEcommerce } from "@/context/ecommerce-provider"
import { useRouter, Link } from "@/i18n/routing"
import { toast } from "@/components/ui/toast"
import { cn } from "@/lib/utils"
import type { Product, ProductStatus } from "@/data/ecommerce"
import type { MediaItem } from "@/data/media"

interface ProductEditFeatureProps {
  productId: string
}

interface ProductEditFormProps {
  productId: string
  initialProduct: Product | null | undefined
  isNew: boolean
}

function ProductEditForm({ initialProduct, isNew }: ProductEditFormProps) {
  const t = useTranslations("ecommerce.products")
  const tCommon = useTranslations("common")
  const router = useRouter()
  const { categories, brands, updateProduct, addProduct, deleteProduct } =
    useEcommerce()

  // Form State initialized directly from initialProduct
  const [name, setName] = React.useState(initialProduct?.name || "")
  const [slug, setSlug] = React.useState(initialProduct?.slug || "")
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = React.useState(
    Boolean(initialProduct?.slug)
  )
  const [shortDescription, setShortDescription] = React.useState(
    initialProduct?.shortDescription || ""
  )
  const [description, setDescription] = React.useState(
    initialProduct?.description || ""
  )
  const [sku, setSku] = React.useState(initialProduct?.sku || "")
  const [price, setPrice] = React.useState<string>(
    initialProduct ? String(initialProduct.price) : "0"
  )
  const [compareAtPrice, setCompareAtPrice] = React.useState<string>(
    initialProduct?.compareAtPrice ? String(initialProduct.compareAtPrice) : ""
  )
  const [costPrice, setCostPrice] = React.useState<string>(
    initialProduct?.costPrice ? String(initialProduct.costPrice) : ""
  )
  const [stock, setStock] = React.useState<string>(
    initialProduct ? String(initialProduct.stock) : "10"
  )
  const [lowStockThreshold, setLowStockThreshold] = React.useState<string>(
    initialProduct?.lowStockThreshold ? String(initialProduct.lowStockThreshold) : "5"
  )
  const [status, setStatus] = React.useState<ProductStatus>(
    initialProduct?.status || "published"
  )
  const [category, setCategory] = React.useState(
    initialProduct?.category || categories[0]?.name || "Electronics"
  )
  const [brand, setBrand] = React.useState(
    initialProduct?.brand || brands[0]?.name || "General"
  )
  const [image, setImage] = React.useState<string | null>(
    initialProduct?.image || null
  )
  const [metaTitle, setMetaTitle] = React.useState(
    initialProduct?.metaTitle || initialProduct?.name || ""
  )
  const [metaDescription, setMetaDescription] = React.useState(
    initialProduct?.metaDescription || ""
  )

  // UI state
  const [isSaving, setIsSaving] = React.useState(false)
  const [previewOpen, setPreviewOpen] = React.useState(false)
  const [copiedSlug, setCopiedSlug] = React.useState(false)

  // Auto-generate slug and metaTitle from name if not manually edited
  const handleNameChange = (val: string) => {
    setName(val)
    if (!isSlugManuallyEdited) {
      const generatedSlug = val
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "")
      setSlug(generatedSlug)
    }
    if (!metaTitle || metaTitle === name) {
      setMetaTitle(val)
    }
  }

  // Description metrics
  const metrics = React.useMemo(() => {
    const text = description.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim()
    const wordCount = text ? text.split(/\s+/).length : 0
    const charCount = text.length
    const readingTime = Math.max(1, Math.ceil(wordCount / 200))
    return { wordCount, charCount, readingTime }
  }, [description])

  // Profit margin calculation
  const marginMetrics = React.useMemo(() => {
    const numPrice = parseFloat(price) || 0
    const numCost = parseFloat(costPrice) || 0
    if (numPrice > 0 && numCost > 0) {
      const profit = numPrice - numCost
      const margin = Math.round((profit / numPrice) * 100)
      return { profit, margin }
    }
    return null
  }, [price, costPrice])

  const copySlugToClipboard = () => {
    if (!slug) return
    navigator.clipboard.writeText(`https://example.com/products/${slug}`)
    setCopiedSlug(true)
    setTimeout(() => setCopiedSlug(false), 2000)
  }

  const handleMediaChange = (item: MediaItem | null) => {
    setImage(item?.url || null)
  }

  const handleSave = () => {
    if (!name.trim()) {
      toast.add({
        title: "Product name is required",
        description: "Please enter a valid title for this product.",
      })
      return
    }

    if (!sku.trim()) {
      toast.add({
        title: "SKU is required",
        description: "Please provide a SKU for inventory tracking.",
      })
      return
    }

    const numPrice = parseFloat(price)
    if (isNaN(numPrice) || numPrice < 0) {
      toast.add({
        title: "Invalid price",
        description: "Please enter a valid positive price.",
      })
      return
    }

    setIsSaving(true)

    const finalSlug =
      slug.trim() ||
      name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "") ||
      `product-${Date.now()}`

    const parsedCompare = compareAtPrice ? parseFloat(compareAtPrice) : undefined
    const parsedCost = costPrice ? parseFloat(costPrice) : undefined
    const parsedStock = parseInt(stock, 10) || 0
    const parsedThreshold = lowStockThreshold ? parseInt(lowStockThreshold, 10) : 5

    try {
      if (isNew) {
        const created = addProduct({
          name: name.trim(),
          slug: finalSlug,
          shortDescription: shortDescription.trim(),
          description,
          sku: sku.trim(),
          price: numPrice,
          compareAtPrice: parsedCompare,
          costPrice: parsedCost,
          stock: parsedStock,
          lowStockThreshold: parsedThreshold,
          status,
          category,
          brand,
          image: image || undefined,
          rating: 5.0,
          reviewsCount: 0,
          metaTitle: metaTitle.trim() || name.trim(),
          metaDescription: metaDescription.trim(),
        })

        toast.add({
          title: t("editor.productCreatedSuccess"),
          description: `"${created.name}" has been published to catalog.`,
        })

        router.push(`/dashboard/ecommerce/products/${created.id}`)
      } else if (initialProduct) {
        updateProduct(initialProduct.id, {
          name: name.trim(),
          slug: finalSlug,
          shortDescription: shortDescription.trim(),
          description,
          sku: sku.trim(),
          price: numPrice,
          compareAtPrice: parsedCompare,
          costPrice: parsedCost,
          stock: parsedStock,
          lowStockThreshold: parsedThreshold,
          status,
          category,
          brand,
          image: image || undefined,
          metaTitle: metaTitle.trim() || name.trim(),
          metaDescription: metaDescription.trim(),
        })

        toast.add({
          title: t("editor.productSavedSuccess"),
          description: `Updated "${name.trim()}" successfully.`,
        })
      }
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = () => {
    if (!initialProduct) return
    if (confirm(t("dialog.deleteConfirm"))) {
      deleteProduct(initialProduct.id)
      toast.add({
        title: t("editor.productDeletedSuccess"),
        description: `"${initialProduct.name}" has been deleted.`,
      })
      router.push("/dashboard/ecommerce/products")
    }
  }

  return (
    <div className="space-y-4">
      {/* Top action header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/ecommerce/products"
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "h-8 gap-1.5 text-xs cursor-pointer shadow-xs"
            )}
          >
            <ArrowLeft className="size-3.5" />
            <span>{t("editor.backToProducts")}</span>
          </Link>

          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
              {isNew ? t("editor.createTitle") : t("editor.editTitle")}
            </h1>
            <StatusBadge
              variant={
                status === "published"
                  ? "success"
                  : status === "draft"
                    ? "neutral"
                    : status === "out_of_stock"
                      ? "destructive"
                      : "warning"
              }
              size="sm"
            >
              {t(`statuses.${status}`)}
            </StatusBadge>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!isNew && initialProduct && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleDelete}
              className="h-8 gap-1.5 text-xs text-destructive hover:bg-destructive/10 cursor-pointer"
            >
              <Trash2 className="size-3.5" />
              <span className="hidden sm:inline">{tCommon("delete")}</span>
            </Button>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={() => setPreviewOpen(true)}
            className="h-8 gap-1.5 text-xs cursor-pointer"
          >
            <Eye className="size-3.5" />
            <span>{t("editor.preview")}</span>
          </Button>

          <Button
            size="sm"
            onClick={handleSave}
            disabled={isSaving || !name.trim()}
            className="h-8 gap-1.5 text-xs cursor-pointer shadow-xs"
          >
            <Save className="size-3.5" />
            <span>
              {isSaving
                ? "Saving..."
                : isNew
                  ? t("editor.publishProduct")
                  : t("editor.saveProduct")}
            </span>
          </Button>
        </div>
      </div>

      {/* Main Grid: Content (col-span-8) + Sidebar (col-span-4) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ================= MAIN COLUMN (Name + TipTap Description + Pricing/Inventory) ================= */}
        <div className="lg:col-span-8 space-y-5">
          {/* 1. General Product Information Card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Package className="size-4 text-primary" />
                <span>General Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Product Name */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="product-name" className="text-xs font-semibold">
                    {t("editor.nameLabel")} <span className="text-destructive">*</span>
                  </Label>
                  <span className="text-[11px] text-muted-foreground font-mono">
                    {name.length} chars
                  </span>
                </div>
                <Input
                  id="product-name"
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder={t("editor.namePlaceholder")}
                  className="text-base sm:text-lg font-semibold h-11"
                  required
                />
              </div>

              {/* Short Description */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label
                    htmlFor="product-short-description"
                    className="text-xs font-semibold"
                  >
                    {t("editor.shortDescriptionLabel")}
                  </Label>
                  <span className="text-[11px] text-muted-foreground font-mono">
                    {shortDescription.length} chars
                  </span>
                </div>
                <Textarea
                  id="product-short-description"
                  name="shortDescription"
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                  placeholder={t("editor.shortDescriptionPlaceholder")}
                  rows={3}
                  className="text-sm resize-none"
                />
              </div>

              {/* Rich Text Product Description */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-semibold">
                    {t("editor.descriptionLabel")}
                  </Label>
                </div>

                <TiptapEditor
                  value={description}
                  onChange={setDescription}
                  placeholder={t("editor.descriptionPlaceholder")}
                  minHeight="min-h-[300px]"
                />
              </div>

              {/* Description Content Metrics Bar */}
              <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground pt-1">
                <div className="flex items-center gap-1.5">
                  <Clock className="size-3.5 text-primary" />
                  <span>
                    {metrics.readingTime} min {t("editor.readingTime")}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="font-mono font-medium text-foreground">
                    {metrics.wordCount}
                  </span>
                  <span>{t("editor.wordCount")}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="font-mono font-medium text-foreground">
                    {metrics.charCount}
                  </span>
                  <span>Characters</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 2. Pricing & Inventory Card */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <DollarSign className="size-4 text-primary" />
                    <span>{t("editor.pricingInventoryTitle")}</span>
                  </CardTitle>
                  <CardDescription className="text-xs mt-0.5">
                    {t("editor.pricingDesc")}
                  </CardDescription>
                </div>
                {marginMetrics && (
                  <Badge variant="secondary" className="gap-1 font-mono text-[11px]">
                    <TrendingUp className="size-3 text-emerald-500" />
                    <span>Margin: {marginMetrics.margin}%</span>
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Selling Price */}
                <div className="space-y-1.5">
                  <Label htmlFor="product-price" className="text-xs font-medium">
                    {t("editor.priceLabel")} <span className="text-destructive">*</span>
                  </Label>
                  <div className="relative">
                    <span className="absolute left-2.5 top-2 text-xs text-muted-foreground font-mono">
                      $
                    </span>
                    <Input
                      id="product-price"
                      type="number"
                      step="0.01"
                      min="0"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="0.00"
                      className="pl-6 h-8 text-xs font-mono"
                      required
                    />
                  </div>
                </div>

                {/* Compare At Price */}
                <div className="space-y-1.5">
                  <Label htmlFor="product-compare-price" className="text-xs font-medium">
                    {t("editor.compareAtPriceLabel")}
                  </Label>
                  <div className="relative">
                    <span className="absolute left-2.5 top-2 text-xs text-muted-foreground font-mono">
                      $
                    </span>
                    <Input
                      id="product-compare-price"
                      type="number"
                      step="0.01"
                      min="0"
                      value={compareAtPrice}
                      onChange={(e) => setCompareAtPrice(e.target.value)}
                      placeholder="0.00"
                      className="pl-6 h-8 text-xs font-mono"
                    />
                  </div>
                </div>

                {/* Cost Price */}
                <div className="space-y-1.5">
                  <Label htmlFor="product-cost-price" className="text-xs font-medium">
                    {t("editor.costPriceLabel")}
                  </Label>
                  <div className="relative">
                    <span className="absolute left-2.5 top-2 text-xs text-muted-foreground font-mono">
                      $
                    </span>
                    <Input
                      id="product-cost-price"
                      type="number"
                      step="0.01"
                      min="0"
                      value={costPrice}
                      onChange={(e) => setCostPrice(e.target.value)}
                      placeholder="0.00"
                      className="pl-6 h-8 text-xs font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="border-t pt-3 grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* SKU */}
                <div className="space-y-1.5">
                  <Label htmlFor="product-sku" className="text-xs font-medium flex items-center gap-1.5">
                    <Barcode className="size-3.5 text-muted-foreground" />
                    <span>{t("editor.skuLabel")}</span>
                    <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="product-sku"
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    placeholder="e.g. WH-1000XM4"
                    className="h-8 text-xs font-mono"
                    required
                  />
                </div>

                {/* Stock Quantity */}
                <div className="space-y-1.5">
                  <Label htmlFor="product-stock" className="text-xs font-medium flex items-center gap-1.5">
                    <Boxes className="size-3.5 text-muted-foreground" />
                    <span>{t("editor.stockLabel")}</span>
                  </Label>
                  <Input
                    id="product-stock"
                    type="number"
                    min="0"
                    step="1"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    placeholder="0"
                    className="h-8 text-xs font-mono"
                  />
                </div>

                {/* Low Stock Alert Threshold */}
                <div className="space-y-1.5">
                  <Label htmlFor="product-threshold" className="text-xs font-medium">
                    {t("editor.lowStockThresholdLabel")}
                  </Label>
                  <Input
                    id="product-threshold"
                    type="number"
                    min="0"
                    step="1"
                    value={lowStockThreshold}
                    onChange={(e) => setLowStockThreshold(e.target.value)}
                    placeholder="5"
                    className="h-8 text-xs font-mono"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ================= SIDEBAR ================= */}
        <div className="lg:col-span-4 space-y-5">
          {/* 1. Status & Organization Card */}
          <Card className="shadow-xs">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Sparkles className="size-4 text-primary" />
                <span>{t("editor.sidebarTitle")}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Status */}
              <div className="space-y-1.5">
                <Label htmlFor="product-status" className="text-xs font-medium">
                  {t("editor.statusLabel")}
                </Label>
                <Select
                  value={status}
                  onValueChange={(val) => {
                    if (val) setStatus(val as ProductStatus)
                  }}
                >
                  <SelectTrigger id="product-status" className="h-8 text-xs w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="published">
                      <div className="flex items-center gap-2">
                        <span className="size-2 rounded-full bg-emerald-500" />
                        <span>{t("statuses.published")}</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="draft">
                      <div className="flex items-center gap-2">
                        <span className="size-2 rounded-full bg-amber-500" />
                        <span>{t("statuses.draft")}</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="out_of_stock">
                      <div className="flex items-center gap-2">
                        <span className="size-2 rounded-full bg-rose-500" />
                        <span>{t("statuses.out_of_stock")}</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="archived">
                      <div className="flex items-center gap-2">
                        <span className="size-2 rounded-full bg-muted-foreground" />
                        <span>{t("statuses.archived")}</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* URL Slug */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="product-slug" className="text-xs font-medium">
                    {t("editor.slugLabel")}
                  </Label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={copySlugToClipboard}
                    className="size-6 text-muted-foreground hover:text-foreground cursor-pointer"
                    title="Copy product link"
                  >
                    {copiedSlug ? (
                      <Check className="size-3 text-emerald-500" />
                    ) : (
                      <Copy className="size-3" />
                    )}
                  </Button>
                </div>
                <div className="flex rounded-lg border bg-muted/20 focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/20 overflow-hidden">
                  <span className="px-2.5 py-1.5 text-xs text-muted-foreground font-mono select-none bg-muted/40 border-r flex items-center">
                    /products/
                  </span>
                  <input
                    id="product-slug"
                    value={slug}
                    onChange={(e) => {
                      setIsSlugManuallyEdited(true)
                      setSlug(
                        e.target.value
                          .toLowerCase()
                          .replace(/[^a-z0-9-_]/g, "")
                      )
                    }}
                    placeholder={t("editor.slugPlaceholder")}
                    className="flex-1 px-2.5 py-1.5 text-xs font-mono bg-transparent outline-none text-foreground placeholder:text-muted-foreground"
                  />
                </div>
              </div>

              {/* Category */}
              <div className="space-y-1.5">
                <Label htmlFor="product-category" className="text-xs font-medium flex items-center gap-1.5">
                  <FolderTree className="size-3.5 text-muted-foreground" />
                  <span>{t("editor.categoryLabel")}</span>
                </Label>
                <Select
                  value={category}
                  onValueChange={(val) => {
                    if (val) setCategory(val)
                  }}
                >
                  <SelectTrigger id="product-category" className="h-8 text-xs w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c.id} value={c.name}>
                        {c.name}
                      </SelectItem>
                    ))}
                    {!categories.some((c) => c.name === category) && (
                      <SelectItem value={category}>{category}</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>

              {/* Brand */}
              <div className="space-y-1.5">
                <Label htmlFor="product-brand" className="text-xs font-medium flex items-center gap-1.5">
                  <Tag className="size-3.5 text-muted-foreground" />
                  <span>{t("editor.brandLabel")}</span>
                </Label>
                <Select
                  value={brand}
                  onValueChange={(val) => {
                    if (val) setBrand(val)
                  }}
                >
                  <SelectTrigger id="product-brand" className="h-8 text-xs w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {brands.map((b) => (
                      <SelectItem key={b.id} value={b.name}>
                        {b.name}
                      </SelectItem>
                    ))}
                    {!brands.some((b) => b.name === brand) && (
                      <SelectItem value={brand}>{brand}</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* 2. Product Media Card */}
          <Card className="shadow-xs">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Globe className="size-4 text-primary" />
                <span>{t("editor.mediaTitle")}</span>
              </CardTitle>
              <CardDescription className="text-xs">
                {t("editor.mediaDesc")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <MediaPickerInput
                value={image}
                onChange={handleMediaChange}
                allowedTypes={["image"]}
                placeholder="Choose or upload product image"
                dialogTitle="Select Product Image"
              />
            </CardContent>
          </Card>

          {/* 3. SEO Card & SERP Preview */}
          <Card className="shadow-xs">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Globe className="size-4 text-primary" />
                <span>{t("editor.seoTitle")}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Meta Title */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="product-meta-title" className="text-xs font-medium">
                    {t("editor.metaTitleLabel")}
                  </Label>
                  <span
                    className={`text-[11px] font-mono ${
                      metaTitle.length > 60
                        ? "text-amber-500 font-semibold"
                        : "text-muted-foreground"
                    }`}
                  >
                    {metaTitle.length}/60
                  </span>
                </div>
                <Input
                  id="product-meta-title"
                  value={metaTitle}
                  onChange={(e) => setMetaTitle(e.target.value)}
                  placeholder={t("editor.metaTitlePlaceholder")}
                  className="h-8 text-xs"
                />
              </div>

              {/* Meta Description */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="product-meta-desc" className="text-xs font-medium">
                    {t("editor.metaDescLabel")}
                  </Label>
                  <span
                    className={`text-[11px] font-mono ${
                      metaDescription.length > 160
                        ? "text-amber-500 font-semibold"
                        : "text-muted-foreground"
                    }`}
                  >
                    {metaDescription.length}/160
                  </span>
                </div>
                <Textarea
                  id="product-meta-desc"
                  value={metaDescription}
                  onChange={(e) => setMetaDescription(e.target.value)}
                  placeholder={t("editor.metaDescPlaceholder")}
                  rows={3}
                  className="text-xs resize-none"
                />
              </div>

              {/* Search Result SERP Preview */}
              <div className="space-y-1.5 pt-2 border-t">
                <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider block">
                  {t("editor.serpPreview")}
                </span>
                <div className="p-3 rounded-lg border bg-card/80 space-y-1">
                  <div className="text-[11px] text-muted-foreground font-mono truncate">
                    example.com › products › {slug || "your-slug"}
                  </div>
                  <div className="text-sm font-medium text-primary hover:underline line-clamp-1 cursor-pointer">
                    {metaTitle || name || "Product Title Preview"}
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {metaDescription ||
                      "Provide a concise meta description to help searchers understand your product on Google search results."}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Live Storefront Preview Sheet */}
      <AppSheet
        open={previewOpen}
        onOpenChange={setPreviewOpen}
        side="right"
        size="lg"
        title="Storefront Live Preview"
        description={`Previewing catalog listing for /products/${slug || "new"}`}
      >
        <div className="space-y-5 py-2">
          {image && (
            <div className="aspect-video w-full rounded-xl overflow-hidden border bg-muted/20">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={image}
                alt={name}
                className="size-full object-cover"
              />
            </div>
          )}

          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline">{category}</Badge>
              <Badge variant="outline">{brand}</Badge>
              <StatusBadge
                variant={
                  status === "published"
                    ? "success"
                    : status === "draft"
                      ? "neutral"
                      : status === "out_of_stock"
                        ? "destructive"
                        : "warning"
                }
                size="sm"
              >
                {t(`statuses.${status}`)}
              </StatusBadge>
            </div>

            <h1 className="text-2xl font-bold leading-tight">
              {name || "Untitled Product"}
            </h1>

            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <div className="flex items-center text-amber-500 gap-1">
                <Star className="size-3.5 fill-amber-500" />
                <span className="font-semibold text-foreground">5.0</span>
              </div>
              <span>•</span>
              <span className="font-mono">SKU: {sku || "N/A"}</span>
              <span>•</span>
              <span>{stock} units available</span>
            </div>

            {/* Price Box */}
            <div className="p-3.5 rounded-xl border bg-card flex items-baseline gap-3 mt-2">
              <span className="text-2xl font-bold font-mono text-foreground">
                ${(parseFloat(price) || 0).toFixed(2)}
              </span>
              {compareAtPrice && parseFloat(compareAtPrice) > (parseFloat(price) || 0) && (
                <>
                  <span className="text-sm text-muted-foreground line-through font-mono">
                    ${parseFloat(compareAtPrice).toFixed(2)}
                  </span>
                  <Badge variant="destructive" className="text-[10px]">
                    Save {Math.round(((parseFloat(compareAtPrice) - (parseFloat(price) || 0)) / parseFloat(compareAtPrice)) * 100)}%
                  </Badge>
                </>
              )}
            </div>

            {shortDescription && (
              <p className="text-xs text-muted-foreground leading-relaxed pt-1">
                {shortDescription}
              </p>
            )}
          </div>

          <div className="border-t pt-4 space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Product Overview & Specifications
            </span>
            <div
              className="prose prose-sm dark:prose-invert max-w-none [&_p]:my-2 [&_h2]:text-base [&_h3]:text-sm [&_ul]:pl-5 [&_ol]:pl-5 text-xs text-foreground/90 leading-relaxed"
              dangerouslySetInnerHTML={{
                __html: description || "<p><em>No description written yet...</em></p>",
              }}
            />
          </div>
        </div>
      </AppSheet>
    </div>
  )
}

export function ProductEditFeature({ productId }: ProductEditFeatureProps) {
  const t = useTranslations("ecommerce.products")
  const { getProduct } = useEcommerce()
  const isNew = productId === "new"

  const existingProduct = React.useMemo(() => {
    if (isNew) return null
    return getProduct(productId)
  }, [getProduct, productId, isNew])

  if (!isNew && !existingProduct) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[420px] p-6 text-center space-y-4 rounded-xl border bg-card shadow-xs">
        <div className="flex size-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
          <Package className="size-7 opacity-60" />
        </div>
        <div className="space-y-1">
          <h2 className="text-xl font-bold tracking-tight">Product Not Found</h2>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-md">
            The product with ID{" "}
            <code className="font-mono bg-muted/80 px-1.5 py-0.5 rounded text-xs text-foreground">
              {productId}
            </code>{" "}
            could not be found or may have been deleted.
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
          <Link
            href="/dashboard/ecommerce/products"
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "h-8 gap-1.5 text-xs cursor-pointer shadow-xs"
            )}
          >
            <ArrowLeft className="size-3.5" />
            <span>{t("editor.backToProducts")}</span>
          </Link>
          <Link
            href="/dashboard/ecommerce/products/new"
            className={cn(
              buttonVariants({ size: "sm" }),
              "h-8 gap-1.5 text-xs cursor-pointer shadow-xs"
            )}
          >
            <Plus className="size-3.5" />
            <span>{t("editor.createTitle")}</span>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <ProductEditForm
      key={productId}
      productId={productId}
      initialProduct={existingProduct}
      isNew={isNew}
    />
  )
}
