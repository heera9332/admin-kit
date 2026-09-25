"use client"

import * as React from "react"
import { Upload, X, RefreshCw, FileText, Image as ImageIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { MediaPickerDialog } from "./media-picker-dialog"
import { FileTypeIcon } from "./file-type-icon"
import type { MediaItem, MediaType } from "@/data/media"
import { formatBytes } from "@/lib/media-utils"
import { cn } from "@/lib/utils"

export interface MediaPickerInputProps {
  value?: MediaItem | string | null
  onChange?: (item: MediaItem | null) => void
  label?: string
  description?: string
  allowedTypes?: MediaType[]
  placeholder?: string
  className?: string
  dialogTitle?: string
}

export function MediaPickerInput({
  value,
  onChange,
  label,
  description,
  allowedTypes,
  placeholder = "Choose from media library or upload",
  className,
  dialogTitle,
}: MediaPickerInputProps) {
  const [open, setOpen] = React.useState(false)

  // Resolve item object if value is MediaItem or string url
  const resolvedItem = React.useMemo<MediaItem | null>(() => {
    if (!value) return null
    if (typeof value === "object") return value
    // If a string URL is passed, synthesize a basic MediaItem preview
    const isImg = /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(value)
    const ext = value.split(".").pop() || ""
    return {
      id: "synthetic",
      name: value.split("/").pop() || "asset",
      title: value.split("/").pop() || "asset",
      url: value,
      type: isImg ? "image" : "document",
      mimeType: isImg ? "image/jpeg" : "application/octet-stream",
      size: 0,
      uploadedAt: "",
      author: "",
      extension: ext,
    }
  }, [value])

  const handleSelect = (selected: MediaItem | MediaItem[]) => {
    const item = Array.isArray(selected) ? selected[0] : selected
    onChange?.(item)
  }

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation()
    onChange?.(null)
  }

  return (
    <div className={cn("space-y-1.5", className)}>
      {label && <Label className="text-xs font-medium">{label}</Label>}

      {resolvedItem ? (
        <div
          onClick={() => setOpen(true)}
          className="group relative flex items-center justify-between gap-3 p-3 rounded-xl border bg-card hover:border-primary/50 hover:shadow-xs transition-all cursor-pointer"
        >
          <div className="flex items-center gap-3 min-w-0">
            {resolvedItem.type === "image" ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={resolvedItem.thumbnailUrl || resolvedItem.url}
                alt={resolvedItem.name}
                className="size-12 rounded-lg object-cover border shrink-0 bg-muted/20"
              />
            ) : (
              <FileTypeIcon
                type={resolvedItem.type}
                extension={resolvedItem.extension}
                className="size-12 shrink-0"
                iconClassName="size-6"
                showBadge
              />
            )}

            <div className="space-y-0.5 min-w-0">
              <span className="text-xs font-semibold text-foreground block truncate">
                {resolvedItem.title || resolvedItem.name}
              </span>
              <div className="flex items-center gap-2 text-[11px] text-muted-foreground font-mono">
                <span>.{resolvedItem.extension}</span>
                {resolvedItem.size > 0 && <span>• {formatBytes(resolvedItem.size)}</span>}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setOpen(true)}
              className="h-7 text-xs px-2 gap-1 cursor-pointer"
            >
              <RefreshCw className="size-3" />
              <span>Change</span>
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={handleRemove}
              className="size-7 text-muted-foreground hover:text-destructive cursor-pointer"
              title="Remove file"
            >
              <X className="size-3.5" />
            </Button>
          </div>
        </div>
      ) : (
        <div
          onClick={() => setOpen(true)}
          className="flex flex-col items-center justify-center p-5 rounded-xl border-2 border-dashed border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/30 transition-all cursor-pointer text-center space-y-1.5"
        >
          <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
            {allowedTypes?.includes("document") && !allowedTypes.includes("image") ? (
              <FileText className="size-4.5" />
            ) : (
              <ImageIcon className="size-4.5" />
            )}
          </div>
          <span className="text-xs font-medium text-foreground block">
            {placeholder}
          </span>
          <span className="text-[11px] text-muted-foreground">
            Supports documents, images, and attachments
          </span>
        </div>
      )}

      {description && (
        <span className="text-[11px] text-muted-foreground block">{description}</span>
      )}

      <MediaPickerDialog
        open={open}
        onOpenChange={setOpen}
        onSelect={handleSelect}
        allowedTypes={allowedTypes}
        title={dialogTitle || label || "Select File"}
        initialSelectedId={resolvedItem?.id}
      />
    </div>
  )
}
