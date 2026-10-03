import notificationsData from "./notifications.json"

export type NotificationType =
  | "order"
  | "security"
  | "user"
  | "cms"
  | "task"
  | "system"

export type NotificationPriority = "low" | "medium" | "high" | "urgent"

export interface NotificationItem {
  id: string
  title: string
  description: string
  timestamp: string
  createdAt?: string
  read: boolean
  type: NotificationType
  link?: string
  priority?: NotificationPriority
}

export const initialNotifications: NotificationItem[] =
  notificationsData as NotificationItem[]
