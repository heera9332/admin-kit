import type { Metadata } from "next"
import { StoreAddressFeature } from "@/features/ecommerce"

export const metadata: Metadata = {
  title: "Store Address | E-Commerce",
  description: "Configure your primary store headquarters and fulfillment warehouse location",
}

export default function StoreAddressPage() {
  return <StoreAddressFeature />
}
