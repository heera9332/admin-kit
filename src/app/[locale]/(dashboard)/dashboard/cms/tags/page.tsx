import type { Metadata } from "next"
import { TagsFeature } from "@/features/cms"

export const metadata: Metadata = {
  title: "CMS Tags",
  description: "Manage content tags and keywords",
}

export default function CmsTagsPage() {
  return <TagsFeature />
}
