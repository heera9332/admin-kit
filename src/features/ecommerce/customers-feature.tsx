"use client"

import * as React from "react"
import { useTranslations } from "next-intl"
import type { ColumnDef } from "@tanstack/react-table"
import {
  Plus,
  MoreHorizontal,
  Pencil,
  Trash2,
  Eye,
  MapPin,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
import type { Customer } from "@/data/ecommerce"
import {
  CreateCustomerDialog,
  EditCustomerDialog,
  ViewCustomerSheet,
} from "./components/customer-dialogs"

export function CustomersFeature() {
  const t = useTranslations("ecommerce.customers")
  const { customers, addCustomer, updateCustomer, deleteCustomer } = useEcommerce()

  const [createOpen, setCreateOpen] = React.useState(false)
  const [viewOpen, setViewOpen] = React.useState(false)
  const [selectedCustomer, setSelectedCustomer] = React.useState<Customer | null>(null)
  const [editingCustomer, setEditingCustomer] = React.useState<Customer | null>(null)

  const handleView = React.useCallback((customer: Customer) => {
    setSelectedCustomer(customer)
    setViewOpen(true)
  }, [])

  const handleEdit = React.useCallback((customer: Customer) => {
    setEditingCustomer(customer)
  }, [])

  const columns = React.useMemo<ColumnDef<Customer>[]>(
    () => [
      {
        accessorKey: "name",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t("fields.name")} />
        ),
        cell: ({ row }) => {
          const customer = row.original
          const initials = customer.name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .slice(0, 2)
            .toUpperCase()
          return (
            <div className="flex items-center gap-3 max-w-[240px]">
              <Avatar className="size-8">
                <AvatarImage src={customer.avatar} alt={customer.name} />
                <AvatarFallback className="text-[10px] bg-primary/10 text-primary">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-0.5 min-w-0">
                <button
                  type="button"
                  onClick={() => handleView(customer)}
                  className="font-semibold text-xs text-foreground hover:text-primary transition-colors text-left block truncate cursor-pointer"
                >
                  {customer.name}
                </button>
                <div className="text-[11px] text-muted-foreground truncate font-mono">
                  {customer.email}
                </div>
              </div>
            </div>
          )
        },
      },
      {
        accessorKey: "phone",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t("fields.phone")} />
        ),
        cell: ({ row }) => (
          <span className="text-xs text-muted-foreground font-mono">
            {row.original.phone || "—"}
          </span>
        ),
      },
      {
        accessorKey: "city",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t("fields.location")} />
        ),
        cell: ({ row }) => (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <MapPin className="size-3 shrink-0" />
            <span className="truncate max-w-[150px]">
              {row.original.city}, {row.original.country}
            </span>
          </div>
        ),
      },
      {
        accessorKey: "ordersCount",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t("fields.ordersCount")} />
        ),
        cell: ({ row }) => (
          <span className="text-xs font-mono font-medium">
            {row.original.ordersCount} orders
          </span>
        ),
      },
      {
        accessorKey: "totalSpent",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t("fields.totalSpent")} />
        ),
        cell: ({ row }) => (
          <span className="text-xs font-bold font-mono text-foreground">
            ${row.original.totalSpent.toFixed(2)}
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
            <StatusBadge variant={status === "active" ? "success" : "neutral"} size="sm">
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
          const customer = row.original
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
                    onClick={() => handleView(customer)}
                    className="gap-2 cursor-pointer text-xs"
                  >
                    <Eye className="size-3.5" />
                    <span>View Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleEdit(customer)}
                    className="gap-2 cursor-pointer text-xs"
                  >
                    <Pencil className="size-3.5" />
                    <span>Edit</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      if (confirm(t("dialog.deleteConfirm"))) {
                        deleteCustomer(customer.id)
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
    [t, handleView, handleEdit, deleteCustomer]
  )

  const statusOptions = React.useMemo(
    () => [
      { label: t("statuses.active"), value: "active" },
      { label: t("statuses.inactive"), value: "inactive" },
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
          <span>{t("newCustomer")}</span>
        </Button>
      </div>

      {/* DataTable */}
      <DataTable
        columns={columns}
        data={customers}
        search={{
          placeholder: t("searchPlaceholder"),
          column: "name",
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

      <CreateCustomerDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onCreate={addCustomer}
      />

      <EditCustomerDialog
        customer={editingCustomer}
        open={Boolean(editingCustomer)}
        onOpenChange={(open) => !open && setEditingCustomer(null)}
        onUpdate={updateCustomer}
      />

      <ViewCustomerSheet
        customer={selectedCustomer}
        open={viewOpen}
        onOpenChange={setViewOpen}
        onEdit={(c) => setEditingCustomer(c)}
        onDelete={deleteCustomer}
      />
    </div>
  )
}
