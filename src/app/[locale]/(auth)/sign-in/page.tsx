"use client"

import * as React from "react"
import { useTranslations } from "next-intl"
import { AlertCircle, KeyRound, Shield } from "lucide-react"
import { Link, useRouter } from "@/i18n/routing"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { users } from "@/data/users"
import { AUTH_ROLE_STORAGE_KEY, AUTH_USER_STORAGE_KEY } from "@/context/rbac-provider"

export default function SignInPage() {
  const t = useTranslations("auth.signIn")
  const router = useRouter()

  // Default credentials: admin, admin@gmail.com, password: password
  const [email, setEmail] = React.useState("admin@gmail.com")
  const [password, setPassword] = React.useState("password")
  const [error, setError] = React.useState<string | null>(null)
  const [isLoading, setIsLoading] = React.useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    const cleanEmail = email.trim().toLowerCase()
    const cleanPassword = password.trim()

    // 1. Verify user exists in users.json
    const matchedUser = users.find(
      (u) => u.email.toLowerCase() === cleanEmail
    )

    if (!matchedUser) {
      setIsLoading(false)
      setError(t("invalidCredentials"))
      return
    }

    // 2. Validate password (each user password is "password" or matchedUser.password)
    const expectedPassword = matchedUser.password || "password"
    if (cleanPassword !== expectedPassword) {
      setIsLoading(false)
      setError(t("invalidCredentials"))
      return
    }

    // 3. Status check
    if (matchedUser.status === "suspended") {
      setIsLoading(false)
      setError(t("accountSuspended"))
      return
    }

    // 4. Save authenticated user profile and assigned role
    const authenticatedUser = {
      id: matchedUser.id,
      name: `${matchedUser.firstName} ${matchedUser.lastName}`,
      email: matchedUser.email,
      role: matchedUser.role,
      avatar: matchedUser.avatar || "/avatars/01.png",
      status: matchedUser.status,
    }

    try {
      localStorage.setItem(AUTH_USER_STORAGE_KEY, JSON.stringify(authenticatedUser))
      localStorage.setItem(AUTH_ROLE_STORAGE_KEY, matchedUser.role)
    } catch {
      // localStorage may fail in restricted environments
    }

    setTimeout(() => {
      setIsLoading(false)
      router.push("/dashboard")
    }, 400)
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
          {error && (
            <Alert variant="destructive" className="py-2 px-3 text-xs">
              <AlertCircle className="size-4" />
              <AlertDescription className="text-xs">{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="email">{t("emailLabel")}</Label>
            <Input
              id="email"
              type="email"
              placeholder={t("emailPlaceholder")}
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                setError(null)
              }}
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
              onChange={(e) => {
                setPassword(e.target.value)
                setError(null)
              }}
              className="text-xs"
              required
            />
          </div>

          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2">
              <Checkbox id="remember" defaultChecked />
              <label
                htmlFor="remember"
                className="text-muted-foreground leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
              >
                {t("rememberMe")}
              </label>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
              <KeyRound className="size-3 text-primary/70" />
              <span>password: <strong className="font-mono text-foreground font-semibold">password</strong></span>
            </div>
          </div>

          <Button type="submit" className="w-full text-xs font-semibold" disabled={isLoading}>
            {isLoading ? t("submitting") : t("submit")}
          </Button>

          {/* Quick preset logins from users.json */}
          <div className="rounded-lg border bg-muted/30 p-2.5 space-y-1.5 mt-2">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-medium text-foreground flex items-center gap-1">
                <Shield className="size-3 text-primary" />
                Quick login (users.json):
              </span>
              <span className="text-[10px] text-muted-foreground font-mono">pwd: password</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {users.slice(0, 4).map((u) => {
                const isActive = email === u.email
                return (
                  <button
                    type="button"
                    key={u.id}
                    onClick={() => {
                      setEmail(u.email)
                      setPassword("password")
                      setError(null)
                    }}
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] border transition-colors cursor-pointer ${
                      isActive
                        ? "bg-primary text-primary-foreground border-primary font-medium"
                        : "bg-background hover:bg-accent text-foreground"
                    }`}
                  >
                    <span>{u.firstName}</span>
                    <span className="opacity-70 text-[10px]">({u.role})</span>
                  </button>
                )
              })}
            </div>
          </div>
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
