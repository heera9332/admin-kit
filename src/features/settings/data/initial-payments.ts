import type { CardBrand, PaymentMethod } from "../types/payment"

export const INITIAL_PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: "pm-1",
    type: "card",
    isDefault: true,
    brand: "visa",
    cardholderName: "Heera Singh",
    last4: "4242",
    expiryMonth: "12",
    expiryYear: "28",
    createdAt: "2025-01-10",
  },
  {
    id: "pm-2",
    type: "card",
    isDefault: false,
    brand: "mastercard",
    cardholderName: "Heera Singh",
    last4: "8899",
    expiryMonth: "08",
    expiryYear: "27",
    createdAt: "2025-02-14",
  },
  {
    id: "pm-3",
    type: "paypal",
    isDefault: false,
    paypalEmail: "heera-singh@zoro-dev.com",
    createdAt: "2025-03-01",
  },
]

export function detectCardBrand(cardNumber: string): CardBrand {
  const sanitized = cardNumber.replace(/\D/g, "")
  if (/^4/.test(sanitized)) return "visa"
  if (/^(5[1-5]|2[2-7])/.test(sanitized)) return "mastercard"
  if (/^3[47]/.test(sanitized)) return "amex"
  if (/^(6011|65|64[4-9])/.test(sanitized)) return "discover"
  return "other"
}

export function formatCardNumber(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 16)
  return digits.replace(/(\d{4})(?=\d)/g, "$1 ")
}

export function formatExpiry(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 4)
  if (digits.length >= 3) {
    return `${digits.slice(0, 2)}/${digits.slice(2)}`
  }
  return digits
}
