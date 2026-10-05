"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AlertCircle, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AppDialog } from "@/components/app-dialog";
import {
  type NoteLabel,
  LABEL_COLORS,
  getLabelColorClasses,
} from "@/data/notes";
import { cn } from "@/lib/utils";

const labelFormSchema = z.object({
  name: z.string().min(1, "Label name is required"),
  slug: z.string().min(1, "Slug is required"),
  color: z.string(),
  description: z.string().optional(),
});

type LabelFormValues = z.infer<typeof labelFormSchema>;

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-");
}

/* ========================================================================= */
/* CREATE LABEL DIALOG                                                       */
/* ========================================================================= */
interface CreateLabelDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (labelData: Omit<NoteLabel, "id" | "createdAt">) => void;
}

export function CreateLabelDialog({
  open,
  onOpenChange,
  onCreate,
}: CreateLabelDialogProps) {
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = React.useState(false);

  const form = useForm<LabelFormValues>({
    resolver: zodResolver(labelFormSchema),
    defaultValues: {
      name: "",
      slug: "",
      color: "blue",
      description: "",
    },
  });

  React.useEffect(() => {
    if (open) {
      form.reset({
        name: "",
        slug: "",
        color: "blue",
        description: "",
      });
      setIsSlugManuallyEdited(false);
    }
  }, [open, form]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    form.setValue("name", val);
    if (!isSlugManuallyEdited) {
      form.setValue("slug", slugify(val));
    }
  };

  const onSubmit = (data: LabelFormValues) => {
    onCreate({
      name: data.name.trim(),
      slug: slugify(data.slug.trim() || data.name.trim()),
      color: data.color,
      description: data.description?.trim() || "",
    });
    onOpenChange(false);
  };

  const selectedColor = form.watch("color");

  return (
    <AppDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Create New Label"
      description="Create a taxonomy label to classify and filter your notes."
      size="md"
    >
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Name */}
        <div className="space-y-1.5">
          <Label htmlFor="create-label-name" className="text-xs font-semibold">
            Label Name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="create-label-name"
            placeholder="e.g. Work, Ideas, Architecture"
            {...form.register("name")}
            onChange={handleNameChange}
            autoFocus
          />
          {form.formState.errors.name && (
            <p className="text-[11px] text-destructive">
              {form.formState.errors.name.message}
            </p>
          )}
        </div>

        {/* Slug */}
        <div className="space-y-1.5">
          <Label htmlFor="create-label-slug" className="text-xs font-semibold">
            Slug <span className="text-destructive">*</span>
          </Label>
          <div className="relative">
            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-mono text-muted-foreground select-none">
              #
            </span>
            <Input
              id="create-label-slug"
              placeholder="work"
              className="pl-6 font-mono text-xs"
              {...form.register("slug")}
              onChange={(e) => {
                setIsSlugManuallyEdited(true);
                form.setValue("slug", e.target.value);
              }}
            />
          </div>
          {form.formState.errors.slug && (
            <p className="text-[11px] text-destructive">
              {form.formState.errors.slug.message}
            </p>
          )}
        </div>

        {/* Color Palette */}
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold">Color Accent</Label>
          <div className="flex flex-wrap gap-2 pt-0.5">
            {LABEL_COLORS.map((c) => {
              const isSelected = selectedColor === c.id;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => form.setValue("color", c.id)}
                  className={cn(
                    "flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs border transition-all cursor-pointer",
                    isSelected
                      ? cn(c.badgeClass, "ring-2 ring-primary ring-offset-1 font-semibold")
                      : "bg-background text-muted-foreground border-border hover:bg-muted"
                  )}
                >
                  <span className={cn("size-2.5 rounded-full shrink-0", c.dotClass)} />
                  <span>{c.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Description */}
        <div className="space-y-1.5">
          <Label htmlFor="create-label-desc" className="text-xs font-semibold">
            Description <span className="text-muted-foreground font-normal">(Optional)</span>
          </Label>
          <Textarea
            id="create-label-desc"
            placeholder="Brief explanation of when to apply this label..."
            rows={2}
            className="min-h-[70px]"
            {...form.register("description")}
          />
        </div>

        {/* Actions Footer */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button type="submit">Create Label</Button>
        </div>
      </form>
    </AppDialog>
  );
}

/* ========================================================================= */
/* EDIT LABEL DIALOG                                                         */
/* ========================================================================= */
interface EditLabelDialogProps {
  label: NoteLabel | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: (id: string, updates: Partial<NoteLabel>) => void;
}

export function EditLabelDialog({
  label,
  open,
  onOpenChange,
  onUpdate,
}: EditLabelDialogProps) {
  const form = useForm<LabelFormValues>({
    resolver: zodResolver(labelFormSchema),
    defaultValues: {
      name: "",
      slug: "",
      color: "blue",
      description: "",
    },
  });

  React.useEffect(() => {
    if (label && open) {
      form.reset({
        name: label.name,
        slug: label.slug,
        color: label.color,
        description: label.description || "",
      });
    }
  }, [label, open, form]);

  if (!label) return null;

  const onSubmit = (data: LabelFormValues) => {
    onUpdate(label.id, {
      name: data.name.trim(),
      slug: slugify(data.slug.trim() || data.name.trim()),
      color: data.color,
      description: data.description?.trim() || "",
    });
    onOpenChange(false);
  };

  const selectedColor = form.watch("color");

  return (
    <AppDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Edit Label"
      description="Update label title, slug, color, and description."
      size="md"
    >
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Name */}
        <div className="space-y-1.5">
          <Label htmlFor="edit-label-name" className="text-xs font-semibold">
            Label Name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="edit-label-name"
            placeholder="e.g. Work, Ideas"
            {...form.register("name")}
          />
          {form.formState.errors.name && (
            <p className="text-[11px] text-destructive">
              {form.formState.errors.name.message}
            </p>
          )}
        </div>

        {/* Slug */}
        <div className="space-y-1.5">
          <Label htmlFor="edit-label-slug" className="text-xs font-semibold">
            Slug <span className="text-destructive">*</span>
          </Label>
          <div className="relative">
            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-mono text-muted-foreground select-none">
              #
            </span>
            <Input
              id="edit-label-slug"
              placeholder="work"
              className="pl-6 font-mono text-xs"
              {...form.register("slug")}
            />
          </div>
          {form.formState.errors.slug && (
            <p className="text-[11px] text-destructive">
              {form.formState.errors.slug.message}
            </p>
          )}
        </div>

        {/* Color Palette */}
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold">Color Accent</Label>
          <div className="flex flex-wrap gap-2 pt-0.5">
            {LABEL_COLORS.map((c) => {
              const isSelected = selectedColor === c.id;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => form.setValue("color", c.id)}
                  className={cn(
                    "flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs border transition-all cursor-pointer",
                    isSelected
                      ? cn(c.badgeClass, "ring-2 ring-primary ring-offset-1 font-semibold")
                      : "bg-background text-muted-foreground border-border hover:bg-muted"
                  )}
                >
                  <span className={cn("size-2.5 rounded-full shrink-0", c.dotClass)} />
                  <span>{c.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Description */}
        <div className="space-y-1.5">
          <Label htmlFor="edit-label-desc" className="text-xs font-semibold">
            Description <span className="text-muted-foreground font-normal">(Optional)</span>
          </Label>
          <Textarea
            id="edit-label-desc"
            placeholder="Optional description..."
            rows={2}
            className="min-h-[70px]"
            {...form.register("description")}
          />
        </div>

        {/* Actions Footer */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t">
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
/* DELETE LABEL DIALOG                                                       */
/* ========================================================================= */
interface DeleteLabelDialogProps {
  label: NoteLabel | null;
  notesCount: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (id: string) => void;
}

export function DeleteLabelDialog({
  label,
  notesCount,
  open,
  onOpenChange,
  onConfirm,
}: DeleteLabelDialogProps) {
  if (!label) return null;

  const { badgeClass } = getLabelColorClasses(label.color);

  return (
    <AppDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Delete Label"
      description="Are you sure you want to permanently remove this label?"
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
              onConfirm(label.id);
              onOpenChange(false);
            }}
          >
            Delete
          </Button>
        </div>
      }
    >
      <div className="space-y-3 my-2 text-xs">
        <div className="flex items-center gap-2 p-2.5 rounded-lg border bg-muted/20">
          <span
            className={cn(
              "inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium border",
              badgeClass
            )}
          >
            <Tag className="size-3" />
            <span>#{label.name}</span>
          </span>
          <span className="text-muted-foreground font-mono">({label.slug})</span>
        </div>

        {notesCount > 0 ? (
          <div className="flex items-start gap-2 p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-300">
            <AlertCircle className="size-4 shrink-0 mt-0.5" />
            <span>
              This label is currently attached to <strong>{notesCount}</strong>{" "}
              {notesCount === 1 ? "note" : "notes"}. It will be safely unlinked from
              those notes upon deletion.
            </span>
          </div>
        ) : (
          <p className="text-muted-foreground">
            No notes are currently using this label.
          </p>
        )}
      </div>
    </AppDialog>
  );
}
