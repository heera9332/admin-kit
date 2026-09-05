import { Link } from "@/i18n/routing"
import {
  TrendingUp,
  Users,
  ShoppingCart,
  Percent,
  Search,
  Bell,
  Calendar,
  Download,
  LayoutDashboard,
  BarChart3,
  UserCheck,
  Package,
  Settings,
  Circle,
  ExternalLink,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

export function DashboardPreview() {
  return (
    <section className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-16 lg:pb-24">
      {/* Outer Window Container */}
      <div className="relative rounded-2xl border border-border/80 bg-card shadow-2xl overflow-hidden transition-all">
        {/* Browser Top Bar */}
        <div className="flex items-center justify-between border-b border-border/60 bg-muted/40 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-2">
            <span className="size-3 rounded-full bg-red-500/80 inline-block" />
            <span className="size-3 rounded-full bg-amber-500/80 inline-block" />
            <span className="size-3 rounded-full bg-emerald-500/80 inline-block" />
            <span className="ml-3 hidden font-mono text-xs text-muted-foreground sm:inline-block">
              app.adminkit.dev/dashboard
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-[11px] font-mono font-normal">
              Live Preview
            </Badge>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <span>Open App</span>
              <ExternalLink className="size-3" />
            </Link>
          </div>
        </div>

        {/* Dashboard Canvas Shell */}
        <div className="flex flex-col lg:flex-row bg-background">
          {/* Mini Sidebar */}
          <aside className="hidden lg:flex w-56 flex-col justify-between border-r border-border/60 bg-card/50 p-4 shrink-0">
            <div className="space-y-6">
              <div className="flex items-center gap-2.5 px-2">
                <span className="flex size-7 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-xs">
                  AK
                </span>
                <span className="font-heading font-semibold text-sm">
                  AdminKit
                </span>
                <Badge variant="secondary" className="ml-auto text-[10px] px-1.5 py-0 h-4">
                  PRO
                </Badge>
              </div>

              <div className="space-y-1">
                <p className="px-2 text-[11px] font-medium tracking-wider text-muted-foreground uppercase">
                  Main
                </p>
                <div className="flex items-center gap-2.5 rounded-lg bg-primary/10 px-2.5 py-2 text-xs font-semibold text-primary">
                  <LayoutDashboard className="size-4" />
                  <span>Overview</span>
                </div>
                <div className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs font-medium text-muted-foreground hover:bg-muted/50 hover:text-foreground cursor-pointer transition-colors">
                  <BarChart3 className="size-4" />
                  <span>Analytics</span>
                </div>
                <div className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs font-medium text-muted-foreground hover:bg-muted/50 hover:text-foreground cursor-pointer transition-colors">
                  <UserCheck className="size-4" />
                  <span>Customers</span>
                </div>
                <div className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs font-medium text-muted-foreground hover:bg-muted/50 hover:text-foreground cursor-pointer transition-colors">
                  <Package className="size-4" />
                  <span>Orders</span>
                </div>
                <div className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs font-medium text-muted-foreground hover:bg-muted/50 hover:text-foreground cursor-pointer transition-colors">
                  <Settings className="size-4" />
                  <span>Settings</span>
                </div>
              </div>
            </div>

            {/* User Pill */}
            <div className="flex items-center gap-2 rounded-lg border border-border/60 p-2 bg-background/50">
              <Avatar size="sm">
                <AvatarFallback className="text-[10px] bg-primary/10 text-primary font-bold">
                  AM
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-medium leading-none text-foreground">
                  Alex Morgan
                </p>
                <p className="truncate text-[10px] text-muted-foreground mt-0.5">
                  alex@adminkit.dev
                </p>
              </div>
            </div>
          </aside>

          {/* Main Dashboard Panel */}
          <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
            {/* Topbar */}
            <div className="flex items-center justify-between border-b border-border/60 px-4 py-3 sm:px-6 bg-card/20">
              <div className="flex items-center gap-2 flex-1 max-w-sm">
                <div className="relative w-full">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                  <input
                    type="text"
                    readOnly
                    placeholder="Search metrics, users, orders..."
                    className="w-full rounded-md border border-border/70 bg-background/60 py-1.5 pl-8 pr-12 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none"
                  />
                  <kbd className="absolute right-2 top-1/2 -translate-y-1/2 rounded border border-border bg-muted px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground">
                    ⌘K
                  </kbd>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="relative cursor-pointer p-1 text-muted-foreground hover:text-foreground transition-colors">
                  <Bell className="size-4" />
                  <span className="absolute top-1 right-1 size-1.5 rounded-full bg-primary" />
                </div>
                <Avatar size="sm">
                  <AvatarFallback className="text-[10px] bg-primary/10 text-primary font-bold">
                    AM
                  </AvatarFallback>
                </Avatar>
              </div>
            </div>

            {/* Dashboard Content */}
            <div className="p-4 sm:p-6 lg:p-8 space-y-6">
              {/* Header Title & Actions */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="font-heading text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                    Overview
                  </h2>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Real-time performance summary and platform metrics.
                  </p>
                </div>

                <div className="flex items-center gap-2.5">
                  <div className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs text-muted-foreground">
                    <Calendar className="size-3.5" />
                    <span>Last 30 Days</span>
                  </div>
                  <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs">
                    <Download className="size-3.5" />
                    <span>Export</span>
                  </Button>
                </div>
              </div>

              {/* 4 Stat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                {/* Revenue */}
                <Card size="sm" className="border-border/70 shadow-xs">
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
                    <p className="text-xs text-emerald-500 font-medium flex items-center gap-1">
                      <span>+12.5%</span>
                      <span className="text-muted-foreground font-normal">vs last month</span>
                    </p>
                  </CardContent>
                </Card>

                {/* Users */}
                <Card size="sm" className="border-border/70 shadow-xs">
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
                    <p className="text-xs text-emerald-500 font-medium flex items-center gap-1">
                      <span>+8.2%</span>
                      <span className="text-muted-foreground font-normal">vs last month</span>
                    </p>
                  </CardContent>
                </Card>

                {/* Orders */}
                <Card size="sm" className="border-border/70 shadow-xs">
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
                    <p className="text-xs text-emerald-500 font-medium flex items-center gap-1">
                      <span>+14.1%</span>
                      <span className="text-muted-foreground font-normal">vs last month</span>
                    </p>
                  </CardContent>
                </Card>

                {/* Conversion */}
                <Card size="sm" className="border-border/70 shadow-xs">
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
                    <p className="text-xs text-emerald-500 font-medium flex items-center gap-1">
                      <span>+2.4%</span>
                      <span className="text-muted-foreground font-normal">vs last month</span>
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* 2-Column: Revenue Overview Chart & Recent Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Revenue Overview Chart */}
                <Card className="lg:col-span-7 border-border/70 shadow-xs">
                  <CardHeader className="flex flex-row items-center justify-between pb-4">
                    <div>
                      <CardTitle className="text-base font-semibold">Revenue Overview</CardTitle>
                      <CardDescription className="text-xs mt-0.5">
                        Monthly recurring revenue progression across 2026
                      </CardDescription>
                    </div>
                    <Badge variant="outline" className="text-xs font-mono">
                      +28.4% YoY
                    </Badge>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 w-full flex flex-col justify-end pt-4">
                      {/* Responsive SVG Area / Bar Chart */}
                      <svg
                        viewBox="0 0 500 200"
                        className="w-full h-48 overflow-visible"
                        preserveAspectRatio="none"
                      >
                        <defs>
                          <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="currentColor" stopOpacity="0.3" className="text-primary" />
                            <stop offset="100%" stopColor="currentColor" stopOpacity="0.0" className="text-primary" />
                          </linearGradient>
                        </defs>
                        {/* Horizontal Gridlines */}
                        <line x1="0" y1="40" x2="500" y2="40" stroke="currentColor" strokeDasharray="3 3" className="text-border/60" />
                        <line x1="0" y1="90" x2="500" y2="90" stroke="currentColor" strokeDasharray="3 3" className="text-border/60" />
                        <line x1="0" y1="140" x2="500" y2="140" stroke="currentColor" strokeDasharray="3 3" className="text-border/60" />
                        <line x1="0" y1="190" x2="500" y2="190" stroke="currentColor" className="text-border" />

                        {/* Area Fill */}
                        <path
                          d="M 0 160 Q 45 140 90 145 T 180 110 T 270 95 T 360 65 T 450 40 L 500 30 L 500 190 L 0 190 Z"
                          fill="url(#chartGradient)"
                        />

                        {/* Trend Line */}
                        <path
                          d="M 0 160 Q 45 140 90 145 T 180 110 T 270 95 T 360 65 T 450 40 L 500 30"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          className="text-primary"
                        />

                        {/* Highlight Point */}
                        <circle cx="450" cy="40" r="4" className="fill-background stroke-primary" strokeWidth="2.5" />
                      </svg>

                      {/* X-Axis Month Labels */}
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

                {/* Recent Activity Card */}
                <Card className="lg:col-span-5 border-border/70 shadow-xs">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-base font-semibold">Recent Activity</CardTitle>
                    <CardDescription className="text-xs">
                      Latest user transactions and platform operations
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Item 1 */}
                    <div className="flex items-start justify-between gap-3 text-xs">
                      <div className="flex items-start gap-2.5 min-w-0">
                        <Avatar size="sm" className="mt-0.5">
                          <AvatarFallback className="text-[10px] bg-emerald-500/10 text-emerald-600 font-semibold">
                            SJ
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <p className="font-medium text-foreground truncate">Sarah Jenkins</p>
                          <p className="text-muted-foreground text-[11px]">Subscribed to Enterprise</p>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <Badge variant="secondary" className="text-[10px] h-4.5 px-1.5 text-emerald-600 dark:text-emerald-400 font-mono font-medium">
                          +$2,400
                        </Badge>
                        <p className="text-[10px] text-muted-foreground mt-0.5">2m ago</p>
                      </div>
                    </div>

                    {/* Item 2 */}
                    <div className="flex items-start justify-between gap-3 text-xs">
                      <div className="flex items-start gap-2.5 min-w-0">
                        <Avatar size="sm" className="mt-0.5">
                          <AvatarFallback className="text-[10px] bg-blue-500/10 text-blue-600 font-semibold">
                            LV
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <p className="font-medium text-foreground truncate">Liam Vance</p>
                          <p className="text-muted-foreground text-[11px]">Completed Order #4829</p>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <Badge variant="outline" className="text-[10px] h-4.5 px-1.5 text-blue-600 dark:text-blue-400 font-mono font-medium">
                          Paid
                        </Badge>
                        <p className="text-[10px] text-muted-foreground mt-0.5">14m ago</p>
                      </div>
                    </div>

                    {/* Item 3 */}
                    <div className="flex items-start justify-between gap-3 text-xs">
                      <div className="flex items-start gap-2.5 min-w-0">
                        <Avatar size="sm" className="mt-0.5">
                          <AvatarFallback className="text-[10px] bg-purple-500/10 text-purple-600 font-semibold">
                            ER
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <p className="font-medium text-foreground truncate">Elena Rostova</p>
                          <p className="text-muted-foreground text-[11px]">New project workspace</p>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <Badge variant="secondary" className="text-[10px] h-4.5 px-1.5 font-medium">
                          Created
                        </Badge>
                        <p className="text-[10px] text-muted-foreground mt-0.5">1h ago</p>
                      </div>
                    </div>

                    {/* Item 4 */}
                    <div className="flex items-start justify-between gap-3 text-xs">
                      <div className="flex items-start gap-2.5 min-w-0">
                        <Avatar size="sm" className="mt-0.5">
                          <AvatarFallback className="text-[10px] bg-amber-500/10 text-amber-600 font-semibold">
                            MB
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <p className="font-medium text-foreground truncate">Marcus Brody</p>
                          <p className="text-muted-foreground text-[11px]">Added 8 team seats</p>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <Badge variant="secondary" className="text-[10px] h-4.5 px-1.5 text-emerald-600 dark:text-emerald-400 font-mono font-medium">
                          +$320
                        </Badge>
                        <p className="text-[10px] text-muted-foreground mt-0.5">3h ago</p>
                      </div>
                    </div>

                    {/* Item 5 */}
                    <div className="flex items-start justify-between gap-3 text-xs">
                      <div className="flex items-start gap-2.5 min-w-0">
                        <div className="size-6 rounded-full bg-muted flex items-center justify-center mt-0.5">
                          <Circle className="size-2 fill-primary text-primary" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-foreground truncate">System Cron</p>
                          <p className="text-muted-foreground text-[11px]">Database snapshot saved</p>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <Badge variant="outline" className="text-[10px] h-4.5 px-1.5 text-muted-foreground font-mono">
                          Success
                        </Badge>
                        <p className="text-[10px] text-muted-foreground mt-0.5">5h ago</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </main>
        </div>
      </div>
    </section>
  )
}
