"use client"

import * as React from "react"
import { useTranslations } from "next-intl"
import {
  Copy,
  Check,
  Download,
  Trash2,
  ExternalLink,
  Calendar,
  User,
  HardDrive,
  Maximize2,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { AppSheet } from "@/components/app-sheet"
import { FileTypeIcon } from "./file-type-icon"
import type { MediaItem } from "@/data/media"
import { formatBytes } from "@/lib/media-utils"
import { useMedia } from "@/context/media-provider"

interface MediaDetailsSheetProps {
  item: MediaItem | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onDelete?: (id: string) => void
}

export function MediaDetailsSheet({
  item,
  open,
  onOpenChange,
  onDelete,
}: MediaDetailsSheetProps) {
  const t = useTranslations("media")
  const tCommon = useTranslations("common")
  const { updateItem } = useMedia()

  const [title, setTitle] = React.useState("")
  const [altText, setAltText] = React.useState("")
  const [caption, setCaption] = React.useState("")
  const [description, setDescription] = React.useState("")
  const [copied, setCopied] = React.useState(false)
  const [isSaved, setIsSaved] = React.useState(false)

  // Synchronize state when item changes
  React.useEffect(() => {
    if (item) {
      setTitle(item.title || "")
      setAltText(item.altText || "")
      setCaption(item.caption || "")
      setDescription(item.description || "")
      setIsSaved(false)
    }
  }, [item])

  if (!item) return null

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(item.url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback
    }
  }

  const handleSave = () => {
    updateItem(item.id, {
      title,
      altText,
      caption,
      description,
    })
    setIsSaved(true)
    setTimeout(() => setIsSaved(false), 2500)
  }

  return (
    <AppSheet
      open={open}
      onOpenChange={onOpenChange}
      side="right"
      size="lg"
      title={t("details.sheetTitle")}
      description={item.name}
      footer={
        <div className="flex items-center justify-between w-full gap-2">
          {onDelete ? (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => {
                onOpenChange(false)
                onDelete(item.id)
              }}
              className="gap-1.5 cursor-pointer text-xs"
            >
              <Trash2 className="size-3.5" />
              <span>{t("details.delete")}</span>
            </Button>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="text-xs cursor-pointer"
            >
              {tCommon("close")}
            </Button>
            <Button
              size="sm"
              onClick={handleSave}
              className="text-xs gap-1.5 cursor-pointer"
            >
              {isSaved ? <Check className="size-3.5" /> : null}
              <span>{isSaved ? tCommon("autoSaved") : t("details.save")}</span>
            </Button>
          </div>
        </div>
      }
    >
      <div className="space-y-6 py-2">
        {/* Visual Preview Banner */}
        <div className="rounded-xl border bg-muted/30 overflow-hidden flex flex-col items-center justify-center p-4 min-h-[220px] max-h-[360px] relative group">
          {item.type === "image" ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={item.url}
              alt={item.altText || item.title || item.name}
              className="max-h-[300px] w-auto max-w-full object-contain rounded-md shadow-xs"
            />
          ) : (
            <div className="flex flex-col items-center gap-3 py-6">
              <FileTypeIcon
                type={item.type}
                extension={item.extension}
                className="size-20"
                iconClassName="size-10"
                showBadge
              />
              <div className="text-center space-y-1">
                <span className="font-semibold text-sm block max-w-xs truncate">
                  {item.name}
                </span>
                <span className="text-xs font-mono text-muted-foreground uppercase">
                  {item.mimeType}
                </span>
              </div>
            </div>
          )}

          <div className="absolute top-3 right-3 flex items-center gap-1.5">
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-md bg-background/80 hover:bg-background text-foreground backdrop-blur-xs border shadow-xs transition-colors"
              title="Open file in new tab"
            >
              <ExternalLink className="size-3.5" />
            </a>
            <a
              href={item.url}
              download={item.name}
              className="p-1.5 rounded-md bg-background/80 hover:bg-background text-foreground backdrop-blur-xs border shadow-xs transition-colors"
              title="Download file"
            >
              <Download className="size-3.5" />
            </a>
          </div>
        </div>

        {/* File Meta Specifications Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
          <div className="p-2.5 rounded-lg border bg-card space-y-1">
            <div className="flex items-center gap-1.5 text-muted-foreground text-[11px] font-medium">
              <HardDrive className="size-3" />
              <span>{t("fields.size")}</span>
            </div>
            <span className="font-mono text-xs font-semibold block">
              {formatBytes(item.size)}
            </span>
          </div>

          <div className="p-2.5 rounded-lg border bg-card space-y-1">
            <div className="flex items-center gap-1.5 text-muted-foreground text-[11px] font-medium">
              <Maximize2 className="size-3" />
              <span>{t("fields.dimensions")}</span>
            </div>
            <span className="font-mono text-xs font-semibold block">
              {item.dimensions
                ? `${item.dimensions.width} × ${item.dimensions.height}`
                : "—"}
            </span>
          </div>

          <div className="p-2.5 rounded-lg border bg-card space-y-1">
            <div className="flex items-center gap-1.5 text-muted-foreground text-[11px] font-medium">
              <Calendar className="size-3" />
              <span>{t("fields.uploadedAt")}</span>
            </div>
            <span className="font-mono text-xs font-semibold block">
              {item.uploadedAt}
            </span>
          </div>

          <div className="p-2.5 rounded-lg border bg-card space-y-1">
            <div className="flex items-center gap-1.5 text-muted-foreground text-[11px] font-medium">
              <User className="size-3" />
              <span>{t("fields.author")}</span>
            </div>
            <span className="text-xs font-semibold block truncate">
              {item.author}
            </span>
          </div>
        </div>

        {/* Copy File URL Box */}
        <div className="space-y-1.5">
          <Label htmlFor="media-url" className="text-xs font-medium text-muted-foreground">
            {t("fields.url")}
          </Label>
          <div className="flex items-center gap-2">
            <Input
              id="media-url"
              readOnly
              value={item.url}
              className="h-8 text-xs font-mono bg-muted/40 cursor-default select-all"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleCopyUrl}
              className="h-8 gap-1.5 text-xs shrink-0 cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="size-3.5 text-emerald-500" />
                  <span className="text-emerald-600 dark:text-emerald-400">
                    {t("details.copied")}
                  </span>
                </>
              ) : (
                <>
                  <Copy className="size-3.5" />
                  <span>{t("details.copyUrl")}</span>
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Editable WordPress-style Metadata Fields */}
        <div className="space-y-3.5 pt-2 border-t">
          <div className="space-y-1.5">
            <Label htmlFor="media-title" className="text-xs font-medium">
              {t("fields.title")}
            </Label>
            <Input
              id="media-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="h-8 text-xs"
              placeholder="Descriptive title for this asset..."
            />
          </div>

          {item.type === "image" && (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="media-alt" className="text-xs font-medium">
                  {t("fields.altText")}
                </Label>
                <span className="text-[11px] text-muted-foreground">
                  Important for accessibility & SEO
                </span>
              </div>
              <Input
                id="media-alt"
                value={altText}
                onChange={(e) => setAltText(e.target.value)}
                className="h-8 text-xs"
                placeholder="Describe the purpose of the image for screen readers..."
              />
            </div>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="media-caption" className="text-xs font-medium">
              {t("fields.caption")}
            </Label>
            <Textarea
              id="media-caption"
              rows={2}
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="text-xs resize-none"
              placeholder="Display caption shown beneath media when embedded..."
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="media-desc" className="text-xs font-medium">
              {t("fields.description")}
            </Label>
            <Textarea
              id="media-desc"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="text-xs resize-none"
              placeholder="Internal notes or context regarding this file..."
            />
          </div>
        </div>
      </div>
    </AppSheet>
  )
}
