"use client"

import * as React from "react"
import { Link, useRouter } from "@/i18n/routing"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"

export default function OtpPage() {
  const router = useRouter()
  const [value, setValue] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (value.length < 6) return

    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      router.push("/dashboard")
    }, 600)
  }

  return (
    <Card className="border-border/80 shadow-sm">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-xl font-bold">Two-Factor Authentication</CardTitle>
        <CardDescription className="text-xs">
          Please enter the 6-digit authentication code sent to your registered device.
        </CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6 flex flex-col items-center">
          <InputOTP
            maxLength={6}
            value={value}
            onChange={(val) => setValue(val)}
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

          <Button
            type="submit"
            className="w-full text-xs font-semibold"
            disabled={value.length < 6 || isLoading}
          >
            {isLoading ? "Verifying..." : "Verify & Continue"}
          </Button>
        </CardContent>

        <CardFooter className="flex flex-col space-y-2 border-t pt-4 text-center text-xs text-muted-foreground">
          <p className="text-[11px]">
            Haven&apos;t received a code?{" "}
            <button
              type="button"
              className="text-primary font-medium hover:underline cursor-pointer"
              onClick={() => alert("New code sent!")}
            >
              Resend code
            </button>
          </p>
          <Link
            href="/sign-in"
            className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors mt-2"
          >
            <ArrowLeft className="size-3.5" />
            <span>Back to sign in</span>
          </Link>
        </CardFooter>
      </form>
    </Card>
  )
}
