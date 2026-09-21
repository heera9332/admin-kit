"use client"

import * as React from "react"
import { useTranslations } from "next-intl"
import { Link } from "@/i18n/routing"
import { ArrowLeft, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function ForgotPasswordPage() {
  const t = useTranslations("auth.forgotPassword")
  const [email, setEmail] = React.useState("")
  const [submitted, setSubmitted] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      setSubmitted(true)
    }, 600)
  }

  return (
    <Card className="border-border/80 shadow-sm">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-xl font-bold">{t("title")}</CardTitle>
        <CardDescription className="text-xs">
          {t("subtitle")}
        </CardDescription>
      </CardHeader>

      {submitted ? (
        <CardContent className="space-y-4 text-center py-4">
          <div className="flex justify-center">
            <div className="flex size-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
              <CheckCircle2 className="size-6" />
            </div>
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-semibold">{t("checkInboxTitle")}</h4>
            <p className="text-xs text-muted-foreground">
              {t("checkInboxDescription", { email })}
            </p>
          </div>
        </CardContent>
      ) : (
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email">{t("emailLabel")}</Label>
              <Input
                id="email"
                type="email"
                placeholder={t("emailPlaceholder")}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="text-xs"
                required
              />
            </div>

            <Button type="submit" className="w-full text-xs font-semibold" disabled={isLoading}>
              {isLoading ? t("submitting") : t("submit")}
            </Button>
          </CardContent>
        </form>
      )}

      <CardFooter className="flex justify-center border-t pt-4 text-center text-xs">
        <Link
          href="/sign-in"
          className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="size-3.5" />
          <span>{t("backToSignIn")}</span>
        </Link>
      </CardFooter>
    </Card>
  )
}
