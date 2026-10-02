"use client"

import * as React from "react"
import { useTranslations } from "next-intl"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Pencil, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { AppDialog } from "@/components/app-dialog"
import { AppSheet } from "@/components/app-sheet"
import { Badge } from "@/components/ui/badge"
import { DynamicForm } from "@/components/forms"
import type { FormFieldsConfig } from "@/types/form"
import type { Task } from "../data/tasks"
import { statusIcons, priorityIcons } from "../task-columns"

const taskFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  status: z.enum(["backlog", "todo", "in progress", "done", "canceled"] as const),
  priority: z.enum(["low", "medium", "high"] as const),
  label: z.enum(["bug", "feature", "documentation"] as const),
})

type TaskFormValues = z.infer<typeof taskFormSchema>

function getTaskFormFields(
  t: (key: string) => string
): FormFieldsConfig<TaskFormValues> {
  return [
    {
      name: "title",
      type: "text",
      label: t("dialog.titleLabel"),
      placeholder: t("dialog.titlePlaceholder"),
      required: true,
      colSpan: 3,
    },
    {
      name: "status",
      type: "select",
      label: t("dialog.statusLabel"),
      required: true,
      colSpan: 1,
      options: [
        { value: "backlog", label: t("status.backlog") },
        { value: "todo", label: t("status.todo") },
        { value: "in progress", label: t("status.inProgress") },
        { value: "done", label: t("status.done") },
        { value: "canceled", label: t("status.canceled") },
      ],
    },
    {
      name: "priority",
      type: "select",
      label: t("dialog.priorityLabel"),
      required: true,
      colSpan: 1,
      options: [
        { value: "low", label: t("priority.low") },
        { value: "medium", label: t("priority.medium") },
        { value: "high", label: t("priority.high") },
      ],
    },
    {
      name: "label",
      type: "select",
      label: t("dialog.labelLabel"),
      required: true,
      colSpan: 1,
      options: [
        { value: "bug", label: t("labels.bug") },
        { value: "feature", label: t("labels.feature") },
        { value: "documentation", label: t("labels.documentation") },
      ],
    },
  ]
}

interface CreateTaskDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreate: (task: Task) => void
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
    },
  })

  const fields = React.useMemo(() => getTaskFormFields(t), [t])

  const onSubmit = (data: TaskFormValues) => {
    const newTask: Task = {
      id: `TASK-${Math.floor(1000 + Math.random() * 9000)}`,
      title: data.title.trim(),
      status: data.status,
      priority: data.priority,
      label: data.label,
    }

    onCreate(newTask)
    form.reset()
    onOpenChange(false)
  }

  return (
    <DynamicForm<TaskFormValues>
      form={form}
      fields={fields}
      onSubmit={onSubmit}
      submitLabel={t("dialog.create")}
      columns={3}
      secondaryAction={
        <Button
          type="button"
          variant="outline"
          onClick={() => onOpenChange(false)}
        >
          {tCommon("cancel")}
        </Button>
      }
    />
  )
}

export function CreateTaskDialog({ open, onOpenChange, onCreate }: CreateTaskDialogProps) {
  const t = useTranslations("tasks")

  return (
    <AppDialog
      open={open}
      onOpenChange={onOpenChange}
      title={t("dialog.createTitle")}
      description={t("dialog.createDescription")}
      size="md"
    >
      <CreateTaskForm
        key={open ? "open" : "closed"}
        onOpenChange={onOpenChange}
        onCreate={onCreate}
      />
    </AppDialog>
  )
}

interface EditTaskDialogProps {
  task: Task | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpdate: (task: Task) => void
}

function EditTaskForm({
  task,
  onOpenChange,
  onUpdate,
}: {
  task: Task
  onOpenChange: (open: boolean) => void
  onUpdate: (task: Task) => void
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
    },
  })

  const fields = React.useMemo(() => getTaskFormFields(t), [t])

  const onSubmit = (data: TaskFormValues) => {
    onUpdate({
      ...task,
      title: data.title.trim(),
      status: data.status,
      priority: data.priority,
      label: data.label,
    })
    onOpenChange(false)
  }

  return (
    <DynamicForm<TaskFormValues>
      form={form}
      fields={fields}
      onSubmit={onSubmit}
      submitLabel={t("dialog.save")}
      columns={3}
      secondaryAction={
        <Button
          type="button"
          variant="outline"
          onClick={() => onOpenChange(false)}
        >
          {tCommon("cancel")}
        </Button>
      }
    />
  )
}

export function EditTaskDialog({ task, open, onOpenChange, onUpdate }: EditTaskDialogProps) {
  const t = useTranslations("tasks")

  return (
    <AppDialog
      open={open}
      onOpenChange={onOpenChange}
      title={t("dialog.editTitle")}
      description={t("dialog.editDescription")}
      size="md"
    >
      {task && (
        <EditTaskForm
          key={task.id}
          task={task}
          onOpenChange={onOpenChange}
          onUpdate={onUpdate}
        />
      )}
    </AppDialog>
  )
}

interface ViewTaskSheetProps {
  task: Task | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onEdit: (task: Task) => void
  onDelete: (task: Task) => void
}

export function ViewTaskSheet({ task, open, onOpenChange, onEdit, onDelete }: ViewTaskSheetProps) {
  const t = useTranslations("tasks")
  const tCommon = useTranslations("common")

  if (!task) return null

  return (
    <AppSheet
      open={open}
      onOpenChange={onOpenChange}
      side="right"
      size="md"
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
            className="gap-1.5"
          >
            <Trash2 className="size-3.5" />
            <span>{tCommon("delete")}</span>
          </Button>

          <Button
            variant="default"
            size="sm"
            onClick={() => {
              onOpenChange(false)
              onEdit(task)
            }}
            className="gap-1.5"
          >
            <Pencil className="size-3.5" />
            <span>{tCommon("edit")}</span>
          </Button>
        </div>
      }
    >
      <div className="flex flex-col gap-4 py-2">
        <div className="p-3.5 rounded-lg border bg-muted/20 space-y-1">
          <span className="text-[11px] font-mono text-muted-foreground uppercase block">
            {t("fields.id")}
          </span>
          <span className="text-sm font-semibold">{task.id}</span>
        </div>

        <div className="space-y-1.5">
          <span className="text-xs font-medium text-muted-foreground">
            {t("fields.title")}
          </span>
          <p className="text-sm leading-relaxed text-foreground bg-card p-3 rounded-lg border">
            {task.title}
          </p>
        </div>

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
      </div>
    </AppSheet>
  )
}

interface DeleteTaskDialogProps {
  task: Task | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (taskId: string) => void
}

export function DeleteTaskDialog({ task, open, onOpenChange, onConfirm }: DeleteTaskDialogProps) {
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
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
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
