import { tasksData } from "./data/tasks"
import { TasksTable } from "./components/tasks-table"

export function TasksFeature() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Tasks</h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
          Here&apos;s a list of your tasks for this month! Manage backlog items and monitor completion.
        </p>
      </div>

      <TasksTable initialData={tasksData} />
    </div>
  )
}
