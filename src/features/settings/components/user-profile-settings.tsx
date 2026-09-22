"use client"

import * as React from "react"
import { useSearchParams, useRouter, usePathname } from "next/navigation"
import { useTranslations } from "next-intl"
import {
  BookOpen,
  CreditCard,
  Truck,
  User,
} from "lucide-react"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProfileInfoForm } from "./profile-info-form"
import { BillingAddressForm } from "./billing-address-form"
import { ShippingAddressForm } from "./shipping-address-form"
import { AddressOverviewCards } from "./address-overview-cards"
import type {
  AddressSettingsTab,
  BillingAddress,
  ShippingAddress,
  UserProfileData,
} from "../types/address"
import {
  INITIAL_BILLING_ADDRESS,
  INITIAL_SHIPPING_ADDRESS,
  INITIAL_USER_PROFILE,
} from "../data/initial-addresses"

export function UserProfileSettings() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const t = useTranslations("settings.addresses.tabs")

  // Determine active tab from URL search params or fallback to "profile"
  const urlTab = searchParams.get("tab") as AddressSettingsTab | null
  const validTabs: AddressSettingsTab[] = ["profile", "billing", "shipping", "overview"]
  const initialTab = urlTab && validTabs.includes(urlTab) ? urlTab : "profile"

  const [activeTab, setActiveTab] = React.useState<string>(initialTab)

  // Address and Profile state
  const [profile, setProfile] = React.useState<UserProfileData>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("adminkit_user_profile")
        if (saved) return JSON.parse(saved)
      } catch {
        // Ignore JSON error
      }
    }
    return INITIAL_USER_PROFILE
  })

  const [billingAddress, setBillingAddress] = React.useState<BillingAddress>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("adminkit_billing_address")
        if (saved) return JSON.parse(saved)
      } catch {
        // Ignore JSON error
      }
    }
    return INITIAL_BILLING_ADDRESS
  })

  const [shippingAddress, setShippingAddress] = React.useState<ShippingAddress>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("adminkit_shipping_address")
        if (saved) return JSON.parse(saved)
      } catch {
        // Ignore JSON error
      }
    }
    return INITIAL_SHIPPING_ADDRESS
  })

  // Synchronize active tab with URL query parameter when tab changes
  const handleTabChange = (val: string | number | null | undefined) => {
    if (typeof val === "string") {
      setActiveTab(val)
      const params = new URLSearchParams(searchParams.toString())
      params.set("tab", val)
      router.replace(`${pathname}?${params.toString()}`, { scroll: false })
    }
  }

  // Handle saving profile
  const handleSaveProfile = (data: UserProfileData) => {
    setProfile(data)
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("adminkit_user_profile", JSON.stringify(data))
      } catch {
        // Ignore
      }
    }
  }

  // Handle saving billing address
  const handleSaveBilling = (data: BillingAddress) => {
    setBillingAddress(data)
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("adminkit_billing_address", JSON.stringify(data))
      } catch {
        // Ignore
      }
    }
    // If shipping is set to sameAsBilling, update shipping address as well
    if (shippingAddress.sameAsBilling) {
      const updatedShipping: ShippingAddress = {
        ...shippingAddress,
        firstName: data.firstName,
        lastName: data.lastName,
        company: data.company,
        country: data.country,
        address1: data.address1,
        address2: data.address2,
        city: data.city,
        state: data.state,
        postcode: data.postcode,
      }
      setShippingAddress(updatedShipping)
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem(
            "adminkit_shipping_address",
            JSON.stringify(updatedShipping)
          )
        } catch {
          // Ignore
        }
      }
    }
  }

  // Handle saving shipping address
  const handleSaveShipping = (data: ShippingAddress) => {
    setShippingAddress(data)
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("adminkit_shipping_address", JSON.stringify(data))
      } catch {
        // Ignore
      }
    }
  }

  return (
    <div className="space-y-6">
      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        className="w-full space-y-6"
      >
        {/* Navigation Tabs */}
        <div className="w-full overflow-x-auto pb-1">
          <TabsList className="inline-flex h-9 w-full sm:w-auto items-center justify-start gap-1 rounded-lg bg-muted p-1 text-muted-foreground border px-0">
            <TabsTrigger
              value="profile"
              className="text-xs h-7 px-3 gap-2 font-medium"
            >
              <User className="size-3.5" />
              <span>{t("profile")}</span>
            </TabsTrigger>

            <TabsTrigger
              value="billing"
              className="text-xs h-7 px-3 gap-2 font-medium"
            >
              <CreditCard className="size-3.5" />
              <span>{t("billing")}</span>
            </TabsTrigger>

            <TabsTrigger
              value="shipping"
              className="text-xs h-7 px-3 gap-2 font-medium"
            >
              <Truck className="size-3.5" />
              <span>{t("shipping")}</span>
            </TabsTrigger>

            <TabsTrigger
              value="overview"
              className="text-xs h-7 px-3 gap-2 font-medium"
            >
              <BookOpen className="size-3.5" />
              <span>{t("overview")}</span>
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Tab 1: Profile Information */}
        <TabsContent value="profile" className="mt-0 outline-none">
          <ProfileInfoForm
            initialData={profile}
            onSave={handleSaveProfile}
          />
        </TabsContent>

        {/* Tab 2: eCommerce Billing Address */}
        <TabsContent value="billing" className="mt-0 outline-none">
          <BillingAddressForm
            initialData={billingAddress}
            onSave={handleSaveBilling}
          />
        </TabsContent>

        {/* Tab 3: eCommerce Shipping Address */}
        <TabsContent value="shipping" className="mt-0 outline-none">
          <ShippingAddressForm
            initialData={shippingAddress}
            billingAddress={billingAddress}
            onSave={handleSaveShipping}
          />
        </TabsContent>

        {/* Tab 4: eCommerce Address Book Overview */}
        <TabsContent value="overview" className="mt-0 outline-none">
          <AddressOverviewCards
            billingAddress={billingAddress}
            shippingAddress={shippingAddress}
            onEditBilling={() => handleTabChange("billing")}
            onEditShipping={() => handleTabChange("shipping")}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
