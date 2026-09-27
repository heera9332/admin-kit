import type { Metadata } from "next"
import { PostEditFeature } from "@/features/cms"

interface PostEditPageProps {
  params: Promise<{
    locale: string
    id: string
  }>
}

export async function generateMetadata({
  params,
}: PostEditPageProps): Promise<Metadata> {
  const { id } = await params
  const isNew = id === "new"
  return {
    title: isNew ? "Create Post | CMS" : "Edit Post | CMS",
    description: isNew
      ? "Create a new blog or article publication"
      : "Edit article content, rich media, and publish settings",
  }
}

export default async function PostEditPage({ params }: PostEditPageProps) {
  const { id } = await params
  return <PostEditFeature postId={id} />
}
