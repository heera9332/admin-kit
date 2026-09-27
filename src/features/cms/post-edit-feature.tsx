"use client"

import * as React from "react"
import { useTranslations } from "next-intl"
import {
  ArrowLeft,
  Save,
  Eye,
  Globe,
  Calendar,
  User,
  Tag,
  Clock,
  Copy,
  Check,
  Trash2,
  Sparkles,
  FileText,
  Plus,
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
import { MediaPickerInput } from "@/components/media/media-picker-input"
import { TiptapEditor } from "@/components/forms/tiptap-editor"
import { useCms } from "@/context/cms-provider"
import { useRouter, Link } from "@/i18n/routing"
import { toast } from "@/components/ui/toast"
import { cn } from "@/lib/utils"
import type { Post } from "@/data/cms"
import type { MediaItem } from "@/data/media"

interface PostEditFeatureProps {
  postId: string
}

interface PostEditFormProps {
  postId: string
  initialPost: Post | null | undefined
  isNew: boolean
}

function PostEditForm({ initialPost, isNew }: PostEditFormProps) {
  const t = useTranslations("cms.posts")
  const tCommon = useTranslations("common")
  const router = useRouter()
  const { categories, updatePost, createPost, deletePost } = useCms()

  // Form State initialized directly from initialPost
  const [title, setTitle] = React.useState(initialPost?.title || "")
  const [slug, setSlug] = React.useState(initialPost?.slug || "")
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = React.useState(
    Boolean(initialPost?.slug)
  )
  const [content, setContent] = React.useState(initialPost?.content || "")
  const [status, setStatus] = React.useState<Post["status"]>(
    initialPost?.status || "draft"
  )
  const [author, setAuthor] = React.useState(initialPost?.author || "Admin User")
  const [category, setCategory] = React.useState(
    initialPost?.category || "Engineering"
  )
  const [publishedAt, setPublishedAt] = React.useState(
    initialPost?.publishedAt || new Date().toISOString().split("T")[0]
  )
  const [featuredImage, setFeaturedImage] = React.useState<string | null>(
    initialPost?.featuredImage || null
  )
  const [metaTitle, setMetaTitle] = React.useState(
    initialPost?.metaTitle || initialPost?.title || ""
  )
  const [metaDescription, setMetaDescription] = React.useState(
    initialPost?.metaDescription || ""
  )

  // UI state
  const [isSaving, setIsSaving] = React.useState(false)
  const [previewOpen, setPreviewOpen] = React.useState(false)
  const [copiedSlug, setCopiedSlug] = React.useState(false)

  // Auto-generate slug and metaTitle from title if not manually edited
  const handleTitleChange = (val: string) => {
    setTitle(val)
    if (!isSlugManuallyEdited) {
      const generatedSlug = val
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "")
      setSlug(generatedSlug)
    }
    if (!metaTitle || metaTitle === title) {
      setMetaTitle(val)
    }
  }

  // Word count & reading time calculation
  const metrics = React.useMemo(() => {
    const text = content.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim()
    const wordCount = text ? text.split(/\s+/).length : 0
    const charCount = text.length
    const readingTime = Math.max(1, Math.ceil(wordCount / 200))
    return { wordCount, charCount, readingTime }
  }, [content])

  const copySlugToClipboard = () => {
    if (!slug) return
    navigator.clipboard.writeText(`https://example.com/posts/${slug}`)
    setCopiedSlug(true)
    setTimeout(() => setCopiedSlug(false), 2000)
  }

  const handleMediaChange = (item: MediaItem | null) => {
    setFeaturedImage(item?.url || null)
  }

  const handleSave = () => {
    if (!title.trim()) {
      toast.add({
        title: "Title is required",
        description: "Please enter a valid title for this post.",
      })
      return
    }

    setIsSaving(true)

    const finalSlug =
      slug.trim() ||
      title
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "") ||
      `post-${Date.now()}`

    try {
      if (isNew) {
        const created = createPost({
          title: title.trim(),
          slug: finalSlug,
          content,
          status,
          author: author.trim() || "Admin User",
          category,
          publishedAt,
          views: 0,
          featuredImage,
          metaTitle: metaTitle.trim() || title.trim(),
          metaDescription: metaDescription.trim(),
        })

        toast.add({
          title: t("editor.postCreatedSuccess"),
          description: `"${created.title}" has been published.`,
        })

        router.push(`/dashboard/cms/posts/${created.id}`)
      } else if (initialPost) {
        const updated: Post = {
          ...initialPost,
          title: title.trim(),
          slug: finalSlug,
          content,
          status,
          author: author.trim() || "Admin User",
          category,
          publishedAt,
          featuredImage,
          metaTitle: metaTitle.trim() || title.trim(),
          metaDescription: metaDescription.trim(),
        }

        updatePost(initialPost.id, updated)

        toast.add({
          title: t("editor.postSavedSuccess"),
          description: `Updated "${updated.title}" successfully.`,
        })
      }
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = () => {
    if (!initialPost) return
    deletePost(initialPost.id)
    toast.add({
      title: t("editor.postDeletedSuccess"),
      description: `"${initialPost.title}" has been deleted.`,
    })
    router.push("/dashboard/cms/posts")
  }

  return (
    <div className="space-y-4">
      {/* Top action header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/cms/posts"
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "h-8 gap-1.5 text-xs cursor-pointer shadow-xs"
            )}
          >
            <ArrowLeft className="size-3.5" />
            <span>{t("editor.backToPosts")}</span>
          </Link>

          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
              {isNew ? t("editor.createTitle") : t("editor.editTitle")}
            </h1>
            <StatusBadge status={status} size="sm" dot>
              {t(`statuses.${status}`)}
            </StatusBadge>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!isNew && initialPost && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleDelete}
              className="h-8 gap-1.5 text-xs text-destructive hover:bg-destructive/10 cursor-pointer"
            >
              <Trash2 className="size-3.5" />
              <span className="hidden sm:inline">{tCommon("delete")}</span>
            </Button>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={() => setPreviewOpen(true)}
            className="h-8 gap-1.5 text-xs cursor-pointer"
          >
            <Eye className="size-3.5" />
            <span>{t("editor.preview")}</span>
          </Button>

          <Button
            size="sm"
            onClick={handleSave}
            disabled={isSaving || !title.trim()}
            className="h-8 gap-1.5 text-xs cursor-pointer shadow-xs"
          >
            <Save className="size-3.5" />
            <span>
              {isSaving
                ? "Saving..."
                : isNew
                ? t("editor.publishPost")
                : t("editor.savePost")}
            </span>
          </Button>
        </div>
      </div>

      {/* Main Grid: Content (Main-Column) + Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ================= MAIN COLUMN (Title + TipTap Content) ================= */}
        <div className="lg:col-span-8 space-y-5">
          <Card className="">
            <CardContent className="space-y-4">
              {/* Post Title */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="post-title" className="text-xs font-semibold">
                    {t("editor.titleLabel")} <span className="text-destructive">*</span>
                  </Label>
                  <span className="text-[11px] text-muted-foreground font-mono">
                    {title.length} chars
                  </span>
                </div>
                <Input
                  id="post-title"
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder={t("editor.titlePlaceholder")}
                  className="text-base sm:text-lg font-semibold h-11"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-semibold">
                    {t("editor.contentLabel")}
                  </Label>
                </div>

                <TiptapEditor
                  value={content}
                  onChange={setContent}
                  placeholder={t("editor.contentPlaceholder")}
                  minHeight="min-h-[420px]"
                />
              </div>

              {/* Content Metrics Bar */}
              <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Clock className="size-3.5 text-primary" />
                  <span>
                    {metrics.readingTime} min {t("editor.readingTime")}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="font-mono font-medium text-foreground">
                    {metrics.wordCount}
                  </span>
                  <span>{t("editor.wordCount")}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="font-mono font-medium text-foreground">
                    {metrics.charCount}
                  </span>
                  <span>Characters</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ================= SIDEBAR ================= */}
        <div className="lg:col-span-4 space-y-5">
          {/* 1. Publish Settings Card */}
          <Card className="shadow-xs">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Sparkles className="size-4 text-primary" />
                <span>{t("editor.sidebarTitle")}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Status */}
              <div className="space-y-1.5">
                <Label htmlFor="post-status" className="text-xs font-medium">
                  {t("editor.statusLabel")}
                </Label>
                <Select
                  value={status}
                  onValueChange={(val) => {
                    if (val) setStatus(val as Post["status"])
                  }}
                >
                  <SelectTrigger id="post-status" className="h-8 text-xs w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="published">
                      <div className="flex items-center gap-2">
                        <span className="size-2 rounded-full bg-emerald-500" />
                        <span>{t("statuses.published")}</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="draft">
                      <div className="flex items-center gap-2">
                        <span className="size-2 rounded-full bg-amber-500" />
                        <span>{t("statuses.draft")}</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="archived">
                      <div className="flex items-center gap-2">
                        <span className="size-2 rounded-full bg-muted-foreground" />
                        <span>{t("statuses.archived")}</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Slug */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="post-slug" className="text-xs font-medium">
                    {t("editor.slugLabel")}
                  </Label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={copySlugToClipboard}
                    className="size-6 text-muted-foreground hover:text-foreground cursor-pointer"
                    title="Copy post link"
                  >
                    {copiedSlug ? (
                      <Check className="size-3 text-emerald-500" />
                    ) : (
                      <Copy className="size-3" />
                    )}
                  </Button>
                </div>
                <div className="flex rounded-lg border bg-muted/20 focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/20 overflow-hidden">
                  <span className="px-2.5 py-1.5 text-xs text-muted-foreground font-mono select-none bg-muted/40 border-r flex items-center">
                    /posts/
                  </span>
                  <input
                    id="post-slug"
                    value={slug}
                    onChange={(e) => {
                      setIsSlugManuallyEdited(true)
                      setSlug(
                        e.target.value
                          .toLowerCase()
                          .replace(/[^a-z0-9-_]/g, "")
                      )
                    }}
                    placeholder={t("editor.slugPlaceholder")}
                    className="flex-1 px-2.5 py-1.5 text-xs font-mono bg-transparent outline-none text-foreground placeholder:text-muted-foreground"
                  />
                </div>
              </div>

              {/* Author */}
              <div className="space-y-1.5">
                <Label htmlFor="post-author" className="text-xs font-medium flex items-center gap-1.5">
                  <User className="size-3.5 text-muted-foreground" />
                  <span>{t("editor.authorLabel")}</span>
                </Label>
                <Input
                  id="post-author"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="Author name"
                  className="h-8 text-xs"
                />
              </div>

              {/* Category */}
              <div className="space-y-1.5">
                <Label htmlFor="post-category" className="text-xs font-medium flex items-center gap-1.5">
                  <Tag className="size-3.5 text-muted-foreground" />
                  <span>{t("editor.categoryLabel")}</span>
                </Label>
                <Select
                  value={category}
                  onValueChange={(val) => {
                    if (val) setCategory(val)
                  }}
                >
                  <SelectTrigger id="post-category" className="h-8 text-xs w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c.id} value={c.name}>
                        {c.name}
                      </SelectItem>
                    ))}
                    {!categories.some((c) => c.name === category) && (
                      <SelectItem value={category}>{category}</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>

              {/* Published Date */}
              <div className="space-y-1.5">
                <Label htmlFor="post-published-at" className="text-xs font-medium flex items-center gap-1.5">
                  <Calendar className="size-3.5 text-muted-foreground" />
                  <span>{t("fields.publishedAt")}</span>
                </Label>
                <Input
                  id="post-published-at"
                  type="date"
                  value={publishedAt}
                  onChange={(e) => setPublishedAt(e.target.value)}
                  className="h-8 text-xs font-mono"
                />
              </div>
            </CardContent>
          </Card>

          {/* 2. Featured Image Card (Media Selector) */}
          <Card className="shadow-xs">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Globe className="size-4 text-primary" />
                <span>{t("editor.featuredImageLabel")}</span>
              </CardTitle>
              <CardDescription className="text-xs">
                {t("editor.featuredImageDesc")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <MediaPickerInput
                value={featuredImage}
                onChange={handleMediaChange}
                allowedTypes={["image"]}
                placeholder="Choose or upload featured image"
                dialogTitle="Select Featured Image"
              />
            </CardContent>
          </Card>

          {/* 3. SEO Card & SERP Preview */}
          <Card className="shadow-xs">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Globe className="size-4 text-primary" />
                <span>{t("editor.seoTitle")}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Meta Title */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="post-meta-title" className="text-xs font-medium">
                    {t("editor.metaTitleLabel")}
                  </Label>
                  <span
                    className={`text-[11px] font-mono ${
                      metaTitle.length > 60
                        ? "text-amber-500 font-semibold"
                        : "text-muted-foreground"
                    }`}
                  >
                    {metaTitle.length}/60
                  </span>
                </div>
                <Input
                  id="post-meta-title"
                  value={metaTitle}
                  onChange={(e) => setMetaTitle(e.target.value)}
                  placeholder={t("editor.metaTitlePlaceholder")}
                  className="h-8 text-xs"
                />
              </div>

              {/* Meta Description */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="post-meta-desc" className="text-xs font-medium">
                    {t("editor.metaDescLabel")}
                  </Label>
                  <span
                    className={`text-[11px] font-mono ${
                      metaDescription.length > 160
                        ? "text-amber-500 font-semibold"
                        : "text-muted-foreground"
                    }`}
                  >
                    {metaDescription.length}/160
                  </span>
                </div>
                <Textarea
                  id="post-meta-desc"
                  value={metaDescription}
                  onChange={(e) => setMetaDescription(e.target.value)}
                  placeholder={t("editor.metaDescPlaceholder")}
                  rows={3}
                  className="text-xs resize-none"
                />
              </div>

              {/* Search Result SERP Preview */}
              <div className="space-y-1.5 pt-2 border-t">
                <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider block">
                  {t("editor.serpPreview")}
                </span>
                <div className="p-3 rounded-lg border bg-card/80 space-y-1">
                  <div className="text-[11px] text-muted-foreground font-mono truncate">
                    example.com › posts › {slug || "your-slug"}
                  </div>
                  <div className="text-sm font-medium text-primary hover:underline line-clamp-1 cursor-pointer">
                    {metaTitle || title || "Article Title Preview"}
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {metaDescription ||
                      "Provide a concise meta description to help searchers understand your article on Google search results."}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Live Preview Sheet */}
      <AppSheet
        open={previewOpen}
        onOpenChange={setPreviewOpen}
        side="right"
        size="lg"
        title="Article Live Preview"
        description={`Previewing draft for /posts/${slug || "new"}`}
      >
        <div className="space-y-4 py-2">
          {featuredImage && (
            <div className="aspect-video w-full rounded-xl overflow-hidden border bg-muted/20">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={featuredImage}
                alt={title}
                className="size-full object-cover"
              />
            </div>
          )}

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="outline">{category}</Badge>
              <StatusBadge status={status} size="sm" dot>
                {t(`statuses.${status}`)}
              </StatusBadge>
            </div>
            <h1 className="text-2xl font-bold leading-tight">{title || "Untitled Post"}</h1>
            <div className="flex items-center gap-3 text-xs text-muted-foreground pt-1">
              <span>By {author}</span>
              <span>•</span>
              <span>{publishedAt}</span>
              <span>•</span>
              <span>{metrics.readingTime} min read</span>
            </div>
          </div>

          <div className="border-t pt-4">
            <div
              className="prose prose-sm dark:prose-invert max-w-none [&_p]:my-2 [&_h2]:text-lg [&_h3]:text-base [&_ul]:pl-5 [&_ol]:pl-5"
              dangerouslySetInnerHTML={{
                __html: content || "<p><em>No content written yet...</em></p>",
              }}
            />
          </div>
        </div>
      </AppSheet>
    </div>
  )
}

export function PostEditFeature({ postId }: PostEditFeatureProps) {
  const t = useTranslations("cms.posts")
  const { getPost } = useCms()
  const isNew = postId === "new"

  const existingPost = React.useMemo(() => {
    if (isNew) return null
    return getPost(postId)
  }, [getPost, postId, isNew])

  if (!isNew && !existingPost) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[420px] p-6 text-center space-y-4 rounded-xl border bg-card shadow-xs">
        <div className="flex size-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
          <FileText className="size-7 opacity-60" />
        </div>
        <div className="space-y-1">
          <h2 className="text-xl font-bold tracking-tight">Post Not Found</h2>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-md">
            The post with ID{" "}
            <code className="font-mono bg-muted/80 px-1.5 py-0.5 rounded text-xs text-foreground">
              {postId}
            </code>{" "}
            could not be found or may have been deleted.
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
          <Link
            href="/dashboard/cms/posts"
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "h-8 gap-1.5 text-xs cursor-pointer shadow-xs"
            )}
          >
            <ArrowLeft className="size-3.5" />
            <span>{t("editor.backToPosts")}</span>
          </Link>
          <Link
            href="/dashboard/cms/posts/new"
            className={cn(
              buttonVariants({ size: "sm" }),
              "h-8 gap-1.5 text-xs cursor-pointer shadow-xs"
            )}
          >
            <Plus className="size-3.5" />
            <span>{t("editor.createTitle")}</span>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <PostEditForm
      key={postId}
      postId={postId}
      initialPost={existingPost}
      isNew={isNew}
    />
  )
}
