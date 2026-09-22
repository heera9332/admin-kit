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
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import type { BillingAddress, ShippingAddress } from "../types/address"
import { formatAddress } from "../data/initial-addresses"
import { getCountryByCode } from "../data/countries"

interface AddressOverviewCardsProps {
  billingAddress: BillingAddress
  shippingAddress: ShippingAddress
  onEditBilling: () => void
  onEditShipping: () => void
}

export function AddressOverviewCards({
  billingAddress,
  shippingAddress,
  onEditBilling,
  onEditShipping,
}: AddressOverviewCardsProps) {
  const t = useTranslations("settings.addresses")

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

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2">
          <h3 className="text-base font-semibold">{t("title")}</h3>
          <Badge variant="secondary" className="text-[10px] h-5 px-1.5 font-normal">
            {t("badge")}
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground mt-0.5">{t("description")}</p>
      </div>

      <Separator />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Billing Address Card */}
        <Card className="rounded-xl border shadow-none bg-card hover:border-primary/30 transition-colors flex flex-col justify-between">
          <div>
            <CardHeader className="pb-3 border-b bg-muted/15">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
                    <CreditCard className="size-4" />
                  </div>
                  <div>
                    <CardTitle className="text-sm font-semibold">
                      {t("billingCardTitle")}
                    </CardTitle>
                    <CardDescription className="text-[11px]">
                      {t("billingCardDesc")}
                    </CardDescription>
                  </div>
                </div>
                <Badge variant="outline" className="text-[10px] h-5 font-normal">
                  WooCommerce
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="pt-4 text-xs space-y-3 leading-relaxed">
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
            </CardContent>
          </div>

          <CardFooter className="pt-3 pb-3 border-t bg-muted/10 flex items-center justify-between gap-2">
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
          </CardFooter>
        </Card>

        {/* Shipping Address Card */}
        <Card className="rounded-xl border shadow-none bg-card hover:border-primary/30 transition-colors flex flex-col justify-between">
          <div>
            <CardHeader className="pb-3 border-b bg-muted/15">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
                    <Truck className="size-4" />
                  </div>
                  <div>
                    <CardTitle className="text-sm font-semibold">
                      {t("shippingCardTitle")}
                    </CardTitle>
                    <CardDescription className="text-[11px]">
                      {t("shippingCardDesc")}
                    </CardDescription>
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
            </CardHeader>

            <CardContent className="pt-4 text-xs space-y-3 leading-relaxed">
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
            </CardContent>
          </div>

          <CardFooter className="pt-3 pb-3 border-t bg-muted/10 flex items-center justify-between gap-2">
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
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
