"use client"

import * as React from "react"
import { useTranslations } from "next-intl"
import {
  MoreHorizontal,
  Eye,
  Pencil,
  Trash2,
  Search,
  FolderKanban,
  CheckCircle2,
  Clock,
  PauseCircle,
  Plus,
  Tag,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { StatusBadge } from "@/components/status-badge"
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
  const tTable = useTranslations("table")

  const [search, setSearch] = React.useState("")
  const [selectedStatus, setSelectedStatus] = React.useState<string>("all")
  const [selectedCategory, setSelectedCategory] = React.useState<string>("all")
  const [currentPage, setCurrentPage] = React.useState(1)
  const pageSize = 6

  const filteredProjects = React.useMemo(() => {
    return projects.filter((item) => {
      const matchesSearch =
        search.trim() === "" ||
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.description.toLowerCase().includes(search.toLowerCase()) ||
        item.id.toLowerCase().includes(search.toLowerCase()) ||
        item.category.toLowerCase().includes(search.toLowerCase())

      const matchesStatus =
        selectedStatus === "all" || item.status === selectedStatus

      const matchesCategory =
        selectedCategory === "all" || item.category === selectedCategory

      return matchesSearch && matchesStatus && matchesCategory
    })
  }, [projects, search, selectedStatus, selectedCategory])

  const totalPages = Math.max(1, Math.ceil(filteredProjects.length / pageSize))
  const paginatedProjects = React.useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize
    return filteredProjects.slice(startIndex, startIndex + pageSize)
  }, [filteredProjects, currentPage, pageSize])

  // Stats calculation
  const totalCount = projects.length
  const inProgressCount = projects.filter((p) => p.status === "in_progress").length
  const completedCount = projects.filter((p) => p.status === "completed").length
  const planningCount = projects.filter((p) => p.status === "planning").length

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

      {/* Controls: Search, Filters, New Project Button */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 pt-2">
        <div className="flex flex-1 flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder={t("searchPlaceholder")}
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setCurrentPage(1)
              }}
              className="pl-8.5 h-8 text-xs w-full"
            />
          </div>

          <div className="flex items-center gap-2">
            <Select
              value={selectedCategory}
              onValueChange={(val) => {
                if (val) {
                  setSelectedCategory(val)
                  setCurrentPage(1)
                }
              }}
            >
              <SelectTrigger className="h-8 text-xs w-36">
                <SelectValue placeholder={t("allCategories")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("allCategories")}</SelectItem>
                <SelectItem value="web">{t("categories.web")}</SelectItem>
                <SelectItem value="mobile">{t("categories.mobile")}</SelectItem>
                <SelectItem value="design">{t("categories.design")}</SelectItem>
                <SelectItem value="marketing">{t("categories.marketing")}</SelectItem>
                <SelectItem value="devops">{t("categories.devops")}</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={selectedStatus}
              onValueChange={(val) => {
                if (val) {
                  setSelectedStatus(val)
                  setCurrentPage(1)
                }
              }}
            >
              <SelectTrigger className="h-8 text-xs w-36">
                <SelectValue placeholder={t("allStatuses")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("allStatuses")}</SelectItem>
                <SelectItem value="planning">{t("statuses.planning")}</SelectItem>
                <SelectItem value="in_progress">{t("statuses.in_progress")}</SelectItem>
                <SelectItem value="completed">{t("statuses.completed")}</SelectItem>
                <SelectItem value="on_hold">{t("statuses.on_hold")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button onClick={onOpenCreate} size="sm" className="h-8 gap-1.5 text-xs self-end sm:self-auto">
          <Plus className="size-3.5" />
          <span>{t("newProject")}</span>
        </Button>
      </div>

      {/* Projects Table */}
      <div className="rounded-md border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-xs">{t("fields.title")}</TableHead>
              <TableHead className="text-xs">{t("fields.category")}</TableHead>
              <TableHead className="text-xs">{t("fields.status")}</TableHead>
              <TableHead className="text-xs hidden md:table-cell">
                {t("fields.progress")}
              </TableHead>
              <TableHead className="text-xs hidden lg:table-cell">
                {t("fields.dueDate")}
              </TableHead>
              <TableHead className="text-xs text-right">{t("fields.actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedProjects.length ? (
              paginatedProjects.map((project) => (
                <TableRow
                  key={project.id}
                  className="text-xs sm:text-sm hover:bg-muted/40 cursor-pointer"
                  onClick={() => onView(project)}
                >
                  <TableCell className="max-w-[280px]">
                    <div className="flex items-start gap-2.5">
                      <div className="size-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
                        <FolderKanban className="size-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-xs truncate">
                            {project.title}
                          </span>
                          <span className="text-[10px] font-mono text-muted-foreground shrink-0">
                            {project.id}
                          </span>
                        </div>
                        <p className="text-[11px] text-muted-foreground truncate mt-0.5">
                          {project.description}
                        </p>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <Badge variant="outline" className="text-[10px] font-normal gap-1">
                      <Tag className="size-2.5" />
                      <span>{t(`categories.${project.category}`)}</span>
                    </Badge>
                  </TableCell>

                  <TableCell>
                    <StatusBadge status={project.status} size="sm" dot>
                      {t(`statuses.${project.status}`)}
                    </StatusBadge>
                  </TableCell>

                    <TableCell className="hidden md:table-cell min-w-[120px]">
                      {project.progress !== undefined ? (
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-[10px] text-muted-foreground font-mono">
                            <span>{project.progress}%</span>
                          </div>
                          <Progress value={project.progress} className="h-1.5" />
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </TableCell>

                    <TableCell className="text-xs text-muted-foreground hidden lg:table-cell">
                      {project.dueDate ?? "—"}
                    </TableCell>

                    <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          render={
                            <Button variant="ghost" size="icon" className="size-7">
                              <MoreHorizontal className="size-3.5" />
                            </Button>
                          }
                        />
                        <DropdownMenuContent align="end" className="text-xs w-36">
                          <DropdownMenuLabel>{t("fields.actions")}</DropdownMenuLabel>
                          <DropdownMenuItem
                            onClick={() => onView(project)}
                            className="gap-2 cursor-pointer"
                          >
                            <Eye className="size-3.5" />
                            <span>{t("viewProject")}</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => onEdit(project)}
                            className="gap-2 cursor-pointer"
                          >
                            <Pencil className="size-3.5" />
                            <span>{t("editProject")}</span>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => onDelete(project)}
                            className="gap-2 text-destructive cursor-pointer"
                          >
                            <Trash2 className="size-3.5" />
                            <span>{t("deleteProject")}</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-44 text-center">
                  <div className="flex flex-col items-center justify-center gap-1.5 text-muted-foreground">
                    <FolderKanban className="size-8 opacity-30 stroke-1" />
                    <p className="text-sm font-medium text-foreground">
                      {t("empty.noProjects")}
                    </p>
                    <p className="text-xs max-w-sm">
                      {t("empty.noProjectsDesc")}
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={onOpenCreate}
                      className="mt-2 text-xs"
                    >
                      <Plus className="mr-1.5 size-3.5" />
                      <span>{t("newProject")}</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Footer */}
      <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
        <span>
          {filteredProjects.length} {t("title").toLowerCase()} found
        </span>

        {totalPages > 1 && (
          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="sm"
              className="h-7 px-2.5 text-xs"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              {tTable("pagination.previous")}
            </Button>
            <span className="text-xs px-1 font-mono">
              {currentPage} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              className="h-7 px-2.5 text-xs"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              {tTable("pagination.next")}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
