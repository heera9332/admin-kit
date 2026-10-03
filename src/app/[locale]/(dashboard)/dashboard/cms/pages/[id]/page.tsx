import type { Metadata } from "next"
import { PageEditFeature } from "@/features/cms"

interface PageEditPageProps {
  params: Promise<{
    locale: string
    id: string
  }>
}

export async function generateMetadata({
  params,
}: PageEditPageProps): Promise<Metadata> {
  const { id } = await params
  const isNew = id === "new"
  return {
    title: isNew ? "Create Page | CMS" : "Edit Page | CMS",
    description: isNew
      ? "Create a new hierarchical WordPress-style CMS page"
      : "Edit page content, templates, hierarchy, and metadata",
  }
}

export default async function PageEditPage({ params }: PageEditPageProps) {
  const { id } = await params
  return <PageEditFeature pageId={id} />
}
