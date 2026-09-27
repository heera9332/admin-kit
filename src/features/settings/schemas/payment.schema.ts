import { z } from "zod"

export const paymentCardSchema = z.object({
  cardholderName: z
    .string()
    .trim()
    .min(2, "Cardholder name is required")
    .max(60, "Name must be under 60 characters"),
  cardNumber: z
    .string()
    .trim()
    .min(15, "Card number is required")
    .max(19, "Card number is invalid"),
  expiry: z
    .string()
    .trim()
    .regex(/^(0[1-9]|1[0-2])\/?([0-9]{2})$/, "Expiry must be in MM/YY format"),
  cvc: z
    .string()
    .trim()
    .min(3, "CVC must be 3 or 4 digits")
    .max(4, "CVC must be 3 or 4 digits"),
  isDefault: z.boolean().default(false),
})

export type PaymentCardFormValues = z.infer<typeof paymentCardSchema>

export const paymentPayPalSchema = z.object({
  paypalEmail: z
    .string()
    .trim()
    .min(1, "PayPal email address is required")
    .email("Please enter a valid PayPal email address"),
  isDefault: z.boolean().default(false),
})

export type PaymentPayPalFormValues = z.infer<typeof paymentPayPalSchema>

export const paymentBankSchema = z.object({
  accountHolderName: z
    .string()
    .trim()
    .min(2, "Account holder name is required")
    .max(60, "Name must be under 60 characters"),
  bankName: z
    .string()
    .trim()
    .min(2, "Bank name is required")
    .max(60, "Bank name must be under 60 characters"),
  accountNumber: z
    .string()
    .trim()
    .min(4, "Account number is required")
    .max(20, "Account number must be under 20 characters"),
  routingNumber: z
    .string()
    .trim()
    .min(9, "Routing number must be 9 digits")
    .max(9, "Routing number must be 9 digits"),
  isDefault: z.boolean().default(false),
})

export type PaymentBankFormValues = z.infer<typeof paymentBankSchema>
