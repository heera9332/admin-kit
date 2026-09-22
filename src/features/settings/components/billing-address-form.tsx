"use client"

import * as React from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useTranslations } from "next-intl"
import {
  Check,
  Copy,
  CreditCard,
  Loader2,
  RotateCcw,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  billingAddressSchema,
  type BillingAddressFormValues,
} from "../schemas/address.schema"
import type { BillingAddress } from "../types/address"
import { COUNTRIES, getStatesForCountry } from "../data/countries"
import { formatAddress } from "../data/initial-addresses"

interface BillingAddressFormProps {
  initialData: BillingAddress
  onSave?: (data: BillingAddress) => void
}

export function BillingAddressForm({
  initialData,
  onSave,
}: BillingAddressFormProps) {
  const t = useTranslations("settings.billing")

  const [saved, setSaved] = React.useState(false)
  const [isPending, setIsPending] = React.useState(false)
  const [copied, setCopied] = React.useState(false)

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    reset,
    formState: { errors, isDirty },
  } = useForm<BillingAddressFormValues>({
    resolver: zodResolver(billingAddressSchema),
    defaultValues: {
      firstName: initialData.firstName,
      lastName: initialData.lastName,
      company: initialData.company || "",
      country: initialData.country,
      address1: initialData.address1,
      address2: initialData.address2 || "",
      city: initialData.city,
      state: initialData.state,
      postcode: initialData.postcode,
      phone: initialData.phone,
      email: initialData.email,
      vatId: initialData.vatId || "",
    },
  })

  const selectedCountry = watch("country")
  const availableStates = React.useMemo(() => {
    return getStatesForCountry(selectedCountry)
  }, [selectedCountry])

  const currentValues = watch()

  const onSubmit = (data: BillingAddressFormValues) => {
    setIsPending(true)
    setTimeout(() => {
      setIsPending(false)
      setSaved(true)
      onSave?.({
        firstName: data.firstName,
        lastName: data.lastName,
        company: data.company || undefined,
        country: data.country,
        address1: data.address1,
        address2: data.address2 || undefined,
        city: data.city,
        state: data.state,
        postcode: data.postcode,
        phone: data.phone,
        email: data.email,
        vatId: data.vatId || undefined,
      })
      setTimeout(() => setSaved(false), 3500)
    }, 600)
  }

  const handleReset = () => {
    reset({
      firstName: initialData.firstName,
      lastName: initialData.lastName,
      company: initialData.company || "",
      country: initialData.country,
      address1: initialData.address1,
      address2: initialData.address2 || "",
      city: initialData.city,
      state: initialData.state,
      postcode: initialData.postcode,
      phone: initialData.phone,
      email: initialData.email,
      vatId: initialData.vatId || "",
    })
  }

  const handleCopyFormatted = async () => {
    try {
      const formatted = formatAddress(
        {
          firstName: currentValues.firstName,
          lastName: currentValues.lastName,
          company: currentValues.company,
          country: currentValues.country,
          address1: currentValues.address1,
          address2: currentValues.address2,
          city: currentValues.city,
          state: currentValues.state,
          postcode: currentValues.postcode,
          phone: currentValues.phone,
          email: currentValues.email,
        },
        "billing"
      )
      await navigator.clipboard.writeText(formatted)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    } catch {
      // Fallback
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Header with Title and Badges */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-semibold">{t("title")}</h3>
            <Badge variant="secondary" className="text-[10px] h-5 px-1.5 font-normal">
              {t("badge")}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">{t("subtitle")}</p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleCopyFormatted}
            className="text-xs h-8 gap-1.5 shrink-0"
          >
            {copied ? (
              <>
                <Check className="size-3.5 text-emerald-500" />
                <span>{t("copied")}</span>
              </>
            ) : (
              <>
                <Copy className="size-3.5" />
                <span>{t("copyAddress")}</span>
              </>
            )}
          </Button>
        </div>
      </div>

      <Separator />

      {/* Form Fields */}
      <div className="space-y-4">
        {/* Name Fields: First Name & Last Name (2 cols) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="billing_first_name" className="text-xs">
              {t("firstName")} <span className="text-destructive">*</span>
            </Label>
            <Input
              id="billing_first_name"
              {...register("firstName")}
              className="text-xs"
              placeholder="e.g. Heera"
              aria-invalid={!!errors.firstName}
            />
            {errors.firstName && (
              <p className="text-[11px] text-destructive">
                {errors.firstName.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="billing_last_name" className="text-xs">
              {t("lastName")} <span className="text-destructive">*</span>
            </Label>
            <Input
              id="billing_last_name"
              {...register("lastName")}
              className="text-xs"
              placeholder="e.g. Singh"
              aria-invalid={!!errors.lastName}
            />
            {errors.lastName && (
              <p className="text-[11px] text-destructive">
                {errors.lastName.message}
              </p>
            )}
          </div>
        </div>

        {/* Company Name (optional) */}
        <div className="space-y-1.5">
          <Label htmlFor="billing_company" className="text-xs">
            {t("companyOptional")}
          </Label>
          <Input
            id="billing_company"
            {...register("company")}
            className="text-xs"
            placeholder="e.g. Acme Technologies Inc."
            aria-invalid={!!errors.company}
          />
          {errors.company && (
            <p className="text-[11px] text-destructive">
              {errors.company.message}
            </p>
          )}
        </div>

        {/* Country / Region */}
        <div className="space-y-1.5">
          <Label htmlFor="billing_country" className="text-xs">
            {t("country")} <span className="text-destructive">*</span>
          </Label>
          <Controller
            control={control}
            name="country"
            render={({ field }) => (
              <Select
                value={field.value}
                onValueChange={(val) => {
                  if (typeof val === "string") {
                    field.onChange(val)
                    // If country changes, check if state needs reset or fallback
                    const newStates = getStatesForCountry(val)
                    if (newStates.length > 0) {
                      setValue("state", newStates[0].name)
                    } else {
                      setValue("state", "")
                    }
                  }
                }}
              >
                <SelectTrigger id="billing_country" className="text-xs">
                  <SelectValue placeholder={t("selectCountry")} />
                </SelectTrigger>
                <SelectContent>
                  {COUNTRIES.map((country) => (
                    <SelectItem key={country.code} value={country.code}>
                      <span className="mr-1.5">{country.flag}</span>
                      {country.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.country && (
            <p className="text-[11px] text-destructive">
              {errors.country.message}
            </p>
          )}
        </div>

        {/* Street Address Line 1 */}
        <div className="space-y-1.5">
          <Label htmlFor="billing_address_1" className="text-xs">
            {t("address1")} <span className="text-destructive">*</span>
          </Label>
          <Input
            id="billing_address_1"
            {...register("address1")}
            className="text-xs"
            placeholder={t("address1Placeholder")}
            aria-invalid={!!errors.address1}
          />
          {errors.address1 && (
            <p className="text-[11px] text-destructive">
              {errors.address1.message}
            </p>
          )}
        </div>

        {/* Street Address Line 2 */}
        <div className="space-y-1.5">
          <Label htmlFor="billing_address_2" className="text-xs">
            {t("address2")}
          </Label>
          <Input
            id="billing_address_2"
            {...register("address2")}
            className="text-xs"
            placeholder={t("address2Placeholder")}
            aria-invalid={!!errors.address2}
          />
          {errors.address2 && (
            <p className="text-[11px] text-destructive">
              {errors.address2.message}
            </p>
          )}
        </div>

        {/* Town / City, State, Postcode / ZIP (3 columns) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Town / City */}
          <div className="space-y-1.5">
            <Label htmlFor="billing_city" className="text-xs">
              {t("city")} <span className="text-destructive">*</span>
            </Label>
            <Input
              id="billing_city"
              {...register("city")}
              className="text-xs"
              placeholder="e.g. San Francisco"
              aria-invalid={!!errors.city}
            />
            {errors.city && (
              <p className="text-[11px] text-destructive">
                {errors.city.message}
              </p>
            )}
          </div>

          {/* State / Province */}
          <div className="space-y-1.5">
            <Label htmlFor="billing_state" className="text-xs">
              {t("state")} <span className="text-destructive">*</span>
            </Label>
            {availableStates.length > 0 ? (
              <Controller
                control={control}
                name="state"
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={(val) => {
                      if (typeof val === "string") {
                        field.onChange(val)
                      }
                    }}
                  >
                    <SelectTrigger id="billing_state" className="text-xs">
                      <SelectValue placeholder={t("selectState")} />
                    </SelectTrigger>
                    <SelectContent>
                      {availableStates.map((state) => (
                        <SelectItem key={state.code} value={state.name}>
                          {state.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            ) : (
              <Input
                id="billing_state"
                {...register("state")}
                className="text-xs"
                placeholder={t("statePlaceholder")}
                aria-invalid={!!errors.state}
              />
            )}
            {errors.state && (
              <p className="text-[11px] text-destructive">
                {errors.state.message}
              </p>
            )}
          </div>

          {/* Postcode / ZIP */}
          <div className="space-y-1.5">
            <Label htmlFor="billing_postcode" className="text-xs">
              {t("postcode")} <span className="text-destructive">*</span>
            </Label>
            <Input
              id="billing_postcode"
              {...register("postcode")}
              className="text-xs"
              placeholder="e.g. 94105"
              aria-invalid={!!errors.postcode}
            />
            {errors.postcode && (
              <p className="text-[11px] text-destructive">
                {errors.postcode.message}
              </p>
            )}
          </div>
        </div>

        {/* Contact Info: Phone & Email (2 columns) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Phone */}
          <div className="space-y-1.5">
            <Label htmlFor="billing_phone" className="text-xs">
              {t("phone")} <span className="text-destructive">*</span>
            </Label>
            <Input
              id="billing_phone"
              type="tel"
              {...register("phone")}
              className="text-xs"
              placeholder="+1 (555) 349-8821"
              aria-invalid={!!errors.phone}
            />
            {errors.phone && (
              <p className="text-[11px] text-destructive">
                {errors.phone.message}
              </p>
            )}
            <p className="text-[11px] text-muted-foreground">
              {t("phoneHelp")}
            </p>
          </div>

          {/* Email Address */}
          <div className="space-y-1.5">
            <Label htmlFor="billing_email" className="text-xs">
              {t("email")} <span className="text-destructive">*</span>
            </Label>
            <Input
              id="billing_email"
              type="email"
              {...register("email")}
              className="text-xs"
              placeholder="billing@example.com"
              aria-invalid={!!errors.email}
            />
            {errors.email && (
              <p className="text-[11px] text-destructive">
                {errors.email.message}
              </p>
            )}
            <p className="text-[11px] text-muted-foreground">
              {t("emailHelp")}
            </p>
          </div>
        </div>

        {/* Tax / VAT ID (optional) */}
        <div className="space-y-1.5">
          <Label htmlFor="billing_vat_id" className="text-xs">
            {t("vatIdOptional")}
          </Label>
          <Input
            id="billing_vat_id"
            {...register("vatId")}
            className="text-xs max-w-sm"
            placeholder="e.g. US941058821 / GB123456789"
            aria-invalid={!!errors.vatId}
          />
          {errors.vatId ? (
            <p className="text-[11px] text-destructive">{errors.vatId.message}</p>
          ) : (
            <p className="text-[11px] text-muted-foreground">{t("vatIdHelp")}</p>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="pt-2 flex flex-wrap items-center gap-3">
        <Button
          type="submit"
          size="sm"
          disabled={isPending}
          className="text-xs gap-1.5 min-w-32"
        >
          {isPending ? (
            <>
              <Loader2 className="size-3.5 animate-spin" />
              <span>{t("saving")}</span>
            </>
          ) : (
            <>
              <CreditCard className="size-3.5" />
              <span>{t("save")}</span>
            </>
          )}
        </Button>

        {isDirty && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleReset}
            className="text-xs gap-1 text-muted-foreground"
          >
            <RotateCcw className="size-3.5" />
            {t("reset")}
          </Button>
        )}

        {saved && (
          <span className="inline-flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium animate-in fade-in duration-200">
            <Check className="size-4" />
            {t("success")}
          </span>
        )}
      </div>
    </form>
  )
}
