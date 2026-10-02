import type { Metadata } from "next"
import { StoreSettingsFeature } from "@/features/ecommerce"

export const metadata: Metadata = {
  title: "Store Settings | E-Commerce",
  description: "Configure store identity, customer purchasing restrictions, and general store features",
}

export default function StoreSettingsPage() {
  return <StoreSettingsFeature />
}
