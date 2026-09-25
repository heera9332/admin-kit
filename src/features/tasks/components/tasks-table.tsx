"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  CheckCircle2,
  ChevronDown,
  Circle,
  Clock,
  HelpCircle,
  Plus,
  XCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DataTable, DataTableFloatingBar } from "@/components/shared/data-table";
import { toast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";
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

  const handleBulkStatusChange = (
    taskIds: string[],
    newStatus: Task["status"]
  ) => {
    setData((prev) =>
      prev.map((t) => (taskIds.includes(t.id) ? { ...t, status: newStatus } : t))
    );
    if (selectedTask && taskIds.includes(selectedTask.id)) {
      setSelectedTask((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
  };

  const taskStatuses: {
    value: Task["status"];
    labelKey: string;
    icon: React.ComponentType<{ className?: string }>;
    color: string;
  }[] = [
    { value: "backlog", labelKey: "status.backlog", icon: HelpCircle, color: "text-muted-foreground" },
    { value: "todo", labelKey: "status.todo", icon: Circle, color: "text-muted-foreground" },
    { value: "in progress", labelKey: "status.inProgress", icon: Clock, color: "text-amber-500" },
    { value: "done", labelKey: "status.done", icon: CheckCircle2, color: "text-emerald-500" },
    { value: "canceled", labelKey: "status.canceled", icon: XCircle, color: "text-red-500" },
  ];

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
        floatingBar={(table) => (
          <DataTableFloatingBar table={table} entityName="task">
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 gap-1.5 rounded-full text-xs font-medium cursor-pointer shadow-xs"
                  >
                    <CheckCircle2 className="size-3.5 text-primary" />
                    <span>{t("bulk.changeStatus")}</span>
                    <ChevronDown className="size-3.5 opacity-60" />
                  </Button>
                }
              />
              <DropdownMenuContent align="center" side="top" className="text-xs w-44 mb-2">
                <DropdownMenuLabel className="text-[11px] text-muted-foreground uppercase tracking-wider font-semibold">
                  {t("bulk.changeStatus")}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {taskStatuses.map((st) => {
                  const Icon = st.icon
                  return (
                    <DropdownMenuItem
                      key={st.value}
                      onClick={() => {
                        const selectedRows = table.getFilteredSelectedRowModel().rows
                        const ids = selectedRows.map((r) => r.original.id)
                        if (ids.length === 0) return

                        handleBulkStatusChange(ids, st.value)
                        table.resetRowSelection()

                        toast.add({
                          title: t("bulk.statusUpdated", { count: ids.length }),
                          description: `${ids.length} task(s) updated to "${t(st.labelKey)}"`,
                        })
                      }}
                      className="gap-2 cursor-pointer"
                    >
                      <Icon className={cn("size-3.5", st.color)} />
                      <span>{t(st.labelKey)}</span>
                    </DropdownMenuItem>
                  )
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          </DataTableFloatingBar>
        )}
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
