import type { Metadata } from "next"
import { ProductsFeature } from "@/features/ecommerce"

export const metadata: Metadata = {
  title: "Products | E-Commerce",
  description: "Manage product catalog, inventory, and pricing",
}

export default function EcommerceProductsPage() {
  return <ProductsFeature />
}
