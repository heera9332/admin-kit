"use client"

import * as React from "react"
import { useTranslations } from "next-intl"
import { Plus, Package, CheckCircle, Boxes, AlertTriangle, Sparkles } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DataTable } from "@/components/shared/data-table"
import { useEcommerce } from "@/context/ecommerce-provider"
import { useRouter } from "@/i18n/routing"
import { toast } from "@/components/ui/toast"
import type { Product } from "@/data/ecommerce"
import { getProductsColumns } from "./product-columns"
import {
  CreateProductDialog,
  QuickEditProductDialog,
  ViewProductSheet,
} from "./components/product-dialogs"

export function ProductsFeature() {
  const t = useTranslations("ecommerce.products")
  const router = useRouter()
  const { products, categories, brands, addProduct, updateProduct, deleteProduct } =
    useEcommerce()

  const [createOpen, setCreateOpen] = React.useState(false)
  const [viewOpen, setViewOpen] = React.useState(false)
  const [selectedProduct, setSelectedProduct] = React.useState<Product | null>(null)
  const [editingProduct, setEditingProduct] = React.useState<Product | null>(null)

  const handleView = React.useCallback((product: Product) => {
    setSelectedProduct(product)
    setViewOpen(true)
  }, [])

  const handleQuickEdit = React.useCallback((product: Product) => {
    setEditingProduct(product)
  }, [])

  const handleFullEdit = React.useCallback(
    (product: Product) => {
      router.push(`/dashboard/ecommerce/products/${product.id}`)
    },
    [router]
  )

  const handleFullCreate = React.useCallback(() => {
    router.push("/dashboard/ecommerce/products/new")
  }, [router])

  const handleDelete = React.useCallback(
    (product: Product) => {
      if (confirm(t("dialog.deleteConfirm"))) {
        deleteProduct(product.id)
        if (selectedProduct?.id === product.id) {
          setSelectedProduct(null)
          setViewOpen(false)
        }
        if (editingProduct?.id === product.id) {
          setEditingProduct(null)
        }
        toast.add({
          title: t("editor.productDeletedSuccess"),
          description: `"${product.name}" has been removed from catalog.`,
        })
      }
    },
    [deleteProduct, selectedProduct, editingProduct, t]
  )

  const handleQuickEditUpdate = React.useCallback(
    (id: string, updates: Partial<Product>) => {
      updateProduct(id, updates)
      if (selectedProduct?.id === id) {
        setSelectedProduct((prev) => (prev ? { ...prev, ...updates } : null))
      }
      toast.add({
        title: t("editor.productSavedSuccess"),
        description: `Changes saved successfully.`,
      })
    },
    [updateProduct, selectedProduct, t]
  )

  const handleCreateProduct = React.useCallback(
    (data: Omit<Product, "id" | "createdAt" | "updatedAt">) => {
      const created = addProduct(data)
      toast.add({
        title: t("editor.productCreatedSuccess"),
        description: `"${created.name}" has been added to catalog.`,
      })
    },
    [addProduct, t]
  )

  const columns = React.useMemo(
    () =>
      getProductsColumns({
        onView: handleView,
        onQuickEdit: handleQuickEdit,
        onFullEdit: handleFullEdit,
        onDelete: handleDelete,
        t,
      }),
    [handleView, handleQuickEdit, handleFullEdit, handleDelete, t]
  )

  const categoryOptions = React.useMemo(
    () =>
      categories.map((c) => ({
        label: c.name,
        value: c.name,
      })),
    [categories]
  )

  const statusOptions = React.useMemo(
    () => [
      { label: t("statuses.published"), value: "published" },
      { label: t("statuses.draft"), value: "draft" },
      { label: t("statuses.out_of_stock"), value: "out_of_stock" },
      { label: t("statuses.archived"), value: "archived" },
    ],
    [t]
  )

  const totalCount = products.length
  const publishedCount = products.filter((p) => p.status === "published").length
  const inStockCount = products.filter((p) => p.stock > 0).length
  const lowStockCount = products.filter((p) => p.stock > 0 && p.stock <= (p.lowStockThreshold ?? 5)).length

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
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
            variant="outline"
            onClick={() => setCreateOpen(true)}
            size="sm"
            className="h-8 gap-1.5 text-xs cursor-pointer"
          >
            <Sparkles className="size-3.5" />
            <span>Quick Add</span>
          </Button>

          <Button
            onClick={handleFullCreate}
            size="sm"
            className="h-8 gap-1.5 text-xs cursor-pointer shadow-xs"
          >
            <Plus className="size-3.5" />
            <span>{t("newProduct")}</span>
          </Button>
        </div>
      </div>

      {/* Metrics Banner */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              Total Products
            </CardTitle>
            <Package className="size-4 text-muted-foreground" />
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
              Active Inventory
            </CardTitle>
            <Boxes className="size-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono text-foreground">
              {inStockCount}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              Low Stock Alerts
            </CardTitle>
            <AlertTriangle className="size-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono text-amber-600 dark:text-amber-400">
              {lowStockCount}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Reusable DataTable */}
      <DataTable
        columns={columns}
        data={products}
        search={{
          placeholder: t("searchPlaceholder"),
          column: "name",
        }}
        filters={[
          {
            column: "category",
            title: "Category",
            options: categoryOptions,
          },
          {
            column: "status",
            title: "Status",
            options: statusOptions,
          },
        ]}
        pagination={{ pageSize: 10 }}
        sorting
        onRowClick={(product) => handleView(product)}
        toolbarActions={
          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              onClick={() => setCreateOpen(true)}
              size="sm"
              className="h-8 gap-1.5 text-xs cursor-pointer"
            >
              <Sparkles className="size-3.5" />
              <span>Quick Add</span>
            </Button>
            <Button
              onClick={handleFullCreate}
              size="sm"
              className="h-8 gap-1.5 text-xs cursor-pointer shadow-xs"
            >
              <Plus className="size-3.5" />
              <span>{t("newProduct")}</span>
            </Button>
          </div>
        }
      />

      {/* Quick Add Product Dialog */}
      <CreateProductDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        categories={categories}
        brands={brands}
        onCreate={handleCreateProduct}
        onOpenFullCreate={handleFullCreate}
      />

      {/* Quick Edit Product Dialog */}
      <QuickEditProductDialog
        product={editingProduct}
        open={Boolean(editingProduct)}
        onOpenChange={(open) => !open && setEditingProduct(null)}
        categories={categories}
        brands={brands}
        onUpdate={handleQuickEditUpdate}
        onFullEdit={handleFullEdit}
      />

      {/* View Product Details Sheet */}
      <ViewProductSheet
        product={selectedProduct}
        open={viewOpen}
        onOpenChange={setViewOpen}
        onQuickEdit={(p) => setEditingProduct(p)}
        onFullEdit={handleFullEdit}
        onDelete={handleDelete}
      />
    </div>
  )
}
