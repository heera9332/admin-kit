"use client"

import * as React from "react"
import {
  Search,
  SlidersHorizontal,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  UserCheck,
  Download,
  Trash2,
} from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Checkbox } from "@/components/ui/checkbox"
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface UserRecord {
  id: string
  name: string
  email: string
  role: "Admin" | "Editor" | "Billing" | "Member" | "Viewer"
  status: "Active" | "Pending" | "Suspended"
  date: string
  initials: string
}

const initialUsers: UserRecord[] = [
  {
    id: "usr-1",
    name: "Sophia Martinez",
    email: "sophia@acmecorp.com",
    role: "Admin",
    status: "Active",
    date: "Oct 14, 2026",
    initials: "SM",
  },
  {
    id: "usr-2",
    name: "Alexander Wright",
    email: "alex@apexstudio.io",
    role: "Editor",
    status: "Active",
    date: "Oct 12, 2026",
    initials: "AW",
  },
  {
    id: "usr-3",
    name: "Chloe Bennett",
    email: "chloe@zenith.ai",
    role: "Billing",
    status: "Pending",
    date: "Oct 11, 2026",
    initials: "CB",
  },
  {
    id: "usr-4",
    name: "Lucas Gallagher",
    email: "lucas@hyperflow.dev",
    role: "Member",
    status: "Active",
    date: "Oct 09, 2026",
    initials: "LG",
  },
  {
    id: "usr-5",
    name: "Mia Takahashi",
    email: "mia@orbitcloud.com",
    role: "Viewer",
    status: "Suspended",
    date: "Oct 07, 2026",
    initials: "MT",
  },
]

export function TableShowcase() {
  const [searchTerm, setSearchTerm] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState("ALL")
  const [selectedIds, setSelectedIds] = React.useState<string[]>([])

  const filteredUsers = initialUsers.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus =
      statusFilter === "ALL" || user.status.toUpperCase() === statusFilter

    return matchesSearch && matchesStatus
  })

  const allSelected =
    filteredUsers.length > 0 &&
    filteredUsers.every((u) => selectedIds.includes(u.id))

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedIds([])
    } else {
      setSelectedIds(filteredUsers.map((u) => u.id))
    }
  }

  const toggleSelectOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  return (
    <section className="border-t border-border/50 bg-muted/10 py-20 lg:py-28">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">
            Data Architecture
          </p>
          <h2 className="font-heading mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl text-foreground">
            Tables built for real applications
          </h2>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed text-balance">
            Complete data grid functionality with sorting, filtering, selection, bulk operations, and pagination built on TanStack Table principles.
          </p>
        </div>

        {/* Table Container Card */}
        <div className="mt-14 rounded-xl border border-border/80 bg-card shadow-sm overflow-hidden">
          {/* Controls Bar: Search, Status Filter & Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 border-b border-border/60 bg-muted/20">
            <div className="flex flex-1 items-center gap-2 max-w-md">
              <div className="relative w-full">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                <Input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Filter by name, email, or role..."
                  className="pl-8 h-8 text-xs bg-background"
                />
              </div>

              <NativeSelect
                size="sm"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-36 shrink-0"
              >
                <NativeSelectOption value="ALL">All Statuses</NativeSelectOption>
                <NativeSelectOption value="ACTIVE">Active</NativeSelectOption>
                <NativeSelectOption value="PENDING">Pending</NativeSelectOption>
                <NativeSelectOption value="SUSPENDED">Suspended</NativeSelectOption>
              </NativeSelect>
            </div>

            {/* Bulk Actions / Count */}
            <div className="flex items-center gap-2">
              {selectedIds.length > 0 ? (
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-foreground">
                    {selectedIds.length} selected
                  </span>
                  <Button variant="outline" size="sm" className="h-8 gap-1 text-xs">
                    <Download className="size-3.5" />
                    <span>Export</span>
                  </Button>
                  <Button variant="destructive" size="sm" className="h-8 gap-1 text-xs">
                    <Trash2 className="size-3.5" />
                    <span>Delete</span>
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="h-8 gap-1 text-xs">
                    <SlidersHorizontal className="size-3.5 text-muted-foreground" />
                    <span>View Options</span>
                  </Button>
                  <Button variant="default" size="sm" className="h-8 gap-1 text-xs">
                    <ShieldCheck className="size-3.5" />
                    <span>New User</span>
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Realistic Data Table */}
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40 hover:bg-muted/40">
                  <TableHead className="w-12 text-center">
                    <Checkbox
                      checked={allSelected}
                      onCheckedChange={toggleSelectAll}
                      aria-label="Select all rows"
                    />
                  </TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Date Added</TableHead>
                  <TableHead className="w-16 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-28 text-center text-xs text-muted-foreground">
                      No matching records found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => {
                    const isSelected = selectedIds.includes(user.id)
                    return (
                      <TableRow
                        key={user.id}
                        data-state={isSelected ? "selected" : undefined}
                        className="transition-colors"
                      >
                        <TableCell className="text-center">
                          <Checkbox
                            checked={isSelected}
                            onCheckedChange={() => toggleSelectOne(user.id)}
                            aria-label={`Select ${user.name}`}
                          />
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar size="sm">
                              <AvatarFallback className="text-[10px] bg-primary/10 text-primary font-semibold">
                                {user.initials}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium text-foreground text-xs">
                                {user.name}
                              </div>
                              <div className="text-[11px] text-muted-foreground font-mono">
                                {user.email}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {user.status === "Active" && (
                            <Badge
                              variant="secondary"
                              className="text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-transparent font-medium"
                            >
                              Active
                            </Badge>
                          )}
                          {user.status === "Pending" && (
                            <Badge
                              variant="outline"
                              className="text-[10px] text-amber-600 dark:text-amber-400 border-amber-500/30 font-medium"
                            >
                              Pending
                            </Badge>
                          )}
                          {user.status === "Suspended" && (
                            <Badge
                              variant="destructive"
                              className="text-[10px] font-medium"
                            >
                              Suspended
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <span className="text-xs text-foreground font-medium">
                            {user.role}
                          </span>
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground font-mono">
                          {user.date}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger
                              render={
                                <Button
                                  variant="ghost"
                                  size="icon-xs"
                                  aria-label="Open user actions"
                                />
                              }
                            >
                              <MoreHorizontal className="size-4 text-muted-foreground" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="text-xs w-36">
                              <DropdownMenuItem className="justify-between gap-2 cursor-pointer">
                                <span>View</span>
                                <UserCheck className="size-3.5" />
                              </DropdownMenuItem>
                              <DropdownMenuItem className="justify-between gap-2 cursor-pointer">
                                <span>Edit</span>
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="justify-between gap-2 text-destructive cursor-pointer">
                                <span>Suspend Account</span>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination Footer */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 border-t border-border/60 bg-muted/20 text-xs text-muted-foreground">
            <div>
              Showing <span className="font-medium text-foreground">{filteredUsers.length}</span> of{" "}
              <span className="font-medium text-foreground">{initialUsers.length}</span> entries
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs">Page 1 of 1</span>
              <div className="flex items-center gap-1">
                <Button variant="outline" size="icon-xs" disabled aria-label="Previous page">
                  <ChevronLeft className="size-3.5" />
                </Button>
                <Button variant="outline" size="icon-xs" disabled aria-label="Next page">
                  <ChevronRight className="size-3.5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
