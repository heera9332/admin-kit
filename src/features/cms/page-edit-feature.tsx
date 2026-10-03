"use client"

import * as React from "react"
import { useTranslations } from "next-intl"
import {
  ArrowLeft,
  Save,
  Eye,
  Globe,
  User,
  Clock,
  Copy,
  Check,
  Trash2,
  Sparkles,
  FileCode,
  Layers,
  CornerDownRight,
} from "lucide-react"

import { Button, buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { StatusBadge } from "@/components/status-badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { AppSheet } from "@/components/app-sheet"
import { UploadInput } from "@/components/forms/upload"
import { TiptapEditor } from "@/components/forms/tiptap-editor"
import { useCms } from "@/context/cms-provider"
import { useRouter, Link } from "@/i18n/routing"
import { toast } from "@/components/ui/toast"
import { cn } from "@/lib/utils"
import type { CmsPage, PageTemplate, PageStatus } from "@/data/cms"

interface PageEditFeatureProps {
  pageId: string
}

interface PageEditFormProps {
  pageId: string
  initialPage: CmsPage | null | undefined
  isNew: boolean
}

function PageEditForm({ initialPage, isNew }: PageEditFormProps) {
  const t = useTranslations("cms.pages")
  const tCommon = useTranslations("common")
  const router = useRouter()
  const { pages, updatePage, createPage, deletePage } = useCms()

  // Form State
  const [title, setTitle] = React.useState(initialPage?.title || "")
  const [slug, setSlug] = React.useState(initialPage?.slug || "")
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = React.useState(
    Boolean(initialPage?.slug)
  )
  const [excerpt, setExcerpt] = React.useState(initialPage?.excerpt || "")
  const [content, setContent] = React.useState(initialPage?.content || "")
  const [status, setStatus] = React.useState<PageStatus>(
    initialPage?.status || "draft"
  )
  const [template, setTemplate] = React.useState<PageTemplate>(
    initialPage?.template || "default"
  )
  const [parentId, setParentId] = React.useState<string | null>(
    initialPage?.parentId || null
  )
  const [order, setOrder] = React.useState<number>(initialPage?.order ?? 0)
  const [author] = React.useState(initialPage?.author || "Admin User")
  const [publishedAt, setPublishedAt] = React.useState(
    initialPage?.publishedAt || new Date().toISOString().split("T")[0]
  )
  const [featuredImage, setFeaturedImage] = React.useState<string | null>(
    initialPage?.featuredImage || null
  )
  const [metaTitle, setMetaTitle] = React.useState(
    initialPage?.metaTitle || initialPage?.title || ""
  )
  const [metaDescription, setMetaDescription] = React.useState(
    initialPage?.metaDescription || initialPage?.excerpt || ""
  )

  const [isSaving, setIsSaving] = React.useState(false)
  const [isSaved, setIsSaved] = React.useState(false)
  const [copiedSlug, setCopiedSlug] = React.useState(false)
  const [previewOpen, setPreviewOpen] = React.useState(false)
  const [isEditingSlug, setIsEditingSlug] = React.useState(false)

  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle)
    if (!isSlugManuallyEdited) {
      const generated = newTitle
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "")
      setSlug(generated)
    }
  }

  const parentPage = parentId ? pages.find((p) => p.id === parentId) : null
  const fullPermalink = `https://luminacommerce.com/${parentPage ? `${parentPage.slug}/` : ""}${slug || "page"}`

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(fullPermalink)
      setCopiedSlug(true)
      setTimeout(() => setCopiedSlug(false), 2000)
      toast.add({
        title: "Permalink copied",
        description: fullPermalink,
      })
    } catch {
      // Fallback
    }
  }

  const handleSave = (publishNow = false) => {
    if (!title.trim()) {
      toast.add({
        title: "Title is required",
        description: "Please enter a page title before saving.",
      })
      return
    }

    setIsSaving(true)
    const effectiveStatus: PageStatus = publishNow ? "published" : status

    try {
      if (isNew) {
        const created = createPage({
          title: title.trim(),
          slug: slug.trim() || undefined,
          status: effectiveStatus,
          template,
          parentId: parentId || null,
          order: Number(order) || 0,
          author,
          publishedAt,
          excerpt: excerpt.trim(),
          content,
          featuredImage,
          metaTitle: metaTitle.trim(),
          metaDescription: metaDescription.trim(),
        })

        toast.add({
          title: t("editor.pageCreatedSuccess"),
          description: `Page "${created.title}" has been saved.`,
        })

        router.replace(`/dashboard/cms/pages/${created.id}`)
      } else if (initialPage) {
        updatePage(initialPage.id, {
          title: title.trim(),
          slug: slug.trim() || initialPage.slug,
          status: effectiveStatus,
          template,
          parentId: parentId || null,
          order: Number(order) || 0,
          author,
          publishedAt,
          excerpt: excerpt.trim(),
          content,
          featuredImage,
          metaTitle: metaTitle.trim(),
          metaDescription: metaDescription.trim(),
        })

        if (publishNow) {
          setStatus("published")
        }

        setIsSaved(true)
        setTimeout(() => setIsSaved(false), 2500)

        toast.add({
          title: t("editor.pageSavedSuccess"),
          description: `Saved changes to "${title.trim()}".`,
        })
      }
    } catch {
      toast.add({
        title: "Save failed",
        description: "An error occurred while saving the page.",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = () => {
    if (!initialPage) return
    deletePage(initialPage.id)
    toast.add({
      title: t("editor.pageDeletedSuccess"),
      description: `"${initialPage.title}" moved to trash.`,
    })
    router.push("/dashboard/cms/pages")
  }

  const wordCount = content
    ? content.replace(/<[^>]*>/g, "").split(/\s+/).filter(Boolean).length
    : 0
  const readingTime = Math.ceil(wordCount / 200) || 1

  const eligibleParents = pages
    .filter((p) => p.id !== initialPage?.id)
    .map((p) => ({ value: p.id, label: p.title }))

  return (
    <div className="space-y-6 pb-16">
      {/* Top Navigation & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-border/60">
        <div className="flex items-center gap-3 min-w-0">
          <Link
            href="/dashboard/cms/pages"
            className={cn(
              buttonVariants({ variant: "ghost", size: "sm" }),
              "gap-1.5 text-xs text-muted-foreground hover:text-foreground cursor-pointer -ml-2"
            )}
          >
            <ArrowLeft className="size-3.5" />
            <span>{t("editor.backToPages")}</span>
          </Link>

          <div className="h-4 w-px bg-border/60" />

          <div className="flex items-center gap-2 min-w-0">
            <span className="text-xs font-semibold text-foreground truncate max-w-[200px] sm:max-w-xs">
              {title || (isNew ? t("editor.createTitle") : t("editor.editTitle"))}
            </span>
            <StatusBadge
              status={
                status === "published"
                  ? "success"
                  : status === "draft"
                  ? "warning"
                  : status === "private"
                  ? "info"
                  : "neutral"
              }
            >
              {t(`statuses.${status}`)}
            </StatusBadge>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 shrink-0">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setPreviewOpen(true)}
            className="text-xs gap-1.5 cursor-pointer h-8"
          >
            <Eye className="size-3.5" />
            <span>{t("editor.preview")}</span>
          </Button>

          {status !== "published" && (
            <Button
              type="button"
              variant="secondary"
              size="sm"
              disabled={isSaving}
              onClick={() => handleSave(false)}
              className="text-xs gap-1.5 cursor-pointer h-8"
            >
              <Save className="size-3.5" />
              <span>{isSaving ? "Saving..." : "Save Draft"}</span>
            </Button>
          )}

          <Button
            type="button"
            size="sm"
            disabled={isSaving}
            onClick={() => handleSave(true)}
            className="text-xs gap-1.5 cursor-pointer shadow-xs h-8"
          >
            {isSaved ? (
              <Check className="size-3.5 text-primary-foreground" />
            ) : status === "published" ? (
              <Save className="size-3.5" />
            ) : (
              <Sparkles className="size-3.5" />
            )}
            <span>
              {isSaved
                ? "Saved"
                : isSaving
                ? "Saving..."
                : status === "published"
                ? t("editor.savePage")
                : t("editor.publishPage")}
            </span>
          </Button>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Title, Slug, TipTap Content, Excerpt, SEO */}
        <div className="lg:col-span-2 space-y-6 min-w-0 pb-0">
          {/* Title Card */}
          <Card className="shadow-xs overflow-hidden py-0">
            <CardContent className="p-4 space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="page-title" className="text-xs font-medium">
                  {t("editor.titleLabel")}
                </Label>
                <Input
                  id="page-title"
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder={t("editor.titlePlaceholder")}
                  className="text-lg sm:text-xl font-semibold tracking-tight"
                />
              </div>

              {/* Permalink bar with click to edit / copy */}
              <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/30 px-3 py-2 rounded-lg border">
                <Globe className="size-3.5 shrink-0 text-muted-foreground" />
                <span className="shrink-0 font-medium">Permalink:</span>

                {isEditingSlug ? (
                  <div className="flex items-center gap-1.5 flex-1 min-w-0">
                    <span className="font-mono text-[11px] truncate">
                      https://luminacommerce.com/{parentPage ? `${parentPage.slug}/` : ""}
                    </span>
                    <Input
                      value={slug}
                      onChange={(e) => {
                        setIsSlugManuallyEdited(true)
                        setSlug(
                          e.target.value
                            .toLowerCase()
                            .replace(/[^a-z0-9-]+/g, "-")
                        )
                      }}
                      className="h-6 text-xs font-mono py-0 px-1.5 w-32 sm:w-40"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setIsEditingSlug(false)}
                      className="h-6 text-[10px] px-2"
                    >
                      OK
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 flex-1 min-w-0 overflow-hidden">
                    <span className="font-mono text-[11px] truncate text-foreground">
                      {fullPermalink}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsEditingSlug(true)}
                      className="h-6 text-[10px] px-1.5 text-primary hover:underline cursor-pointer"
                    >
                      Edit
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={handleCopyLink}
                      className="size-6 text-muted-foreground hover:text-foreground cursor-pointer"
                      title="Copy permalink"
                    >
                      {copiedSlug ? (
                        <Check className="size-3 text-emerald-500" />
                      ) : (
                        <Copy className="size-3" />
                      )}
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Page Content Editor */}
          <Card className="shadow-xs overflow-hidden">
            <CardHeader className="pb-3 border-b bg-muted/20">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base font-semibold">
                    {t("editor.contentLabel")}
                  </CardTitle>
                  <CardDescription className="text-xs">
                    {t("editor.contentPlaceholder")}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground font-mono">
                  <span>{wordCount} {t("editor.wordCount").toLowerCase()}</span>
                  <span>•</span>
                  <span>~{readingTime} min</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <TiptapEditor
                value={content}
                onChange={setContent}
                placeholder={t("editor.contentPlaceholder")}
                minHeight="420px"
              />
            </CardContent>
          </Card>

          {/* Excerpt */}
          <Card className="shadow-xs">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">
                {t("editor.excerptLabel")}
              </CardTitle>
              <CardDescription className="text-xs">
                {t("editor.excerptPlaceholder")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder={t("editor.excerptPlaceholder")}
                rows={3}
                className="text-xs resize-y"
              />
            </CardContent>
          </Card>

          {/* Search Engine Optimization (SEO) */}
          <Card className="shadow-xs overflow-hidden ">
            <CardHeader className="pb-3 bg-muted/20 border-b">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Sparkles className="size-4 text-primary" />
                <span>{t("editor.seoTitle")}</span>
              </CardTitle>
              <CardDescription className="text-xs">
                Preview and customize how this page appears in search engine results.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              {/* Google SERP Preview Box */}
              <div className="p-4 rounded-xl border bg-card/60 space-y-1 text-xs">
                <span className="text-[10px] uppercase font-mono tracking-wider text-muted-foreground block mb-1">
                  {t("editor.serpPreview")}
                </span>
                <div className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline cursor-pointer truncate">
                  {metaTitle || title || "Lumina Page Title"}
                </div>
                <div className="text-[11px] text-emerald-700 dark:text-emerald-400 font-mono truncate">
                  {fullPermalink}
                </div>
                <div className="text-xs text-muted-foreground line-clamp-2">
                  {metaDescription || excerpt || "No search description provided. Search engines will automatically generate a snippet based on page content."}
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <Label htmlFor="meta-title" className="text-xs font-medium">
                    {t("editor.metaTitleLabel")}
                  </Label>
                  <span className="font-mono text-[10px] text-muted-foreground">
                    {metaTitle.length}/60
                  </span>
                </div>
                <Input
                  id="meta-title"
                  value={metaTitle}
                  onChange={(e) => setMetaTitle(e.target.value)}
                  placeholder={t("editor.metaTitlePlaceholder")}
                  className="text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <Label htmlFor="meta-desc" className="text-xs font-medium">
                    {t("editor.metaDescLabel")}
                  </Label>
                  <span className="font-mono text-[10px] text-muted-foreground">
                    {metaDescription.length}/160
                  </span>
                </div>
                <Textarea
                  id="meta-desc"
                  value={metaDescription}
                  onChange={(e) => setMetaDescription(e.target.value)}
                  placeholder={t("editor.metaDescPlaceholder")}
                  rows={2}
                  className="text-xs resize-none"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Sidebar: Status, Page Attributes, Featured Image */}
        <div className="space-y-6">
          {/* Status & Visibility Card */}
          <Card className="shadow-xs overflow-hidden pb-0">
            <CardHeader className="pb-3 border-b bg-muted/20">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Clock className="size-4 text-primary" />
                <span>{t("editor.sidebarTitle")}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="page-status" className="text-xs font-medium">
                  {t("editor.statusLabel")}
                </Label>
                <Select
                  value={status}
                  onValueChange={(val) => setStatus(val as PageStatus)}
                >
                  <SelectTrigger id="page-status" className="w-full text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="published">{t("statuses.published")}</SelectItem>
                    <SelectItem value="draft">{t("statuses.draft")}</SelectItem>
                    <SelectItem value="private">{t("statuses.private")}</SelectItem>
                    <SelectItem value="archived">{t("statuses.archived")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="page-author" className="text-xs font-medium">
                  {t("editor.authorLabel")}
                </Label>
                <div className="flex items-center gap-2 p-2 rounded-lg border bg-muted/20 text-xs">
                  <User className="size-3.5 text-muted-foreground" />
                  <span className="font-medium text-foreground">{author}</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="page-date" className="text-xs font-medium">
                  Publish Date
                </Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="page-date"
                    type="date"
                    value={publishedAt}
                    onChange={(e) => setPublishedAt(e.target.value)}
                    className="text-xs font-mono"
                  />
                </div>
              </div>

              {!isNew && initialPage && (
                <div className="pt-3 border-t">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleDelete}
                    className="w-full text-xs text-destructive hover:bg-destructive/10 hover:text-destructive gap-1.5 cursor-pointer justify-start"
                  >
                    <Trash2 className="size-3.5" />
                    <span>Move Page to Trash</span>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* WordPress-Specific: Page Attributes Card */}
          <Card className="shadow-xs overflow-hidden pb-0">
            <CardHeader className="pb-3 border-b bg-muted/20">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Layers className="size-4 text-primary" />
                <span>{t("editor.attributesTitle")}</span>
              </CardTitle>
              <CardDescription className="text-xs">
                Configure hierarchy, page templates, and menu sorting.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              {/* Template */}
              <div className="space-y-1.5">
                <Label htmlFor="page-template" className="text-xs font-medium">
                  {t("editor.templateLabel")}
                </Label>
                <Select
                  value={template}
                  onValueChange={(val) => setTemplate(val as PageTemplate)}
                >
                  <SelectTrigger id="page-template" className="w-full text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">{t("templates.default")}</SelectItem>
                    <SelectItem value="full_width">{t("templates.full_width")}</SelectItem>
                    <SelectItem value="landing">{t("templates.landing")}</SelectItem>
                    <SelectItem value="contact">{t("templates.contact")}</SelectItem>
                    <SelectItem value="sidebar_left">{t("templates.sidebar_left")}</SelectItem>
                    <SelectItem value="sidebar_right">{t("templates.sidebar_right")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Parent Page */}
              <div className="space-y-1.5">
                <Label htmlFor="page-parent" className="text-xs font-medium">
                  {t("editor.parentLabel")}
                </Label>
                <Select
                  value={parentId || "none"}
                  onValueChange={(val) => setParentId(val === "none" ? null : val)}
                >
                  <SelectTrigger id="page-parent" className="w-full text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">{t("editor.noParent")}</SelectItem>
                    {eligibleParents.map((parent) => (
                      <SelectItem key={parent.value} value={parent.value}>
                        {parent.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {parentPage && (
                  <span className="text-[11px] text-muted-foreground flex items-center gap-1 mt-1">
                    <CornerDownRight className="size-3" />
                    Subpage of {parentPage.title}
                  </span>
                )}
              </div>

              {/* Menu Order */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="page-order" className="text-xs font-medium">
                    {t("editor.orderLabel")}
                  </Label>
                  <span className="text-[10px] text-muted-foreground font-mono">
                    Integer (0, 1, 2...)
                  </span>
                </div>
                <Input
                  id="page-order"
                  type="number"
                  value={order}
                  onChange={(e) => setOrder(parseInt(e.target.value, 10) || 0)}
                  placeholder="0"
                  className="text-xs font-mono"
                />
                <span className="text-[11px] text-muted-foreground block">
                  {t("editor.orderDesc")}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Featured Image Banner */}
          <Card className="shadow-xs overflow-hidden pb-0">
            <CardHeader className="pb-3 border-b bg-muted/20">
              <CardTitle className="text-sm font-semibold">
                {t("editor.featuredImageLabel")}
              </CardTitle>
              <CardDescription className="text-xs">
                {t("editor.featuredImageDesc")}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4">
              <UploadInput
                value={featuredImage}
                onChange={(val) => {
                  if (!val) setFeaturedImage(null)
                  else if (typeof val === "string") setFeaturedImage(val)
                  else setFeaturedImage(val.url)
                }}
                allowedTypes={["image"]}
                placeholder="Choose header or banner image"
                dialogTitle="Select Page Header Banner"
                previewVariant="card"
              />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Preview Sheet Modal */}
      <AppSheet
        open={previewOpen}
        onOpenChange={setPreviewOpen}
        side="right"
        size="lg"
        title={
          <div className="flex items-center gap-2 min-w-0 pr-6">
            <FileCode className="size-4.5 text-primary shrink-0" />
            <span className="truncate">{title || "Untitled Page"}</span>
          </div>
        }
        description={fullPermalink}
        footer={
          <div className="flex items-center justify-between w-full">
            <Badge variant="outline" className="text-[11px] font-mono capitalize">
              Template: {template.replace(/_/g, " ")}
            </Badge>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setPreviewOpen(false)}
              className="text-xs cursor-pointer"
            >
              {tCommon("close")}
            </Button>
          </div>
        }
      >
        <div className="space-y-5 py-2">
          {featuredImage && (
            <div className="relative rounded-xl border overflow-hidden bg-muted/20 h-48 w-full flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={featuredImage}
                alt={title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground font-heading">
              {title || "Untitled Page"}
            </h1>
            <div className="flex items-center gap-3 text-xs text-muted-foreground font-mono">
              <span>{publishedAt}</span>
              <span>•</span>
              <span>{author}</span>
              <span>•</span>
              <span className="capitalize">{status}</span>
            </div>
          </div>

          {excerpt && (
            <p className="text-sm text-foreground/90 italic leading-relaxed p-3 rounded-lg border bg-muted/20">
              &ldquo;{excerpt}&rdquo;
            </p>
          )}

          <div
            className="prose prose-sm dark:prose-invert max-w-none text-xs sm:text-sm leading-relaxed p-4 rounded-xl border bg-card/60"
            dangerouslySetInnerHTML={{
              __html: content || "<p class='text-muted-foreground italic'>No content written yet.</p>",
            }}
          />
        </div>
      </AppSheet>
    </div>
  )
}

export function PageEditFeature({ pageId }: PageEditFeatureProps) {
  const { pages } = useCms()
  const isNew = pageId === "new"

  const page = React.useMemo(() => {
    if (isNew) return null
    return pages.find((p) => p.id === pageId)
  }, [pages, pageId, isNew])

  if (!isNew && !page) {
    return (
      <div className="p-8 text-center space-y-4 max-w-md mx-auto">
        <div className="size-12 rounded-xl bg-destructive/10 text-destructive flex items-center justify-center mx-auto">
          <FileCode className="size-6" />
        </div>
        <div className="space-y-1">
          <h2 className="text-lg font-bold">Page Not Found</h2>
          <p className="text-xs text-muted-foreground">
            The page you are looking for does not exist or has been removed.
          </p>
        </div>
        <Link
          href="/dashboard/cms/pages"
          className={cn(buttonVariants({ variant: "outline", size: "sm" }), "text-xs cursor-pointer")}
        >
          <ArrowLeft className="size-3.5 mr-1.5" />
          <span>Back to Pages</span>
        </Link>
      </div>
    )
  }

  return (
    <PageEditForm
      key={page ? page.id : "new-page"}
      pageId={pageId}
      initialPage={page}
      isNew={isNew}
    />
  )
}
