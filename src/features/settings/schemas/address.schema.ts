import { z } from "zod"

export const billingAddressSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(1, "First name is required")
    .max(50, "First name must be under 50 characters"),
  lastName: z
    .string()
    .trim()
    .min(1, "Last name is required")
    .max(50, "Last name must be under 50 characters"),
  company: z
    .string()
    .trim()
    .max(100, "Company name must be under 100 characters")
    .optional()
    .or(z.literal("")),
  country: z
    .string()
    .min(1, "Please select a country / region"),
  address1: z
    .string()
    .trim()
    .min(3, "House number and street name is required")
    .max(120, "Street address must be under 120 characters"),
  address2: z
    .string()
    .trim()
    .max(120, "Apartment/suite must be under 120 characters")
    .optional()
    .or(z.literal("")),
  city: z
    .string()
    .trim()
    .min(1, "Town / City is required")
    .max(60, "City must be under 60 characters"),
  state: z
    .string()
    .trim()
    .min(1, "State / County / Province is required")
    .max(60, "State must be under 60 characters"),
  postcode: z
    .string()
    .trim()
    .min(2, "Postcode / ZIP is required")
    .max(20, "Postcode / ZIP must be under 20 characters"),
  phone: z
    .string()
    .trim()
    .min(5, "Valid phone number is required")
    .max(25, "Phone number must be under 25 characters"),
  email: z
    .string()
    .trim()
    .min(1, "Email address is required")
    .email("Please enter a valid email address"),
  vatId: z
    .string()
    .trim()
    .max(30, "Tax / VAT ID must be under 30 characters")
    .optional()
    .or(z.literal("")),
})

export type BillingAddressFormValues = z.infer<typeof billingAddressSchema>

export const shippingAddressSchema = z.object({
  sameAsBilling: z.boolean(),
  firstName: z
    .string()
    .trim()
    .min(1, "First name is required")
    .max(50, "First name must be under 50 characters"),
  lastName: z
    .string()
    .trim()
    .min(1, "Last name is required")
    .max(50, "Last name must be under 50 characters"),
  company: z
    .string()
    .trim()
    .max(100, "Company name must be under 100 characters")
    .optional()
    .or(z.literal("")),
  country: z
    .string()
    .min(1, "Please select a country / region"),
  address1: z
    .string()
    .trim()
    .min(3, "House number and street name is required")
    .max(120, "Street address must be under 120 characters"),
  address2: z
    .string()
    .trim()
    .max(120, "Apartment/suite must be under 120 characters")
    .optional()
    .or(z.literal("")),
  city: z
    .string()
    .trim()
    .min(1, "Town / City is required")
    .max(60, "City must be under 60 characters"),
  state: z
    .string()
    .trim()
    .min(1, "State / County / Province is required")
    .max(60, "State must be under 60 characters"),
  postcode: z
    .string()
    .trim()
    .min(2, "Postcode / ZIP is required")
    .max(20, "Postcode / ZIP must be under 20 characters"),
  notes: z
    .string()
    .trim()
    .max(500, "Notes must be under 500 characters")
    .optional()
    .or(z.literal("")),
})

export type ShippingAddressFormValues = z.infer<typeof shippingAddressSchema>

export const profileSchema = z.object({
  username: z
    .string()
    .trim()
    .min(2, "Username must be at least 2 characters")
    .max(30, "Username must be under 30 characters"),
  fullName: z
    .string()
    .trim()
    .min(2, "Full name must be at least 2 characters")
    .max(60, "Full name must be under 60 characters"),
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  phone: z
    .string()
    .trim()
    .max(25, "Phone number must be under 25 characters")
    .optional()
    .or(z.literal("")),
  bio: z
    .string()
    .trim()
    .max(300, "Bio must be under 300 characters")
    .optional()
    .or(z.literal("")),
})

export type ProfileFormValues = z.infer<typeof profileSchema>
