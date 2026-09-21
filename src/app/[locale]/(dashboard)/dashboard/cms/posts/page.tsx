import type { Metadata } from "next"
import { PostsFeature } from "@/features/cms"

export const metadata: Metadata = {
  title: "CMS Posts",
  description: "Manage blog posts and articles",
}

export default function CmsPostsPage() {
  return <PostsFeature />
}
