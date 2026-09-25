"use client"

import * as React from "react"
import { useTranslations } from "next-intl"
import { UploadCloud, CheckCircle2, File, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { useMedia } from "@/context/media-provider"
import { getFileCategory } from "@/lib/media-utils"
import type { MediaItem } from "@/data/media"
import { cn } from "@/lib/utils"

interface MediaUploadDropzoneProps {
  onUploadSuccess?: (uploadedItems: MediaItem[]) => void
  className?: string
  compact?: boolean
  allowedTypes?: string[]
}

interface UploadingFile {
  id: string
  name: string
  size: number
  progress: number
  status: "uploading" | "complete" | "error"
}

export function MediaUploadDropzone({
  onUploadSuccess,
  className,
  compact = false,
}: MediaUploadDropzoneProps) {
  const t = useTranslations("media")
  const { addItem } = useMedia()

  const [isDragOver, setIsDragOver] = React.useState(false)
  const [uploadQueue, setUploadQueue] = React.useState<UploadingFile[]>([])
  const fileInputRef = React.useRef<HTMLInputElement | null>(null)

  const processFiles = (files: FileList | File[]) => {
    const fileArray = Array.from(files)
    if (fileArray.length === 0) return

    const initialQueue: UploadingFile[] = fileArray.map((file) => ({
      id: `${Date.now()}-${Math.random()}`,
      name: file.name,
      size: file.size,
      progress: 10,
      status: "uploading",
    }))

    setUploadQueue(initialQueue)

    const newlyCreated: MediaItem[] = []

    fileArray.forEach((file, index) => {
      const extension = file.name.split(".").pop() || ""
      const type = getFileCategory(file.type, extension)

      // Simulate network upload progression
      let currentProgress = 20
      const interval = setInterval(() => {
        currentProgress += 30
        if (currentProgress >= 100) {
          clearInterval(interval)

          const isImg = type === "image"
          const objectUrl = URL.createObjectURL(file)

          const itemData: Omit<MediaItem, "id" | "uploadedAt"> = {
            name: file.name,
            title: file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " "),
            url: objectUrl,
            thumbnailUrl: isImg ? objectUrl : undefined,
            type,
            mimeType: file.type || "application/octet-stream",
            size: file.size,
            dimensions: isImg ? { width: 1200, height: 800 } : undefined,
            author: "Admin User",
            extension,
          }

          const created = addItem(itemData)
          newlyCreated.push(created)

          setUploadQueue((prev) =>
            prev.map((q, qIdx) =>
              qIdx === index ? { ...q, progress: 100, status: "complete" } : q
            )
          )

          if (newlyCreated.length === fileArray.length) {
            onUploadSuccess?.(newlyCreated)
            setTimeout(() => {
              setUploadQueue([])
            }, 1800)
          }
        } else {
          setUploadQueue((prev) =>
            prev.map((q, qIdx) =>
              qIdx === index ? { ...q, progress: currentProgress } : q
            )
          )
        }
      }, 150)
    })
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(false)
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files)
    }
  }

  return (
    <div className={cn("space-y-4", className)}>
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={cn(
          "flex flex-col items-center justify-center text-center rounded-2xl border-2 border-dashed transition-all cursor-pointer",
          compact ? "p-6" : "p-10",
          isDragOver
            ? "border-primary bg-primary/5 scale-[1.005]"
            : "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/30"
        )}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={handleFileChange}
          accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv,.mp4,.zip"
        />

        <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-3 shadow-2xs">
          <UploadCloud className="size-7" />
        </div>

        <h3 className="text-base font-semibold tracking-tight text-foreground">
          {t("dropzone.title")}
        </h3>
        <p className="text-xs text-muted-foreground mt-1 max-w-sm">
          {t("dropzone.subtitle")}
        </p>

        <span className="text-[11px] text-muted-foreground/75 mt-3 max-w-md">
          {t("dropzone.supportedFormats")}
        </span>

        <Button
          type="button"
          variant="outline"
          size="sm"
          className="mt-4 h-8 text-xs cursor-pointer shadow-2xs"
          onClick={(e) => {
            e.stopPropagation()
            fileInputRef.current?.click()
          }}
        >
          {t("uploadButton")}
        </Button>
      </div>

      {uploadQueue.length > 0 && (
        <div className="space-y-2 rounded-xl border bg-card p-3 shadow-2xs">
          <div className="flex items-center justify-between text-xs font-medium">
            <span>Uploading {uploadQueue.length} file(s)...</span>
            <span className="text-muted-foreground">
              {uploadQueue.filter((f) => f.status === "complete").length} / {uploadQueue.length}
            </span>
          </div>

          <div className="space-y-2">
            {uploadQueue.map((item) => (
              <div key={item.id} className="space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-1.5 truncate max-w-[280px]">
                    <File className="size-3 text-muted-foreground" />
                    <span className="truncate">{item.name}</span>
                  </div>
                  {item.status === "complete" ? (
                    <span className="text-emerald-500 flex items-center gap-1 text-[10px]">
                      <CheckCircle2 className="size-3" /> Ready
                    </span>
                  ) : (
                    <span className="text-muted-foreground flex items-center gap-1 text-[10px]">
                      <Loader2 className="size-3 animate-spin" /> {item.progress}%
                    </span>
                  )}
                </div>
                <Progress value={item.progress} className="h-1" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
