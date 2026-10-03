import type { Metadata } from "next"
import { PageEditFeature } from "@/features/cms"

export const metadata: Metadata = {
  title: "Add New Page | CMS",
  description: "Create a new hierarchical WordPress-style CMS page",
}

export default function NewCmsPage() {
  return <PageEditFeature pageId="new" />
}
