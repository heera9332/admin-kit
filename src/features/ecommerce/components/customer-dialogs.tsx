"use client"

import * as React from "react"
import { useTranslations } from "next-intl"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { User, Edit, Trash2, Mail, Phone, MapPin } from "lucide-react"

import { Button } from "@/components/ui/button"
import { AppDialog } from "@/components/app-dialog"
import { AppSheet } from "@/components/app-sheet"
import { StatusBadge } from "@/components/status-badge"
import { DynamicForm } from "@/components/forms"
import type { FormFieldsConfig } from "@/types/form"
import type { Customer } from "@/data/ecommerce"

const customerFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email required"),
  phone: z.string().optional(),
  city: z.string().min(1, "City is required"),
  country: z.string().min(1, "Country is required"),
  status: z.enum(["active", "inactive"] as const),
})

type CustomerFormValues = z.infer<typeof customerFormSchema>

function getCustomerFormFields(
  t: (key: string) => string
): FormFieldsConfig<CustomerFormValues> {
  return [
    {
      name: "name",
      type: "text",
      label: t("fields.name"),
      placeholder: "e.g. Liam Henderson",
      required: true,
      colSpan: 1,
    },
    {
      name: "email",
      type: "email",
      label: t("fields.email"),
      placeholder: "e.g. liam.h@example.com",
      required: true,
      colSpan: 1,
    },
    {
      name: "phone",
      type: "text",
      label: t("fields.phone"),
      placeholder: "+1 (555) 000-0000",
      colSpan: 1,
    },
    {
      name: "status",
      type: "select",
      label: t("fields.status"),
      required: true,
      colSpan: 1,
      options: [
        { value: "active", label: t("statuses.active") },
        { value: "inactive", label: t("statuses.inactive") },
      ],
    },
    {
      name: "city",
      type: "text",
      label: "City",
      placeholder: "e.g. San Francisco",
      required: true,
      colSpan: 1,
    },
    {
      name: "country",
      type: "text",
      label: "Country",
      placeholder: "e.g. United States",
      required: true,
      colSpan: 1,
    },
  ]
}

interface CreateCustomerDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreate: (customer: Omit<Customer, "id" | "createdAt" | "ordersCount" | "totalSpent">) => void
}

export function CreateCustomerDialog({
  open,
  onOpenChange,
  onCreate,
}: CreateCustomerDialogProps) {
  const t = useTranslations("ecommerce.customers")

  const form = useForm<CustomerFormValues>({
    resolver: zodResolver(customerFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      city: "",
      country: "United States",
      status: "active",
    },
  })

  const fields = React.useMemo(() => getCustomerFormFields(t), [t])

  const onSubmit = (data: CustomerFormValues) => {
    onCreate({
      name: data.name.trim(),
      email: data.email.trim(),
      phone: data.phone || undefined,
      city: data.city.trim(),
      country: data.country.trim(),
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
            <User className="size-4" />
          </div>
          <span className="font-semibold text-base">{t("dialog.createTitle")}</span>
        </div>
      }
      description={t("dialog.createDescription")}
    >
      <DynamicForm<CustomerFormValues>
        form={form}
        fields={fields}
        onSubmit={onSubmit}
        submitLabel={t("newCustomer")}
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

interface EditCustomerDialogProps {
  customer: Customer | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpdate: (id: string, updates: Partial<Customer>) => void
}

export function EditCustomerDialog({
  customer,
  open,
  onOpenChange,
  onUpdate,
}: EditCustomerDialogProps) {
  const t = useTranslations("ecommerce.customers")

  const form = useForm<CustomerFormValues>({
    resolver: zodResolver(customerFormSchema),
    values: customer
      ? {
          name: customer.name,
          email: customer.email,
          phone: customer.phone || "",
          city: customer.city,
          country: customer.country,
          status: customer.status,
        }
      : undefined,
  })

  const fields = React.useMemo(() => getCustomerFormFields(t), [t])

  if (!customer) return null

  const onSubmit = (data: CustomerFormValues) => {
    onUpdate(customer.id, {
      name: data.name.trim(),
      email: data.email.trim(),
      phone: data.phone || undefined,
      city: data.city.trim(),
      country: data.country.trim(),
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
      <DynamicForm<CustomerFormValues>
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

interface ViewCustomerSheetProps {
  customer: Customer | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onEdit?: (customer: Customer) => void
  onDelete?: (id: string) => void
}

export function ViewCustomerSheet({
  customer,
  open,
  onOpenChange,
  onEdit,
  onDelete,
}: ViewCustomerSheetProps) {
  const t = useTranslations("ecommerce.customers")

  if (!customer) return null

  return (
    <AppSheet
      open={open}
      onOpenChange={onOpenChange}
      size="md"
      title={
        <div className="flex items-center gap-2">
          <div className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <User className="size-4" />
          </div>
          <span className="font-semibold text-base truncate">{customer.name}</span>
        </div>
      }
      description={`Customer ID: ${customer.id} • Registered ${customer.createdAt}`}
    >
      <div className="space-y-6 pt-4">
        {/* Metric Overview */}
        <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl border bg-card/60">
          <div>
            <span className="text-xs text-muted-foreground block mb-0.5">Lifetime Spend</span>
            <span className="text-xl font-bold font-mono text-foreground">
              ${customer.totalSpent.toFixed(2)}
            </span>
          </div>

          <div>
            <span className="text-xs text-muted-foreground block mb-0.5">Total Orders</span>
            <span className="text-xl font-bold font-mono text-foreground">
              {customer.ordersCount} orders
            </span>
          </div>
        </div>

        {/* Contact info card */}
        <div className="space-y-2 p-3.5 rounded-xl border bg-muted/20">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
            Contact Information
          </span>
          <div className="space-y-1.5 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <Mail className="size-3.5 text-primary" />
              <span>{customer.email}</span>
            </div>
            {customer.phone && (
              <div className="flex items-center gap-2">
                <Phone className="size-3.5 text-primary" />
                <span>{customer.phone}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <MapPin className="size-3.5 text-primary" />
              <span>
                {customer.city}, {customer.country}
              </span>
            </div>
          </div>
        </div>

        {/* Status */}
        <div className="flex items-center justify-between p-3 rounded-lg border bg-card/60">
          <span className="text-xs font-medium text-foreground">Account Status</span>
          <StatusBadge
            variant={customer.status === "active" ? "success" : "neutral"}
            size="sm"
          >
            {t(`statuses.${customer.status}`)}
          </StatusBadge>
        </div>

        {customer.lastOrderDate && (
          <div className="text-xs text-muted-foreground">
            Last purchased on: <span className="font-mono">{customer.lastOrderDate}</span>
          </div>
        )}

        <div className="flex items-center justify-end gap-2 pt-4 border-t">
          {onDelete && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                if (confirm(t("dialog.deleteConfirm"))) {
                  onDelete(customer.id)
                  onOpenChange(false)
                }
              }}
              className="text-destructive hover:bg-destructive/10 cursor-pointer"
            >
              <Trash2 className="size-3.5 mr-1" />
              <span>Delete</span>
            </Button>
          )}

          {onEdit && (
            <Button
              type="button"
              size="sm"
              onClick={() => {
                onOpenChange(false)
                onEdit(customer)
              }}
              className="cursor-pointer gap-1.5"
            >
              <Edit className="size-3.5" />
              <span>Edit Customer</span>
            </Button>
          )}
        </div>
      </div>
    </AppSheet>
  )
}
