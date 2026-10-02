"use client"

import * as React from "react"
import { useTranslations } from "next-intl"
import {
  ShoppingCart,
  User,
  MapPin,
  Package,
} from "lucide-react"

import { AppSheet } from "@/components/app-sheet"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { Order, PaymentStatus, FulfillmentStatus } from "@/data/ecommerce"

interface ViewOrderSheetProps {
  order: Order | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpdateStatus?: (
    id: string,
    paymentStatus?: PaymentStatus,
    fulfillmentStatus?: FulfillmentStatus
  ) => void
}

export function ViewOrderSheet({
  order,
  open,
  onOpenChange,
  onUpdateStatus,
}: ViewOrderSheetProps) {
  const t = useTranslations("ecommerce.orders")

  if (!order) return null

  return (
    <AppSheet
      open={open}
      onOpenChange={onOpenChange}
      size="lg"
      title={
        <div className="flex items-center gap-2">
          <div className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <ShoppingCart className="size-4" />
          </div>
          <span className="font-semibold text-base">
            {order.orderNumber}
          </span>
        </div>
      }
      description={`Placed on ${order.createdAt} • via ${order.paymentMethod.replace("_", " ").toUpperCase()}`}
    >
      <div className="space-y-6 pt-4">
        {/* Status controls */}
        <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl border bg-card/60">
          <div className="space-y-1.5">
            <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider block">
              Payment Status
            </span>
            <Select
              value={order.paymentStatus}
              onValueChange={(val) =>
                onUpdateStatus?.(order.id, val as PaymentStatus, undefined)
              }
            >
              <SelectTrigger className="h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="refunded">Refunded</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider block">
              Fulfillment Status
            </span>
            <Select
              value={order.fulfillmentStatus}
              onValueChange={(val) =>
                onUpdateStatus?.(order.id, undefined, val as FulfillmentStatus)
              }
            >
              <SelectTrigger className="h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Customer & Destination */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2 p-3.5 rounded-xl border bg-muted/20">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
              <User className="size-3.5 text-primary" />
              <span>{t("dialog.customerDetails")}</span>
            </div>
            <div className="space-y-0.5 text-xs text-muted-foreground">
              <p className="font-medium text-foreground">{order.customer.name}</p>
              <p>{order.customer.email}</p>
            </div>
          </div>

          <div className="space-y-2 p-3.5 rounded-xl border bg-muted/20">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
              <MapPin className="size-3.5 text-primary" />
              <span>{t("dialog.shippingAddress")}</span>
            </div>
            <div className="space-y-0.5 text-xs text-muted-foreground">
              <p>{order.shippingAddress.street}</p>
              <p>
                {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                {order.shippingAddress.zip}
              </p>
              <p>{order.shippingAddress.country}</p>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="space-y-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block">
            Purchased Items ({order.items.length})
          </span>
          <div className="space-y-2">
            {order.items.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 rounded-lg border bg-card/60 gap-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  {item.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.image}
                      alt={item.name}
                      className="size-10 rounded-md object-cover border shrink-0 bg-muted/20"
                    />
                  ) : (
                    <div className="size-10 rounded-md bg-primary/10 text-primary flex items-center justify-center shrink-0">
                      <Package className="size-5" />
                    </div>
                  )}
                  <div className="space-y-0.5 min-w-0">
                    <p className="text-xs font-semibold text-foreground truncate">
                      {item.name}
                    </p>
                    <p className="text-[11px] text-muted-foreground font-mono">
                      Qty: {item.quantity} × ${item.price.toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-xs font-bold font-mono">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Financial Breakdown */}
        <div className="space-y-2 p-4 rounded-xl border bg-muted/30">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-2">
            {t("dialog.orderSummary")}
          </span>

          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{t("dialog.subtotal")}</span>
            <span className="font-mono">${order.subtotal.toFixed(2)}</span>
          </div>

          {order.discount > 0 && (
            <div className="flex justify-between text-xs text-emerald-600 dark:text-emerald-400">
              <span>
                {t("dialog.discount")}{" "}
                {order.couponCode ? `(${order.couponCode})` : ""}
              </span>
              <span className="font-mono">-${order.discount.toFixed(2)}</span>
            </div>
          )}

          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{t("dialog.shipping")}</span>
            <span className="font-mono">
              {order.shipping === 0 ? "FREE" : `$${order.shipping.toFixed(2)}`}
            </span>
          </div>

          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{t("dialog.tax")}</span>
            <span className="font-mono">${order.tax.toFixed(2)}</span>
          </div>

          <div className="flex justify-between text-sm font-bold text-foreground pt-2 border-t">
            <span>{t("dialog.total")}</span>
            <span className="font-mono">${order.total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </AppSheet>
  )
}
