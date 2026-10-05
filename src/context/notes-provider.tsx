"use client";

import * as React from "react";
import {
  notes as initialNotes,
  labels as initialLabels,
  type Note,
  type NoteLabel,
} from "@/data/notes";

interface NotesContextType {
  notes: Note[];
  labels: NoteLabel[];
  getNote: (id: string) => Note | undefined;
  getLabel: (id: string) => NoteLabel | undefined;
  createNote: (data: Omit<Note, "id" | "createdAt" | "updatedAt">) => Note;
  updateNote: (id: string, updates: Partial<Note>) => void;
  deleteNote: (id: string) => void;
  togglePin: (id: string) => void;
  toggleArchive: (id: string) => void;
  duplicateNote: (id: string) => Note | undefined;
  createLabel: (data: Omit<NoteLabel, "id" | "createdAt">) => NoteLabel;
  updateLabel: (id: string, updates: Partial<NoteLabel>) => void;
  deleteLabel: (id: string) => void;
  getNotesCountForLabel: (labelId: string) => number;
}

const NotesContext = React.createContext<NotesContextType | undefined>(undefined);

const NOTES_STORAGE_KEY = "admin_notes_list";
const LABELS_STORAGE_KEY = "admin_notes_labels_list";

let memoryNotes: Note[] = initialNotes;
let memoryLabels: NoteLabel[] = initialLabels;
let isInitialized = false;

function initStorage() {
  if (isInitialized || typeof window === "undefined") return;
  try {
    const savedNotes = localStorage.getItem(NOTES_STORAGE_KEY);
    if (savedNotes) {
      const parsedNotes = JSON.parse(savedNotes);
      if (Array.isArray(parsedNotes) && parsedNotes.length > 0) {
        memoryNotes = parsedNotes;
      }
    }
    const savedLabels = localStorage.getItem(LABELS_STORAGE_KEY);
    if (savedLabels) {
      const parsedLabels = JSON.parse(savedLabels);
      if (Array.isArray(parsedLabels) && parsedLabels.length > 0) {
        memoryLabels = parsedLabels;
      }
    }
  } catch {
    // Ignore localStorage parse errors
  }
  isInitialized = true;
}

const listeners = new Set<() => void>();

function subscribe(callback: () => void) {
  listeners.add(callback);
  return () => {
    listeners.delete(callback);
  };
}

function notify() {
  listeners.forEach((l) => l());
}

function persistNotes(newNotes: Note[]) {
  memoryNotes = newNotes;
  notify();
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(newNotes));
    } catch {
      // Ignore write errors
    }
  }
}

function persistLabels(newLabels: NoteLabel[]) {
  memoryLabels = newLabels;
  notify();
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(LABELS_STORAGE_KEY, JSON.stringify(newLabels));
    } catch {
      // Ignore write errors
    }
  }
}

function generateNoteId(): string {
  return `NOTE-${Math.floor(100 + Math.random() * 900)}`;
}

function generateLabelId(): string {
  return `lbl-${Math.floor(10 + Math.random() * 90)}`;
}

