import { redirect } from "@/i18n/routing"

export default async function EcommerceSettingsIndexPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ tab?: string }>
}) {
  const { locale } = await params
  const { tab } = await searchParams

  const tabRoutes: Record<string, string> = {
    store: "/dashboard/ecommerce/settings/store",
    general: "/dashboard/ecommerce/settings/store",
    payments: "/dashboard/ecommerce/settings/payments",
    payment: "/dashboard/ecommerce/settings/payments",
    address: "/dashboard/ecommerce/settings/address",
    currency: "/dashboard/ecommerce/settings/currency",
  }

  const destination = (tab && tabRoutes[tab]) || "/dashboard/ecommerce/settings/store"

  redirect({ href: destination, locale })
}
