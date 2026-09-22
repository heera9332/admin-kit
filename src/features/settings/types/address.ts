export interface CountryOption {
  code: string
  name: string
  flag?: string
  states?: StateOption[]
}

export interface StateOption {
  code: string
  name: string
}

export interface BillingAddress {
  firstName: string
  lastName: string
  company?: string
  country: string
  address1: string
  address2?: string
  city: string
  state: string
  postcode: string
  phone: string
  email: string
  vatId?: string
}

export interface ShippingAddress {
  sameAsBilling: boolean
  firstName: string
  lastName: string
  company?: string
  country: string
  address1: string
  address2?: string
  city: string
  state: string
  postcode: string
  notes?: string
}

export interface UserProfileData {
  username: string
  fullName: string
  email: string
  phone?: string
  bio?: string
  avatarUrl?: string
}

export type AddressSettingsTab = "profile" | "billing" | "shipping" | "overview"
