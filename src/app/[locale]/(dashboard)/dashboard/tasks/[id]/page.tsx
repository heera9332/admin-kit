import type { Metadata } from "next"
import { TaskEditFeature } from "@/features/tasks/task-edit-feature"

interface TaskEditPageProps {
  params: Promise<{
    locale: string
    id: string
  }>
}

export async function generateMetadata({
  params,
}: TaskEditPageProps): Promise<Metadata> {
  const { id } = await params
  const isNew = id === "new"
  return {
    title: isNew ? "Create Task | Tasks" : `Edit ${id} | Tasks`,
    description: isNew
      ? "Create a new task specification with rich description"
      : "Full task editor with Tiptap rich content and assignments",
  }
}

export default async function TaskEditPage({ params }: TaskEditPageProps) {
  const { id } = await params
  return <TaskEditFeature taskId={id} />
}
