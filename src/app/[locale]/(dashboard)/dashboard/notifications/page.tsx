import type { Metadata } from "next"
import { NotificationsFeature } from "@/features/notifications"

export const metadata: Metadata = {
  title: "Notifications",
  description: "View and manage system, order, and security notifications",
}

export default function NotificationsPage() {
  return <NotificationsFeature />
}
