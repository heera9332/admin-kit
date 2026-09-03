"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"

export default function SignInPage() {
  const router = useRouter()
  const [email, setEmail] = React.useState("satnaingdev@gmail.com")
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
        <CardTitle className="text-xl font-bold">Sign in</CardTitle>
        <CardDescription className="text-xs">
          Enter your email and password below to log into your account
        </CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="text-xs"
              required
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Link
                href="/forgot-password"
                className="text-[11px] text-muted-foreground hover:text-primary underline-offset-4 hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
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
              Remember me for 30 days
            </label>
          </div>

          <Button type="submit" className="w-full text-xs font-semibold" disabled={isLoading}>
            {isLoading ? "Signing in..." : "Sign In"}
          </Button>
        </CardContent>

        <CardFooter className="flex flex-col space-y-2 border-t pt-4 text-center text-xs text-muted-foreground">
          <div>
            Don&apos;t have an account?{" "}
            <Link href="/sign-up" className="font-semibold text-primary underline-offset-4 hover:underline">
              Sign up
            </Link>
          </div>
        </CardFooter>
      </form>
    </Card>
  )
}
