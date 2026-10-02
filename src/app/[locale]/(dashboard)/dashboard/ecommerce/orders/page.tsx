import type { Metadata } from "next"
import { OrdersFeature } from "@/features/ecommerce"

export const metadata: Metadata = {
  title: "Orders | E-Commerce",
  description: "Track customer orders, payments, and shipments",
}

export default function EcommerceOrdersPage() {
  return <OrdersFeature />
}
