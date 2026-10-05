"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { Link } from "@/i18n/routing";
import {
  StickyNote,
  Plus,
  Tag,
  Search,
  List,
  LayoutGrid,
  Pin,
  Archive,
  FilterX,
  FileText,
  X,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DataTable, DataTableFloatingBar } from "@/components/shared/data-table";
import { toast } from "@/components/ui/toast";
import { useNotes } from "@/context/notes-provider";
import { NoteCard } from "./components/note-card";
import { getNotesColumns } from "./components/notes-table-columns";
import {
  CreateNoteDialog,
  EditNoteDialog,
  ViewNoteSheet,
  DeleteNoteDialog,
} from "./components/note-dialogs";
import {
  type Note,
  getLabelColorClasses,
} from "@/data/notes";
import type { NotesViewMode, NotesStatusFilter } from "./types";
import { cn } from "@/lib/utils";

export function NotesFeature() {
  const searchParams = useSearchParams();
  const labelFromUrl = searchParams.get("label") || "all";

  const {
    notes,
    labels,
    createNote,
    updateNote,
    deleteNote,
    togglePin,
    toggleArchive,
    duplicateNote,
  } = useNotes();

  // State
  const [viewMode, setViewMode] = React.useState<NotesViewMode>("grid");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedStatus, setSelectedStatus] = React.useState<NotesStatusFilter>("active");
  const [userSelectedLabel, setUserSelectedLabel] = React.useState<string | null>(null);
  const selectedLabel = userSelectedLabel ?? labelFromUrl;
  const setSelectedLabel = (val: string) => setUserSelectedLabel(val);
  const [selectedPriority, setSelectedPriority] = React.useState<string>("all");

  // Dialogs State
  const [createOpen, setCreateOpen] = React.useState(false);
  const [editingNote, setEditingNote] = React.useState<Note | null>(null);
  const [viewingNote, setViewingNote] = React.useState<Note | null>(null);
  const [deletingNote, setDeletingNote] = React.useState<Note | null>(null);

  // Actions with Toasts
  const handleCreate = (data: Omit<Note, "id" | "createdAt" | "updatedAt">) => {
    const created = createNote(data);
    toast.add({
      title: "Note Created",
      description: `"${created.title}" was saved successfully.`,
    });
  };

  const handleUpdate = (id: string, updates: Partial<Note>) => {
    updateNote(id, updates);
    if (viewingNote?.id === id) {
      setViewingNote((prev) => (prev ? { ...prev, ...updates } : null));
    }
    toast.add({
      title: "Note Updated",
      description: "Changes saved successfully.",
    });
  };

  const handleDelete = (id: string) => {
    deleteNote(id);
    if (viewingNote?.id === id) {
      setViewingNote(null);
    }
    toast.add({
      title: "Note Deleted",
      description: "Note removed permanently.",
    });
  };

  const handleTogglePin = (id: string) => {
    const target = notes.find((n) => n.id === id);
    togglePin(id);
    if (viewingNote?.id === id) {
      setViewingNote((prev) => (prev ? { ...prev, pinned: !prev.pinned } : null));
    }
    toast.add({
      title: target?.pinned ? "Note Unpinned" : "Note Pinned",
      description: target?.pinned
        ? "Note unpinned from the top."
        : "Note pinned to the top of your board.",
    });
  };

  const handleToggleArchive = (id: string) => {
    const target = notes.find((n) => n.id === id);
    toggleArchive(id);
    if (viewingNote?.id === id) {
      setViewingNote((prev) => (prev ? { ...prev, archived: !prev.archived } : null));
    }
    toast.add({
      title: target?.archived ? "Note Restored" : "Note Archived",
      description: target?.archived
        ? "Note moved back to active notes."
        : "Note archived.",
    });
  };

  const handleDuplicate = (id: string) => {
    const dup = duplicateNote(id);
    if (dup) {
      toast.add({
        title: "Note Duplicated",
        description: `Created copy: "${dup.title}".`,
      });
    }
  };

  // Filtered Notes
  const filteredNotes = React.useMemo(() => {
    return notes.filter((note) => {
      // Status filter
      if (selectedStatus === "active" && note.archived) return false;
      if (selectedStatus === "archived" && !note.archived) return false;
      if (selectedStatus === "pinned" && (!note.pinned || note.archived)) return false;

      // Label filter
      if (selectedLabel !== "all") {
        if (!note.labelIds || !note.labelIds.includes(selectedLabel)) {
          return false;
        }
      }

      // Priority filter
      if (selectedPriority !== "all") {
        if (note.priority !== selectedPriority) return false;
      }

      // Search query filter (title and content)
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesTitle = note.title.toLowerCase().includes(query);
        const matchesContent = note.content.toLowerCase().includes(query);
        if (!matchesTitle && !matchesContent) return false;
      }

      return true;
    });
  }, [notes, selectedStatus, selectedLabel, selectedPriority, searchQuery]);

  // Separate pinned and unpinned notes for Grid View
  const { pinnedNotes, unpinnedNotes } = React.useMemo(() => {
    if (selectedStatus === "archived") {
      return { pinnedNotes: [], unpinnedNotes: filteredNotes };
    }
    return {
      pinnedNotes: filteredNotes.filter((n) => n.pinned),
      unpinnedNotes: filteredNotes.filter((n) => !n.pinned),
    };
  }, [filteredNotes, selectedStatus]);

  // Stats calculation
  const totalCount = notes.length;
  const activeCount = notes.filter((n) => !n.archived).length;
  const pinnedCount = notes.filter((n) => n.pinned && !n.archived).length;
  const archivedCount = notes.filter((n) => n.archived).length;
  const labelsCount = labels.length;

  const hasActiveFilters =
    searchQuery.trim() !== "" ||
    selectedLabel !== "all" ||
    selectedPriority !== "all" ||
    selectedStatus !== "active";

  const clearAllFilters = () => {
    setSearchQuery("");
    setSelectedLabel("all");
    setSelectedPriority("all");
    setSelectedStatus("active");
  };

  // Table Columns
  const columns = React.useMemo(
    () =>
      getNotesColumns({
        labels,
        onView: (note) => setViewingNote(note),
        onEdit: (note) => setEditingNote(note),
        onDelete: (note) => setDeletingNote(note),
        onTogglePin: handleTogglePin,
        onToggleArchive: handleToggleArchive,
        onDuplicate: handleDuplicate,
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [labels, notes]
  );

  return (
    <div className="space-y-5 min-w-0 w-full">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Notes
            </h1>
            <Badge variant="secondary" className="font-mono text-xs px-2 py-0.5">
              {activeCount} active
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Capture ideas, organize thoughts, and manage notes with custom labels.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {/* Link to Manage Labels page */}
          <Button
            variant="outline"
            render={<Link href="/dashboard/notes/labels" />}
            className="cursor-pointer gap-2 h-9"
          >
            <Tag className="size-3.5 text-teal-500" />
            <span>Manage Labels</span>
            <Badge
              variant="secondary"
              className="ml-1 px-1.5 py-0 text-[10px] font-mono bg-muted"
            >
              {labelsCount}
            </Badge>
          </Button>

          {/* New Note Button */}
          <Button
            onClick={() => setCreateOpen(true)}
            className="gap-1.5 h-9 cursor-pointer"
          >
            <Plus className="size-4" />
            <span>New Note</span>
          </Button>
        </div>
      </div>

      {/* Quick Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          type="button"
          onClick={() => setSelectedStatus("active")}
          className={cn(
            "p-3 rounded-xl border text-left transition-all cursor-pointer",
            selectedStatus === "active"
              ? "bg-accent/40 border-primary/50 shadow-xs"
              : "bg-card hover:bg-muted/40"
          )}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground font-medium">
              Active Notes
            </span>
            <FileText className="size-3.5 text-sky-500" />
          </div>
          <div className="text-xl font-bold mt-1 text-foreground">
            {activeCount}
          </div>
        </button>

        <button
          type="button"
          onClick={() => setSelectedStatus("pinned")}
          className={cn(
            "p-3 rounded-xl border text-left transition-all cursor-pointer",
            selectedStatus === "pinned"
              ? "bg-accent/40 border-primary/50 shadow-xs"
              : "bg-card hover:bg-muted/40"
          )}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground font-medium">
              Pinned Notes
            </span>
            <Pin className="size-3.5 text-amber-500 rotate-45" />
          </div>
          <div className="text-xl font-bold mt-1 text-foreground">
            {pinnedCount}
          </div>
        </button>

        <button
          type="button"
          onClick={() => setSelectedStatus("archived")}
          className={cn(
            "p-3 rounded-xl border text-left transition-all cursor-pointer",
            selectedStatus === "archived"
              ? "bg-accent/40 border-primary/50 shadow-xs"
              : "bg-card hover:bg-muted/40"
          )}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground font-medium">
              Archived
            </span>
            <Archive className="size-3.5 text-muted-foreground" />
          </div>
          <div className="text-xl font-bold mt-1 text-foreground">
            {archivedCount}
          </div>
        </button>

        <div className="p-3 rounded-xl border bg-card text-left">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground font-medium">
              Total Labels
            </span>
            <Tag className="size-3.5 text-teal-500" />
          </div>
          <div className="text-xl font-bold mt-1 text-foreground">
            {labelsCount}
          </div>
        </div>
      </div>

      {/* Filter and View Toolbar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Search notes by title or content..."
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

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Status selector */}
          <Select
            value={selectedStatus}
            onValueChange={(val) => setSelectedStatus((val as NotesStatusFilter) ?? "active")}
          >
            <SelectTrigger className="w-[125px] h-9 text-xs">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active ({activeCount})</SelectItem>
              <SelectItem value="pinned">Pinned ({pinnedCount})</SelectItem>
              <SelectItem value="archived">Archived ({archivedCount})</SelectItem>
              <SelectItem value="all">All ({totalCount})</SelectItem>
            </SelectContent>
          </Select>

          {/* Label selector */}
          <Select
            value={selectedLabel}
            onValueChange={(val) => setSelectedLabel(val ?? "all")}
          >
            <SelectTrigger className="w-[135px] h-9 text-xs">
              <SelectValue placeholder="Label" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Labels</SelectItem>
              {labels.map((lbl) => (
                <SelectItem key={lbl.id} value={lbl.id}>
                  #{lbl.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Priority selector */}
          <Select
            value={selectedPriority}
            onValueChange={(val) => setSelectedPriority(val ?? "all")}
          >
            <SelectTrigger className="w-[125px] h-9 text-xs">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priorities</SelectItem>
              <SelectItem value="urgent">Urgent</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              className="h-9 px-2 text-xs text-muted-foreground hover:text-foreground"
              title="Clear all filters"
            >
              <FilterX className="size-3.5 mr-1" />
              Reset
            </Button>
          )}

          {/* View Mode Toggle */}
          <div className="flex items-center border rounded-md bg-muted/40 p-0.5 ml-auto md:ml-0">
            <Button
              variant="ghost"
              size="icon"
              aria-label="Grid view"
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
            <Button
              variant="ghost"
              size="icon"
              aria-label="Table view"
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
          </div>
        </div>
      </div>

      {/* Selected Label Filter Chip Indicator */}
      {selectedLabel !== "all" && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>Filtering by label:</span>
          {(() => {
            const currentLabel = labels.find((l) => l.id === selectedLabel);
            if (!currentLabel) return null;
            const { badgeClass } = getLabelColorClasses(currentLabel.color);
            return (
              <span
                className={cn(
                  "inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium border",
                  badgeClass
                )}
              >
                #{currentLabel.name}
                <button
                  type="button"
                  onClick={() => setSelectedLabel("all")}
                  className="hover:opacity-75 cursor-pointer ml-1"
                >
                  <X className="size-3" />
                </button>
              </span>
            );
          })()}
        </div>
      )}

      {/* Main Content View */}
      {viewMode === "grid" ? (
        filteredNotes.length === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center p-12 text-center rounded-xl border border-dashed bg-card/40 my-6">
            <div className="size-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-3">
              <StickyNote className="size-6" />
            </div>
            <h3 className="font-semibold text-base text-foreground">
              {hasActiveFilters ? "No matching notes found" : "No notes yet"}
            </h3>
            <p className="text-xs text-muted-foreground max-w-sm mt-1 mb-4">
              {hasActiveFilters
                ? "Try clearing your filters or changing your search terms to find what you're looking for."
                : "Create your first note to start organizing ideas, code snippets, meetings, and sprint tasks."}
            </p>
            {hasActiveFilters ? (
              <Button
                variant="outline"
                size="sm"
                onClick={clearAllFilters}
                className="gap-1.5"
              >
                <FilterX className="size-3.5" />
                Clear Filters
              </Button>
            ) : (
              <Button
                size="sm"
                onClick={() => setCreateOpen(true)}
                className="gap-1.5"
              >
                <Plus className="size-3.5" />
                Create First Note
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {/* Pinned Notes Section */}
            {pinnedNotes.length > 0 && selectedStatus !== "pinned" && (
              <div className="space-y-3">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  <Pin className="size-3.5 text-amber-500 rotate-45" />
                  <span>Pinned Notes ({pinnedNotes.length})</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5">
                  {pinnedNotes.map((note) => (
                    <NoteCard
                      key={note.id}
                      note={note}
                      labels={labels}
                      onView={(n) => setViewingNote(n)}
                      onEdit={(n) => setEditingNote(n)}
                      onDelete={(n) => setDeletingNote(n)}
                      onTogglePin={handleTogglePin}
                      onToggleArchive={handleToggleArchive}
                      onDuplicate={handleDuplicate}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Other / Unpinned Notes Section */}
            <div className="space-y-3">
              {pinnedNotes.length > 0 && selectedStatus !== "pinned" && (
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  <span>Other Notes ({unpinnedNotes.length})</span>
                </div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5">
                {(selectedStatus === "pinned" ? pinnedNotes : unpinnedNotes).map(
                  (note) => (
                    <NoteCard
                      key={note.id}
                      note={note}
                      labels={labels}
                      onView={(n) => setViewingNote(n)}
                      onEdit={(n) => setEditingNote(n)}
                      onDelete={(n) => setDeletingNote(n)}
                      onTogglePin={handleTogglePin}
                      onToggleArchive={handleToggleArchive}
                      onDuplicate={handleDuplicate}
                    />
                  )
                )}
              </div>
            </div>
          </div>
        )
      ) : (
        /* Table View */
        <DataTable
          data={filteredNotes}
          columns={columns}
          sorting
          pagination={{
            pageSize: 10,
            pageSizeOptions: [10, 20, 30, 50],
          }}
          onRowClick={(row) => setViewingNote(row)}
          floatingBar={(table) => (
            <DataTableFloatingBar table={table} entityName="note">
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="h-7 text-xs"
                onClick={() => {
                  table.getFilteredSelectedRowModel().rows.forEach((row) => {
                    handleToggleArchive(row.original.id);
                  });
                  table.toggleAllPageRowsSelected(false);
                }}
              >
                <Archive className="size-3.5 mr-1" />
                Archive
              </Button>
              <Button
                type="button"
                size="sm"
                variant="destructive"
                className="h-7 text-xs"
                onClick={() => {
                  table.getFilteredSelectedRowModel().rows.forEach((row) => {
                    handleDelete(row.original.id);
                  });
                  table.toggleAllPageRowsSelected(false);
                }}
              >
                <Trash2 className="size-3.5 mr-1" />
                Delete
              </Button>
            </DataTableFloatingBar>
          )}
        />
      )}

      {/* Dialogs & Sheets */}
      <CreateNoteDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        labels={labels}
        onCreate={handleCreate}
      />

      <EditNoteDialog
        note={editingNote}
        open={Boolean(editingNote)}
        onOpenChange={(open) => !open && setEditingNote(null)}
        labels={labels}
        onUpdate={handleUpdate}
      />

      <ViewNoteSheet
        note={viewingNote}
        open={Boolean(viewingNote)}
        onOpenChange={(open) => !open && setViewingNote(null)}
        labels={labels}
        onEdit={(n) => setEditingNote(n)}
        onDelete={(n) => setDeletingNote(n)}
        onTogglePin={handleTogglePin}
      />

      <DeleteNoteDialog
        note={deletingNote}
        open={Boolean(deletingNote)}
        onOpenChange={(open) => !open && setDeletingNote(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
