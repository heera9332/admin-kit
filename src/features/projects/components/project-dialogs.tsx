"use client"

import * as React from "react"
import { useTranslations } from "next-intl"
import {
  Calendar,
  Clock,
  FolderKanban,
  Pencil,
  Trash2,
  Tag,
  Activity,
} from "lucide-react"

import { AppDialog } from "@/components/app-dialog"
import { AppSheet } from "@/components/app-sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { StatusBadge } from "@/components/status-badge"
import type { Project, ProjectCategory, ProjectStatus } from "../types"

interface CreateProjectDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreate: (project: Omit<Project, "id" | "createdAt" | "progress">) => void
}

export function CreateProjectDialog({
  open,
  onOpenChange,
  onCreate,
}: CreateProjectDialogProps) {
  const t = useTranslations("projects")
  const tCommon = useTranslations("common")

  const [title, setTitle] = React.useState("")
  const [description, setDescription] = React.useState("")
  const [status, setStatus] = React.useState<ProjectStatus>("planning")
  const [category, setCategory] = React.useState<ProjectCategory>("web")
  const [dueDate, setDueDate] = React.useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    onCreate({
      title: title.trim(),
      description: description.trim(),
      status,
      category,
      dueDate: dueDate || undefined,
    })

    setTitle("")
    setDescription("")
    setStatus("planning")
    setCategory("web")
    setDueDate("")
    onOpenChange(false)
  }

  return (
    <AppDialog
      open={open}
      onOpenChange={onOpenChange}
      title={t("dialogs.createTitle")}
      description={t("dialogs.createDescription")}
      size="lg"
      onSubmit={handleSubmit}
      footer={
        <div className="flex items-center justify-end gap-2 w-full">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            {tCommon("cancel")}
          </Button>
          <Button type="submit" disabled={!title.trim()}>
            {t("dialogs.create")}
          </Button>
        </div>
      }
    >
      <div className="grid gap-4 py-1">
        <div className="space-y-1.5">
          <Label htmlFor="project-title">{t("fields.title")} *</Label>
          <Input
            id="project-title"
            placeholder={t("fields.titlePlaceholder")}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="project-category">{t("fields.category")} *</Label>
            <Select
              value={category}
              onValueChange={(val) => setCategory(val as ProjectCategory)}
            >
              <SelectTrigger id="project-category" className="w-full">
                <SelectValue placeholder={t("fields.selectCategory")} />
              </SelectTrigger>
              <SelectContent className="w-full">
                <SelectItem value="web">{t("categories.web")}</SelectItem>
                <SelectItem value="mobile">{t("categories.mobile")}</SelectItem>
                <SelectItem value="design">{t("categories.design")}</SelectItem>
                <SelectItem value="marketing">{t("categories.marketing")}</SelectItem>
                <SelectItem value="devops">{t("categories.devops")}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="project-status">{t("fields.status")} *</Label>
            <Select
              value={status}
              onValueChange={(val) => setStatus(val as ProjectStatus)}
            >
              <SelectTrigger id="project-status" className="w-full">
                <SelectValue placeholder={t("fields.selectStatus")} />
              </SelectTrigger>
              <SelectContent className="w-full">
                <SelectItem value="planning">{t("statuses.planning")}</SelectItem>
                <SelectItem value="in_progress">{t("statuses.in_progress")}</SelectItem>
                <SelectItem value="completed">{t("statuses.completed")}</SelectItem>
                <SelectItem value="on_hold">{t("statuses.on_hold")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="project-duedate">{t("fields.dueDate")}</Label>
          <Input
            id="project-duedate"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="project-description">{t("fields.description")}</Label>
          <Textarea
            id="project-description"
            rows={3}
            placeholder={t("fields.descriptionPlaceholder")}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full"
          />
        </div>
      </div>
    </AppDialog>
  )
}

interface EditProjectDialogProps {
  project: Project | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpdate: (project: Project) => void
}

