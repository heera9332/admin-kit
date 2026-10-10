import * as React from "react";
import type { Metadata } from "next";
import { NoteEditFeature } from "@/features/notes";

interface NoteEditPageProps {
  params: Promise<{
    locale: string;
    id: string;
  }>;
}

export async function generateMetadata({
  params,
}: NoteEditPageProps): Promise<Metadata> {
  const { id } = await params;
  const isNew = id === "new";
  return {
    title: isNew ? "Create Note | Notes" : `Edit ${id} | Notes`,
    description: isNew
      ? "Create a new note with custom labels and colors"
      : "Full note editor with content formatting, labels, priority, and colors",
  };
}

export default async function NoteEditPage({ params }: NoteEditPageProps) {
  const { id } = await params;
  return (
    <React.Suspense
      fallback={
        <div className="space-y-4 p-4 animate-pulse">
          <div className="h-8 w-48 bg-muted rounded" />
          <div className="h-4 w-72 bg-muted rounded" />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mt-6">
            <div className="lg:col-span-8 h-96 rounded-xl bg-muted/60" />
            <div className="lg:col-span-4 h-96 rounded-xl bg-muted/60" />
          </div>
        </div>
      }
    >
      <NoteEditFeature noteId={id} />
    </React.Suspense>
  );
}
