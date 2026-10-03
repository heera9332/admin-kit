"use client"

import * as React from "react"
import type { ColumnDef } from "@tanstack/react-table"
import {
  Eye,
  MoreHorizontal,
  Trash2,
  Check,
  RotateCcw,
  ExternalLink,
  ShoppingBag,
  ShieldAlert,
  UserPlus,
  FileText,
  ListTodo,
  Sparkles,
  Clock,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { DataTableColumnHeader } from "@/components/shared/data-table/data-table-column-header"
import type { NotificationItem, NotificationType } from "@/data/notifications"
import { cn } from "@/lib/utils"

export interface GetNotificationsColumnsOptions {
  onView?: (notification: NotificationItem) => void
  onUpdateReadStatus?: (id: string, read: boolean) => void
  onDelete?: (id: string) => void
  t?: (key: string, values?: Record<string, string | number>) => string
}

function getNotificationIcon(type: NotificationType) {
  switch (type) {
    case "order":
      return <ShoppingBag className="size-3.5 text-emerald-600 dark:text-emerald-400" />
    case "security":
      return <ShieldAlert className="size-3.5 text-rose-600 dark:text-rose-400" />
    case "user":
      return <UserPlus className="size-3.5 text-blue-600 dark:text-blue-400" />
    case "cms":
      return <FileText className="size-3.5 text-purple-600 dark:text-purple-400" />
    case "task":
      return <ListTodo className="size-3.5 text-amber-600 dark:text-amber-400" />
    case "system":
    default:
      return <Sparkles className="size-3.5 text-sky-600 dark:text-sky-400" />
  }
}

function getPriorityBadge(priority?: string) {
  switch (priority) {
    case "urgent":
    case "high":
      return (
        <Badge variant="destructive" className="text-[10px] uppercase font-mono tracking-wider h-5 px-1.5">
          {priority}
        </Badge>
      )
    case "medium":
      return (
        <Badge variant="outline" className="text-[10px] uppercase font-mono tracking-wider h-5 px-1.5 text-amber-600 border-amber-500/30 bg-amber-500/10">
          {priority}
        </Badge>
      )
    default:
      return (
        <Badge variant="secondary" className="text-[10px] uppercase font-mono tracking-wider h-5 px-1.5">
          {priority || "normal"}
        </Badge>
      )
  }
}

export function getNotificationsColumns({
  onView,
  onUpdateReadStatus,
  onDelete,
  t = (key) => key,
}: GetNotificationsColumnsOptions = {}): ColumnDef<NotificationItem>[] {
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
        <div onClick={(e) => e.stopPropagation()}>
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
            className="translate-y-0.5"
          />
        </div>
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "type",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("type")} />
      ),
      cell: ({ row }) => {
        const type = row.getValue<NotificationType>("type")
        return (
          <div className="flex items-center gap-1.5 capitalize text-xs font-medium">
            <div className="size-6 rounded-md bg-muted flex items-center justify-center border shrink-0">
              {getNotificationIcon(type)}
            </div>
            <span className="hidden sm:inline text-muted-foreground">{type}</span>
          </div>
        )
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id))
      },
    },
    {
      accessorKey: "title",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("title")} />
      ),
      cell: ({ row }) => {
        const item = row.original
        return (
          <div className="space-y-0.5 min-w-[220px] max-w-[420px]">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span
                className={cn(
                  "text-xs leading-snug",
                  item.read
                    ? "font-normal text-muted-foreground"
                    : "font-semibold text-foreground"
                )}
              >
                {item.title}
              </span>
              {!item.read && (
                <span className="size-1.5 rounded-full bg-primary shrink-0" />
              )}
            </div>
            <p className="text-[11px] text-muted-foreground line-clamp-1">
              {item.description}
            </p>
          </div>
        )
      },
    },
    {
      accessorKey: "priority",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("priority")} />
      ),
      cell: ({ row }) => {
        const priority = row.getValue<string | undefined>("priority")
        return getPriorityBadge(priority)
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id))
      },
    },
    {
      accessorKey: "timestamp",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("timestamp")} />
      ),
      cell: ({ row }) => {
        const item = row.original
        return (
          <div className="flex items-center gap-1 text-xs text-muted-foreground font-mono whitespace-nowrap">
            <Clock className="size-3" />
            <span>{item.timestamp}</span>
          </div>
        )
      },
    },
    {
      id: "readStatus",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("readStatus")} />
      ),
      cell: ({ row }) => {
        const item = row.original
        const isRead = item.read

        return (
          <div
            className="flex items-center gap-2 select-none"
            onClick={(e) => e.stopPropagation()}
          >
            <Badge
              variant={isRead ? "outline" : "default"}
              className={cn(
                "text-[10px] font-medium h-5 px-1.5 cursor-pointer",
                isRead
                  ? "text-muted-foreground bg-muted/30"
                  : "bg-primary text-primary-foreground"
              )}
              onClick={() => onUpdateReadStatus?.(item.id, !isRead)}
              title={t("updateReadStatus")}
            >
              {isRead ? t("read") : t("unread")}
            </Badge>

            <Switch
              checked={isRead}
              onCheckedChange={(checked) => onUpdateReadStatus?.(item.id, checked)}
              aria-label={t("updateReadStatus")}
              title={t("updateReadStatus")}
              className="scale-90"
            />
          </div>
        )
      },
      filterFn: (row, id, value) => {
        const isRead = row.original.read
        const readString = isRead ? "read" : "unread"
        return value.includes(readString)
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const item = row.original

        return (
          <div
            className="flex items-center justify-end"
            onClick={(e) => e.stopPropagation()}
          >
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-8 text-muted-foreground hover:text-foreground cursor-pointer"
                  />
                }
              >
                <MoreHorizontal className="size-4" />
                <span className="sr-only">Open menu</span>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 text-xs">
                <DropdownMenuLabel className="text-xs font-semibold text-muted-foreground">
                  {t("actions")}
                </DropdownMenuLabel>
                <DropdownMenuItem
                  onClick={() => onView?.(item)}
                  className="gap-2 cursor-pointer"
                >
                  <Eye className="size-3.5 text-muted-foreground" />
                  <span>{t("viewDetails")}</span>
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() => onUpdateReadStatus?.(item.id, !item.read)}
                  className="gap-2 cursor-pointer"
                >
                  {item.read ? (
                    <>
                      <RotateCcw className="size-3.5 text-muted-foreground" />
                      <span>{t("markAsUnread")}</span>
                    </>
                  ) : (
                    <>
                      <Check className="size-3.5 text-primary" />
                      <span>{t("markAsRead")}</span>
                    </>
                  )}
                </DropdownMenuItem>

                {item.link && (
                  <DropdownMenuItem
                    render={
                      <a
                        href={item.link}
                        target="_self"
                        className="gap-2 cursor-pointer flex items-center"
                      />
                    }
                  >
                    <ExternalLink className="size-3.5 text-muted-foreground" />
                    <span>{t("openResource")}</span>
                  </DropdownMenuItem>
                )}

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  onClick={() => onDelete?.(item.id)}
                  className="gap-2 text-destructive focus:text-destructive cursor-pointer"
                >
                  <Trash2 className="size-3.5" />
                  <span>{t("remove")}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )
      },
    },
  ]
}
