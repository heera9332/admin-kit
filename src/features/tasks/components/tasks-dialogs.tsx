"use client"

import * as React from "react"
import { useTranslations } from "next-intl"
import { Pencil, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { AppDialog } from "@/components/app-dialog"
import { AppSheet } from "@/components/app-sheet"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { Task } from "../data/tasks"
import { statusIcons, priorityIcons } from "../task-columns"

interface CreateTaskDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreate: (task: Task) => void
}

export function CreateTaskDialog({ open, onOpenChange, onCreate }: CreateTaskDialogProps) {
  const t = useTranslations("tasks")
  const tCommon = useTranslations("common")

  const [title, setTitle] = React.useState("")
  const [status, setStatus] = React.useState<Task["status"]>("todo")
  const [priority, setPriority] = React.useState<Task["priority"]>("medium")
  const [label, setLabel] = React.useState<Task["label"]>("feature")

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!title.trim()) return

    const newTask: Task = {
      id: `TASK-${Math.floor(1000 + Math.random() * 9000)}`,
      title: title.trim(),
      status,
      priority,
      label,
    }

    onCreate(newTask)
    setTitle("")
    setStatus("todo")
    setPriority("medium")
    setLabel("feature")
    onOpenChange(false)
  }

  return (
    <AppDialog
      open={open}
      onOpenChange={onOpenChange}
      title={t("dialog.createTitle")}
      description={t("dialog.createDescription")}
      onSubmit={handleSubmit}
      size="md"
      footer={
        <div className="flex items-center justify-end gap-2 w-full">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            {tCommon("cancel")}
          </Button>
          <Button type="submit">{t("dialog.create")}</Button>
        </div>
      }
    >
      <div className="grid gap-4 py-2">
        <div className="space-y-1.5">
          <Label htmlFor="title">{t("dialog.titleLabel")}</Label>
          <Input
            id="title"
            placeholder={t("dialog.titlePlaceholder")}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="status">{t("dialog.statusLabel")}</Label>
            <Select
              value={status}
              onValueChange={(val) => {
                if (val) setStatus(val as Task["status"])
              }}
            >
              <SelectTrigger id="status" className="h-8 text-xs w-full">
                <SelectValue placeholder={t("dialog.statusLabel")} />
              </SelectTrigger>
              <SelectContent className="w-full">
                <SelectItem value="backlog">{t("status.backlog")}</SelectItem>
                <SelectItem value="todo">{t("status.todo")}</SelectItem>
                <SelectItem value="in progress">{t("status.inProgress")}</SelectItem>
                <SelectItem value="done">{t("status.done")}</SelectItem>
                <SelectItem value="canceled">{t("status.canceled")}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="priority">{t("dialog.priorityLabel")}</Label>
            <Select
              value={priority}
              onValueChange={(val) => {
                if (val) setPriority(val as Task["priority"])
              }}
            >
              <SelectTrigger id="priority" className="h-8 text-xs w-full">
                <SelectValue placeholder={t("dialog.priorityLabel")} />
              </SelectTrigger>
              <SelectContent className="w-full">
                <SelectItem value="low">{t("priority.low")}</SelectItem>
                <SelectItem value="medium">{t("priority.medium")}</SelectItem>
                <SelectItem value="high">{t("priority.high")}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="label">{t("dialog.labelLabel")}</Label>
            <Select
              value={label}
              onValueChange={(val) => {
                if (val) setLabel(val as Task["label"])
              }}
            >
              <SelectTrigger id="label" className="h-8 text-xs w-full">
                <SelectValue placeholder={t("dialog.labelLabel")} />
              </SelectTrigger>
              <SelectContent className="w-full">
                <SelectItem value="bug">{t("labels.bug")}</SelectItem>
                <SelectItem value="feature">{t("labels.feature")}</SelectItem>
                <SelectItem value="documentation">{t("labels.documentation")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </AppDialog>
  )
}

interface EditTaskFormProps {
  task: Task
  onOpenChange: (open: boolean) => void
  onUpdate: (task: Task) => void
}

function EditTaskForm({ task, onOpenChange, onUpdate }: EditTaskFormProps) {
  const t = useTranslations("tasks")
  const tCommon = useTranslations("common")

  const [title, setTitle] = React.useState(task.title)
  const [status, setStatus] = React.useState<Task["status"]>(task.status)
  const [priority, setPriority] = React.useState<Task["priority"]>(task.priority)
  const [label, setLabel] = React.useState<Task["label"]>(task.label)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!title.trim()) return

    onUpdate({
      ...task,
      title: title.trim(),
      status,
      priority,
      label,
    })
    onOpenChange(false)
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-4 py-2">
        <div className="space-y-1.5">
          <Label htmlFor="edit-task-title">{t("dialog.titleLabel")}</Label>
          <Input
            id="edit-task-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="edit-task-status">{t("dialog.statusLabel")}</Label>
            <Select
              value={status}
              onValueChange={(val) => {
                if (val) setStatus(val as Task["status"])
              }}
            >
              <SelectTrigger id="edit-task-status" className="h-8 text-xs w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="w-full">
                <SelectItem value="backlog">{t("status.backlog")}</SelectItem>
                <SelectItem value="todo">{t("status.todo")}</SelectItem>
                <SelectItem value="in progress">{t("status.inProgress")}</SelectItem>
                <SelectItem value="done">{t("status.done")}</SelectItem>
                <SelectItem value="canceled">{t("status.canceled")}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="edit-task-priority">{t("dialog.priorityLabel")}</Label>
            <Select
              value={priority}
              onValueChange={(val) => {
                if (val) setPriority(val as Task["priority"])
              }}
            >
              <SelectTrigger id="edit-task-priority" className="h-8 text-xs w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="w-full">
                <SelectItem value="low">{t("priority.low")}</SelectItem>
                <SelectItem value="medium">{t("priority.medium")}</SelectItem>
                <SelectItem value="high">{t("priority.high")}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="edit-task-label">{t("dialog.labelLabel")}</Label>
            <Select
              value={label}
              onValueChange={(val) => {
                if (val) setLabel(val as Task["label"])
              }}
            >
              <SelectTrigger id="edit-task-label" className="h-8 text-xs w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="w-full">
                <SelectItem value="bug">{t("labels.bug")}</SelectItem>
                <SelectItem value="feature">{t("labels.feature")}</SelectItem>
                <SelectItem value="documentation">{t("labels.documentation")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-2 pt-4 border-t mt-4">
        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
          {tCommon("cancel")}
        </Button>
        <Button type="submit">{t("dialog.save")}</Button>
      </div>
    </form>
  )
}

interface EditTaskDialogProps {
  task: Task | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpdate: (task: Task) => void
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
