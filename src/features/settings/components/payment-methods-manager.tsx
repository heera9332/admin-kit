"use client"

import * as React from "react"
import { useTranslations } from "next-intl"
import {
  CreditCard,
  Plus,
  Trash2,
  Star,
  CheckCircle2,
  ShieldCheck,
  Building2,
  Lock,
  Wallet,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { CardContent } from "@/components/ui/card"
import { AppDialog } from "@/components/app-dialog"
import { toast } from "@/components/ui/toast"
import { cn } from "@/lib/utils"
import type { PaymentMethod, PaymentMethodType } from "../types/payment"
import {
  detectCardBrand,
  formatCardNumber,
  formatExpiry,
} from "../data/initial-payments"

interface PaymentMethodsManagerProps {
  paymentMethods: PaymentMethod[]
  onSave: (methods: PaymentMethod[]) => void
}

export function PaymentMethodsManager({
  paymentMethods,
  onSave,
}: PaymentMethodsManagerProps) {
  const t = useTranslations("settings.payment")

  const [addDialogOpen, setAddDialogOpen] = React.useState(false)
  const [deleteConfirmId, setDeleteConfirmId] = React.useState<string | null>(null)

  // Handle setting a method as default
  const handleSetDefault = (id: string) => {
    const updated = paymentMethods.map((pm) => ({
      ...pm,
      isDefault: pm.id === id,
    }))
    onSave(updated)
    const target = paymentMethods.find((p) => p.id === id)
    const label =
      target?.type === "card"
        ? `${target.brand?.toUpperCase()} •••• ${target.last4}`
        : target?.type === "paypal"
        ? target.paypalEmail
        : target?.bankName || "Payment method"

    toast.add({
      title: t("defaultUpdated"),
      description: `${label} is now your default payment method.`,
    })
  }

  // Handle deleting a payment method
  const handleDelete = (id: string) => {
    const target = paymentMethods.find((p) => p.id === id)
    const remaining = paymentMethods.filter((pm) => pm.id !== id)

    // If the deleted one was default, set the first remaining as default
    if (target?.isDefault && remaining.length > 0) {
      remaining[0].isDefault = true
    }

    onSave(remaining)
    setDeleteConfirmId(null)

    toast.add({
      title: t("deletedTitle"),
      description: t("deletedDesc"),
    })
  }

  // Handle adding a new payment method
  const handleAddMethod = (newMethod: PaymentMethod) => {
    let updated: PaymentMethod[]
    if (newMethod.isDefault || paymentMethods.length === 0) {
      newMethod.isDefault = true
      updated = [
        newMethod,
        ...paymentMethods.map((pm) => ({ ...pm, isDefault: false })),
      ]
    } else {
      updated = [...paymentMethods, newMethod]
    }

    onSave(updated)
    setAddDialogOpen(false)

    toast.add({
      title: t("addedTitle"),
      description: t("addedDesc"),
    })
  }

  return (
    <CardContent className="  space-y-6">
      {/* Top Banner & Add Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b">
        <div>
          <h3 className="text-sm font-semibold text-foreground">
            {t("savedMethodsTitle")}
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            {t("savedMethodsDesc")}
          </p>
        </div>

        <Button
          type="button"
          onClick={() => setAddDialogOpen(true)}
          size="sm"
          className="h-8 gap-1.5 text-xs font-medium cursor-pointer self-start sm:self-auto"
        >
          <Plus className="size-3.5" />
          <span>{t("addMethodBtn")}</span>
        </Button>
      </div>

      {/* Methods List */}
      {paymentMethods.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-8 border border-dashed rounded-xl text-center space-y-3">
          <div className="p-3 rounded-full bg-muted/60 text-muted-foreground">
            <CreditCard className="size-6" />
          </div>
          <div>
            <h4 className="text-sm font-medium">{t("noMethodsTitle")}</h4>
            <p className="text-xs text-muted-foreground mt-1 max-w-sm">
              {t("noMethodsDesc")}
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setAddDialogOpen(true)}
            className="text-xs h-8 gap-1.5"
          >
            <Plus className="size-3.5" />
            <span>{t("addMethodBtn")}</span>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {paymentMethods.map((method) => (
            <PaymentMethodCard
              key={method.id}
              method={method}
              onSetDefault={() => handleSetDefault(method.id)}
              onDelete={() => setDeleteConfirmId(method.id)}
            />
          ))}
        </div>
      )}

      {/* Security Assurance Footer Note */}
      <div className="flex items-center gap-2.5 p-3 rounded-xl border bg-muted/20 text-xs text-muted-foreground">
        <ShieldCheck className="size-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
        <p className="leading-normal">{t("securityNote")}</p>
      </div>

      {/* Add Payment Method Dialog */}
      <AddPaymentMethodDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        onAdd={handleAddMethod}
      />

      {/* Delete Confirmation Dialog */}
      <DeletePaymentMethodDialog
        open={!!deleteConfirmId}
        onOpenChange={(open) => !open && setDeleteConfirmId(null)}
        onConfirm={() => deleteConfirmId && handleDelete(deleteConfirmId)}
      />
    </CardContent>
  )
}

