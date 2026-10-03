"use client"

import * as React from "react"
import { useTranslations } from "next-intl"
import {
  Bell,
  CheckCheck,
  Check,
  Trash2,
  Settings,
  ShoppingBag,
  ShieldAlert,
  UserPlus,
  FileText,
  ListTodo,
  Sparkles,
  ArrowRight,
  BellOff,
  Clock,
} from "lucide-react"

import { Button, buttonVariants } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
} from "@/components/ui/empty"
import {
  useNotifications,
  type NotificationItem,
  type NotificationType,
} from "@/context/notifications-provider"
import { Link, useRouter } from "@/i18n/routing"
import { cn } from "@/lib/utils"

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

function getNotificationBadgeBg(type: NotificationType) {
  switch (type) {
    case "order":
      return "bg-emerald-500/10 border-emerald-500/20"
    case "security":
      return "bg-rose-500/10 border-rose-500/20"
    case "user":
      return "bg-blue-500/10 border-blue-500/20"
    case "cms":
      return "bg-purple-500/10 border-purple-500/20"
    case "task":
      return "bg-amber-500/10 border-amber-500/20"
    case "system":
    default:
      return "bg-sky-500/10 border-sky-500/20"
  }
}

interface NotificationRowProps {
  item: NotificationItem
  onMarkAsRead: (id: string) => void
  onMarkAsUnread: (id: string) => void
  onRemove: (id: string) => void
  onClosePopover: () => void
  t: (key: string, values?: Record<string, string | number>) => string
}

function NotificationRow({
  item,
  onMarkAsRead,
  onMarkAsUnread,
  onRemove,
  onClosePopover,
  t,
}: NotificationRowProps) {
  const router = useRouter()

  const handleClick = () => {
    if (!item.read) {
      onMarkAsRead(item.id)
    }
    if (item.link) {
      onClosePopover()
      router.push(item.link)
    }
  }

  return (
    <div
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          handleClick()
        }
      }}
      className={cn(
        "group relative flex items-start gap-3 p-3.5 text-left transition-colors border-b last:border-b-0 cursor-pointer select-none outline-none focus-visible:bg-muted/60",
        item.read
          ? "hover:bg-muted/40 text-muted-foreground opacity-80 hover:opacity-100"
          : "bg-muted/20 hover:bg-muted/50 text-foreground"
      )}
    >
      {/* Icon Pill */}
      <div
        className={cn(
          "size-8 rounded-lg flex items-center justify-center shrink-0 border mt-0.5",
          getNotificationBadgeBg(item.type)
        )}
      >
        {getNotificationIcon(item.type)}
      </div>

      {/* Main Content */}
      <div className="flex-1 min-w-0 pr-12">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span
            className={cn(
              "text-xs leading-snug line-clamp-1",
              item.read ? "font-medium text-foreground/80" : "font-semibold text-foreground"
            )}
          >
            {item.title}
          </span>
          {!item.read && (
            <span className="size-1.5 rounded-full bg-primary shrink-0" />
          )}
          {item.priority === "urgent" || item.priority === "high" ? (
            <Badge
              variant="destructive"
              className="text-[9px] h-3.5 px-1 font-mono uppercase tracking-wider"
            >
              {item.priority}
            </Badge>
          ) : null}
        </div>

        <p className="text-[11px] leading-relaxed text-muted-foreground line-clamp-2 mt-0.5">
          {item.description}
        </p>

        <div className="flex items-center gap-1 text-[10px] text-muted-foreground/75 mt-1.5 font-mono">
          <Clock className="size-3" />
          <span>{item.timestamp}</span>
        </div>
      </div>

      {/* Actions (hover / focus) */}
      <div
        className="absolute top-3 right-3 flex items-center gap-0.5 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity"
        onClick={(e) => e.stopPropagation()}
      >
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-6 text-muted-foreground hover:text-foreground cursor-pointer rounded-md"
          title={item.read ? t("markAsUnread") : t("markAsRead")}
          aria-label={item.read ? t("markAsUnread") : t("markAsRead")}
          onClick={() => {
            if (item.read) {
              onMarkAsUnread(item.id)
            } else {
              onMarkAsRead(item.id)
            }
          }}
        >
          <Check className={cn("size-3.5", item.read ? "text-muted-foreground" : "text-primary")} />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-6 text-muted-foreground hover:text-destructive cursor-pointer rounded-md"
          title={t("remove")}
          aria-label={t("remove")}
          onClick={() => onRemove(item.id)}
        >
          <Trash2 className="size-3.5" />
        </Button>
      </div>
    </div>
  )
}

