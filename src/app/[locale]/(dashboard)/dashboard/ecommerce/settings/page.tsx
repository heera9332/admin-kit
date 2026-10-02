import type { Metadata } from "next"
import { SettingsFeature } from "@/features/ecommerce"

export const metadata: Metadata = {
  title: "Store Settings | E-Commerce",
  description: "Configure store information, currency, and checkout preferences",
}

export default function EcommerceSettingsPage() {
  return <SettingsFeature />
}
