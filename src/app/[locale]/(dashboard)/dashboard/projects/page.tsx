import type { Metadata } from "next"
import { ProjectsFeature } from "@/features/projects"

export const metadata: Metadata = {
  title: "Projects",
  description: "Project management, tracking, and collaboration dashboard",
}

export default function ProjectsPage() {
  return <ProjectsFeature />
}
