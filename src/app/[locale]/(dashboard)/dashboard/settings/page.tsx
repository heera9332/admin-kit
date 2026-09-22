import * as React from "react"
import { UserProfileSettings } from "@/features/settings/components/user-profile-settings"
import { Skeleton } from "@/components/ui/skeleton"

export default function ProfileSettingsPage() {
  return (
    <React.Suspense fallback={<ProfileSettingsSkeleton />}>
      <UserProfileSettings />
    </React.Suspense>
  )
}

function ProfileSettingsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        <Skeleton className="h-9 w-24 rounded-lg" />
        <Skeleton className="h-9 w-32 rounded-lg" />
        <Skeleton className="h-9 w-32 rounded-lg" />
        <Skeleton className="h-9 w-28 rounded-lg" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-4 w-72" />
      </div>
      <Skeleton className="h-px w-full" />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
      <Skeleton className="h-24 w-full" />
      <Skeleton className="h-9 w-28" />
    </div>
  )
}