function EditProjectForm({
  project,
  onOpenChange,
  onUpdate,
}: {
  project: Project
  onOpenChange: (open: boolean) => void
  onUpdate: (project: Project) => void
}) {
  const t = useTranslations("projects")
  const tCommon = useTranslations("common")

  const [title, setTitle] = React.useState(project.title)
  const [description, setDescription] = React.useState(project.description)
  const [status, setStatus] = React.useState<ProjectStatus>(project.status)
  const [category, setCategory] = React.useState<ProjectCategory>(project.category)
  const [dueDate, setDueDate] = React.useState(project.dueDate ?? "")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    onUpdate({
      ...project,
      title: title.trim(),
      description: description.trim(),
      status,
      category,
      dueDate: dueDate || undefined,
    })

    onOpenChange(false)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="grid gap-4 py-1">
        <div className="space-y-1.5">
          <Label htmlFor="edit-project-title">{t("fields.title")} *</Label>
          <Input
            id="edit-project-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="edit-project-category">{t("fields.category")} *</Label>
            <Select
              value={category}
              onValueChange={(val) => setCategory(val as ProjectCategory)}
            >
              <SelectTrigger id="edit-project-category" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="w-full">
                <SelectItem value="web">{t("categories.web")}</SelectItem>
                <SelectItem value="mobile">{t("categories.mobile")}</SelectItem>
                <SelectItem value="design">{t("categories.design")}</SelectItem>
                <SelectItem value="marketing">{t("categories.marketing")}</SelectItem>
                <SelectItem value="devops">{t("categories.devops")}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="edit-project-status">{t("fields.status")} *</Label>
            <Select
              value={status}
              onValueChange={(val) => setStatus(val as ProjectStatus)}
            >
              <SelectTrigger id="edit-project-status" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="w-full">
                <SelectItem value="planning">{t("statuses.planning")}</SelectItem>
                <SelectItem value="in_progress">{t("statuses.in_progress")}</SelectItem>
                <SelectItem value="completed">{t("statuses.completed")}</SelectItem>
                <SelectItem value="on_hold">{t("statuses.on_hold")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="edit-project-duedate">{t("fields.dueDate")}</Label>
          <Input
            id="edit-project-duedate"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="edit-project-description">{t("fields.description")}</Label>
          <Textarea
            id="edit-project-description"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full"
          />
        </div>
      </div>

      <div className="flex items-center justify-end gap-2 w-full">
        <Button
          type="button"
          variant="outline"
          onClick={() => onOpenChange(false)}
        >
          {tCommon("cancel")}
        </Button>
        <Button type="submit" disabled={!title.trim()}>
          {t("dialogs.save")}
        </Button>
      </div>
    </form>
  )
}

export function EditProjectDialog({
  project,
  open,
  onOpenChange,
  onUpdate,
}: EditProjectDialogProps) {
  const t = useTranslations("projects")

  return (
    <AppDialog
      open={open}
      onOpenChange={onOpenChange}
      title={t("dialogs.editTitle")}
      description={t("dialogs.editDescription")}
      size="lg"
    >
      {project && (
        <EditProjectForm
          key={project.id}
          project={project}
          onOpenChange={onOpenChange}
          onUpdate={onUpdate}
        />
      )}
    </AppDialog>
  )
}

interface ViewProjectSheetProps {
  project: Project | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onEdit: (project: Project) => void
  onDelete: (project: Project) => void
}

