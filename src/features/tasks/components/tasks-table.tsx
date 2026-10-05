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
  Sparkles,
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
import { usersDataList } from "@/data/users";
import { projects } from "@/data/projects";
import { useTasks } from "@/context/tasks-provider";
import { useRouter } from "@/i18n/routing";
import {
  CreateTaskDialog,
  QuickEditTaskDialog,
  ViewTaskSheet,
  DeleteTaskDialog,
} from "./tasks-dialogs";
import { getTaskColumns } from "../task-columns";
import type { Task } from "../data/tasks";

interface TasksTableProps {
  initialData?: Task[];
}

export function TasksTable({ initialData }: TasksTableProps) {
  const t = useTranslations("tasks");
  const router = useRouter();
  const { tasks, updateTask, createTask, deleteTask, bulkUpdateStatus } = useTasks();

  const data = tasks && tasks.length > 0 ? tasks : (initialData || []);

  const [createOpen, setCreateOpen] = React.useState(false);
  const [selectedTask, setSelectedTask] = React.useState<Task | null>(null);
  const [quickEditingTask, setQuickEditingTask] = React.useState<Task | null>(null);
  const [deletingTask, setDeletingTask] = React.useState<Task | null>(null);

  const handleCreate = (newTask: Task) => {
    createTask(newTask);
    toast.add({
      title: t("dialog.createTitle"),
      description: `Task "${newTask.id}" created successfully.`,
    });
  };

  const handleUpdate = (updatedTask: Task) => {
    updateTask(updatedTask.id, updatedTask);
    if (selectedTask?.id === updatedTask.id) {
      setSelectedTask(updatedTask);
    }
    toast.add({
      title: t("dialog.editTitle"),
      description: `Task "${updatedTask.id}" updated successfully.`,
    });
  };

  const handleDelete = (id: string) => {
    deleteTask(id);
    if (selectedTask?.id === id) {
      setSelectedTask(null);
    }
    toast.add({
      title: t("actions.delete"),
      description: `Task "${id}" deleted successfully.`,
    });
  };

  const handleFullEdit = React.useCallback(
    (task: Task) => {
      router.push(`/dashboard/tasks/${task.id}`);
    },
    [router]
  );

  const handleFullCreate = React.useCallback(() => {
    router.push("/dashboard/tasks/new");
  }, [router]);

  const handleBulkStatusChange = (
    taskIds: string[],
    newStatus: Task["status"]
  ) => {
    bulkUpdateStatus(taskIds, newStatus);
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
        onQuickEdit: (task) => setQuickEditingTask(task),
        onEdit: (task) => handleFullEdit(task),
        onDelete: (task) => setDeletingTask(task),
        t,
      }),
    [handleFullEdit, t]
  );

  return (
    <div className="space-y-4 min-w-0 w-full">
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
          {
            column: "project",
            title: t("fields.project"),
            options: projects.map((p) => ({
              label: p.title,
              value: p.id,
            })),
          },
          {
            column: "assignedTo",
            title: t("fields.assignedTo"),
            options: usersDataList.map((u) => ({
              label: `${u.firstName} ${u.lastName}`,
              value: u.id,
            })),
          },
          {
            column: "reportedTo",
            title: t("fields.reportedTo"),
            options: usersDataList.map((u) => ({
              label: `${u.firstName} ${u.lastName}`,
              value: u.id,
            })),
          },
        ]}
        sorting
        pagination={{
          pageSize: 10,
          pageSizeOptions: [10, 20, 30, 40, 50],
        }}
        onRowClick={(task) => setSelectedTask(task)}
        toolbarActions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs gap-1.5 cursor-pointer"
              onClick={() => setCreateOpen(true)}
            >
              <Sparkles className="size-3.5" />
              <span>Quick Add</span>
            </Button>

            <Button
              size="sm"
              className="h-8 text-xs gap-1.5 cursor-pointer shadow-xs"
              onClick={handleFullCreate}
            >
              <Plus className="size-3.5" />
              <span>{t("createTask")}</span>
            </Button>
          </div>
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

      <QuickEditTaskDialog
        task={quickEditingTask}
        open={!!quickEditingTask}
        onOpenChange={(open) => !open && setQuickEditingTask(null)}
        onUpdate={handleUpdate}
        onFullEdit={handleFullEdit}
      />

      <ViewTaskSheet
        task={selectedTask}
        open={!!selectedTask}
        onOpenChange={(open) => !open && setSelectedTask(null)}
        onQuickEdit={(task) => setQuickEditingTask(task)}
        onEdit={handleFullEdit}
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
