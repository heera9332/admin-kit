"use client"

import * as React from "react"
import { Store, CreditCard, MapPin, Coins } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  SidebarNav,
  type SidebarNavItem,
} from "@/components/navigation/sidebar-nav"
import { Card } from "@/components/ui/card"

export const ecommerceSettingsNavItems: SidebarNavItem[] = [
  {
    title: "Store Settings",
    titleKey: "settings.sidebar.store",
    description: "Store identity, selling locations, and general rules",
    descriptionKey: "settings.sidebar.storeDesc",
    href: "/dashboard/ecommerce/settings/store",
    icon: Store,
  },
  {
    title: "Payments",
    titleKey: "settings.sidebar.payments",
    description: "Payment gateways, Stripe, PayPal, and offline methods",
    descriptionKey: "settings.sidebar.paymentsDesc",
    href: "/dashboard/ecommerce/settings/payments",
    icon: CreditCard,
  },
  {
    title: "Store Address",
    titleKey: "settings.sidebar.address",
    description: "Physical headquarters, returns, and warehouse address",
    descriptionKey: "settings.sidebar.addressDesc",
    href: "/dashboard/ecommerce/settings/address",
    icon: MapPin,
  },
  {
    title: "Currency Options",
    titleKey: "settings.sidebar.currency",
    description: "Currency symbol, position, separators, and decimals",
    descriptionKey: "settings.sidebar.currencyDesc",
    href: "/dashboard/ecommerce/settings/currency",
    icon: Coins,
  },
]

export interface EcommerceSettingsSidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  items?: SidebarNavItem[]
  variant?: "pills" | "indicator" | "cards"
  showDescriptions?: boolean
}

export function EcommerceSettingsSidebar({
  items = ecommerceSettingsNavItems,
  variant = "pills",
  showDescriptions = false,
  className,
  ...props
}: EcommerceSettingsSidebarProps) {
  return (
    <Card className={cn("p-3 sm:p-4 overflow-hidden shadow-xs", className)} {...props}>
      <SidebarNav
        items={items}
        variant={variant}
        orientation="auto"
        showDescriptions={showDescriptions}
        showIcons={true}
        showBadges={true}
        translationNamespace="ecommerce"
      />
    </Card>
  )
}
