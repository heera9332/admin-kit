import type { Metadata } from "next"
import { DashboardFeature } from "@/features/dashboard"

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Overview and business analytics dashboard",
}

export default function DashboardPage() {
  return <DashboardFeature />
}
