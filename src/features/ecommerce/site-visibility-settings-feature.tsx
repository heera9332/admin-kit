"use client"

import * as React from "react"
import { useTranslations } from "next-intl"
import {
  Globe,
  Clock,
  Eye,
  CheckCircle2,
  Copy,
  Check,
  ExternalLink,
  Save,
  Lock,
  Sparkles,
  Store,
  SlidersHorizontal,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AppDialog } from "@/components/app-dialog"
import { useEcommerce } from "@/context/ecommerce-provider"
import { toast } from "@/components/ui/toast"
import { cn } from "@/lib/utils"

export function SiteVisibilitySettingsFeature() {
  const t = useTranslations("ecommerce.settings.siteVisibility")
  const { settings, updateSettings } = useEcommerce()

  const [siteVisibility, setSiteVisibility] = React.useState<"coming_soon" | "live">(
    settings.siteVisibility || "coming_soon"
  )
  const [showVisibilityBadge, setShowVisibilityBadge] = React.useState<boolean>(
    settings.showVisibilityBadgeInAdminBar ?? true
  )
  const [applyToStoreOnly, setApplyToStoreOnly] = React.useState<boolean>(
    settings.comingSoonApplyToStoreOnly ?? false
  )

  const [isSaving, setIsSaving] = React.useState(false)
  const [saved, setSaved] = React.useState(false)
  const [copiedLink, setCopiedLink] = React.useState(false)
  const [previewModalOpen, setPreviewModalOpen] = React.useState(false)

  const storeUrl = "https://luminacommerce.com"
  const previewToken = "token-lumina-preview-9982"
  const shareablePreviewUrl = `${storeUrl}/?preview=${previewToken}`

  const handleCopyPreviewLink = async () => {
    try {
      await navigator.clipboard.writeText(shareablePreviewUrl)
      setCopiedLink(true)
      setTimeout(() => setCopiedLink(false), 2500)
      toast.add({
        title: "Link copied to clipboard",
        description: "Anyone with this private link can preview your store.",
      })
    } catch {
      toast.add({
        title: "Failed to copy",
        description: "Please copy the link manually.",
      })
    }
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      updateSettings({
        siteVisibility,
        showVisibilityBadgeInAdminBar: showVisibilityBadge,
        comingSoonApplyToStoreOnly: applyToStoreOnly,
      })

      setSaved(true)
      setTimeout(() => setSaved(false), 3000)

      toast.add({
        title: t("saveSuccess"),
        description: `Site visibility is now set to ${
          siteVisibility === "coming_soon" ? "Coming soon" : "Live"
        }.`,
      })
    } catch {
      toast.add({
        title: "Error saving settings",
        description: "An unexpected error occurred. Please try again.",
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <form onSubmit={handleSave} className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2 border-b border-border/60">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground font-heading">
              {t("title")}
            </h2>
            {siteVisibility === "coming_soon" ? (
              <Badge
                variant="outline"
                className="gap-1.5 border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400 font-medium"
              >
                <Clock className="size-3" />
                <span>{t("comingSoon")}</span>
              </Badge>
            ) : (
              <Badge
                variant="outline"
                className="gap-1.5 border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-medium"
              >
                <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>{t("live")}</span>
              </Badge>
            )}
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl leading-relaxed">
            {t("manageVisibility")}{" "}
            <a
              href="https://woocommerce.com/document/site-visibility/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline font-medium inline-flex items-center gap-0.5"
            >
              <span>{t("learnMore")}</span>
              <ExternalLink className="size-3 ml-0.5" />
            </a>
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setPreviewModalOpen(true)}
            className="text-xs gap-1.5 cursor-pointer"
          >
            <Eye className="size-3.5 text-muted-foreground" />
            <span>Preview</span>
          </Button>
          <Button
            type="submit"
            size="sm"
            disabled={isSaving}
            className="gap-1.5 cursor-pointer shadow-xs text-xs"
          >
            {saved ? (
              <Check className="size-3.5 text-primary-foreground" />
            ) : (
              <Save className="size-3.5" />
            )}
            <span>{saved ? "Saved" : isSaving ? "Saving..." : "Save Changes"}</span>
          </Button>
        </div>
      </div>

      {/* Main Options: Coming Soon vs Live */}
      <Card className="shadow-xs overflow-hidden">
        <CardHeader className="pb-3 border-b bg-muted/20">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <SlidersHorizontal className="size-4 text-primary" />
            <span>Site Status Mode</span>
          </CardTitle>
          <CardDescription className="text-xs">
            Choose whether your site is live to all shoppers or hidden behind a customized landing page.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* OPTION 1: COMING SOON */}
            <div
              onClick={() => setSiteVisibility("coming_soon")}
              className={cn(
                "relative flex flex-col justify-between p-4 sm:p-5 rounded-xl border-2 transition-all cursor-pointer select-none",
                siteVisibility === "coming_soon"
                  ? "border-primary bg-primary/5 shadow-xs ring-1 ring-primary/20"
                  : "border-border/70 hover:border-muted-foreground/30 hover:bg-muted/30"
              )}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={cn(
                        "size-8 rounded-lg flex items-center justify-center transition-colors",
                        siteVisibility === "coming_soon"
                          ? "bg-amber-500/15 text-amber-600 dark:text-amber-400"
                          : "bg-muted text-muted-foreground"
                      )}
                    >
                      <Clock className="size-4.5" />
                    </div>
                    <span className="font-semibold text-sm sm:text-base text-foreground">
                      {t("comingSoon")}
                    </span>
                  </div>

                  <div
                    className={cn(
                      "size-5 rounded-full border flex items-center justify-center transition-all",
                      siteVisibility === "coming_soon"
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-input bg-background"
                    )}
                  >
                    {siteVisibility === "coming_soon" && (
                      <div className="size-2 rounded-full bg-primary-foreground" />
                    )}
                  </div>
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed">
                  {t("comingSoonDesc")}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-border/50 flex items-center justify-between text-xs">
                <Badge
                  variant={siteVisibility === "coming_soon" ? "secondary" : "outline"}
                  className="text-[10px] font-medium"
                >
                  Restricted Access
                </Badge>
                <span className="text-[11px] text-muted-foreground">Recommended before launch</span>
              </div>
            </div>

            {/* OPTION 2: LIVE */}
            <div
              onClick={() => setSiteVisibility("live")}
              className={cn(
                "relative flex flex-col justify-between p-4 sm:p-5 rounded-xl border-2 transition-all cursor-pointer select-none",
                siteVisibility === "live"
                  ? "border-primary bg-primary/5 shadow-xs ring-1 ring-primary/20"
                  : "border-border/70 hover:border-muted-foreground/30 hover:bg-muted/30"
              )}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={cn(
                        "size-8 rounded-lg flex items-center justify-center transition-colors",
                        siteVisibility === "live"
                          ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                          : "bg-muted text-muted-foreground"
                      )}
                    >
                      <Globe className="size-4.5" />
                    </div>
                    <span className="font-semibold text-sm sm:text-base text-foreground">
                      {t("live")}
                    </span>
                  </div>

                  <div
                    className={cn(
                      "size-5 rounded-full border flex items-center justify-center transition-all",
                      siteVisibility === "live"
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-input bg-background"
                    )}
                  >
                    {siteVisibility === "live" && (
                      <div className="size-2 rounded-full bg-primary-foreground" />
                    )}
                  </div>
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed">
                  {t("liveDesc")}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-border/50 flex items-center justify-between text-xs">
                <Badge
                  variant={siteVisibility === "live" ? "secondary" : "outline"}
                  className="text-[10px] font-medium"
                >
                  Public & Indexed
                </Badge>
                <span className="text-[11px] text-muted-foreground">Full public storefront</span>
              </div>
            </div>
          </div>

          {/* Sub-panel details based on selected mode */}
          {siteVisibility === "coming_soon" ? (
            <div className="mt-4 p-4 rounded-xl border bg-muted/20 dark:bg-muted/10 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="space-y-1">
                  <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                    <Lock className="size-3.5 text-muted-foreground" />
                    Private Preview Access
                  </span>
                  <p className="text-[11px] text-muted-foreground">
                    Share this private link with clients, stakeholders, or beta testers to view the store.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-8 text-xs gap-1.5 cursor-pointer"
                    onClick={handleCopyPreviewLink}
                  >
                    {copiedLink ? (
                      <Check className="size-3.5 text-emerald-500" />
                    ) : (
                      <Copy className="size-3.5 text-muted-foreground" />
                    )}
                    <span>{copiedLink ? "Copied" : "Copy Link"}</span>
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    className="h-8 text-xs gap-1.5 cursor-pointer"
                    onClick={() => setPreviewModalOpen(true)}
                  >
                    <Eye className="size-3.5" />
                    <span>Preview Landing Page</span>
                  </Button>
                </div>
              </div>

              {/* Store Pages restriction toggle */}
              <div className="pt-3 border-t flex items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <span className="text-xs font-medium text-foreground block">
                    Apply to store pages only
                  </span>
                  <span className="text-[11px] text-muted-foreground block">
                    Hide only store-related pages (Shop, Product, Cart, Checkout) while keeping regular site pages accessible.
                  </span>
                </div>
                <Switch
                  checked={applyToStoreOnly}
                  onCheckedChange={setApplyToStoreOnly}
                  aria-label="Apply to store pages only"
                />
              </div>
            </div>
          ) : (
            <div className="mt-4 p-4 rounded-xl border bg-emerald-500/5 dark:bg-emerald-950/20 border-emerald-500/20 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="space-y-1">
                <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                  <CheckCircle2 className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                  Storefront is currently Live
                </span>
                <p className="text-[11px] text-emerald-700/80 dark:text-emerald-400/80">
                  Customers can discover products, place orders, and make payments online.
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-8 text-xs gap-1.5 cursor-pointer border-emerald-500/30 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/10"
                onClick={() => window.open(storeUrl, "_blank")}
              >
                <Store className="size-3.5" />
                <span>Visit Live Store</span>
                <ExternalLink className="size-3" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Admin Bar Badge Setting */}
      <Card className="shadow-xs overflow-hidden">
        <CardHeader className="pb-3 border-b bg-muted/20">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Eye className="size-4 text-primary" />
            <span>Admin Bar Display</span>
          </CardTitle>
          <CardDescription className="text-xs">
            Control the visibility indicator shown to administrators in the top navigation bar.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-sm font-semibold text-foreground block">
                {t("displayBadge")}
              </span>
              <span className="text-xs text-muted-foreground block">
                {t("displayBadgeDesc")}
              </span>
            </div>
            <Switch
              checked={showVisibilityBadge}
              onCheckedChange={setShowVisibilityBadge}
              aria-label={t("displayBadge")}
            />
          </div>

          {/* Visual Simulation of Admin Bar Status Badge */}
          <div className="pt-3 border-t">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground block mb-2">
              Admin Bar Badge Preview
            </span>
            <div className="p-3 rounded-lg border bg-muted/40 dark:bg-muted/20 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-muted-foreground">
                <span className="font-semibold text-foreground text-xs">Admin Bar</span>
                <span>•</span>
                <span>Top header preview:</span>
              </div>

              {showVisibilityBadge ? (
                siteVisibility === "coming_soon" ? (
                  <Badge
                    variant="outline"
                    className="gap-1.5 border-amber-500/40 bg-amber-500/10 text-amber-600 dark:text-amber-400 font-medium py-1 px-2.5 shadow-2xs"
                  >
                    <Clock className="size-3" />
                    <span>Coming soon</span>
                  </Badge>
                ) : (
                  <Badge
                    variant="outline"
                    className="gap-1.5 border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-medium py-1 px-2.5 shadow-2xs"
                  >
                    <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Live</span>
                  </Badge>
                )
              ) : (
                <span className="text-xs italic text-muted-foreground">
                  (Badge hidden when disabled)
                </span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Button Bar */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <Button
          type="submit"
          size="default"
          disabled={isSaving}
          className="gap-2 cursor-pointer shadow-xs px-6"
        >
          {saved ? (
            <Check className="size-4 text-primary-foreground" />
          ) : (
            <Save className="size-4" />
          )}
          <span>{saved ? "Saved" : isSaving ? "Saving..." : "Save Changes"}</span>
        </Button>
      </div>

      {/* Coming Soon Page Preview Modal */}
      <AppDialog
        open={previewModalOpen}
        onOpenChange={setPreviewModalOpen}
        size="2xl"
        title="Coming Soon Page Preview"
        description="This is what visitors see while your site is set to Coming soon."
        footer={
          <div className="flex items-center justify-between w-full">
            <span className="text-xs text-muted-foreground font-mono">
              Status: Coming Soon Landing Mode
            </span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setPreviewModalOpen(false)}
              className="text-xs cursor-pointer"
            >
              Close Preview
            </Button>
          </div>
        }
      >
        <div className="rounded-xl border bg-card p-8 sm:p-12 text-center space-y-6 shadow-xs my-2">
          <div className="size-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto shadow-xs">
            <Sparkles className="size-7" />
          </div>

          <div className="space-y-2 max-w-md mx-auto">
            <Badge variant="secondary" className="text-[11px] font-medium tracking-wide uppercase px-3 py-1">
              Coming Soon
            </Badge>
            <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground font-heading">
              {settings.storeName || "Lumina Commerce"}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              We&apos;re putting the finishing touches on our store. We&apos;ll be open soon with exclusive products and exciting offers!
            </p>
          </div>

          <div className="max-w-xs mx-auto flex items-center gap-2 pt-2">
            <div className="h-9 w-full rounded-md border border-input bg-muted/30 px-3 text-xs flex items-center text-muted-foreground select-none">
              your.email@example.com
            </div>
            <Button size="sm" type="button" className="h-9 px-3 text-xs shrink-0 pointer-events-none">
              Notify Me
            </Button>
          </div>

          <div className="pt-4 text-xs text-muted-foreground flex items-center justify-center gap-4 border-t border-border/50">
            <span>Powered by Lumina Commerce</span>
            <span>•</span>
            <span>Support: {settings.storeEmail || "store@luminacommerce.com"}</span>
          </div>
        </div>
      </AppDialog>
    </form>
  )
}
