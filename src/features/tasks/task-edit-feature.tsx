"use client"

import * as React from "react"
import { useTranslations } from "next-intl"
import {
  ArrowLeft,
  Save,
  Eye,
  Clock,
  Trash2,
  SlidersHorizontal,
  UserCheck,
  UserPlus,
  FileText,
  FolderKanban,
} from "lucide-react"

import { Button, buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { StatusBadge } from "@/components/status-badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { AppSheet } from "@/components/app-sheet"
import { TiptapEditor } from "@/components/forms/tiptap-editor"
import { useTasks } from "@/context/tasks-provider"
import { useRouter, Link } from "@/i18n/routing"
import { toast } from "@/components/ui/toast"
import { cn } from "@/lib/utils"
import {
  type Task,
  getTaskUser,
  taskUserOptions,
  getTaskProject,
  taskProjectOptions,
} from "./data/tasks"
import { statusIcons, priorityIcons } from "./task-columns"
import {
  QuickEditTaskDialog,
  DeleteTaskDialog,
} from "./components/tasks-dialogs"

interface TaskEditFeatureProps {
  taskId: string
}

interface TaskEditFormProps {
  task: Task | null | undefined
  isNew: boolean
}

function TaskEditForm({ task, isNew }: TaskEditFormProps) {
  const t = useTranslations("tasks")
  const tCommon = useTranslations("common")
  const router = useRouter()
  const { updateTask, createTask, deleteTask } = useTasks()

  // Form State
  const [title, setTitle] = React.useState(task?.title || "")
  const [content, setContent] = React.useState(task?.content || "")
  const [status, setStatus] = React.useState<Task["status"]>(task?.status || "todo")
  const [priority, setPriority] = React.useState<Task["priority"]>(
    task?.priority || "medium"
  )
  const [label, setLabel] = React.useState<Task["label"]>(task?.label || "feature")
  const [projectId, setProjectId] = React.useState<string>(
    task?.projectId || task?.project || "none"
  )
  const [assignedTo, setAssignedTo] = React.useState<string>(
    task?.assignedTo || "unassigned"
  )
  const [reportedTo, setReportedTo] = React.useState<string>(
    task?.reportedTo || "unassigned"
  )

  // UI State
  const [isSaving, setIsSaving] = React.useState(false)
  const [previewOpen, setPreviewOpen] = React.useState(false)
  const [quickEditOpen, setQuickEditOpen] = React.useState(false)
  const [deleteOpen, setDeleteOpen] = React.useState(false)

  // Word count & reading time calculation
  const metrics = React.useMemo(() => {
    const text = content.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim()
    const wordCount = text ? text.split(/\s+/).length : 0
    const charCount = text.length
    const readingTime = Math.max(1, Math.ceil(wordCount / 200))
    return { wordCount, charCount, readingTime }
  }, [content])

  const assignedUser = getTaskUser(
    assignedTo && assignedTo !== "unassigned" ? assignedTo : null
  )
  const reportedUser = getTaskUser(
    reportedTo && reportedTo !== "unassigned" ? reportedTo : null
  )
  const selectedProject = getTaskProject(
    projectId && projectId !== "none" ? projectId : null
  )

  const handleSave = () => {
    if (!title.trim()) {
      toast.add({
        title: "Title is required",
        description: "Please enter a valid title for this task.",
      })
      return
    }

    setIsSaving(true)

    try {
      const finalProject =
        projectId && projectId !== "none" ? projectId : null
      const finalAssignedTo =
        assignedTo && assignedTo !== "unassigned" ? assignedTo : null
      const finalReportedTo =
        reportedTo && reportedTo !== "unassigned" ? reportedTo : null

      if (isNew) {
        const created = createTask({
          title: title.trim(),
          status,
          priority,
          label,
          projectId: finalProject,
          project: finalProject,
          assignedTo: finalAssignedTo,
          reportedTo: finalReportedTo,
          content: content.trim(),
        })

        toast.add({
          title: t("editor.taskCreatedSuccess"),
          description: `Task "${created.id}" created successfully.`,
        })

        router.push(`/dashboard/tasks/${created.id}`)
      } else if (task) {
        const updated: Task = {
          ...task,
          title: title.trim(),
          status,
          priority,
          label,
          projectId: finalProject,
          project: finalProject,
          assignedTo: finalAssignedTo,
          reportedTo: finalReportedTo,
          content: content.trim(),
        }

        updateTask(task.id, updated)

        toast.add({
          title: t("editor.taskSavedSuccess"),
          description: `Task "${task.id}" updated successfully.`,
        })
      }
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = () => {
    if (!task) return
    deleteTask(task.id)
    toast.add({
      title: t("editor.taskDeletedSuccess"),
      description: `Task "${task.id}" has been deleted.`,
    })
    router.push("/dashboard/tasks")
  }

  // Handle Quick Edit updates syncing back into the form
  const handleQuickEditSave = (updated: Task) => {
    updateTask(updated.id, updated)
    setTitle(updated.title)
    setStatus(updated.status)
    setPriority(updated.priority)
    setLabel(updated.label)
    setProjectId(updated.projectId || updated.project || "none")
    setAssignedTo(updated.assignedTo || "unassigned")
    setReportedTo(updated.reportedTo || "unassigned")
    toast.add({
      title: t("dialog.editTitle"),
      description: `Task "${updated.id}" updated successfully.`,
    })
  }

  return (
    <div className="space-y-4">
      {/* Top action header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/tasks"
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "h-8 gap-1.5 text-xs cursor-pointer shadow-xs"
            )}
          >
            <ArrowLeft className="size-3.5" />
            <span>{t("editor.backToTasks")}</span>
          </Link>

          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
              {isNew ? t("editor.createTitle") : `${t("editor.editTitle")}: ${task?.id}`}
            </h1>
            <StatusBadge status={status} size="sm" dot>
              {t(`status.${status === "in progress" ? "inProgress" : status}`)}
            </StatusBadge>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!isNew && task && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setQuickEditOpen(true)}
                className="h-8 gap-1.5 text-xs cursor-pointer"
              >
                <SlidersHorizontal className="size-3.5" />
                <span className="hidden sm:inline">{t("actions.quickEdit")}</span>
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setDeleteOpen(true)}
                className="h-8 gap-1.5 text-xs text-destructive hover:bg-destructive/10 cursor-pointer"
              >
                <Trash2 className="size-3.5" />
                <span className="hidden sm:inline">{tCommon("delete")}</span>
              </Button>
            </>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={() => setPreviewOpen(true)}
            className="h-8 gap-1.5 text-xs cursor-pointer"
          >
            <Eye className="size-3.5" />
            <span>{t("editor.preview")}</span>
          </Button>

          <Button
            size="sm"
            onClick={handleSave}
            disabled={isSaving || !title.trim()}
            className="h-8 gap-1.5 text-xs cursor-pointer shadow-xs"
          >
            <Save className="size-3.5" />
            <span>
              {isSaving
                ? "Saving..."
                : isNew
                ? t("editor.createTask")
                : t("editor.saveTask")}
            </span>
          </Button>
        </div>
      </div>

      {/* Main Grid: Content (Main 8 Columns) + Sidebar (4 Columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ================= MAIN COLUMN (Title + TipTap Content) ================= */}
        <div className="lg:col-span-8 space-y-5">
          {/* Title Card */}
          <Card>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="task-title" className="text-xs font-semibold">
                    {t("editor.titleLabel")} <span className="text-destructive">*</span>
                  </Label>
                  <span className="text-[11px] text-muted-foreground font-mono">
                    {title.length} chars
                  </span>
                </div>
                <Input
                  id="task-title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={t("editor.titlePlaceholder")}
                  className="text-base sm:text-lg font-semibold h-11"
                  required
                />
              </div>

              {/* Tiptap Rich Text Editor */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-semibold flex items-center gap-1.5">
                    <FileText className="size-3.5 text-muted-foreground" />
                    <span>{t("editor.contentLabel")}</span>
                  </Label>
                  <div className="flex items-center gap-3 text-[11px] text-muted-foreground font-mono">
                    <span>
                      {metrics.wordCount} {t("editor.words")}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="size-3" />
                      ~{metrics.readingTime} {t("editor.readingTime")}
                    </span>
                  </div>
                </div>

                <div className="rounded-lg border bg-background overflow-hidden focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-1">
                  <TiptapEditor
                    value={content}
                    onChange={setContent}
                    placeholder={t("editor.contentPlaceholder")}
                    minHeight="min-h-[420px]"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ================= SIDEBAR COLUMN (Project, Workflow, Priority, People) ================= */}
        <div className="lg:col-span-4 space-y-5">
          {/* Project & Workspace Card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-1.5">
                <FolderKanban className="size-4 text-primary" />
                <span>{t("dialog.projectLabel")}</span>
              </CardTitle>
              <CardDescription className="text-xs">
                Assign this task to an active workspace project.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-1.5">
                <Select
                  value={projectId}
                  onValueChange={(val) => setProjectId(val || "none")}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={t("dialog.projectPlaceholder")} />
                  </SelectTrigger>
                  <SelectContent>
                    {taskProjectOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedProject && (
                <div className="flex items-center justify-between p-2.5 rounded-md bg-muted/40 text-xs">
                  <div className="min-w-0">
                    <div className="font-semibold text-foreground truncate">
                      {selectedProject.title}
                    </div>
                    <div className="text-[10px] text-muted-foreground font-mono">
                      {selectedProject.id}
                    </div>
                  </div>
                  <Badge variant="outline" className="capitalize text-[10px]">
                    {selectedProject.category}
                  </Badge>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Workflow & Priority Card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">
                {t("editor.workflowTitle")}
              </CardTitle>
              <CardDescription className="text-xs">
                Manage lifecycle state, priority level, and tags.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Status */}
              <div className="space-y-1.5">
                <Label className="text-xs font-medium">{t("fields.status")}</Label>
                <Select
                  value={status}
                  onValueChange={(val) => setStatus((val as Task["status"]) || "todo")}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={t("fields.status")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="backlog">
                      <div className="flex items-center gap-2">
                        {statusIcons.backlog}
                        <span>{t("status.backlog")}</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="todo">
                      <div className="flex items-center gap-2">
                        {statusIcons.todo}
                        <span>{t("status.todo")}</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="in progress">
                      <div className="flex items-center gap-2">
                        {statusIcons["in progress"]}
                        <span>{t("status.inProgress")}</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="done">
                      <div className="flex items-center gap-2">
                        {statusIcons.done}
                        <span>{t("status.done")}</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="canceled">
                      <div className="flex items-center gap-2">
                        {statusIcons.canceled}
                        <span>{t("status.canceled")}</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Priority */}
              <div className="space-y-1.5">
                <Label className="text-xs font-medium">{t("fields.priority")}</Label>
                <Select
                  value={priority}
                  onValueChange={(val) => setPriority((val as Task["priority"]) || "medium")}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={t("fields.priority")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">
                      <div className="flex items-center gap-2">
                        {priorityIcons.low}
                        <span>{t("priority.low")}</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="medium">
                      <div className="flex items-center gap-2">
                        {priorityIcons.medium}
                        <span>{t("priority.medium")}</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="high">
                      <div className="flex items-center gap-2">
                        {priorityIcons.high}
                        <span>{t("priority.high")}</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Label */}
              <div className="space-y-1.5">
                <Label className="text-xs font-medium">{t("fields.label")}</Label>
                <Select
                  value={label}
                  onValueChange={(val) => setLabel((val as Task["label"]) || "feature")}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={t("fields.label")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bug">{t("labels.bug")}</SelectItem>
                    <SelectItem value="feature">{t("labels.feature")}</SelectItem>
                    <SelectItem value="documentation">
                      {t("labels.documentation")}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* People & Assignment Card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">
                {t("editor.assigneeTitle")}
              </CardTitle>
              <CardDescription className="text-xs">
                Delegate work and establish ownership.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Assigned To */}
              <div className="space-y-1.5">
                <Label className="text-xs font-medium flex items-center gap-1.5">
                  <UserCheck className="size-3 text-muted-foreground" />
                  <span>{t("fields.assignedTo")}</span>
                </Label>
                <Select
                  value={assignedTo}
                  onValueChange={(val) => setAssignedTo(val || "unassigned")}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={t("dialog.assignedToPlaceholder")} />
                  </SelectTrigger>
                  <SelectContent>
                    {taskUserOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {assignedUser && (
                  <div className="flex items-center gap-2 p-2 rounded-md bg-muted/40 text-xs">
                    <Avatar size="sm" className="size-6 text-[10px]">
                      {assignedUser.avatar && (
                        <AvatarImage
                          src={assignedUser.avatar}
                          alt={assignedUser.firstName}
                        />
                      )}
                      <AvatarFallback className="bg-primary/10 text-primary font-medium">
                        {assignedUser.firstName[0]}
                        {assignedUser.lastName[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <div className="font-medium truncate">
                        {assignedUser.firstName} {assignedUser.lastName}
                      </div>
                      <div className="text-[10px] text-muted-foreground truncate">
                        {assignedUser.email}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Reported To */}
              <div className="space-y-1.5">
                <Label className="text-xs font-medium flex items-center gap-1.5">
                  <UserPlus className="size-3 text-muted-foreground" />
                  <span>{t("fields.reportedTo")}</span>
                </Label>
                <Select
                  value={reportedTo}
                  onValueChange={(val) => setReportedTo(val || "unassigned")}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={t("dialog.reportedToPlaceholder")} />
                  </SelectTrigger>
                  <SelectContent>
                    {taskUserOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {reportedUser && (
                  <div className="flex items-center gap-2 p-2 rounded-md bg-muted/40 text-xs">
                    <Avatar size="sm" className="size-6 text-[10px]">
                      {reportedUser.avatar && (
                        <AvatarImage
                          src={reportedUser.avatar}
                          alt={reportedUser.firstName}
                        />
                      )}
                      <AvatarFallback className="bg-muted text-muted-foreground font-medium">
                        {reportedUser.firstName[0]}
                        {reportedUser.lastName[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <div className="font-medium truncate">
                        {reportedUser.firstName} {reportedUser.lastName}
                      </div>
                      <div className="text-[10px] text-muted-foreground truncate">
                        {reportedUser.email}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Task Info Card */}
          {!isNew && task && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold">
                  {t("editor.metaTitle")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b">
                  <span className="text-muted-foreground">{t("fields.id")}</span>
                  <span className="font-mono font-semibold">{task.id}</span>
                </div>
                {selectedProject && (
                  <div className="flex justify-between py-1 border-b">
                    <span className="text-muted-foreground">{t("fields.project")}</span>
                    <span className="font-medium truncate max-w-40">{selectedProject.title}</span>
                  </div>
                )}
                <div className="flex justify-between py-1 border-b">
                  <span className="text-muted-foreground">{t("fields.label")}</span>
                  <Badge variant="outline" className="capitalize text-[10px]">
                    {task.label}
                  </Badge>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-muted-foreground">{t("fields.priority")}</span>
                  <span className="capitalize font-medium">{task.priority}</span>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Preview Sheet */}
      <AppSheet
        open={previewOpen}
        onOpenChange={setPreviewOpen}
        side="right"
        size="lg"
        title={title || "Untitled Task"}
        description={task?.id || "NEW TASK"}
      >
        <div className="space-y-4 py-2">
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="p-3 rounded-lg border bg-card space-y-1">
              <span className="text-muted-foreground block">{t("fields.status")}</span>
              <div className="flex items-center gap-1.5 font-medium capitalize">
                {statusIcons[status]}
                <span>{status}</span>
              </div>
            </div>
            <div className="p-3 rounded-lg border bg-card space-y-1">
              <span className="text-muted-foreground block">{t("fields.priority")}</span>
              <div className="flex items-center gap-1.5 font-medium capitalize">
                {priorityIcons[priority]}
                <span>{priority}</span>
              </div>
            </div>
            <div className="p-3 rounded-lg border bg-card space-y-1">
              <span className="text-muted-foreground block">{t("fields.label")}</span>
              <Badge variant="outline" className="capitalize text-[10px]">
                {label}
              </Badge>
            </div>
          </div>

          {selectedProject && (
            <div className="p-3 rounded-lg border bg-card text-xs flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FolderKanban className="size-3.5 text-primary" />
                <span className="font-semibold">{selectedProject.title}</span>
              </div>
              <Badge variant="secondary" className="text-[10px] font-mono">
                {selectedProject.id}
              </Badge>
            </div>
          )}

          <div className="space-y-2">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              {t("fields.content")}
            </span>
            {content ? (
              <div
                className="prose prose-sm dark:prose-invert max-w-none text-xs sm:text-sm leading-relaxed p-4 rounded-lg border bg-card/60 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_blockquote]:border-l-3 [&_blockquote]:border-primary/50 [&_blockquote]:pl-3 [&_blockquote]:italic [&_code]:bg-muted [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded text-foreground"
                dangerouslySetInnerHTML={{ __html: content }}
              />
            ) : (
              <p className="text-xs text-muted-foreground italic p-3 rounded-lg border border-dashed">
                {t("dialog.noContent")}
              </p>
            )}
          </div>
        </div>
      </AppSheet>

      {/* Quick Edit Dialog from page */}
      {!isNew && task && (
        <QuickEditTaskDialog
          task={{
            ...task,
            title,
            status,
            priority,
            label,
            projectId: projectId === "none" ? null : projectId,
            project: projectId === "none" ? null : projectId,
            assignedTo: assignedTo === "unassigned" ? null : assignedTo,
            reportedTo: reportedTo === "unassigned" ? null : reportedTo,
          }}
          open={quickEditOpen}
          onOpenChange={setQuickEditOpen}
          onUpdate={handleQuickEditSave}
        />
      )}

      {/* Delete Dialog */}
      {!isNew && task && (
        <DeleteTaskDialog
          task={task}
          open={deleteOpen}
          onOpenChange={setDeleteOpen}
          onConfirm={handleDelete}
        />
      )}
    </div>
  )
}

export function TaskEditFeature({ taskId }: TaskEditFeatureProps) {
  const t = useTranslations("tasks")
  const { getTask } = useTasks()
  const isNew = taskId === "new"
  const task = isNew ? null : getTask(taskId)

  if (!isNew && !task) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] text-center space-y-3">
        <h2 className="text-xl font-bold">{t("editor.taskNotFound")}</h2>
        <p className="text-sm text-muted-foreground">
          {t("editor.taskNotFoundDesc")}
        </p>
        <Link
          href="/dashboard/tasks"
          className={cn(buttonVariants({ variant: "outline", size: "sm" }), "gap-1.5")}
        >
          <ArrowLeft className="size-3.5" />
          <span>{t("editor.backToTasks")}</span>
        </Link>
      </div>
    )
  }

  return (
    <TaskEditForm
      key={task?.id || "new"}
      task={task}
      isNew={isNew}
    />
  )
}
