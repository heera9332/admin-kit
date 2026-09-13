"use client"

import * as React from "react"
import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  CheckCircle2,
  Circle,
  Clock,
  HelpCircle,
  Plus,
  XCircle,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/shared/data-table"
import { CreateTaskDialog } from "./tasks-dialogs"
import { getTaskColumns } from "../task-columns"
import type { Task } from "../data/tasks"

interface TasksTableProps {
  initialData: Task[]
}

export function TasksTable({ initialData }: TasksTableProps) {
  const [data, setData] = React.useState<Task[]>(initialData)
  const [createOpen, setCreateOpen] = React.useState(false)

  const handleCreate = (newTask: Task) => {
    setData((prev) => [newTask, ...prev])
  }

  const handleDelete = (id: string) => {
    setData((prev) => prev.filter((t) => t.id !== id))
  }

  const columns = React.useMemo(
    () => getTaskColumns({ onDelete: handleDelete }),
    []
  )

  return (
    <div className="space-y-4">
      <DataTable
        data={data}
        columns={columns}
        search={{
          column: "title",
          placeholder: "Filter tasks...",
        }}
        filters={[
          {
            column: "status",
            title: "Status",
            options: [
              { label: "Backlog", value: "backlog", icon: HelpCircle },
              { label: "Todo", value: "todo", icon: Circle },
              { label: "In Progress", value: "in progress", icon: Clock },
              { label: "Done", value: "done", icon: CheckCircle2 },
              { label: "Canceled", value: "canceled", icon: XCircle },
            ],
          },
          {
            column: "priority",
            title: "Priority",
            options: [
              { label: "Low", value: "low", icon: ArrowDown },
              { label: "Medium", value: "medium", icon: ArrowRight },
              { label: "High", value: "high", icon: ArrowUp },
            ],
          },
        ]}
        sorting
        pagination={{
          pageSize: 10,
          pageSizeOptions: [10, 20, 30, 40, 50],
        }}
        toolbarActions={
          <Button
            size="sm"
            className="h-8 text-xs gap-1.5"
            onClick={() => setCreateOpen(true)}
          >
            <Plus className="size-3.5" />
            <span>Create Task</span>
          </Button>
        }
      />

      <CreateTaskDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onCreate={handleCreate}
      />
    </div>
  )
}
