import * as React from "react"
import { UserProfileSettings } from "@/features/settings/components/user-profile-settings"
import { Skeleton } from "@/components/ui/skeleton"

import { Card } from "@/components/ui/card"

export default function ProfileSettingsPage() {
  return (
    <React.Suspense fallback={<ProfileSettingsSkeleton />}>
      <UserProfileSettings />
    </React.Suspense>
  )
}

function ProfileSettingsSkeleton() {
  return (
    <Card className=" ">
      <div className="p-6 border-b space-y-4">
        <div className="space-y-2">
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-3.5 w-72" />
        </div>
        <div className="flex gap-2 flex-wrap">
          <Skeleton className="h-8 w-24 rounded-lg" />
          <Skeleton className="h-8 w-32 rounded-lg" />
          <Skeleton className="h-8 w-32 rounded-lg" />
          <Skeleton className="h-8 w-32 rounded-lg" />
          <Skeleton className="h-8 w-28 rounded-lg" />
        </div>
      </div>
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-9 w-28" />
      </div>
    </Card>
  )
}
