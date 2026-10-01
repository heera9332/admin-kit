"use client"

import * as React from "react"
import { Controller, type FieldValues } from "react-hook-form"

import { cn } from "@/lib/utils"
import type { ColSpan, DynamicFieldProps } from "@/types/form"
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
        render={({ field, fieldState }) => (
          <FieldRenderer
            config={config}
            value={field.value}
            onChange={field.onChange}
            onBlur={field.onBlur}
            name={field.name}
            fieldRef={field.ref}
            fieldState={fieldState}
            id={`field-${String(config.name)}`}
          />
        )}
      />
    </div>
  )
}
