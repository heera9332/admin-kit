"use client"

import * as React from "react"
import { useTranslations } from "next-intl"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import {
  FileText,
  FolderKanban,
  Pencil,
  SlidersHorizontal,
  Trash2,
  UserCheck,
  UserPlus,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { AppDialog } from "@/components/app-dialog"
import { AppSheet } from "@/components/app-sheet"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { TiptapEditor } from "@/components/forms/tiptap-editor"
import {
  type Task,
  getTaskUser,
  taskUserOptions,
  getTaskProject,
  taskProjectOptions,
} from "../data/tasks"
import { statusIcons, priorityIcons } from "../task-columns"

const taskFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  status: z.enum(["backlog", "todo", "in progress", "done", "canceled"] as const),
  priority: z.enum(["low", "medium", "high"] as const),
  label: z.enum(["bug", "feature", "documentation"] as const),
  projectId: z.string().optional().nullable(),
  assignedTo: z.string().optional().nullable(),
  reportedTo: z.string().optional().nullable(),
  content: z.string().optional(),
})

type TaskFormValues = z.infer<typeof taskFormSchema>

const quickEditTaskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  status: z.enum(["backlog", "todo", "in progress", "done", "canceled"] as const),
  priority: z.enum(["low", "medium", "high"] as const),
  label: z.enum(["bug", "feature", "documentation"] as const),
  projectId: z.string().optional().nullable(),
  assignedTo: z.string().optional().nullable(),
  reportedTo: z.string().optional().nullable(),
})

type QuickEditTaskFormValues = z.infer<typeof quickEditTaskSchema>

/* ========================================================================= */
/* CREATE TASK DIALOG (With Project, Tiptap Content, Assignee, Reporter)     */
/* ========================================================================= */
interface CreateTaskDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreate: (task: Task) => void
}

function generateTaskId(): string {
  return `TASK-${Math.floor(1000 + Math.random() * 9000)}`
}

