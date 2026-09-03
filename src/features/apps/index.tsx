"use client"

import * as React from "react"
import {
  Layers,
  Search,
  CheckCircle2,
  ArrowDownAZ,
  ArrowUpAZ,
  Globe,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { appsData, type AppItem } from "./data/apps"

export function AppsFeature() {
  const [apps, setApps] = React.useState<AppItem[]>(appsData)
  const [search, setSearch] = React.useState("")
  const [filterType, setFilterType] = React.useState<"all" | "connected" | "notConnected">("all")
  const [sortOrder, setSortOrder] = React.useState<"asc" | "desc">("asc")

  const toggleConnect = (id: string) => {
    setApps((prev) =>
      prev.map((app) =>
        app.id === id ? { ...app, connected: !app.connected } : app
      )
    )
  }

  const filteredApps = apps
    .filter((app) => {
      const matchesSearch =
        app.name.toLowerCase().includes(search.toLowerCase()) ||
        app.desc.toLowerCase().includes(search.toLowerCase())
      const matchesFilter =
        filterType === "all"
          ? true
          : filterType === "connected"
          ? app.connected
          : !app.connected
      return matchesSearch && matchesFilter
    })
    .sort((a, b) =>
      sortOrder === "asc"
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name)
    )

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">App Integrations</h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Connect and manage external platforms and webhook services.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
          <Input
            placeholder="Search integrations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 h-8 text-xs"
          />
        </div>

        <div className="flex items-center gap-2">
          <Select
            value={filterType}
            onValueChange={(val) => {
              if (val) setFilterType(val as "all" | "connected" | "notConnected")
            }}
          >
            <SelectTrigger className="h-8 w-[140px] text-xs">
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Apps</SelectItem>
              <SelectItem value="connected">Connected</SelectItem>
              <SelectItem value="notConnected">Not Connected</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="sm"
            className="h-8 px-2.5 text-xs gap-1.5"
            onClick={() => setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))}
          >
            {sortOrder === "asc" ? (
              <ArrowDownAZ className="size-3.5" />
            ) : (
              <ArrowUpAZ className="size-3.5" />
            )}
            <span className="hidden sm:inline">Sort</span>
          </Button>
        </div>
      </div>

      {/* Apps Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredApps.map((app) => (
          <Card key={app.id} className="flex flex-col justify-between">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex size-10 items-center justify-center rounded-lg border bg-muted/40 text-primary">
                  <Globe className="size-5" />
                </div>
                <Badge
                  variant={app.connected ? "default" : "secondary"}
                  className="text-[10px] font-medium"
                >
                  {app.connected ? (
                    <span className="flex items-center gap-1">
                      <CheckCircle2 className="size-3" />
                      Connected
                    </span>
                  ) : (
                    "Available"
                  )}
                </Badge>
              </div>
              <CardTitle className="text-base mt-2">{app.name}</CardTitle>
              <CardDescription className="text-xs line-clamp-2">
                {app.desc}
              </CardDescription>
            </CardHeader>

            <CardFooter className="pt-2 border-t flex items-center justify-between">
              <span className="text-[11px] text-muted-foreground font-mono">
                {app.category}
              </span>
              <Button
                variant={app.connected ? "outline" : "default"}
                size="sm"
                className="h-7 text-xs"
                onClick={() => toggleConnect(app.id)}
              >
                {app.connected ? "Disconnect" : "Connect"}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {filteredApps.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center border rounded-lg border-dashed">
          <Layers className="size-8 text-muted-foreground/60 mb-2" />
          <h3 className="text-sm font-semibold">No integrations found</h3>
          <p className="text-xs text-muted-foreground mt-1">
            Try adjusting your search query or filter settings.
          </p>
        </div>
      )}
    </div>
  )
}
