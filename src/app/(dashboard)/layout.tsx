import Link from "next/link"
import {
  LayoutDashboard,
  BarChart3,
  Users,
  Package,
  Settings,
  Bell,
  Search,
  ArrowLeft,
} from "lucide-react"
import { siteConfig } from "@/config/site"
import { ThemeToggle } from "@/components/theme-toggle"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex w-64 flex-col border-r border-border/70 bg-card p-4 shrink-0">
        <div className="flex items-center justify-between pb-6 pt-1 border-b border-border/50">
          <Link href="/" className="flex items-center gap-2.5 font-bold">
            <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <LayoutDashboard className="size-4.5" />
            </span>
            <span className="font-heading text-lg font-semibold tracking-tight">
              {siteConfig.name}
            </span>
          </Link>
        </div>

        <nav className="mt-6 flex-1 space-y-1" aria-label="Dashboard Navigation">
          <Link
            href="/dashboard"
            className="flex items-center gap-2.5 rounded-lg bg-primary/10 px-3 py-2 text-xs font-semibold text-primary"
          >
            <LayoutDashboard className="size-4" />
            <span>Dashboard</span>
          </Link>
          <Link
            href="/dashboard"
            className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-muted-foreground hover:bg-muted/60 hover:text-foreground transition-colors"
          >
            <BarChart3 className="size-4" />
            <span>Analytics</span>
          </Link>
          <Link
            href="/dashboard"
            className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-muted-foreground hover:bg-muted/60 hover:text-foreground transition-colors"
          >
            <Users className="size-4" />
            <span>Customers</span>
          </Link>
          <Link
            href="/dashboard"
            className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-muted-foreground hover:bg-muted/60 hover:text-foreground transition-colors"
          >
            <Package className="size-4" />
            <span>Orders</span>
          </Link>
          <Link
            href="/dashboard"
            className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-muted-foreground hover:bg-muted/60 hover:text-foreground transition-colors"
          >
            <Settings className="size-4" />
            <span>Settings</span>
          </Link>
        </nav>

        <div className="pt-4 border-t border-border/50 space-y-2">
          <Link
            href="/"
            className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors py-1"
          >
            <ArrowLeft className="size-3.5" />
            <span>Back to Landing Page</span>
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col min-w-0">
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border/60 bg-background/80 backdrop-blur-md px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <Link href="/" className="md:hidden flex items-center gap-2 font-semibold text-sm">
              <span className="flex size-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
                <LayoutDashboard className="size-3.5" />
              </span>
              <span>{siteConfig.name}</span>
            </Link>

            <div className="relative hidden sm:block w-72">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search anything..."
                className="h-8 w-full rounded-md border border-border/70 bg-card/60 pl-8 pr-3 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button variant="ghost" size="icon-sm" aria-label="Notifications">
              <Bell className="size-4 text-muted-foreground" />
            </Button>
            <Avatar size="sm">
              <AvatarFallback className="text-[10px] bg-primary/10 text-primary font-bold">
                AK
              </AvatarFallback>
            </Avatar>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
