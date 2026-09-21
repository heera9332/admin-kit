import type { Metadata } from "next"
import { CategoriesFeature } from "@/features/cms"

export const metadata: Metadata = {
  title: "CMS Categories",
  description: "Manage content topics and categories",
}

export default function CmsCategoriesPage() {
  return <CategoriesFeature />
}
