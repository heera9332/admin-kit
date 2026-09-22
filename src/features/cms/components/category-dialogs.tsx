"use client"

import * as React from "react"
import { useTranslations } from "next-intl"
import { FolderTree, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { AppDialog } from "@/components/app-dialog"
import { AppSheet } from "@/components/app-sheet"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import type { Category } from "../data/cms-data"

interface CreateCategoryDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreate: (category: Category) => void
}

export function CreateCategoryDialog({
  open,
  onOpenChange,
  onCreate,
}: CreateCategoryDialogProps) {
  const t = useTranslations("cms.categories")
  const tCommon = useTranslations("common")

  const [name, setName] = React.useState("")
  const [slug, setSlug] = React.useState("")
  const [description, setDescription] = React.useState("")
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = React.useState(false)

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setName(val)
    if (!isSlugManuallyEdited) {
      setSlug(
        val
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "")
      )
    }
  }

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsSlugManuallyEdited(true)
    setSlug(
      e.target.value
        .toLowerCase()
        .replace(/[^a-z0-9-_]/g, "")
    )
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!name.trim()) return

    const generatedSlug =
      slug.trim() ||
      name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "")

    const newCategory: Category = {
      id: `cat-${Date.now()}`,
      name: name.trim(),
      slug: generatedSlug,
      description: description.trim(),
      postCount: 0,
    }

    onCreate(newCategory)
    setName("")
    setSlug("")
    setDescription("")
    setIsSlugManuallyEdited(false)
    onOpenChange(false)
  }

  return (
    <AppDialog
      open={open}
      onOpenChange={onOpenChange}
      title={t("dialog.createTitle")}
      description={t("dialog.createDescription")}
      onSubmit={handleSubmit}
      size="md"
      footer={
        <div className="flex items-center justify-end gap-2 w-full">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            {tCommon("cancel")}
          </Button>
          <Button type="submit">{t("dialog.create")}</Button>
        </div>
      }
    >
      <div className="grid gap-4 py-2">
        <div className="space-y-1.5">
          <Label htmlFor="category-name">{t("fields.name")}</Label>
          <Input
            id="category-name"
            placeholder={t("dialog.namePlaceholder")}
            value={name}
            onChange={handleNameChange}
            required
            autoFocus
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="category-slug">{t("fields.slug")}</Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono text-xs text-muted-foreground">
              /
            </span>
            <Input
              id="category-slug"
              placeholder={t("dialog.slugPlaceholder")}
              value={slug}
              onChange={handleSlugChange}
              className="pl-6 font-mono text-xs"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="category-desc">{t("fields.description")}</Label>
          <Textarea
            id="category-desc"
            placeholder={t("dialog.descPlaceholder")}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
          />
        </div>
      </div>
    </AppDialog>
  )
}

interface ViewCategorySheetProps {
  category: Category | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onDelete?: (id: string) => void
}

export function ViewCategorySheet({
  category,
  open,
  onOpenChange,
  onDelete,
}: ViewCategorySheetProps) {
  const t = useTranslations("cms.categories")
  const tCommon = useTranslations("common")

  if (!category) return null

  return (
    <AppSheet
      open={open}
      onOpenChange={onOpenChange}
      side="right"
      size="md"
      title={category.name}
      description={`/${category.slug}`}
      footer={
        <div className="flex items-center justify-between w-full gap-2">
          {onDelete ? (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => {
                onOpenChange(false)
                onDelete(category.id)
              }}
              className="gap-1.5"
            >
              <Trash2 className="size-3.5" />
              <span>{tCommon("delete")}</span>
            </Button>
          ) : <div />}

          <Button
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
          >
            {tCommon("close")}
          </Button>
        </div>
      }
    >
      <div className="flex flex-col gap-4 py-2">
        <div className="flex items-center gap-3 p-4 rounded-xl border bg-card shadow-xs">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <FolderTree className="size-6" />
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="text-base font-semibold truncate">{category.name}</h4>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="font-mono text-xs text-muted-foreground truncate">
                /{category.slug}
              </span>
              <Badge variant="secondary" className="text-[10px] font-mono px-1.5 py-0">
                {category.postCount} {t("fields.postCount").toLowerCase()}
              </Badge>
            </div>
          </div>
        </div>

        <div className="space-y-1.5">
          <span className="text-xs font-medium text-muted-foreground">
            {t("fields.description")}
          </span>
          <p className="text-sm leading-relaxed text-foreground bg-muted/30 p-3 rounded-lg border">
            {category.description || "No description provided."}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded-lg border bg-card space-y-1">
            <span className="text-muted-foreground block text-[11px] font-medium">
              Category ID
            </span>
            <span className="font-mono text-xs font-semibold">{category.id}</span>
          </div>

          <div className="p-3 rounded-lg border bg-card space-y-1">
            <span className="text-muted-foreground block text-[11px] font-medium">
              {t("sheet.postsCount")}
            </span>
            <span className="font-mono text-xs font-semibold">
              {category.postCount}
            </span>
          </div>
        </div>
      </div>
    </AppSheet>
  )
}
