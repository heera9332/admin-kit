"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Copy, Eye, MoreHorizontal, Pencil, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DataTableColumnHeader } from "@/components/shared/data-table/data-table-column-header";

export type User = {
  id: string;
  name: string;
  email: string;
  role: "admin" | "manager" | "cashier";
  status: "active" | "inactive";
};

export interface GetUserColumnsOptions {
  onView?: (user: User) => void;
  onEdit?: (user: User) => void;
  onDelete?: (user: User) => void;
  t?: (key: string) => string;
}

export function getUserColumns({
  onView,
  onEdit,
  onDelete,
  t = (key) => key,
}: GetUserColumnsOptions = {}): ColumnDef<User>[] {
  const getRoleLabel = (role: User["role"]) => {
    switch (role) {
      case "admin":
        return t("roles.admin");
      case "manager":
        return t("roles.manager");
      case "cashier":
        return t("roles.cashier");
      default:
        return role;
    }
  };

  const getStatusLabel = (status: User["status"]) => {
    switch (status) {
      case "active":
        return t("statuses.active");
      case "inactive":
        return t("statuses.inactive");
      default:
        return status;
    }
  };

  return [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          indeterminate={table.getIsSomePageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
          className="translate-y-0.5"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="translate-y-0.5"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("fields.name")} />
      ),
    },
    {
      accessorKey: "email",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("fields.email")} />
      ),
    },
    {
      accessorKey: "role",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("fields.role")} />
      ),
      cell: ({ row }) => {
        const role = row.getValue<User["role"]>("role");
        return (
          <Badge variant="outline" className="capitalize text-xs font-normal">
            {getRoleLabel(role)}
          </Badge>
        );
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      },
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("fields.status")} />
      ),
      cell: ({ row }) => {
        const status = row.getValue<User["status"]>("status");
        return (
          <Badge
            variant={status === "active" ? "default" : "secondary"}
            className="capitalize text-xs font-normal"
          >
            {getStatusLabel(status)}
          </Badge>
        );
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      },
    },
    {
      id: "actions",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("fields.actions")} />
      ),
      cell: ({ row }) => {
        const user = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button variant="ghost" size="icon" className="size-8 ml-auto" />
              }
            >
              <MoreHorizontal className="size-4" />
              <span className="sr-only">Open menu</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="text-xs w-36">
              <DropdownMenuLabel className="text-xs font-semibold">{t("fields.actions")}</DropdownMenuLabel>
              {onView && (
                <DropdownMenuItem
                  onClick={() => onView(user)}
                  className="gap-2 cursor-pointer"
                >
                  <Eye className="size-3.5" />
                  <span>{t("actions.view")}</span>
                </DropdownMenuItem>
              )}
              {onEdit && (
                <DropdownMenuItem
                  onClick={() => onEdit(user)}
                  className="gap-2 cursor-pointer"
                >
                  <Pencil className="size-3.5" />
                  <span>{t("actions.edit")}</span>
                </DropdownMenuItem>
              )}
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(user.id)}
                className="gap-2 cursor-pointer"
              >
                <Copy className="size-3.5" />
                <span>{t("actions.copyId")}</span>
              </DropdownMenuItem>
              {onDelete && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => onDelete(user)}
                    className="gap-2 text-destructive focus:text-destructive cursor-pointer"
                  >
                    <Trash2 className="size-3.5" />
                    <span>{t("actions.delete")}</span>
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
}

export const userColumns = getUserColumns();
