"use client"

import * as React from "react"
import { Controller, type FieldValues } from "react-hook-form"

import { cn } from "@/lib/utils"
import type { ColSpan, DynamicFieldProps } from "@/types/form"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field"
import { FieldRenderer } from "./field-renderer"

const colSpanClasses: Record<ColSpan, string> = {
  1: "col-span-1",
  2: "col-span-1 md:col-span-2",
  3: "col-span-1 md:col-span-3",
  4: "col-span-1 md:col-span-4",
}

export function DynamicField<TFieldValues extends FieldValues = FieldValues>({
  config,
  control,
}: DynamicFieldProps<TFieldValues>) {
  const colSpanClass = colSpanClasses[config.colSpan ?? 1]

  return (
    <div className={cn(colSpanClass, "w-full")}>
      <Controller
        control={control}
        name={config.name}
        render={({ field, fieldState }) => {
          const fieldId = `field-${String(config.name)}`
          const isSwitch = config.type === "switch"
          const isCheckbox = config.type === "checkbox"

          if (isSwitch) {
            return (
              <Field
                orientation="horizontal"
                data-invalid={fieldState.invalid}
                data-disabled={config.disabled}
                className={cn(
                  "flex items-center justify-between gap-4 rounded-lg border p-3 bg-card/40",
                  config.className
                )}
              >
                <FieldContent>
                  {config.label && (
                    <FieldLabel htmlFor={fieldId} className="cursor-pointer">
                      {config.label}
                      {config.required && (
                        <span className="text-destructive ml-1">*</span>
                      )}
                    </FieldLabel>
                  )}
                  {config.description && (
                    <FieldDescription>{config.description}</FieldDescription>
                  )}
                  {fieldState.error?.message && (
                    <FieldError>{fieldState.error.message}</FieldError>
                  )}
                </FieldContent>
                <FieldRenderer
                  config={config}
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  name={field.name}
                  fieldRef={field.ref}
                  fieldState={fieldState}
                  id={fieldId}
                />
              </Field>
            )
          }

          if (isCheckbox && !config.label) {
            return (
              <Field
                data-invalid={fieldState.invalid}
                data-disabled={config.disabled}
                className={config.className}
              >
                <FieldRenderer
                  config={config}
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  name={field.name}
                  fieldRef={field.ref}
                  fieldState={fieldState}
                  id={fieldId}
                />
                {config.description && (
                  <FieldDescription>{config.description}</FieldDescription>
                )}
                {fieldState.error?.message && (
                  <FieldError>{fieldState.error.message}</FieldError>
                )}
              </Field>
            )
          }

          return (
            <Field
              orientation="vertical"
              data-invalid={fieldState.invalid}
              data-disabled={config.disabled}
              className={config.className}
            >
              {config.label && (
                <FieldLabel htmlFor={fieldId}>
                  {config.label}
                  {config.required && (
                    <span className="text-destructive ml-1">*</span>
                  )}
                </FieldLabel>
              )}
              <FieldRenderer
                config={config}
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                name={field.name}
                fieldRef={field.ref}
                fieldState={fieldState}
                id={fieldId}
              />
              {config.description && (
                <FieldDescription>{config.description}</FieldDescription>
              )}
              {fieldState.error?.message && (
                <FieldError>{fieldState.error.message}</FieldError>
              )}
            </Field>
          )
        }}
      />
    </div>
  )
}
