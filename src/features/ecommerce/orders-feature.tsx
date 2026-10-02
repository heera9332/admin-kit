"use client"

import * as React from "react"
import { useTranslations } from "next-intl"
import type { ColumnDef } from "@tanstack/react-table"
import {
  Eye,
  Trash2,
  MoreHorizontal,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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
import type { Order } from "@/data/ecommerce"
import { ViewOrderSheet } from "./components/order-dialogs"

export function OrdersFeature() {
  const t = useTranslations("ecommerce.orders")
  const { orders, updateOrderStatus, deleteOrder } = useEcommerce()

  const [selectedOrder, setSelectedOrder] = React.useState<Order | null>(null)
  const [viewOpen, setViewOpen] = React.useState(false)

  const handleView = React.useCallback((order: Order) => {
    setSelectedOrder(order)
    setViewOpen(true)
  }, [])

  const columns = React.useMemo<ColumnDef<Order>[]>(
    () => [
      {
        accessorKey: "orderNumber",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t("fields.orderNumber")} />
        ),
        cell: ({ row }) => {
          const order = row.original
          return (
            <button
              type="button"
              onClick={() => handleView(order)}
              className="font-semibold text-xs font-mono text-primary hover:underline cursor-pointer"
            >
              {order.orderNumber}
            </button>
          )
        },
      },
      {
        accessorKey: "customer",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t("fields.customer")} />
        ),
        cell: ({ row }) => {
          const cust = row.original.customer
          return (
            <div className="space-y-0.5 max-w-[200px]">
              <p className="text-xs font-semibold text-foreground truncate">
                {cust.name}
              </p>
              <p className="text-[11px] text-muted-foreground truncate font-mono">
                {cust.email}
              </p>
            </div>
          )
        },
      },
      {
        accessorKey: "createdAt",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t("fields.date")} />
        ),
        cell: ({ row }) => (
          <span className="text-xs text-muted-foreground font-mono">
            {row.original.createdAt}
          </span>
        ),
      },
      {
        accessorKey: "items",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t("fields.items")} />
        ),
        cell: ({ row }) => {
          const count = row.original.items.reduce((acc, it) => acc + it.quantity, 0)
          return (
            <Badge variant="outline" className="text-xs font-mono">
              {count} items
            </Badge>
          )
        },
      },
      {
        accessorKey: "total",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t("fields.total")} />
        ),
        cell: ({ row }) => (
          <span className="text-xs font-bold font-mono text-foreground">
            ${row.original.total.toFixed(2)}
          </span>
        ),
      },
      {
        accessorKey: "paymentStatus",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t("fields.paymentStatus")} />
        ),
        cell: ({ row }) => {
          const pStatus = row.original.paymentStatus
          const variant =
            pStatus === "paid"
              ? "success"
              : pStatus === "pending"
                ? "warning"
                : pStatus === "failed"
                  ? "destructive"
                  : "purple"
          return (
            <StatusBadge variant={variant} size="sm">
              {t(`paymentStatuses.${pStatus}`)}
            </StatusBadge>
          )
        },
        filterFn: (row, id, value) => {
          return value.includes(row.getValue(id))
        },
      },
      {
        accessorKey: "fulfillmentStatus",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t("fields.fulfillmentStatus")} />
        ),
        cell: ({ row }) => {
          const fStatus = row.original.fulfillmentStatus
          const variant =
            fStatus === "delivered"
              ? "success"
              : fStatus === "shipped"
                ? "info"
                : fStatus === "processing"
                  ? "warning"
                  : "destructive"
          return (
            <StatusBadge variant={variant} size="sm">
              {t(`fulfillmentStatuses.${fStatus}`)}
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
          const order = row.original
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
                    onClick={() => handleView(order)}
                    className="gap-2 cursor-pointer text-xs"
                  >
                    <Eye className="size-3.5" />
                    <span>View Details</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      if (confirm("Are you sure you want to delete this order?")) {
                        deleteOrder(order.id)
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
    [t, handleView, deleteOrder]
  )

  const paymentOptions = React.useMemo(
    () => [
      { label: t("paymentStatuses.paid"), value: "paid" },
      { label: t("paymentStatuses.pending"), value: "pending" },
      { label: t("paymentStatuses.failed"), value: "failed" },
      { label: t("paymentStatuses.refunded"), value: "refunded" },
    ],
    [t]
  )

  const fulfillmentOptions = React.useMemo(
    () => [
      { label: t("fulfillmentStatuses.delivered"), value: "delivered" },
      { label: t("fulfillmentStatuses.shipped"), value: "shipped" },
      { label: t("fulfillmentStatuses.processing"), value: "processing" },
      { label: t("fulfillmentStatuses.cancelled"), value: "cancelled" },
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
      </div>

      {/* DataTable */}
      <DataTable
        columns={columns}
        data={orders}
        search={{
          placeholder: t("searchPlaceholder"),
          column: "orderNumber",
        }}
        filters={[
          {
            column: "paymentStatus",
            title: "Payment",
            options: paymentOptions,
          },
          {
            column: "fulfillmentStatus",
            title: "Fulfillment",
            options: fulfillmentOptions,
          },
        ]}
        pagination={{ pageSize: 10 }}
        sorting
      />

      <ViewOrderSheet
        order={selectedOrder}
        open={viewOpen}
        onOpenChange={setViewOpen}
        onUpdateStatus={updateOrderStatus}
      />
    </div>
  )
}
