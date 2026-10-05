import notesData from "./notes.json";

export type NotePriority = "low" | "medium" | "high" | "urgent";

export type NoteColor =
  | "default"
  | "blue"
  | "emerald"
  | "amber"
  | "rose"
  | "violet"
  | "cyan"
  | "orange";

export interface NoteLabel {
  id: string;
  name: string;
  slug: string;
  color: string;
  description?: string;
  createdAt: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  labelIds: string[];
  color: NoteColor;
  pinned: boolean;
  archived: boolean;
  priority: NotePriority;
  createdAt: string;
  updatedAt: string;
}

export const notes: Note[] = notesData.notes as Note[];
export const labels: NoteLabel[] = notesData.labels as NoteLabel[];

export const NOTE_COLORS: {
  id: NoteColor;
  name: string;
  cardClass: string;
  borderClass: string;
  bgDot: string;
}[] = [
  {
    id: "default",
    name: "Default",
    cardClass: "bg-card text-card-foreground border-border hover:border-foreground/20",
    borderClass: "border-border",
    bgDot: "bg-muted-foreground",
  },
  {
    id: "blue",
    name: "Blue",
    cardClass:
      "bg-blue-50/80 dark:bg-blue-950/25 border-blue-200 dark:border-blue-900/50 text-blue-950 dark:text-blue-100 hover:border-blue-400 dark:hover:border-blue-700",
    borderClass: "border-blue-200 dark:border-blue-900/50",
    bgDot: "bg-blue-500",
  },
  {
    id: "emerald",
    name: "Green",
    cardClass:
      "bg-emerald-50/80 dark:bg-emerald-950/25 border-emerald-200 dark:border-emerald-900/50 text-emerald-950 dark:text-emerald-100 hover:border-emerald-400 dark:hover:border-emerald-700",
    borderClass: "border-emerald-200 dark:border-emerald-900/50",
    bgDot: "bg-emerald-500",
  },
  {
    id: "amber",
    name: "Amber",
    cardClass:
      "bg-amber-50/80 dark:bg-amber-950/25 border-amber-200 dark:border-amber-900/50 text-amber-950 dark:text-amber-100 hover:border-amber-400 dark:hover:border-amber-700",
    borderClass: "border-amber-200 dark:border-amber-900/50",
    bgDot: "bg-amber-500",
  },
  {
    id: "rose",
    name: "Rose",
    cardClass:
      "bg-rose-50/80 dark:bg-rose-950/25 border-rose-200 dark:border-rose-900/50 text-rose-950 dark:text-rose-100 hover:border-rose-400 dark:hover:border-rose-700",
    borderClass: "border-rose-200 dark:border-rose-900/50",
    bgDot: "bg-rose-500",
  },
  {
    id: "violet",
    name: "Purple",
    cardClass:
      "bg-violet-50/80 dark:bg-violet-950/25 border-violet-200 dark:border-violet-900/50 text-violet-950 dark:text-violet-100 hover:border-violet-400 dark:hover:border-violet-700",
    borderClass: "border-violet-200 dark:border-violet-900/50",
    bgDot: "bg-violet-500",
  },
  {
    id: "cyan",
    name: "Cyan",
    cardClass:
      "bg-cyan-50/80 dark:bg-cyan-950/25 border-cyan-200 dark:border-cyan-900/50 text-cyan-950 dark:text-cyan-100 hover:border-cyan-400 dark:hover:border-cyan-700",
    borderClass: "border-cyan-200 dark:border-cyan-900/50",
    bgDot: "bg-cyan-500",
  },
  {
    id: "orange",
    name: "Orange",
    cardClass:
      "bg-orange-50/80 dark:bg-orange-950/25 border-orange-200 dark:border-orange-900/50 text-orange-950 dark:text-orange-100 hover:border-orange-400 dark:hover:border-orange-700",
    borderClass: "border-orange-200 dark:border-orange-900/50",
    bgDot: "bg-orange-500",
  },
];

export const LABEL_COLORS = [
  { id: "blue", name: "Blue", badgeClass: "bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/20", dotClass: "bg-blue-500" },
  { id: "emerald", name: "Emerald", badgeClass: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20", dotClass: "bg-emerald-500" },
  { id: "amber", name: "Amber", badgeClass: "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20", dotClass: "bg-amber-500" },
  { id: "rose", name: "Rose", badgeClass: "bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/20", dotClass: "bg-rose-500" },
  { id: "violet", name: "Violet", badgeClass: "bg-violet-500/10 text-violet-700 dark:text-violet-300 border-violet-500/20", dotClass: "bg-violet-500" },
  { id: "cyan", name: "Cyan", badgeClass: "bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border-cyan-500/20", dotClass: "bg-cyan-500" },
  { id: "orange", name: "Orange", badgeClass: "bg-orange-500/10 text-orange-700 dark:text-orange-300 border-orange-500/20", dotClass: "bg-orange-500" },
  { id: "teal", name: "Teal", badgeClass: "bg-teal-500/10 text-teal-700 dark:text-teal-300 border-teal-500/20", dotClass: "bg-teal-500" },
  { id: "indigo", name: "Indigo", badgeClass: "bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border-indigo-500/20", dotClass: "bg-indigo-500" },
];

export function getNoteColorClasses(color?: NoteColor): string {
  const found = NOTE_COLORS.find((c) => c.id === color);
  return found ? found.cardClass : NOTE_COLORS[0].cardClass;
}

export function getLabelColorClasses(colorName?: string): { badgeClass: string; dotClass: string } {
  const found = LABEL_COLORS.find(
    (c) => c.id.toLowerCase() === (colorName || "").toLowerCase()
  );
  if (found) return found;
  return {
    badgeClass: "bg-muted text-muted-foreground border-border",
    dotClass: "bg-muted-foreground",
  };
}

export function getPriorityMeta(priority: NotePriority): {
  label: string;
  badgeClass: string;
} {
  switch (priority) {
    case "urgent":
      return {
        label: "Urgent",
        badgeClass: "bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/20",
      };
    case "high":
      return {
        label: "High",
        badgeClass: "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20",
      };
    case "medium":
      return {
        label: "Medium",
        badgeClass: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20",
      };
    case "low":
    default:
      return {
        label: "Low",
        badgeClass: "bg-slate-500/10 text-slate-700 dark:text-slate-400 border-slate-500/20",
      };
  }
}
