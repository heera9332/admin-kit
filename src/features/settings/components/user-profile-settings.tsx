"use client"

import * as React from "react"
import { useSearchParams, useRouter, usePathname } from "next/navigation"
import { useTranslations } from "next-intl"
import {
  BookOpen,
  CreditCard,
  Receipt,
  Truck,
  User,
} from "lucide-react"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ProfileInfoForm } from "./profile-info-form"
import { BillingAddressForm } from "./billing-address-form"
import { ShippingAddressForm } from "./shipping-address-form"
import { AddressOverviewCards } from "./address-overview-cards"
import { PaymentMethodsManager } from "./payment-methods-manager"
import type {
  AddressSettingsTab,
  BillingAddress,
  ShippingAddress,
  UserProfileData,
  PaymentMethod,
} from "../types/address"
import {
  INITIAL_BILLING_ADDRESS,
  INITIAL_SHIPPING_ADDRESS,
  INITIAL_USER_PROFILE,
} from "../data/initial-addresses"
import { INITIAL_PAYMENT_METHODS } from "../data/initial-payments"

export function UserProfileSettings() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const tTabs = useTranslations("settings.addresses.tabs")
  const tProfile = useTranslations("settings.profile")
  const tBilling = useTranslations("settings.billing")
  const tShipping = useTranslations("settings.shipping")
  const tPayment = useTranslations("settings.payment")
  const tOverview = useTranslations("settings.addresses")

  // Determine active tab from URL search params or fallback to "profile"
  const urlTab = searchParams.get("tab") as AddressSettingsTab | null
  const validTabs: AddressSettingsTab[] = [
    "profile",
    "billing",
    "shipping",
    "payment",
    "overview",
  ]
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

  const [paymentMethods, setPaymentMethods] = React.useState<PaymentMethod[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("adminkit_payment_methods")
        if (saved) return JSON.parse(saved)
      } catch {
        // Ignore JSON error
      }
    }
    return INITIAL_PAYMENT_METHODS
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

  // Handle saving payment methods
  const handleSavePayments = (data: PaymentMethod[]) => {
    setPaymentMethods(data)
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("adminkit_payment_methods", JSON.stringify(data))
      } catch {
        // Ignore
      }
    }
  }

  return (
    <Card className=" ">
      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        className="w-full"
      >
        {/* Card Header with Sub-Page Title, Description & Tabs */}
        <CardHeader className="border-b pb-4 space-y-4">
          <div>
            <CardTitle className="text-base font-semibold">
              {activeTab === "profile" && tProfile("title")}
              {activeTab === "billing" && tBilling("title")}
              {activeTab === "shipping" && tShipping("title")}
              {activeTab === "payment" && tPayment("title")}
              {activeTab === "overview" && tOverview("title")}
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground mt-0.5">
              {activeTab === "profile" && tProfile("description")}
              {activeTab === "billing" && tBilling("subtitle")}
              {activeTab === "shipping" && tShipping("subtitle")}
              {activeTab === "payment" && tPayment("subtitle")}
              {activeTab === "overview" && tOverview("description")}
            </CardDescription>
          </div>

          <div className="w-full">
            <TabsList className="inline-flex h-9 w-full sm:w-auto items-center justify-start gap-1 rounded-lg bg-muted/60 p-1 text-muted-foreground border flex-wrap">
              <TabsTrigger
                value="profile"
                className="text-xs h-7 px-3 gap-2 font-medium"
              >
                <User className="size-3.5" />
                <span>{tTabs("profile")}</span>
              </TabsTrigger>

              <TabsTrigger
                value="billing"
                className="text-xs h-7 px-3 gap-2 font-medium"
              >
                <Receipt className="size-3.5" />
                <span>{tTabs("billing")}</span>
              </TabsTrigger>

              <TabsTrigger
                value="shipping"
                className="text-xs h-7 px-3 gap-2 font-medium"
              >
                <Truck className="size-3.5" />
                <span>{tTabs("shipping")}</span>
              </TabsTrigger>

              <TabsTrigger
                value="payment"
                className="text-xs h-7 px-3 gap-2 font-medium"
              >
                <CreditCard className="size-3.5" />
                <span>{tTabs("payment")}</span>
              </TabsTrigger>

              <TabsTrigger
                value="overview"
                className="text-xs h-7 px-3 gap-2 font-medium"
              >
                <BookOpen className="size-3.5" />
                <span>{tTabs("overview")}</span>
              </TabsTrigger>
            </TabsList>
          </div>
        </CardHeader>

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

        {/* Tab 4: eCommerce Payment Methods */}
        <TabsContent value="payment" className="mt-0 outline-none">
          <PaymentMethodsManager
            paymentMethods={paymentMethods}
            onSave={handleSavePayments}
          />
        </TabsContent>

        {/* Tab 5: eCommerce Address & Payment Book Overview */}
        <TabsContent value="overview" className="mt-0 outline-none">
          <AddressOverviewCards
            billingAddress={billingAddress}
            shippingAddress={shippingAddress}
            paymentMethods={paymentMethods}
            onEditBilling={() => handleTabChange("billing")}
            onEditShipping={() => handleTabChange("shipping")}
            onEditPayment={() => handleTabChange("payment")}
          />
        </TabsContent>
      </Tabs>
    </Card>
  )
}
