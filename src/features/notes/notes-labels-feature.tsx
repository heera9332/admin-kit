"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/routing";
import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import {
  Tag as TagIcon,
  Plus,
  ArrowLeft,
  Search,
  List,
  LayoutGrid,
  MoreHorizontal,
  Pencil,
  Trash2,
  ExternalLink,
  StickyNote,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DataTable } from "@/components/shared/data-table";
import { DataTableColumnHeader } from "@/components/shared/data-table/data-table-column-header";
import { toast } from "@/components/ui/toast";
import { useNotes } from "@/context/notes-provider";
import {
  CreateLabelDialog,
  EditLabelDialog,
  DeleteLabelDialog,
} from "./components/label-dialogs";
import {
  type NoteLabel,
  getLabelColorClasses,
} from "@/data/notes";
import { cn } from "@/lib/utils";

export function NotesLabelsFeature() {
  const t = useTranslations("notes");
  const router = useRouter();
  const {
    labels,
    notes,
    createLabel,
    updateLabel,
    deleteLabel,
    getNotesCountForLabel,
  } = useNotes();

  const [viewMode, setViewMode] = React.useState<"table" | "grid">("table");
  const [searchQuery, setSearchQuery] = React.useState("");

  // Dialog states
  const [createOpen, setCreateOpen] = React.useState(false);
  const [editingLabel, setEditingLabel] = React.useState<NoteLabel | null>(null);
  const [deletingLabel, setDeletingLabel] = React.useState<NoteLabel | null>(null);

  // Actions
  const handleCreate = (data: Omit<NoteLabel, "id" | "createdAt">) => {
    const created = createLabel(data);
    toast.add({
      title: t("toasts.labelCreated"),
      description: t("toasts.labelCreatedDesc", { name: created.name }),
    });
  };

  const handleUpdate = (id: string, updates: Partial<NoteLabel>) => {
    updateLabel(id, updates);
    toast.add({
      title: t("toasts.labelUpdated"),
      description: t("toasts.labelUpdatedDesc", { name: updates.name || "" }),
    });
  };

  const handleDelete = (id: string) => {
    deleteLabel(id);
    toast.add({
      title: t("toasts.labelDeleted"),
      description: t("toasts.labelDeletedDesc"),
    });
  };

  const handleViewNotes = (labelId: string) => {
    router.push(`/dashboard/notes?label=${encodeURIComponent(labelId)}`);
  };

  // Filtered labels
  const filteredLabels = React.useMemo(() => {
    if (!searchQuery.trim()) return labels;
    const q = searchQuery.toLowerCase().trim();
    return labels.filter(
      (lbl) =>
        lbl.name.toLowerCase().includes(q) ||
        lbl.slug.toLowerCase().includes(q) ||
        (lbl.description && lbl.description.toLowerCase().includes(q))
    );
  }, [labels, searchQuery]);

  // Statistics
  const totalLabels = labels.length;
  const activeLabelsCount = labels.filter(
    (l) => getNotesCountForLabel(l.id) > 0
  ).length;
  const unusedLabelsCount = totalLabels - activeLabelsCount;
  const totalTaggedNotes = notes.filter(
    (n) => n.labelIds && n.labelIds.length > 0
  ).length;

  // Table Columns
  const columns = React.useMemo<ColumnDef<NoteLabel>[]>(
    () => [
      {
        accessorKey: "name",
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            title={t("labelsPage.fields.name")}
          />
        ),
        cell: ({ row }) => {
          const label = row.original;
          const { badgeClass, dotClass } = getLabelColorClasses(label.color);
          return (
            <div className="flex items-center gap-2.5 max-w-[280px]">
              <span className={cn("size-3 rounded-full shrink-0", dotClass)} />
              <div className="space-y-0.5 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span
                    className={cn(
                      "font-semibold text-xs px-2 py-0.5 rounded border inline-flex items-center gap-1",
                      badgeClass
                    )}
                  >
                    <TagIcon className="size-3" />
                    <span>#{label.name}</span>
                  </span>
                </div>
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: "slug",
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            title={t("labelsPage.fields.slug")}
          />
        ),
        cell: ({ row }) => (
          <span className="font-mono text-xs text-muted-foreground">
            #{row.getValue("slug")}
          </span>
        ),
      },
      {
        accessorKey: "description",
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            title={t("labelsPage.fields.description")}
          />
        ),
        cell: ({ row }) => {
          const desc = row.getValue("description") as string | undefined;
          return (
            <span className="text-xs text-muted-foreground line-clamp-1 max-w-[320px]">
              {desc || (
                <span className="italic opacity-60">
                  {t("labelsPage.noDescription")}
                </span>
              )}
            </span>
          );
        },
      },
      {
        id: "notesCount",
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            title={t("labelsPage.fields.notesCount")}
          />
        ),
        cell: ({ row }) => {
          const count = getNotesCountForLabel(row.original.id);
          return (
            <Badge
              variant={count > 0 ? "secondary" : "outline"}
              className="font-mono text-[11px] px-2 py-0.5 cursor-pointer hover:bg-primary/10"
              onClick={(e) => {
                e.stopPropagation();
                handleViewNotes(row.original.id);
              }}
              title={t("labelsPage.clickToViewNotes")}
            >
              {t("labelsPage.notesCountBadge", { count })}
            </Badge>
          );
        },
      },
      {
        accessorKey: "createdAt",
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            title={t("labelsPage.fields.createdAt")}
          />
        ),
        cell: ({ row }) => {
          const dateStr = row.getValue("createdAt") as string;
          let formatted = "";
          try {
            formatted = format(new Date(dateStr), "MMM d, yyyy");
          } catch {
            formatted = dateStr;
          }
          return (
            <span className="text-xs text-muted-foreground font-mono whitespace-nowrap">
              {formatted}
            </span>
          );
        },
      },
      {
        id: "actions",
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            title={t("labelsPage.fields.actions")}
          />
        ),
        cell: ({ row }) => {
          const label = row.original;
          const count = getNotesCountForLabel(label.id);

          return (
            <div className="flex items-center gap-1 justify-end">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-xs gap-1 text-muted-foreground hover:text-foreground"
                onClick={(e) => {
                  e.stopPropagation();
                  handleViewNotes(label.id);
                }}
              >
                <ExternalLink className="size-3" />
                <span>{t("labelsPage.actions.viewNotes")}</span>
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="size-7 text-muted-foreground"
                      onClick={(e) => e.stopPropagation()}
                    />
                  }
                >
                  <MoreHorizontal className="size-3.5" />
                  <span className="sr-only">
                    {t("labelsPage.fields.actions")}
                  </span>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-36 text-xs">
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation();
                      handleViewNotes(label.id);
                    }}
                    className="gap-2 cursor-pointer"
                  >
                    <StickyNote className="size-3.5" />
                    <span>
                      {t("labelsPage.actions.viewNotesWithCount", { count })}
                    </span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingLabel(label);
                    }}
                    className="gap-2 cursor-pointer"
                  >
                    <Pencil className="size-3.5" />
                    <span>{t("labelsPage.actions.edit")}</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeletingLabel(label);
                    }}
                    className="gap-2 text-destructive focus:text-destructive cursor-pointer"
                  >
                    <Trash2 className="size-3.5" />
                    <span>{t("labelsPage.actions.delete")}</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          );
        },
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [labels, notes, t]
  );

  return (
    <div className="space-y-5 min-w-0 w-full">
      {/* Top Breadcrumb Back Navigation */}
      <div>
        <Button
          variant="ghost"
          size="sm"
          render={<Link href="/dashboard/notes" />}
          className="gap-1.5 text-xs text-muted-foreground hover:text-foreground -ml-2 mb-2 cursor-pointer"
        >
          <ArrowLeft className="size-3.5" />
          <span>{t("labelsPage.backToNotes")}</span>
        </Button>
      </div>

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              {t("labelsPage.title")}
            </h1>
            <Badge variant="secondary" className="font-mono text-xs px-2 py-0.5">
              {t("labelsPage.totalBadge", { count: totalLabels })}
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            {t("labelsPage.description")}
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Button
            onClick={() => setCreateOpen(true)}
            className="gap-1.5 h-9 cursor-pointer"
          >
            <Plus className="size-4" />
            <span>{t("labelsPage.newLabel")}</span>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3 rounded-xl border bg-card text-left">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground font-medium">
              {t("labelsPage.stats.total")}
            </span>
            <TagIcon className="size-3.5 text-teal-500" />
          </div>
          <div className="text-xl font-bold mt-1 text-foreground">
            {totalLabels}
          </div>
        </div>

        <div className="p-3 rounded-xl border bg-card text-left">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground font-medium">
              {t("labelsPage.stats.active")}
            </span>
            <StickyNote className="size-3.5 text-sky-500" />
          </div>
          <div className="text-xl font-bold mt-1 text-foreground">
            {activeLabelsCount}
          </div>
        </div>

        <div className="p-3 rounded-xl border bg-card text-left">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground font-medium">
              {t("labelsPage.stats.unused")}
            </span>
            <TagIcon className="size-3.5 text-amber-500" />
          </div>
          <div className="text-xl font-bold mt-1 text-foreground">
            {unusedLabelsCount}
          </div>
        </div>

        <div className="p-3 rounded-xl border bg-card text-left">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground font-medium">
              {t("labelsPage.stats.totalNotesTagged")}
            </span>
            <TagIcon className="size-3.5 text-violet-500" />
          </div>
          <div className="text-xl font-bold mt-1 text-foreground">
            {totalTaggedNotes}
          </div>
        </div>
      </div>

      {/* Toolbar: Search and View Mode */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder={t("labelsPage.searchPlaceholder")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9 text-xs"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="size-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center border rounded-md bg-muted/40 p-0.5 self-end sm:self-auto">
          <Button
            variant="ghost"
            size="icon"
            aria-label={t("viewMode.table")}
            className={cn(
              "size-7 rounded-sm transition-all cursor-pointer",
              viewMode === "table"
                ? "bg-background text-foreground shadow-xs dark:bg-card"
                : "text-muted-foreground hover:text-foreground"
            )}
            onClick={() => setViewMode("table")}
          >
            <List className="size-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            aria-label={t("viewMode.grid")}
            className={cn(
              "size-7 rounded-sm transition-all cursor-pointer",
              viewMode === "grid"
                ? "bg-background text-foreground shadow-xs dark:bg-card"
                : "text-muted-foreground hover:text-foreground"
            )}
            onClick={() => setViewMode("grid")}
          >
            <LayoutGrid className="size-3.5" />
          </Button>
        </div>
      </div>

      {/* Content View */}
      {viewMode === "table" ? (
        <DataTable
          data={filteredLabels}
          columns={columns}
          sorting
          pagination={{
            pageSize: 10,
            pageSizeOptions: [10, 20, 30],
          }}
          onRowClick={(row) => handleViewNotes(row.id)}
        />
      ) : filteredLabels.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 text-center rounded-xl border border-dashed bg-card/40 my-6">
          <div className="size-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-3">
            <TagIcon className="size-6" />
          </div>
          <h3 className="font-semibold text-base text-foreground">
            {searchQuery
              ? t("labelsPage.empty.noMatching")
              : t("labelsPage.empty.noLabels")}
          </h3>
          <p className="text-xs text-muted-foreground max-w-sm mt-1 mb-4">
            {searchQuery
              ? t("labelsPage.empty.noMatchingDesc")
              : t("labelsPage.empty.noLabelsDesc")}
          </p>
          <Button
            size="sm"
            onClick={() => setCreateOpen(true)}
            className="gap-1.5 cursor-pointer"
          >
            <Plus className="size-3.5" />
            {t("labelsPage.empty.createFirst")}
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5">
          {filteredLabels.map((lbl) => {
            const { badgeClass, dotClass } = getLabelColorClasses(lbl.color);
            const notesCount = getNotesCountForLabel(lbl.id);

            return (
              <Card
                key={lbl.id}
                className="flex flex-col justify-between p-4 shadow-xs hover:shadow-md hover:border-primary/40 transition-all cursor-pointer"
                onClick={() => handleViewNotes(lbl.id)}
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span
                      className={cn(
                        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold border",
                        badgeClass
                      )}
                    >
                      <span className={cn("size-2 rounded-full", dotClass)} />
                      <span>#{lbl.name}</span>
                    </span>

                    <DropdownMenu>
                      <DropdownMenuTrigger
                        render={
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="size-7 text-muted-foreground"
                            onClick={(e) => e.stopPropagation()}
                          />
                        }
                      >
                        <MoreHorizontal className="size-3.5" />
                        <span className="sr-only">
                          {t("labelsPage.fields.actions")}
                        </span>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-36 text-xs">
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewNotes(lbl.id);
                          }}
                          className="gap-2 cursor-pointer"
                        >
                          <StickyNote className="size-3.5" />
                          <span>
                            {t("labelsPage.actions.viewNotesWithCount", {
                              count: notesCount,
                            })}
                          </span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingLabel(lbl);
                          }}
                          className="gap-2 cursor-pointer"
                        >
                          <Pencil className="size-3.5" />
                          <span>{t("labelsPage.actions.edit")}</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeletingLabel(lbl);
                          }}
                          className="gap-2 text-destructive focus:text-destructive cursor-pointer"
                        >
                          <Trash2 className="size-3.5" />
                          <span>{t("labelsPage.actions.delete")}</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <p className="font-mono text-[11px] text-muted-foreground mb-1.5">
                    #{lbl.slug}
                  </p>

                  <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                    {lbl.description || (
                      <span className="italic opacity-60">
                        {t("labelsPage.noDescription")}
                      </span>
                    )}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t flex items-center justify-between">
                  <Badge
                    variant={notesCount > 0 ? "secondary" : "outline"}
                    className="font-mono text-[10px]"
                  >
                    {t("labelsPage.notesCountBadge", { count: notesCount })}
                  </Badge>

                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-6 px-2 text-[11px] gap-1 text-primary hover:text-primary hover:bg-primary/10"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleViewNotes(lbl.id);
                    }}
                  >
                    <span>{t("labelsPage.actions.viewNotes")}</span>
                    <ExternalLink className="size-3" />
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Dialogs */}
      <CreateLabelDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onCreate={handleCreate}
      />

      <EditLabelDialog
        label={editingLabel}
        open={Boolean(editingLabel)}
        onOpenChange={(open) => !open && setEditingLabel(null)}
        onUpdate={handleUpdate}
      />

      <DeleteLabelDialog
        label={deletingLabel}
        notesCount={deletingLabel ? getNotesCountForLabel(deletingLabel.id) : 0}
        open={Boolean(deletingLabel)}
        onOpenChange={(open) => !open && setDeletingLabel(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
