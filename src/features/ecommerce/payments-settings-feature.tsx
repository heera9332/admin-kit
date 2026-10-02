"use client"

import * as React from "react"
import { useTranslations } from "next-intl"
import {
  CreditCard,
  Wallet,
  Landmark,
  Banknote,
  QrCode,
  Settings2,
  CheckCircle2,
  Key,
  ShieldAlert,
  Save,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AppSheet } from "@/components/app-sheet"
import { useEcommerce } from "@/context/ecommerce-provider"
import { toast } from "@/components/ui/toast"
import type { PaymentGatewayConfig } from "@/data/ecommerce"

export function PaymentsSettingsFeature() {
  const t = useTranslations("ecommerce.settings.payments")
  const { settings, updateSettings } = useEcommerce()

  const gateways: PaymentGatewayConfig[] = React.useMemo(() => {
    return settings.paymentGateways || []
  }, [settings.paymentGateways])

  const [managingGateway, setManagingGateway] = React.useState<PaymentGatewayConfig | null>(null)

  // Drawer form states
  const [drawerEnabled, setDrawerEnabled] = React.useState(false)
  const [drawerTestMode, setDrawerTestMode] = React.useState(false)
  const [drawerName, setDrawerName] = React.useState("")
  const [drawerDesc, setDrawerDesc] = React.useState("")
  const [drawerPubK, setDrawerPubK] = React.useState("")
  const [drawerSecK, setDrawerSecK] = React.useState("")
  const [drawerEmail, setDrawerEmail] = React.useState("")
  const [drawerAccount, setDrawerAccount] = React.useState("")
  const [drawerInstructions, setDrawerInstructions] = React.useState("")

  const openManageDrawer = (gateway: PaymentGatewayConfig) => {
    setManagingGateway(gateway)
    setDrawerEnabled(gateway.enabled)
    setDrawerTestMode(gateway.isTestMode ?? false)
    setDrawerName(gateway.name)
    setDrawerDesc(gateway.description)
    setDrawerPubK(gateway.publishableKey || "")
    setDrawerSecK(gateway.secretKey || "")
    setDrawerEmail(gateway.merchantEmail || "")
    setDrawerAccount(gateway.accountDetails || "")
    setDrawerInstructions(gateway.instructions || "")
  }

  const handleToggleGateway = (id: string, currentEnabled: boolean) => {
    const updated = gateways.map((g) =>
      g.id === id ? { ...g, enabled: !currentEnabled } : g
    )
    updateSettings({ paymentGateways: updated })
    toast.add({
      title: !currentEnabled ? "Gateway activated" : "Gateway disabled",
      description: `Updated status for payment method.`,
    })
  }

  const handleSaveDrawer = () => {
    if (!managingGateway) return

    const updated = gateways.map((g) => {
      if (g.id !== managingGateway.id) return g
      return {
        ...g,
        enabled: drawerEnabled,
        isTestMode: drawerTestMode,
        name: drawerName.trim() || g.name,
        description: drawerDesc.trim(),
        publishableKey: drawerPubK.trim() || undefined,
        secretKey: drawerSecK.trim() || undefined,
        merchantEmail: drawerEmail.trim() || undefined,
        accountDetails: drawerAccount.trim() || undefined,
        instructions: drawerInstructions.trim() || undefined,
      }
    })

    updateSettings({ paymentGateways: updated })
    setManagingGateway(null)
    toast.add({
      title: t("saveSuccess"),
      description: `Configuration saved for ${drawerName.trim() || managingGateway.name}.`,
    })
  }

  const activeCount = gateways.filter((g) => g.enabled).length
  const testModeCount = gateways.filter((g) => g.enabled && g.isTestMode).length

  const getGatewayIcon = (id: string) => {
    switch (id) {
      case "stripe":
        return <CreditCard className="size-5 text-indigo-500" />
      case "paypal":
        return <Wallet className="size-5 text-sky-500" />
      case "bacs":
        return <Landmark className="size-5 text-amber-500" />
      case "cod":
        return <Banknote className="size-5 text-emerald-500" />
      case "razorpay":
        return <QrCode className="size-5 text-blue-500" />
      default:
        return <CreditCard className="size-5 text-primary" />
    }
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Top Gateway Summary Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Card className="shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              {t("totalGateways")}
            </CardTitle>
            <CreditCard className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono">{gateways.length}</div>
          </CardContent>
        </Card>

        <Card className="shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              {t("activeGateways")}
            </CardTitle>
            <CheckCircle2 className="size-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
              {activeCount}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              {t("testMode")}
            </CardTitle>
            <ShieldAlert className="size-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono text-amber-600 dark:text-amber-400">
              {testModeCount} active
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Payment Gateways List */}
      <Card className="shadow-xs">
        <CardHeader>
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <CreditCard className="size-4 text-primary" />
            <span>{t("title")}</span>
          </CardTitle>
          <CardDescription className="text-xs">
            {t("description")}
          </CardDescription>
        </CardHeader>
        <CardContent className="divide-y divide-border">
          {gateways.map((gateway) => (
            <div
              key={gateway.id}
              className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-3.5">
                <div className="size-10 rounded-xl bg-muted/50 border flex items-center justify-center shrink-0 mt-0.5">
                  {getGatewayIcon(gateway.id)}
                </div>
                <div className="space-y-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-sm font-semibold text-foreground">
                      {gateway.name}
                    </h3>
                    {gateway.enabled ? (
                      <Badge variant="outline" className="text-[10px] text-emerald-600 border-emerald-500/30 bg-emerald-500/10">
                        {t("active")}
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="text-[10px]">
                        {t("disabled")}
                      </Badge>
                    )}
                    {gateway.enabled && gateway.isTestMode && (
                      <Badge variant="outline" className="text-[10px] text-amber-600 border-amber-500/30 bg-amber-500/10">
                        {t("sandbox")}
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2 max-w-xl">
                    {gateway.description}
                  </p>
                </div>
              </div>

              {/* Action Controls */}
              <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                <Switch
                  checked={gateway.enabled}
                  onCheckedChange={() => handleToggleGateway(gateway.id, gateway.enabled)}
                  aria-label={`Toggle ${gateway.name}`}
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openManageDrawer(gateway)}
                  className="h-8 gap-1.5 text-xs cursor-pointer"
                >
                  <Settings2 className="size-3.5" />
                  <span>{t("manage")}</span>
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Configuration Drawer */}
      <AppSheet
        open={Boolean(managingGateway)}
        onOpenChange={(open) => !open && setManagingGateway(null)}
        side="right"
        size="md"
        title={managingGateway ? `Manage ${managingGateway.name}` : "Payment Gateway"}
        description="Configure API keys, sandbox test environment, and customer checkout instructions."
        footer={
          <div className="flex items-center justify-end gap-2 w-full">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setManagingGateway(null)}
              className="text-xs cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleSaveDrawer}
              className="gap-1.5 text-xs cursor-pointer shadow-xs"
            >
              <Save className="size-3.5" />
              <span>Save Gateway</span>
            </Button>
          </div>
        }
      >
        {managingGateway && (
          <div className="space-y-5 py-2">
            {/* Enabled & Test Mode Switches */}
            <div className="space-y-3 p-3.5 rounded-xl border bg-card/60">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold block">Enable Gateway</span>
                  <span className="text-[11px] text-muted-foreground">
                    Display as available payment method at checkout
                  </span>
                </div>
                <Switch
                  checked={drawerEnabled}
                  onCheckedChange={setDrawerEnabled}
                />
              </div>

              {(managingGateway.id === "stripe" ||
                managingGateway.id === "paypal" ||
                managingGateway.id === "razorpay") && (
                <div className="flex items-center justify-between pt-2 border-t">
                  <div>
                    <span className="text-xs font-semibold block">Sandbox / Test Mode</span>
                    <span className="text-[11px] text-muted-foreground">
                      Process payments without charging real money
                    </span>
                  </div>
                  <Switch
                    checked={drawerTestMode}
                    onCheckedChange={setDrawerTestMode}
                  />
                </div>
              )}
            </div>

            {/* Display Title */}
            <div className="space-y-1.5">
              <Label htmlFor="gateway-name" className="text-xs font-semibold">
                Customer Display Title
              </Label>
              <Input
                id="gateway-name"
                value={drawerName}
                onChange={(e) => setDrawerName(e.target.value)}
                placeholder="Title shown to customer"
                className="h-8 text-xs"
              />
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <Label htmlFor="gateway-desc" className="text-xs font-semibold">
                Customer Description
              </Label>
              <Textarea
                id="gateway-desc"
                value={drawerDesc}
                onChange={(e) => setDrawerDesc(e.target.value)}
                placeholder="Description shown at checkout"
                rows={2}
                className="text-xs resize-none"
              />
            </div>

            {/* API Keys for Stripe / Razorpay */}
            {(managingGateway.id === "stripe" || managingGateway.id === "razorpay") && (
              <div className="space-y-3 pt-2 border-t">
                <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <Key className="size-3.5 text-primary" />
                  <span>API Credentials</span>
                </span>

                <div className="space-y-1.5">
                  <Label htmlFor="gateway-pubkey" className="text-xs font-medium">
                    Publishable Key / Key ID
                  </Label>
                  <Input
                    id="gateway-pubkey"
                    value={drawerPubK}
                    onChange={(e) => setDrawerPubK(e.target.value)}
                    placeholder="pk_test_..."
                    className="h-8 text-xs font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="gateway-seckey" className="text-xs font-medium">
                    Secret Key
                  </Label>
                  <Input
                    id="gateway-seckey"
                    type="password"
                    value={drawerSecK}
                    onChange={(e) => setDrawerSecK(e.target.value)}
                    placeholder="sk_test_..."
                    className="h-8 text-xs font-mono"
                  />
                </div>
              </div>
            )}

            {/* PayPal Credentials */}
            {managingGateway.id === "paypal" && (
              <div className="space-y-1.5 pt-2 border-t">
                <Label htmlFor="gateway-email" className="text-xs font-semibold">
                  PayPal Merchant Email
                </Label>
                <Input
                  id="gateway-email"
                  type="email"
                  value={drawerEmail}
                  onChange={(e) => setDrawerEmail(e.target.value)}
                  placeholder="payments@example.com"
                  className="h-8 text-xs"
                />
              </div>
            )}

            {/* BACS Account details */}
            {managingGateway.id === "bacs" && (
              <div className="space-y-1.5 pt-2 border-t">
                <Label htmlFor="gateway-account" className="text-xs font-semibold">
                  Bank Account & Routing Details
                </Label>
                <Textarea
                  id="gateway-account"
                  value={drawerAccount}
                  onChange={(e) => setDrawerAccount(e.target.value)}
                  placeholder="Bank Name, Account Number, SWIFT/IBAN..."
                  rows={2}
                  className="text-xs font-mono resize-none"
                />
              </div>
            )}

            {/* Instructions */}
            <div className="space-y-1.5 pt-2 border-t">
              <Label htmlFor="gateway-instructions" className="text-xs font-semibold">
                Thank-You Page Instructions
              </Label>
              <Textarea
                id="gateway-instructions"
                value={drawerInstructions}
                onChange={(e) => setDrawerInstructions(e.target.value)}
                placeholder="Instructions displayed after placing order..."
                rows={3}
                className="text-xs resize-none"
              />
            </div>
          </div>
        )}
      </AppSheet>
    </div>
  )
}
