"use client";

import * as React from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { formatDistanceToNow } from "date-fns";
import {
  Pin,
  MoreHorizontal,
  Pencil,
  Trash2,
  Copy,
  Archive,
  ArchiveRestore,
  Eye,
  SlidersHorizontal,
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DataTableColumnHeader } from "@/components/shared/data-table/data-table-column-header";
import {
  type Note,
  type NoteLabel,
  NOTE_COLORS,
  getLabelColorClasses,
  getPriorityMeta,
} from "@/data/notes";
import { cn } from "@/lib/utils";

export interface GetNotesColumnsOptions {
  labels: NoteLabel[];
  onView: (note: Note) => void;
  onQuickEdit?: (note: Note) => void;
  onFullEdit?: (note: Note) => void;
  onEdit?: (note: Note) => void;
  onDelete: (note: Note) => void;
  onTogglePin: (id: string) => void;
  onToggleArchive: (id: string) => void;
  onDuplicate: (id: string) => void;
  t?: (key: string, values?: Record<string, any>) => string;
}

export function getNotesColumns({
  labels,
  onView,
  onQuickEdit,
  onFullEdit,
  onEdit,
  onDelete,
  onTogglePin,
  onToggleArchive,
  onDuplicate,
  t,
}: GetNotesColumnsOptions): ColumnDef<Note>[] {
  return [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          indeterminate={table.getIsSomePageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label={t ? t("table.selectAll") : "Select all"}
          className="translate-y-0.5"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label={t ? t("table.selectRow") : "Select row"}
          className="translate-y-0.5"
          onClick={(e) => e.stopPropagation()}
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "pinned",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t ? t("table.pin") : "Pin"}
        />
      ),
      cell: ({ row }) => {
        const isPinned = row.getValue("pinned") as boolean;
        const note = row.original;
        return (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              onTogglePin(note.id);
            }}
            className="size-7 text-muted-foreground hover:text-foreground"
          >
            <Pin
              className={cn(
                "size-3.5",
                isPinned ? "rotate-45 fill-primary text-primary" : "opacity-40"
              )}
            />
            <span className="sr-only">
              {t ? t("table.togglePin") : "Toggle Pin"}
            </span>
          </Button>
        );
      },
      enableSorting: true,
    },
    {
      accessorKey: "title",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t ? t("table.titleAndContent") : "Title & Content"}
        />
      ),
      cell: ({ row }) => {
        const note = row.original;
        const colorConfig = NOTE_COLORS.find((c) => c.id === note.color);
        const colorName = t ? t(`colors.${note.color}`) : (colorConfig?.name || "Default");
        return (
          <div className="flex items-start gap-2.5 max-w-[380px]">
            <span
              className={cn(
                "size-2.5 rounded-full shrink-0 mt-1.5",
                colorConfig?.bgDot || "bg-muted-foreground"
              )}
              title={colorName}
            />
            <div className="min-w-0">
              <div className="font-semibold text-xs text-foreground truncate">
                {note.title}
              </div>
              <div className="text-[11px] text-muted-foreground line-clamp-1 mt-0.5">
                {note.content}
              </div>
            </div>
          </div>
        );
      },
      enableSorting: true,
    },
    {
      accessorKey: "labelIds",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t ? t("table.labels") : "Labels"}
        />
      ),
      cell: ({ row }) => {
        const labelIds = row.getValue("labelIds") as string[];
        const noteLabels = (labelIds || [])
          .map((id) => labels.find((l) => l.id === id))
          .filter((l): l is NoteLabel => Boolean(l));

        if (noteLabels.length === 0) {
          return <span className="text-[11px] text-muted-foreground">-</span>;
        }

        return (
          <div className="flex flex-wrap items-center gap-1 max-w-[220px]">
            {noteLabels.slice(0, 3).map((lbl) => {
              const { badgeClass } = getLabelColorClasses(lbl.color);
              return (
                <span
                  key={lbl.id}
                  className={cn(
                    "inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium border",
                    badgeClass
                  )}
                >
                  #{lbl.name}
                </span>
              );
            })}
            {noteLabels.length > 3 && (
              <span className="text-[10px] text-muted-foreground font-mono">
                +{noteLabels.length - 3}
              </span>
            )}
          </div>
        );
      },
      enableSorting: false,
    },
    {
      accessorKey: "priority",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t ? t("table.priority") : "Priority"}
        />
      ),
      cell: ({ row }) => {
        const priority = row.getValue("priority") as Note["priority"];
        const meta = getPriorityMeta(priority);
        return (
          <Badge
            variant="outline"
            className={cn("px-1.5 py-0 text-[10px] font-medium border", meta.badgeClass)}
          >
            {t ? t(`priority.${priority}`) : meta.label}
          </Badge>
        );
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      },
      enableSorting: true,
    },
    {
      accessorKey: "updatedAt",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t ? t("table.lastUpdated") : "Last Updated"}
        />
      ),
      cell: ({ row }) => {
        const dateStr = (row.getValue("updatedAt") || row.original.createdAt) as string;
        let formatted = "";
        try {
          formatted = formatDistanceToNow(new Date(dateStr), {
            addSuffix: true,
          });
        } catch {
          formatted = dateStr;
        }
        return (
          <span className="text-xs text-muted-foreground font-mono whitespace-nowrap">
            {formatted}
          </span>
        );
      },
      enableSorting: true,
    },
    {
      id: "actions",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t ? t("table.actions") : "Actions"}
        />
      ),
      cell: ({ row }) => {
        const note = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="size-7 text-muted-foreground ml-auto"
                  onClick={(e) => e.stopPropagation()}
                />
              }
            >
              <MoreHorizontal className="size-3.5" />
              <span className="sr-only">
                {t ? t("table.openActions") : "Open actions"}
              </span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40 text-xs">
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  onView(note);
                }}
                className="gap-2 cursor-pointer"
              >
                <Eye className="size-3.5" />
                <span>{t ? t("actions.view") : "View Details"}</span>
              </DropdownMenuItem>
              {(onQuickEdit || onEdit) && (
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onQuickEdit) {
                      onQuickEdit(note);
                    } else if (onEdit) {
                      onEdit(note);
                    }
                  }}
                  className="gap-2 cursor-pointer"
                >
                  <SlidersHorizontal className="size-3.5" />
                  <span>{t ? t("actions.quickEdit") : "Quick Edit"}</span>
                </DropdownMenuItem>
              )}
              {(onFullEdit || onEdit) && (
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onFullEdit) {
                      onFullEdit(note);
                    } else if (onEdit) {
                      onEdit(note);
                    }
                  }}
                  className="gap-2 cursor-pointer"
                >
                  <Pencil className="size-3.5" />
                  <span>{t ? t("actions.fullEdit") : "Full Edit"}</span>
                </DropdownMenuItem>
              )}
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  onTogglePin(note.id);
                }}
                className="gap-2 cursor-pointer"
              >
                <Pin className="size-3.5" />
                <span>
                  {note.pinned
                    ? (t ? t("actions.unpin") : "Unpin")
                    : (t ? t("actions.pin") : "Pin to top")}
                </span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  onDuplicate(note.id);
                }}
                className="gap-2 cursor-pointer"
              >
                <Copy className="size-3.5" />
                <span>{t ? t("actions.duplicate") : "Duplicate"}</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleArchive(note.id);
                }}
                className="gap-2 cursor-pointer"
              >
                {note.archived ? (
                  <>
                    <ArchiveRestore className="size-3.5" />
                    <span>{t ? t("actions.unarchive") : "Restore"}</span>
                  </>
                ) : (
                  <>
                    <Archive className="size-3.5" />
                    <span>{t ? t("actions.archive") : "Archive"}</span>
                  </>
                )}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(note);
                }}
                className="gap-2 text-destructive focus:text-destructive cursor-pointer"
              >
                <Trash2 className="size-3.5" />
                <span>{t ? t("actions.delete") : "Delete"}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
}
