import type { Metadata } from "next"
import { CustomersFeature } from "@/features/ecommerce"

export const metadata: Metadata = {
  title: "Customers | E-Commerce",
  description: "Manage customer directory and purchase histories",
}

export default function EcommerceCustomersPage() {
  return <CustomersFeature />
}
