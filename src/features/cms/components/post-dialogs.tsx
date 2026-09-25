"use client"

import * as React from "react"
import { useTranslations } from "next-intl"
import { FileText, Trash2, Eye, User, Calendar, Tag } from "lucide-react"

import { Button } from "@/components/ui/button"
import { AppSheet } from "@/components/app-sheet"
import { Badge } from "@/components/ui/badge"
import { StatusBadge } from "@/components/status-badge"
import type { Post } from "../data/cms-data"

interface ViewPostSheetProps {
  post: Post | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onDelete?: (post: Post) => void
  onEdit?: (post: Post) => void
}

export function ViewPostSheet({
  post,
  open,
  onOpenChange,
  onDelete,
  onEdit,
}: ViewPostSheetProps) {
  const t = useTranslations("cms.posts")
  const tCommon = useTranslations("common")

  if (!post) return null

  return (
    <AppSheet
      open={open}
      onOpenChange={onOpenChange}
      side="right"
      size="md"
      title={post.title}
      description={`/${post.slug}`}
      footer={
        <div className="flex items-center justify-between w-full gap-2">
          {onDelete ? (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => {
                onOpenChange(false)
                onDelete(post)
              }}
              className="gap-1.5 cursor-pointer"
            >
              <Trash2 className="size-3.5" />
              <span>{tCommon("delete")}</span>
            </Button>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-2">
            {onEdit && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  onOpenChange(false)
                  onEdit(post)
                }}
                className="gap-1.5 cursor-pointer"
              >
                <span>{tCommon("edit")}</span>
              </Button>
            )}
            <Button
              variant="default"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="cursor-pointer"
            >
              {tCommon("close")}
            </Button>
          </div>
        </div>
      }
    >
      <div className="flex flex-col gap-4 py-2">
        <div className="flex items-start gap-3 p-4 rounded-xl border bg-card shadow-xs">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary mt-0.5">
            <FileText className="size-6" />
          </div>
          <div className="min-w-0 flex-1 space-y-1.5">
            <h4 className="text-base font-semibold leading-tight">{post.title}</h4>
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-xs text-muted-foreground">
                /{post.slug}
              </span>
              <StatusBadge status={post.status} size="sm" dot>
                {t(`statuses.${post.status}`)}
              </StatusBadge>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded-lg border bg-card space-y-1">
            <div className="flex items-center gap-1.5 text-muted-foreground text-[11px] font-medium">
              <User className="size-3.5" />
              <span>{t("fields.author")}</span>
            </div>
            <span className="text-xs font-semibold block">{post.author}</span>
          </div>

          <div className="p-3 rounded-lg border bg-card space-y-1">
            <div className="flex items-center gap-1.5 text-muted-foreground text-[11px] font-medium">
              <Tag className="size-3.5" />
              <span>{t("fields.category")}</span>
            </div>
            <Badge variant="outline" className="text-xs font-normal">
              {post.category}
            </Badge>
          </div>

          <div className="p-3 rounded-lg border bg-card space-y-1">
            <div className="flex items-center gap-1.5 text-muted-foreground text-[11px] font-medium">
              <Calendar className="size-3.5" />
              <span>{t("fields.publishedAt")}</span>
            </div>
            <span className="font-mono text-xs font-semibold block">
              {post.publishedAt}
            </span>
          </div>

          <div className="p-3 rounded-lg border bg-card space-y-1">
            <div className="flex items-center gap-1.5 text-muted-foreground text-[11px] font-medium">
              <Eye className="size-3.5" />
              <span>Views</span>
            </div>
            <span className="font-mono text-xs font-semibold block">
              {post.views?.toLocaleString?.() ?? post.views}
            </span>
          </div>
        </div>

        <div className="space-y-1.5">
          <span className="text-xs font-medium text-muted-foreground">
            Post ID
          </span>
          <div className="font-mono text-xs text-muted-foreground bg-muted/40 p-2.5 rounded-lg border">
            {post.id}
          </div>
        </div>
      </div>
    </AppSheet>
  )
}
