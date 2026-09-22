import type { BillingAddress, ShippingAddress, UserProfileData } from "../types/address"
import { getCountryByCode } from "./countries"

export const INITIAL_USER_PROFILE: UserProfileData = {
  username: "adminkit",
  fullName: "Heera Singh",
  email: "heera-singh@zoro-dev.com",
  phone: "+1 (555) 349-8821",
  bio: "Full-stack engineer & creator of AdminKit. Building accessible, enterprise-grade dashboards with Next.js 16.",
  avatarUrl: "/avatars/01.png",
}

export const INITIAL_BILLING_ADDRESS: BillingAddress = {
  firstName: "Heera",
  lastName: "Singh",
  company: "Zoro Dev Technologies Inc.",
  country: "US",
  address1: "525 Market Street, Suite 1900",
  address2: "Floor 19, Office 402",
  city: "San Francisco",
  state: "California",
  postcode: "94105",
  phone: "+1 (555) 349-8821",
  email: "billing@zoro-dev.com",
  vatId: "US941058821",
}

export const INITIAL_SHIPPING_ADDRESS: ShippingAddress = {
  sameAsBilling: false,
  firstName: "Heera",
  lastName: "Singh",
  company: "Zoro Dev Technologies Inc.",
  country: "US",
  address1: "789 Logistics Hub Blvd",
  address2: "Building 4, Dock C",
  city: "San Francisco",
  state: "California",
  postcode: "94107",
  notes: "Please deliver between 9 AM and 5 PM on weekdays. Ring dock bell upon arrival.",
}

export interface FormattableAddress {
  firstName: string
  lastName: string
  company?: string
  country: string
  address1: string
  address2?: string
  city: string
  state: string
  postcode: string
  phone?: string
  email?: string
  notes?: string
}

export function formatAddress(
  address: FormattableAddress,
  type: "billing" | "shipping" = "billing"
): string {
  const parts: string[] = []

  const fullName = `${address.firstName} ${address.lastName}`.trim()
  if (fullName) parts.push(fullName)

  if (address.company) parts.push(address.company)

  if (address.address1) parts.push(address.address1)
  if (address.address2) parts.push(address.address2)

  const cityStateZip = [
    address.city,
    address.state,
    address.postcode,
  ]
    .filter(Boolean)
    .join(", ")

  if (cityStateZip) parts.push(cityStateZip)

  const countryName = getCountryByCode(address.country)?.name || address.country
  if (countryName) parts.push(countryName)

  if (type === "billing" && "phone" in address && address.phone) {
    parts.push(`Phone: ${address.phone}`)
  }

  if (type === "billing" && "email" in address && address.email) {
    parts.push(`Email: ${address.email}`)
  }

  if (type === "shipping" && "notes" in address && address.notes) {
    parts.push(`Delivery notes: ${address.notes}`)
  }

  return parts.join("\n")
}
