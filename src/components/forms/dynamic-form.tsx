"use client"

import * as React from "react"
import { Loader2 } from "lucide-react"
import type { FieldValues } from "react-hook-form"

import { cn } from "@/lib/utils"
import type { DynamicFormProps } from "@/types/form"
import { FieldGroup } from "@/components/ui/field"
import { Button } from "@/components/ui/button"
import { DynamicField } from "./dynamic-field"

const gridColumnsMap: Record<1 | 2 | 3 | 4, string> = {
  1: "grid-cols-1",
  2: "grid-cols-1 md:grid-cols-2",
  3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
  4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
}

export function DynamicForm<TFieldValues extends FieldValues = FieldValues>({
  form,
  fields,
  onSubmit,
  submitLabel = "Submit",
  isSubmitting,
  columns = 2,
  className,
  gridClassName,
  children,
  secondaryAction,
  showSubmitButton = true,
}: DynamicFormProps<TFieldValues>) {
  const loading = isSubmitting ?? form.formState.isSubmitting

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className={cn("w-full space-y-6", className)}
      noValidate
    >
      <FieldGroup
        className={cn(
          "grid gap-4",
          gridColumnsMap[columns],
          gridClassName
        )}
      >
        {fields.map((fieldConfig) => (
          <DynamicField
            key={String(fieldConfig.name)}
            config={fieldConfig}
            control={form.control}
          />
        ))}
      </FieldGroup>

      {children}

      {showSubmitButton && (
        <div className="flex items-center justify-end gap-3 pt-2">
          {secondaryAction}
          <Button type="submit" disabled={loading} className="min-w-24">
            {loading && <Loader2 className="mr-2 size-4 animate-spin" />}
            {submitLabel}
          </Button>
        </div>
      )}
    </form>
  )
}
