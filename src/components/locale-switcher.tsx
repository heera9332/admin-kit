"use client"

import * as React from "react"
import { useLocale, useTranslations } from "next-intl"
import { Languages, Check, Loader2 } from "lucide-react"
import { useRouter, usePathname, routing, LOCALES_CONFIG, type Locale } from "@/i18n/routing"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

interface LocaleSwitcherProps {
  className?: string
  variant?: "ghost" | "outline" | "default"
  size?: "icon" | "sm" | "default"
  showLabel?: boolean
}

export function LocaleSwitcher({
  className,
  variant = "ghost",
  size = "icon",
  showLabel = false,
}: LocaleSwitcherProps) {
  const currentLocale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const t = useTranslations("localeSwitcher")
  const [isPending, startTransition] = React.useTransition()

  const currentConfig = LOCALES_CONFIG[currentLocale] ?? LOCALES_CONFIG.en

  const handleSelectLocale = (nextLocale: Locale) => {
    if (nextLocale === currentLocale) return

    startTransition(() => {
      router.replace(pathname, { locale: nextLocale })
    })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant={variant}
            size={size === "icon" && !showLabel ? "icon-sm" : "sm"}
            className={cn(
              "relative gap-1.5 text-xs font-medium",
              showLabel ? "h-8 px-2.5" : "size-8",
              className
            )}
            disabled={isPending}
            aria-label={t("selectLanguage")}
          />
        }
      >
        {isPending ? (
          <Loader2 className="size-4 animate-spin text-muted-foreground" />
        ) : (
          <>
            <Languages className={cn("size-3.5 text-muted-foreground", showLabel && "hidden")} />
            {showLabel && (
              <span className="text-xs uppercase font-semibold text-foreground">
                {currentConfig.code}
              </span>
            )}
          </>
        )}
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel className="text-xs font-semibold text-muted-foreground px-2 py-1.5">
          {t("title")}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {routing.locales.map((loc) => {
          const cfg = LOCALES_CONFIG[loc]
          const isSelected = loc === currentLocale

          return (
            <DropdownMenuItem
              key={loc}
              onClick={() => handleSelectLocale(loc)}
              className={cn(
                "flex items-center justify-between text-xs py-2 px-2.5 cursor-pointer",
                isSelected && "font-semibold bg-accent/60"
              )}
            >
              <div className="flex items-center gap-2">
                <span className="text-base leading-none" role="img" aria-hidden="true">
                  {cfg.flag}
                </span>
                <span className="text-foreground">{cfg.nativeName}</span>
                <span className="text-[11px] text-muted-foreground">({cfg.name})</span>
              </div>
              {isSelected && <Check className="size-3.5 text-primary stroke-[3]" />}
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
