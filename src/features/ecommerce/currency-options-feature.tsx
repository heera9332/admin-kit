"use client"

import * as React from "react"
import { useTranslations } from "next-intl"
import {
  Coins,
  Eye,
  Save,
  CheckCircle2,
  Sparkles,
  ShoppingBag,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useEcommerce } from "@/context/ecommerce-provider"
import { toast } from "@/components/ui/toast"

interface CurrencyDetail {
  code: string
  name: string
  symbol: string
  defaultPosition: "left" | "right" | "left_space" | "right_space"
  defaultDecimals: number
}

const AVAILABLE_CURRENCIES: CurrencyDetail[] = [
  { code: "USD", name: "United States dollar", symbol: "$", defaultPosition: "left", defaultDecimals: 2 },
  { code: "EUR", name: "Euro", symbol: "€", defaultPosition: "right_space", defaultDecimals: 2 },
  { code: "GBP", name: "Pound sterling", symbol: "£", defaultPosition: "left", defaultDecimals: 2 },
  { code: "INR", name: "Indian rupee", symbol: "₹", defaultPosition: "left", defaultDecimals: 2 },
  { code: "JPY", name: "Japanese yen", symbol: "¥", defaultPosition: "left", defaultDecimals: 0 },
  { code: "CAD", name: "Canadian dollar", symbol: "CA$", defaultPosition: "left", defaultDecimals: 2 },
  { code: "AUD", name: "Australian dollar", symbol: "AU$", defaultPosition: "left", defaultDecimals: 2 },
  { code: "CHF", name: "Swiss franc", symbol: "CHF", defaultPosition: "left_space", defaultDecimals: 2 },
  { code: "CNY", name: "Chinese yuan", symbol: "¥", defaultPosition: "left", defaultDecimals: 2 },
  { code: "SGD", name: "Singapore dollar", symbol: "SG$", defaultPosition: "left", defaultDecimals: 2 },
  { code: "AED", name: "United Arab Emirates dirham", symbol: "AED", defaultPosition: "left_space", defaultDecimals: 2 },
]

