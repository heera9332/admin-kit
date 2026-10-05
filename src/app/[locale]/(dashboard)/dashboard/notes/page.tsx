import * as React from "react";
import type { Metadata } from "next";
import { NotesFeature } from "@/features/notes";

export const metadata: Metadata = {
  title: "Notes",
  description: "Manage notes, brainstorm ideas, and organize thoughts with custom labels",
};

export default function NotesPage() {
  return (
    <React.Suspense
      fallback={
        <div className="space-y-4 p-4 animate-pulse">
          <div className="h-8 w-48 bg-muted rounded" />
          <div className="h-4 w-72 bg-muted rounded" />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-40 rounded-xl bg-muted/60" />
            ))}
          </div>
        </div>
      }
    >
      <NotesFeature />
    </React.Suspense>
  );
}
