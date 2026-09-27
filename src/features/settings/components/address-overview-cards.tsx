"use client"

import * as React from "react"
import { useTranslations } from "next-intl"
import {
  Check,
  Copy,
  CreditCard,
  Edit3,
  Mail,
  Phone,
  Truck,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { BillingAddress, ShippingAddress, PaymentMethod } from "../types/address"
import { formatAddress } from "../data/initial-addresses"
import { getCountryByCode } from "../data/countries"

interface AddressOverviewCardsProps {
  billingAddress: BillingAddress
  shippingAddress: ShippingAddress
  paymentMethods?: PaymentMethod[]
  onEditBilling: () => void
  onEditShipping: () => void
  onEditPayment?: () => void
}

export function AddressOverviewCards({
  billingAddress,
  shippingAddress,
  paymentMethods = [],
  onEditBilling,
  onEditShipping,
  onEditPayment,
}: AddressOverviewCardsProps) {
  const t = useTranslations("settings.addresses")
  const tPayment = useTranslations("settings.payment")

  const [copiedBilling, setCopiedBilling] = React.useState(false)
  const [copiedShipping, setCopiedShipping] = React.useState(false)

  const copyBilling = async () => {
    try {
      await navigator.clipboard.writeText(formatAddress(billingAddress, "billing"))
      setCopiedBilling(true)
      setTimeout(() => setCopiedBilling(false), 2000)
    } catch {
      // Fallback
    }
  }

  const copyShipping = async () => {
    try {
      await navigator.clipboard.writeText(formatAddress(shippingAddress, "shipping"))
      setCopiedShipping(true)
      setTimeout(() => setCopiedShipping(false), 2000)
    } catch {
      // Fallback
    }
  }

  const billingCountryName =
    getCountryByCode(billingAddress.country)?.name || billingAddress.country
  const shippingCountryName =
    getCountryByCode(shippingAddress.country)?.name || shippingAddress.country

  const defaultPayment =
    paymentMethods.find((p) => p.isDefault) || paymentMethods[0]

  return (
    <CardContent className=" ">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Billing Address Panel */}
        <div className="rounded-xl border bg-muted/10 hover:border-primary/30 transition-colors flex flex-col justify-between overflow-hidden">
          <div>
            <div className="px-4 py-3 border-b bg-muted/15 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
                  <CreditCard className="size-4" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-foreground">
                    {t("billingCardTitle")}
                  </h4>
                  <p className="text-[11px] text-muted-foreground">
                    {t("billingCardDesc")}
                  </p>
                </div>
              </div>
              <Badge variant="outline" className="text-[10px] h-5 font-normal">
                eCommerce
              </Badge>
            </div>

            <div className="p-4 text-xs space-y-3 leading-relaxed">
              <div>
                <p className="font-semibold text-foreground text-sm">
                  {billingAddress.firstName} {billingAddress.lastName}
                </p>
                {billingAddress.company && (
                  <p className="text-muted-foreground font-medium">
                    {billingAddress.company}
                  </p>
                )}
              </div>

              <div className="space-y-0.5 text-muted-foreground">
                <p>{billingAddress.address1}</p>
                {billingAddress.address2 && <p>{billingAddress.address2}</p>}
                <p>
                  {billingAddress.city}, {billingAddress.state}{" "}
                  {billingAddress.postcode}
                </p>
                <p className="font-medium text-foreground">
                  {billingCountryName}
                </p>
              </div>

              <div className="pt-2 border-t space-y-1.5 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Phone className="size-3.5 text-primary shrink-0" />
                  <span>{billingAddress.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="size-3.5 text-primary shrink-0" />
                  <span className="truncate">{billingAddress.email}</span>
                </div>
                {billingAddress.vatId && (
                  <div className="text-[11px] text-muted-foreground pt-0.5">
                    <span className="font-medium">Tax ID:</span> {billingAddress.vatId}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="pt-3 pb-3 px-4 border-t bg-muted/10 flex items-center justify-between gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={copyBilling}
              className="text-xs h-7 px-2.5 gap-1.5"
            >
              {copiedBilling ? (
                <>
                  <Check className="size-3 text-emerald-500" />
                  <span className="text-[11px]">{t("copied")}</span>
                </>
              ) : (
                <>
                  <Copy className="size-3" />
                  <span className="text-[11px]">{t("copyFormatted")}</span>
                </>
              )}
            </Button>

            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={onEditBilling}
              className="text-xs h-7 px-2.5 gap-1.5 font-medium"
            >
              <Edit3 className="size-3" />
              <span>{t("editBilling")}</span>
            </Button>
          </div>
        </div>

        {/* Shipping Address Panel */}
        <div className="rounded-xl border bg-muted/10 hover:border-primary/30 transition-colors flex flex-col justify-between overflow-hidden">
          <div>
            <div className="px-4 py-3 border-b bg-muted/15 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
                  <Truck className="size-4" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-foreground">
                    {t("shippingCardTitle")}
                  </h4>
                  <p className="text-[11px] text-muted-foreground">
                    {t("shippingCardDesc")}
                  </p>
                </div>
              </div>
              {shippingAddress.sameAsBilling ? (
                <Badge variant="secondary" className="text-[10px] h-5 font-normal text-emerald-600 dark:text-emerald-400 bg-emerald-500/10">
                  {t("syncedBadge")}
                </Badge>
              ) : (
                <Badge variant="outline" className="text-[10px] h-5 font-normal">
                  {t("customBadge")}
                </Badge>
              )}
            </div>

            <div className="p-4 text-xs space-y-3 leading-relaxed">
              <div>
                <p className="font-semibold text-foreground text-sm">
                  {shippingAddress.firstName} {shippingAddress.lastName}
                </p>
                {shippingAddress.company && (
                  <p className="text-muted-foreground font-medium">
                    {shippingAddress.company}
                  </p>
                )}
              </div>

              <div className="space-y-0.5 text-muted-foreground">
                <p>{shippingAddress.address1}</p>
                {shippingAddress.address2 && <p>{shippingAddress.address2}</p>}
                <p>
                  {shippingAddress.city}, {shippingAddress.state}{" "}
                  {shippingAddress.postcode}
                </p>
                <p className="font-medium text-foreground">
                  {shippingCountryName}
                </p>
              </div>

              {shippingAddress.notes ? (
                <div className="pt-2 border-t text-[11px] text-muted-foreground bg-muted/20 p-2 rounded-lg">
                  <span className="font-medium text-foreground">
                    Courier Notes:
                  </span>{" "}
                  {shippingAddress.notes}
                </div>
              ) : (
                <div className="pt-2 border-t text-[11px] text-muted-foreground italic">
                  No delivery instructions provided.
                </div>
              )}
            </div>
          </div>

          <div className="pt-3 pb-3 px-4 border-t bg-muted/10 flex items-center justify-between gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={copyShipping}
              className="text-xs h-7 px-2.5 gap-1.5"
            >
              {copiedShipping ? (
                <>
                  <Check className="size-3 text-emerald-500" />
                  <span className="text-[11px]">{t("copied")}</span>
                </>
              ) : (
                <>
                  <Copy className="size-3" />
                  <span className="text-[11px]">{t("copyFormatted")}</span>
                </>
              )}
            </Button>

            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={onEditShipping}
              className="text-xs h-7 px-2.5 gap-1.5 font-medium"
            >
              <Edit3 className="size-3" />
              <span>{t("editShipping")}</span>
            </Button>
          </div>
        </div>

        {/* Payment Method Panel */}
        <div className="rounded-xl border bg-muted/10 hover:border-primary/30 transition-colors flex flex-col justify-between overflow-hidden">
          <div>
            <div className="px-4 py-3 border-b bg-muted/15 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
                  <CreditCard className="size-4" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-foreground">
                    {tPayment("overviewCardTitle")}
                  </h4>
                  <p className="text-[11px] text-muted-foreground">
                    {tPayment("overviewCardDesc")}
                  </p>
                </div>
              </div>
              <Badge variant="outline" className="text-[10px] h-5 font-normal">
                {paymentMethods.length} {tPayment("methodsCount")}
              </Badge>
            </div>

            <div className="p-4 text-xs space-y-3 leading-relaxed">
              {defaultPayment ? (
                <>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-foreground text-sm uppercase">
                        {defaultPayment.type === "card"
                          ? `${defaultPayment.brand} •••• ${defaultPayment.last4}`
                          : defaultPayment.type === "paypal"
                          ? "PayPal"
                          : defaultPayment.bankName || "Bank Account"}
                      </span>
                      <Badge
                        variant="secondary"
                        className="text-[10px] h-4 font-normal text-emerald-600 dark:text-emerald-400 bg-emerald-500/10"
                      >
                        Default
                      </Badge>
                    </div>
                    <p className="text-muted-foreground font-medium pt-0.5">
                      {defaultPayment.type === "card"
                        ? defaultPayment.cardholderName
                        : defaultPayment.type === "paypal"
                        ? defaultPayment.paypalEmail
                        : defaultPayment.accountHolderName}
                    </p>
                  </div>

                  {defaultPayment.type === "card" && (
                    <div className="text-muted-foreground text-xs">
                      <span>{tPayment("expires")}: </span>
                      <span className="font-mono font-medium text-foreground">
                        {defaultPayment.expiryMonth}/{defaultPayment.expiryYear}
                      </span>
                    </div>
                  )}

                  <div className="pt-2 border-t text-[11px] text-muted-foreground">
                    <span>
                      {paymentMethods.length}{" "}
                      {paymentMethods.length === 1
                        ? tPayment("savedMethodSingle")
                        : tPayment("savedMethodsPlural")}{" "}
                      {tPayment("availableForCheckout")}
                    </span>
                  </div>
                </>
              ) : (
                <div className="py-4 text-center text-muted-foreground">
                  <p>{tPayment("noMethodsTitle")}</p>
                </div>
              )}
            </div>
          </div>

          <div className="pt-3 pb-3 px-4 border-t bg-muted/10 flex items-center justify-end gap-2">
            {onEditPayment && (
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={onEditPayment}
                className="text-xs h-7 px-2.5 gap-1.5 font-medium"
              >
                <Edit3 className="size-3" />
                <span>{tPayment("manageMethodsBtn")}</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </CardContent>
  )
}
