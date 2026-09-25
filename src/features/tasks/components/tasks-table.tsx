"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
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
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/shared/data-table";
import {
  CreateTaskDialog,
  EditTaskDialog,
  ViewTaskSheet,
  DeleteTaskDialog,
} from "./tasks-dialogs";
import { getTaskColumns } from "../task-columns";
import type { Task } from "../data/tasks";

interface TasksTableProps {
  initialData: Task[];
}

export function TasksTable({ initialData }: TasksTableProps) {
  const t = useTranslations("tasks");

  const [data, setData] = React.useState<Task[]>(initialData);
  const [createOpen, setCreateOpen] = React.useState(false);
  const [selectedTask, setSelectedTask] = React.useState<Task | null>(null);
  const [editingTask, setEditingTask] = React.useState<Task | null>(null);
  const [deletingTask, setDeletingTask] = React.useState<Task | null>(null);

  const handleCreate = (newTask: Task) => {
    setData((prev) => [newTask, ...prev]);
  };

  const handleUpdate = (updatedTask: Task) => {
    setData((prev) =>
      prev.map((t) => (t.id === updatedTask.id ? updatedTask : t))
    );
    if (selectedTask?.id === updatedTask.id) {
      setSelectedTask(updatedTask);
    }
  };

  const handleDelete = (id: string) => {
    setData((prev) => prev.filter((t) => t.id !== id));
    if (selectedTask?.id === id) {
      setSelectedTask(null);
    }
  };

  const columns = React.useMemo(
    () =>
      getTaskColumns({
        onView: (task) => setSelectedTask(task),
        onEdit: (task) => setEditingTask(task),
        onDelete: (task) => setDeletingTask(task),
        t,
      }),
    [t]
  );

  return (
    <div className="space-y-4">
      <DataTable
        data={data}
        columns={columns}
        search={{
          column: "title",
          placeholder: t("searchPlaceholder"),
        }}
        filters={[
          {
            column: "status",
            title: t("status.title"),
            options: [
              { label: t("status.backlog"), value: "backlog", icon: HelpCircle },
              { label: t("status.todo"), value: "todo", icon: Circle },
              { label: t("status.inProgress"), value: "in progress", icon: Clock },
              { label: t("status.done"), value: "done", icon: CheckCircle2 },
              { label: t("status.canceled"), value: "canceled", icon: XCircle },
            ],
          },
          {
            column: "priority",
            title: t("priority.title"),
            options: [
              { label: t("priority.low"), value: "low", icon: ArrowDown },
              { label: t("priority.medium"), value: "medium", icon: ArrowRight },
              { label: t("priority.high"), value: "high", icon: ArrowUp },
            ],
          },
        ]}
        sorting
        pagination={{
          pageSize: 10,
          pageSizeOptions: [10, 20, 30, 40, 50],
        }}
        onRowClick={(task) => setSelectedTask(task)}
        toolbarActions={
          <Button
            size="sm"
            className="h-8 text-xs gap-1.5"
            onClick={() => setCreateOpen(true)}
          >
            <Plus className="size-3.5" />
            <span>{t("createTask")}</span>
          </Button>
        }
      />

      <CreateTaskDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onCreate={handleCreate}
      />

      <EditTaskDialog
        task={editingTask}
        open={!!editingTask}
        onOpenChange={(open) => !open && setEditingTask(null)}
        onUpdate={handleUpdate}
      />

      <ViewTaskSheet
        task={selectedTask}
        open={!!selectedTask}
        onOpenChange={(open) => !open && setSelectedTask(null)}
        onEdit={(task) => setEditingTask(task)}
        onDelete={(task) => setDeletingTask(task)}
      />

      <DeleteTaskDialog
        task={deletingTask}
        open={!!deletingTask}
        onOpenChange={(open) => !open && setDeletingTask(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