export function NotesProvider({ children }: { children: React.ReactNode }) {
  React.useEffect(() => {
    initStorage();
    notify();
  }, []);

  const notesSnapshot = React.useSyncExternalStore(
    subscribe,
    () => {
      initStorage();
      return memoryNotes;
    },
    () => initialNotes
  );

  const labelsSnapshot = React.useSyncExternalStore(
    subscribe,
    () => {
      initStorage();
      return memoryLabels;
    },
    () => initialLabels
  );

  const getNote = React.useCallback(
    (id: string) => notesSnapshot.find((n) => n.id === id),
    [notesSnapshot]
  );

  const getLabel = React.useCallback(
    (id: string) => labelsSnapshot.find((l) => l.id === id),
    [labelsSnapshot]
  );

  const getNotesCountForLabel = React.useCallback(
    (labelId: string) =>
      notesSnapshot.filter((n) => n.labelIds?.includes(labelId)).length,
    [notesSnapshot]
  );

  const createNote = React.useCallback(
    (data: Omit<Note, "id" | "createdAt" | "updatedAt">) => {
      const now = new Date().toISOString();
      const newNote: Note = {
        id: generateNoteId(),
        title: data.title,
        content: data.content || "",
        labelIds: data.labelIds || [],
        color: data.color || "default",
        pinned: data.pinned ?? false,
        archived: data.archived ?? false,
        priority: data.priority || "low",
        createdAt: now,
        updatedAt: now,
      };
      persistNotes([newNote, ...notesSnapshot]);
      return newNote;
    },
    [notesSnapshot]
  );

  const updateNote = React.useCallback(
    (id: string, updates: Partial<Note>) => {
      const updated = notesSnapshot.map((n) =>
        n.id === id
          ? {
              ...n,
              ...updates,
              updatedAt: new Date().toISOString(),
            }
          : n
      );
      persistNotes(updated);
    },
    [notesSnapshot]
  );

  const deleteNote = React.useCallback(
    (id: string) => {
      const filtered = notesSnapshot.filter((n) => n.id !== id);
      persistNotes(filtered);
    },
    [notesSnapshot]
  );

  const togglePin = React.useCallback(
    (id: string) => {
      const updated = notesSnapshot.map((n) =>
        n.id === id
          ? {
              ...n,
              pinned: !n.pinned,
              updatedAt: new Date().toISOString(),
            }
          : n
      );
      persistNotes(updated);
    },
    [notesSnapshot]
  );

  const toggleArchive = React.useCallback(
    (id: string) => {
      const updated = notesSnapshot.map((n) =>
        n.id === id
          ? {
              ...n,
              archived: !n.archived,
              updatedAt: new Date().toISOString(),
            }
          : n
      );
      persistNotes(updated);
    },
    [notesSnapshot]
  );

  const duplicateNote = React.useCallback(
    (id: string) => {
      const target = notesSnapshot.find((n) => n.id === id);
      if (!target) return undefined;
      const now = new Date().toISOString();
      const duplicated: Note = {
        ...target,
        id: generateNoteId(),
        title: `${target.title} (Copy)`,
        createdAt: now,
        updatedAt: now,
      };
      persistNotes([duplicated, ...notesSnapshot]);
      return duplicated;
    },
    [notesSnapshot]
  );

  const createLabel = React.useCallback(
    (data: Omit<NoteLabel, "id" | "createdAt">) => {
      const newLabel: NoteLabel = {
        id: generateLabelId(),
        name: data.name,
        slug:
          data.slug ||
          data.name
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, "")
            .replace(/[\s_-]+/g, "-"),
        color: data.color || "blue",
        description: data.description || "",
        createdAt: new Date().toISOString(),
      };
      persistLabels([...labelsSnapshot, newLabel]);
      return newLabel;
    },
    [labelsSnapshot]
  );

  const updateLabel = React.useCallback(
    (id: string, updates: Partial<NoteLabel>) => {
      const updated = labelsSnapshot.map((l) =>
        l.id === id ? { ...l, ...updates } : l
      );
      persistLabels(updated);
    },
    [labelsSnapshot]
  );

  const deleteLabel = React.useCallback(
    (id: string) => {
      // Remove label
      const remainingLabels = labelsSnapshot.filter((l) => l.id !== id);
      persistLabels(remainingLabels);

      // Clean up notes referencing this label
      const cleanedNotes = notesSnapshot.map((note) => {
        if (note.labelIds?.includes(id)) {
          return {
            ...note,
            labelIds: note.labelIds.filter((lid) => lid !== id),
            updatedAt: new Date().toISOString(),
          };
        }
        return note;
      });
      persistNotes(cleanedNotes);
    },
    [labelsSnapshot, notesSnapshot]
  );

  const value = React.useMemo<NotesContextType>(
    () => ({
      notes: notesSnapshot,
      labels: labelsSnapshot,
      getNote,
      getLabel,
      createNote,
      updateNote,
      deleteNote,
      togglePin,
      toggleArchive,
      duplicateNote,
      createLabel,
      updateLabel,
      deleteLabel,
      getNotesCountForLabel,
    }),
    [
      notesSnapshot,
      labelsSnapshot,
      getNote,
      getLabel,
      createNote,
      updateNote,
      deleteNote,
      togglePin,
      toggleArchive,
      duplicateNote,
      createLabel,
      updateLabel,
      deleteLabel,
      getNotesCountForLabel,
    ]
  );

  return <NotesContext.Provider value={value}>{children}</NotesContext.Provider>;
}

export function useNotes() {
  const context = React.useContext(NotesContext);
  if (!context) {
    throw new Error("useNotes must be used within a NotesProvider");
  }
  return context;
}
