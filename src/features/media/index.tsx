"use client"

import * as React from "react"
import { useTranslations } from "next-intl"
import {
  UploadCloud,
  LayoutGrid,
  List,
  Search,
  Layers,
  Image as ImageIcon,
  FileText,
  Video,
  Music,
  Archive,
  HardDrive,
  Copy,
  Check,
  Trash2,
  Eye,
  MoreVertical,
  Plus,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { DataTable } from "@/components/shared/data-table"
import { GridPagination } from "@/components/shared/grid-pagination"
import { FileTypeIcon } from "@/components/media/file-type-icon"
import { MediaDetailsSheet } from "@/components/media/media-details-sheet"
import { MediaUploadDropzone } from "@/components/media/media-upload-dropzone"
import { useMedia } from "@/context/media-provider"
import { getMediaColumns } from "./media-columns"
export * from "./media-columns"
import type { MediaItem, MediaType } from "@/data/media"
import { formatBytes } from "@/lib/media-utils"
import { cn } from "@/lib/utils"

export function MediaFeature() {
  const t = useTranslations("media")
  const { items, deleteItem } = useMedia()

  const [viewMode, setViewMode] = React.useState<"grid" | "table">("grid")
  const [selectedType, setSelectedType] = React.useState<string>("all")
  const [search, setSearch] = React.useState("")
  const [selectedItem, setSelectedItem] = React.useState<MediaItem | null>(null)
  const [showUploadZone, setShowUploadZone] = React.useState(false)
  const [copiedId, setCopiedId] = React.useState<string | null>(null)

  // Calculations for KPI Cards
  const totalAssets = items.length
  const imageCount = items.filter((i) => i.type === "image").length
  const documentCount = items.filter((i) => i.type === "document").length
  const totalBytes = items.reduce((acc, curr) => acc + (curr.size || 0), 0)

  // Filter items
  const filteredItems = React.useMemo(() => {
    return items.filter((item) => {
      if (selectedType !== "all" && item.type !== selectedType) {
        return false
      }
      if (search.trim()) {
        const query = search.toLowerCase()
        const matchesName = item.name.toLowerCase().includes(query)
        const matchesTitle = item.title?.toLowerCase().includes(query)
        const matchesAuthor = item.author?.toLowerCase().includes(query)
        if (!matchesName && !matchesTitle && !matchesAuthor) {
          return false
        }
      }
      return true
    })
  }, [items, selectedType, search])

  // Grid pagination state
  const [currentPage, setCurrentPage] = React.useState(1)
  const [pageSize, setPageSize] = React.useState(12)

  // Reset to first page when search or type filter changes
  React.useEffect(() => {
    setCurrentPage(1)
  }, [search, selectedType])

  // Clamp current page if items change
  const totalPages = Math.max(1, Math.ceil(filteredItems.length / pageSize))
  React.useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages)
    }
  }, [currentPage, totalPages])

  // Paginated items for grid view
  const paginatedGridItems = React.useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize
    return filteredItems.slice(startIndex, startIndex + pageSize)
  }, [filteredItems, currentPage, pageSize])

  const handleCopyUrl = async (item: MediaItem, e?: React.MouseEvent) => {
    e?.stopPropagation()
    try {
      await navigator.clipboard.writeText(item.url)
      setCopiedId(item.id)
      setTimeout(() => setCopiedId(null), 1800)
    } catch {
      // Fallback
    }
  }

  const columns = React.useMemo(
    () =>
      getMediaColumns({
        onView: (item) => setSelectedItem(item),
        onDelete: (id) => deleteItem(id),
        t,
      }),
    [deleteItem, t]
  )

  return (
    <div className="space-y-6">
      {/* Header with Title and Upload Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            {t("title")}
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            {t("description")}
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Button
            onClick={() => setShowUploadZone((prev) => !prev)}
            size="sm"
            className="gap-1.5 text-xs h-8 cursor-pointer shadow-xs"
          >
            <Plus className="size-3.5" />
            <span>{showUploadZone ? "Hide Upload" : t("uploadButton")}</span>
          </Button>
        </div>
      </div>

      {/* KPI Overview Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              {t("stats.totalFiles")}
            </CardTitle>
            <Layers className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono">{totalAssets}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              {t("stats.images")}
            </CardTitle>
            <ImageIcon className="size-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono text-purple-600 dark:text-purple-400">
              {imageCount}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              {t("stats.documents")}
            </CardTitle>
            <FileText className="size-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono text-blue-600 dark:text-blue-400">
              {documentCount}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              {t("stats.storage")}
            </CardTitle>
            <HardDrive className="size-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
              {formatBytes(totalBytes)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Expandable Upload Dropzone */}
      {showUploadZone && (
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="pt-6">
            <MediaUploadDropzone
              onUploadSuccess={(uploaded) => {
                if (uploaded.length > 0) {
                  setSelectedItem(uploaded[0])
                }
              }}
            />
          </CardContent>
        </Card>
      )}

      {/* Toolbar: Filters + Search + View Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <Button
            type="button"
            variant={selectedType === "all" ? "secondary" : "ghost"}
            size="sm"
            className="h-8 text-xs px-3 rounded-full cursor-pointer"
            onClick={() => setSelectedType("all")}
          >
            <Layers className="size-3.5 mr-1.5" />
            <span>{t("filter.all")}</span>
          </Button>

          <Button
            type="button"
            variant={selectedType === "image" ? "secondary" : "ghost"}
            size="sm"
            className="h-8 text-xs px-3 rounded-full cursor-pointer"
            onClick={() => setSelectedType("image")}
          >
            <ImageIcon className="size-3.5 mr-1.5 text-purple-500" />
            <span>{t("filter.image")}</span>
          </Button>

          <Button
            type="button"
            variant={selectedType === "document" ? "secondary" : "ghost"}
            size="sm"
            className="h-8 text-xs px-3 rounded-full cursor-pointer"
            onClick={() => setSelectedType("document")}
          >
            <FileText className="size-3.5 mr-1.5 text-blue-500" />
            <span>{t("filter.document")}</span>
          </Button>

          <Button
            type="button"
            variant={selectedType === "video" ? "secondary" : "ghost"}
            size="sm"
            className="h-8 text-xs px-3 rounded-full cursor-pointer"
            onClick={() => setSelectedType("video")}
          >
            <Video className="size-3.5 mr-1.5 text-purple-600" />
            <span>{t("filter.video")}</span>
          </Button>

          <Button
            type="button"
            variant={selectedType === "audio" ? "secondary" : "ghost"}
            size="sm"
            className="h-8 text-xs px-3 rounded-full cursor-pointer"
            onClick={() => setSelectedType("audio")}
          >
            <Music className="size-3.5 mr-1.5 text-pink-500" />
            <span>{t("filter.audio")}</span>
          </Button>

          <Button
            type="button"
            variant={selectedType === "archive" ? "secondary" : "ghost"}
            size="sm"
            className="h-8 text-xs px-3 rounded-full cursor-pointer"
            onClick={() => setSelectedType("archive")}
          >
            <Archive className="size-3.5 mr-1.5 text-orange-500" />
            <span>{t("filter.archive")}</span>
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
            <Input
              placeholder={t("searchPlaceholder")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 h-8 text-xs"
            />
          </div>

          <div className="flex items-center border rounded-md p-0.5 bg-muted/40 shrink-0">
            <Button
              variant={viewMode === "grid" ? "secondary" : "ghost"}
              size="icon"
              className="size-7 cursor-pointer"
              onClick={() => setViewMode("grid")}
              title="Grid view"
            >
              <LayoutGrid className="size-3.5" />
            </Button>
            <Button
              variant={viewMode === "table" ? "secondary" : "ghost"}
              size="icon"
              className="size-7 cursor-pointer"
              onClick={() => setViewMode("table")}
              title="Table view"
            >
              <List className="size-3.5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content: Table View vs Grid View */}
      {viewMode === "table" ? (
        <DataTable
          data={filteredItems}
          columns={columns}
          sorting
          pagination={{
            pageSize: 10,
            pageSizeOptions: [10, 20, 50],
          }}
          onRowClick={(item) => setSelectedItem(item)}
        />
      ) : (
        <div className="space-y-4">
          {filteredItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center border rounded-2xl border-dashed">
              <UploadCloud className="size-10 text-muted-foreground/50 mb-3" />
              <h3 className="text-sm font-semibold">{t("empty")}</h3>
              <p className="text-xs text-muted-foreground mt-1 max-w-sm">
                {t("emptyDesc")}
              </p>
              <Button
                size="sm"
                onClick={() => setShowUploadZone(true)}
                className="mt-4 text-xs h-8 cursor-pointer"
              >
                {t("uploadButton")}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
                {paginatedGridItems.map((item) => (
                  <Card
                    key={item.id}
                    onClick={() => setSelectedItem(item)}
                    className="group relative flex flex-col justify-between overflow-hidden cursor-pointer hover:border-primary/50 hover:shadow-xs transition-all select-none p-0"
                  >
                    {/* Thumbnail / Icon Container */}
                    <div className="aspect-square bg-muted/20 flex items-center justify-center p-3 overflow-hidden relative">
                      {item.type === "image" ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={item.thumbnailUrl || item.url}
                          alt={item.altText || item.title}
                          className="size-full object-cover rounded-md group-hover:scale-105 transition-transform duration-200"
                        />
                      ) : (
                        <FileTypeIcon
                          type={item.type}
                          extension={item.extension}
                          className="size-16"
                          iconClassName="size-8"
                          showBadge
                        />
                      )}

                      {/* Quick Action Buttons on hover */}
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 z-10">
                        <Button
                          type="button"
                          variant="secondary"
                          size="icon"
                          className="size-7 rounded-md shadow-xs bg-background/90 backdrop-blur-xs cursor-pointer"
                          onClick={(e) => handleCopyUrl(item, e)}
                          title={t("details.copyUrl")}
                        >
                          {copiedId === item.id ? (
                            <Check className="size-3 text-emerald-500" />
                          ) : (
                            <Copy className="size-3" />
                          )}
                        </Button>

                        <DropdownMenu>
                          <DropdownMenuTrigger
                            render={
                              <Button
                                type="button"
                                variant="secondary"
                                size="icon"
                                className="size-7 rounded-md shadow-xs bg-background/90 backdrop-blur-xs cursor-pointer"
                                onClick={(e) => e.stopPropagation()}
                              />
                            }
                          >
                            <MoreVertical className="size-3.5" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="text-xs w-36">
                            <DropdownMenuItem
                              onClick={() => setSelectedItem(item)}
                              className="cursor-pointer"
                            >
                              <Eye className="size-3.5 mr-2" />
                              <span>{t("fields.actions")}</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => deleteItem(item.id)}
                              className="text-destructive focus:text-destructive cursor-pointer"
                            >
                              <Trash2 className="size-3.5 mr-2" />
                              <span>{t("details.delete")}</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>

                    {/* Card Footer with Meta Details */}
                    <div className="p-2.5 space-y-1 bg-card border-t">
                      <span className="font-semibold text-xs text-foreground block truncate">
                        {item.title || item.name}
                      </span>
                      <div className="flex items-center justify-between text-[11px] text-muted-foreground font-mono">
                        <span className="uppercase">.{item.extension}</span>
                        <span>{formatBytes(item.size)}</span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Grid Pagination */}
              <GridPagination
                currentPage={currentPage}
                totalItems={filteredItems.length}
                pageSize={pageSize}
                onPageChange={setCurrentPage}
                onPageSizeChange={setPageSize}
                pageSizeOptions={[12, 24, 36, 48]}
                itemLabel={t("stats.totalFiles").toLowerCase()}
              />
            </div>
          )}
        </div>
      )}

      {/* WordPress-style Attachment Details Sheet */}
      <MediaDetailsSheet
        item={selectedItem}
        open={Boolean(selectedItem)}
        onOpenChange={(open) => !open && setSelectedItem(null)}
        onDelete={(id) => {
          deleteItem(id)
          setSelectedItem(null)
        }}
      />
    </div>
  )
}
