import type { Metadata } from "next"
import { CurrencyOptionsFeature } from "@/features/ecommerce"

export const metadata: Metadata = {
  title: "Currency Options | E-Commerce",
  description: "Configure standard currency symbols, formatting positions, and decimal separators",
}

export default function CurrencyOptionsPage() {
  return <CurrencyOptionsFeature />
}
