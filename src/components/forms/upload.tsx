"use client"

import * as React from "react"
import {
  UploadCloud,
  X,
  RefreshCw,
  FileText,
  Image as ImageIcon,
  ExternalLink,
  FolderOpen,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { MediaPickerDialog } from "@/components/media/media-picker-dialog"
import { FileTypeIcon } from "@/components/media/file-type-icon"
import { useMedia } from "@/context/media-provider"
import { formatBytes, getFileCategory } from "@/lib/media-utils"
import type { MediaItem, MediaType } from "@/data/media"
import { cn } from "@/lib/utils"

export interface UploadInputProps {
  id?: string
  name?: string
  value?: MediaItem | string | null
  onChange?: (value: MediaItem | string | null) => void
  onBlur?: () => void
  disabled?: boolean
  readOnly?: boolean
  allowedTypes?: MediaType[]
  accept?: string
  placeholder?: string
  dialogTitle?: string
  outputType?: "url" | "item"
  maxSize?: number
  className?: string
  "aria-invalid"?: boolean | "true" | "false"
}

export const UploadInput = React.forwardRef<HTMLDivElement, UploadInputProps>(
  function UploadInput(
    {
      id,
      name,
      value,
      onChange,
      onBlur,
      disabled = false,
      readOnly = false,
      allowedTypes,
      accept,
      placeholder = "Choose from media library or drag & drop file",
      dialogTitle = "Select or Upload Asset",
      outputType,
      maxSize,
      className,
      "aria-invalid": ariaInvalidProp,
    },
    forwardedRef
  ) {
    const [open, setOpen] = React.useState(false)
    const [isDragOver, setIsDragOver] = React.useState(false)
    const fileInputRef = React.useRef<HTMLInputElement>(null)
    const { items, addItem } = useMedia()

    const isInvalid = ariaInvalidProp === true || ariaInvalidProp === "true"

    // Resolve MediaItem object if value is a string URL or ID
    const resolvedItem = React.useMemo<MediaItem | null>(() => {
      if (!value) return null
      if (typeof value === "object") return value

      // Check if value matches an existing item by URL or ID in Media library
      const matched = items.find(
        (item) => item.url === value || item.id === value
      )
      if (matched) return matched

      // Otherwise synthesize a preview from the string URL
      const isImg = /\.(jpg|jpeg|png|webp|gif|svg|avif)($|\?)/i.test(value)
      const ext = value.split("?")[0].split(".").pop() || ""
      return {
        id: `synth-${value}`,
        name: value.split("/").pop()?.split("?")[0] || "asset",
        title: value.split("/").pop()?.split("?")[0] || "asset",
        url: value,
        thumbnailUrl: isImg ? value : undefined,
        type: isImg ? "image" : "document",
        mimeType: isImg ? "image/jpeg" : "application/octet-stream",
        size: 0,
        uploadedAt: "",
        author: "",
        extension: ext,
      }
    }, [value, items])

    const handleSelect = React.useCallback(
      (selected: MediaItem | MediaItem[] | null) => {
        if (!selected) {
          onChange?.(null)
          return
        }

        const item = Array.isArray(selected) ? selected[0] : selected

        if (outputType === "item") {
          onChange?.(item)
        } else if (outputType === "url") {
          onChange?.(item.url)
        } else {
          // If outputType is not explicitly set, match current value structure
          if (typeof value === "object" && value !== null) {
            onChange?.(item)
          } else {
            onChange?.(item.url)
          }
        }
      },
      [onChange, outputType, value]
    )

    const handleRemove = React.useCallback(
      (e: React.MouseEvent) => {
        e.stopPropagation()
        if (disabled || readOnly) return
        handleSelect(null)
      },
      [disabled, readOnly, handleSelect]
    )

    const processFile = React.useCallback(
      (file: File) => {
        if (maxSize && file.size > maxSize) {
          alert(`File exceeds maximum size of ${formatBytes(maxSize)}`)
          return
        }

        const extension = file.name.split(".").pop() || ""
        const type = getFileCategory(file.type, extension)

        if (allowedTypes && allowedTypes.length > 0 && !allowedTypes.includes(type)) {
          alert(`File type "${type}" is not permitted. Allowed: ${allowedTypes.join(", ")}`)
          return
        }

        const isImg = type === "image"
        const objectUrl = URL.createObjectURL(file)

        const newItem = addItem({
          name: file.name,
          title: file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " "),
          url: objectUrl,
          thumbnailUrl: isImg ? objectUrl : undefined,
          type,
          mimeType: file.type || "application/octet-stream",
          size: file.size,
          dimensions: isImg ? { width: 1200, height: 800 } : undefined,
          author: "Current User",
          extension,
        })

        handleSelect(newItem)
      },
      [addItem, allowedTypes, handleSelect, maxSize]
    )

    // Process drag & drop file directly on dropzone
    const handleDrop = React.useCallback(
      (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragOver(false)

        if (disabled || readOnly) return

        const files = Array.from(e.dataTransfer.files)
        if (files.length === 0) return

        processFile(files[0])
      },
      [disabled, processFile, readOnly]
    )

    const handleFileInputChange = React.useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files ? Array.from(e.target.files) : []
        if (files.length === 0) return

        processFile(files[0])
        // Reset file input value so selecting the same file again triggers change
        e.target.value = ""
      },
      [processFile]
    )

    const hiddenValue = React.useMemo(() => {
      if (!value) return ""
      return typeof value === "string" ? value : value.url
    }, [value])

    return (
      <div
        ref={forwardedRef}
        id={id ? `${id}-container` : undefined}
        data-slot="upload"
        data-invalid={isInvalid ? "true" : undefined}
        data-disabled={disabled ? "true" : undefined}
        aria-invalid={isInvalid ? "true" : undefined}
        className={cn(
          "relative flex flex-col w-full rounded-lg transition-colors",
          disabled && "opacity-50 pointer-events-none cursor-not-allowed",
          className
        )}
        onBlur={onBlur}
      >
        {name && (
          <input
            type="hidden"
            name={name}
            value={hiddenValue}
            disabled={disabled}
          />
        )}

        <input
          type="file"
          ref={fileInputRef}
          accept={accept}
          onChange={handleFileInputChange}
          className="hidden"
          disabled={disabled || readOnly}
          tabIndex={-1}
          aria-hidden="true"
        />

        {resolvedItem ? (
          <div
            className={cn(
              "group relative flex items-center justify-between gap-3 p-3 rounded-lg border border-input bg-card shadow-xs transition-colors",
              "focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50",
              isInvalid &&
                "border-destructive ring-destructive/20 focus-within:border-destructive focus-within:ring-destructive/20 dark:border-destructive/50 dark:focus-within:ring-destructive/40"
            )}
          >
            <div className="flex items-center gap-3 min-w-0 flex-1">
              {resolvedItem.type === "image" ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={resolvedItem.thumbnailUrl || resolvedItem.url}
                  alt={resolvedItem.name}
                  className="size-12 rounded-md object-cover border shrink-0 bg-muted/20"
                />
              ) : (
                <FileTypeIcon
                  type={resolvedItem.type}
                  extension={resolvedItem.extension}
                  className="size-12 shrink-0 rounded-md"
                  iconClassName="size-6"
                  showBadge
                />
              )}

              <div className="space-y-0.5 min-w-0 flex-1">
                <span className="text-xs font-semibold text-foreground block truncate">
                  {resolvedItem.title || resolvedItem.name}
                </span>
                <div className="flex items-center gap-2 text-[11px] text-muted-foreground font-mono">
                  <span>.{resolvedItem.extension}</span>
                  {resolvedItem.size > 0 && (
                    <span>• {formatBytes(resolvedItem.size)}</span>
                  )}
                  {resolvedItem.type && (
                    <span className="capitalize">• {resolvedItem.type}</span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              {resolvedItem.url && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="size-7 text-muted-foreground hover:text-foreground cursor-pointer"
                  onClick={() => window.open(resolvedItem.url, "_blank")}
                  title="Open file in new tab"
                >
                  <ExternalLink className="size-3.5" />
                </Button>
              )}

              {!readOnly && !disabled && (
                <>
                  <Button
                    type="button"
                    variant="outline"
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
                </>
              )}
            </div>
          </div>
        ) : (
          <div
            onClick={() => !disabled && !readOnly && setOpen(true)}
            onDragOver={(e) => {
              e.preventDefault()
              if (!disabled && !readOnly) setIsDragOver(true)
            }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={handleDrop}
            className={cn(
              "flex flex-col items-center justify-center p-5 rounded-lg border-2 border-dashed transition-all cursor-pointer text-center space-y-2",
              "border-input hover:border-primary/60 hover:bg-muted/30 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
              isDragOver && "border-primary bg-primary/5 scale-[0.99]",
              isInvalid &&
                "border-destructive/60 bg-destructive/5 hover:border-destructive",
              disabled && "pointer-events-none opacity-50 bg-muted/10"
            )}
          >
            <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              {allowedTypes?.includes("document") && !allowedTypes.includes("image") ? (
                <FileText className="size-4.5" />
              ) : isDragOver ? (
                <UploadCloud className="size-4.5 animate-bounce" />
              ) : (
                <ImageIcon className="size-4.5" />
              )}
            </div>

            <div className="space-y-0.5">
              <span className="text-xs font-medium text-foreground block">
                {placeholder}
              </span>
              <span className="text-[11px] text-muted-foreground block">
                {allowedTypes && allowedTypes.length > 0
                  ? `Supported: ${allowedTypes.join(", ")}`
                  : "Supports images, documents, and media files"}
                {maxSize ? ` up to ${formatBytes(maxSize)}` : ""}
              </span>
            </div>

            <div className="flex items-center gap-2 pt-1" onClick={(e) => e.stopPropagation()}>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-7 text-xs px-2.5 gap-1.5 cursor-pointer"
                onClick={() => setOpen(true)}
                disabled={disabled || readOnly}
              >
                <FolderOpen className="size-3.5 text-muted-foreground" />
                <span>Media Library</span>
              </Button>

              <Button
                type="button"
                variant="secondary"
                size="sm"
                className="h-7 text-xs px-2.5 gap-1.5 cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
                disabled={disabled || readOnly}
              >
                <UploadCloud className="size-3.5 text-muted-foreground" />
                <span>Browse File</span>
              </Button>
            </div>
          </div>
        )}

        <MediaPickerDialog
          open={open}
          onOpenChange={setOpen}
          onSelect={handleSelect}
          allowedTypes={allowedTypes}
          title={dialogTitle}
          initialSelectedId={resolvedItem?.id}
        />
      </div>
    )
  }
)

UploadInput.displayName = "UploadInput"

export const Upload = UploadInput
export const MediaSelect = UploadInput
export const MediaSelectInput = UploadInput
