"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { format } from "date-fns";
import {
  ArrowLeft,
  Save,
  Eye,
  Trash2,
  SlidersHorizontal,
  Pin,
  Archive,
  Tag,
  Check,
  Copy,
  CheckCheck,
  FileText,
  ExternalLink,
} from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AppSheet } from "@/components/app-sheet";
import { toast } from "@/components/ui/toast";
import { useRouter, Link } from "@/i18n/routing";
import { useNotes } from "@/context/notes-provider";
import {
  QuickEditNoteDialog,
  DeleteNoteDialog,
} from "./components/note-dialogs";
import {
  type Note,
  type NoteColor,
  type NotePriority,
  NOTE_COLORS,
  getLabelColorClasses,
  getNoteColorClasses,
  getPriorityMeta,
} from "@/data/notes";
import { cn } from "@/lib/utils";

interface NoteEditFeatureProps {
  noteId: string;
}

interface NoteEditFormProps {
  note: Note | null | undefined;
  isNew: boolean;
}

function NoteEditForm({ note, isNew }: NoteEditFormProps) {
  const t = useTranslations("notes");
  const router = useRouter();
  const { updateNote, createNote, deleteNote, labels } = useNotes();

  // Form State
  const [title, setTitle] = React.useState(note?.title || "");
  const [content, setContent] = React.useState(note?.content || "");
  const [color, setColor] = React.useState<NoteColor>(note?.color || "default");
  const [priority, setPriority] = React.useState<NotePriority>(note?.priority || "low");
  const [pinned, setPinned] = React.useState<boolean>(note?.pinned ?? false);
  const [archived, setArchived] = React.useState<boolean>(note?.archived ?? false);
  const [labelIds, setLabelIds] = React.useState<string[]>(note?.labelIds || []);

  // UI State
  const [isSaving, setIsSaving] = React.useState(false);
  const [previewOpen, setPreviewOpen] = React.useState(false);
  const [quickEditOpen, setQuickEditOpen] = React.useState(false);
  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const [copiedId, setCopiedId] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState<"write" | "preview">("write");

  // Metrics calculation
  const metrics = React.useMemo(() => {
    const trimmed = content.trim();
    const wordCount = trimmed ? trimmed.split(/\s+/).length : 0;
    const charCount = content.length;
    const readingTime = Math.max(1, Math.ceil(wordCount / 200));
    return { wordCount, charCount, readingTime };
  }, [content]);

  const priorityMeta = getPriorityMeta(priority);
  const colorCardClass = getNoteColorClasses(color);

  const toggleLabel = (labelId: string) => {
    setLabelIds((prev) =>
      prev.includes(labelId)
        ? prev.filter((id) => id !== labelId)
        : [...prev, labelId]
    );
  };

  const handleCopyId = () => {
    if (!note?.id) return;
    navigator.clipboard.writeText(note.id);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!title.trim()) {
      toast.add({
        title: t("editor.validationError"),
        description: t("editor.titleRequired"),
      });
      return;
    }

    setIsSaving(true);
    try {
      if (isNew) {
        const created = createNote({
          title: title.trim(),
          content: content.trim(),
          color,
          priority,
          pinned,
          archived,
          labelIds,
        });

        toast.add({
          title: t("toasts.noteCreated"),
          description: t("toasts.noteCreatedDesc", { title: created.title }),
        });

        router.push(`/dashboard/notes/${created.id}`);
      } else if (note) {
        updateNote(note.id, {
          title: title.trim(),
          content: content.trim(),
          color,
          priority,
          pinned,
          archived,
          labelIds,
        });

        toast.add({
          title: t("toasts.noteUpdated"),
          description: t("toasts.noteUpdatedDesc"),
        });
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = (id: string) => {
    deleteNote(id);
    toast.add({
      title: t("toasts.noteDeleted"),
      description: t("toasts.noteDeletedDesc"),
    });
    router.push("/dashboard/notes");
  };

  const handleQuickEditSave = (id: string, updates: Partial<Note>) => {
    updateNote(id, updates);
    if (updates.title !== undefined) setTitle(updates.title);
    if (updates.content !== undefined) setContent(updates.content);
    if (updates.color !== undefined) setColor(updates.color);
    if (updates.priority !== undefined) setPriority(updates.priority);
    if (updates.pinned !== undefined) setPinned(updates.pinned);
    if (updates.archived !== undefined) setArchived(updates.archived);
    if (updates.labelIds !== undefined) setLabelIds(updates.labelIds);

    toast.add({
      title: t("toasts.noteUpdated"),
      description: t("toasts.noteUpdatedDesc"),
    });
  };

  const assignedLabels = React.useMemo(() => {
    return (labelIds || [])
      .map((id) => labels.find((l) => l.id === id))
      .filter((l): l is (typeof labels)[number] => Boolean(l));
  }, [labelIds, labels]);

  return (
    <div className="space-y-5 min-w-0 w-full pb-10">
      {/* Top Header / Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b">
        <div className="flex items-center gap-3 min-w-0">
          <Link
            href="/dashboard/notes"
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "h-8 gap-1.5 text-xs cursor-pointer shadow-xs shrink-0"
            )}
          >
            <ArrowLeft className="size-3.5" />
            <span>{t("editor.backToNotes")}</span>
          </Link>

          <div className="flex items-center gap-2 min-w-0">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight truncate">
              {isNew ? t("editor.createTitle") : title || note?.id}
            </h1>
            {!isNew && (
              <Badge
                variant="outline"
                className={cn("px-1.5 py-0 text-[10px] font-medium border shrink-0", priorityMeta.badgeClass)}
              >
                {t(`priority.${priority}`)}
              </Badge>
            )}
            {pinned && (
              <Badge variant="secondary" className="gap-1 text-[10px] shrink-0">
                <Pin className="size-3 rotate-45 fill-primary text-primary" />
                <span>{t("dialog.pinnedLabel")}</span>
              </Badge>
            )}
            {archived && (
              <Badge variant="secondary" className="text-[10px] shrink-0">
                {t("dialog.archivedLabel")}
              </Badge>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          {!isNew && note && (
            <>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setQuickEditOpen(true)}
                className="h-8 gap-1.5 text-xs cursor-pointer"
                title={t("actions.quickEdit")}
              >
                <SlidersHorizontal className="size-3.5" />
                <span className="hidden sm:inline">{t("actions.quickEdit")}</span>
              </Button>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setPreviewOpen(true)}
                className="h-8 gap-1.5 text-xs cursor-pointer"
                title={t("editor.preview")}
              >
                <Eye className="size-3.5" />
                <span className="hidden sm:inline">{t("editor.preview")}</span>
              </Button>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setDeleteOpen(true)}
                className="h-8 text-destructive hover:bg-destructive/10 text-xs cursor-pointer"
                title={t("actions.delete")}
              >
                <Trash2 className="size-3.5" />
                <span className="sr-only">{t("actions.delete")}</span>
              </Button>
            </>
          )}

          <Button
            type="button"
            size="sm"
            onClick={() => handleSave()}
            disabled={isSaving}
            className="h-8 gap-1.5 text-xs cursor-pointer shadow-xs font-medium"
          >
            <Save className="size-3.5" />
            <span>{isSaving ? t("editor.saving") : t("editor.saveChanges")}</span>
          </Button>
        </div>
      </div>

      {/* Main Grid: Content (8 cols) + Meta Sidebar (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Note Details & Content Editor */}
        <div className="lg:col-span-8 space-y-4">
          {/* Note Title Input */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center justify-between">
                <span>{t("editor.noteTitle")}</span>
                <span className="text-[11px] text-destructive font-normal">{t("dialog.titleRequired")}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={t("dialog.titlePlaceholder")}
                className="text-base font-semibold tracking-tight h-10"
                autoFocus={isNew}
              />
            </CardContent>
          </Card>

          {/* Content Editor with Write & Preview Tabs */}
          <Card className="flex flex-col">
            <CardHeader className="pb-3 border-b">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <CardTitle className="text-sm font-semibold">{t("editor.noteContent")}</CardTitle>
                  <CardDescription className="text-xs">
                    {t("editor.noteContentDesc")}
                  </CardDescription>
                </div>

                {/* Metrics & View Tabs */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 text-[11px] text-muted-foreground font-mono">
                    <span>{metrics.wordCount} {t("editor.words")}</span>
                    <span>•</span>
                    <span>{metrics.charCount} {t("editor.chars")}</span>
                    <span>•</span>
                    <span>{metrics.readingTime} {t("editor.minRead")}</span>
                  </div>

                  <Tabs
                    value={activeTab}
                    onValueChange={(val) => setActiveTab(val as "write" | "preview")}
                    className="w-auto"
                  >
                    <TabsList className="h-7 text-xs p-0.5">
                      <TabsTrigger value="write" className="text-xs h-6 px-2.5">
                        {t("editor.write")}
                      </TabsTrigger>
                      <TabsTrigger value="preview" className="text-xs h-6 px-2.5">
                        {t("editor.preview")}
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-4">
              {activeTab === "write" ? (
                <div className="space-y-2">
                  <Textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder={t("dialog.contentPlaceholder")}
                    rows={16}
                    className="min-h-[360px] font-mono text-xs sm:text-sm leading-relaxed p-4 resize-y bg-background"
                  />
                  <p className="text-[11px] text-muted-foreground">
                    {t("editor.tipFormatting")}
                  </p>
                </div>
              ) : (
                <div
                  className={cn(
                    "p-5 rounded-xl border text-sm leading-relaxed whitespace-pre-wrap break-words min-h-[360px]",
                    colorCardClass
                  )}
                >
                  {content.trim() ? (
                    content
                  ) : (
                    <span className="text-muted-foreground italic text-xs">
                      {t("editor.noContentPreview")}
                    </span>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Sidebar: Meta, Palette, Labels, Flags */}
        <div className="lg:col-span-4 space-y-4">
          {/* Note Card Color Selection */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center justify-between">
                <span>{t("editor.cardThemeColor")}</span>
                <span className="text-[11px] font-normal text-muted-foreground capitalize">
                  {t(`colors.${color}`)}
                </span>
              </CardTitle>
              <CardDescription className="text-xs">
                {t("editor.cardThemeDesc")}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                {NOTE_COLORS.map((c) => {
                  const isSelected = color === c.id;
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setColor(c.id)}
                      className={cn(
                        "flex items-center gap-2 p-2 rounded-lg text-xs font-medium border text-left transition-all cursor-pointer",
                        isSelected
                          ? "ring-2 ring-primary border-primary bg-primary/5 font-semibold"
                          : "hover:bg-muted/50 border-border"
                      )}
                    >
                      <span className={cn("size-3.5 rounded-full shrink-0 shadow-xs", c.bgDot)} />
                      <span className="truncate">{t(`colors.${c.id}`)}</span>
                    </button>
                  );
                })}
              </div>

              {/* Mini Card Preview */}
              <div className={cn("p-3 rounded-lg border text-xs space-y-1 transition-all", colorCardClass)}>
                <div className="font-semibold truncate">{title || t("editor.notePreview")}</div>
                <p className="text-[11px] text-muted-foreground line-clamp-2">
                  {content || t("editor.previewColorStyle")}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Priority & Status Controls */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">{t("editor.priorityAndStatus")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4"> 

              {/* Pin Switch */}
              <div className="flex items-center justify-between p-2.5 rounded-lg border bg-muted/20">
                <div className="space-y-0.5">
                  <Label className="text-xs font-semibold flex items-center gap-1.5 cursor-pointer">
                    <Pin className="size-3.5" />
                    <span>{t("editor.pinToTop")}</span>
                  </Label>
                  <p className="text-[11px] text-muted-foreground">
                    {t("editor.pinToTopDesc")}
                  </p>
                </div>
                <Switch checked={pinned} onCheckedChange={setPinned} />
              </div>

              {/* Archive Switch */}
              <div className="flex items-center justify-between p-2.5 rounded-lg border bg-muted/20">
                <div className="space-y-0.5">
                  <Label className="text-xs font-semibold flex items-center gap-1.5 cursor-pointer">
                    <Archive className="size-3.5" />
                    <span>{t("editor.archived")}</span>
                  </Label>
                  <p className="text-[11px] text-muted-foreground">
                    {t("editor.archivedDesc")}
                  </p>
                </div>
                <Switch checked={archived} onCheckedChange={setArchived} />
              </div>
            </CardContent>
          </Card>

          {/* Assigned Labels */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold">{t("editor.assignLabels")}</CardTitle>
                <Link
                  href="/dashboard/notes/labels"
                  className="text-[11px] text-primary hover:underline flex items-center gap-1"
                >
                  <span>{t("editor.manage")}</span>
                  <ExternalLink className="size-3" />
                </Link>
              </div>
              <CardDescription className="text-xs">
                {t("editor.assignLabelsDesc")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {labels.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {labels.map((lbl) => {
                    const isSelected = labelIds.includes(lbl.id);
                    const { badgeClass } = getLabelColorClasses(lbl.color);
                    return (
                      <button
                        key={lbl.id}
                        type="button"
                        onClick={() => toggleLabel(lbl.id)}
                        className={cn(
                          "inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium border transition-all cursor-pointer",
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
            </CardContent>
          </Card>

          {/* Note Info Card (Existing Note Only) */}
          {!isNew && note && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold">
                  {t("editor.metaTitle")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-xs">
                <div className="flex items-center justify-between py-1 border-b">
                  <span className="text-muted-foreground">{t("editor.id")}</span>
                  <div className="flex items-center gap-1">
                    <span className="font-mono font-semibold">{note.id}</span>
                    <button
                      type="button"
                      onClick={handleCopyId}
                      className="p-1 text-muted-foreground hover:text-foreground cursor-pointer"
                      title={t("actions.copy")}
                    >
                      {copiedId ? (
                        <CheckCheck className="size-3 text-emerald-500" />
                      ) : (
                        <Copy className="size-3" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between py-1 border-b">
                  <span className="text-muted-foreground">{t("editor.created")}</span>
                  <span className="font-mono text-muted-foreground">
                    {note.createdAt
                      ? format(new Date(note.createdAt), "MMM d, yyyy h:mm a")
                      : "-"}
                  </span>
                </div>

                <div className="flex items-center justify-between py-1">
                  <span className="text-muted-foreground">{t("editor.updated")}</span>
                  <span className="font-mono text-muted-foreground">
                    {note.updatedAt
                      ? format(new Date(note.updatedAt), "MMM d, yyyy h:mm a")
                      : "-"}
                  </span>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Preview Sheet */}
      <AppSheet
        open={previewOpen}
        onOpenChange={setPreviewOpen}
        title={title || t("editor.noteTitle")}
        description={note?.id || t("dialog.createTitle")}
        size="lg"
      >
        <div className="space-y-4 py-2">
          {/* Badges */}
          <div className="flex flex-wrap items-center gap-2 p-3 rounded-lg border bg-muted/20">
            <Badge
              variant="outline"
              className={cn("px-2 py-0.5 text-xs font-medium border", priorityMeta.badgeClass)}
            >
              {t("sheet.priorityBadge", { priority: t(`priority.${priority}`) })}
            </Badge>
            {pinned && (
              <Badge variant="secondary" className="gap-1 text-xs">
                <Pin className="size-3 rotate-45 fill-primary text-primary" />
                <span>{t("sheet.pinned")}</span>
              </Badge>
            )}
            {archived && (
              <Badge variant="secondary" className="text-xs">
                {t("sheet.archived")}
              </Badge>
            )}
          </div>

          {/* Assigned Labels */}
          {assignedLabels.length > 0 && (
            <div className="space-y-1.5">
              <span className="text-xs font-semibold text-muted-foreground">
                {t("sheet.labels")}
              </span>
              <div className="flex flex-wrap gap-1.5">
                {assignedLabels.map((lbl) => {
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

          {/* Content */}
          <div className="space-y-1.5">
            <span className="text-xs font-semibold text-muted-foreground">
              {t("sheet.content")}
            </span>
            <div
              className={cn(
                "p-4 rounded-xl border text-sm leading-relaxed whitespace-pre-wrap break-words min-h-[200px]",
                colorCardClass
              )}
            >
              {content || (
                <span className="text-muted-foreground italic">
                  {t("sheet.noContent")}
                </span>
              )}
            </div>
          </div>
        </div>
      </AppSheet>

      {/* Quick Edit Dialog (Triggered from within full editor) */}
      {!isNew && note && (
        <QuickEditNoteDialog
          note={{
            ...note,
            title,
            content,
            color,
            priority,
            pinned,
            archived,
            labelIds,
          }}
          open={quickEditOpen}
          onOpenChange={setQuickEditOpen}
          labels={labels}
          onUpdate={handleQuickEditSave}
        />
      )}

      {/* Delete Dialog */}
      {!isNew && note && (
        <DeleteNoteDialog
          note={note}
          open={deleteOpen}
          onOpenChange={setDeleteOpen}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
}

export function NoteEditFeature({ noteId }: NoteEditFeatureProps) {
  const t = useTranslations("notes");
  const { getNote } = useNotes();
  const isNew = noteId === "new";
  const note = isNew ? null : getNote(noteId);

  if (!isNew && !note) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[360px] text-center space-y-3 p-8 rounded-xl border border-dashed bg-card/40 my-6">
        <div className="size-12 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
          <FileText className="size-6" />
        </div>
        <h2 className="text-xl font-bold">{t("editor.noteNotFound")}</h2>
        <p className="text-xs sm:text-sm text-muted-foreground max-w-sm">
          {t("editor.noteNotFoundDesc")}
        </p>
        <Link
          href="/dashboard/notes"
          className={cn(buttonVariants({ variant: "outline", size: "sm" }), "gap-1.5 mt-2")}
        >
          <ArrowLeft className="size-3.5" />
          <span>{t("editor.backToNotes")}</span>
        </Link>
      </div>
    );
  }

  return (
    <NoteEditForm
      key={note?.id || "new"}
      note={note}
      isNew={isNew}
    />
  );
}
