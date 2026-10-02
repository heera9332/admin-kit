import type { Metadata } from "next"
import { PaymentsSettingsFeature } from "@/features/ecommerce"

export const metadata: Metadata = {
  title: "Payment Gateways | E-Commerce",
  description: "Manage installed payment methods and checkout gateways for receiving orders",
}

export default function PaymentsSettingsPage() {
  return <PaymentsSettingsFeature />
}
