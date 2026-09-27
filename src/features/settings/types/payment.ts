export type PaymentMethodType = "card" | "paypal" | "bank_account"

export type CardBrand = "visa" | "mastercard" | "amex" | "discover" | "other"

export interface PaymentMethod {
  id: string
  type: PaymentMethodType
  isDefault: boolean
  cardholderName?: string
  brand?: CardBrand
  last4?: string
  expiryMonth?: string
  expiryYear?: string
  paypalEmail?: string
  bankName?: string
  accountHolderName?: string
  accountNumberLast4?: string
  routingNumber?: string
  createdAt: string
}
