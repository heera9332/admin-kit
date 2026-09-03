"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export default function ForbiddenPage() {
  const router = useRouter()

  return (
    <div className="flex flex-col items-center justify-center text-center gap-2">
      <span className="text-7xl sm:text-8xl font-black tracking-tighter text-amber-500/80 font-mono">
        403
      </span>
      <h1 className="text-xl font-bold tracking-tight">Access Forbidden</h1>
      <p className="text-xs sm:text-sm text-muted-foreground max-w-xs leading-relaxed">
        You do not have sufficient permissions to view this protected view. Contact your team admin.
      </p>
      <div className="mt-6 flex items-center gap-3">
        <Button variant="outline" size="sm" onClick={() => router.back()} className="text-xs">
          Go Back
        </Button>
        <Button size="sm" render={<Link href="/dashboard" />} className="text-xs">
          <span>Back to Dashboard</span>
        </Button>
      </div>
    </div>
  )
}
