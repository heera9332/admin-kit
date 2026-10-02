import type { Metadata } from "next"
import { ReportsFeature } from "@/features/ecommerce"

export const metadata: Metadata = {
  title: "Reports & Analytics | E-Commerce",
  description: "E-Commerce revenue analytics, sales trends, and breakdowns",
}

export default function EcommerceReportsPage() {
  return <ReportsFeature />
}
