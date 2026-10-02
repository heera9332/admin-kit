"use client"

import * as React from "react"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import type { FieldValues } from "react-hook-form"

import { cn } from "@/lib/utils"
import type { FieldRendererProps } from "@/types/form"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { buttonVariants } from "@/components/ui/button"
import { RichText } from "./richtext"

export function FieldRenderer<TFieldValues extends FieldValues = FieldValues>({
  config,
  value,
  onChange,
  onBlur,
  name,
  fieldRef,
  fieldState,
  id,
}: FieldRendererProps<TFieldValues>) {
  const renderVerticalField = (control: React.ReactNode) => (
    <Field
      orientation="vertical"
      data-invalid={fieldState.invalid}
      data-disabled={config.disabled}
      className={config.className}
    >
      {config.label && (
        <FieldLabel htmlFor={id}>
          {config.label}
          {config.required && (
            <span className="text-destructive ml-1">*</span>
          )}
        </FieldLabel>
      )}
      {control}
      {config.description && (
        <FieldDescription>{config.description}</FieldDescription>
      )}
      {fieldState.error?.message && (
        <FieldError>{fieldState.error.message}</FieldError>
      )}
    </Field>
  )

  switch (config.type) {
    case "text":
    case "email":
    case "password":
      return renderVerticalField(
        <Input
          id={id}
          type={config.type}
          placeholder={config.placeholder}
          disabled={config.disabled}
          autoComplete={config.autoComplete}
          value={
            typeof value === "string" || typeof value === "number" ? value : ""
          }
          onChange={onChange}
          onBlur={onBlur}
          name={name}
          ref={fieldRef as React.Ref<HTMLInputElement>}
          className="w-full"
          aria-invalid={fieldState.invalid}
        />
      )

    case "number":
      return renderVerticalField(
        <Input
          id={id}
          type="number"
          placeholder={config.placeholder}
          disabled={config.disabled}
          min={config.min}
          max={config.max}
          step={config.step}
          value={
            value !== undefined && value !== null && value !== ""
              ? String(value)
              : ""
          }
          onChange={(event) => {
            const val = event.target.value
            onChange(val === "" ? undefined : Number(val))
          }}
          onBlur={onBlur}
          name={name}
          ref={fieldRef as React.Ref<HTMLInputElement>}
          className="w-full"
          aria-invalid={fieldState.invalid}
        />
      )

    case "textarea":
      return renderVerticalField(
        <Textarea
          id={id}
          placeholder={config.placeholder}
          disabled={config.disabled}
          rows={config.rows ?? 3}
          value={
            typeof value === "string" || typeof value === "number" ? value : ""
          }
          onChange={onChange}
          onBlur={onBlur}
          name={name}
          ref={fieldRef as React.Ref<HTMLTextAreaElement>}
          className="w-full"
          aria-invalid={fieldState.invalid}
        />
      )

    case "select":
      return renderVerticalField(
        <Select
          value={value != null ? String(value) : ""}
          onValueChange={onChange}
          disabled={config.disabled}
        >
          <SelectTrigger
            id={id}
            className="w-full"
            aria-invalid={fieldState.invalid}
          >
            <SelectValue
              placeholder={config.placeholder ?? "Select an option"}
            />
          </SelectTrigger>
          <SelectContent className="w-full">
            {config.options.map((option) => (
              <SelectItem
                key={option.value}
                value={option.value}
                disabled={option.disabled}
              >
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )

    case "switch":
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
              <FieldLabel htmlFor={id} className="cursor-pointer">
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
          <Switch
            id={id}
            checked={Boolean(value)}
            onCheckedChange={onChange}
            disabled={config.disabled}
            aria-invalid={fieldState.invalid}
          />
        </Field>
      )

    case "checkbox": {
      const hasTopLabel = Boolean(config.label && config.checkboxLabel)
      const labelText = config.checkboxLabel ?? config.label

      if (hasTopLabel) {
        return (
          <Field
            orientation="vertical"
            data-invalid={fieldState.invalid}
            data-disabled={config.disabled}
            className={config.className}
          >
            <FieldLabel id={`${id}-label`}>
              {config.label}
              {config.required && (
                <span className="text-destructive ml-1">*</span>
              )}
            </FieldLabel>
            <Field orientation="horizontal" className="items-center gap-2">
              <Checkbox
                id={id}
                checked={Boolean(value)}
                onCheckedChange={onChange}
                disabled={config.disabled}
                aria-invalid={fieldState.invalid}
              />
              {config.checkboxLabel && (
                <FieldLabel
                  htmlFor={id}
                  className="text-sm font-normal cursor-pointer"
                >
                  {config.checkboxLabel}
                </FieldLabel>
              )}
            </Field>
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
          orientation="horizontal"
          data-invalid={fieldState.invalid}
          data-disabled={config.disabled}
          className={cn("items-start gap-2", config.className)}
        >
          <Checkbox
            id={id}
            checked={Boolean(value)}
            onCheckedChange={onChange}
            disabled={config.disabled}
            aria-invalid={fieldState.invalid}
          />
          <FieldContent>
            {labelText && (
              <FieldLabel
                htmlFor={id}
                className="text-sm font-normal cursor-pointer"
              >
                {labelText}
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
        </Field>
      )
    }

    case "radio":
      return (
        <Field
          orientation="vertical"
          data-invalid={fieldState.invalid}
          data-disabled={config.disabled}
          className={config.className}
        >
          {config.label && (
            <FieldLabel id={`${id}-label`}>
              {config.label}
              {config.required && (
                <span className="text-destructive ml-1">*</span>
              )}
            </FieldLabel>
          )}
          <RadioGroup
            id={id}
            value={value != null ? String(value) : ""}
            onValueChange={onChange}
            disabled={config.disabled}
            aria-invalid={fieldState.invalid}
            aria-labelledby={config.label ? `${id}-label` : undefined}
          >
            <FieldGroup
              className={cn(
                config.orientation === "horizontal"
                  ? "flex flex-row flex-wrap gap-4"
                  : "flex flex-col gap-2"
              )}
            >
              {config.options.map((option) => {
                const optionId = `${id}-${option.value}`
                return (
                  <Field
                    key={option.value}
                    orientation="horizontal"
                    data-disabled={option.disabled || config.disabled}
                    className="w-auto items-center gap-2"
                  >
                    <RadioGroupItem
                      value={option.value}
                      id={optionId}
                      disabled={option.disabled || config.disabled}
                    />
                    <FieldContent>
                      <FieldLabel
                        htmlFor={optionId}
                        className="text-sm font-normal cursor-pointer"
                      >
                        {option.label}
                      </FieldLabel>
                      {option.description && (
                        <FieldDescription>
                          {option.description}
                        </FieldDescription>
                      )}
                    </FieldContent>
                  </Field>
                )
              })}
            </FieldGroup>
          </RadioGroup>
          {config.description && (
            <FieldDescription>{config.description}</FieldDescription>
          )}
          {fieldState.error?.message && (
            <FieldError>{fieldState.error.message}</FieldError>
          )}
        </Field>
      )

    case "date": {
      const selectedDate =
        value instanceof Date
          ? value
          : typeof value === "string" || typeof value === "number"
            ? new Date(value)
            : undefined

      const isValidDate =
        selectedDate instanceof Date && !isNaN(selectedDate.getTime())
      const formattedDate = isValidDate
        ? format(selectedDate, config.dateFormat ?? "PPP")
        : null

      return renderVerticalField(
        <Popover>
          <PopoverTrigger
            id={id}
            type="button"
            disabled={config.disabled}
            className={cn(
              buttonVariants({ variant: "outline" }),
              "w-full justify-start text-left font-normal h-8",
              !isValidDate && "text-muted-foreground",
              fieldState.invalid && "border-destructive text-destructive"
            )}
            aria-invalid={fieldState.invalid}
          >
            <CalendarIcon className="mr-2 size-4" />
            {formattedDate ?? (
              <span>{config.placeholder ?? "Pick a date"}</span>
            )}
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={isValidDate ? selectedDate : undefined}
              onSelect={(date) => {
                onChange(date)
              }}
              disabled={(date) => {
                if (config.minDate && date < config.minDate) return true
                if (config.maxDate && date > config.maxDate) return true
                return false
              }}
              autoFocus
            />
          </PopoverContent>
        </Popover>
      )
    }

    case "richtext":
    case "rich-text":
      return renderVerticalField(
        <RichText
          id={id}
          name={name}
          value={typeof value === "string" ? value : ""}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={config.placeholder}
          disabled={config.disabled}
          minHeight={config.minHeight}
          toolbarClassName={config.toolbarClassName}
          contentClassName={config.contentClassName}
          editable={config.editable}
          hideToolbar={config.hideToolbar}
          aria-invalid={fieldState.invalid}
          className="w-full"
          ref={fieldRef as React.Ref<HTMLDivElement>}
        />
      )

    case "custom":
      return renderVerticalField(
        config.render({
          value,
          onChange,
          onBlur,
          name,
          fieldState,
          id,
        })
      )

    default:
      return null
  }
}
