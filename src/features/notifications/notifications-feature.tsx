"use client"

import * as React from "react"
import { useTranslations } from "next-intl"
import {
  Bell,
  CheckCheck,
  Check,
  RotateCcw,
  Trash2,
  ShieldAlert,
  ShoppingBag,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DataTable } from "@/components/shared/data-table"
import { toast } from "@/components/ui/toast"
import { useNotifications, type NotificationItem } from "@/context/notifications-provider"
import { getNotificationsColumns } from "./notifications-columns"
import { NotificationDetailSheet } from "./components/notification-detail-sheet"

export function NotificationsFeature() {
  const t = useTranslations("notifications")
  const {
    notifications,
    unreadCount,
    updateReadStatus,
    batchUpdateReadStatus,
    markAllAsRead,
    removeNotification,
    clearAll,
  } = useNotifications()

  const [selectedNotification, setSelectedNotification] =
    React.useState<NotificationItem | null>(null)
  const [sheetOpen, setSheetOpen] = React.useState(false)
  const [activeTab, setActiveTab] = React.useState("all")
  const [selectedRowIds, setSelectedRowIds] = React.useState<string[]>([])

  const handleView = React.useCallback((item: NotificationItem) => {
    setSelectedNotification(item)
    setSheetOpen(true)
  }, [])

  const handleUpdateReadStatus = React.useCallback(
    (id: string, read: boolean) => {
      // Strictly update only the read status
      updateReadStatus(id, read)
      if (selectedNotification?.id === id) {
        setSelectedNotification((prev) => (prev ? { ...prev, read } : null))
      }
      toast.add({
        title: t("onlyReadStatusUpdated"),
        description: t("readStatusUpdated", {
          status: read ? t("read").toLowerCase() : t("unread").toLowerCase(),
        }),
      })
    },
    [updateReadStatus, selectedNotification, t]
  )

  const handleDelete = React.useCallback(
    (id: string) => {
      removeNotification(id)
      if (selectedNotification?.id === id) {
        setSelectedNotification(null)
        setSheetOpen(false)
      }
      toast.add({
        title: t("deletedSuccess"),
      })
    },
    [removeNotification, selectedNotification, t]
  )

  const handleBatchUpdate = React.useCallback(
    (read: boolean) => {
      if (selectedRowIds.length === 0) return
      batchUpdateReadStatus(selectedRowIds, read)
      toast.add({
        title: t("onlyReadStatusUpdated"),
        description: t("batchReadUpdated", {
          count: selectedRowIds.length,
          status: read ? t("read").toLowerCase() : t("unread").toLowerCase(),
        }),
      })
      setSelectedRowIds([])
    },
    [selectedRowIds, batchUpdateReadStatus, t]
  )

  const handleBatchDelete = React.useCallback(() => {
    if (selectedRowIds.length === 0) return
    selectedRowIds.forEach((id) => removeNotification(id))
    toast.add({
      title: t("deletedSuccess"),
      description: `${selectedRowIds.length} notifications deleted.`,
    })
    setSelectedRowIds([])
  }, [selectedRowIds, removeNotification, t])

  const filteredData = React.useMemo(() => {
    switch (activeTab) {
      case "unread":
        return notifications.filter((n) => !n.read)
      case "read":
        return notifications.filter((n) => n.read)
      case "orders":
        return notifications.filter((n) => n.type === "order")
      case "security":
        return notifications.filter((n) => n.type === "security")
      case "system":
        return notifications.filter((n) => n.type === "system")
      case "all":
      default:
        return notifications
    }
  }, [notifications, activeTab])

  // Overview metrics
  const securityCount = React.useMemo(
    () => notifications.filter((n) => n.type === "security").length,
    [notifications]
  )
  const orderCount = React.useMemo(
    () => notifications.filter((n) => n.type === "order").length,
    [notifications]
  )
  const readCount = React.useMemo(
    () => notifications.filter((n) => n.read).length,
    [notifications]
  )

  const columns = React.useMemo(
    () =>
      getNotificationsColumns({
        onView: handleView,
        onUpdateReadStatus: handleUpdateReadStatus,
        onDelete: handleDelete,
        t,
      }),
    [handleView, handleUpdateReadStatus, handleDelete, t]
  )

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight">{t("title")}</h1>
            {unreadCount > 0 && (
              <Badge variant="destructive" className="font-mono text-xs">
                {t("unreadBadge", { count: unreadCount })}
              </Badge>
            )}
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground">
            {t("subtitle")}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {unreadCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                markAllAsRead()
                toast.add({
                  title: t("onlyReadStatusUpdated"),
                  description: "All notifications marked as read.",
                })
              }}
              className="text-xs gap-1.5 cursor-pointer shadow-xs"
            >
              <CheckCheck className="size-3.5 text-primary" />
              <span>{t("markAllRead")}</span>
            </Button>
          )}

          {notifications.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                clearAll()
                toast.add({
                  title: t("deletedSuccess"),
                  description: "All notifications cleared.",
                })
              }}
              className="text-xs gap-1.5 text-muted-foreground hover:text-destructive cursor-pointer"
            >
              <Trash2 className="size-3.5" />
              <span>{t("clearAll")}</span>
            </Button>
          )}
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Card className="shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-1 pt-3.5 px-4 space-y-0">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              Total Alerts
            </CardTitle>
            <Bell className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="px-4 pb-3.5 pt-0">
            <div className="text-xl sm:text-2xl font-bold">{notifications.length}</div>
            <p className="text-[10px] text-muted-foreground font-mono mt-0.5">
              Across all categories
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-xs border-primary/30 bg-primary/5">
          <CardHeader className="flex flex-row items-center justify-between pb-1 pt-3.5 px-4 space-y-0">
            <CardTitle className="text-xs font-medium text-primary">
              Unread
            </CardTitle>
            <span className="size-2 rounded-full bg-primary animate-pulse" />
          </CardHeader>
          <CardContent className="px-4 pb-3.5 pt-0">
            <div className="text-xl sm:text-2xl font-bold text-primary">{unreadCount}</div>
            <p className="text-[10px] text-muted-foreground font-mono mt-0.5">
              Requires review
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-1 pt-3.5 px-4 space-y-0">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              Security
            </CardTitle>
            <ShieldAlert className="size-4 text-rose-500" />
          </CardHeader>
          <CardContent className="px-4 pb-3.5 pt-0">
            <div className="text-xl sm:text-2xl font-bold">{securityCount}</div>
            <p className="text-[10px] text-muted-foreground font-mono mt-0.5">
              Auth & login events
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-1 pt-3.5 px-4 space-y-0">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              Commerce
            </CardTitle>
            <ShoppingBag className="size-4 text-emerald-500" />
          </CardHeader>
          <CardContent className="px-4 pb-3.5 pt-0">
            <div className="text-xl sm:text-2xl font-bold">{orderCount}</div>
            <p className="text-[10px] text-muted-foreground font-mono mt-0.5">
              Orders & payments
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Area */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full space-y-4"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b pb-2">
          <TabsList className="bg-muted/40 p-1 rounded-lg h-9 w-fit">
            <TabsTrigger value="all" className="text-xs px-3 h-7">
              <span>{t("tabAll")}</span>
              <span className="ml-1 text-[10px] text-muted-foreground">
                ({notifications.length})
              </span>
            </TabsTrigger>
            <TabsTrigger value="unread" className="text-xs px-3 h-7">
              <span>{t("tabUnread")}</span>
              {unreadCount > 0 && (
                <span className="ml-1.5 px-1.5 py-0.2 rounded-full bg-primary text-primary-foreground text-[9px] font-bold">
                  {unreadCount}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="read" className="text-xs px-3 h-7">
              <span>{t("tabRead")}</span>
              <span className="ml-1 text-[10px] text-muted-foreground">
                ({readCount})
              </span>
            </TabsTrigger>
            <TabsTrigger value="orders" className="text-xs px-3 h-7">
              <span>{t("tabOrders")}</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="text-xs px-3 h-7">
              <span>{t("tabSecurity")}</span>
            </TabsTrigger>
            <TabsTrigger value="system" className="text-xs px-3 h-7">
              <span>{t("tabSystem")}</span>
            </TabsTrigger>
          </TabsList>

          <div className="text-xs text-muted-foreground font-mono">
            Showing {filteredData.length} of {notifications.length}
          </div>
        </div>

        {/* Selected Rows Bulk Actions Bar */}
        {selectedRowIds.length > 0 && (
          <div className="flex items-center justify-between p-3 rounded-xl border bg-primary/5 text-xs animate-in fade-in-50">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-primary">
                {selectedRowIds.length} selected
              </span>
              <span className="text-muted-foreground">•</span>
              <span className="text-muted-foreground">
                {t("updateReadStatus")}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleBatchUpdate(true)}
                className="text-xs gap-1.5 h-7 cursor-pointer"
              >
                <Check className="size-3.5 text-primary" />
                <span>{t("markSelectedRead")}</span>
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => handleBatchUpdate(false)}
                className="text-xs gap-1.5 h-7 cursor-pointer"
              >
                <RotateCcw className="size-3.5 text-muted-foreground" />
                <span>{t("markSelectedUnread")}</span>
              </Button>

              <Button
                variant="destructive"
                size="sm"
                onClick={handleBatchDelete}
                className="text-xs gap-1.5 h-7 cursor-pointer"
              >
                <Trash2 className="size-3.5" />
                <span>{t("deleteSelected")}</span>
              </Button>
            </div>
          </div>
        )}

        <TabsContent value={activeTab} className="m-0 focus-visible:outline-none">
          <DataTable
            columns={columns}
            data={filteredData}
            search={{
              column: "title",
              placeholder: t("searchPlaceholder"),
            }}
            pagination={{
              pageSize: 10,
              pageSizeOptions: [10, 20, 50],
            }}
            sorting={true}
            onRowClick={handleView}
            emptyMessage={t("emptyFilterTitle")}
          />
        </TabsContent>
      </Tabs>

      {/* Notification Detail Sheet */}
      <NotificationDetailSheet
        notification={selectedNotification}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        onUpdateReadStatus={handleUpdateReadStatus}
        onDelete={handleDelete}
      />
    </div>
  )
}
