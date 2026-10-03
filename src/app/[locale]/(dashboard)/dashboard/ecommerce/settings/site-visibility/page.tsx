import type { Metadata } from "next"
import { SiteVisibilitySettingsFeature } from "@/features/ecommerce"

export const metadata: Metadata = {
  title: "Site Visibility | E-Commerce Settings",
  description: "Manage how your site appears to visitors and configure coming soon landing mode",
}

export default function SiteVisibilitySettingsPage() {
  return <SiteVisibilitySettingsFeature />
}
