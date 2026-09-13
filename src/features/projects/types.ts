export type ProjectStatus = "planning" | "in_progress" | "completed" | "on_hold"

export type ProjectCategory = "web" | "mobile" | "design" | "marketing" | "devops"

export interface Project {
  id: string
  title: string
  description: string
  status: ProjectStatus
  category: ProjectCategory
  progress?: number
  dueDate?: string
  createdAt?: string
}

export interface ProjectFormValues {
  title: string
  description: string
  status: ProjectStatus
  category: ProjectCategory
  dueDate?: string
}