export function ViewProjectSheet({
  project,
  open,
  onOpenChange,
  onEdit,
  onDelete,
}: ViewProjectSheetProps) {
  const t = useTranslations("projects")

  if (!project) return null

  return (
    <AppSheet
      open={open}
      onOpenChange={onOpenChange}
      side="right"
      size="md"
      title={project.title}
      description={`${project.id} • ${t(`categories.${project.category}`)}`}
      footer={
        <div className="flex items-center justify-between w-full gap-2">
          <Button
            variant="destructive"
            size="sm"
            onClick={() => {
              onOpenChange(false)
              onDelete(project)
            }}
            className="gap-1.5"
          >
            <Trash2 className="size-3.5" />
            <span>{t("dialogs.confirmDelete")}</span>
          </Button>

          <Button
            variant="default"
            size="sm"
            onClick={() => {
              onOpenChange(false)
              onEdit(project)
            }}
            className="gap-1.5"
          >
            <Pencil className="size-3.5" />
            <span>{t("editProject")}</span>
          </Button>
        </div>
      }
    >
      <div className="flex flex-col gap-5">
        <div className="flex items-center justify-between gap-3 p-3.5 rounded-lg border bg-muted/20">
          <div>
            <span className="text-[11px] font-mono text-muted-foreground uppercase block">
              {t("fields.id")}
            </span>
            <span className="text-sm font-semibold">{project.id}</span>
          </div>
          <StatusBadge status={project.status} size="sm" dot>
            {t(`statuses.${project.status}`)}
          </StatusBadge>
        </div>

        <div className="space-y-2">
          <span className="text-xs font-medium text-muted-foreground mb-2">
            {t("fields.description")}
          </span>
          <p className="text-sm leading-relaxed text-foreground/90 bg-card p-3 rounded-lg border">
            {project.description || "No description provided."}
          </p>
        </div>

        {project.progress !== undefined && (
          <div className="space-y-2 p-3.5 rounded-lg border bg-card">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium flex items-center gap-1.5 text-muted-foreground">
                <Activity className="size-3.5 text-primary" />
                <span>{t("fields.progress")}</span>
              </span>
              <span className="font-mono font-bold">{project.progress}%</span>
            </div>
            <Progress value={project.progress} className="h-2" />
          </div>
        )}

        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded-lg border bg-card space-y-1">
            <span className="text-muted-foreground flex items-center gap-1">
              <Tag className="size-3" />
              <span>{t("fields.category")}</span>
            </span>
            <span className="font-medium text-foreground block">
              {t(`categories.${project.category}`)}
            </span>
          </div>

          <div className="p-3 rounded-lg border bg-card space-y-1">
            <span className="text-muted-foreground flex items-center gap-1">
              <Calendar className="size-3" />
              <span>{t("fields.dueDate")}</span>
            </span>
            <span className="font-medium text-foreground block">
              {project.dueDate ?? "Not set"}
            </span>
          </div>
        </div>

        {project.createdAt && (
          <div className="text-[11px] text-muted-foreground flex items-center gap-1.5 px-1">
            <Clock className="size-3" />
            <span>
              {t("fields.createdAt")}: {project.createdAt}
            </span>
          </div>
        )}
      </div>
    </AppSheet>
  )
}

interface DeleteProjectDialogProps {
  project: Project | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (projectId: string) => void
}

export function DeleteProjectDialog({
  project,
  open,
  onOpenChange,
  onConfirm,
}: DeleteProjectDialogProps) {
  const t = useTranslations("projects")
  const tCommon = useTranslations("common")

  if (!project) return null

  return (
    <AppDialog
      open={open}
      onOpenChange={onOpenChange}
      title={t("dialogs.deleteTitle")}
      description={t("dialogs.deleteDescription")}
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
              onConfirm(project.id)
              onOpenChange(false)
            }}
          >
            {t("dialogs.confirmDelete")}
          </Button>
        </div>
      }
    >
      <div className="rounded-lg border p-3 bg-destructive/5 text-xs text-foreground my-2 space-y-1">
        <div className="font-semibold text-sm flex items-center gap-2">
          <FolderKanban className="size-4 text-destructive" />
          <span>{project.title}</span>
        </div>
        <p className="text-muted-foreground font-mono">{project.id}</p>
      </div>
    </AppDialog>
  )
}
