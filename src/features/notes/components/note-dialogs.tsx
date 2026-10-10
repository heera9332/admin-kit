"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
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
  SlidersHorizontal,
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
  const t = useTranslations("notes");
  const tCommon = useTranslations("common");

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
      title={t("dialog.createTitle")}
      description={t("dialog.createDescription")}
      size="2xl"
    >
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Title */}
        <div className="space-y-1.5">
          <Label htmlFor="create-note-title" className="text-xs font-semibold">
            {t("dialog.titleLabel")} <span className="text-destructive">*</span>
          </Label>
          <Input
            id="create-note-title"
            placeholder={t("dialog.titlePlaceholder")}
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
            {t("dialog.contentLabel")}
          </Label>
          <Textarea
            id="create-note-content"
            rows={5}
            placeholder={t("dialog.contentPlaceholder")}
            className="min-h-[120px]"
            {...form.register("content")}
          />
        </div>

        {/* Labels Selection */}
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold flex items-center justify-between">
            <span>{t("dialog.assignLabels")}</span>
            <span className="text-[11px] text-muted-foreground font-normal">
              {t("dialog.selectedCount", { count: selectedLabels.length })}
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
              {t("dialog.noLabelsDefined")}
            </p>
          )}
        </div>

        {/* Pin toggle */}
        <div className="flex items-center justify-between p-2.5 rounded-lg border bg-muted/20">
          <div className="space-y-0.5">
            <Label className="text-xs font-semibold flex items-center gap-1.5 cursor-pointer">
              <Pin className="size-3.5" />
              <span>{t("dialog.pinToTop")}</span>
            </Label>
            <p className="text-[11px] text-muted-foreground">
              {t("dialog.pinToTopDesc")}
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
 
          

        {/* Actions Footer */}
        <div className="flex items-center justify-end gap-2 pt-3 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            {tCommon("cancel")}
          </Button>
          <Button type="submit">{t("dialog.create")}</Button>
        </div>
      </form>
    </AppDialog>
  );
}

/* ========================================================================= */
/* QUICK EDIT NOTE DIALOG                                                    */
/* ========================================================================= */
export interface QuickEditNoteDialogProps {
  note: Note | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  labels: NoteLabel[];
  onUpdate: (id: string, updates: Partial<Note>) => void;
  onFullEdit?: (note: Note) => void;
}

export function QuickEditNoteDialog({
  note,
  open,
  onOpenChange,
  labels,
  onUpdate,
  onFullEdit,
}: QuickEditNoteDialogProps) {
  const t = useTranslations("notes");
  const tCommon = useTranslations("common");

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
      title={t("dialog.quickEditTitle")}
      description={t("dialog.quickEditDescription")}
      size="2xl"
    >
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Title */}
        <div className="space-y-1.5">
          <Label htmlFor="edit-note-title" className="text-xs font-semibold">
            {t("dialog.titleLabel")} <span className="text-destructive">*</span>
          </Label>
          <Input
            id="edit-note-title"
            placeholder={t("dialog.titlePlaceholder")}
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
            {t("dialog.contentLabel")}
          </Label>
          <Textarea
            id="edit-note-content"
            rows={5}
            placeholder={t("dialog.contentPlaceholder")}
            className="min-h-[120px]"
            {...form.register("content")}
          />
        </div>

        {/* Labels Selection */}
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold flex items-center justify-between">
            <span>{t("dialog.assignLabels")}</span>
            <span className="text-[11px] text-muted-foreground font-normal">
              {t("dialog.selectedCount", { count: selectedLabels.length })}
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
              {t("dialog.noLabelsEdit")}
            </p>
          )}
        </div>

        {/* Color Palette & Priority & Pinned / Archived Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          {/* Priority */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">{t("dialog.priorityLabel")}</Label>
            <Controller
              control={form.control}
              name="priority"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full h-9">
                    <SelectValue placeholder={t("dialog.priorityLabel")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">{t("priority.low")}</SelectItem>
                    <SelectItem value="medium">{t("priority.medium")}</SelectItem>
                    <SelectItem value="high">{t("priority.high")}</SelectItem>
                    <SelectItem value="urgent">{t("priority.urgent")}</SelectItem>
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
                <span>{t("dialog.pinnedLabel")}</span>
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
              <Label className="text-xs font-semibold">{t("dialog.archivedLabel")}</Label>
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
          <Label className="text-xs font-semibold">{t("dialog.cardColor")}</Label>
          <div className="flex flex-wrap gap-2 pt-0.5">
            {NOTE_COLORS.map((c) => {
              const isSelected = selectedColor === c.id;
              const colorName = t(`colors.${c.id}`);
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => form.setValue("color", c.id)}
                  title={colorName}
                  className={cn(
                    "flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs border transition-all cursor-pointer",
                    isSelected
                      ? "ring-2 ring-primary ring-offset-1 font-semibold"
                      : "opacity-75 hover:opacity-100"
                  )}
                >
                  <span className={cn("size-3 rounded-full shrink-0", c.bgDot)} />
                  <span>{colorName}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Actions Footer */}
        <div className="flex items-center justify-between gap-2 pt-3 border-t">
          {onFullEdit ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                onOpenChange(false);
                onFullEdit(note);
              }}
              className="text-xs gap-1.5 cursor-pointer text-muted-foreground hover:text-foreground"
            >
              <Pencil className="size-3.5" />
              <span>{t("dialog.openFullEdit")}</span>
            </Button>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
            >
              {tCommon("cancel")}
            </Button>
            <Button type="submit" size="sm">{t("dialog.save")}</Button>
          </div>
        </div>
      </form>
    </AppDialog>
  );
}

