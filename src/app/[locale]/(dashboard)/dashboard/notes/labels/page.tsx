import * as React from "react";
import type { Metadata } from "next";
import { NotesLabelsFeature } from "@/features/notes";

export const metadata: Metadata = {
  title: "Notes Labels",
  description: "Organize and classify notes with customizable colored labels",
};

export default function NotesLabelsPage() {
  return (
    <React.Suspense
      fallback={
        <div className="space-y-4 p-4 animate-pulse">
          <div className="h-8 w-48 bg-muted rounded" />
          <div className="h-4 w-72 bg-muted rounded" />
          <div className="h-64 rounded-xl bg-muted/60 mt-6" />
        </div>
      }
    >
      <NotesLabelsFeature />
    </React.Suspense>
  );
}
