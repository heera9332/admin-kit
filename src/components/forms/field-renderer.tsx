"use client"

import * as React from "react"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import type { FieldValues } from "react-hook-form"

import { cn } from "@/lib/utils"
import type { FieldRendererProps } from "@/types/form"
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
import { Label } from "@/components/ui/label"

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
  switch (config.type) {
    case "text":
    case "email":
    case "password":
      return (
        <Input
          id={id}
          type={config.type}
          placeholder={config.placeholder}
          disabled={config.disabled}
          autoComplete={config.autoComplete}
          value={typeof value === "string" || typeof value === "number" ? value : ""}
          onChange={onChange}
          onBlur={onBlur}
          name={name}
          ref={fieldRef as React.Ref<HTMLInputElement>}
          className="w-full"
          aria-invalid={fieldState.invalid}
        />
      )

    case "number":
      return (
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
      return (
        <Textarea
          id={id}
          placeholder={config.placeholder}
          disabled={config.disabled}
          rows={config.rows ?? 3}
          value={typeof value === "string" || typeof value === "number" ? value : ""}
          onChange={onChange}
          onBlur={onBlur}
          name={name}
          ref={fieldRef as React.Ref<HTMLTextAreaElement>}
          className="w-full"
          aria-invalid={fieldState.invalid}
        />
      )

    case "select":
      return (
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
            <SelectValue placeholder={config.placeholder ?? "Select an option"} />
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
        <Switch
          id={id}
          checked={Boolean(value)}
          onCheckedChange={onChange}
          disabled={config.disabled}
          aria-invalid={fieldState.invalid}
        />
      )

    case "checkbox":
      return (
        <div className="flex items-center gap-2">
          <Checkbox
            id={id}
            checked={Boolean(value)}
            onCheckedChange={onChange}
            disabled={config.disabled}
            aria-invalid={fieldState.invalid}
          />
          {config.checkboxLabel ? (
            <Label htmlFor={id} className="text-sm font-normal cursor-pointer">
              {config.checkboxLabel}
            </Label>
          ) : null}
        </div>
      )

    case "radio":
      return (
        <RadioGroup
          id={id}
          value={value != null ? String(value) : ""}
          onValueChange={onChange}
          disabled={config.disabled}
          className={cn(
            config.orientation === "horizontal"
              ? "flex flex-wrap gap-4"
              : "grid gap-2"
          )}
          aria-invalid={fieldState.invalid}
        >
          {config.options.map((option) => {
            const optionId = `${id}-${option.value}`
            return (
              <div key={option.value} className="flex items-center gap-2">
                <RadioGroupItem
                  value={option.value}
                  id={optionId}
                  disabled={option.disabled}
                />
                <Label
                  htmlFor={optionId}
                  className="text-sm font-normal cursor-pointer"
                >
                  {option.label}
                </Label>
              </div>
            )
          })}
        </RadioGroup>
      )

    case "date": {
      const selectedDate =
        value instanceof Date
          ? value
          : typeof value === "string" || typeof value === "number"
            ? new Date(value)
            : undefined

      const isValidDate = selectedDate instanceof Date && !isNaN(selectedDate.getTime())
      const formattedDate = isValidDate
        ? format(selectedDate, config.dateFormat ?? "PPP")
        : null

      return (
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

    case "custom":
      return config.render({
        value,
        onChange,
        onBlur,
        name,
        fieldState,
        id,
      })

    default:
      return null
  }
}
