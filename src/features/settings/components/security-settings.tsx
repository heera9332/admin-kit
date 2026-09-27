"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useTranslations } from "next-intl"
import {
  ShieldCheck,
  KeyRound,
  Smartphone,
  Eye,
  EyeOff,
  Check,
  Copy,
  Download,
  AlertTriangle,
  Laptop,
  Globe,
  Loader2,
  Lock,
  RefreshCw,
  LogOut,
  CheckCircle2,
  XCircle,
} from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { QRCodeSvg } from "@/components/shared/qr-code-svg"
import { useSecuritySettings } from "../hooks/use-security-settings"
import {
  changePasswordSchema,
  type ChangePasswordFormValues,
} from "../schemas/security.schema"

export function SecuritySettings() {
  const t = useTranslations("settings.security")
  const tCommon = useTranslations("common")

  const {
    settings,
    updatePassword,
    enableTwoFactor,
    disableTwoFactor,
    regenerateBackupCodes,
    revokeSession,
    revokeAllOtherSessions,
  } = useSecuritySettings()

  // Password Form State
  const [showCurrentPassword, setShowCurrentPassword] = React.useState(false)
  const [showNewPassword, setShowNewPassword] = React.useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false)
  const [passwordSuccess, setPasswordSuccess] = React.useState(false)
  const [passwordError, setPasswordError] = React.useState<string | null>(null)
  const [isUpdatingPassword, setIsUpdatingPassword] = React.useState(false)

  // 2FA Dialog States
  const [isEnable2FADialogOpen, setIsEnable2FADialogOpen] = React.useState(false)
  const [setupStep, setSetupStep] = React.useState<1 | 2 | 3>(1)
  const [verificationCode, setVerificationCode] = React.useState("")
  const [verificationError, setVerificationError] = React.useState<string | null>(null)
  const [isVerifying2FA, setIsVerifying2FA] = React.useState(false)
  const [copiedSecret, setCopiedSecret] = React.useState(false)
  const [backupCodesAcknowledged, setBackupCodesAcknowledged] = React.useState(false)
  const [copiedCodes, setCopiedCodes] = React.useState(false)

  // View Backup Codes Dialog
  const [isViewCodesDialogOpen, setIsViewCodesDialogOpen] = React.useState(false)

  // Disable 2FA Dialog
  const [isDisable2FADialogOpen, setIsDisable2FADialogOpen] = React.useState(false)
  const [disablePassword, setDisablePassword] = React.useState("")
  const [disableError, setDisableError] = React.useState<string | null>(null)
  const [isDisabling2FA, setIsDisabling2FA] = React.useState(false)

  // React Hook Form for Password
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  })

  const newPasswordValue = watch("newPassword") || ""

  // Password Strength Evaluation
  const passwordStrength = React.useMemo(() => {
    let score = 0
    if (!newPasswordValue) return { score: 0, label: "", color: "bg-muted" }
    if (newPasswordValue.length >= 8) score += 25
    if (/[A-Z]/.test(newPasswordValue)) score += 25
    if (/[0-9]/.test(newPasswordValue)) score += 25
    if (/[^A-Za-z0-9]/.test(newPasswordValue)) score += 25

    if (score <= 25) return { score, label: t("strengthWeak"), color: "bg-destructive" }
    if (score <= 50) return { score, label: t("strengthFair"), color: "bg-amber-500" }
    if (score <= 75) return { score, label: t("strengthGood"), color: "bg-blue-500" }
    return { score, label: t("strengthStrong"), color: "bg-emerald-500" }
  }, [newPasswordValue, t])

  const onPasswordSubmit = async (data: ChangePasswordFormValues) => {
    setIsUpdatingPassword(true)
    setPasswordError(null)
    setPasswordSuccess(false)

    try {
      const res = await updatePassword(data.currentPassword, data.newPassword)
      if (!res.success) {
        setPasswordError(res.error || t("passwordUpdateError"))
      } else {
        setPasswordSuccess(true)
        reset()
        setTimeout(() => setPasswordSuccess(false), 4000)
      }
    } catch {
      setPasswordError(t("passwordUpdateError"))
    } finally {
      setIsUpdatingPassword(false)
    }
  }

  // Handle 2FA Setup Flow
  const handleOpenEnable2FA = () => {
    setSetupStep(1)
    setVerificationCode("")
    setVerificationError(null)
    setBackupCodesAcknowledged(false)
    setIsEnable2FADialogOpen(true)
  }

  const handleCopySecret = () => {
    if (settings.twoFactor.secret) {
      navigator.clipboard.writeText(settings.twoFactor.secret)
      setCopiedSecret(true)
      setTimeout(() => setCopiedSecret(false), 2500)
    }
  }

  const handleVerify2FACode = async () => {
    if (verificationCode.length !== 6) {
      setVerificationError(t("twoFactorCodeRequired"))
      return
    }

    setIsVerifying2FA(true)
    setVerificationError(null)

    // Simulate OTP validation against TOTP algorithm (accept standard test or any 6 digits)
    setTimeout(async () => {
      try {
        await enableTwoFactor("authenticator")
        setIsVerifying2FA(false)
        setSetupStep(3)
      } catch {
        setIsVerifying2FA(false)
        setVerificationError(t("twoFactorInvalidCode"))
      }
    }, 600)
  }

  const handleCopyAllBackupCodes = () => {
    const text = settings.twoFactor.backupCodes.join("\n")
    navigator.clipboard.writeText(text)
    setCopiedCodes(true)
    setTimeout(() => setCopiedCodes(false), 2500)
  }

  const handleDownloadBackupCodes = () => {
    const text = `ADMINTEMPLATE BACKUP RECOVERY CODES\nGenerated: ${new Date().toLocaleString()}\n\n` +
      settings.twoFactor.backupCodes.join("\n") +
      `\n\nEach code can only be used once. Keep these in a safe place.`
    const blob = new Blob([text], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "adminkit-recovery-codes.txt"
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleFinish2FA = () => {
    setIsEnable2FADialogOpen(false)
  }

  // Handle Disable 2FA
  const handleConfirmDisable2FA = async () => {
    if (!disablePassword) {
      setDisableError(t("enterCurrentPassword"))
      return
    }

    setIsDisabling2FA(true)
    setDisableError(null)

    const res = await disableTwoFactor(disablePassword)
    setIsDisabling2FA(false)

    if (!res.success) {
      setDisableError(res.error || t("invalidPassword"))
    } else {
      setIsDisable2FADialogOpen(false)
      setDisablePassword("")
    }
  }

  const formattedLastChanged = React.useMemo(() => {
    if (!settings.passwordLastChanged) return t("never")
    try {
      const date = new Date(settings.passwordLastChanged)
      return date.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    } catch {
      return t("recently")
    }
  }, [settings.passwordLastChanged, t])

  return (
    <div className="space-y-6">
      {/* 1. Security Overview Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl border bg-muted/20">
        <div className="flex items-center gap-3.5">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <ShieldCheck className="size-5" />
          </div>
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-foreground">
                {t("overviewTitle")}
              </h3>
              <Badge
                variant={settings.twoFactor.enabled ? "default" : "secondary"}
                className="text-[10px] px-2 py-0.5"
              >
                {settings.twoFactor.enabled ? (
                  <span className="flex items-center gap-1">
                    <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    {t("statusHigh")}
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400">
                    <AlertTriangle className="size-3" />
                    {t("statusModerate")}
                  </span>
                )}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              {settings.twoFactor.enabled
                ? t("overviewProtectedDesc")
                : t("overviewUnprotectedDesc")}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto text-xs text-muted-foreground font-mono">
          <span>{t("passwordAge")}:</span>
          <span className="font-semibold text-foreground">{formattedLastChanged}</span>
        </div>
      </div>

      {/* 2. Password Update Form */}
      <Card className="gap-0">
        <CardHeader className="border-b pb-4">
          <div className="flex items-center gap-2">
            <KeyRound className="size-4 text-primary" />
            <CardTitle className="text-base font-semibold">
              {t("passwordTitle")}
            </CardTitle>
          </div>
          <CardDescription className="text-xs text-muted-foreground">
            {t("passwordDescription")}
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit(onPasswordSubmit)}>
          <CardContent className="space-y-4 py-4">
            {passwordError && (
              <div className="p-3 rounded-lg border border-destructive/30 bg-destructive/10 text-destructive text-xs flex items-center gap-2">
                <XCircle className="size-4 shrink-0" />
                <span>{passwordError}</span>
              </div>
            )}

            {passwordSuccess && (
              <div className="p-3 rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs flex items-center gap-2">
                <CheckCircle2 className="size-4 shrink-0" />
                <span>{t("passwordSuccess")}</span>
              </div>
            )}

            <div className="space-y-1.5 max-w-md">
              <Label htmlFor="currentPassword" className="text-xs">
                {t("currentPassword")} <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="currentPassword"
                  type={showCurrentPassword ? "text" : "password"}
                  placeholder="••••••••••••"
                  {...register("currentPassword")}
                  className="text-xs pr-9"
                  aria-invalid={!!errors.currentPassword}
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword((prev) => !prev)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                  tabIndex={-1}
                  aria-label={showCurrentPassword ? "Hide password" : "Show password"}
                >
                  {showCurrentPassword ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                </button>
              </div>
              {errors.currentPassword && (
                <p className="text-[11px] text-destructive">
                  {errors.currentPassword.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl">
              {/* New Password */}
              <div className="space-y-1.5">
                <Label htmlFor="newPassword" className="text-xs">
                  {t("newPassword")} <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    placeholder="••••••••••••"
                    {...register("newPassword")}
                    className="text-xs pr-9"
                    aria-invalid={!!errors.newPassword}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword((prev) => !prev)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                    tabIndex={-1}
                    aria-label={showNewPassword ? "Hide password" : "Show password"}
                  >
                    {showNewPassword ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </button>
                </div>
                {errors.newPassword && (
                  <p className="text-[11px] text-destructive">
                    {errors.newPassword.message}
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-1.5">
                <Label htmlFor="confirmPassword" className="text-xs">
                  {t("confirmPassword")} <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••••••"
                    {...register("confirmPassword")}
                    className="text-xs pr-9"
                    aria-invalid={!!errors.confirmPassword}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                    tabIndex={-1}
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-[11px] text-destructive">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>
            </div>

            {/* Real-time Password Strength Meter */}
            {newPasswordValue.length > 0 && (
              <div className="p-3.5 rounded-lg border bg-muted/20 space-y-2.5 max-w-2xl">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">{t("strengthLabel")}:</span>
                  <span className="font-semibold">{passwordStrength.label}</span>
                </div>
                <Progress
                  value={passwordStrength.score}
                  className="h-1.5"
                />

                <div className="grid grid-cols-2 gap-2 pt-1 text-[11px]">
                  <div className="flex items-center gap-1.5">
                    {newPasswordValue.length >= 8 ? (
                      <Check className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                    ) : (
                      <span className="size-1.5 rounded-full bg-muted-foreground/40 ml-1 mr-1" />
                    )}
                    <span className={newPasswordValue.length >= 8 ? "text-foreground font-medium" : "text-muted-foreground"}>
                      {t("reqLength")}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {/[A-Z]/.test(newPasswordValue) ? (
                      <Check className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                    ) : (
                      <span className="size-1.5 rounded-full bg-muted-foreground/40 ml-1 mr-1" />
                    )}
                    <span className={/[A-Z]/.test(newPasswordValue) ? "text-foreground font-medium" : "text-muted-foreground"}>
                      {t("reqUpper")}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {/[0-9]/.test(newPasswordValue) ? (
                      <Check className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                    ) : (
                      <span className="size-1.5 rounded-full bg-muted-foreground/40 ml-1 mr-1" />
                    )}
                    <span className={/[0-9]/.test(newPasswordValue) ? "text-foreground font-medium" : "text-muted-foreground"}>
                      {t("reqNumber")}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {/[^A-Za-z0-9]/.test(newPasswordValue) ? (
                      <Check className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                    ) : (
                      <span className="size-1.5 rounded-full bg-muted-foreground/40 ml-1 mr-1" />
                    )}
                    <span className={/[^A-Za-z0-9]/.test(newPasswordValue) ? "text-foreground font-medium" : "text-muted-foreground"}>
                      {t("reqSymbol")}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </CardContent>

          <CardFooter className="border-t pt-4 flex items-center justify-between">
            <Button
              type="submit"
              size="sm"
              disabled={isUpdatingPassword}
              className="text-xs min-w-32 cursor-pointer gap-2"
            >
              {isUpdatingPassword ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" />
                  <span>{tCommon("saving")}</span>
                </>
              ) : (
                <span>{t("updatePasswordBtn")}</span>
              )}
            </Button>
            <span className="text-[11px] text-muted-foreground">
              {t("passwordRequirementsHint")}
            </span>
          </CardFooter>
        </form>
      </Card>

      {/* 3. Two-Factor Authentication (2FA) */}
      <Card className="gap-0">
        <CardHeader className="border-b pb-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <Smartphone className="size-4 text-primary" />
                <CardTitle className="text-base font-semibold">
                  {t("twoFactorTitle")}
                </CardTitle>
                <Badge
                  variant={settings.twoFactor.enabled ? "default" : "outline"}
                  className="text-[10px]"
                >
                  {settings.twoFactor.enabled ? t("enabled") : t("disabled")}
                </Badge>
              </div>
              <CardDescription className="text-xs text-muted-foreground">
                {t("twoFactorDescription")}
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-4 space-y-4">
          {settings.twoFactor.enabled ? (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border bg-muted/20 gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex size-9 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                    <Check className="size-5 stroke-[2.5]" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold">
                      {t("authenticatorActiveTitle")}
                    </h4>
                    <p className="text-[11px] text-muted-foreground">
                      {t("authenticatorActiveDesc")}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setIsViewCodesDialogOpen(true)}
                    className="text-xs h-8 cursor-pointer"
                  >
                    {t("viewBackupCodesBtn")}
                  </Button>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => setIsDisable2FADialogOpen(true)}
                    className="text-xs h-8 cursor-pointer"
                  >
                    {t("disable2FABtn")}
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded-lg border bg-card space-y-1">
                  <span className="text-[11px] text-muted-foreground block">
                    {t("authMethod")}
                  </span>
                  <span className="font-semibold block">{t("totpApp")}</span>
                </div>
                <div className="p-3 rounded-lg border bg-card space-y-1">
                  <span className="text-[11px] text-muted-foreground block">
                    {t("backupCodesRemaining")}
                  </span>
                  <span className="font-semibold block font-mono">
                    {settings.twoFactor.backupCodesRemaining} / 8 {t("codesRemaining")}
                  </span>
                </div>
                <div className="p-3 rounded-lg border bg-card space-y-1">
                  <span className="text-[11px] text-muted-foreground block">
                    {t("enabledOn")}
                  </span>
                  <span className="font-semibold block">
                    {settings.twoFactor.verifiedAt
                      ? new Date(settings.twoFactor.verifiedAt).toLocaleDateString()
                      : t("today")}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-dashed bg-muted/10 gap-4">
                <div className="space-y-1 max-w-lg">
                  <h4 className="text-xs font-semibold text-foreground">
                    {t("enablePromptTitle")}
                  </h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {t("enablePromptDesc")}
                  </p>
                </div>
                <Button
                  type="button"
                  size="sm"
                  onClick={handleOpenEnable2FA}
                  className="text-xs gap-1.5 self-start sm:self-auto cursor-pointer"
                >
                  <ShieldCheck className="size-3.5" />
                  <span>{t("enable2FABtn")}</span>
                </Button>
              </div>

              {/* Supported 2FA Methods List */}
              <div className="space-y-2 pt-2">
                <span className="text-xs font-semibold block text-foreground">
                  {t("supportedMethodsTitle")}
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg border bg-card flex items-start gap-3">
                    <div className="size-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                      <Smartphone className="size-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold">{t("authenticatorApps")}</span>
                        <Badge variant="secondary" className="text-[9px] px-1 py-0 font-medium">
                          {t("recommended")}
                        </Badge>
                      </div>
                      <p className="text-[11px] text-muted-foreground mt-0.5">
                        Google Authenticator, Microsoft Authenticator, 1Password, Authy.
                      </p>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg border bg-card flex items-start gap-3">
                    <div className="size-8 rounded-lg bg-muted text-muted-foreground flex items-center justify-center shrink-0">
                      <KeyRound className="size-4" />
                    </div>
                    <div>
                      <span className="text-xs font-semibold">{t("securityKeysFIDO")}</span>
                      <p className="text-[11px] text-muted-foreground mt-0.5">
                        Hardware security tokens like YubiKey or Passkeys for physical validation.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 4. Active Sessions and Device Logouts */}
      <Card className="gap-0">
        <CardHeader className="border-b pb-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <Laptop className="size-4 text-primary" />
                <CardTitle className="text-base font-semibold">
                  {t("sessionsTitle")}
                </CardTitle>
              </div>
              <CardDescription className="text-xs text-muted-foreground">
                {t("sessionsDescription")}
              </CardDescription>
            </div>
            {settings.activeSessions.filter((s) => !s.current).length > 0 && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={revokeAllOtherSessions}
                className="text-xs h-7 text-destructive hover:text-destructive cursor-pointer"
              >
                <LogOut className="size-3 mr-1" />
                {t("revokeAllOther")}
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent className="pt-4 space-y-3">
          {settings.activeSessions.map((session) => (
            <div
              key={session.id}
              className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-muted/10 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="size-8 rounded-lg bg-muted flex items-center justify-center shrink-0 text-muted-foreground">
                  {session.device === "Mobile" ? (
                    <Smartphone className="size-4" />
                  ) : (
                    <Laptop className="size-4" />
                  )}
                </div>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold">{session.browser}</span>
                    <span className="text-muted-foreground text-xs">•</span>
                    <span className="text-xs text-muted-foreground">{session.os}</span>
                    {session.current && (
                      <Badge variant="secondary" className="text-[10px] px-1.5 py-0 font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                        {t("currentSession")}
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-muted-foreground font-mono">
                    <Globe className="size-3" />
                    <span>{session.location}</span>
                    <span>({session.ipAddress})</span>
                    <span>•</span>
                    <span>{session.lastActive}</span>
                  </div>
                </div>
              </div>

              {!session.current && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => revokeSession(session.id)}
                  className="text-xs h-7 text-muted-foreground hover:text-destructive cursor-pointer"
                >
                  {t("revokeBtn")}
                </Button>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* 5. Security Audit Log */}
      <Card className="gap-0">
        <CardHeader className="border-b pb-4">
          <CardTitle className="text-base font-semibold">
            {t("auditLogTitle")}
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground">
            {t("auditLogDescription")}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="space-y-2.5">
            {settings.recentLogs.map((log) => (
              <div
                key={log.id}
                className="flex items-center justify-between text-xs py-1.5 border-b last:border-b-0"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-foreground">{log.event}</span>
                    <Badge
                      variant={
                        log.status === "success"
                          ? "outline"
                          : log.status === "warning"
                          ? "secondary"
                          : "destructive"
                      }
                      className="text-[9px] px-1.5 py-0"
                    >
                      {log.status}
                    </Badge>
                  </div>
                  <div className="text-[11px] text-muted-foreground font-mono">
                    {log.device} • {log.ipAddress}
                  </div>
                </div>
                <span className="text-[11px] text-muted-foreground whitespace-nowrap">
                  {log.timestamp}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* DIALOG 1: Enable 2FA Multi-Step Wizard */}
      <Dialog open={isEnable2FADialogOpen} onOpenChange={setIsEnable2FADialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold flex items-center gap-2">
              <ShieldCheck className="size-4 text-primary" />
              <span>{t("setupWizardTitle")}</span>
            </DialogTitle>
            <DialogDescription className="text-xs">
              {setupStep === 1 && t("step1Desc")}
              {setupStep === 2 && t("step2Desc")}
              {setupStep === 3 && t("step3Desc")}
            </DialogDescription>
          </DialogHeader>

          {/* Step 1: Scan QR Code */}
          {setupStep === 1 && (
            <div className="space-y-4 py-2">
              <div className="flex flex-col items-center justify-center p-4 bg-muted/20 rounded-xl border">
                <QRCodeSvg
                  value={`otpauth://totp/AdminKit:admin@gmail.com?secret=${settings.twoFactor.secret || "JBSWY3DPEHPK3PXP"}&issuer=AdminKit`}
                  size={160}
                />
                <span className="text-[11px] text-muted-foreground mt-2 text-center">
                  {t("scanQrInstruction")}
                </span>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">
                  {t("manualKeyLabel")}
                </Label>
                <div className="flex items-center gap-2">
                  <Input
                    readOnly
                    value={settings.twoFactor.secret || "JBSWY3DPEHPK3PXP"}
                    className="font-mono text-xs font-semibold bg-background"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleCopySecret}
                    className="text-xs h-8 shrink-0 cursor-pointer"
                  >
                    {copiedSecret ? (
                      <Check className="size-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="size-3.5" />
                    )}
                    <span className="ml-1.5">{copiedSecret ? t("copied") : t("copy")}</span>
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Enter Verification Code */}
          {setupStep === 2 && (
            <div className="space-y-4 py-4 flex flex-col items-center">
              <p className="text-xs text-center text-muted-foreground max-w-xs">
                {t("enterCodeInstruction")}
              </p>

              <div className="py-2">
                <InputOTP
                  maxLength={6}
                  value={verificationCode}
                  onChange={(val) => {
                    setVerificationCode(val)
                    if (verificationError) setVerificationError(null)
                  }}
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </div>

              {verificationError && (
                <p className="text-xs text-destructive text-center">
                  {verificationError}
                </p>
              )}

              <p className="text-[11px] text-muted-foreground text-center">
                {t("testCodeHint")}
              </p>
            </div>
          )}

          {/* Step 3: Backup Recovery Codes */}
          {setupStep === 3 && (
            <div className="space-y-4 py-2">
              <div className="p-3 rounded-lg border border-amber-500/20 bg-amber-500/5 text-amber-700 dark:text-amber-400 text-xs flex items-start gap-2">
                <AlertTriangle className="size-4 shrink-0 mt-0.5" />
                <span>{t("backupCodesWarning")}</span>
              </div>

              <div className="grid grid-cols-2 gap-2 p-3 rounded-xl border bg-muted/20 font-mono text-xs text-center">
                {settings.twoFactor.backupCodes.map((code) => (
                  <div key={code} className="p-1.5 bg-background rounded-md border font-semibold">
                    {code}
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleCopyAllBackupCodes}
                  className="flex-1 text-xs cursor-pointer"
                >
                  <Copy className="size-3.5 mr-1.5" />
                  <span>{copiedCodes ? t("copied") : t("copyAllCodes")}</span>
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleDownloadBackupCodes}
                  className="flex-1 text-xs cursor-pointer"
                >
                  <Download className="size-3.5 mr-1.5" />
                  <span>{t("downloadTxt")}</span>
                </Button>
              </div>

              <label className="flex items-start gap-2 text-xs text-muted-foreground cursor-pointer pt-2">
                <input
                  type="checkbox"
                  checked={backupCodesAcknowledged}
                  onChange={(e) => setBackupCodesAcknowledged(e.target.checked)}
                  className="mt-0.5 rounded-sm"
                />
                <span>{t("acknowledgeSavedCheckbox")}</span>
              </label>
            </div>
          )}

          <DialogFooter className="flex items-center justify-between gap-2 pt-2 border-t">
            {setupStep === 1 && (
              <>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEnable2FADialogOpen(false)}
                  className="text-xs cursor-pointer"
                >
                  {tCommon("cancel")}
                </Button>
                <Button
                  type="button"
                  size="sm"
                  onClick={() => setSetupStep(2)}
                  className="text-xs cursor-pointer"
                >
                  {t("continueBtn")}
                </Button>
              </>
            )}

            {setupStep === 2 && (
              <>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setSetupStep(1)}
                  className="text-xs cursor-pointer"
                >
                  {t("backBtn")}
                </Button>
                <Button
                  type="button"
                  size="sm"
                  disabled={verificationCode.length !== 6 || isVerifying2FA}
                  onClick={handleVerify2FACode}
                  className="text-xs min-w-24 cursor-pointer"
                >
                  {isVerifying2FA ? (
                    <Loader2 className="size-3.5 animate-spin" />
                  ) : (
                    <span>{t("verifyBtn")}</span>
                  )}
                </Button>
              </>
            )}

            {setupStep === 3 && (
              <Button
                type="button"
                size="sm"
                disabled={!backupCodesAcknowledged}
                onClick={handleFinish2FA}
                className="w-full text-xs cursor-pointer"
              >
                {t("finishSetupBtn")}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* DIALOG 2: View / Regenerate Backup Codes */}
      <Dialog open={isViewCodesDialogOpen} onOpenChange={setIsViewCodesDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold flex items-center gap-2">
              <Lock className="size-4 text-primary" />
              <span>{t("backupCodesModalTitle")}</span>
            </DialogTitle>
            <DialogDescription className="text-xs">
              {t("backupCodesModalDesc")}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-2 p-3 rounded-xl border bg-muted/20 font-mono text-xs text-center">
              {settings.twoFactor.backupCodes.map((code) => (
                <div key={code} className="p-1.5 bg-background rounded-md border font-semibold">
                  {code}
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleCopyAllBackupCodes}
                className="flex-1 text-xs cursor-pointer"
              >
                <Copy className="size-3.5 mr-1.5" />
                <span>{copiedCodes ? t("copied") : t("copyAllCodes")}</span>
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={regenerateBackupCodes}
                className="text-xs cursor-pointer"
              >
                <RefreshCw className="size-3.5 mr-1.5" />
                <span>{t("regenerateBtn")}</span>
              </Button>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              size="sm"
              onClick={() => setIsViewCodesDialogOpen(false)}
              className="text-xs w-full cursor-pointer"
            >
              {t("doneBtn")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* DIALOG 3: Disable 2FA Confirmation */}
      <Dialog open={isDisable2FADialogOpen} onOpenChange={setIsDisable2FADialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold text-destructive flex items-center gap-2">
              <AlertTriangle className="size-4" />
              <span>{t("disable2FAModalTitle")}</span>
            </DialogTitle>
            <DialogDescription className="text-xs">
              {t("disable2FAModalDesc")}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2">
            {disableError && (
              <p className="text-xs text-destructive">{disableError}</p>
            )}

            <div className="space-y-1.5">
              <Label className="text-xs">
                {t("confirmCurrentPassword")}
              </Label>
              <Input
                type="password"
                placeholder="••••••••••••"
                value={disablePassword}
                onChange={(e) => setDisablePassword(e.target.value)}
                className="text-xs"
              />
            </div>
          </div>

          <DialogFooter className="flex items-center justify-between gap-2 border-t pt-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                setIsDisable2FADialogOpen(false)
                setDisablePassword("")
                setDisableError(null)
              }}
              className="text-xs cursor-pointer"
            >
              {tCommon("cancel")}
            </Button>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              disabled={isDisabling2FA || !disablePassword}
              onClick={handleConfirmDisable2FA}
              className="text-xs cursor-pointer"
            >
              {isDisabling2FA ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : (
                <span>{t("confirmDisableBtn")}</span>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
