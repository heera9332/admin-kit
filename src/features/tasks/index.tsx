"use client"

import { useTranslations } from "next-intl"
import { tasksData } from "./data/tasks"
import { TasksTable } from "./components/tasks-table"

export function TasksFeature() {
  const t = useTranslations("tasks")

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

      <TasksTable initialData={tasksData} />
    </div>
  )
}
