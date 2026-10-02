"use client"

import * as React from "react"
import { useTranslations } from "next-intl"
import {
  MapPin,
  Building2,
  Warehouse,
  Save,
  CheckCircle2,
  Copy,
  Check,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import { COUNTRIES } from "@/features/settings/data/countries"

export function StoreAddressFeature() {
  const t = useTranslations("ecommerce.settings.address")
  const { settings, updateSettings } = useEcommerce()

  const [addressLine1, setAddressLine1] = React.useState(settings.addressLine1 || "")
  const [addressLine2, setAddressLine2] = React.useState(settings.addressLine2 || "")
  const [city, setCity] = React.useState(settings.city || "")
  const [country, setCountry] = React.useState(settings.country || "United States (US)")
  const [state, setState] = React.useState(settings.state || "")
  const [zip, setZip] = React.useState(settings.zip || "")

  const [warehouseSame, setWarehouseSame] = React.useState(
    settings.warehouseSameAsStore ?? true
  )
  const [warehouseName, setWarehouseName] = React.useState(
    settings.warehouseName || "West Coast Distribution Hub"
  )
  const [warehouseAddressLine1, setWarehouseAddressLine1] = React.useState(
    settings.warehouseAddressLine1 || ""
  )
  const [warehouseCity, setWarehouseCity] = React.useState(settings.warehouseCity || "")
  const [warehouseState, setWarehouseState] = React.useState(settings.warehouseState || "")
  const [warehouseZip, setWarehouseZip] = React.useState(settings.warehouseZip || "")
  const [warehousePhone, setWarehousePhone] = React.useState(settings.warehousePhone || "")

  const [isSaving, setIsSaving] = React.useState(false)
  const [saved, setSaved] = React.useState(false)
  const [copied, setCopied] = React.useState(false)

  // Find country states
  const selectedCountryObj = React.useMemo(() => {
    return COUNTRIES.find((c) => c.name === country || c.code === country)
  }, [country])

  const states = selectedCountryObj?.states || []

  const fullFormattedAddress = [
    addressLine1,
    addressLine2,
    city,
    state,
    zip,
    country,
  ]
    .filter(Boolean)
    .join(", ")

  const handleCopy = () => {
    if (!fullFormattedAddress) return
    navigator.clipboard.writeText(fullFormattedAddress)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      const compiledAddress = [
        addressLine1,
        addressLine2,
        city,
        state,
        zip,
        country,
      ]
        .filter(Boolean)
        .join(", ")

      updateSettings({
        address: compiledAddress || settings.address,
        addressLine1: addressLine1.trim(),
        addressLine2: addressLine2.trim(),
        city: city.trim(),
        state: state.trim(),
        country,
        zip: zip.trim(),
        warehouseSameAsStore: warehouseSame,
        warehouseName: warehouseName.trim(),
        warehouseAddressLine1: warehouseAddressLine1.trim(),
        warehouseCity: warehouseCity.trim(),
        warehouseState: warehouseState.trim(),
        warehouseZip: warehouseZip.trim(),
        warehousePhone: warehousePhone.trim(),
      })

      setSaved(true)
      setTimeout(() => setSaved(false), 3000)

      toast.add({
        title: t("saveSuccess"),
        description: "Store address and warehouse location updated.",
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <form onSubmit={handleSave} className="space-y-6 max-w-4xl">
      {/* 1. Primary Store Base Address */}
      <Card className="shadow-xs">
        <CardHeader>
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Building2 className="size-4 text-primary" />
            <span>{t("baseTitle")}</span>
          </CardTitle>
          <CardDescription className="text-xs">
            {t("baseDesc")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Address Line 1 */}
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="address-1" className="text-xs font-semibold">
                {t("addressLine1")} <span className="text-destructive">*</span>
              </Label>
              <Input
                id="address-1"
                value={addressLine1}
                onChange={(e) => setAddressLine1(e.target.value)}
                placeholder="e.g. 500 Howard Street"
                className="h-9 text-xs"
                required
              />
            </div>

            {/* Address Line 2 */}
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="address-2" className="text-xs font-semibold">
                {t("addressLine2")}
              </Label>
              <Input
                id="address-2"
                value={addressLine2}
                onChange={(e) => setAddressLine2(e.target.value)}
                placeholder="Suite, apartment, unit, or building (optional)"
                className="h-9 text-xs"
              />
            </div>

            {/* Country / Region */}
            <div className="space-y-1.5">
              <Label htmlFor="country" className="text-xs font-semibold">
                {t("country")} <span className="text-destructive">*</span>
              </Label>
              <Select
                value={country}
                onValueChange={(val) => {
                  if (val) {
                    setCountry(val)
                    setState("") // Reset state when country changes
                  }
                }}
              >
                <SelectTrigger id="country" className="h-9 text-xs w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  {COUNTRIES.map((c) => (
                    <SelectItem key={c.code} value={c.name}>
                      <span className="flex items-center gap-2">
                        <span>{c.flag}</span>
                        <span>{c.name}</span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* State / Province */}
            <div className="space-y-1.5">
              <Label htmlFor="state" className="text-xs font-semibold">
                {t("state")} <span className="text-destructive">*</span>
              </Label>
              {states.length > 0 ? (
                <Select
                  value={state}
                  onValueChange={(val) => {
                    if (val) setState(val)
                  }}
                >
                  <SelectTrigger id="state" className="h-9 text-xs w-full">
                    <SelectValue placeholder="Select state / province" />
                  </SelectTrigger>
                  <SelectContent className="max-h-60">
                    {states.map((s) => (
                      <SelectItem key={s.code} value={s.code}>
                        {s.name} ({s.code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  id="state"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  placeholder="State / Province"
                  className="h-9 text-xs"
                  required
                />
              )}
            </div>

            {/* City */}
            <div className="space-y-1.5">
              <Label htmlFor="city" className="text-xs font-semibold">
                {t("city")} <span className="text-destructive">*</span>
              </Label>
              <Input
                id="city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. San Francisco"
                className="h-9 text-xs"
                required
              />
            </div>

            {/* Postcode / ZIP */}
            <div className="space-y-1.5">
              <Label htmlFor="zip" className="text-xs font-semibold">
                {t("zip")} <span className="text-destructive">*</span>
              </Label>
              <Input
                id="zip"
                value={zip}
                onChange={(e) => setZip(e.target.value)}
                placeholder="e.g. 94105"
                className="h-9 text-xs font-mono"
                required
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 2. Warehouse & Returns Location Card */}
      <Card className="shadow-xs">
        <CardHeader>
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Warehouse className="size-4 text-primary" />
            <span>{t("warehouseTitle")}</span>
          </CardTitle>
          <CardDescription className="text-xs">
            {t("warehouseDesc")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3.5 rounded-xl border bg-card/60">
            <div className="space-y-0.5">
              <span className="text-xs font-semibold text-foreground block">
                {t("warehouseSame")}
              </span>
              <p className="text-xs text-muted-foreground">
                Shipping carriers will pick up and return packages to the store base address.
              </p>
            </div>
            <Switch
              checked={warehouseSame}
              onCheckedChange={setWarehouseSame}
            />
          </div>

          {!warehouseSame && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="wh-name" className="text-xs font-semibold">
                  {t("warehouseName")}
                </Label>
                <Input
                  id="wh-name"
                  value={warehouseName}
                  onChange={(e) => setWarehouseName(e.target.value)}
                  placeholder="e.g. Central Logistics Hub"
                  className="h-9 text-xs"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="wh-address" className="text-xs font-semibold">
                  {t("addressLine1")}
                </Label>
                <Input
                  id="wh-address"
                  value={warehouseAddressLine1}
                  onChange={(e) => setWarehouseAddressLine1(e.target.value)}
                  placeholder="Street and unit"
                  className="h-9 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="wh-city" className="text-xs font-semibold">
                  {t("city")}
                </Label>
                <Input
                  id="wh-city"
                  value={warehouseCity}
                  onChange={(e) => setWarehouseCity(e.target.value)}
                  placeholder="City"
                  className="h-9 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="wh-state" className="text-xs font-semibold">
                  {t("state")}
                </Label>
                <Input
                  id="wh-state"
                  value={warehouseState}
                  onChange={(e) => setWarehouseState(e.target.value)}
                  placeholder="State / Province"
                  className="h-9 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="wh-zip" className="text-xs font-semibold">
                  {t("zip")}
                </Label>
                <Input
                  id="wh-zip"
                  value={warehouseZip}
                  onChange={(e) => setWarehouseZip(e.target.value)}
                  placeholder="ZIP"
                  className="h-9 text-xs font-mono"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="wh-phone" className="text-xs font-semibold">
                  {t("warehousePhone")}
                </Label>
                <Input
                  id="wh-phone"
                  value={warehousePhone}
                  onChange={(e) => setWarehousePhone(e.target.value)}
                  placeholder="+1 (800) 555-0188"
                  className="h-9 text-xs"
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 3. Address Summary Preview Card */}
      {fullFormattedAddress && (
        <Card className="shadow-xs bg-muted/20 border-dashed">
          <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="size-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
                <MapPin className="size-4" />
              </div>
              <div className="space-y-0.5 min-w-0">
                <span className="text-xs font-semibold text-foreground block">
                  Current Registered Store Address
                </span>
                <p className="text-xs text-muted-foreground font-mono truncate max-w-xl">
                  {fullFormattedAddress}
                </p>
              </div>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleCopy}
              className="h-8 gap-1.5 text-xs cursor-pointer self-end sm:self-center"
            >
              {copied ? (
                <>
                  <Check className="size-3.5 text-emerald-500" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy className="size-3.5" />
                  <span>Copy Address</span>
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Save Action Bar */}
      <div className="flex items-center justify-end gap-3 pt-2">
        {saved && (
          <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
            <CheckCircle2 className="size-4" />
            <span>Address saved successfully</span>
          </div>
        )}
        <Button
          type="submit"
          disabled={isSaving}
          className="gap-1.5 text-xs cursor-pointer shadow-xs"
        >
          <Save className="size-3.5" />
          <span>{isSaving ? "Saving..." : "Save Store Address"}</span>
        </Button>
      </div>
    </form>
  )
}
