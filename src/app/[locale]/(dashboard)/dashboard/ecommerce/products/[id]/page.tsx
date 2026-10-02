import type { Metadata } from "next"
import { ProductEditFeature } from "@/features/ecommerce"

interface ProductEditPageProps {
  params: Promise<{
    locale: string
    id: string
  }>
}

export async function generateMetadata({
  params,
}: ProductEditPageProps): Promise<Metadata> {
  const { id } = await params
  const isNew = id === "new"
  return {
    title: isNew ? "Add Product | E-Commerce" : "Edit Product | E-Commerce",
    description: isNew
      ? "Create a new catalog product with pricing and inventory"
      : "Edit product details, pricing, inventory stock, and media",
  }
}

export default async function ProductEditPage({ params }: ProductEditPageProps) {
  const { id } = await params
  return <ProductEditFeature productId={id} />
}