export function NotificationPanel() {
  const t = useTranslations("notifications")
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAsUnread,
    markAllAsRead,
    removeNotification,
    clearAll,
  } = useNotifications()

  const [open, setOpen] = React.useState(false)
  const [activeTab, setActiveTab] = React.useState("all")

  const unreadNotifications = React.useMemo(() => {
    return notifications.filter((n) => !n.read)
  }, [notifications])

  const orderNotifications = React.useMemo(() => {
    return notifications.filter((n) => n.type === "order")
  }, [notifications])

  const securityNotifications = React.useMemo(() => {
    return notifications.filter((n) => n.type === "security")
  }, [notifications])

  const getFilteredList = (tab: string) => {
    switch (tab) {
      case "unread":
        return unreadNotifications
      case "orders":
        return orderNotifications
      case "security":
        return securityNotifications
      case "all":
      default:
        return notifications
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className="relative size-8 rounded-full text-muted-foreground hover:text-foreground cursor-pointer"
            aria-label={t("title")}
            title={t("title")}
          />
        }
      >
        <Bell className="size-4" />
        {unreadCount > 0 && (
          <>
            <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[9px] font-bold text-white shadow-xs animate-in zoom-in-50">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
            <span className="absolute top-0 right-0 size-2 rounded-full bg-rose-400 animate-ping opacity-75 pointer-events-none" />
          </>
        )}
      </PopoverTrigger>

      <PopoverContent
        align="end"
        sideOffset={8}
        className="w-[calc(100vw-2rem)] sm:w-96 p-0 max-h-[85vh] flex flex-col shadow-xl border overflow-hidden rounded-xl bg-popover"
      >
        {/* Panel Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b bg-muted/20">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-semibold tracking-tight">{t("title")}</h4>
            {unreadCount > 0 && (
              <Badge variant="secondary" className="text-[10px] h-5 px-1.5 font-medium">
                {t("unreadBadge", { count: unreadCount })}
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-1">
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-xs px-2 gap-1 text-muted-foreground hover:text-foreground cursor-pointer"
                onClick={() => markAllAsRead()}
                title={t("markAllRead")}
              >
                <CheckCheck className="size-3.5 text-primary" />
                <span className="hidden xs:inline">{t("markAllRead")}</span>
              </Button>
            )}

            <Link
              href="/dashboard/settings/notifications"
              onClick={() => setOpen(false)}
              className={cn(
                buttonVariants({ variant: "ghost", size: "icon" }),
                "size-7 text-muted-foreground hover:text-foreground cursor-pointer rounded-md"
              )}
              title={t("settings")}
              aria-label={t("settings")}
            >
              <Settings className="size-3.5" />
            </Link>
          </div>
        </div>

        {/* Filter Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="flex-1 flex flex-col min-h-0"
        >
          <div className="border-b px-3 bg-muted/10">
            <TabsList className="w-full justify-start rounded-none bg-transparent p-0 h-9 gap-1">
              <TabsTrigger
                value="all"
                className="text-xs h-7 px-2.5 rounded-md data-active:bg-background data-active:shadow-2xs"
              >
                <span>{t("tabAll")}</span>
                <span className="ml-1 text-[10px] text-muted-foreground">
                  ({notifications.length})
                </span>
              </TabsTrigger>
              <TabsTrigger
                value="unread"
                className="text-xs h-7 px-2.5 rounded-md data-active:bg-background data-active:shadow-2xs"
              >
                <span>{t("tabUnread")}</span>
                {unreadCount > 0 && (
                  <span className="ml-1 size-1.5 rounded-full bg-rose-500 inline-block" />
                )}
              </TabsTrigger>
              <TabsTrigger
                value="orders"
                className="text-xs h-7 px-2.5 rounded-md data-active:bg-background data-active:shadow-2xs"
              >
                <span>{t("tabOrders")}</span>
              </TabsTrigger>
              <TabsTrigger
                value="security"
                className="text-xs h-7 px-2.5 rounded-md data-active:bg-background data-active:shadow-2xs"
              >
                <span>{t("tabSecurity")}</span>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Tab Panes */}
          {["all", "unread", "orders", "security"].map((tabKey) => {
            const list = getFilteredList(tabKey)
            const isUnreadTab = tabKey === "unread"

            return (
              <TabsContent
                key={tabKey}
                value={tabKey}
                className="flex-1 m-0 focus-visible:outline-none"
              >
                <ScrollArea className="h-80 w-full">
                  {list.length === 0 ? (
                    <Empty className="py-12 px-4 border-0">
                      <EmptyMedia variant="icon" className="size-10 bg-muted/60">
                        <BellOff className="size-5 text-muted-foreground" />
                      </EmptyMedia>
                      <EmptyHeader>
                        <EmptyTitle className="text-xs font-semibold">
                          {isUnreadTab ? t("emptyUnreadTitle") : t("emptyAllTitle")}
                        </EmptyTitle>
                        <EmptyDescription className="text-[11px] max-w-[240px]">
                          {isUnreadTab ? t("emptyUnreadDesc") : t("emptyAllDesc")}
                        </EmptyDescription>
                      </EmptyHeader>
                    </Empty>
                  ) : (
                    <div>
                      {list.map((item) => (
                        <NotificationRow
                          key={item.id}
                          item={item}
                          onMarkAsRead={markAsRead}
                          onMarkAsUnread={markAsUnread}
                          onRemove={removeNotification}
                          onClosePopover={() => setOpen(false)}
                          t={t}
                        />
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </TabsContent>
            )
          })}
        </Tabs>

        {/* Panel Footer */}
        <div className="flex items-center justify-between px-4 py-2.5 border-t bg-muted/20 text-xs">
          {notifications.length > 0 ? (
            <button
              type="button"
              onClick={() => clearAll()}
              className="text-[11px] text-muted-foreground hover:text-destructive transition-colors cursor-pointer"
            >
              {t("clearAll")}
            </button>
          ) : (
            <span />
          )}

          <Link
            href="/dashboard/notifications"
            onClick={() => setOpen(false)}
            className="inline-flex items-center gap-1 text-[11px] font-medium text-primary hover:underline cursor-pointer ml-auto"
          >
            <span>{t("viewAll")}</span>
            <ArrowRight className="size-3" />
          </Link>
        </div>
      </PopoverContent>
    </Popover>
  )
}
