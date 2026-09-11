import { useTranslations } from "next-intl"
import { Separator } from "@/components/ui/separator"
import { SettingsSidebar } from "@/features/settings/components/settings-sidebar"

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const t = useTranslations("settings")

  return (
    <div className="space-y-6">
      <div className="space-y-0.5">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{t("title")}</h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
          {t("description")}
        </p>
      </div>

      <Separator />

      <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
        <aside className="lg:w-1/5 shrink-0">
          <SettingsSidebar />
        </aside>
        <div className="flex-1 lg:max-w-2xl">{children}</div>
      </div>
    </div>
  )
}
