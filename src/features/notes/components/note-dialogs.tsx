"use client";

import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import {
  Pin,
  Pencil,
  Trash2,
  Calendar,
  Check,
  Tag,
  Copy,
  CheckCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AppDialog } from "@/components/app-dialog";
import { AppSheet } from "@/components/app-sheet";
import {
  type Note,
  type NoteLabel,
  NOTE_COLORS,
  getLabelColorClasses,
  getNoteColorClasses,
  getPriorityMeta,
} from "@/data/notes";
import { cn } from "@/lib/utils";

const noteFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().optional(),
  labelIds: z.array(z.string()),
  color: z.enum([
    "default",
    "blue",
    "emerald",
    "amber",
    "rose",
    "violet",
    "cyan",
    "orange",
  ] as const),
  priority: z.enum(["low", "medium", "high", "urgent"] as const),
  pinned: z.boolean(),
  archived: z.boolean(),
});

type NoteFormValues = z.infer<typeof noteFormSchema>;

/* ========================================================================= */
/* CREATE NOTE DIALOG                                                        */
/* ========================================================================= */
interface CreateNoteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  labels: NoteLabel[];
  onCreate: (noteData: Omit<Note, "id" | "createdAt" | "updatedAt">) => void;
}

export function CreateNoteDialog({
  open,
  onOpenChange,
  labels,
  onCreate,
}: CreateNoteDialogProps) {
  const form = useForm<NoteFormValues>({
    resolver: zodResolver(noteFormSchema),
    defaultValues: {
      title: "",
      content: "",
      labelIds: [],
      color: "default",
      priority: "low",
      pinned: false,
      archived: false,
    },
  });

  React.useEffect(() => {
    if (open) {
      form.reset({
        title: "",
        content: "",
        labelIds: [],
        color: "default",
        priority: "low",
        pinned: false,
        archived: false,
      });
    }
  }, [open, form]);

  const onSubmit = (data: NoteFormValues) => {
    onCreate({
      title: data.title.trim(),
      content: data.content || "",
      labelIds: data.labelIds,
      color: data.color,
      priority: data.priority,
      pinned: data.pinned,
      archived: data.archived,
    });
    onOpenChange(false);
  };

  const selectedLabels = form.watch("labelIds");
  const selectedColor = form.watch("color");

  const toggleLabel = (labelId: string) => {
    const current = form.getValues("labelIds") || [];
    if (current.includes(labelId)) {
      form.setValue(
        "labelIds",
        current.filter((id) => id !== labelId)
      );
    } else {
      form.setValue("labelIds", [...current, labelId]);
    }
  };

  return (
    <AppDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Create New Note"
      description="Capture your ideas, memos, or task outlines with labels and colors."
      size="2xl"
    >
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Title */}
        <div className="space-y-1.5">
          <Label htmlFor="create-note-title" className="text-xs font-semibold">
            Title <span className="text-destructive">*</span>
          </Label>
          <Input
            id="create-note-title"
            placeholder="Note title..."
            {...form.register("title")}
            autoFocus
          />
          {form.formState.errors.title && (
            <p className="text-[11px] text-destructive">
              {form.formState.errors.title.message}
            </p>
          )}
        </div>

        {/* Content */}
        <div className="space-y-1.5">
          <Label htmlFor="create-note-content" className="text-xs font-semibold">
            Content
          </Label>
          <Textarea
            id="create-note-content"
            rows={5}
            placeholder="Write your note content here..."
            className="min-h-[120px]"
            {...form.register("content")}
          />
        </div>

        {/* Labels Selection */}
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold flex items-center justify-between">
            <span>Assign Labels</span>
            <span className="text-[11px] text-muted-foreground font-normal">
              {selectedLabels.length} selected
            </span>
          </Label>
          {labels.length > 0 ? (
            <div className="flex flex-wrap gap-1.5 p-2 rounded-lg border bg-muted/20 max-h-28 overflow-y-auto">
              {labels.map((lbl) => {
                const isSelected = selectedLabels.includes(lbl.id);
                const { badgeClass } = getLabelColorClasses(lbl.color);
                return (
                  <button
                    key={lbl.id}
                    type="button"
                    onClick={() => toggleLabel(lbl.id)}
                    className={cn(
                      "inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium border transition-all cursor-pointer",
                      isSelected
                        ? cn(badgeClass, "ring-1 ring-primary/50 shadow-xs")
                        : "bg-background text-muted-foreground border-border hover:bg-muted"
                    )}
                  >
                    {isSelected ? (
                      <Check className="size-3" />
                    ) : (
                      <Tag className="size-3 opacity-60" />
                    )}
                    <span>#{lbl.name}</span>
                  </button>
                );
              })}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground italic">
              No labels defined yet. You can create labels in Manage Labels.
            </p>
          )}
        </div>

        {/* Color Palette & Priority & Pinned Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          {/* Priority */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Priority</Label>
            <Controller
              control={form.control}
              name="priority"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full h-9">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low Priority</SelectItem>
                    <SelectItem value="medium">Medium Priority</SelectItem>
                    <SelectItem value="high">High Priority</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          {/* Pin toggle */}
          <div className="flex items-center justify-between sm:justify-start sm:gap-4 p-2.5 rounded-lg border bg-muted/20">
            <div className="space-y-0.5">
              <Label className="text-xs font-semibold flex items-center gap-1.5 cursor-pointer">
                <Pin className="size-3.5" />
                <span>Pin to top</span>
              </Label>
              <p className="text-[11px] text-muted-foreground">
                Keep this note at the top of your list
              </p>
            </div>
            <Controller
              control={form.control}
              name="pinned"
              render={({ field }) => (
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              )}
            />
          </div>
        </div>

        {/* Color Swatches */}
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold">Note Card Color</Label>
          <div className="flex flex-wrap gap-2 pt-0.5">
            {NOTE_COLORS.map((c) => {
              const isSelected = selectedColor === c.id;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => form.setValue("color", c.id)}
                  title={c.name}
                  className={cn(
                    "flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs border transition-all cursor-pointer",
                    isSelected
                      ? "ring-2 ring-primary ring-offset-1 font-semibold"
                      : "opacity-75 hover:opacity-100"
                  )}
                >
                  <span className={cn("size-3 rounded-full shrink-0", c.bgDot)} />
                  <span>{c.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Actions Footer */}
        <div className="flex items-center justify-end gap-2 pt-3 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button type="submit">Create Note</Button>
        </div>
      </form>
    </AppDialog>
  );
}

/* ========================================================================= */
/* EDIT NOTE DIALOG                                                          */
/* ========================================================================= */
interface EditNoteDialogProps {
  note: Note | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  labels: NoteLabel[];
  onUpdate: (id: string, updates: Partial<Note>) => void;
}

export function EditNoteDialog({
  note,
  open,
  onOpenChange,
  labels,
  onUpdate,
}: EditNoteDialogProps) {
  const form = useForm<NoteFormValues>({
    resolver: zodResolver(noteFormSchema),
    defaultValues: {
      title: "",
      content: "",
      labelIds: [],
      color: "default",
      priority: "low",
      pinned: false,
      archived: false,
    },
  });

  React.useEffect(() => {
    if (note && open) {
      form.reset({
        title: note.title,
        content: note.content || "",
        labelIds: note.labelIds || [],
        color: note.color || "default",
        priority: note.priority || "low",
        pinned: note.pinned ?? false,
        archived: note.archived ?? false,
      });
    }
  }, [note, open, form]);

  if (!note) return null;

  const onSubmit = (data: NoteFormValues) => {
    onUpdate(note.id, {
      title: data.title.trim(),
      content: data.content || "",
      labelIds: data.labelIds,
      color: data.color,
      priority: data.priority,
      pinned: data.pinned,
      archived: data.archived,
    });
    onOpenChange(false);
  };

  const selectedLabels = form.watch("labelIds");
  const selectedColor = form.watch("color");

  const toggleLabel = (labelId: string) => {
    const current = form.getValues("labelIds") || [];
    if (current.includes(labelId)) {
      form.setValue(
        "labelIds",
        current.filter((id) => id !== labelId)
      );
    } else {
      form.setValue("labelIds", [...current, labelId]);
    }
  };

  return (
    <AppDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Edit Note"
      description="Update your note details, labels, color, and priority."
      size="2xl"
    >
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Title */}
        <div className="space-y-1.5">
          <Label htmlFor="edit-note-title" className="text-xs font-semibold">
            Title <span className="text-destructive">*</span>
          </Label>
          <Input
            id="edit-note-title"
            placeholder="Note title..."
            {...form.register("title")}
          />
          {form.formState.errors.title && (
            <p className="text-[11px] text-destructive">
              {form.formState.errors.title.message}
            </p>
          )}
        </div>

        {/* Content */}
        <div className="space-y-1.5">
          <Label htmlFor="edit-note-content" className="text-xs font-semibold">
            Content
          </Label>
          <Textarea
            id="edit-note-content"
            rows={5}
            placeholder="Write your note content here..."
            className="min-h-[120px]"
            {...form.register("content")}
          />
        </div>

        {/* Labels Selection */}
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold flex items-center justify-between">
            <span>Assign Labels</span>
            <span className="text-[11px] text-muted-foreground font-normal">
              {selectedLabels.length} selected
            </span>
          </Label>
          {labels.length > 0 ? (
            <div className="flex flex-wrap gap-1.5 p-2 rounded-lg border bg-muted/20 max-h-28 overflow-y-auto">
              {labels.map((lbl) => {
                const isSelected = selectedLabels.includes(lbl.id);
                const { badgeClass } = getLabelColorClasses(lbl.color);
                return (
                  <button
                    key={lbl.id}
                    type="button"
                    onClick={() => toggleLabel(lbl.id)}
                    className={cn(
                      "inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium border transition-all cursor-pointer",
                      isSelected
                        ? cn(badgeClass, "ring-1 ring-primary/50 shadow-xs")
                        : "bg-background text-muted-foreground border-border hover:bg-muted"
                    )}
                  >
                    {isSelected ? (
                      <Check className="size-3" />
                    ) : (
                      <Tag className="size-3 opacity-60" />
                    )}
                    <span>#{lbl.name}</span>
                  </button>
                );
              })}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground italic">
              No labels defined yet.
            </p>
          )}
        </div>

        {/* Color Palette & Priority & Pinned / Archived Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          {/* Priority */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Priority</Label>
            <Controller
              control={form.control}
              name="priority"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full h-9">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          {/* Pin toggle */}
          <div className="flex items-center justify-between p-2 rounded-lg border bg-muted/20">
            <div className="space-y-0.5">
              <Label className="text-xs font-semibold flex items-center gap-1">
                <Pin className="size-3" />
                <span>Pinned</span>
              </Label>
            </div>
            <Controller
              control={form.control}
              name="pinned"
              render={({ field }) => (
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              )}
            />
          </div>

          {/* Archived toggle */}
          <div className="flex items-center justify-between p-2 rounded-lg border bg-muted/20">
            <div className="space-y-0.5">
              <Label className="text-xs font-semibold">Archived</Label>
            </div>
            <Controller
              control={form.control}
              name="archived"
              render={({ field }) => (
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              )}
            />
          </div>
        </div>

        {/* Color Swatches */}
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold">Note Card Color</Label>
          <div className="flex flex-wrap gap-2 pt-0.5">
            {NOTE_COLORS.map((c) => {
              const isSelected = selectedColor === c.id;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => form.setValue("color", c.id)}
                  title={c.name}
                  className={cn(
                    "flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs border transition-all cursor-pointer",
                    isSelected
                      ? "ring-2 ring-primary ring-offset-1 font-semibold"
                      : "opacity-75 hover:opacity-100"
                  )}
                >
                  <span className={cn("size-3 rounded-full shrink-0", c.bgDot)} />
                  <span>{c.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Actions Footer */}
        <div className="flex items-center justify-end gap-2 pt-3 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button type="submit">Save Changes</Button>
        </div>
      </form>
    </AppDialog>
  );
}

/* ========================================================================= */
/* VIEW NOTE SHEET                                                           */
/* ========================================================================= */
interface ViewNoteSheetProps {
  note: Note | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  labels: NoteLabel[];
  onEdit: (note: Note) => void;
  onDelete: (note: Note) => void;
  onTogglePin: (id: string) => void;
}

export function ViewNoteSheet({
  note,
  open,
  onOpenChange,
  labels,
  onEdit,
  onDelete,
  onTogglePin,
}: ViewNoteSheetProps) {
  const [copied, setCopied] = React.useState(false);

  if (!note) return null;

  const noteLabels = (note.labelIds || [])
    .map((id) => labels.find((l) => l.id === id))
    .filter((l): l is NoteLabel => Boolean(l));

  const priorityMeta = getPriorityMeta(note.priority);
  const colorCardClass = getNoteColorClasses(note.color);

  const handleCopy = () => {
    const textToCopy = `${note.title}\n\n${note.content || ""}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AppSheet
      open={open}
      onOpenChange={onOpenChange}
      title={note.title}
      description={`ID: ${note.id}`}
      size="lg"
      footer={
        <div className="flex items-center justify-between w-full">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="text-destructive hover:bg-destructive/10"
            onClick={() => {
              onOpenChange(false);
              onDelete(note);
            }}
          >
            <Trash2 className="size-3.5 mr-1" />
            Delete
          </Button>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleCopy}
            >
              {copied ? (
                <>
                  <CheckCheck className="size-3.5 mr-1 text-emerald-500" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="size-3.5 mr-1" />
                  Copy
                </>
              )}
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={() => {
                onOpenChange(false);
                onEdit(note);
              }}
            >
              <Pencil className="size-3.5 mr-1" />
              Edit
            </Button>
          </div>
        </div>
      }
    >
      <div className="space-y-4 py-2">
        {/* Meta badges row */}
        <div className="flex flex-wrap items-center gap-2 p-3 rounded-lg border bg-muted/20">
          {/* Priority */}
          <Badge
            variant="outline"
            className={cn("px-2 py-0.5 text-xs font-medium border", priorityMeta.badgeClass)}
          >
            {priorityMeta.label} Priority
          </Badge>

          {/* Pin */}
          <Button
            type="button"
            variant={note.pinned ? "secondary" : "ghost"}
            size="sm"
            className="h-6 text-xs gap-1"
            onClick={() => onTogglePin(note.id)}
          >
            <Pin
              className={cn("size-3", note.pinned && "rotate-45 fill-primary text-primary")}
            />
            <span>{note.pinned ? "Pinned" : "Pin to top"}</span>
          </Button>

          {/* Archived */}
          {note.archived && (
            <Badge variant="secondary" className="text-xs">
              Archived
            </Badge>
          )}
        </div>

        {/* Assigned Labels */}
        {noteLabels.length > 0 && (
          <div className="space-y-1.5">
            <span className="text-xs font-semibold text-muted-foreground">
              Labels
            </span>
            <div className="flex flex-wrap gap-1.5">
              {noteLabels.map((lbl) => {
                const { badgeClass } = getLabelColorClasses(lbl.color);
                return (
                  <span
                    key={lbl.id}
                    className={cn(
                      "inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border",
                      badgeClass
                    )}
                  >
                    #{lbl.name}
                  </span>
                );
              })}
            </div>
          </div>
        )}

        {/* Note Content Display */}
        <div className="space-y-1.5">
          <span className="text-xs font-semibold text-muted-foreground">
            Content
          </span>
          <div
            className={cn(
              "p-4 rounded-xl border text-sm leading-relaxed whitespace-pre-wrap break-words min-h-[160px]",
              colorCardClass
            )}
          >
            {note.content || (
              <span className="text-muted-foreground italic">
                No content recorded for this note.
              </span>
            )}
          </div>
        </div>

        {/* Timestamps */}
        <div className="flex items-center justify-between text-xs text-muted-foreground pt-4 border-t">
          <div className="flex items-center gap-1.5">
            <Calendar className="size-3.5" />
            <span>
              Created:{" "}
              {note.createdAt
                ? format(new Date(note.createdAt), "MMM d, yyyy h:mm a")
                : "-"}
            </span>
          </div>
          {note.updatedAt && (
            <span>
              Updated: {format(new Date(note.updatedAt), "MMM d, yyyy h:mm a")}
            </span>
          )}
        </div>
      </div>
    </AppSheet>
  );
}

/* ========================================================================= */
/* DELETE NOTE DIALOG                                                        */
/* ========================================================================= */
interface DeleteNoteDialogProps {
  note: Note | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (id: string) => void;
}

export function DeleteNoteDialog({
  note,
  open,
  onOpenChange,
  onConfirm,
}: DeleteNoteDialogProps) {
  if (!note) return null;

  return (
    <AppDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Delete Note"
      description="Are you sure you want to permanently delete this note? This action cannot be undone."
      size="sm"
      footer={
        <div className="flex items-center justify-end gap-2 w-full">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={() => {
              onConfirm(note.id);
              onOpenChange(false);
            }}
          >
            Delete
          </Button>
        </div>
      }
    >
      <div className="rounded-lg border p-3 bg-destructive/5 text-xs text-foreground my-2 space-y-1">
        <div className="font-semibold text-sm">{note.title}</div>
        <p className="text-muted-foreground font-mono">{note.id}</p>
      </div>
    </AppDialog>
  );
}
