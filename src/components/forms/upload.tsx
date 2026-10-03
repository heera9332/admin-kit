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
  Eye,
  Trash2,
  Download,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AppDialog } from "@/components/app-dialog"
import { MediaPickerDialog } from "@/components/media/media-picker-dialog"
import { FileTypeIcon } from "@/components/media/file-type-icon"
import { useMedia } from "@/context/media-provider"
import { formatBytes, getFileCategory } from "@/lib/media-utils"
import type { MediaItem, MediaType } from "@/data/media"
import { cn } from "@/lib/utils"

export interface UploadInputProps {
  id?: string
  name?: string
  value?: MediaItem | string | File | null
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
  previewVariant?: "auto" | "card" | "compact"
  showPreview?: boolean
  "aria-invalid"?: boolean | "true" | "false"
}

/**
 * Checks whether a given URL is likely an image based on allowedTypes, scheme,
 * extension, or common image CDN hostnames.
 */
function isLikelyImageUrl(url: string, allowedTypes?: MediaType[]): boolean {
  if (!url) return false
  if (allowedTypes && allowedTypes.length === 1 && allowedTypes[0] === "image") {
    return true
  }
  if (url.startsWith("data:image/")) return true
  if (url.startsWith("blob:")) {
    return !allowedTypes || allowedTypes.includes("image")
  }
  const clean = url.split("?")[0].toLowerCase()
  if (/\.(jpg|jpeg|png|webp|gif|svg|avif|bmp|ico|tiff?)$/i.test(clean)) {
    return true
  }
  if (
    url.includes("images.unsplash.com") ||
    url.includes("unsplash.com/photos") ||
    url.includes("res.cloudinary.com") ||
    url.includes("/images/") ||
    url.includes("/avatars/") ||
    url.includes("/products/")
  ) {
    return true
  }
  if (/[?&](format|fm|ext)=(jpg|jpeg|png|webp|gif|avif)/i.test(url)) {
    return true
  }
  return false
}

/**
 * Parses file name, title, extension, and MIME type from a string URL.
 */
