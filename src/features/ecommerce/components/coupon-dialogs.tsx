"use client"

import * as React from "react"
import { useTranslations } from "next-intl"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Ticket, Edit } from "lucide-react"

import { Button } from "@/components/ui/button"
import { AppDialog } from "@/components/app-dialog"
import { DynamicForm } from "@/components/forms"
import type { FormFieldsConfig } from "@/types/form"
import type { Coupon } from "@/data/ecommerce"

const couponFormSchema = z.object({
  code: z.string().min(2, "Code must be at least 2 characters").toUpperCase(),
  type: z.enum(["percentage", "fixed_amount", "free_shipping"] as const),
  value: z.number().min(0, "Value cannot be negative"),
  minSpend: z.number().min(0, "Min spend cannot be negative"),
  usageLimit: z.number().min(1, "Usage limit must be at least 1"),
  expiresAt: z.string().min(1, "Expiration date is required"),
  status: z.enum(["active", "expired", "disabled"] as const),
})

type CouponFormValues = z.infer<typeof couponFormSchema>

function getCouponFormFields(
  t: (key: string) => string
): FormFieldsConfig<CouponFormValues> {
  return [
    {
      name: "code",
      type: "text",
      label: t("fields.code"),
      placeholder: "e.g. FLASH30",
      required: true,
      colSpan: 1,
    },
    {
      name: "type",
      type: "select",
      label: t("fields.type"),
      required: true,
      colSpan: 1,
      options: [
        { value: "percentage", label: t("types.percentage") },
        { value: "fixed_amount", label: t("types.fixed_amount") },
        { value: "free_shipping", label: t("types.free_shipping") },
      ],
    },
    {
      name: "value",
      type: "number",
      label: t("fields.value"),
      placeholder: "20",
      step: 1,
      required: true,
      colSpan: 1,
    },
    {
      name: "minSpend",
      type: "number",
      label: t("fields.minSpend"),
      placeholder: "50",
      step: 1,
      required: true,
      colSpan: 1,
    },
    {
      name: "usageLimit",
      type: "number",
      label: "Total Usage Limit",
      placeholder: "500",
      step: 1,
      required: true,
      colSpan: 1,
    },
    {
      name: "expiresAt",
      type: "text",
      label: t("fields.expiresAt"),
      placeholder: "YYYY-MM-DD",
      required: true,
      colSpan: 1,
    },
    {
      name: "status",
      type: "select",
      label: t("fields.status"),
      required: true,
      colSpan: 2,
      options: [
        { value: "active", label: t("statuses.active") },
        { value: "expired", label: t("statuses.expired") },
        { value: "disabled", label: t("statuses.disabled") },
      ],
    },
  ]
}

interface CreateCouponDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreate: (coupon: Omit<Coupon, "id" | "usageCount">) => void
}

export function CreateCouponDialog({
  open,
  onOpenChange,
  onCreate,
}: CreateCouponDialogProps) {
  const t = useTranslations("ecommerce.coupons")

  const form = useForm<CouponFormValues>({
    resolver: zodResolver(couponFormSchema),
    defaultValues: {
      code: "",
      type: "percentage",
      value: 15,
      minSpend: 50,
      usageLimit: 250,
      expiresAt: "2026-12-31",
      status: "active",
    },
  })

  const fields = React.useMemo(() => getCouponFormFields(t), [t])

  const onSubmit = (data: CouponFormValues) => {
    onCreate({
      code: data.code.trim().toUpperCase(),
      type: data.type,
      value: Number(data.value),
      minSpend: Number(data.minSpend),
      usageLimit: Number(data.usageLimit),
      expiresAt: data.expiresAt,
      status: data.status,
    })
    form.reset()
    onOpenChange(false)
  }

  return (
    <AppDialog
      open={open}
      onOpenChange={onOpenChange}
      size="xl"
      title={
        <div className="flex items-center gap-2">
          <div className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Ticket className="size-4" />
          </div>
          <span className="font-semibold text-base">{t("dialog.createTitle")}</span>
        </div>
      }
      description={t("dialog.createDescription")}
    >
      <DynamicForm<CouponFormValues>
        form={form}
        fields={fields}
        onSubmit={onSubmit}
        submitLabel={t("newCoupon")}
        columns={2}
        secondaryAction={
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="cursor-pointer"
          >
            Cancel
          </Button>
        }
      />
    </AppDialog>
  )
}

interface EditCouponDialogProps {
  coupon: Coupon | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpdate: (id: string, updates: Partial<Coupon>) => void
}

export function EditCouponDialog({
  coupon,
  open,
  onOpenChange,
  onUpdate,
}: EditCouponDialogProps) {
  const t = useTranslations("ecommerce.coupons")

  const form = useForm<CouponFormValues>({
    resolver: zodResolver(couponFormSchema),
    values: coupon
      ? {
          code: coupon.code,
          type: coupon.type,
          value: coupon.value,
          minSpend: coupon.minSpend,
          usageLimit: coupon.usageLimit,
          expiresAt: coupon.expiresAt,
          status: coupon.status,
        }
      : undefined,
  })

  const fields = React.useMemo(() => getCouponFormFields(t), [t])

  if (!coupon) return null

  const onSubmit = (data: CouponFormValues) => {
    onUpdate(coupon.id, {
      code: data.code.trim().toUpperCase(),
      type: data.type,
      value: Number(data.value),
      minSpend: Number(data.minSpend),
      usageLimit: Number(data.usageLimit),
      expiresAt: data.expiresAt,
      status: data.status,
    })
    onOpenChange(false)
  }

  return (
    <AppDialog
      open={open}
      onOpenChange={onOpenChange}
      size="xl"
      title={
        <div className="flex items-center gap-2">
          <div className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Edit className="size-4" />
          </div>
          <span className="font-semibold text-base">{t("dialog.editTitle")}</span>
        </div>
      }
      description={t("dialog.editDescription")}
    >
      <DynamicForm<CouponFormValues>
        form={form}
        fields={fields}
        onSubmit={onSubmit}
        submitLabel="Save Changes"
        columns={2}
        secondaryAction={
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="cursor-pointer"
          >
            Cancel
          </Button>
        }
      />
    </AppDialog>
  )
}
