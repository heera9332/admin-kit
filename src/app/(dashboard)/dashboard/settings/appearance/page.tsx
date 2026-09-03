import type { Metadata } from "next"
import { ThemeSettingsForm } from "@/features/settings/components/theme-settings-form"

export const metadata: Metadata = {
  title: "Theme Settings",
  description: "Adjust the appearance and layout to suit your preferences.",
}

export default function AppearanceSettingsPage() {
  return <ThemeSettingsForm />
}
