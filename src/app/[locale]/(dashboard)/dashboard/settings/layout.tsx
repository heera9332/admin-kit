import { useTranslations } from "next-intl"
import { SettingsSidebar } from "@/features/settings/components/settings-sidebar"

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const t = useTranslations("settings")

  return (
    <div className="space-y-4 pb-12">
      {/* Settings Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2 border-b border-border/60">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground font-heading">
              {t("title")}
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl leading-relaxed">
            {t("description")}
          </p>
        </div>
      </div>

      {/* Main Settings Two-Column Layout */}
      <div className="flex flex-col gap-4 lg:flex-row items-start">
        {/* Sticky Desktop Aside / Mobile Top Bar */}
        <aside className="w-full lg:w-60 xl:w-64 shrink-0 lg:sticky lg:top-20">
          <SettingsSidebar />
        </aside>

        {/* Settings Content Area */}
        <main className="flex-1 min-w-0 w-full">
          {children}
        </main>
      </div>
    </div>
  )
}
