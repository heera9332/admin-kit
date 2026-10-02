"use client"

import * as React from "react"
import { useTranslations } from "next-intl"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { CheckCircle2 } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DynamicForm } from "@/components/forms"
import type { FormFieldsConfig } from "@/types/form"
import { useEcommerce } from "@/context/ecommerce-provider"

const settingsSchema = z.object({
  storeName: z.string().min(1, "Store name is required"),
  storeEmail: z.string().email("Valid email required"),
  currency: z.string().min(1, "Currency is required"),
  phone: z.string().optional(),
  address: z.string().optional(),
  lowStockAlert: z.number().min(0),
  taxRate: z.number().min(0).max(100),
  freeShippingThreshold: z.number().min(0),
  enableReviews: z.boolean(),
  guestCheckout: z.boolean(),
})

type SettingsFormValues = z.infer<typeof settingsSchema>

export function SettingsFeature() {
  const t = useTranslations("ecommerce.settings")
  const { settings, updateSettings } = useEcommerce()
  const [saved, setSaved] = React.useState(false)

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    values: settings,
  })

  const fields: FormFieldsConfig<SettingsFormValues> = React.useMemo(
    () => [
      {
        name: "storeName",
        type: "text",
        label: t("fields.storeName"),
        placeholder: "e.g. Lumina Commerce",
        required: true,
        colSpan: 1,
      },
      {
        name: "storeEmail",
        type: "email",
        label: t("fields.storeEmail"),
        placeholder: "e.g. store@example.com",
        required: true,
        colSpan: 1,
      },
      {
        name: "currency",
        type: "select",
        label: t("fields.currency"),
        required: true,
        colSpan: 1,
        options: [
          { value: "USD", label: "USD ($) - United States Dollar" },
          { value: "EUR", label: "EUR (€) - Euro" },
          { value: "GBP", label: "GBP (£) - British Pound" },
          { value: "INR", label: "INR (₹) - Indian Rupee" },
          { value: "JPY", label: "JPY (¥) - Japanese Yen" },
        ],
      },
      {
        name: "phone",
        type: "text",
        label: t("fields.phone"),
        placeholder: "+1 (800) 555-0199",
        colSpan: 1,
      },
      {
        name: "address",
        type: "textarea",
        label: t("fields.address"),
        placeholder: "Store physical headquarters address...",
        rows: 2,
        colSpan: 2,
      },
      {
        name: "lowStockAlert",
        type: "number",
        label: t("fields.lowStockAlert"),
        placeholder: "10",
        step: 1,
        required: true,
        colSpan: 1,
      },
      {
        name: "taxRate",
        type: "number",
        label: t("fields.taxRate"),
        placeholder: "8.5",
        step: 0.1,
        required: true,
        colSpan: 1,
      },
      {
        name: "freeShippingThreshold",
        type: "number",
        label: t("fields.freeShippingThreshold"),
        placeholder: "99.00",
        step: 1,
        required: true,
        colSpan: 2,
      },
      {
        name: "enableReviews",
        type: "switch",
        label: t("fields.enableReviews"),
        description: "Allow verified purchasers to write ratings and text reviews.",
        colSpan: 2,
      },
      {
        name: "guestCheckout",
        type: "switch",
        label: t("fields.guestCheckout"),
        description: "Allow customers to place orders without creating a password account.",
        colSpan: 2,
      },
    ],
    [t]
  )

  const onSubmit = (data: SettingsFormValues) => {
    updateSettings({
      ...data,
      phone: data.phone || "",
      address: data.address || "",
    })
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
          {t("title")}
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
          {t("description")}
        </p>
      </div>

      <Card className="shadow-xs">
        <CardHeader>
          <CardTitle className="text-sm font-semibold">Store Configuration</CardTitle>
          <CardDescription className="text-xs">
            Manage your store identity, currency standard, checkout settings, and inventory thresholds.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DynamicForm<SettingsFormValues>
            form={form}
            fields={fields}
            onSubmit={onSubmit}
            submitLabel="Save Preferences"
            columns={2}
            secondaryAction={
              saved ? (
                <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
                  <CheckCircle2 className="size-4" />
                  <span>{t("savedSuccess")}</span>
                </div>
              ) : null
            }
          />
        </CardContent>
      </Card>
    </div>
  )
}
