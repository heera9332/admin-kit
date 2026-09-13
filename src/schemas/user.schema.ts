import { z } from "zod"

export const userSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters"),

  email: z
    .string()
    .email("Invalid email address"),

  age: z
    .coerce
    .number({ invalid_type_error: "Age is required" })
    .min(18, "Minimum age is 18"),

  role: z.enum(["admin", "manager", "cashier"], {
    errorMap: () => ({ message: "Please select a valid role" }),
  }),

  bio: z.string().optional(),

  isActive: z.boolean().default(true),
})

export type UserFormValues = z.infer<typeof userSchema>
