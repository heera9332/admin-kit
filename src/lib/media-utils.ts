import type { MediaType } from "@/data/media"

export function formatBytes(bytes: number, decimals = 1): string {
  if (!+bytes) return "0 Bytes"

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"]

  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}

export function getFileCategory(mimeType: string, extension: string): MediaType {
  const ext = extension.toLowerCase().replace(/^\./, "")

  if (
    mimeType.startsWith("image/") ||
    ["jpg", "jpeg", "png", "webp", "gif", "svg", "bmp", "ico"].includes(ext)
  ) {
    return "image"
  }

  if (
    mimeType.startsWith("video/") ||
    ["mp4", "webm", "mov", "avi", "mkv"].includes(ext)
  ) {
    return "video"
  }

  if (
    mimeType.startsWith("audio/") ||
    ["mp3", "wav", "ogg", "aac", "flac"].includes(ext)
  ) {
    return "audio"
  }

  if (
    mimeType.includes("zip") ||
    mimeType.includes("tar") ||
    mimeType.includes("rar") ||
    ["zip", "tar", "gz", "rar", "7z"].includes(ext)
  ) {
    return "archive"
  }

  if (
    mimeType.includes("pdf") ||
    mimeType.includes("word") ||
    mimeType.includes("document") ||
    mimeType.includes("excel") ||
    mimeType.includes("sheet") ||
    mimeType.includes("presentation") ||
    mimeType.includes("text") ||
    ["pdf", "docx", "doc", "xlsx", "xls", "pptx", "ppt", "txt", "csv", "md"].includes(ext)
  ) {
    return "document"
  }

  return "other"
}

export function getFileColor(extension: string): {
  bg: string
  text: string
  border: string
  badge: string
} {
  const ext = extension.toLowerCase().replace(/^\./, "")

  switch (ext) {
    case "pdf":
      return {
        bg: "bg-red-500/10 dark:bg-red-500/20",
        text: "text-red-600 dark:text-red-400",
        border: "border-red-200 dark:border-red-800/40",
        badge: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300",
      }
    case "doc":
    case "docx":
      return {
        bg: "bg-blue-500/10 dark:bg-blue-500/20",
        text: "text-blue-600 dark:text-blue-400",
        border: "border-blue-200 dark:border-blue-800/40",
        badge: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
      }
    case "xls":
    case "xlsx":
    case "csv":
      return {
        bg: "bg-emerald-500/10 dark:bg-emerald-500/20",
        text: "text-emerald-600 dark:text-emerald-400",
        border: "border-emerald-200 dark:border-emerald-800/40",
        badge: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
      }
    case "ppt":
    case "pptx":
      return {
        bg: "bg-amber-500/10 dark:bg-amber-500/20",
        text: "text-amber-600 dark:text-amber-400",
        border: "border-amber-200 dark:border-amber-800/40",
        badge: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
      }
    case "zip":
    case "tar":
    case "rar":
    case "7z":
      return {
        bg: "bg-orange-500/10 dark:bg-orange-500/20",
        text: "text-orange-600 dark:text-orange-400",
        border: "border-orange-200 dark:border-orange-800/40",
        badge: "bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300",
      }
    case "mp4":
    case "mov":
    case "webm":
      return {
        bg: "bg-purple-500/10 dark:bg-purple-500/20",
        text: "text-purple-600 dark:text-purple-400",
        border: "border-purple-200 dark:border-purple-800/40",
        badge: "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300",
      }
    case "mp3":
    case "wav":
    case "ogg":
      return {
        bg: "bg-pink-500/10 dark:bg-pink-500/20",
        text: "text-pink-600 dark:text-pink-400",
        border: "border-pink-200 dark:border-pink-800/40",
        badge: "bg-pink-100 text-pink-700 dark:bg-pink-950 dark:text-pink-300",
      }
    default:
      return {
        bg: "bg-primary/10",
        text: "text-primary",
        border: "border-border",
        badge: "bg-secondary text-secondary-foreground",
      }
  }
}
