"use client"

import * as React from "react"
import { useTranslations } from "next-intl"

import { initialProjects } from "./data/projects-data"
import type { Project } from "./types"
import { ProjectsTable } from "./components/projects-table"
import {
  CreateProjectDialog,
  EditProjectDialog,
  ViewProjectSheet,
  DeleteProjectDialog,
} from "./components/project-dialogs"

export function ProjectsFeature() {
  const t = useTranslations("projects")

  const [projects, setProjects] = React.useState<Project[]>(initialProjects)
  const [selectedProject, setSelectedProject] = React.useState<Project | null>(null)
  const [editingProject, setEditingProject] = React.useState<Project | null>(null)
  const [deletingProject, setDeletingProject] = React.useState<Project | null>(null)
  const [isCreateOpen, setIsCreateOpen] = React.useState(false)

  const handleCreate = (
    newProjectData: Omit<Project, "id" | "createdAt" | "progress">
  ) => {
    const newProject: Project = {
      ...newProjectData,
      id: `PRJ-${Math.floor(1000 + Math.random() * 9000)}`,
      progress: 0,
      createdAt: new Date().toISOString().split("T")[0],
    }

    setProjects((prev) => [newProject, ...prev])
  }

  const handleUpdate = (updatedProject: Project) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === updatedProject.id ? updatedProject : p))
    )

    if (selectedProject?.id === updatedProject.id) {
      setSelectedProject(updatedProject)
    }
  }

  const handleDelete = (projectId: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== projectId))

    if (selectedProject?.id === projectId) {
      setSelectedProject(null)
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
          {t("title")}
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
          {t("description")}
        </p>
      </div>

      <ProjectsTable
        projects={projects}
        onView={(project) => setSelectedProject(project)}
        onEdit={(project) => setEditingProject(project)}
        onDelete={(project) => setDeletingProject(project)}
        onOpenCreate={() => setIsCreateOpen(true)}
      />

      <CreateProjectDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        onCreate={handleCreate}
      />

      <EditProjectDialog
        project={editingProject}
        open={!!editingProject}
        onOpenChange={(open) => !open && setEditingProject(null)}
        onUpdate={handleUpdate}
      />

      <ViewProjectSheet
        project={selectedProject}
        open={!!selectedProject}
        onOpenChange={(open) => !open && setSelectedProject(null)}
        onEdit={(project) => setEditingProject(project)}
        onDelete={(project) => setDeletingProject(project)}
      />

      <DeleteProjectDialog
        project={deletingProject}
        open={!!deletingProject}
        onOpenChange={(open) => !open && setDeletingProject(null)}
        onConfirm={handleDelete}
      />
    </div>
  )
}
