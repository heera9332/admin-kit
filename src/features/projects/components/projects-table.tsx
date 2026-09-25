"use client"

import * as React from "react"
import { useTranslations } from "next-intl"
import {
  CheckCircle2,
  ChevronDown,
  Clock,
  FolderKanban,
  PauseCircle,
  Plus,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { DataTable, DataTableFloatingBar } from "@/components/shared/data-table"
import { toast } from "@/components/ui/toast"
import { cn } from "@/lib/utils"
import { getProjectColumns } from "../project-columns"
import type { Project, ProjectStatus } from "../types"

interface ProjectsTableProps {
  projects: Project[]
  onView: (project: Project) => void
  onEdit: (project: Project) => void
  onDelete: (project: Project) => void
  onOpenCreate: () => void
  onBulkStatusChange?: (projectIds: string[], newStatus: ProjectStatus) => void
}

export function ProjectsTable({
  projects,
  onView,
  onEdit,
  onDelete,
  onOpenCreate,
  onBulkStatusChange,
}: ProjectsTableProps) {
  const t = useTranslations("projects")

  // Stats calculation
  const totalCount = projects.length
  const inProgressCount = projects.filter((p) => p.status === "in_progress").length
  const completedCount = projects.filter((p) => p.status === "completed").length
  const planningCount = projects.filter((p) => p.status === "planning").length

  const columns = React.useMemo(
    () =>
      getProjectColumns({
        onView,
        onEdit,
        onDelete,
        t,
      }),
    [onView, onEdit, onDelete, t]
  )

  const projectStatuses: {
    value: ProjectStatus
    labelKey: string
    icon: React.ComponentType<{ className?: string }>
    color: string
  }[] = [
    { value: "planning", labelKey: "statuses.planning", icon: PauseCircle, color: "text-amber-500" },
    { value: "in_progress", labelKey: "statuses.in_progress", icon: Clock, color: "text-blue-500" },
    { value: "completed", labelKey: "statuses.completed", icon: CheckCircle2, color: "text-emerald-500" },
    { value: "on_hold", labelKey: "statuses.on_hold", icon: PauseCircle, color: "text-rose-500" },
  ]

  return (
    <div className="space-y-4">
      {/* Top Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              {t("stats.total")}
            </CardTitle>
            <FolderKanban className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono">{totalCount}</div>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Across all categories
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              {t("stats.inProgress")}
            </CardTitle>
            <Clock className="size-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono text-blue-600 dark:text-blue-400">
              {inProgressCount}
            </div>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Active sprints & tasks
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              {t("stats.completed")}
            </CardTitle>
            <CheckCircle2 className="size-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
              {completedCount}
            </div>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Successfully shipped
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              {t("stats.planning")}
            </CardTitle>
            <PauseCircle className="size-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono text-amber-600 dark:text-amber-400">
              {planningCount}
            </div>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Upcoming roadmaps
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Projects Reusable DataTable */}
      <DataTable
        data={projects}
        columns={columns}
        search={{
          column: "title",
          placeholder: t("searchPlaceholder"),
        }}
        filters={[
          {
            column: "category",
            title: t("fields.category"),
            options: [
              { label: t("categories.web"), value: "web" },
              { label: t("categories.mobile"), value: "mobile" },
              { label: t("categories.design"), value: "design" },
              { label: t("categories.marketing"), value: "marketing" },
              { label: t("categories.devops"), value: "devops" },
            ],
          },
          {
            column: "status",
            title: t("fields.status"),
            options: [
              { label: t("statuses.planning"), value: "planning" },
              { label: t("statuses.in_progress"), value: "in_progress" },
              { label: t("statuses.completed"), value: "completed" },
              { label: t("statuses.on_hold"), value: "on_hold" },
            ],
          },
        ]}
        sorting
        pagination={{
          pageSize: 6,
          pageSizeOptions: [6, 10, 20, 50],
        }}
        onRowClick={onView}
        toolbarActions={
          <Button
            onClick={onOpenCreate}
            size="sm"
            className="h-8 gap-1.5 text-xs"
          >
            <Plus className="size-3.5" />
            <span>{t("newProject")}</span>
          </Button>
        }
        floatingBar={(table) => (
          <DataTableFloatingBar table={table} entityName="project">
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 gap-1.5 rounded-full text-xs font-medium cursor-pointer shadow-xs"
                  >
                    <FolderKanban className="size-3.5 text-primary" />
                    <span>{t("bulk.changeStatus")}</span>
                    <ChevronDown className="size-3.5 opacity-60" />
                  </Button>
                }
              />
              <DropdownMenuContent align="center" side="top" className="text-xs w-44 mb-2">
                <DropdownMenuLabel className="text-[11px] text-muted-foreground uppercase tracking-wider font-semibold">
                  {t("bulk.changeStatus")}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {projectStatuses.map((st) => {
                  const Icon = st.icon
                  return (
                    <DropdownMenuItem
                      key={st.value}
                      onClick={() => {
                        const selectedRows = table.getFilteredSelectedRowModel().rows
                        const ids = selectedRows.map((r) => r.original.id)
                        if (ids.length === 0) return

                        onBulkStatusChange?.(ids, st.value)
                        table.resetRowSelection()

                        toast.add({
                          title: t("bulk.statusUpdated", { count: ids.length }),
                          description: `${ids.length} project(s) updated to "${t(st.labelKey)}"`,
                        })
                      }}
                      className="gap-2 cursor-pointer"
                    >
                      <Icon className={cn("size-3.5", st.color)} />
                      <span>{t(st.labelKey)}</span>
                    </DropdownMenuItem>
                  )
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          </DataTableFloatingBar>
        )}
      />
    </div>
  )
}
