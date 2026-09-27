import { redirect } from "@/i18n/routing"

export default async function SettingsIndexPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ tab?: string }>
}) {
  const { locale } = await params
  const { tab } = await searchParams

  const tabRoutes: Record<string, string> = {
    profile: "/dashboard/settings/profile",
    billing: "/dashboard/settings/billing",
    shipping: "/dashboard/settings/shipping",
    payment: "/dashboard/settings/payment",
    overview: "/dashboard/settings/overview",
  }

  const destination = (tab && tabRoutes[tab]) || "/dashboard/settings/profile"

  redirect({ href: destination, locale })
}
