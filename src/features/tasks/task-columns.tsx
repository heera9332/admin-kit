"use client";

import * as React from "react";
import type { ColumnDef } from "@tanstack/react-table";
import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  CheckCircle2,
  Circle,
  Clock,
  Eye,
  FolderKanban,
  HelpCircle,
  MoreHorizontal,
  Pencil,
  SlidersHorizontal,
  Trash2,
  XCircle,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { StatusBadge } from "@/components/status-badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DataTableColumnHeader } from "@/components/shared/data-table/data-table-column-header";
import { type Task, getTaskUser, getTaskProject } from "./data/tasks";

export const statusIcons: Record<Task["status"], React.ReactNode> = {
  backlog: <HelpCircle className="size-3.5 text-muted-foreground" />,
  todo: <Circle className="size-3.5 text-muted-foreground" />,
  "in progress": <Clock className="size-3.5 text-amber-500" />,
  done: <CheckCircle2 className="size-3.5 text-emerald-500" />,
  canceled: <XCircle className="size-3.5 text-red-500" />,
};

export const priorityIcons: Record<Task["priority"], React.ReactNode> = {
  low: <ArrowDown className="size-3.5 text-muted-foreground" />,
  medium: <ArrowRight className="size-3.5 text-blue-500" />,
  high: <ArrowUp className="size-3.5 text-red-500" />,
};

export interface GetTaskColumnsOptions {
  onView?: (task: Task) => void;
  onQuickEdit?: (task: Task) => void;
  onEdit?: (task: Task) => void;
  onDelete?: (task: Task) => void;
  t?: (key: string) => string;
}

