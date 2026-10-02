"use client"

import * as React from "react"
import { useTranslations } from "next-intl"
import type { ColumnDef } from "@tanstack/react-table"
import {
  Plus,
  MoreHorizontal,
  Pencil,
  Trash2,
  Copy,
  Check,
  Percent,
  DollarSign,
  Truck,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { StatusBadge } from "@/components/status-badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { DataTable } from "@/components/shared/data-table"
import { DataTableColumnHeader } from "@/components/shared/data-table/data-table-column-header"
import { useEcommerce } from "@/context/ecommerce-provider"
import type { Coupon } from "@/data/ecommerce"
import { CreateCouponDialog, EditCouponDialog } from "./components/coupon-dialogs"

export function CouponsFeature() {
  const t = useTranslations("ecommerce.coupons")
  const { coupons, addCoupon, updateCoupon, deleteCoupon, toggleCouponStatus } =
    useEcommerce()

  const [createOpen, setCreateOpen] = React.useState(false)
  const [editingCoupon, setEditingCoupon] = React.useState<Coupon | null>(null)
  const [copiedCode, setCopiedCode] = React.useState<string | null>(null)

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(code)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  const columns = React.useMemo<ColumnDef<Coupon>[]>(
    () => [
      {
        accessorKey: "code",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t("fields.code")} />
        ),
        cell: ({ row }) => {
          const coupon = row.original
          const isCopied = copiedCode === coupon.code
          return (
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-xs bg-muted/60 px-2 py-1 rounded border tracking-wider text-foreground">
                {coupon.code}
              </span>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => handleCopy(coupon.code)}
                className="size-6 text-muted-foreground hover:text-foreground cursor-pointer"
                title="Copy code"
              >
                {isCopied ? (
                  <Check className="size-3.5 text-emerald-600" />
                ) : (
                  <Copy className="size-3" />
                )}
              </Button>
            </div>
          )
        },
      },
      {
        accessorKey: "type",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t("fields.type")} />
        ),
        cell: ({ row }) => {
          const type = row.original.type
          return (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
              {type === "percentage" ? (
                <Percent className="size-3.5 text-primary" />
              ) : type === "fixed_amount" ? (
                <DollarSign className="size-3.5 text-primary" />
              ) : (
                <Truck className="size-3.5 text-primary" />
              )}
              <span>{t(`types.${type}`)}</span>
            </div>
          )
        },
      },
      {
        accessorKey: "value",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t("fields.value")} />
        ),
        cell: ({ row }) => {
          const coupon = row.original
          return (
            <span className="text-xs font-bold font-mono">
              {coupon.type === "percentage"
                ? `${coupon.value}% OFF`
                : coupon.type === "fixed_amount"
                  ? `$${coupon.value.toFixed(2)} OFF`
                  : "Free Shipping"}
            </span>
          )
        },
      },
      {
        accessorKey: "minSpend",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t("fields.minSpend")} />
        ),
        cell: ({ row }) => (
          <span className="text-xs font-mono text-muted-foreground">
            ${row.original.minSpend.toFixed(2)}
          </span>
        ),
      },
      {
        id: "usage",
        header: () => <span className="text-xs font-medium">{t("fields.usage")}</span>,
        cell: ({ row }) => {
          const coupon = row.original
          const pct = Math.round((coupon.usageCount / coupon.usageLimit) * 100)
          return (
            <div className="space-y-1 max-w-[120px]">
              <div className="flex justify-between text-[11px] font-mono text-muted-foreground">
                <span>{coupon.usageCount}</span>
                <span>/ {coupon.usageLimit}</span>
              </div>
              <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all"
                  style={{ width: `${Math.min(pct, 100)}%` }}
                />
              </div>
            </div>
          )
        },
      },
      {
        accessorKey: "expiresAt",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t("fields.expiresAt")} />
        ),
        cell: ({ row }) => (
          <span className="text-xs font-mono text-muted-foreground">
            {row.original.expiresAt}
          </span>
        ),
      },
      {
        accessorKey: "status",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t("fields.status")} />
        ),
        cell: ({ row }) => {
          const status = row.original.status
          return (
            <StatusBadge
              variant={
                status === "active"
                  ? "success"
                  : status === "expired"
                    ? "warning"
                    : "neutral"
              }
              size="sm"
            >
              {t(`statuses.${status}`)}
            </StatusBadge>
          )
        },
        filterFn: (row, id, value) => {
          return value.includes(row.getValue(id))
        },
      },
      {
        id: "actions",
        header: () => <span className="sr-only">{t("fields.actions")}</span>,
        cell: ({ row }) => {
          const coupon = row.original
          return (
            <div className="flex justify-end">
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-8 cursor-pointer text-muted-foreground hover:text-foreground"
                    />
                  }
                >
                  <MoreHorizontal className="size-4" />
                  <span className="sr-only">Actions</span>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-36">
                  <DropdownMenuItem
                    onClick={() => toggleCouponStatus(coupon.id)}
                    className="gap-2 cursor-pointer text-xs"
                  >
                    <span>{coupon.status === "active" ? "Disable" : "Enable"}</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setEditingCoupon(coupon)}
                    className="gap-2 cursor-pointer text-xs"
                  >
                    <Pencil className="size-3.5" />
                    <span>Edit</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      if (confirm(t("dialog.deleteConfirm"))) {
                        deleteCoupon(coupon.id)
                      }
                    }}
                    className="gap-2 text-destructive focus:text-destructive cursor-pointer text-xs"
                  >
                    <Trash2 className="size-3.5" />
                    <span>Delete</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )
        },
      },
    ],
    [t, copiedCode, toggleCouponStatus, deleteCoupon]
  )

  const statusOptions = React.useMemo(
    () => [
      { label: t("statuses.active"), value: "active" },
      { label: t("statuses.expired"), value: "expired" },
      { label: t("statuses.disabled"), value: "disabled" },
    ],
    [t]
  )

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
            {t("title")}
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            {t("description")}
          </p>
        </div>

        <Button
          onClick={() => setCreateOpen(true)}
          size="sm"
          className="cursor-pointer gap-1.5 self-start sm:self-auto"
        >
          <Plus className="size-4" />
          <span>{t("newCoupon")}</span>
        </Button>
      </div>

      {/* DataTable */}
      <DataTable
        columns={columns}
        data={coupons}
        search={{
          placeholder: t("searchPlaceholder"),
          column: "code",
        }}
        filters={[
          {
            column: "status",
            title: "Status",
            options: statusOptions,
          },
        ]}
        pagination={{ pageSize: 10 }}
        sorting
      />

      <CreateCouponDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onCreate={addCoupon}
      />

      <EditCouponDialog
        coupon={editingCoupon}
        open={Boolean(editingCoupon)}
        onOpenChange={(open) => !open && setEditingCoupon(null)}
        onUpdate={updateCoupon}
      />
    </div>
  )
}
