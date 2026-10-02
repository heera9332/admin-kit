import type { Metadata } from "next"
import { ReviewsFeature } from "@/features/ecommerce"

export const metadata: Metadata = {
  title: "Reviews | E-Commerce",
  description: "Moderate product ratings and customer feedback",
}

export default function EcommerceReviewsPage() {
  return <ReviewsFeature />
}