function parseFileInfoFromUrl(url: string, isImage: boolean) {
  if (url.startsWith("data:image/")) {
    const mime = url.substring(5, url.indexOf(";")) || "image/png"
    const ext = mime.split("/")[1] || "png"
    return {
      name: `image.${ext}`,
      title: "Embedded Image",
      extension: ext,
      mimeType: mime,
    }
  }

  if (url.startsWith("blob:")) {
    const ext = isImage ? "jpg" : "file"
    return {
      name: isImage ? "uploaded-image" : "uploaded-file",
      title: isImage ? "Uploaded Image" : "Uploaded File",
      extension: ext,
      mimeType: isImage ? "image/jpeg" : "application/octet-stream",
    }
  }

  const clean = url.split("?")[0]
  const rawFileName = clean.split("/").pop() || "asset"

  if (clean.includes("images.unsplash.com")) {
    const photoId = rawFileName.replace(/^photo-/, "")
    return {
      name: `unsplash-${photoId.slice(0, 10)}.jpg`,
      title: `Unsplash Image (${photoId.slice(0, 8)})`,
      extension: "jpg",
      mimeType: "image/jpeg",
    }
  }

  const dotIndex = rawFileName.lastIndexOf(".")
  if (dotIndex > 0) {
    const ext = rawFileName.substring(dotIndex + 1).toLowerCase()
    const nameWithoutExt = rawFileName.substring(0, dotIndex)
    return {
      name: decodeURIComponent(rawFileName),
      title: decodeURIComponent(nameWithoutExt).replace(/[-_]/g, " "),
      extension: ext,
      mimeType: isImage ? `image/${ext}` : "application/octet-stream",
    }
  }

  const ext = isImage ? "jpg" : "file"
  return {
    name: decodeURIComponent(rawFileName) || (isImage ? "image.jpg" : "file"),
    title: decodeURIComponent(rawFileName).replace(/[-_]/g, " ") || "Asset",
    extension: ext,
    mimeType: isImage ? "image/jpeg" : "application/octet-stream",
  }
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
      previewVariant = "auto",
      showPreview = true,
      "aria-invalid": ariaInvalidProp,
    },
    forwardedRef
  ) {
    const [pickerOpen, setPickerOpen] = React.useState(false)
    const [previewOpen, setPreviewOpen] = React.useState(false)
    const [isDragOver, setIsDragOver] = React.useState(false)
    const [imageErrorUrl, setImageErrorUrl] = React.useState<string | null>(null)
    const [imageDimensions, setImageDimensions] = React.useState<{ width: number; height: number } | null>(null)
    const [fileCache, setFileCache] = React.useState<Record<string, MediaItem>>({})
    const fileInputRef = React.useRef<HTMLInputElement>(null)
    const { items, addItem } = useMedia()

    const isInvalid = ariaInvalidProp === true || ariaInvalidProp === "true"

    // Resolve MediaItem object if value is a string URL, ID, or File object
    const resolvedItem = React.useMemo<MediaItem | null>(() => {
      if (!value) return null

      // Check if value is already a full MediaItem object
      if (typeof value === "object" && !(value instanceof File)) {
        return value as MediaItem
      }

      // Check if value is a File instance
      if (typeof File !== "undefined" && value instanceof File) {
        const objectUrl = URL.createObjectURL(value)
        const ext = value.name.split(".").pop() || ""
        const category = getFileCategory(value.type, ext)
        const isImg = category === "image"
        return {
          id: `file-${value.name}-${value.size}`,
          name: value.name,
          title: value.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " "),
          url: objectUrl,
          thumbnailUrl: isImg ? objectUrl : undefined,
          type: category,
          mimeType: value.type || (isImg ? "image/jpeg" : "application/octet-stream"),
          size: value.size,
          uploadedAt: new Date().toISOString().split("T")[0],
          author: "Current User",
          extension: ext,
        }
      }

      if (typeof value === "string") {
        // 1. Check local session cache first
        if (fileCache[value]) {
          return fileCache[value]
        }

        // 2. Check if value matches an existing item by URL or ID in Media library
        const matched = items.find(
          (item) => item.url === value || item.id === value
        )
        if (matched) return matched

        // 3. Otherwise synthesize a rich preview from the string URL
        const isImg = isLikelyImageUrl(value, allowedTypes)
        const info = parseFileInfoFromUrl(value, isImg)
        const category = isImg ? "image" : getFileCategory(info.mimeType, info.extension)

        return {
          id: `synth-${value}`,
          name: info.name,
          title: info.title,
          url: value,
          thumbnailUrl: isImg ? value : undefined,
          type: category,
          mimeType: info.mimeType,
          size: 0,
          uploadedAt: "",
          author: "",
          extension: info.extension,
        }
      }

      return null
    }, [value, fileCache, items, allowedTypes])

    // Load image natural dimensions when previewing an image
    React.useEffect(() => {
      if (!resolvedItem || resolvedItem.type !== "image" || !resolvedItem.url) {
        setImageDimensions(null)
        return
      }

      if (resolvedItem.dimensions) {
        setImageDimensions(resolvedItem.dimensions)
        return
      }

      const img = new Image()
      img.onload = () => {
        setImageDimensions({
          width: img.naturalWidth,
          height: img.naturalHeight,
        })
      }
      img.onerror = () => {
        setImageDimensions(null)
      }
      img.src = resolvedItem.url
    }, [resolvedItem])

    const handleSelect = React.useCallback(
      (selected: MediaItem | MediaItem[] | null) => {
        if (!selected) {
          onChange?.(null)
          return
        }

        const item = Array.isArray(selected) ? selected[0] : selected

        // Cache item so resolvedItem maintains rich metadata
        setFileCache((prev) => ({
          ...prev,
          [item.url]: item,
          [item.id]: item,
        }))

        if (outputType === "item") {
          onChange?.(item)
        } else if (outputType === "url") {
          onChange?.(item.url)
        } else {
          // If outputType is not explicitly set, match current value structure
          if (typeof value === "object" && value !== null && !(value instanceof File)) {
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
        setImageErrorUrl(null)
        setImageDimensions(null)
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

        const newItem: MediaItem = {
          id: `upload-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          name: file.name,
          title: file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " "),
          url: objectUrl,
          thumbnailUrl: isImg ? objectUrl : undefined,
          type,
          mimeType: file.type || (isImg ? "image/jpeg" : "application/octet-stream"),
          size: file.size,
          author: "Current User",
          extension,
          uploadedAt: new Date().toISOString().split("T")[0],
        }

        if (isImg) {
          const img = new Image()
          img.onload = () => {
            const dims = { width: img.naturalWidth, height: img.naturalHeight }
            newItem.dimensions = dims
            setImageDimensions(dims)
            setFileCache((prev) => ({
              ...prev,
              [objectUrl]: { ...newItem, dimensions: dims },
              [newItem.id]: { ...newItem, dimensions: dims },
            }))
          }
          img.src = objectUrl
        }

        try {
          addItem(newItem)
        } catch {
          // Non-blocking if context is outside provider
        }

        setFileCache((prev) => ({
          ...prev,
          [objectUrl]: newItem,
          [newItem.id]: newItem,
        }))

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
      if (typeof value === "string") return value
      if (typeof value === "object" && "url" in value) return value.url
      return ""
    }, [value])

    const isImage = resolvedItem?.type === "image" && imageErrorUrl !== resolvedItem.url
    const effectiveDimensions = resolvedItem?.dimensions || imageDimensions
    const isCardVariant = previewVariant === "card" || (previewVariant === "auto" && isImage)

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

        {resolvedItem && showPreview ? (
          isCardVariant ? (
            /* ========================================================================= */
            /* CARD PREVIEW: High-impact visual preview for images and media               */
            /* ========================================================================= */
            <div
              className={cn(
                "group relative flex flex-col w-full rounded-xl border border-input bg-card shadow-xs overflow-hidden transition-all",
                "focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50",
                isInvalid &&
                  "border-destructive ring-destructive/20 focus-within:border-destructive focus-within:ring-destructive/20 dark:border-destructive/50 dark:focus-within:ring-destructive/40"
              )}
            >
              {/* Visual Preview Canvas */}
              <div className="relative w-full h-44 sm:h-52 bg-muted/30 dark:bg-muted/15 flex items-center justify-center overflow-hidden border-b">
                {isImage ? (
                  <div
                    className="relative w-full h-full flex items-center justify-center p-2 cursor-pointer group/img"
                    onClick={() => setPreviewOpen(true)}
                    title="Click to open full file preview"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={resolvedItem.thumbnailUrl || resolvedItem.url}
                      alt={resolvedItem.title || resolvedItem.name}
                      className="max-h-full max-w-full object-contain rounded-md transition-transform duration-200 group-hover/img:scale-[1.02]"
                      onError={() => setImageErrorUrl(resolvedItem.url)}
                    />

                    {/* Hover Quick Preview Action */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white">
                      <span className="flex items-center gap-1.5 text-xs font-medium bg-black/70 backdrop-blur-xs px-3 py-1.5 rounded-full shadow-md">
                        <Eye className="size-3.5" />
                        <span>Quick Preview</span>
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center gap-2 p-6 text-center">
                    <FileTypeIcon
                      type={resolvedItem.type}
                      extension={resolvedItem.extension}
                      className="size-16"
                      iconClassName="size-8"
                      showBadge
                    />
                    <span className="text-xs font-mono text-muted-foreground uppercase">
                      {resolvedItem.mimeType || resolvedItem.extension}
                    </span>
                  </div>
                )}

                {/* Top Badges */}
                <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 pointer-events-none">
                  <Badge
                    variant="secondary"
                    className="text-[10px] uppercase font-mono tracking-wider backdrop-blur-xs bg-background/85 shadow-2xs"
                  >
                    {resolvedItem.extension || resolvedItem.type}
                  </Badge>
                  {effectiveDimensions && (
                    <Badge
                      variant="outline"
                      className="text-[10px] font-mono backdrop-blur-xs bg-background/85 shadow-2xs"
                    >
                      {effectiveDimensions.width} × {effectiveDimensions.height}
                    </Badge>
                  )}
                </div>

                {/* Top-Right Quick Action Buttons */}
                <div className="absolute top-2.5 right-2.5 flex items-center gap-1">
                  <Button
                    type="button"
                    variant="secondary"
                    size="icon"
                    className="size-7 bg-background/85 backdrop-blur-xs hover:bg-background text-foreground shadow-2xs cursor-pointer"
                    onClick={() => setPreviewOpen(true)}
                    title="Preview file"
                  >
                    <Eye className="size-3.5" />
                  </Button>
                  {resolvedItem.url && (
                    <Button
                      type="button"
                      variant="secondary"
                      size="icon"
                      className="size-7 bg-background/85 backdrop-blur-xs hover:bg-background text-foreground shadow-2xs cursor-pointer"
                      onClick={() => window.open(resolvedItem.url, "_blank")}
                      title="Open file in new tab"
                    >
                      <ExternalLink className="size-3.5" />
                    </Button>
                  )}
                </div>
              </div>

              {/* Bottom Metadata & Controls Bar */}
              <div className="flex items-center justify-between p-3 gap-3 bg-card">
                <div className="space-y-0.5 min-w-0 flex-1">
                  <span
                    className="text-xs font-semibold text-foreground truncate block"
                    title={resolvedItem.title || resolvedItem.name}
                  >
                    {resolvedItem.title || resolvedItem.name}
                  </span>
                  <div className="flex items-center gap-2 text-[11px] text-muted-foreground font-mono">
                    {resolvedItem.size > 0 && (
                      <span>{formatBytes(resolvedItem.size)}</span>
                    )}
                    {resolvedItem.size > 0 && resolvedItem.type && <span>•</span>}
                    <span className="capitalize">{resolvedItem.type}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  {!readOnly && !disabled && (
                    <>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setPickerOpen(true)}
                        className="h-7 text-xs px-2.5 gap-1.5 cursor-pointer"
                      >
                        <RefreshCw className="size-3 text-muted-foreground" />
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
                        <Trash2 className="size-3.5" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ) : (
            /* ========================================================================= */
            /* COMPACT PREVIEW: Sleek single-row preview with thumbnail and quick actions   */
            /* ========================================================================= */
            <div
              className={cn(
                "group relative flex items-center justify-between gap-3 p-3 rounded-lg border border-input bg-card shadow-xs transition-colors",
                "focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50",
                isInvalid &&
                  "border-destructive ring-destructive/20 focus-within:border-destructive focus-within:ring-destructive/20 dark:border-destructive/50 dark:focus-within:ring-destructive/40"
              )}
            >
              <div className="flex items-center gap-3 min-w-0 flex-1">
                {/* Thumbnail with Click to Preview */}
                <div
                  className="relative size-12 shrink-0 rounded-md border bg-muted/20 overflow-hidden cursor-pointer group/thumb flex items-center justify-center"
                  onClick={() => setPreviewOpen(true)}
                  title="Click to preview file"
                >
                  {isImage ? (
                    <>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={resolvedItem.thumbnailUrl || resolvedItem.url}
                        alt={resolvedItem.name}
                        className="size-full object-cover transition-transform group-hover/thumb:scale-105"
                        onError={() => setImageErrorUrl(resolvedItem.url)}
                      />
                      <div className="absolute inset-0 bg-black/35 opacity-0 group-hover/thumb:opacity-100 transition-opacity flex items-center justify-center">
                        <Eye className="size-3.5 text-white" />
                      </div>
                    </>
                  ) : (
                    <FileTypeIcon
                      type={resolvedItem.type}
                      extension={resolvedItem.extension}
                      className="size-12 shrink-0 rounded-md"
                      iconClassName="size-6"
                      showBadge
                    />
                  )}
                </div>

                <div className="space-y-0.5 min-w-0 flex-1">
                  <span
                    className="text-xs font-semibold text-foreground block truncate"
                    title={resolvedItem.title || resolvedItem.name}
                  >
                    {resolvedItem.title || resolvedItem.name}
                  </span>
                  <div className="flex items-center gap-2 text-[11px] text-muted-foreground font-mono">
                    <span>.{resolvedItem.extension}</span>
                    {resolvedItem.size > 0 && (
                      <span>• {formatBytes(resolvedItem.size)}</span>
                    )}
                    {effectiveDimensions && (
                      <span>
                        • {effectiveDimensions.width}×{effectiveDimensions.height}
                      </span>
                    )}
                    {resolvedItem.type && (
                      <span className="capitalize">• {resolvedItem.type}</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="size-7 text-muted-foreground hover:text-foreground cursor-pointer"
                  onClick={() => setPreviewOpen(true)}
                  title="Preview file"
                >
                  <Eye className="size-3.5" />
                </Button>

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
                      onClick={() => setPickerOpen(true)}
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
          )
        ) : (
          /* ========================================================================= */
          /* EMPTY DROPZONE: Direct drag & drop and media library selection            */
          /* ========================================================================= */
          <div
            onClick={() => !disabled && !readOnly && setPickerOpen(true)}
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
                onClick={() => setPickerOpen(true)}
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

        {/* Media Picker Modal */}
        <MediaPickerDialog
          open={pickerOpen}
          onOpenChange={setPickerOpen}
          onSelect={handleSelect}
          allowedTypes={allowedTypes}
          title={dialogTitle}
          initialSelectedId={resolvedItem?.id}
        />

        {/* ========================================================================= */}
        {/* INTERACTIVE FULL FILE PREVIEW DIALOG                                      */}
        {/* ========================================================================= */}
        {resolvedItem && (
          <AppDialog
            open={previewOpen}
            onOpenChange={setPreviewOpen}
            size="xl"
            title={
              <div className="flex items-center gap-2 min-w-0 pr-6">
                <Eye className="size-4 shrink-0 text-primary" />
                <span className="truncate text-base font-semibold">
                  {resolvedItem.title || resolvedItem.name}
                </span>
              </div>
            }
            description={
              <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground pt-0.5">
                <Badge variant="outline" className="text-[10px] uppercase font-mono">
                  {resolvedItem.extension || resolvedItem.type}
                </Badge>
                {resolvedItem.size > 0 && (
                  <span>• {formatBytes(resolvedItem.size)}</span>
                )}
                {effectiveDimensions && (
                  <span>
                    • {effectiveDimensions.width} × {effectiveDimensions.height} px
                  </span>
                )}
                {resolvedItem.mimeType && (
                  <span className="font-mono text-[11px] text-muted-foreground">
                    ({resolvedItem.mimeType})
                  </span>
                )}
              </div>
            }
            footer={
              <div className="flex items-center justify-between w-full gap-2">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  {resolvedItem.url && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="text-xs h-8 gap-1.5 cursor-pointer"
                      onClick={() => window.open(resolvedItem.url, "_blank")}
                    >
                      <ExternalLink className="size-3.5" />
                      <span>Open in New Tab</span>
                    </Button>
                  )}
                  {resolvedItem.url && !resolvedItem.url.startsWith("blob:") && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="text-xs h-8 gap-1.5 cursor-pointer"
                      onClick={() => {
                        const link = document.createElement("a")
                        link.href = resolvedItem.url
                        link.download = resolvedItem.name
                        link.target = "_blank"
                        link.rel = "noreferrer"
                        document.body.appendChild(link)
                        link.click()
                        document.body.removeChild(link)
                      }}
                    >
                      <Download className="size-3.5" />
                      <span>Download</span>
                    </Button>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {!readOnly && !disabled && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="text-xs h-8 gap-1.5 cursor-pointer"
                      onClick={() => {
                        setPreviewOpen(false)
                        setPickerOpen(true)
                      }}
                    >
                      <RefreshCw className="size-3.5" />
                      <span>Change File</span>
                    </Button>
                  )}
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    className="text-xs h-8 cursor-pointer"
                    onClick={() => setPreviewOpen(false)}
                  >
                    Close
                  </Button>
                </div>
              </div>
            }
          >
            <div className="py-2 flex flex-col items-center justify-center">
              {isImage ? (
                <div className="relative w-full rounded-lg border bg-muted/20 dark:bg-muted/10 overflow-hidden flex items-center justify-center p-3 max-h-[62vh]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={resolvedItem.url}
                    alt={resolvedItem.title || resolvedItem.name}
                    className="max-h-[58vh] w-auto max-w-full object-contain rounded-md shadow-xs select-none"
                  />
                </div>
              ) : resolvedItem.type === "video" ? (
                <div className="w-full flex items-center justify-center bg-black/90 rounded-lg p-2 max-h-[62vh]">
                  <video
                    src={resolvedItem.url}
                    controls
                    className="max-h-[58vh] max-w-full rounded"
                  />
                </div>
              ) : resolvedItem.type === "audio" ? (
                <div className="w-full p-8 flex flex-col items-center justify-center gap-4 bg-muted/20 rounded-lg border">
                  <FileTypeIcon
                    type="audio"
                    extension={resolvedItem.extension}
                    className="size-16"
                    iconClassName="size-8"
                  />
                  <span className="text-sm font-semibold">{resolvedItem.name}</span>
                  <audio src={resolvedItem.url} controls className="w-full max-w-md mt-2" />
                </div>
              ) : resolvedItem.extension === "pdf" ? (
                <div className="w-full flex flex-col items-center gap-4">
                  <iframe
                    src={resolvedItem.url}
                    title={resolvedItem.name}
                    className="w-full h-[58vh] rounded-lg border bg-background"
                  />
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center gap-4 py-12 px-6 text-center bg-muted/10 rounded-lg border w-full">
                  <FileTypeIcon
                    type={resolvedItem.type}
                    extension={resolvedItem.extension}
                    className="size-20"
                    iconClassName="size-10"
                    showBadge
                  />
                  <div className="space-y-1">
                    <span className="font-semibold text-base block max-w-md truncate">
                      {resolvedItem.name}
                    </span>
                    <p className="text-xs text-muted-foreground font-mono">
                      {resolvedItem.mimeType} • {formatBytes(resolvedItem.size)}
                    </p>
                  </div>
                  <div className="pt-2">
                    <Button
                      type="button"
                      variant="default"
                      size="sm"
                      className="text-xs gap-1.5 cursor-pointer"
                      onClick={() => window.open(resolvedItem.url, "_blank")}
                    >
                      <ExternalLink className="size-3.5" />
                      <span>Open Document</span>
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </AppDialog>
        )}
      </div>
    )
  }
)

UploadInput.displayName = "UploadInput"

export const Upload = UploadInput
export const MediaSelect = UploadInput
export const MediaSelectInput = UploadInput

