import type { Metadata } from "next"
import { EcommerceOverviewFeature } from "@/features/ecommerce"

export const metadata: Metadata = {
  title: "E-Commerce",
  description: "E-Commerce store overview, sales performance, and operations",
}

export default function EcommercePage() {
  return <EcommerceOverviewFeature />
}
