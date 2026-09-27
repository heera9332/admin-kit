"use client"

import * as React from "react"
import { useTranslations } from "next-intl"
import { useRouter } from "@/i18n/routing"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { AddressOverviewCards } from "@/features/settings/components/address-overview-cards"
import { useSettingsProfile } from "@/features/settings/hooks/use-settings-profile"

export default function OverviewSettingsPage() {
  const t = useTranslations("settings.addresses")
  const router = useRouter()
  const { billingAddress, shippingAddress, paymentMethods } =
    useSettingsProfile()

  return (
    <Card>
      <CardHeader className="border-b pb-4">
        <div className="flex items-center gap-2">
          <CardTitle className="text-base font-semibold">{t("title")}</CardTitle>
          <Badge variant="secondary" className="text-[10px] uppercase font-bold tracking-wider">
            {t("badge")}
          </Badge>
        </div>
        <CardDescription className="text-xs text-muted-foreground">
          {t("subtitle")}
        </CardDescription>
      </CardHeader>
      <AddressOverviewCards
        billingAddress={billingAddress}
        shippingAddress={shippingAddress}
        paymentMethods={paymentMethods}
        onEditBilling={() => router.push("/dashboard/settings/billing")}
        onEditShipping={() => router.push("/dashboard/settings/shipping")}
        onEditPayment={() => router.push("/dashboard/settings/payment")}
      />
    </Card>
  )
}
