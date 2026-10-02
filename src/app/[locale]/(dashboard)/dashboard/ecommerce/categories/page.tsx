import type { Metadata } from "next"
import { CategoriesFeature } from "@/features/ecommerce"

export const metadata: Metadata = {
  title: "Categories | E-Commerce",
  description: "Manage product categories and collections",
}

export default function EcommerceCategoriesPage() {
  return <CategoriesFeature />
}