export function getTaskColumns({
  onView,
  onQuickEdit,
  onEdit,
  onDelete,
  t = (key) => key,
}: GetTaskColumnsOptions = {}): ColumnDef<Task>[] {
  const getStatusLabel = (status: Task["status"]) => {
    switch (status) {
      case "backlog":
        return t("status.backlog");
      case "todo":
        return t("status.todo");
      case "in progress":
        return t("status.inProgress");
      case "done":
        return t("status.done");
      case "canceled":
        return t("status.canceled");
      default:
        return status;
    }
  };

  const getPriorityLabel = (priority: Task["priority"]) => {
    switch (priority) {
      case "low":
        return t("priority.low");
      case "medium":
        return t("priority.medium");
      case "high":
        return t("priority.high");
      default:
        return priority;
    }
  };

  const getLabelText = (label: Task["label"]) => {
    switch (label) {
      case "bug":
        return t("labels.bug");
      case "feature":
        return t("labels.feature");
      case "documentation":
        return t("labels.documentation");
      default:
        return label;
    }
  };

  return [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          indeterminate={table.getIsSomePageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
          className="translate-y-0.5"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="translate-y-0.5"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "id",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("fields.id")} />
      ),
      cell: ({ row }) => (
        <span className="w-20 font-mono text-xs font-medium">
          {row.getValue("id")}
        </span>
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "title",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("fields.title")} />
      ),
      cell: ({ row }) => {
        const task = row.original;
        const label = task.label;
        return (
          <div className="space-y-1 py-1">
            <div className="flex items-center space-x-2">
              <Badge
                variant="outline"
                className="text-[10px] font-normal capitalize"
              >
                {getLabelText(label)}
              </Badge>
              <span className="max-w-100 truncate font-medium text-xs sm:text-sm">
                {row.getValue("title")}
              </span>
            </div>
            {/* Quick Action Links on row */}
            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground opacity-80 hover:opacity-100 transition-opacity">
              {onEdit && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(task);
                  }}
                  className="hover:text-primary transition-colors cursor-pointer"
                >
                  {t("actions.edit")}
                </button>
              )}
              {onEdit && onQuickEdit && <span>•</span>}
              {onQuickEdit && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onQuickEdit(task);
                  }}
                  className="hover:text-primary transition-colors cursor-pointer"
                >
                  {t("actions.quickEdit")}
                </button>
              )}
              {((onEdit || onQuickEdit) && onView) && <span>•</span>}
              {onView && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onView(task);
                  }}
                  className="hover:text-foreground transition-colors cursor-pointer"
                >
                  {t("actions.view")}
                </button>
              )}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "projectId",
      id: "project",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("fields.project")} />
      ),
      cell: ({ row }) => {
        const projectId = row.original.projectId || row.original.project;
        const project = getTaskProject(projectId);
        if (!project) {
          return <span className="text-xs text-muted-foreground italic">-</span>;
        }
        return (
          <div className="flex items-center gap-1.5 max-w-40" title={`${project.title} (${project.id})`}>
            <FolderKanban className="size-3.5 text-primary/70 shrink-0" />
            <span className="truncate text-xs font-medium text-foreground">
              {project.title}
            </span>
          </div>
        );
      },
      filterFn: (row, id, value) => {
        const val = row.original.projectId || row.original.project;
        return val ? value.includes(val) : false;
      },
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("fields.status")} />
      ),
      cell: ({ row }) => {
        const status = row.original.status;
        return (
          <StatusBadge status={status} size="default" dot>
            {getStatusLabel(status)}
          </StatusBadge>
        );
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      },
    },
    {
      accessorKey: "priority",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("fields.priority")} />
      ),
      cell: ({ row }) => {
        const priority = row.original.priority;
        return (
          <div className="flex items-center gap-1.5 text-xs capitalize text-muted-foreground">
            {priorityIcons[priority]}
            <span>{getPriorityLabel(priority)}</span>
          </div>
        );
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      },
    },
    {
      accessorKey: "assignedTo",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("fields.assignedTo")} />
      ),
      cell: ({ row }) => {
        const userId = row.original.assignedTo;
        const user = getTaskUser(userId);
        if (!user) {
          return (
            <span className="text-xs text-muted-foreground italic">
              {t("fields.unassigned")}
            </span>
          );
        }
        const initials = `${user.firstName[0] || ""}${user.lastName[0] || ""}`.toUpperCase();
        return (
          <div className="flex items-center gap-2" title={user.email}>
            <Avatar size="sm" className="size-6 text-[10px]">
              {user.avatar && (
                <AvatarImage src={user.avatar} alt={`${user.firstName} ${user.lastName}`} />
              )}
              <AvatarFallback className="bg-primary/10 text-primary text-[10px] font-medium">
                {initials}
              </AvatarFallback>
            </Avatar>
            <span className="max-w-28 truncate text-xs font-medium text-foreground">
              {user.firstName} {user.lastName}
            </span>
          </div>
        );
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      },
    },
    {
      accessorKey: "reportedTo",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("fields.reportedTo")} />
      ),
      cell: ({ row }) => {
        const userId = row.original.reportedTo;
        const user = getTaskUser(userId);
        if (!user) {
          return <span className="text-xs text-muted-foreground">-</span>;
        }
        const initials = `${user.firstName[0] || ""}${user.lastName[0] || ""}`.toUpperCase();
        return (
          <div className="flex items-center gap-2" title={user.email}>
            <Avatar size="sm" className="size-6 text-[10px]">
              {user.avatar && (
                <AvatarImage src={user.avatar} alt={`${user.firstName} ${user.lastName}`} />
              )}
              <AvatarFallback className="bg-muted text-muted-foreground text-[10px] font-medium">
                {initials}
              </AvatarFallback>
            </Avatar>
            <span className="max-w-28 truncate text-xs text-muted-foreground">
              {user.firstName} {user.lastName}
            </span>
          </div>
        );
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      },
    },
    {
      id: "actions",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("fields.actions")} />
      ),
      cell: ({ row }) => {
        const task = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-8 ml-auto cursor-pointer"
                />
              }
            >
              <MoreHorizontal className="size-4" />
              <span className="sr-only">Open menu</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="text-xs w-40">
              <DropdownMenuLabel className="text-xs font-semibold">
                {t("fields.actions")}
              </DropdownMenuLabel>
              {onView && (
                <DropdownMenuItem
                  onClick={() => onView(task)}
                  className="justify-between gap-2 cursor-pointer"
                >
                  <span>{t("actions.view")}</span>
                  <Eye className="size-3.5 text-muted-foreground" />
                </DropdownMenuItem>
              )}
              {onQuickEdit && (
                <DropdownMenuItem
                  onClick={() => onQuickEdit(task)}
                  className="justify-between gap-2 cursor-pointer"
                >
                  <span>{t("actions.quickEdit")}</span>
                  <SlidersHorizontal className="size-3.5 text-muted-foreground" />
                </DropdownMenuItem>
              )}
              {onEdit && (
                <DropdownMenuItem
                  onClick={() => onEdit(task)}
                  className="justify-between gap-2 cursor-pointer"
                >
                  <span>{t("actions.edit")}</span>
                  <Pencil className="size-3.5 text-muted-foreground" />
                </DropdownMenuItem>
              )}
              {onDelete && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => onDelete(task)}
                    className="justify-between gap-2 text-destructive focus:text-destructive cursor-pointer"
                  >
                    <span>{t("actions.delete")}</span>
                    <Trash2 className="size-3.5" />
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
}
