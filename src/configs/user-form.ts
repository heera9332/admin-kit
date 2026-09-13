import type { FormFieldsConfig } from "@/types/form"
import type { UserFormValues } from "@/schemas/user.schema"

export const userFormFields: FormFieldsConfig<UserFormValues> = [
  {
    name: "name",
    label: "Full Name",
    type: "text",
    placeholder: "Enter full name",
    colSpan: 2,
    required: true,
  },
  {
    name: "email",
    label: "Email",
    type: "email",
    placeholder: "Enter email address",
    required: true,
  },
  {
    name: "age",
    label: "Age",
    type: "number",
    placeholder: "Enter age",
    required: true,
  },
  {
    name: "role",
    label: "Role",
    type: "select",
    placeholder: "Select role",
    options: [
      {
        label: "Admin",
        value: "admin",
      },
      {
        label: "Manager",
        value: "manager",
      },
      {
        label: "Cashier",
        value: "cashier",
      },
    ],
    required: true,
  },
  {
    name: "bio",
    label: "Bio",
    type: "textarea",
    placeholder: "Write something...",
    colSpan: 2,
  },
  {
    name: "isActive",
    label: "Active User",
    type: "switch",
    colSpan: 2,
  },
]
