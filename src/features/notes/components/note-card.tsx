"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { formatDistanceToNow } from "date-fns";
import {
  Pin,
  MoreVertical,
  Pencil,
  Trash2,
  Copy,
  Archive,
  ArchiveRestore,
  Eye,
  SlidersHorizontal,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  type Note,
  type NoteLabel,
  getNoteColorClasses,
  getLabelColorClasses,
  getPriorityMeta,
} from "@/data/notes";
import { cn } from "@/lib/utils";

interface NoteCardProps {
  note: Note;
  labels: NoteLabel[];
  onView: (note: Note) => void;
  onQuickEdit?: (note: Note) => void;
  onFullEdit?: (note: Note) => void;
  onEdit?: (note: Note) => void;
  onDelete: (note: Note) => void;
  onTogglePin: (id: string) => void;
  onToggleArchive: (id: string) => void;
  onDuplicate: (id: string) => void;
}

export function NoteCard({
  note,
  labels,
  onView,
  onQuickEdit,
  onFullEdit,
  onEdit,
  onDelete,
  onTogglePin,
  onToggleArchive,
  onDuplicate,
}: NoteCardProps) {
  const t = useTranslations("notes");
  const noteColorClass = getNoteColorClasses(note.color);
  const priorityMeta = getPriorityMeta(note.priority);

  const noteLabels = React.useMemo(() => {
    return (note.labelIds || [])
      .map((id) => labels.find((l) => l.id === id))
      .filter((l): l is NoteLabel => Boolean(l));
  }, [note.labelIds, labels]);

  const formattedDate = React.useMemo(() => {
    try {
      return formatDistanceToNow(new Date(note.updatedAt || note.createdAt), {
        addSuffix: true,
      });
    } catch {
      return "";
    }
  }, [note.updatedAt, note.createdAt]);

  return (
    <Card
      onClick={() => onView(note)}
      className={cn(
        "group relative flex flex-col justify-between p-4 cursor-pointer transition-all duration-200 shadow-xs hover:shadow-md",
        noteColorClass,
        note.pinned && "ring-1 ring-primary/40 dark:ring-primary/50"
      )}
    >
      {/* Top Header: Title & Pin/Menu Actions */}
      <div>
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-semibold text-sm leading-tight text-foreground line-clamp-2">
            {note.title}
          </h3>

          <div
            className="flex items-center gap-0.5 shrink-0 -mr-1 -mt-1"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Pin Toggle Button */}
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label={note.pinned ? t("actions.unpinNote") : t("actions.pinNote")}
              onClick={() => onTogglePin(note.id)}
              className={cn(
                "size-7 rounded-full text-muted-foreground hover:text-foreground transition-colors",
                note.pinned
                  ? "text-primary hover:text-primary fill-primary"
                  : "opacity-0 group-hover:opacity-100 focus-visible:opacity-100"
              )}
            >
              <Pin
                className={cn(
                  "size-3.5 transition-transform",
                  note.pinned && "rotate-45 fill-primary text-primary"
                )}
              />
            </Button>

            {/* Actions Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label={t("fields.actions")}
                    className="size-7 rounded-full text-muted-foreground hover:text-foreground opacity-70 group-hover:opacity-100"
                  />
                }
              >
                <MoreVertical className="size-3.5" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40 text-xs">
                <DropdownMenuItem
                  onClick={() => onView(note)}
                  className="gap-2 cursor-pointer"
                >
                  <Eye className="size-3.5" />
                  <span>{t("actions.view")}</span>
                </DropdownMenuItem>
                {(onQuickEdit || onEdit) && (
                  <DropdownMenuItem
                    onClick={() => {
                      if (onQuickEdit) {
                        onQuickEdit(note);
                      } else if (onEdit) {
                        onEdit(note);
                      }
                    }}
                    className="gap-2 cursor-pointer"
                  >
                    <SlidersHorizontal className="size-3.5" />
                    <span>{t("actions.quickEdit")}</span>
                  </DropdownMenuItem>
                )}
                {(onFullEdit || onEdit) && (
                  <DropdownMenuItem
                    onClick={() => {
                      if (onFullEdit) {
                        onFullEdit(note);
                      } else if (onEdit) {
                        onEdit(note);
                      }
                    }}
                    className="gap-2 cursor-pointer"
                  >
                    <Pencil className="size-3.5" />
                    <span>{t("actions.fullEdit")}</span>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem
                  onClick={() => onTogglePin(note.id)}
                  className="gap-2 cursor-pointer"
                >
                  <Pin className="size-3.5" />
                  <span>{note.pinned ? t("actions.unpin") : t("actions.pin")}</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onDuplicate(note.id)}
                  className="gap-2 cursor-pointer"
                >
                  <Copy className="size-3.5" />
                  <span>{t("actions.duplicate")}</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onToggleArchive(note.id)}
                  className="gap-2 cursor-pointer"
                >
                  {note.archived ? (
                    <>
                      <ArchiveRestore className="size-3.5" />
                      <span>{t("actions.unarchive")}</span>
                    </>
                  ) : (
                    <>
                      <Archive className="size-3.5" />
                      <span>{t("actions.archive")}</span>
                    </>
                  )}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => onDelete(note)}
                  className="gap-2 text-destructive focus:text-destructive cursor-pointer"
                >
                  <Trash2 className="size-3.5" />
                  <span>{t("actions.delete")}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Content Preview */}
        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-4 whitespace-pre-wrap break-words">
          {note.content}
        </p>
      </div>

      {/* Card Footer: Labels, Priority, Date */}
      <div className="mt-4 pt-3 border-t border-border/40 flex flex-col gap-2">
        {/* Labels Row */}
        {noteLabels.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5">
            {noteLabels.map((lbl) => {
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
          </div>
        )}

        {/* Priority & Timestamp */}
        <div className="flex items-center justify-between text-[11px] text-muted-foreground">
          {note.priority !== "low" ? (
            <Badge
              variant="outline"
              className={cn("px-1.5 py-0 text-[10px] font-medium border", priorityMeta.badgeClass)}
            >
              {t(`priority.${note.priority}`)}
            </Badge>
          ) : (
            <span className="text-[10px] text-muted-foreground/80">{t("priority.normal")}</span>
          )}

          <span className="text-[10px] text-muted-foreground font-mono">
            {formattedDate}
          </span>
        </div>
      </div>
    </Card>
  );
}
