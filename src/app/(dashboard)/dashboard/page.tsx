import type { Metadata } from "next"
import {
  TrendingUp,
  Users,
  ShoppingCart,
  Percent,
  Calendar,
  Plus,
} from "lucide-react"
import { siteConfig } from "@/config/site"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export const metadata: Metadata = {
  title: "Dashboard Overview",
  description: "Primary admin overview and telemetry",
}

export default function DashboardPage() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/50">
        <div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Dashboard Overview
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Welcome to {siteConfig.name}. Here is your live business summary.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs">
            <Calendar className="size-3.5" />
            <span>Oct 2026</span>
          </Button>
          <Button variant="default" size="sm" className="h-8 gap-1.5 text-xs">
            <Plus className="size-3.5" />
            <span>Create New</span>
          </Button>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card size="sm" className="border-border/70">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              Total Revenue
            </CardTitle>
            <div className="rounded-md bg-emerald-500/10 p-1 text-emerald-500">
              <TrendingUp className="size-3.5" />
            </div>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="font-heading text-2xl font-bold text-foreground">
              $84,240
            </div>
            <p className="text-xs text-emerald-500 font-medium">
              +12.5% vs last month
            </p>
          </CardContent>
        </Card>

        <Card size="sm" className="border-border/70">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              Active Users
            </CardTitle>
            <div className="rounded-md bg-blue-500/10 p-1 text-blue-500">
              <Users className="size-3.5" />
            </div>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="font-heading text-2xl font-bold text-foreground">
              12,480
            </div>
            <p className="text-xs text-emerald-500 font-medium">
              +8.2% vs last month
            </p>
          </CardContent>
        </Card>

        <Card size="sm" className="border-border/70">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              Total Orders
            </CardTitle>
            <div className="rounded-md bg-purple-500/10 p-1 text-purple-500">
              <ShoppingCart className="size-3.5" />
            </div>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="font-heading text-2xl font-bold text-foreground">
              2,430
            </div>
            <p className="text-xs text-emerald-500 font-medium">
              +14.1% vs last month
            </p>
          </CardContent>
        </Card>

        <Card size="sm" className="border-border/70">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              Conversion Rate
            </CardTitle>
            <div className="rounded-md bg-amber-500/10 p-1 text-amber-500">
              <Percent className="size-3.5" />
            </div>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="font-heading text-2xl font-bold text-foreground">
              4.82%
            </div>
            <p className="text-xs text-emerald-500 font-medium">
              +2.4% vs last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Grid: Revenue Overview Chart & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <Card className="lg:col-span-8 border-border/70">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <div>
              <CardTitle className="text-base font-semibold">Revenue Overview</CardTitle>
              <CardDescription className="text-xs mt-0.5">
                Monthly performance across 2026
              </CardDescription>
            </div>
            <Badge variant="outline" className="text-xs font-mono">
              +28.4% YoY
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full flex flex-col justify-end pt-4">
              <svg
                viewBox="0 0 500 200"
                className="w-full h-48 overflow-visible"
                preserveAspectRatio="none"
              >
                <defs>
                  <linearGradient id="dashboardChartGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="currentColor" stopOpacity="0.25" className="text-primary" />
                    <stop offset="100%" stopColor="currentColor" stopOpacity="0.0" className="text-primary" />
                  </linearGradient>
                </defs>
                <line x1="0" y1="40" x2="500" y2="40" stroke="currentColor" strokeDasharray="3 3" className="text-border/60" />
                <line x1="0" y1="90" x2="500" y2="90" stroke="currentColor" strokeDasharray="3 3" className="text-border/60" />
                <line x1="0" y1="140" x2="500" y2="140" stroke="currentColor" strokeDasharray="3 3" className="text-border/60" />
                <line x1="0" y1="190" x2="500" y2="190" stroke="currentColor" className="text-border" />

                <path
                  d="M 0 160 Q 45 140 90 145 T 180 110 T 270 95 T 360 65 T 450 40 L 500 30 L 500 190 L 0 190 Z"
                  fill="url(#dashboardChartGrad)"
                />
                <path
                  d="M 0 160 Q 45 140 90 145 T 180 110 T 270 95 T 360 65 T 450 40 L 500 30"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  className="text-primary"
                />
                <circle cx="450" cy="40" r="4" className="fill-background stroke-primary" strokeWidth="2.5" />
              </svg>
              <div className="flex justify-between text-[11px] text-muted-foreground mt-3 pt-2 border-t border-border/50">
                <span>Jan</span>
                <span>Mar</span>
                <span>May</span>
                <span>Jul</span>
                <span>Sep</span>
                <span>Nov</span>
                <span>Dec</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-4 border-border/70">
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-semibold">Recent Transactions</CardTitle>
            <CardDescription className="text-xs">
              Live updates from active payment gateways
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5 min-w-0">
                <Avatar size="sm">
                  <AvatarFallback className="text-[10px] bg-emerald-500/10 text-emerald-600 font-semibold">
                    SJ
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 truncate">
                  <p className="font-medium truncate">Sarah Jenkins</p>
                  <p className="text-[11px] text-muted-foreground">Enterprise Tier</p>
                </div>
              </div>
              <Badge variant="secondary" className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono">
                +$2,400
              </Badge>
            </div>

            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5 min-w-0">
                <Avatar size="sm">
                  <AvatarFallback className="text-[10px] bg-blue-500/10 text-blue-600 font-semibold">
                    LV
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 truncate">
                  <p className="font-medium truncate">Liam Vance</p>
                  <p className="text-[11px] text-muted-foreground">Order #4829</p>
                </div>
              </div>
              <Badge variant="outline" className="text-[10px] text-blue-600 dark:text-blue-400 font-mono">
                Paid
              </Badge>
            </div>

            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5 min-w-0">
                <Avatar size="sm">
                  <AvatarFallback className="text-[10px] bg-purple-500/10 text-purple-600 font-semibold">
                    ER
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 truncate">
                  <p className="font-medium truncate">Elena Rostova</p>
                  <p className="text-[11px] text-muted-foreground">Workspace Pro</p>
                </div>
              </div>
              <Badge variant="secondary" className="text-[10px] font-mono">
                +$480
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