function CreateTaskForm({
  onOpenChange,
  onCreate,
}: {
  onOpenChange: (open: boolean) => void
  onCreate: (task: Task) => void
}) {
  const t = useTranslations("tasks")
  const tCommon = useTranslations("common")

  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      title: "",
      status: "todo",
      priority: "medium",
      label: "feature",
      projectId: "none",
      assignedTo: "unassigned",
      reportedTo: "unassigned",
      content: "",
    },
  })

  const onSubmit = (data: TaskFormValues) => {
    const finalProject =
      data.projectId && data.projectId !== "none" ? data.projectId : null
    const newTask: Task = {
      id: generateTaskId(),
      title: data.title.trim(),
      status: data.status,
      priority: data.priority,
      label: data.label,
      projectId: finalProject,
      project: finalProject,
      assignedTo:
        data.assignedTo && data.assignedTo !== "unassigned"
          ? data.assignedTo
          : null,
      reportedTo:
        data.reportedTo && data.reportedTo !== "unassigned"
          ? data.reportedTo
          : null,
      content: data.content?.trim() || "",
    }

    onCreate(newTask)
    form.reset()
    onOpenChange(false)
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      {/* Title */}
      <div className="space-y-1.5">
        <Label htmlFor="create-task-title" className="text-xs font-semibold">
          {t("dialog.titleLabel")} <span className="text-destructive">*</span>
        </Label>
        <Input
          id="create-task-title"
          placeholder={t("dialog.titlePlaceholder")}
          {...form.register("title")}
          aria-invalid={!!form.formState.errors.title}
        />
        {form.formState.errors.title && (
          <p className="text-[11px] text-destructive">
            {form.formState.errors.title.message}
          </p>
        )}
      </div>

      {/* Project Selector */}
      <div className="space-y-1.5">
        <Label className="text-xs font-semibold flex items-center gap-1.5">
          <FolderKanban className="size-3.5 text-muted-foreground" />
          <span>{t("dialog.projectLabel")}</span>
        </Label>
        <Controller
          control={form.control}
          name="projectId"
          render={({ field }) => (
            <Select
              value={field.value || "none"}
              onValueChange={field.onChange}
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
          )}
        />
      </div>

      {/* Grid: Status, Priority, Label */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold">
            {t("dialog.statusLabel")}
          </Label>
          <Controller
            control={form.control}
            name="status"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={t("dialog.statusLabel")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="backlog">{t("status.backlog")}</SelectItem>
                  <SelectItem value="todo">{t("status.todo")}</SelectItem>
                  <SelectItem value="in progress">
                    {t("status.inProgress")}
                  </SelectItem>
                  <SelectItem value="done">{t("status.done")}</SelectItem>
                  <SelectItem value="canceled">
                    {t("status.canceled")}
                  </SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs font-semibold">
            {t("dialog.priorityLabel")}
          </Label>
          <Controller
            control={form.control}
            name="priority"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={t("dialog.priorityLabel")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">{t("priority.low")}</SelectItem>
                  <SelectItem value="medium">{t("priority.medium")}</SelectItem>
                  <SelectItem value="high">{t("priority.high")}</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs font-semibold">
            {t("dialog.labelLabel")}
          </Label>
          <Controller
            control={form.control}
            name="label"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={t("dialog.labelLabel")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bug">{t("labels.bug")}</SelectItem>
                  <SelectItem value="feature">{t("labels.feature")}</SelectItem>
                  <SelectItem value="documentation">
                    {t("labels.documentation")}
                  </SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>
      </div>

      {/* Grid: Assignee, Reporter */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold flex items-center gap-1.5">
            <UserCheck className="size-3.5 text-muted-foreground" />
            <span>{t("dialog.assignedToLabel")}</span>
          </Label>
          <Controller
            control={form.control}
            name="assignedTo"
            render={({ field }) => (
              <Select
                value={field.value || "unassigned"}
                onValueChange={field.onChange}
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
            )}
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs font-semibold flex items-center gap-1.5">
            <UserPlus className="size-3.5 text-muted-foreground" />
            <span>{t("dialog.reportedToLabel")}</span>
          </Label>
          <Controller
            control={form.control}
            name="reportedTo"
            render={({ field }) => (
              <Select
                value={field.value || "unassigned"}
                onValueChange={field.onChange}
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
            )}
          />
        </div>
      </div>

      {/* Content - Tiptap Editor */}
      <div className="space-y-1.5">
        <Label className="text-xs font-semibold flex items-center gap-1.5">
          <FileText className="size-3.5 text-muted-foreground" />
          <span>{t("dialog.contentLabel")}</span>
        </Label>
        <Controller
          control={form.control}
          name="content"
          render={({ field }) => (
            <div className="rounded-lg border bg-background overflow-hidden focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-1">
              <TiptapEditor
                value={field.value || ""}
                onChange={field.onChange}
                placeholder={t("dialog.contentPlaceholder")}
                minHeight="min-h-[200px]"
              />
            </div>
          )}
        />
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-2 pt-2 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={() => onOpenChange(false)}
        >
          {tCommon("cancel")}
        </Button>
        <Button type="submit">{t("dialog.create")}</Button>
      </div>
    </form>
  )
}

export function CreateTaskDialog({
  open,
  onOpenChange,
  onCreate,
}: CreateTaskDialogProps) {
  const t = useTranslations("tasks")

  return (
    <AppDialog
      open={open}
      onOpenChange={onOpenChange}
      title={t("dialog.createTitle")}
      description={t("dialog.createDescription")}
      size="3xl"
      scrollable
    >
      <CreateTaskForm
        key={open ? "open" : "closed"}
        onOpenChange={onOpenChange}
        onCreate={onCreate}
      />
    </AppDialog>
  )
}

/* ========================================================================= */
/* QUICK EDIT TASK DIALOG (Rapid Triage for Status, Priority, Assignee)      */
/* ========================================================================= */
interface QuickEditTaskDialogProps {
  task: Task | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpdate: (task: Task) => void
  onFullEdit?: (task: Task) => void
}

function QuickEditTaskForm({
  task,
  onOpenChange,
  onUpdate,
  onFullEdit,
}: {
  task: Task
  onOpenChange: (open: boolean) => void
  onUpdate: (task: Task) => void
  onFullEdit?: (task: Task) => void
}) {
  const t = useTranslations("tasks")
  const tCommon = useTranslations("common")

  const form = useForm<QuickEditTaskFormValues>({
    resolver: zodResolver(quickEditTaskSchema),
    defaultValues: {
      title: task.title,
      status: task.status,
      priority: task.priority,
      label: task.label,
      projectId: task.projectId || task.project || "none",
      assignedTo: task.assignedTo || "unassigned",
      reportedTo: task.reportedTo || "unassigned",
    },
  })

  const onSubmit = (data: QuickEditTaskFormValues) => {
    const finalProject =
      data.projectId && data.projectId !== "none" ? data.projectId : null
    onUpdate({
      ...task,
      title: data.title.trim(),
      status: data.status,
      priority: data.priority,
      label: data.label,
      projectId: finalProject,
      project: finalProject,
      assignedTo:
        data.assignedTo && data.assignedTo !== "unassigned"
          ? data.assignedTo
          : null,
      reportedTo:
        data.reportedTo && data.reportedTo !== "unassigned"
          ? data.reportedTo
          : null,
    })
    onOpenChange(false)
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      {/* Title */}
      <div className="space-y-1.5">
        <Label htmlFor="quick-task-title" className="text-xs font-semibold">
          {t("dialog.titleLabel")} <span className="text-destructive">*</span>
        </Label>
        <Input
          id="quick-task-title"
          placeholder={t("dialog.titlePlaceholder")}
          {...form.register("title")}
          aria-invalid={!!form.formState.errors.title}
        />
        {form.formState.errors.title && (
          <p className="text-[11px] text-destructive">
            {form.formState.errors.title.message}
          </p>
        )}
      </div>

      {/* Project Selector */}
      <div className="space-y-1.5">
        <Label className="text-xs font-semibold flex items-center gap-1.5">
          <FolderKanban className="size-3.5 text-muted-foreground" />
          <span>{t("dialog.projectLabel")}</span>
        </Label>
        <Controller
          control={form.control}
          name="projectId"
          render={({ field }) => (
            <Select
              value={field.value || "none"}
              onValueChange={field.onChange}
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
          )}
        />
      </div>

      {/* Grid: Status, Priority, Label */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold">
            {t("dialog.statusLabel")}
          </Label>
          <Controller
            control={form.control}
            name="status"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={t("dialog.statusLabel")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="backlog">{t("status.backlog")}</SelectItem>
                  <SelectItem value="todo">{t("status.todo")}</SelectItem>
                  <SelectItem value="in progress">
                    {t("status.inProgress")}
                  </SelectItem>
                  <SelectItem value="done">{t("status.done")}</SelectItem>
                  <SelectItem value="canceled">
                    {t("status.canceled")}
                  </SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs font-semibold">
            {t("dialog.priorityLabel")}
          </Label>
          <Controller
            control={form.control}
            name="priority"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={t("dialog.priorityLabel")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">{t("priority.low")}</SelectItem>
                  <SelectItem value="medium">{t("priority.medium")}</SelectItem>
                  <SelectItem value="high">{t("priority.high")}</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs font-semibold">
            {t("dialog.labelLabel")}
          </Label>
          <Controller
            control={form.control}
            name="label"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={t("dialog.labelLabel")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bug">{t("labels.bug")}</SelectItem>
                  <SelectItem value="feature">{t("labels.feature")}</SelectItem>
                  <SelectItem value="documentation">
                    {t("labels.documentation")}
                  </SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>
      </div>

      {/* Grid: Assignee, Reporter */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold flex items-center gap-1.5">
            <UserCheck className="size-3.5 text-muted-foreground" />
            <span>{t("dialog.assignedToLabel")}</span>
          </Label>
          <Controller
            control={form.control}
            name="assignedTo"
            render={({ field }) => (
              <Select
                value={field.value || "unassigned"}
                onValueChange={field.onChange}
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
            )}
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs font-semibold flex items-center gap-1.5">
            <UserPlus className="size-3.5 text-muted-foreground" />
            <span>{t("dialog.reportedToLabel")}</span>
          </Label>
          <Controller
            control={form.control}
            name="reportedTo"
            render={({ field }) => (
              <Select
                value={field.value || "unassigned"}
                onValueChange={field.onChange}
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
            )}
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-3 border-t">
        {onFullEdit ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              onOpenChange(false)
              onFullEdit(task)
            }}
            className="gap-1.5 cursor-pointer text-xs"
          >
            <Pencil className="size-3.5" />
            <span>{t("dialog.openFullEdit")}</span>
          </Button>
        ) : (
          <div />
        )}

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="cursor-pointer text-xs"
          >
            {tCommon("cancel")}
          </Button>
          <Button type="submit" size="sm" className="cursor-pointer text-xs">
            {t("dialog.save")}
          </Button>
        </div>
      </div>
    </form>
  )
}

export function QuickEditTaskDialog({
  task,
  open,
  onOpenChange,
  onUpdate,
  onFullEdit,
}: QuickEditTaskDialogProps) {
  const t = useTranslations("tasks")

  if (!task) return null

  return (
    <AppDialog
      open={open}
      onOpenChange={onOpenChange}
      size="xl"
      title={
        <div className="flex items-center gap-2">
          <div className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <SlidersHorizontal className="size-4" />
          </div>
          <span className="font-semibold text-base">
            {t("dialog.quickEditTitle")}
          </span>
        </div>
      }
      description={t("dialog.quickEditDescription")}
    >
      <QuickEditTaskForm
        key={task.id}
        task={task}
        onOpenChange={onOpenChange}
        onUpdate={onUpdate}
        onFullEdit={onFullEdit}
      />
    </AppDialog>
  )
}

/* ========================================================================= */
/* EDIT TASK DIALOG (Full Modal with Tiptap Editor & Project)                */
/* ========================================================================= */
interface EditTaskDialogProps {
  task: Task | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpdate: (task: Task) => void
  onQuickEdit?: (task: Task) => void
}

function EditTaskForm({
  task,
  onOpenChange,
  onUpdate,
  onQuickEdit,
}: {
  task: Task
  onOpenChange: (open: boolean) => void
  onUpdate: (task: Task) => void
  onQuickEdit?: (task: Task) => void
}) {
  const t = useTranslations("tasks")
  const tCommon = useTranslations("common")

  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      title: task.title,
      status: task.status,
      priority: task.priority,
      label: task.label,
      projectId: task.projectId || task.project || "none",
      assignedTo: task.assignedTo || "unassigned",
      reportedTo: task.reportedTo || "unassigned",
      content: task.content || "",
    },
  })

  const onSubmit = (data: TaskFormValues) => {
    const finalProject =
      data.projectId && data.projectId !== "none" ? data.projectId : null
    onUpdate({
      ...task,
      title: data.title.trim(),
      status: data.status,
      priority: data.priority,
      label: data.label,
      projectId: finalProject,
      project: finalProject,
      assignedTo:
        data.assignedTo && data.assignedTo !== "unassigned"
          ? data.assignedTo
          : null,
      reportedTo:
        data.reportedTo && data.reportedTo !== "unassigned"
          ? data.reportedTo
          : null,
      content: data.content?.trim() || "",
    })
    onOpenChange(false)
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      {/* Title */}
      <div className="space-y-1.5">
        <Label htmlFor="edit-task-title" className="text-xs font-semibold">
          {t("dialog.titleLabel")} <span className="text-destructive">*</span>
        </Label>
        <Input
          id="edit-task-title"
          placeholder={t("dialog.titlePlaceholder")}
          {...form.register("title")}
          aria-invalid={!!form.formState.errors.title}
        />
        {form.formState.errors.title && (
          <p className="text-[11px] text-destructive">
            {form.formState.errors.title.message}
          </p>
        )}
      </div>

      {/* Project Selector */}
      <div className="space-y-1.5">
        <Label className="text-xs font-semibold flex items-center gap-1.5">
          <FolderKanban className="size-3.5 text-muted-foreground" />
          <span>{t("dialog.projectLabel")}</span>
        </Label>
        <Controller
          control={form.control}
          name="projectId"
          render={({ field }) => (
            <Select
              value={field.value || "none"}
              onValueChange={field.onChange}
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
          )}
        />
      </div>

      {/* Grid: Status, Priority, Label */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold">
            {t("dialog.statusLabel")}
          </Label>
          <Controller
            control={form.control}
            name="status"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={t("dialog.statusLabel")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="backlog">{t("status.backlog")}</SelectItem>
                  <SelectItem value="todo">{t("status.todo")}</SelectItem>
                  <SelectItem value="in progress">
                    {t("status.inProgress")}
                  </SelectItem>
                  <SelectItem value="done">{t("status.done")}</SelectItem>
                  <SelectItem value="canceled">
                    {t("status.canceled")}
                  </SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs font-semibold">
            {t("dialog.priorityLabel")}
          </Label>
          <Controller
            control={form.control}
            name="priority"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={t("dialog.priorityLabel")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">{t("priority.low")}</SelectItem>
                  <SelectItem value="medium">{t("priority.medium")}</SelectItem>
                  <SelectItem value="high">{t("priority.high")}</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs font-semibold">
            {t("dialog.labelLabel")}
          </Label>
          <Controller
            control={form.control}
            name="label"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={t("dialog.labelLabel")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bug">{t("labels.bug")}</SelectItem>
                  <SelectItem value="feature">{t("labels.feature")}</SelectItem>
                  <SelectItem value="documentation">
                    {t("labels.documentation")}
                  </SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>
      </div>

      {/* Grid: Assignee, Reporter */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold flex items-center gap-1.5">
            <UserCheck className="size-3.5 text-muted-foreground" />
            <span>{t("dialog.assignedToLabel")}</span>
          </Label>
          <Controller
            control={form.control}
            name="assignedTo"
            render={({ field }) => (
              <Select
                value={field.value || "unassigned"}
                onValueChange={field.onChange}
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
            )}
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs font-semibold flex items-center gap-1.5">
            <UserPlus className="size-3.5 text-muted-foreground" />
            <span>{t("dialog.reportedToLabel")}</span>
          </Label>
          <Controller
            control={form.control}
            name="reportedTo"
            render={({ field }) => (
              <Select
                value={field.value || "unassigned"}
                onValueChange={field.onChange}
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
            )}
          />
        </div>
      </div>

      {/* Content - Tiptap Rich Text Editor */}
      <div className="space-y-1.5">
        <Label className="text-xs font-semibold flex items-center gap-1.5">
          <FileText className="size-3.5 text-muted-foreground" />
          <span>{t("dialog.contentLabel")}</span>
        </Label>
        <Controller
          control={form.control}
          name="content"
          render={({ field }) => (
            <div className="rounded-lg border bg-background overflow-hidden focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-1">
              <TiptapEditor
                value={field.value || ""}
                onChange={field.onChange}
                placeholder={t("dialog.contentPlaceholder")}
                minHeight="min-h-[220px]"
              />
            </div>
          )}
        />
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-3 border-t">
        {onQuickEdit ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              onOpenChange(false)
              onQuickEdit(task)
            }}
            className="gap-1.5 cursor-pointer text-xs"
          >
            <SlidersHorizontal className="size-3.5" />
            <span>{t("dialog.switchQuickEdit")}</span>
          </Button>
        ) : (
          <div />
        )}

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="cursor-pointer text-xs"
          >
            {tCommon("cancel")}
          </Button>
          <Button type="submit" size="sm" className="cursor-pointer text-xs">
            {t("dialog.save")}
          </Button>
        </div>
      </div>
    </form>
  )
}

export function EditTaskDialog({
  task,
  open,
  onOpenChange,
  onUpdate,
  onQuickEdit,
}: EditTaskDialogProps) {
  const t = useTranslations("tasks")

  return (
    <AppDialog
      open={open}
      onOpenChange={onOpenChange}
      title={
        <div className="flex items-center gap-2">
          <div className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Pencil className="size-4" />
          </div>
          <span className="font-semibold text-base">{t("dialog.editTitle")}</span>
        </div>
      }
      description={t("dialog.editDescription")}
      size="3xl"
      scrollable
    >
      {task && (
        <EditTaskForm
          key={task.id}
          task={task}
          onOpenChange={onOpenChange}
          onUpdate={onUpdate}
          onQuickEdit={onQuickEdit}
        />
      )}
    </AppDialog>
  )
}

/* ========================================================================= */
/* VIEW TASK SHEET (Details with Project, Assigned, Reported & Content)     */
/* ========================================================================= */
interface ViewTaskSheetProps {
  task: Task | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onQuickEdit: (task: Task) => void
  onEdit: (task: Task) => void
  onDelete: (task: Task) => void
}

export function ViewTaskSheet({
  task,
  open,
  onOpenChange,
  onQuickEdit,
  onEdit,
  onDelete,
}: ViewTaskSheetProps) {
  const t = useTranslations("tasks")
  const tCommon = useTranslations("common")

  if (!task) return null

  const assignedUser = getTaskUser(task.assignedTo)
  const reportedUser = getTaskUser(task.reportedTo)
  const project = getTaskProject(task.projectId || task.project)

  const assignedInitials = assignedUser
    ? `${assignedUser.firstName[0] || ""}${assignedUser.lastName[0] || ""}`.toUpperCase()
    : ""
  const reportedInitials = reportedUser
    ? `${reportedUser.firstName[0] || ""}${reportedUser.lastName[0] || ""}`.toUpperCase()
    : ""

  return (
    <AppSheet
      open={open}
      onOpenChange={onOpenChange}
      side="right"
      size="lg"
      title={task.title}
      description={task.id}
      footer={
        <div className="flex items-center justify-between w-full gap-2">
          <Button
            variant="destructive"
            size="sm"
            onClick={() => {
              onOpenChange(false)
              onDelete(task)
            }}
            className="gap-1.5 cursor-pointer text-xs"
          >
            <Trash2 className="size-3.5" />
            <span>{tCommon("delete")}</span>
          </Button>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                onOpenChange(false)
                onQuickEdit(task)
              }}
              className="gap-1.5 cursor-pointer text-xs"
            >
              <SlidersHorizontal className="size-3.5" />
              <span>{t("actions.quickEdit")}</span>
            </Button>

            <Button
              variant="default"
              size="sm"
              onClick={() => {
                onOpenChange(false)
                onEdit(task)
              }}
              className="gap-1.5 cursor-pointer text-xs"
            >
              <Pencil className="size-3.5" />
              <span>{t("actions.edit")}</span>
            </Button>
          </div>
        </div>
      }
    >
      <div className="flex flex-col gap-4 py-2">
        {/* Task Identifier & Status Grid */}
        <div className="p-3.5 rounded-lg border bg-muted/20 flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[11px] font-mono text-muted-foreground uppercase block">
              {t("fields.id")}
            </span>
            <span className="text-sm font-semibold">{task.id}</span>
          </div>

          {project && (
            <Badge variant="secondary" className="gap-1 text-xs">
              <FolderKanban className="size-3 text-primary" />
              <span>{project.title}</span>
            </Badge>
          )}
        </div>

        {/* Title */}
        <div className="space-y-1.5">
          <span className="text-xs font-medium text-muted-foreground">
            {t("fields.title")}
          </span>
          <p className="text-sm leading-relaxed text-foreground bg-card p-3 rounded-lg border font-medium">
            {task.title}
          </p>
        </div>

        {/* Status, Priority, Label Cards */}
        <div className="grid grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-lg border bg-card space-y-1.5">
            <span className="text-muted-foreground block">{t("fields.status")}</span>
            <div className="flex items-center gap-1.5 font-medium capitalize">
              {statusIcons[task.status]}
              <span>{task.status}</span>
            </div>
          </div>

          <div className="p-3 rounded-lg border bg-card space-y-1.5">
            <span className="text-muted-foreground block">{t("fields.priority")}</span>
            <div className="flex items-center gap-1.5 font-medium capitalize">
              {priorityIcons[task.priority]}
              <span>{task.priority}</span>
            </div>
          </div>

          <div className="p-3 rounded-lg border bg-card space-y-1.5">
            <span className="text-muted-foreground block">{t("fields.label")}</span>
            <Badge variant="outline" className="text-[10px] font-normal capitalize">
              {task.label}
            </Badge>
          </div>
        </div>

        {/* Project Card */}
        {project && (
          <div className="p-3 rounded-lg border bg-card space-y-1 text-xs">
            <span className="text-[11px] font-medium text-muted-foreground flex items-center gap-1">
              <FolderKanban className="size-3 text-primary" />
              <span>{t("fields.project")}</span>
            </span>
            <div className="flex items-center justify-between">
              <span className="font-semibold text-foreground">{project.title}</span>
              <span className="font-mono text-[11px] text-muted-foreground">{project.id}</span>
            </div>
          </div>
        )}

        {/* Assignee & Reporter Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          {/* Assignee */}
          <div className="p-3 rounded-lg border bg-card space-y-2">
            <span className="text-[11px] font-medium text-muted-foreground flex items-center gap-1">
              <UserCheck className="size-3" />
              <span>{t("dialog.assignedToLabel")}</span>
            </span>
            {assignedUser ? (
              <div className="flex items-center gap-2.5">
                <Avatar size="sm" className="size-7 text-[10px]">
                  {assignedUser.avatar && (
                    <AvatarImage
                      src={assignedUser.avatar}
                      alt={`${assignedUser.firstName} ${assignedUser.lastName}`}
                    />
                  )}
                  <AvatarFallback className="bg-primary/10 text-primary font-medium">
                    {assignedInitials}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <div className="font-semibold text-xs text-foreground truncate">
                    {assignedUser.firstName} {assignedUser.lastName}
                  </div>
                  <div className="text-[11px] text-muted-foreground truncate">
                    {assignedUser.email}
                  </div>
                </div>
              </div>
            ) : (
              <span className="text-xs text-muted-foreground italic">
                {t("fields.unassigned")}
              </span>
            )}
          </div>

          {/* Reporter */}
          <div className="p-3 rounded-lg border bg-card space-y-2">
            <span className="text-[11px] font-medium text-muted-foreground flex items-center gap-1">
              <UserPlus className="size-3" />
              <span>{t("dialog.reportedToLabel")}</span>
            </span>
            {reportedUser ? (
              <div className="flex items-center gap-2.5">
                <Avatar size="sm" className="size-7 text-[10px]">
                  {reportedUser.avatar && (
                    <AvatarImage
                      src={reportedUser.avatar}
                      alt={`${reportedUser.firstName} ${reportedUser.lastName}`}
                    />
                  )}
                  <AvatarFallback className="bg-muted text-muted-foreground font-medium">
                    {reportedInitials}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <div className="font-semibold text-xs text-foreground truncate">
                    {reportedUser.firstName} {reportedUser.lastName}
                  </div>
                  <div className="text-[11px] text-muted-foreground truncate">
                    {reportedUser.email}
                  </div>
                </div>
              </div>
            ) : (
              <span className="text-xs text-muted-foreground italic">-</span>
            )}
          </div>
        </div>

        {/* Task Content / Description (Tiptap formatted content) */}
        <div className="space-y-1.5">
          <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
            <FileText className="size-3.5" />
            <span>{t("fields.content")}</span>
          </span>
          {task.content ? (
            <div
              className="prose prose-sm dark:prose-invert max-w-none text-xs sm:text-sm leading-relaxed p-4 rounded-lg border bg-card/60 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_blockquote]:border-l-3 [&_blockquote]:border-primary/50 [&_blockquote]:pl-3 [&_blockquote]:italic [&_code]:bg-muted [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded text-foreground"
              dangerouslySetInnerHTML={{ __html: task.content }}
            />
          ) : (
            <p className="text-xs text-muted-foreground italic p-3 rounded-lg border border-dashed">
              {t("dialog.noContent")}
            </p>
          )}
        </div>
      </div>
    </AppSheet>
  )
}

/* ========================================================================= */
/* DELETE TASK DIALOG                                                        */
/* ========================================================================= */
interface DeleteTaskDialogProps {
  task: Task | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (taskId: string) => void
}

export function DeleteTaskDialog({
  task,
  open,
  onOpenChange,
  onConfirm,
}: DeleteTaskDialogProps) {
  const t = useTranslations("tasks")
  const tCommon = useTranslations("common")

  if (!task) return null

  return (
    <AppDialog
      open={open}
      onOpenChange={onOpenChange}
      title={t("dialog.deleteTitle")}
      description={t("dialog.deleteDescription")}
      size="sm"
      footer={
        <div className="flex items-center justify-end gap-2 w-full">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            {tCommon("cancel")}
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={() => {
              onConfirm(task.id)
              onOpenChange(false)
            }}
          >
            {tCommon("delete")}
          </Button>
        </div>
      }
    >
      <div className="rounded-lg border p-3 bg-destructive/5 text-xs text-foreground my-2 space-y-1">
        <div className="font-semibold text-sm">{task.title}</div>
        <p className="text-muted-foreground font-mono">{task.id}</p>
      </div>
    </AppDialog>
  )
}
