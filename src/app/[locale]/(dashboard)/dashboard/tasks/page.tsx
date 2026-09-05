import type { Metadata } from "next"
import { TasksFeature } from "@/features/tasks"

export const metadata: Metadata = {
  title: "Tasks",
  description: "Task management and issue tracking board",
}

export default function TasksPage() {
  return <TasksFeature />
}
