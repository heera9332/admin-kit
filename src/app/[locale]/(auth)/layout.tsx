import { Link } from "@/i18n/routing"
import { Command } from "lucide-react"
import { siteConfig } from "@/config/site"
import { ThemeToggle } from "@/components/theme-toggle"
import { LocaleSwitcher } from "@/components/locale-switcher"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 bg-background">
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 flex items-center gap-2">
        <LocaleSwitcher />
        <ThemeToggle />
      </div>

      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-95">
        <div className="flex flex-col items-center space-y-2 text-center">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-xs">
              <Command className="size-4" />
            </div>
            <span className="font-heading text-lg font-bold tracking-tight">
              {siteConfig.name}
            </span>
          </Link>
        </div>

        {children}
      </div>
    </div>
  )
}
