"use client"

import * as React from "react"
import { useTranslations } from "next-intl"
import type { ColumnDef } from "@tanstack/react-table"
import {
  Star,
  CheckCircle,
  XCircle,
  Trash2,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { StatusBadge } from "@/components/status-badge"
import { DataTable } from "@/components/shared/data-table"
import { DataTableColumnHeader } from "@/components/shared/data-table/data-table-column-header"
import { useEcommerce } from "@/context/ecommerce-provider"
import type { Review } from "@/data/ecommerce"

export function ReviewsFeature() {
  const t = useTranslations("ecommerce.reviews")
  const { reviews, updateReviewStatus, deleteReview } = useEcommerce()

  const columns = React.useMemo<ColumnDef<Review>[]>(
    () => [
      {
        accessorKey: "productName",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t("fields.product")} />
        ),
        cell: ({ row }) => (
          <div className="font-semibold text-xs text-foreground max-w-[200px] truncate">
            {row.original.productName}
          </div>
        ),
      },
      {
        accessorKey: "customerName",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t("fields.customer")} />
        ),
        cell: ({ row }) => (
          <div className="space-y-0.5 max-w-[160px]">
            <p className="text-xs font-medium text-foreground truncate">
              {row.original.customerName}
            </p>
            <p className="text-[11px] text-muted-foreground truncate font-mono">
              {row.original.customerEmail}
            </p>
          </div>
        ),
      },
      {
        accessorKey: "rating",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t("fields.rating")} />
        ),
        cell: ({ row }) => {
          const rating = row.original.rating
          return (
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`size-3.5 ${
                    i < rating
                      ? "text-amber-500 fill-amber-500"
                      : "text-muted stroke-muted-foreground/30"
                  }`}
                />
              ))}
            </div>
          )
        },
      },
      {
        accessorKey: "comment",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t("fields.review")} />
        ),
        cell: ({ row }) => {
          const review = row.original
          return (
            <div className="space-y-1 max-w-[360px]">
              <p className="text-xs font-semibold text-foreground truncate">
                {review.title}
              </p>
              <p className="text-xs text-muted-foreground line-clamp-2">
                {review.comment}
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
        accessorKey: "status",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t("fields.status")} />
        ),
        cell: ({ row }) => {
          const status = row.original.status
          return (
            <StatusBadge
              variant={
                status === "approved"
                  ? "success"
                  : status === "pending"
                    ? "warning"
                    : "destructive"
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
          const review = row.original
          return (
            <div className="flex items-center justify-end gap-1">
              {review.status !== "approved" && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="size-7 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-500/10 cursor-pointer"
                  onClick={() => updateReviewStatus(review.id, "approved")}
                  title={t("actions.approve")}
                >
                  <CheckCircle className="size-3.5" />
                </Button>
              )}

              {review.status !== "rejected" && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="size-7 text-amber-600 hover:text-amber-700 hover:bg-amber-500/10 cursor-pointer"
                  onClick={() => updateReviewStatus(review.id, "rejected")}
                  title={t("actions.reject")}
                >
                  <XCircle className="size-3.5" />
                </Button>
              )}

              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="size-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10 cursor-pointer"
                onClick={() => {
                  if (confirm("Are you sure you want to delete this review?")) {
                    deleteReview(review.id)
                  }
                }}
                title={t("actions.delete")}
              >
                <Trash2 className="size-3.5" />
              </Button>
            </div>
          )
        },
      },
    ],
    [t, updateReviewStatus, deleteReview]
  )

  const statusOptions = React.useMemo(
    () => [
      { label: t("statuses.approved"), value: "approved" },
      { label: t("statuses.pending"), value: "pending" },
      { label: t("statuses.rejected"), value: "rejected" },
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
        data={reviews}
        search={{
          placeholder: t("searchPlaceholder"),
          column: "productName",
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
    </div>
  )
}
