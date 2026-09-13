import type { ReactNode } from "react"
import type {
  Control,
  ControllerFieldState,
  FieldValues,
  Path,
  SubmitHandler,
  UseFormReturn,
} from "react-hook-form"

export type FieldType =
  | "text"
  | "email"
  | "password"
  | "number"
  | "textarea"
  | "select"
  | "switch"
  | "checkbox"
  | "date"
  | "radio"

export type ColSpan = 1 | 2 | 3 | 4

export interface FieldOption {
  label: ReactNode
  value: string
  description?: ReactNode
  disabled?: boolean
}

export interface BaseFieldConfig<TFieldValues extends FieldValues = FieldValues> {
  name: Path<TFieldValues>
  label?: ReactNode
  description?: ReactNode
  placeholder?: string
  disabled?: boolean
  colSpan?: ColSpan
  className?: string
  required?: boolean
}

export interface TextFieldConfig<TFieldValues extends FieldValues = FieldValues>
  extends BaseFieldConfig<TFieldValues> {
  type: "text" | "email" | "password"
  autoComplete?: string
}

export interface NumberFieldConfig<TFieldValues extends FieldValues = FieldValues>
  extends BaseFieldConfig<TFieldValues> {
  type: "number"
  min?: number
  max?: number
  step?: number
}

export interface TextareaFieldConfig<TFieldValues extends FieldValues = FieldValues>
  extends BaseFieldConfig<TFieldValues> {
  type: "textarea"
  rows?: number
}

export interface SelectFieldConfig<TFieldValues extends FieldValues = FieldValues>
  extends BaseFieldConfig<TFieldValues> {
  type: "select"
  options: FieldOption[]
}

export interface SwitchFieldConfig<TFieldValues extends FieldValues = FieldValues>
  extends BaseFieldConfig<TFieldValues> {
  type: "switch"
}

export interface CheckboxFieldConfig<TFieldValues extends FieldValues = FieldValues>
  extends BaseFieldConfig<TFieldValues> {
  type: "checkbox"
  checkboxLabel?: ReactNode
}

export interface RadioFieldConfig<TFieldValues extends FieldValues = FieldValues>
  extends BaseFieldConfig<TFieldValues> {
  type: "radio"
  options: FieldOption[]
  orientation?: "horizontal" | "vertical"
}

export interface DateFieldConfig<TFieldValues extends FieldValues = FieldValues>
  extends BaseFieldConfig<TFieldValues> {
  type: "date"
  minDate?: Date
  maxDate?: Date
  dateFormat?: string
}

export type FieldConfig<TFieldValues extends FieldValues = FieldValues> =
  | TextFieldConfig<TFieldValues>
  | NumberFieldConfig<TFieldValues>
  | TextareaFieldConfig<TFieldValues>
  | SelectFieldConfig<TFieldValues>
  | SwitchFieldConfig<TFieldValues>
  | CheckboxFieldConfig<TFieldValues>
  | RadioFieldConfig<TFieldValues>
  | DateFieldConfig<TFieldValues>

export type FormFieldsConfig<TFieldValues extends FieldValues = FieldValues> =
  FieldConfig<TFieldValues>[]

export interface DynamicFieldProps<TFieldValues extends FieldValues = FieldValues> {
  config: FieldConfig<TFieldValues>
  control: Control<TFieldValues>
}

export interface FieldRendererProps<TFieldValues extends FieldValues = FieldValues> {
  config: FieldConfig<TFieldValues>
  value: unknown
  onChange: (...event: unknown[]) => void
  onBlur: () => void
  name: string
  fieldRef?: React.Ref<unknown>
  fieldState: ControllerFieldState
  id: string
}

export interface DynamicFormProps<TFieldValues extends FieldValues = FieldValues> {
  form: UseFormReturn<TFieldValues>
  fields: FormFieldsConfig<TFieldValues>
  onSubmit: SubmitHandler<TFieldValues>
  submitLabel?: string
  isSubmitting?: boolean
  columns?: 1 | 2 | 3 | 4
  className?: string
  gridClassName?: string
  children?: ReactNode
  secondaryAction?: ReactNode
  showSubmitButton?: boolean
}
