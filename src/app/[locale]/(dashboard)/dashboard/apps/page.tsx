import type { Metadata } from "next"
import { AppsFeature } from "@/features/apps"

export const metadata: Metadata = {
  title: "Apps",
  description: "Connected applications and service integrations",
}

export default function AppsPage() {
  return <AppsFeature />
}
