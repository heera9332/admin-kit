import type { Metadata } from "next"
import { CouponsFeature } from "@/features/ecommerce"

export const metadata: Metadata = {
  title: "Coupons | E-Commerce",
  description: "Manage promo discount vouchers and campaigns",
}

export default function EcommerceCouponsPage() {
  return <CouponsFeature />
}
