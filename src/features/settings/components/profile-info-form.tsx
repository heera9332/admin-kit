"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useTranslations } from "next-intl"
import { Check, Loader2, User, Camera } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  profileSchema,
  type ProfileFormValues,
} from "../schemas/address.schema"
import type { UserProfileData } from "../types/address"

interface ProfileInfoFormProps {
  initialData: UserProfileData
  onSave?: (data: UserProfileData) => void
}

export function ProfileInfoForm({
  initialData,
  onSave,
}: ProfileInfoFormProps) {
  const t = useTranslations("settings.profile")
  const tCommon = useTranslations("common")

  const [saved, setSaved] = React.useState(false)
  const [isPending, setIsPending] = React.useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: initialData.username,
      fullName: initialData.fullName,
      email: initialData.email,
      phone: initialData.phone || "",
      bio: initialData.bio || "",
    },
  })

  const onSubmit = (data: ProfileFormValues) => {
    setIsPending(true)
    setTimeout(() => {
      setIsPending(false)
      setSaved(true)
      onSave?.({
        ...initialData,
        ...data,
      })
      setTimeout(() => setSaved(false), 3500)
    }, 600)
  }

  const handleReset = () => {
    reset({
      username: initialData.username,
      fullName: initialData.fullName,
      email: initialData.email,
      phone: initialData.phone || "",
      bio: initialData.bio || "",
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <h3 className="text-base font-semibold">{t("title")}</h3>
        <p className="text-xs text-muted-foreground">{t("description")}</p>
      </div>

      <Separator />

      {/* Avatar display */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-xl border bg-muted/20">
        <div className="relative group">
          <Avatar className="size-16 ring-2 ring-primary/20">
            <AvatarImage src={initialData.avatarUrl} alt={initialData.fullName} />
            <AvatarFallback>
              <User className="size-8 text-muted-foreground" />
            </AvatarFallback>
          </Avatar>
          <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
            <Camera className="size-5 text-white" />
          </div>
        </div>
        <div className="space-y-1">
          <h4 className="text-xs font-semibold">{t("avatar")}</h4>
          <p className="text-[11px] text-muted-foreground">{t("avatarHelp")}</p>
          <div className="flex items-center gap-2 pt-1">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="text-[11px] h-7 px-2.5"
            >
              Upload new picture
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Full Name */}
        <div className="space-y-1.5">
          <Label htmlFor="fullName" className="text-xs">
            {t("fullName")} <span className="text-destructive">*</span>
          </Label>
          <Input
            id="fullName"
            {...register("fullName")}
            className="text-xs"
            placeholder="e.g. Heera Singh"
            aria-invalid={!!errors.fullName}
          />
          {errors.fullName ? (
            <p className="text-[11px] text-destructive">{errors.fullName.message}</p>
          ) : (
            <p className="text-[11px] text-muted-foreground">{t("fullNameHelp")}</p>
          )}
        </div>

        {/* Username */}
        <div className="space-y-1.5">
          <Label htmlFor="username" className="text-xs">
            {t("username")} <span className="text-destructive">*</span>
          </Label>
          <Input
            id="username"
            {...register("username")}
            className="text-xs"
            placeholder="e.g. adminkit"
            aria-invalid={!!errors.username}
          />
          {errors.username ? (
            <p className="text-[11px] text-destructive">{errors.username.message}</p>
          ) : (
            <p className="text-[11px] text-muted-foreground">{t("usernameHelp")}</p>
          )}
        </div>

        {/* Email */}
        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-xs">
            {t("email")} <span className="text-destructive">*</span>
          </Label>
          <Input
            id="email"
            type="email"
            {...register("email")}
            className="text-xs"
            placeholder="e.g. user@example.com"
            aria-invalid={!!errors.email}
          />
          {errors.email ? (
            <p className="text-[11px] text-destructive">{errors.email.message}</p>
          ) : (
            <p className="text-[11px] text-muted-foreground">{t("emailHelp")}</p>
          )}
        </div>

        {/* Phone */}
        <div className="space-y-1.5">
          <Label htmlFor="phone" className="text-xs">
            {t("phone")}
          </Label>
          <Input
            id="phone"
            type="tel"
            {...register("phone")}
            className="text-xs"
            placeholder="+1 (555) 349-8821"
            aria-invalid={!!errors.phone}
          />
          {errors.phone ? (
            <p className="text-[11px] text-destructive">{errors.phone.message}</p>
          ) : (
            <p className="text-[11px] text-muted-foreground">{t("phoneHelp")}</p>
          )}
        </div>
      </div>

      {/* Bio */}
      <div className="space-y-1.5">
        <Label htmlFor="bio" className="text-xs">
          {t("bio")}
        </Label>
        <Textarea
          id="bio"
          rows={3}
          {...register("bio")}
          className="text-xs"
          placeholder="Brief description about yourself..."
          aria-invalid={!!errors.bio}
        />
        {errors.bio ? (
          <p className="text-[11px] text-destructive">{errors.bio.message}</p>
        ) : (
          <p className="text-[11px] text-muted-foreground">{t("bioHelp")}</p>
        )}
      </div>

      {/* Submit / Reset Actions */}
      <div className="pt-2 flex flex-wrap items-center gap-3">
        <Button
          type="submit"
          size="sm"
          disabled={isPending}
          className="text-xs gap-1.5 min-w-28"
        >
          {isPending ? (
            <>
              <Loader2 className="size-3.5 animate-spin" />
              <span>{tCommon("saving")}</span>
            </>
          ) : (
            <span>{t("updateProfile")}</span>
          )}
        </Button>

        {isDirty && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleReset}
            className="text-xs text-muted-foreground"
          >
            {tCommon("reset")}
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
