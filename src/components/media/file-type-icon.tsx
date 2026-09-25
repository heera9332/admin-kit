"use client"

import * as React from "react"
import {
  FileText,
  FileSpreadsheet,
  Presentation,
  Image as ImageIcon,
  Video,
  Music,
  Archive,
  File,
  type LucideIcon,
} from "lucide-react"
import type { MediaType } from "@/data/media"
import { getFileColor } from "@/lib/media-utils"
import { cn } from "@/lib/utils"

interface FileTypeIconProps {
  type: MediaType
  extension: string
  className?: string
  iconClassName?: string
  showBadge?: boolean
}

export function FileTypeIcon({
  type,
  extension,
  className,
  iconClassName = "size-5",
  showBadge = false,
}: FileTypeIconProps) {
  const ext = extension.toLowerCase().replace(/^\./, "")
  const color = getFileColor(ext)

  let Icon: LucideIcon = File

  if (type === "image") {
    Icon = ImageIcon
  } else if (type === "video") {
    Icon = Video
  } else if (type === "audio") {
    Icon = Music
  } else if (type === "archive") {
    Icon = Archive
  } else if (["xls", "xlsx", "csv"].includes(ext)) {
    Icon = FileSpreadsheet
  } else if (["ppt", "pptx"].includes(ext)) {
    Icon = Presentation
  } else if (["pdf", "doc", "docx", "txt", "md"].includes(ext)) {
    Icon = FileText
  }

  return (
    <div
      className={cn(
        "relative flex items-center justify-center rounded-lg transition-colors",
        color.bg,
        color.text,
        className
      )}
    >
      <Icon className={cn("shrink-0", iconClassName)} />
      {showBadge && (
        <span
          className={cn(
            "absolute -bottom-1 -right-1 text-[9px] font-mono uppercase font-bold px-1 rounded-sm tracking-wider shadow-2xs",
            color.badge
          )}
        >
          {ext.slice(0, 4)}
        </span>
      )}
    </div>
  )
}
