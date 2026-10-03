"use client"

import * as React from "react"
import {
  initialNotifications,
  type NotificationItem,
  type NotificationType,
  type NotificationPriority,
} from "@/data/notifications"

interface NotificationsContextType {
  notifications: NotificationItem[]
  unreadCount: number
  markAsRead: (id: string) => void
  markAsUnread: (id: string) => void
  updateReadStatus: (id: string, read: boolean) => void
  toggleReadStatus: (id: string) => void
  batchUpdateReadStatus: (ids: string[], read: boolean) => void
  markAllAsRead: () => void
  removeNotification: (id: string) => void
  clearAll: () => void
  addNotification: (
    item: Omit<NotificationItem, "id"> & { id?: string }
  ) => void
}

const NotificationsContext = React.createContext<
  NotificationsContextType | undefined
>(undefined)

const NOTIFICATIONS_STORAGE_KEY = "admin_notifications"

let memoryNotifications: NotificationItem[] = initialNotifications
let isInitialized = false

function initStorage() {
  if (isInitialized || typeof window === "undefined") return
  try {
    const saved = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY)
    if (saved) {
      const parsed = JSON.parse(saved)
      if (Array.isArray(parsed) && parsed.length > 0) {
        memoryNotifications = parsed
      }
    }
  } catch {
    // Ignore localStorage parse errors
  }
  isInitialized = true
}

const listeners = new Set<() => void>()

function subscribe(callback: () => void) {
  listeners.add(callback)
  return () => {
    listeners.delete(callback)
  }
}

function notify() {
  listeners.forEach((l) => l())
}

function persistNotifications(notifications: NotificationItem[]) {
  memoryNotifications = notifications
  notify()
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(
        NOTIFICATIONS_STORAGE_KEY,
        JSON.stringify(notifications)
      )
    } catch {
      // Ignore write errors
    }
  }
}

export function NotificationsProvider({
  children,
}: {
  children: React.ReactNode
}) {
  initStorage()

  const notifications = React.useSyncExternalStore(
    subscribe,
    () => memoryNotifications,
    () => initialNotifications
  )

  const unreadCount = React.useMemo(() => {
    return notifications.filter((n) => !n.read).length
  }, [notifications])

  const markAsRead = React.useCallback(
    (id: string) => {
      const updated = memoryNotifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      )
      persistNotifications(updated)
    },
    []
  )

  const markAsUnread = React.useCallback(
    (id: string) => {
      const updated = memoryNotifications.map((n) =>
        n.id === id ? { ...n, read: false } : n
      )
      persistNotifications(updated)
    },
    []
  )

  const updateReadStatus = React.useCallback(
    (id: string, read: boolean) => {
      const updated = memoryNotifications.map((n) =>
        n.id === id ? { ...n, read } : n
      )
      persistNotifications(updated)
    },
    []
  )

  const toggleReadStatus = React.useCallback(
    (id: string) => {
      const updated = memoryNotifications.map((n) =>
        n.id === id ? { ...n, read: !n.read } : n
      )
      persistNotifications(updated)
    },
    []
  )

  const batchUpdateReadStatus = React.useCallback(
    (ids: string[], read: boolean) => {
      const idSet = new Set(ids)
      const updated = memoryNotifications.map((n) =>
        idSet.has(n.id) ? { ...n, read } : n
      )
      persistNotifications(updated)
    },
    []
  )

  const markAllAsRead = React.useCallback(() => {
    const updated = memoryNotifications.map((n) => ({ ...n, read: true }))
    persistNotifications(updated)
  }, [])

  const removeNotification = React.useCallback(
    (id: string) => {
      const updated = memoryNotifications.filter((n) => n.id !== id)
      persistNotifications(updated)
    },
    []
  )

  const clearAll = React.useCallback(() => {
    persistNotifications([])
  }, [])

  const addNotification = React.useCallback(
    (item: Omit<NotificationItem, "id"> & { id?: string }) => {
      const newItem: NotificationItem = {
        ...item,
        id: item.id || `notif-${Date.now()}`,
        timestamp: item.timestamp || "Just now",
      }
      persistNotifications([newItem, ...memoryNotifications])
    },
    []
  )

  const value = React.useMemo(
    () => ({
      notifications,
      unreadCount,
      markAsRead,
      markAsUnread,
      updateReadStatus,
      toggleReadStatus,
      batchUpdateReadStatus,
      markAllAsRead,
      removeNotification,
      clearAll,
      addNotification,
    }),
    [
      notifications,
      unreadCount,
      markAsRead,
      markAsUnread,
      updateReadStatus,
      toggleReadStatus,
      batchUpdateReadStatus,
      markAllAsRead,
      removeNotification,
      clearAll,
      addNotification,
    ]
  )

  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  )
}

export function useNotifications() {
  const context = React.useContext(NotificationsContext)
  if (!context) {
    throw new Error(
      "useNotifications must be used within a NotificationsProvider"
    )
  }
  return context
}

export type { NotificationItem, NotificationType, NotificationPriority }