export const EditNoteDialog = QuickEditNoteDialog;
export type EditNoteDialogProps = QuickEditNoteDialogProps;

/* ========================================================================= */
/* VIEW NOTE SHEET                                                           */
/* ========================================================================= */
export interface ViewNoteSheetProps {
  note: Note | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  labels: NoteLabel[];
  onQuickEdit?: (note: Note) => void;
  onFullEdit?: (note: Note) => void;
  onEdit?: (note: Note) => void;
  onDelete: (note: Note) => void;
  onTogglePin: (id: string) => void;
}

export function ViewNoteSheet({
  note,
  open,
  onOpenChange,
  labels,
  onQuickEdit,
  onFullEdit,
  onEdit,
  onDelete,
  onTogglePin,
}: ViewNoteSheetProps) {
  const t = useTranslations("notes");
  const tCommon = useTranslations("common");
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
            {t("sheet.delete")}
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
                  {t("sheet.copied")}
                </>
              ) : (
                <>
                  <Copy className="size-3.5 mr-1" />
                  {t("sheet.copy")}
                </>
              )}
            </Button>
            {(onQuickEdit || onEdit) && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  onOpenChange(false);
                  if (onQuickEdit) {
                    onQuickEdit(note);
                  } else if (onEdit) {
                    onEdit(note);
                  }
                }}
              >
                <SlidersHorizontal className="size-3.5 mr-1" />
                {t("sheet.quickEdit")}
              </Button>
            )}
            {(onFullEdit || onEdit) && (
              <Button
                type="button"
                size="sm"
                onClick={() => {
                  onOpenChange(false);
                  if (onFullEdit) {
                    onFullEdit(note);
                  } else if (onEdit) {
                    onEdit(note);
                  }
                }}
              >
                <Pencil className="size-3.5 mr-1" />
                {t("sheet.fullEdit")}
              </Button>
            )}
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
            {t("sheet.priorityBadge", { priority: t(`priority.${note.priority}`) })}
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
            <span>{note.pinned ? t("sheet.pinned") : t("sheet.pinToTop")}</span>
          </Button>

          {/* Archived */}
          {note.archived && (
            <Badge variant="secondary" className="text-xs">
              {t("sheet.archived")}
            </Badge>
          )}
        </div>

        {/* Assigned Labels */}
        {noteLabels.length > 0 && (
          <div className="space-y-1.5">
            <span className="text-xs font-semibold text-muted-foreground">
              {t("sheet.labels")}
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
            {t("sheet.content")}
          </span>
          <div
            className={cn(
              "p-4 rounded-xl border text-sm leading-relaxed whitespace-pre-wrap break-words min-h-[160px]",
              colorCardClass
            )}
          >
            {note.content || (
              <span className="text-muted-foreground italic">
                {t("sheet.noContent")}
              </span>
            )}
          </div>
        </div>

        {/* Timestamps */}
        <div className="flex items-center justify-between text-xs text-muted-foreground pt-4 border-t">
          <div className="flex items-center gap-1.5">
            <Calendar className="size-3.5" />
            <span>
              {t("sheet.created")}:{" "}
              {note.createdAt
                ? format(new Date(note.createdAt), "MMM d, yyyy h:mm a")
                : "-"}
            </span>
          </div>
          {note.updatedAt && (
            <span>
              {t("sheet.updated")}: {format(new Date(note.updatedAt), "MMM d, yyyy h:mm a")}
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
  const t = useTranslations("notes");
  const tCommon = useTranslations("common");

  if (!note) return null;

  return (
    <AppDialog
      open={open}
      onOpenChange={onOpenChange}
      title={t("dialog.deleteTitle")}
      description={t("dialog.deleteDescription")}
      size="sm"
      footer={
        <div className="flex items-center justify-end gap-2 w-full">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            {tCommon("cancel")}
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={() => {
              onConfirm(note.id);
              onOpenChange(false);
            }}
          >
            {tCommon("delete")}
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
