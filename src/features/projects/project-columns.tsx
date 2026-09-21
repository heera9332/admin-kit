"use client";

import type { ColumnDef } from "@tanstack/react-table";
import {
  Copy,
  Eye,
  FolderKanban,
  MoreHorizontal,
  Pencil,
  Tag,
  Trash2,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";
import { StatusBadge } from "@/components/status-badge";
import { DataTableColumnHeader } from "@/components/shared/data-table/data-table-column-header";
import type { Project } from "./types";

interface GetProjectColumnsOptions {
  onView: (project: Project) => void;
  onEdit: (project: Project) => void;
  onDelete: (project: Project) => void;
  t?: (key: string) => string;
}

export function getProjectColumns({
  onView,
  onEdit,
  onDelete,
  t = (key) => key,
}: GetProjectColumnsOptions): ColumnDef<Project>[] {
  return [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          indeterminate={table.getIsSomePageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
          className="translate-y-[2px]"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="translate-y-[2px]"
        />
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
        const project = row.original;
        return (
          <div className="flex items-start gap-2.5 max-w-[320px]">
            <div className="size-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
              <FolderKanban className="size-4" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-xs truncate">
                  {project.title}
                </span>
                <span className="text-[10px] font-mono text-muted-foreground shrink-0">
                  {project.id}
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground truncate mt-0.5">
                {project.description}
              </p>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "category",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("fields.category")} />
      ),
      cell: ({ row }) => {
        const category = row.getValue<string>("category");
        return (
          <Badge variant="outline" className="text-[10px] font-normal gap-1">
            <Tag className="size-2.5" />
            <span>{t(`categories.${category}`)}</span>
          </Badge>
        );
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      },
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("fields.status")} />
      ),
      cell: ({ row }) => {
        const status = row.getValue<Project["status"]>("status");
        return (
          <StatusBadge status={status} size="sm" dot>
            {t(`statuses.${status}`)}
          </StatusBadge>
        );
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      },
    },
    {
      accessorKey: "progress",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("fields.progress")} />
      ),
      cell: ({ row }) => {
        const progress = row.getValue<number | undefined>("progress");
        if (progress === undefined) {
          return <span className="text-xs text-muted-foreground">—</span>;
        }
        return (
          <div className="w-[120px] space-y-1">
            <div className="flex items-center justify-between text-[10px] text-muted-foreground font-mono">
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="h-1.5" />
          </div>
        );
      },
    },
    {
      accessorKey: "dueDate",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("fields.dueDate")} />
      ),
      cell: ({ row }) => {
        const dueDate = row.getValue<string | undefined>("dueDate");
        return (
          <span className="text-xs text-muted-foreground">
            {dueDate ?? "—"}
          </span>
        );
      },
    },
    {
      id: "actions",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Actions" />
      ),
      cell: ({ row }) => {
        const project = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-8 ml-auto"
                />
              }
            >
              <MoreHorizontal className="size-4" />
              <span className="sr-only">Open menu</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="text-xs w-36">
              <DropdownMenuLabel className="text-xs font-semibold">{t("fields.actions")}</DropdownMenuLabel>
              {onView && (
                <DropdownMenuItem
                  onClick={() => onView(project)}
                  className="justify-between gap-2 cursor-pointer"
                >
                  <span>{t("view")}</span>
                  <Eye className="size-3.5" />
                </DropdownMenuItem>
              )}
              {onEdit && (
                <DropdownMenuItem
                  onClick={() => onEdit(project)}
                  className="justify-between gap-2 cursor-pointer"
                >
                  <span>{t("edit")}</span>
                  <Pencil className="size-3.5" />
                </DropdownMenuItem>
              )}
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(project.id)}
                className="justify-between gap-2 cursor-pointer"
              >
                <span>{t("copyId")}</span>
                <Copy className="size-3.5" />
              </DropdownMenuItem>
              {onDelete && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => onDelete(project)}
                    className="justify-between gap-2 text-destructive focus:text-destructive cursor-pointer"
                  >
                    <span>{t("delete")}</span>
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
