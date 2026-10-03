import type { Metadata } from "next"
import { PagesFeature } from "@/features/cms"

export const metadata: Metadata = {
  title: "CMS Pages | WordPress Style",
  description: "Manage hierarchical pages, page templates, and navigation order",
}

export default function CmsPagesPage() {
  return <PagesFeature />
}
