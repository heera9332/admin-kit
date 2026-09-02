"use client"

import * as React from "react"
import {
  Bell,
  ChevronDown,
  Info,
  Layers,
  Search,
  Settings,
  Sparkles,
  Trash2,
  User,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export function ComponentShowcase() {
  const [switchActive, setSwitchActive] = React.useState(true)
  const [checkboxChecked, setCheckboxChecked] = React.useState<boolean>(true)

  return (
    <section id="components" className="py-20 lg:py-28">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">
            Modular UI Primitives
          </p>
          <h2 className="font-heading mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl text-foreground">
            A complete admin UI system
          </h2>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed text-balance">
            Every component is built on accessible primitives, typed strictly in TypeScript, and styled with semantic design tokens.
          </p>
        </div>

        {/* Component Showcase Grid */}
        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* 1. Buttons */}
          <Card className="border-border/70 bg-card/60">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">Buttons</CardTitle>
              <CardDescription className="text-xs">
                Solid, outline, ghost, icon, and destructive variants.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 pt-2">
              <div className="flex flex-wrap items-center gap-2">
                <Button variant="default" size="sm">Primary</Button>
                <Button variant="secondary" size="sm">Secondary</Button>
                <Button variant="outline" size="sm">Outline</Button>
                <Button variant="ghost" size="sm">Ghost</Button>
                <Button variant="destructive" size="sm">Destructive</Button>
              </div>
              <div className="flex items-center gap-2 pt-1">
                <Button variant="default" size="sm" className="gap-1.5">
                  <Sparkles className="size-3.5" />
                  <span>With Icon</span>
                </Button>
                <Button variant="outline" size="icon-sm" aria-label="Settings">
                  <Settings className="size-4" />
                </Button>
                <Button variant="ghost" size="icon-sm" aria-label="Notifications">
                  <Bell className="size-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* 2. Badges & Tags */}
          <Card className="border-border/70 bg-card/60">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">Badges & Tags</CardTitle>
              <CardDescription className="text-xs">
                Semantic indicators for status, category, and counters.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 pt-2">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="default">Active</Badge>
                <Badge variant="secondary">In Review</Badge>
                <Badge variant="outline">Draft</Badge>
                <Badge variant="destructive">Failed</Badge>
              </div>
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                  <span className="size-1.5 rounded-full bg-emerald-500" />
                  Live Sync
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/10 px-2.5 py-0.5 text-xs font-medium text-blue-600 dark:text-blue-400">
                  v2.4.0
                </span>
              </div>
            </CardContent>
          </Card>

          {/* 3. Inputs & Selects */}
          <Card className="border-border/70 bg-card/60">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">Inputs & Selects</CardTitle>
              <CardDescription className="text-xs">
                Controlled form elements with icons and validation states.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 pt-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                <Input
                  placeholder="Search records..."
                  className="pl-8 h-8 text-xs bg-background"
                />
              </div>
              <div className="flex items-center gap-2">
                <NativeSelect size="sm" defaultValue="admin" className="w-full">
                  <NativeSelectOption value="admin">Role: Administrator</NativeSelectOption>
                  <NativeSelectOption value="editor">Role: Editor</NativeSelectOption>
                  <NativeSelectOption value="viewer">Role: Viewer</NativeSelectOption>
                </NativeSelect>
              </div>
            </CardContent>
          </Card>

          {/* 4. Tabs */}
          <Card className="border-border/70 bg-card/60">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">Tabs</CardTitle>
              <CardDescription className="text-xs">
                Accessible segmented views with keyboard navigation.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="w-full grid grid-cols-3 h-8">
                  <TabsTrigger value="overview" className="text-xs">Overview</TabsTrigger>
                  <TabsTrigger value="analytics" className="text-xs">Metrics</TabsTrigger>
                  <TabsTrigger value="settings" className="text-xs">Settings</TabsTrigger>
                </TabsList>
                <TabsContent value="overview" className="mt-2 text-xs text-muted-foreground">
                  Real-time system telemetry and summary indicators.
                </TabsContent>
                <TabsContent value="analytics" className="mt-2 text-xs text-muted-foreground">
                  Historical aggregated trends and event conversions.
                </TabsContent>
                <TabsContent value="settings" className="mt-2 text-xs text-muted-foreground">
                  Workspace preferences, webhooks, and API keys.
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* 5. Dialogs & Overlays */}
          <Card className="border-border/70 bg-card/60">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">Dialogs & Menus</CardTitle>
              <CardDescription className="text-xs">
                Modal dialogs and contextual dropdown menus.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex items-center gap-3 pt-2">
              {/* Dialog Example */}
              <Dialog>
                <DialogTrigger
                  render={
                    <Button variant="outline" size="sm" className="text-xs gap-1.5" />
                  }
                >
                  <Layers className="size-3.5" />
                  <span>Open Modal</span>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>AdminKit Dialog</DialogTitle>
                    <DialogDescription>
                      Accessible modal dialog with backdrop blur and focus trapping.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="py-2 text-xs text-muted-foreground">
                    This modal dialog uses the project&apos;s native shadcn/ui dialog component.
                  </div>
                  <DialogFooter className="gap-2 sm:justify-end">
                    <DialogClose
                      render={
                        <Button variant="outline" size="sm" />
                      }
                    >
                      Cancel
                    </DialogClose>
                    <DialogClose
                      render={
                        <Button variant="default" size="sm" />
                      }
                    >
                      Confirm Action
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              {/* Dropdown Menu Example */}
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <Button variant="outline" size="sm" className="text-xs gap-1.5" />
                  }
                >
                  <span>Actions Menu</span>
                  <ChevronDown className="size-3.5 text-muted-foreground" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Quick Actions</DropdownMenuLabel>
                  <DropdownMenuItem className="text-xs cursor-pointer">
                    <User className="size-3.5 mr-2" />
                    <span>View Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-xs cursor-pointer">
                    <Settings className="size-3.5 mr-2" />
                    <span>Configure App</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-xs text-destructive cursor-pointer">
                    <Trash2 className="size-3.5 mr-2" />
                    <span>Delete Record</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardContent>
          </Card>

          {/* 6. Alerts & Feedback */}
          <Card className="border-border/70 bg-card/60">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">Alerts & Feedback</CardTitle>
              <CardDescription className="text-xs">
                Inline notices and warning callouts.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2.5 pt-2">
              <Alert className="py-2 text-xs border-border/80">
                <Info className="size-4 text-primary" />
                <AlertTitle className="text-xs font-semibold">Update Available</AlertTitle>
                <AlertDescription className="text-[11px] text-muted-foreground">
                  AdminKit v1.2 is ready to install.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          {/* 7. Form Controls (Switch & Checkbox) */}
          <Card className="border-border/70 bg-card/60">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">Form Controls</CardTitle>
              <CardDescription className="text-xs">
                Switches, checkboxes, and interactive toggles.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 pt-2 text-xs">
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-foreground">Two-Factor Authentication</span>
                <Switch
                  checked={switchActive}
                  onCheckedChange={setSwitchActive}
                />
              </label>
              <label className="flex items-center gap-2 cursor-pointer pt-1">
                <Checkbox
                  checked={checkboxChecked}
                  onCheckedChange={setCheckboxChecked}
                />
                <span className="text-foreground">Notify on new team logins</span>
              </label>
            </CardContent>
          </Card>

          {/* 8. Mini Tables */}
          <Card className="border-border/70 bg-card/60">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">Tables</CardTitle>
              <CardDescription className="text-xs">
                Structured tabular display with styled rows.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              <Table className="text-xs">
                <TableHeader>
                  <TableRow>
                    <TableHead className="h-7 text-[11px]">Service</TableHead>
                    <TableHead className="h-7 text-[11px]">Status</TableHead>
                    <TableHead className="h-7 text-right text-[11px]">Latency</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="py-1.5 font-medium">Auth API</TableCell>
                    <TableCell className="py-1.5">
                      <span className="text-emerald-500 font-medium text-[11px]">99.98%</span>
                    </TableCell>
                    <TableCell className="py-1.5 text-right font-mono text-[11px]">28ms</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="py-1.5 font-medium">Database</TableCell>
                    <TableCell className="py-1.5">
                      <span className="text-emerald-500 font-medium text-[11px]">100%</span>
                    </TableCell>
                    <TableCell className="py-1.5 text-right font-mono text-[11px]">14ms</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* 9. Charts & Telemetry */}
          <Card className="border-border/70 bg-card/60">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">Charts & Metrics</CardTitle>
              <CardDescription className="text-xs">
                Visual telemetry and data density.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 pt-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Server Load</span>
                <span className="font-mono font-medium text-foreground">42%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                <div className="h-full bg-primary rounded-full transition-all" style={{ width: "42%" }} />
              </div>
              <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1">
                <span>8 Cores Dedicated</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-medium">Optimal</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
