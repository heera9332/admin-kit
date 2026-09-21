"use client"

import * as React from "react"
import { useTranslations } from "next-intl"
import { Link, useRouter } from "@/i18n/routing"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"

export default function SignInPage() {
  const t = useTranslations("auth.signIn")
  const router = useRouter()
  const [email, setEmail] = React.useState("heera-singh@zoro-dev.com")
  const [password, setPassword] = React.useState("password123")
  const [isLoading, setIsLoading] = React.useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      router.push("/dashboard")
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

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">{t("passwordLabel")}</Label>
              <Link
                href="/forgot-password"
                className="text-[11px] text-muted-foreground hover:text-primary underline-offset-4 hover:underline"
              >
                {t("forgotPassword")}
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              placeholder={t("passwordPlaceholder")}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="text-xs"
              required
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox id="remember" defaultChecked />
            <label
              htmlFor="remember"
              className="text-xs text-muted-foreground leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
            >
              {t("rememberMe")}
            </label>
          </div>

          <Button type="submit" className="w-full text-xs font-semibold" disabled={isLoading}>
            {isLoading ? t("submitting") : t("submit")}
          </Button>
        </CardContent>

        <CardFooter className="flex flex-col space-y-2 border-t pt-4 text-center text-xs text-muted-foreground">
          <div>
            {t("noAccount")}{" "}
            <Link href="/sign-up" className="font-semibold text-primary underline-offset-4 hover:underline">
              {t("signUpLink")}
            </Link>
          </div>
        </CardFooter>
      </form>
    </Card>
  )
}
