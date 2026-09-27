"use client"

import * as React from "react"
import { useTranslations } from "next-intl"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { PaymentMethodsManager } from "@/features/settings/components/payment-methods-manager"
import { useSettingsProfile } from "@/features/settings/hooks/use-settings-profile"

export default function PaymentSettingsPage() {
  const t = useTranslations("settings.payment")
  const { paymentMethods, updatePaymentMethods } = useSettingsProfile()

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
      <PaymentMethodsManager
        paymentMethods={paymentMethods}
        onSave={updatePaymentMethods}
      />
    </Card>
  )
}