function PaymentMethodCard({
  method,
  onSetDefault,
  onDelete,
}: {
  method: PaymentMethod
  onSetDefault: () => void
  onDelete: () => void
}) {
  const t = useTranslations("settings.payment")

  return (
    <div
      className={cn(
        "rounded-xl border p-4 flex flex-col justify-between transition-all bg-card",
        method.isDefault
          ? "border-primary/40 shadow-xs ring-1 ring-primary/20 bg-primary/[0.02]"
          : "hover:border-border/80"
      )}
    >
      <div className="space-y-3">
        {/* Card Header: Brand Icon & Default Badge */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <PaymentBrandBadge type={method.type} brand={method.brand} />
            <span className="text-xs font-semibold text-foreground uppercase tracking-wider">
              {method.type === "card"
                ? method.brand
                : method.type === "paypal"
                ? "PayPal"
                : "Bank Account"}
            </span>
          </div>

          {method.isDefault ? (
            <Badge
              variant="secondary"
              className="text-[10px] h-5 gap-1 font-medium bg-primary/10 text-primary border border-primary/20"
            >
              <CheckCircle2 className="size-3" />
              <span>{t("defaultBadge")}</span>
            </Badge>
          ) : (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onSetDefault}
              className="h-6 px-2 text-[11px] text-muted-foreground hover:text-foreground cursor-pointer gap-1"
            >
              <Star className="size-3" />
              <span>{t("makeDefaultBtn")}</span>
            </Button>
          )}
        </div>

        {/* Card Body Details */}
        <div className="space-y-1">
          {method.type === "card" && (
            <>
              <p className="font-mono text-sm font-semibold text-foreground tracking-wider">
                •••• •••• •••• {method.last4}
              </p>
              <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
                <span>{method.cardholderName}</span>
                <span className="font-mono">
                  {t("expires")}: {method.expiryMonth}/{method.expiryYear}
                </span>
              </div>
            </>
          )}

          {method.type === "paypal" && (
            <>
              <p className="font-medium text-sm text-foreground">
                {method.paypalEmail}
              </p>
              <p className="text-xs text-muted-foreground pt-1">
                {t("paypalConnected")}
              </p>
            </>
          )}

          {method.type === "bank_account" && (
            <>
              <p className="font-semibold text-sm text-foreground">
                {method.bankName}
              </p>
              <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
                <span>{method.accountHolderName}</span>
                <span className="font-mono">
                  •••• {method.accountNumberLast4}
                </span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Card Footer: Remove Action */}
      <div className="pt-3 mt-3 border-t flex items-center justify-between gap-2">
        <span className="text-[10px] text-muted-foreground">
          {t("addedOn", { date: method.createdAt })}
        </span>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onDelete}
          className="h-7 px-2 text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/10 cursor-pointer gap-1"
        >
          <Trash2 className="size-3" />
          <span>{t("removeBtn")}</span>
        </Button>
      </div>
    </div>
  )
}

function PaymentBrandBadge({
  type,
  brand,
}: {
  type: PaymentMethodType
  brand?: string
}) {
  if (type === "paypal") {
    return (
      <div className="size-8 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-xs">
        <Wallet className="size-4" />
      </div>
    )
  }

  if (type === "bank_account") {
    return (
      <div className="size-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
        <Building2 className="size-4" />
      </div>
    )
  }

  const normalized = (brand || "other").toLowerCase()
  switch (normalized) {
    case "visa":
      return (
        <div className="h-8 px-2 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-[11px] tracking-wider shadow-2xs">
          VISA
        </div>
      )
    case "mastercard":
      return (
        <div className="h-8 px-2 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold text-[10px] tracking-wider">
          MC
        </div>
      )
    case "amex":
      return (
        <div className="h-8 px-2 rounded-lg bg-blue-500/15 border border-blue-500/30 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-[10px] tracking-wider">
          AMEX
        </div>
      )
    default:
      return (
        <div className="size-8 rounded-lg bg-muted text-foreground flex items-center justify-center border">
          <CreditCard className="size-4" />
        </div>
      )
  }
}

interface AddPaymentMethodDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAdd: (method: PaymentMethod) => void
}

