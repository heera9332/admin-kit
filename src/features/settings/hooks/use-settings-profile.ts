"use client"

import * as React from "react"
import type {
  BillingAddress,
  ShippingAddress,
  UserProfileData,
} from "../types/address"
import type { PaymentMethod } from "../types/payment"
import {
  INITIAL_BILLING_ADDRESS,
  INITIAL_SHIPPING_ADDRESS,
  INITIAL_USER_PROFILE,
} from "../data/initial-addresses"
import { INITIAL_PAYMENT_METHODS } from "../data/initial-payments"

const STORAGE_KEYS = {
  profile: "adminkit_user_profile",
  billing: "adminkit_billing_address",
  shipping: "adminkit_shipping_address",
  payment: "adminkit_payment_methods",
} as const

const SETTINGS_UPDATE_EVENT = "adminkit_settings_sync"

function getStoredValue<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback
  try {
    const item = localStorage.getItem(key)
    return item ? (JSON.parse(item) as T) : fallback
  } catch {
    return fallback
  }
}

export function useSettingsProfile() {
  const [profile, setProfile] = React.useState<UserProfileData>(INITIAL_USER_PROFILE)
  const [billingAddress, setBillingAddress] = React.useState<BillingAddress>(INITIAL_BILLING_ADDRESS)
  const [shippingAddress, setShippingAddress] = React.useState<ShippingAddress>(INITIAL_SHIPPING_ADDRESS)
  const [paymentMethods, setPaymentMethods] = React.useState<PaymentMethod[]>(INITIAL_PAYMENT_METHODS)

  React.useEffect(() => {
    const handleSync = () => {
      setProfile(getStoredValue(STORAGE_KEYS.profile, INITIAL_USER_PROFILE))
      setBillingAddress(getStoredValue(STORAGE_KEYS.billing, INITIAL_BILLING_ADDRESS))
      setShippingAddress(getStoredValue(STORAGE_KEYS.shipping, INITIAL_SHIPPING_ADDRESS))
      setPaymentMethods(getStoredValue(STORAGE_KEYS.payment, INITIAL_PAYMENT_METHODS))
    }

    handleSync()
    window.addEventListener(SETTINGS_UPDATE_EVENT, handleSync)
    window.addEventListener("storage", handleSync)

    return () => {
      window.removeEventListener(SETTINGS_UPDATE_EVENT, handleSync)
      window.removeEventListener("storage", handleSync)
    }
  }, [])

  const notifyChange = () => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent(SETTINGS_UPDATE_EVENT))
    }
  }

  const updateProfile = React.useCallback((data: UserProfileData) => {
    setProfile(data)
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(STORAGE_KEYS.profile, JSON.stringify(data))
        notifyChange()
      } catch {
        // Ignore quota errors
      }
    }
  }, [])

  const updateBillingAddress = React.useCallback((data: BillingAddress) => {
    setBillingAddress(data)
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(STORAGE_KEYS.billing, JSON.stringify(data))
        notifyChange()
      } catch {
        // Ignore quota errors
      }
    }
  }, [])

  const updateShippingAddress = React.useCallback((data: ShippingAddress) => {
    setShippingAddress(data)
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(STORAGE_KEYS.shipping, JSON.stringify(data))
        notifyChange()
      } catch {
        // Ignore quota errors
      }
    }
  }, [])

  const updatePaymentMethods = React.useCallback((methods: PaymentMethod[]) => {
    setPaymentMethods(methods)
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(STORAGE_KEYS.payment, JSON.stringify(methods))
        notifyChange()
      } catch {
        // Ignore quota errors
      }
    }
  }, [])

  return {
    profile,
    billingAddress,
    shippingAddress,
    paymentMethods,
    updateProfile,
    updateBillingAddress,
    updateShippingAddress,
    updatePaymentMethods,
  }
}
