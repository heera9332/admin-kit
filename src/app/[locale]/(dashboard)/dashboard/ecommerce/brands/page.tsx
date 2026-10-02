import type { Metadata } from "next"
import { BrandsFeature } from "@/features/ecommerce"

export const metadata: Metadata = {
  title: "Brands | E-Commerce",
  description: "Manage vendor brands and manufacturer profiles",
}

export default function EcommerceBrandsPage() {
  return <BrandsFeature />
}
