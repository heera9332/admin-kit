import { redirect } from "@/i18n/routing"

export default async function CmsIndexPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  redirect({ href: "/dashboard/cms/posts", locale })
}