function AddPaymentMethodDialog({
  open,
  onOpenChange,
  onAdd,
}: AddPaymentMethodDialogProps) {
  const t = useTranslations("settings.payment")
  const tCommon = useTranslations("common")

  const [activeType, setActiveType] = React.useState<PaymentMethodType>("card")

  // Card form state
  const [cardholderName, setCardholderName] = React.useState("")
  const [cardNumber, setCardNumber] = React.useState("")
  const [expiry, setExpiry] = React.useState("")
  const [cvc, setCvc] = React.useState("")
  const [isDefault, setIsDefault] = React.useState(false)

  // PayPal form state
  const [paypalEmail, setPaypalEmail] = React.useState("")

  // Bank form state
  const [bankName, setBankName] = React.useState("")
  const [accountHolderName, setAccountHolderName] = React.useState("")
  const [accountNumber, setAccountNumber] = React.useState("")
  const [routingNumber, setRoutingNumber] = React.useState("")

  // Reset fields when opened/closed
  const resetForm = () => {
    setActiveType("card")
    setCardholderName("")
    setCardNumber("")
    setExpiry("")
    setCvc("")
    setIsDefault(false)
    setPaypalEmail("")
    setBankName("")
    setAccountHolderName("")
    setAccountNumber("")
    setRoutingNumber("")
  }

  const detectedBrand = detectCardBrand(cardNumber)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const now = new Date().toISOString().split("T")[0]

    if (activeType === "card") {
      const cleanDigits = cardNumber.replace(/\D/g, "")
      if (!cardholderName.trim() || cleanDigits.length < 15) return

      const [mm, yy] = expiry.split("/")
      const newMethod: PaymentMethod = {
        id: `pm-${Date.now().toString().slice(-6)}`,
        type: "card",
        isDefault,
        brand: detectedBrand,
        cardholderName: cardholderName.trim(),
        last4: cleanDigits.slice(-4),
        expiryMonth: mm || "12",
        expiryYear: yy || "28",
        createdAt: now,
      }
      onAdd(newMethod)
    } else if (activeType === "paypal") {
      if (!paypalEmail.trim()) return
      const newMethod: PaymentMethod = {
        id: `pm-${Date.now().toString().slice(-6)}`,
        type: "paypal",
        isDefault,
        paypalEmail: paypalEmail.trim(),
        createdAt: now,
      }
      onAdd(newMethod)
    } else if (activeType === "bank_account") {
      if (!bankName.trim() || !accountNumber.trim()) return
      const cleanAcc = accountNumber.replace(/\D/g, "")
      const newMethod: PaymentMethod = {
        id: `pm-${Date.now().toString().slice(-6)}`,
        type: "bank_account",
        isDefault,
        bankName: bankName.trim(),
        accountHolderName: accountHolderName.trim() || "Account Holder",
        accountNumberLast4: cleanAcc.slice(-4),
        routingNumber: routingNumber.trim(),
        createdAt: now,
      }
      onAdd(newMethod)
    }

    resetForm()
  }

  return (
    <AppDialog
      open={open}
      onOpenChange={(op) => {
        if (!op) resetForm()
        onOpenChange(op)
      }}
      title={
        <div className="flex items-center gap-2">
          <CreditCard className="size-4 text-primary" />
          <span>{t("dialogTitle")}</span>
        </div>
      }
      description={t("dialogDesc")}
      size="md"
      onSubmit={handleSubmit}
      footer={
        <div className="flex items-center justify-end gap-2 w-full pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            {tCommon("cancel")}
          </Button>
          <Button type="submit">{t("saveMethodBtn")}</Button>
        </div>
      }
    >
      <div className="space-y-4 py-2">
        {/* Method Type Selector */}
        <div className="grid grid-cols-3 gap-2 p-1 rounded-lg bg-muted/60 border text-xs">
          <button
            type="button"
            onClick={() => setActiveType("card")}
            className={cn(
              "flex items-center justify-center gap-1.5 py-1.5 rounded-md font-medium transition-all cursor-pointer",
              activeType === "card"
                ? "bg-background shadow-xs text-foreground font-semibold"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <CreditCard className="size-3.5" />
            <span>{t("cardType")}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveType("paypal")}
            className={cn(
              "flex items-center justify-center gap-1.5 py-1.5 rounded-md font-medium transition-all cursor-pointer",
              activeType === "paypal"
                ? "bg-background shadow-xs text-foreground font-semibold"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Wallet className="size-3.5" />
            <span>PayPal</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveType("bank_account")}
            className={cn(
              "flex items-center justify-center gap-1.5 py-1.5 rounded-md font-medium transition-all cursor-pointer",
              activeType === "bank_account"
                ? "bg-background shadow-xs text-foreground font-semibold"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Building2 className="size-3.5" />
            <span>{t("bankType")}</span>
          </button>
        </div>

        {/* Form Fields: Credit Card */}
        {activeType === "card" && (
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="cardholderName" className="text-xs">
                {t("cardholderName")}
              </Label>
              <Input
                id="cardholderName"
                placeholder="Jane Doe"
                value={cardholderName}
                onChange={(e) => setCardholderName(e.target.value)}
                className="h-8 text-xs"
                required
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="cardNumber" className="text-xs">
                  {t("cardNumber")}
                </Label>
                {cardNumber && (
                  <Badge variant="outline" className="text-[10px] h-4 uppercase">
                    {detectedBrand}
                  </Badge>
                )}
              </div>
              <div className="relative">
                <Input
                  id="cardNumber"
                  placeholder="4242 4242 4242 4242"
                  value={cardNumber}
                  onChange={(e) =>
                    setCardNumber(formatCardNumber(e.target.value))
                  }
                  className="h-8 text-xs font-mono pr-8"
                  required
                />
                <CreditCard className="size-3.5 absolute right-2.5 top-2.5 text-muted-foreground" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="expiry" className="text-xs">
                  {t("expiryDate")}
                </Label>
                <Input
                  id="expiry"
                  placeholder="MM/YY"
                  value={expiry}
                  onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                  className="h-8 text-xs font-mono"
                  maxLength={5}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="cvc" className="text-xs flex items-center justify-between">
                  <span>CVC / CVV</span>
                  <Lock className="size-3 text-muted-foreground" />
                </Label>
                <Input
                  id="cvc"
                  placeholder="123"
                  type="password"
                  value={cvc}
                  onChange={(e) =>
                    setCvc(e.target.value.replace(/\D/g, "").slice(0, 4))
                  }
                  className="h-8 text-xs font-mono"
                  maxLength={4}
                  required
                />
              </div>
            </div>
          </div>
        )}

        {/* Form Fields: PayPal */}
        {activeType === "paypal" && (
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="paypalEmail" className="text-xs">
                {t("paypalEmail")}
              </Label>
              <Input
                id="paypalEmail"
                type="email"
                placeholder="your.email@example.com"
                value={paypalEmail}
                onChange={(e) => setPaypalEmail(e.target.value)}
                className="h-8 text-xs"
                required
              />
            </div>
            <p className="text-[11px] text-muted-foreground bg-muted/20 p-2.5 rounded-lg border">
              {t("paypalHelp")}
            </p>
          </div>
        )}

        {/* Form Fields: Bank Account */}
        {activeType === "bank_account" && (
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="bankName" className="text-xs">
                {t("bankName")}
              </Label>
              <Input
                id="bankName"
                placeholder="JPMorgan Chase"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                className="h-8 text-xs"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="accountHolderName" className="text-xs">
                {t("accountHolder")}
              </Label>
              <Input
                id="accountHolderName"
                placeholder="Heera Singh"
                value={accountHolderName}
                onChange={(e) => setAccountHolderName(e.target.value)}
                className="h-8 text-xs"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="routingNumber" className="text-xs">
                  {t("routingNumber")}
                </Label>
                <Input
                  id="routingNumber"
                  placeholder="021000021"
                  value={routingNumber}
                  onChange={(e) =>
                    setRoutingNumber(e.target.value.replace(/\D/g, "").slice(0, 9))
                  }
                  className="h-8 text-xs font-mono"
                  maxLength={9}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="accountNumber" className="text-xs">
                  {t("accountNumber")}
                </Label>
                <Input
                  id="accountNumber"
                  placeholder="•••• 4321"
                  value={accountNumber}
                  onChange={(e) =>
                    setAccountNumber(e.target.value.replace(/\D/g, ""))
                  }
                  className="h-8 text-xs font-mono"
                  required
                />
              </div>
            </div>
          </div>
        )}

        {/* Set as Default Toggle */}
        <label className="flex items-center gap-2 pt-2 border-t cursor-pointer select-none">
          <input
            type="checkbox"
            checked={isDefault}
            onChange={(e) => setIsDefault(e.target.checked)}
            className="size-4 rounded-sm border-input text-primary focus:ring-primary"
          />
          <span className="text-xs text-foreground font-medium">
            {t("setAsDefaultLabel")}
          </span>
        </label>
      </div>
    </AppDialog>
  )
}

function DeletePaymentMethodDialog({
  open,
  onOpenChange,
  onConfirm,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
}) {
  const t = useTranslations("settings.payment")
  const tCommon = useTranslations("common")

  return (
    <AppDialog
      open={open}
      onOpenChange={onOpenChange}
      title={
        <div className="flex items-center gap-2 text-destructive">
          <Trash2 className="size-4" />
          <span>{t("deleteConfirmTitle")}</span>
        </div>
      }
      description={t("deleteConfirmDesc")}
      size="sm"
      footer={
        <div className="flex items-center justify-end gap-2 w-full">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            {tCommon("cancel")}
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={() => {
              onConfirm()
              onOpenChange(false)
            }}
          >
            {tCommon("delete")}
          </Button>
        </div>
      }
    />
  )
}