export function CurrencyOptionsFeature() {
  const t = useTranslations("ecommerce.settings.currency")
  const { settings, updateSettings } = useEcommerce()

  const [currency, setCurrency] = React.useState(settings.currency || "USD")
  const [currencyPosition, setCurrencyPosition] = React.useState<
    "left" | "right" | "left_space" | "right_space"
  >(settings.currencyPosition || "left")
  const [thousandSeparator, setThousandSeparator] = React.useState(
    settings.thousandSeparator || ","
  )
  const [decimalSeparator, setDecimalSeparator] = React.useState(
    settings.decimalSeparator || "."
  )
  const [decimalPlaces, setDecimalPlaces] = React.useState(
    settings.decimalPlaces !== undefined ? String(settings.decimalPlaces) : "2"
  )
  const [priceSuffix, setPriceSuffix] = React.useState(
    settings.priceSuffix || ""
  )

  const [isSaving, setIsSaving] = React.useState(false)
  const [saved, setSaved] = React.useState(false)

  // Get active currency info
  const activeCurrency = React.useMemo(() => {
    return (
      AVAILABLE_CURRENCIES.find((c) => c.code === currency) || {
        code: currency,
        name: currency,
        symbol: "$",
        defaultPosition: "left" as const,
        defaultDecimals: 2,
      }
    )
  }, [currency])

  // When currency changes, optionally suggest default position/decimals if untouched
  const handleCurrencyChange = (newCode: string) => {
    setCurrency(newCode)
    const match = AVAILABLE_CURRENCIES.find((c) => c.code === newCode)
    if (match) {
      if (newCode === "JPY") {
        setDecimalPlaces("0")
      } else if (newCode === "EUR") {
        setCurrencyPosition("right_space")
        setThousandSeparator(".")
        setDecimalSeparator(",")
      } else if (newCode === "USD" || newCode === "GBP") {
        setCurrencyPosition("left")
        setThousandSeparator(",")
        setDecimalSeparator(".")
        setDecimalPlaces("2")
      }
    }
  }

  // Format price preview based on options
  const formatSamplePrice = React.useCallback(
    (amount: number) => {
      const decimals = parseInt(decimalPlaces, 10) || 0
      const fixed = amount.toFixed(decimals)
      const [intPart, decPart] = fixed.split(".")

      // Add thousand separators
      const formattedInt = intPart.replace(
        /\B(?=(\d{3})+(?!\d))/g,
        thousandSeparator || ""
      )

      const numString =
        decimals > 0 && decPart !== undefined
          ? `${formattedInt}${decimalSeparator || "."}${decPart}`
          : formattedInt

      const symbol = activeCurrency.symbol
      let result = ""

      switch (currencyPosition) {
        case "left":
          result = `${symbol}${numString}`
          break
        case "right":
          result = `${numString}${symbol}`
          break
        case "left_space":
          result = `${symbol} ${numString}`
          break
        case "right_space":
          result = `${numString} ${symbol}`
          break
        default:
          result = `${symbol}${numString}`
      }

      if (priceSuffix.trim()) {
        result = `${result} ${priceSuffix.trim()}`
      }

      return result
    },
    [
      decimalPlaces,
      thousandSeparator,
      decimalSeparator,
      currencyPosition,
      activeCurrency.symbol,
      priceSuffix,
    ]
  )

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      updateSettings({
        currency,
        currencyPosition,
        thousandSeparator,
        decimalSeparator,
        decimalPlaces: parseInt(decimalPlaces, 10) || 0,
        priceSuffix: priceSuffix.trim(),
      })

      setSaved(true)
      setTimeout(() => setSaved(false), 3000)

      toast.add({
        title: t("saveSuccess"),
        description: "WooCommerce currency formatting applied across your store.",
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <form onSubmit={handleSave} className="space-y-6 max-w-4xl">
      {/* 1. Currency Configuration Card */}
      <Card className="shadow-xs">
        <CardHeader>
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Coins className="size-4 text-primary" />
            <span>{t("configTitle")}</span>
          </CardTitle>
          <CardDescription className="text-xs">
            {t("configDesc")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Currency Select */}
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="currency-select" className="text-xs font-semibold">
                {t("currency")} <span className="text-destructive">*</span>
              </Label>
              <Select
                value={currency}
                onValueChange={(val) => {
                  if (val) handleCurrencyChange(val)
                }}
              >
                <SelectTrigger id="currency-select" className="h-9 text-xs w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  {AVAILABLE_CURRENCIES.map((c) => (
                    <SelectItem key={c.code} value={c.code}>
                      <span className="flex items-center gap-2">
                        <span className="font-semibold font-mono w-8">{c.symbol}</span>
                        <span>{c.name} ({c.code})</span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Currency Position */}
            <div className="space-y-1.5">
              <Label htmlFor="currency-pos" className="text-xs font-semibold">
                {t("currencyPosition")}
              </Label>
              <Select
                value={currencyPosition}
                onValueChange={(val) => {
                  if (val)
                    setCurrencyPosition(
                      val as "left" | "right" | "left_space" | "right_space"
                    )
                }}
              >
                <SelectTrigger id="currency-pos" className="h-9 text-xs w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="left">Left ({activeCurrency.symbol}99.99)</SelectItem>
                  <SelectItem value="right">Right (99.99{activeCurrency.symbol})</SelectItem>
                  <SelectItem value="left_space">Left with space ({activeCurrency.symbol} 99.99)</SelectItem>
                  <SelectItem value="right_space">Right with space (99.99 {activeCurrency.symbol})</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Number of Decimals */}
            <div className="space-y-1.5">
              <Label htmlFor="decimal-places" className="text-xs font-semibold">
                {t("decimalPlaces")}
              </Label>
              <Select
                value={decimalPlaces}
                onValueChange={(val) => {
                  if (val) setDecimalPlaces(val)
                }}
              >
                <SelectTrigger id="decimal-places" className="h-9 text-xs w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">0 (e.g. 1,499)</SelectItem>
                  <SelectItem value="1">1 (e.g. 1,499.0)</SelectItem>
                  <SelectItem value="2">2 (e.g. 1,499.00 - Standard)</SelectItem>
                  <SelectItem value="3">3 (e.g. 1,499.000)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Thousand Separator */}
            <div className="space-y-1.5">
              <Label htmlFor="thousand-sep" className="text-xs font-semibold">
                {t("thousandSeparator")}
              </Label>
              <Input
                id="thousand-sep"
                value={thousandSeparator}
                onChange={(e) => setThousandSeparator(e.target.value)}
                placeholder=","
                className="h-9 text-xs font-mono"
              />
            </div>

            {/* Decimal Separator */}
            <div className="space-y-1.5">
              <Label htmlFor="decimal-sep" className="text-xs font-semibold">
                {t("decimalSeparator")}
              </Label>
              <Input
                id="decimal-sep"
                value={decimalSeparator}
                onChange={(e) => setDecimalSeparator(e.target.value)}
                placeholder="."
                className="h-9 text-xs font-mono"
              />
            </div>

            {/* Price Display Suffix */}
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="price-suffix" className="text-xs font-semibold">
                {t("priceSuffix")}
              </Label>
              <Input
                id="price-suffix"
                value={priceSuffix}
                onChange={(e) => setPriceSuffix(e.target.value)}
                placeholder="e.g. ex. VAT, incl. tax (optional)"
                className="h-9 text-xs"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 2. Interactive Live Storefront Preview Card */}
      <Card className="shadow-xs bg-linear-to-br from-card to-muted/20 border-primary/20">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Eye className="size-4 text-primary" />
              <span>{t("previewTitle")}</span>
            </CardTitle>
            <Badge variant="outline" className="gap-1 text-[11px]">
              <Sparkles className="size-3 text-amber-500" />
              <span>Real-Time Formatting</span>
            </Badge>
          </div>
          <CardDescription className="text-xs">
            {t("previewDesc")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Sample 1: Standard Item */}
            <div className="p-3.5 rounded-xl border bg-card space-y-1.5">
              <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider block">
                Standard Product
              </span>
              <div className="text-lg sm:text-xl font-bold font-mono text-foreground">
                {formatSamplePrice(1499)}
              </div>
              <span className="text-[11px] text-muted-foreground">
                Catalog list display
              </span>
            </div>

            {/* Sample 2: Discounted Item */}
            <div className="p-3.5 rounded-xl border bg-card space-y-1.5">
              <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider block">
                Sale Product Price
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-lg sm:text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
                  {formatSamplePrice(1199)}
                </span>
                <span className="text-xs text-muted-foreground line-through font-mono">
                  {formatSamplePrice(1599)}
                </span>
              </div>
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                Save 25% discount tag
              </span>
            </div>

            {/* Sample 3: Cart Subtotal */}
            <div className="p-3.5 rounded-xl border bg-card space-y-1.5">
              <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider block flex items-center gap-1">
                <ShoppingBag className="size-3 text-muted-foreground" />
                <span>Cart Order Total</span>
              </span>
              <div className="text-lg sm:text-xl font-bold font-mono text-primary">
                {formatSamplePrice(3897.5)}
              </div>
              <span className="text-[11px] text-muted-foreground">
                Checkout payment total
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Action Bar */}
      <div className="flex items-center justify-end gap-3 pt-2">
        {saved && (
          <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
            <CheckCircle2 className="size-4" />
            <span>Currency options saved successfully</span>
          </div>
        )}
        <Button
          type="submit"
          disabled={isSaving}
          className="gap-1.5 text-xs cursor-pointer shadow-xs"
        >
          <Save className="size-3.5" />
          <span>{isSaving ? "Saving..." : "Save Currency Options"}</span>
        </Button>
      </div>
    </form>
  )
}
