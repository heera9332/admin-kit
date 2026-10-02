"use client"

import * as React from "react"
import { useTranslations } from "next-intl"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { format } from "date-fns"
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
import { Progress } from "@/components/ui/progress"
import { StatusBadge } from "@/components/status-badge"
import { DynamicForm } from "@/components/forms"
import type { FormFieldsConfig } from "@/types/form"
import type { Project, ProjectFormValues } from "../types"

const projectFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  category: z.enum(["web", "mobile", "design", "marketing", "devops"] as const),
  status: z.enum(["planning", "in_progress", "completed", "on_hold"] as const),
  dueDate: z.union([z.string(), z.date()]).optional(),
  description: z.string().optional(),
})

function getProjectFormFields(
  t: (key: string) => string
): FormFieldsConfig<ProjectFormValues> {
  return [
    {
      name: "title",
      type: "text",
      label: t("fields.title"),
      placeholder: t("fields.titlePlaceholder"),
      required: true,
      colSpan: 2,
    },
    {
      name: "category",
      type: "select",
      label: t("fields.category"),
      required: true,
      colSpan: 1,
      options: [
        { value: "web", label: t("categories.web") },
        { value: "mobile", label: t("categories.mobile") },
        { value: "design", label: t("categories.design") },
        { value: "marketing", label: t("categories.marketing") },
        { value: "devops", label: t("categories.devops") },
      ],
    },
    {
      name: "status",
      type: "select",
      label: t("fields.status"),
      required: true,
      colSpan: 1,
      options: [
        { value: "planning", label: t("statuses.planning") },
        { value: "in_progress", label: t("statuses.in_progress") },
        { value: "completed", label: t("statuses.completed") },
        { value: "on_hold", label: t("statuses.on_hold") },
      ],
    },
    {
      name: "dueDate",
      type: "date",
      label: t("fields.dueDate"),
      placeholder: t("fields.dueDate"),
      colSpan: 2,
    },
    {
      name: "description",
      type: "richtext",
      label: t("fields.description"),
      placeholder: t("fields.descriptionPlaceholder"),
      minHeight: "min-h-[160px]",
      colSpan: 2,
    },
  ]
}

interface CreateProjectDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreate: (project: Omit<Project, "id" | "createdAt" | "progress">) => void
}

function CreateProjectForm({
  onOpenChange,
  onCreate,
}: {
  onOpenChange: (open: boolean) => void
  onCreate: (project: Omit<Project, "id" | "createdAt" | "progress">) => void
}) {
  const t = useTranslations("projects")
  const tCommon = useTranslations("common")

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      title: "",
      category: "web",
      status: "planning",
      dueDate: "",
      description: "",
    },
  })

  const fields = React.useMemo(() => getProjectFormFields(t), [t])

  const onSubmit = (data: ProjectFormValues) => {
    const formattedDueDate =
      data.dueDate instanceof Date
        ? format(data.dueDate, "yyyy-MM-dd")
        : data.dueDate
          ? String(data.dueDate)
          : undefined

    onCreate({
      title: data.title.trim(),
      description: (data.description || "").trim(),
      status: data.status,
      category: data.category,
      dueDate: formattedDueDate,
    })

    form.reset()
    onOpenChange(false)
  }

  return (
    <DynamicForm<ProjectFormValues>
      form={form}
      fields={fields}
      onSubmit={onSubmit}
      submitLabel={t("dialogs.create")}
      columns={2}
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

export function CreateProjectDialog({
  open,
  onOpenChange,
  onCreate,
}: CreateProjectDialogProps) {
  const t = useTranslations("projects")

  return (
    <AppDialog
      open={open}
      onOpenChange={onOpenChange}
      title={t("dialogs.createTitle")}
      description={t("dialogs.createDescription")}
      size="xl"
      scrollable
    >
      <CreateProjectForm
        key={open ? "open" : "closed"}
        onOpenChange={onOpenChange}
        onCreate={onCreate}
      />
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

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      title: project.title,
      category: project.category,
      status: project.status,
      dueDate: project.dueDate ? new Date(project.dueDate) : "",
      description: project.description || "",
    },
  })

  const fields = React.useMemo(() => getProjectFormFields(t), [t])

  const onSubmit = (data: ProjectFormValues) => {
    const formattedDueDate =
      data.dueDate instanceof Date
        ? format(data.dueDate, "yyyy-MM-dd")
        : data.dueDate
          ? String(data.dueDate)
          : undefined

    onUpdate({
      ...project,
      title: data.title.trim(),
      description: (data.description || "").trim(),
      status: data.status,
      category: data.category,
      dueDate: formattedDueDate,
    })

    onOpenChange(false)
  }

  return (
    <DynamicForm<ProjectFormValues>
      form={form}
      fields={fields}
      onSubmit={onSubmit}
      submitLabel={t("dialogs.save")}
      columns={2}
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
      size="xl"
      scrollable
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
            <span>{t("delete")}</span>
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
            <span>{t("edit")}</span>
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
          <StatusBadge status={project.status} size="default" dot>
            {t(`statuses.${project.status}`)}
          </StatusBadge>
        </div>

        <div className="space-y-2">
          <span className="text-xs font-medium text-muted-foreground mb-2">
            {t("fields.description")}
          </span>
          {project.description ? (
            <div
              className="text-sm leading-relaxed text-foreground/90 bg-card p-3 rounded-lg border max-w-none text-xs [&_p]:my-1.5 [&_ul]:list-disc [&_ul]:pl-4 [&_ol]:list-decimal [&_ol]:pl-4 [&_h1]:text-lg [&_h1]:font-bold [&_h2]:text-base [&_h2]:font-semibold [&_h3]:text-sm [&_h3]:font-medium [&_blockquote]:border-l-2 [&_blockquote]:pl-2 [&_blockquote]:italic"
              dangerouslySetInnerHTML={{ __html: project.description }}
            />
          ) : (
            <p className="text-sm leading-relaxed text-muted-foreground bg-card p-3 rounded-lg border italic">
              No description provided.
            </p>
          )}
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
