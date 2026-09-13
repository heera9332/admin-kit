"use client"

import * as React from "react"
import { useTranslations } from "next-intl"
import {
  CheckCircle2,
  Clock,
  FolderKanban,
  PauseCircle,
  Plus,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DataTable } from "@/components/shared/data-table"
import { getProjectColumns } from "../project-columns"
import type { Project } from "../types"

interface ProjectsTableProps {
  projects: Project[]
  onView: (project: Project) => void
  onEdit: (project: Project) => void
  onDelete: (project: Project) => void
  onOpenCreate: () => void
}

export function ProjectsTable({
  projects,
  onView,
  onEdit,
  onDelete,
  onOpenCreate,
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
      />
    </div>
  )
}
