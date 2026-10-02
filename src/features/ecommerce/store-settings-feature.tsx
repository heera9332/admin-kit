"use client"

import * as React from "react"
import { useTranslations } from "next-intl"
import {
  Store,
  Globe,
  SlidersHorizontal,
  Save,
  CheckCircle2,
  Megaphone,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useEcommerce } from "@/context/ecommerce-provider"
import { toast } from "@/components/ui/toast"

export function StoreSettingsFeature() {
  const t = useTranslations("ecommerce.settings.store")
  const { settings, updateSettings } = useEcommerce()

  const [storeName, setStoreName] = React.useState(settings.storeName || "")
  const [tagline, setTagline] = React.useState(settings.tagline || "")
  const [storeEmail, setStoreEmail] = React.useState(settings.storeEmail || "")
  const [phone, setPhone] = React.useState(settings.phone || "")
  const [storeNotice, setStoreNotice] = React.useState(settings.storeNotice || "")

  const [sellingLocations, setSellingLocations] = React.useState(
    settings.sellingLocations || "all"
  )
  const [shippingLocations, setShippingLocations] = React.useState(
    settings.shippingLocations || "all_selling"
  )
  const [defaultCustomerLocation, setDefaultCustomerLocation] = React.useState(
    settings.defaultCustomerLocation || "geolocate"
  )

  const [enableTaxes, setEnableTaxes] = React.useState(
    settings.enableTaxes ?? true
  )
  const [taxRate, setTaxRate] = React.useState(String(settings.taxRate ?? 8.5))
  const [enableCoupons, setEnableCoupons] = React.useState(
    settings.enableCoupons ?? true
  )
  const [lowStockAlert, setLowStockAlert] = React.useState(
    String(settings.lowStockAlert ?? 10)
  )
  const [freeShippingThreshold, setFreeShippingThreshold] = React.useState(
    String(settings.freeShippingThreshold ?? 99)
  )
  const [enableReviews, setEnableReviews] = React.useState(
    settings.enableReviews ?? true
  )
  const [guestCheckout, setGuestCheckout] = React.useState(
    settings.guestCheckout ?? true
  )

  const [isSaving, setIsSaving] = React.useState(false)
  const [saved, setSaved] = React.useState(false)

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      updateSettings({
        storeName: storeName.trim(),
        tagline: tagline.trim(),
        storeEmail: storeEmail.trim(),
        phone: phone.trim(),
        storeNotice: storeNotice.trim(),
        sellingLocations,
        shippingLocations,
        defaultCustomerLocation,
        enableTaxes,
        taxRate: parseFloat(taxRate) || 0,
        enableCoupons,
        lowStockAlert: parseInt(lowStockAlert, 10) || 0,
        freeShippingThreshold: parseFloat(freeShippingThreshold) || 0,
        enableReviews,
        guestCheckout,
      })

      setSaved(true)
      setTimeout(() => setSaved(false), 3000)

      toast.add({
        title: t("saveSuccess"),
        description: "Store settings updated across catalog and checkout.",
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <form onSubmit={handleSave} className="space-y-6 max-w-4xl">
      {/* 1. Store Identity Card */}
      <Card className="shadow-xs">
        <CardHeader>
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Store className="size-4 text-primary" />
            <span>{t("identityTitle")}</span>
          </CardTitle>
          <CardDescription className="text-xs">
            {t("identityDesc")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="store-name" className="text-xs font-semibold">
                {t("storeName")} <span className="text-destructive">*</span>
              </Label>
              <Input
                id="store-name"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                placeholder="e.g. Lumina Commerce"
                className="h-9 text-xs"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="store-tagline" className="text-xs font-semibold">
                {t("storeTagline")}
              </Label>
              <Input
                id="store-tagline"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                placeholder="e.g. Modern lifestyle essentials"
                className="h-9 text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="store-email" className="text-xs font-semibold">
                {t("storeEmail")} <span className="text-destructive">*</span>
              </Label>
              <Input
                id="store-email"
                type="email"
                value={storeEmail}
                onChange={(e) => setStoreEmail(e.target.value)}
                placeholder="store@example.com"
                className="h-9 text-xs"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="store-phone" className="text-xs font-semibold">
                {t("storePhone")}
              </Label>
              <Input
                id="store-phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (800) 555-0199"
                className="h-9 text-xs"
              />
            </div>
          </div>

          {/* Store Notice */}
          <div className="space-y-1.5 pt-2 border-t">
            <div className="flex items-center justify-between">
              <Label htmlFor="store-notice" className="text-xs font-semibold flex items-center gap-1.5">
                <Megaphone className="size-3.5 text-primary" />
                <span>{t("storeNotice")}</span>
              </Label>
              <span className="text-[11px] text-muted-foreground">
                Displayed in top announcement bar
              </span>
            </div>
            <Textarea
              id="store-notice"
              value={storeNotice}
              onChange={(e) => setStoreNotice(e.target.value)}
              placeholder="e.g. Free worldwide shipping on orders over $99 this week!"
              rows={2}
              className="text-xs resize-none"
            />
          </div>
        </CardContent>
      </Card>

      {/* 2. Selling & Shipping Locations Card */}
      <Card className="shadow-xs">
        <CardHeader>
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Globe className="size-4 text-primary" />
            <span>{t("locationsTitle")}</span>
          </CardTitle>
          <CardDescription className="text-xs">
            {t("locationsDesc")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Selling Location(s) */}
            <div className="space-y-1.5">
              <Label htmlFor="selling-locations" className="text-xs font-semibold">
                {t("sellingLocations")}
              </Label>
              <Select
                value={sellingLocations}
                onValueChange={(val) => {
                  if (val) setSellingLocations(val)
                }}
              >
                <SelectTrigger id="selling-locations" className="h-9 text-xs w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Sell to all countries</SelectItem>
                  <SelectItem value="all_except">Sell to all countries, except for...</SelectItem>
                  <SelectItem value="specific">Sell to specific countries only</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Shipping Location(s) */}
            <div className="space-y-1.5">
              <Label htmlFor="shipping-locations" className="text-xs font-semibold">
                {t("shippingLocations")}
              </Label>
              <Select
                value={shippingLocations}
                onValueChange={(val) => {
                  if (val) setShippingLocations(val)
                }}
              >
                <SelectTrigger id="shipping-locations" className="h-9 text-xs w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all_selling">Ship to all countries you sell to</SelectItem>
                  <SelectItem value="all">Ship to all countries</SelectItem>
                  <SelectItem value="specific">Ship to specific countries only</SelectItem>
                  <SelectItem value="disable">Disable shipping & shipping calculations</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Default Customer Location */}
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="default-location" className="text-xs font-semibold">
                {t("defaultLocation")}
              </Label>
              <Select
                value={defaultCustomerLocation}
                onValueChange={(val) => {
                  if (val) setDefaultCustomerLocation(val)
                }}
              >
                <SelectTrigger id="default-location" className="h-9 text-xs w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="geolocate">Geolocate (Automatic based on IP)</SelectItem>
                  <SelectItem value="base">Shop base address</SelectItem>
                  <SelectItem value="none">No address by default</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 3. Features & Policies Card */}
      <Card className="shadow-xs">
        <CardHeader>
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <SlidersHorizontal className="size-4 text-primary" />
            <span>{t("featuresTitle")}</span>
          </CardTitle>
          <CardDescription className="text-xs">
            {t("featuresDesc")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          {/* Taxes */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl border bg-card/60">
            <div className="space-y-0.5">
              <span className="text-xs font-semibold text-foreground block">
                {t("enableTaxes")}
              </span>
              <p className="text-xs text-muted-foreground">
                {t("enableTaxesDesc")}
              </p>
            </div>
            <div className="flex items-center gap-3">
              {enableTaxes && (
                <div className="flex items-center gap-1.5">
                  <Label htmlFor="tax-rate" className="text-xs text-muted-foreground">
                    Tax:
                  </Label>
                  <div className="relative w-20">
                    <Input
                      id="tax-rate"
                      type="number"
                      step="0.1"
                      min="0"
                      max="100"
                      value={taxRate}
                      onChange={(e) => setTaxRate(e.target.value)}
                      className="h-8 text-xs pr-5 font-mono"
                    />
                    <span className="absolute right-2 top-2 text-[10px] text-muted-foreground">
                      %
                    </span>
                  </div>
                </div>
              )}
              <Switch
                checked={enableTaxes}
                onCheckedChange={setEnableTaxes}
              />
            </div>
          </div>

          {/* Coupons */}
          <div className="flex items-center justify-between gap-3 p-3.5 rounded-xl border bg-card/60">
            <div className="space-y-0.5">
              <span className="text-xs font-semibold text-foreground block">
                {t("enableCoupons")}
              </span>
              <p className="text-xs text-muted-foreground">
                {t("enableCouponsDesc")}
              </p>
            </div>
            <Switch
              checked={enableCoupons}
              onCheckedChange={setEnableCoupons}
            />
          </div>

          {/* Reviews */}
          <div className="flex items-center justify-between gap-3 p-3.5 rounded-xl border bg-card/60">
            <div className="space-y-0.5">
              <span className="text-xs font-semibold text-foreground block">
                {t("enableReviews")}
              </span>
              <p className="text-xs text-muted-foreground">
                {t("enableReviewsDesc")}
              </p>
            </div>
            <Switch
              checked={enableReviews}
              onCheckedChange={setEnableReviews}
            />
          </div>

          {/* Guest Checkout */}
          <div className="flex items-center justify-between gap-3 p-3.5 rounded-xl border bg-card/60">
            <div className="space-y-0.5">
              <span className="text-xs font-semibold text-foreground block">
                {t("guestCheckout")}
              </span>
              <p className="text-xs text-muted-foreground">
                {t("guestCheckoutDesc")}
              </p>
            </div>
            <Switch
              checked={guestCheckout}
              onCheckedChange={setGuestCheckout}
            />
          </div>

          {/* Numerical Thresholds */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="space-y-1.5">
              <Label htmlFor="low-stock" className="text-xs font-semibold">
                {t("lowStockAlert")}
              </Label>
              <Input
                id="low-stock"
                type="number"
                min="0"
                step="1"
                value={lowStockAlert}
                onChange={(e) => setLowStockAlert(e.target.value)}
                placeholder="10"
                className="h-9 text-xs font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="free-shipping" className="text-xs font-semibold">
                {t("freeShipping")}
              </Label>
              <div className="relative">
                <span className="absolute left-2.5 top-2.5 text-xs text-muted-foreground font-mono">
                  $
                </span>
                <Input
                  id="free-shipping"
                  type="number"
                  min="0"
                  step="1"
                  value={freeShippingThreshold}
                  onChange={(e) => setFreeShippingThreshold(e.target.value)}
                  placeholder="99.00"
                  className="pl-6 h-9 text-xs font-mono"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Action Bar */}
      <div className="flex items-center justify-end gap-3 pt-2">
        {saved && (
          <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
            <CheckCircle2 className="size-4" />
            <span>Settings saved successfully</span>
          </div>
        )}
        <Button
          type="submit"
          disabled={isSaving}
          className="gap-1.5 text-xs cursor-pointer shadow-xs"
        >
          <Save className="size-3.5" />
          <span>{isSaving ? "Saving..." : "Save Store Settings"}</span>
        </Button>
      </div>
    </form>
  )
}
