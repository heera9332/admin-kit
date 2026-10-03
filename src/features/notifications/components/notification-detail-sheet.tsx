"use client"

import * as React from "react"
import { useTranslations } from "next-intl"
import {
  Clock,
  ExternalLink,
  Trash2,
  Check,
  RotateCcw,
  ShoppingBag,
  ShieldAlert,
  UserPlus,
  FileText,
  ListTodo,
  Sparkles,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { AppSheet } from "@/components/app-sheet"
import { Link } from "@/i18n/routing"
import { toast } from "@/components/ui/toast"
import { cn } from "@/lib/utils"
import type { NotificationItem, NotificationType } from "@/data/notifications"

interface NotificationDetailSheetProps {
  notification: NotificationItem | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpdateReadStatus: (id: string, read: boolean) => void
  onDelete?: (id: string) => void
}

function getNotificationIcon(type: NotificationType) {
  switch (type) {
    case "order":
      return <ShoppingBag className="size-4 text-emerald-600 dark:text-emerald-400" />
    case "security":
      return <ShieldAlert className="size-4 text-rose-600 dark:text-rose-400" />
    case "user":
      return <UserPlus className="size-4 text-blue-600 dark:text-blue-400" />
    case "cms":
      return <FileText className="size-4 text-purple-600 dark:text-purple-400" />
    case "task":
      return <ListTodo className="size-4 text-amber-600 dark:text-amber-400" />
    case "system":
    default:
      return <Sparkles className="size-4 text-sky-600 dark:text-sky-400" />
  }
}

function getPriorityBadge(priority?: string) {
  switch (priority) {
    case "urgent":
    case "high":
      return (
        <Badge variant="destructive" className="text-[10px] uppercase font-mono tracking-wider">
          {priority}
        </Badge>
      )
    case "medium":
      return (
        <Badge variant="outline" className="text-[10px] uppercase font-mono tracking-wider text-amber-600 border-amber-500/30 bg-amber-500/10">
          {priority}
        </Badge>
      )
    default:
      return (
        <Badge variant="secondary" className="text-[10px] uppercase font-mono tracking-wider">
          {priority || "normal"}
        </Badge>
      )
  }
}

export function NotificationDetailSheet({
  notification,
  open,
  onOpenChange,
  onUpdateReadStatus,
  onDelete,
}: NotificationDetailSheetProps) {
  const t = useTranslations("notifications")

  if (!notification) return null

  const handleToggleRead = (checked: boolean) => {
    // Strictly update only the read status
    onUpdateReadStatus(notification.id, checked)
    toast.add({
      title: t("onlyReadStatusUpdated"),
      description: t("readStatusUpdated", {
        status: checked ? t("read").toLowerCase() : t("unread").toLowerCase(),
      }),
    })
  }

  const handleDelete = () => {
    onDelete?.(notification.id)
    onOpenChange(false)
    toast.add({
      title: t("deletedSuccess"),
      description: `"${notification.title}" has been deleted.`,
    })
  }

  return (
    <AppSheet
      open={open}
      onOpenChange={onOpenChange}
      size="md"
      title={
        <div className="flex items-center gap-2">
          <div className="size-8 rounded-lg bg-muted flex items-center justify-center border">
            {getNotificationIcon(notification.type)}
          </div>
          <div className="min-w-0">
            <h3 className="text-sm font-semibold tracking-tight truncate">
              {t("detailTitle")}
            </h3>
            <p className="text-xs text-muted-foreground font-normal">
              {notification.id}
            </p>
          </div>
        </div>
      }
      description={t("detailDesc")}
      footer={
        <div className="flex items-center justify-between w-full gap-2 pt-2">
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={handleDelete}
            className="text-xs gap-1.5 cursor-pointer"
          >
            <Trash2 className="size-3.5" />
            <span>{t("remove")}</span>
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => handleToggleRead(!notification.read)}
            className="text-xs gap-1.5 cursor-pointer"
          >
            {notification.read ? (
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
          </Button>
        </div>
      }
    >
      <div className="space-y-5 py-2">
        {/* Read / Update Status Action Card */}
        <div className="rounded-xl border p-4 bg-muted/20 space-y-3">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="notification-read-switch" className="text-xs font-semibold cursor-pointer">
                {t("readStatus")}
              </Label>
              <p className="text-[11px] text-muted-foreground">
                {t("updateReadStatus")}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Badge
                variant={notification.read ? "outline" : "default"}
                className={cn(
                  "text-xs font-medium px-2 py-0.5",
                  notification.read
                    ? "text-muted-foreground bg-muted/40"
                    : "bg-primary text-primary-foreground"
                )}
              >
                {notification.read ? t("read") : t("unread")}
              </Badge>

              <Switch
                id="notification-read-switch"
                checked={notification.read}
                onCheckedChange={handleToggleRead}
              />
            </div>
          </div>

          <div className="text-[10px] text-muted-foreground font-mono bg-background/60 p-2 rounded-lg border">
            ℹ️ <span className="font-medium text-foreground">{t("onlyReadStatusUpdated")}</span>: Mutating this field toggles only the alert read flag without affecting timestamp, title, or resource links.
          </div>
        </div>

        {/* Notification Information */}
        <div className="space-y-3.5">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-mono text-muted-foreground block">
              Title
            </span>
            <p className="text-sm font-semibold text-foreground">
              {notification.title}
            </p>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] uppercase font-mono text-muted-foreground block">
              Message
            </span>
            <p className="text-xs leading-relaxed text-muted-foreground bg-muted/10 p-3 rounded-lg border">
              {notification.description}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-mono text-muted-foreground block">
                {t("type")}
              </span>
              <div className="flex items-center gap-1.5 capitalize text-xs font-medium text-foreground">
                {getNotificationIcon(notification.type)}
                <span>{notification.type}</span>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] uppercase font-mono text-muted-foreground block">
                {t("priority")}
              </span>
              <div>{getPriorityBadge(notification.priority)}</div>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] uppercase font-mono text-muted-foreground block">
                {t("timestamp")}
              </span>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="size-3" />
                <span>{notification.timestamp}</span>
              </div>
            </div>

            {notification.createdAt && (
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-mono text-muted-foreground block">
                  ISO Date
                </span>
                <span className="text-[11px] font-mono text-muted-foreground truncate block">
                  {notification.createdAt}
                </span>
              </div>
            )}
          </div>

          {/* Action Link if provided */}
          {notification.link && (
            <div className="pt-2">
              <Link
                href={notification.link}
                onClick={() => onOpenChange(false)}
                className="inline-flex items-center justify-center gap-2 w-full px-3 py-2 text-xs font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-2xs"
              >
                <ExternalLink className="size-3.5" />
                <span>{t("openResource")}</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </AppSheet>
  )
}
