"use client"

import * as React from "react"
import { useTranslations } from "next-intl"
import {
  Check,
  Search,
  Filter,
  Image as ImageIcon,
  FileText,
  Video,
  Music,
  Archive,
  Layers,
  X,
  ExternalLink,
} from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useMedia } from "@/context/media-provider"
import { GridPagination } from "@/components/shared/grid-pagination"
import { FileTypeIcon } from "./file-type-icon"
import { MediaUploadDropzone } from "./media-upload-dropzone"
import type { MediaItem, MediaType } from "@/data/media"
import { formatBytes } from "@/lib/media-utils"
import { cn } from "@/lib/utils"

export interface MediaPickerDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelect: (selected: MediaItem | MediaItem[]) => void
  multiple?: boolean
  allowedTypes?: MediaType[]
  title?: string
  selectButtonText?: string
  initialSelectedId?: string
  initialSelectedIds?: string[]
}

export function MediaPickerDialog({
  open,
  onOpenChange,
  onSelect,
  multiple = false,
  allowedTypes,
  title,
  selectButtonText,
  initialSelectedId,
  initialSelectedIds = [],
}: MediaPickerDialogProps) {
  const t = useTranslations("media")
  const tCommon = useTranslations("common")
  const { items } = useMedia()

  const [activeTab, setActiveTab] = React.useState<"upload" | "library">("library")
  const [search, setSearch] = React.useState("")
  const [selectedType, setSelectedType] = React.useState<string>("all")
  const [selectedIds, setSelectedIds] = React.useState<string[]>([])
  const [focusedId, setFocusedId] = React.useState<string | null>(null)

  // Initialize selected IDs on open
  React.useEffect(() => {
    if (open) {
      if (initialSelectedIds.length > 0) {
        setSelectedIds(initialSelectedIds)
        setFocusedId(initialSelectedIds[0])
      } else if (initialSelectedId) {
        setSelectedIds([initialSelectedId])
        setFocusedId(initialSelectedId)
      } else {
        setSelectedIds([])
        setFocusedId(null)
      }
    }
  }, [open, initialSelectedId, initialSelectedIds])

  // Filter items based on search and type filters
  const filteredItems = React.useMemo(() => {
    return items.filter((item) => {
      // Type restrictions from props
      if (allowedTypes && allowedTypes.length > 0 && !allowedTypes.includes(item.type)) {
        return false
      }

      // Type tabs filter
      if (selectedType !== "all" && item.type !== selectedType) {
        return false
      }

      // Search query
      if (search.trim()) {
        const query = search.toLowerCase()
        const matchesName = item.name.toLowerCase().includes(query)
        const matchesTitle = item.title?.toLowerCase().includes(query)
        const matchesCaption = item.caption?.toLowerCase().includes(query)
        if (!matchesName && !matchesTitle && !matchesCaption) {
          return false
        }
      }

      return true
    })
  }, [items, allowedTypes, selectedType, search])

  // Pagination state for library tab
  const [pickerPage, setPickerPage] = React.useState(1)
  const [pickerPageSize, setPickerPageSize] = React.useState(10)

  // Reset page when filter or search changes
  React.useEffect(() => {
    setPickerPage(1)
  }, [selectedType, search, activeTab])

  // Clamp current page if items change
  const totalPickerPages = Math.max(1, Math.ceil(filteredItems.length / pickerPageSize))
  React.useEffect(() => {
    if (pickerPage > totalPickerPages) {
      setPickerPage(totalPickerPages)
    }
  }, [pickerPage, totalPickerPages])

  // Paginated items for the picker grid
  const paginatedPickerItems = React.useMemo(() => {
    const startIndex = (pickerPage - 1) * pickerPageSize
    return filteredItems.slice(startIndex, startIndex + pickerPageSize)
  }, [filteredItems, pickerPage, pickerPageSize])

  // Focused item for the WordPress right-hand inspector preview
  const focusedItem = React.useMemo(() => {
    if (!focusedId) {
      return selectedIds.length > 0
        ? items.find((i) => i.id === selectedIds[selectedIds.length - 1]) || null
        : null
    }
    return items.find((i) => i.id === focusedId) || null
  }, [items, focusedId, selectedIds])

  const toggleSelect = (item: MediaItem) => {
    setFocusedId(item.id)
    if (multiple) {
      setSelectedIds((prev) =>
        prev.includes(item.id)
          ? prev.filter((id) => id !== item.id)
          : [...prev, item.id]
      )
    } else {
      setSelectedIds([item.id])
    }
  }

  const handleUploadSuccess = (newlyUploaded: MediaItem[]) => {
    if (newlyUploaded.length > 0) {
      if (multiple) {
        setSelectedIds((prev) => [...prev, ...newlyUploaded.map((i) => i.id)])
      } else {
        setSelectedIds([newlyUploaded[0].id])
      }
      setFocusedId(newlyUploaded[0].id)
      setActiveTab("library")
    }
  }

  const handleConfirm = () => {
    const selectedMedia = items.filter((i) => selectedIds.includes(i.id))
    if (multiple) {
      onSelect(selectedMedia)
    } else {
      if (selectedMedia.length > 0) {
        onSelect(selectedMedia[0])
      }
    }
    onOpenChange(false)
  }

  const isTypeAllowed = (type: MediaType) => {
    if (!allowedTypes || allowedTypes.length === 0) return true
    return allowedTypes.includes(type)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl! w-[95vw] h-[88vh] max-h-[850px] p-0 gap-0 overflow-hidden flex flex-col">
        {/* Header with Title and Mode */}
        <DialogHeader className="px-5 py-3.5 border-b shrink-0 flex flex-row items-center justify-between space-y-0">
          <DialogTitle className="text-base font-semibold">
            {title || t("selector.title")}
          </DialogTitle>
        </DialogHeader>

        {/* Tab Navigation: Upload Files / Media Library */}
        <Tabs
          value={activeTab}
          onValueChange={(val) => setActiveTab(val as "upload" | "library")}
          className="flex-1 flex flex-col overflow-hidden"
        >
          <div className="px-5 border-b bg-muted/20 shrink-0">
            <TabsList className="bg-transparent h-10 p-0 gap-4">
              <TabsTrigger
                value="upload"
                className="relative h-10 rounded-none border-b-2 border-transparent px-2 font-medium data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none text-xs"
              >
                {t("selector.tabUpload")}
              </TabsTrigger>
              <TabsTrigger
                value="library"
                className="relative h-10 rounded-none border-b-2 border-transparent px-2 font-medium data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none text-xs"
              >
                {t("selector.tabLibrary")}
                <Badge variant="secondary" className="ml-1.5 text-[10px] font-mono px-1.5 py-0">
                  {filteredItems.length}
                </Badge>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* TAB 1: Upload Dropzone */}
          <TabsContent value="upload" className="flex-1 p-6 m-0 overflow-y-auto">
            <div className="max-w-xl mx-auto h-full flex flex-col justify-center">
              <MediaUploadDropzone onUploadSuccess={handleUploadSuccess} />
            </div>
          </TabsContent>

          {/* TAB 2: WordPress-Style Media Library (Grid + Inspector) */}
          <TabsContent value="library" className="flex-1 m-0 flex flex-col overflow-hidden">
            {/* Filter & Search Bar */}
            <div className="px-5 py-3 border-b bg-background flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
                <Button
                  type="button"
                  variant={selectedType === "all" ? "secondary" : "ghost"}
                  size="sm"
                  className="h-7 text-xs px-2.5 cursor-pointer rounded-full"
                  onClick={() => setSelectedType("all")}
                >
                  <Layers className="size-3 mr-1" />
                  {t("filter.all")}
                </Button>

                {isTypeAllowed("image") && (
                  <Button
                    type="button"
                    variant={selectedType === "image" ? "secondary" : "ghost"}
                    size="sm"
                    className="h-7 text-xs px-2.5 cursor-pointer rounded-full"
                    onClick={() => setSelectedType("image")}
                  >
                    <ImageIcon className="size-3 mr-1" />
                    {t("filter.image")}
                  </Button>
                )}

                {isTypeAllowed("document") && (
                  <Button
                    type="button"
                    variant={selectedType === "document" ? "secondary" : "ghost"}
                    size="sm"
                    className="h-7 text-xs px-2.5 cursor-pointer rounded-full"
                    onClick={() => setSelectedType("document")}
                  >
                    <FileText className="size-3 mr-1" />
                    {t("filter.document")}
                  </Button>
                )}

                {isTypeAllowed("video") && (
                  <Button
                    type="button"
                    variant={selectedType === "video" ? "secondary" : "ghost"}
                    size="sm"
                    className="h-7 text-xs px-2.5 cursor-pointer rounded-full"
                    onClick={() => setSelectedType("video")}
                  >
                    <Video className="size-3 mr-1" />
                    {t("filter.video")}
                  </Button>
                )}

                {isTypeAllowed("audio") && (
                  <Button
                    type="button"
                    variant={selectedType === "audio" ? "secondary" : "ghost"}
                    size="sm"
                    className="h-7 text-xs px-2.5 cursor-pointer rounded-full"
                    onClick={() => setSelectedType("audio")}
                  >
                    <Music className="size-3 mr-1" />
                    {t("filter.audio")}
                  </Button>
                )}

                {isTypeAllowed("archive") && (
                  <Button
                    type="button"
                    variant={selectedType === "archive" ? "secondary" : "ghost"}
                    size="sm"
                    className="h-7 text-xs px-2.5 cursor-pointer rounded-full"
                    onClick={() => setSelectedType("archive")}
                  >
                    <Archive className="size-3 mr-1" />
                    {t("filter.archive")}
                  </Button>
                )}
              </div>

              <div className="relative w-full sm:w-60">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                <Input
                  placeholder={t("searchPlaceholder")}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-8 h-8 text-xs"
                />
              </div>
            </div>

            {/* Main Area: Left Grid + Right Inspector */}
            <div className="flex-1 flex overflow-hidden">
              {/* Media Cards Grid Container */}
              <div className="flex-1 flex flex-col overflow-hidden">
                <div className="flex-1 p-4 overflow-y-auto">
                  {filteredItems.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center p-8">
                      <Filter className="size-8 text-muted-foreground/50 mb-2" />
                      <span className="text-sm font-medium">{t("empty")}</span>
                      <span className="text-xs text-muted-foreground mt-1 max-w-xs">
                        {t("emptyDesc")}
                      </span>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                      {paginatedPickerItems.map((item) => {
                        const isSelected = selectedIds.includes(item.id)
                        const isFocused = focusedId === item.id

                        return (
                          <div
                            key={item.id}
                            onClick={() => toggleSelect(item)}
                            className={cn(
                              "group relative rounded-xl border aspect-square overflow-hidden cursor-pointer bg-card transition-all flex flex-col justify-between",
                              isSelected
                                ? "ring-2 ring-primary ring-offset-2 border-primary bg-primary/5"
                                : isFocused
                                ? "ring-1 ring-muted-foreground/40 border-muted-foreground/40"
                                : "hover:border-primary/40 hover:shadow-xs"
                            )}
                          >
                            {/* Selection Checkmark Badge */}
                            {isSelected && (
                              <div className="absolute top-2 right-2 z-10 size-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-xs">
                                <Check className="size-3 stroke-[3]" />
                              </div>
                            )}

                            {/* Asset Thumbnail Preview */}
                            <div className="flex-1 flex items-center justify-center p-2 overflow-hidden bg-muted/20">
                              {item.type === "image" ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                  src={item.thumbnailUrl || item.url}
                                  alt={item.altText || item.title || item.name}
                                  className="w-full h-full object-cover rounded-md"
                                />
                              ) : (
                                <FileTypeIcon
                                  type={item.type}
                                  extension={item.extension}
                                  className="size-14"
                                  iconClassName="size-7"
                                  showBadge
                                />
                              )}
                            </div>

                            {/* Item Footer info */}
                            <div className="p-2 border-t bg-card text-[11px] space-y-0.5">
                              <span className="font-medium text-foreground block truncate">
                                {item.title || item.name}
                              </span>
                              <div className="flex items-center justify-between text-[10px] text-muted-foreground font-mono">
                                <span>.{item.extension}</span>
                                <span>{formatBytes(item.size)}</span>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>

                {filteredItems.length > 0 && (
                  <GridPagination
                    currentPage={pickerPage}
                    totalItems={filteredItems.length}
                    pageSize={pickerPageSize}
                    onPageChange={setPickerPage}
                    onPageSizeChange={setPickerPageSize}
                    pageSizeOptions={[10, 15, 20, 30]}
                    itemLabel={t("stats.totalFiles").toLowerCase()}
                    className="border-t border-b-0 rounded-none bg-muted/10 shrink-0 px-4 py-2"
                  />
                )}
              </div>

              {/* Right Sidebar: WordPress-style Attachment Details Inspector */}
              <div className="w-72 border-l bg-muted/10 hidden md:flex flex-col overflow-y-auto p-4 shrink-0 space-y-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {t("details.sheetTitle")}
                </span>

                {focusedItem ? (
                  <div className="space-y-4">
                    <div className="rounded-lg border bg-card p-3 flex flex-col items-center justify-center min-h-[120px] max-h-[160px] overflow-hidden">
                      {focusedItem.type === "image" ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={focusedItem.url}
                          alt={focusedItem.title}
                          className="max-h-[140px] w-auto max-w-full object-contain rounded-md"
                        />
                      ) : (
                        <FileTypeIcon
                          type={focusedItem.type}
                          extension={focusedItem.extension}
                          className="size-16"
                          iconClassName="size-8"
                          showBadge
                        />
                      )}
                    </div>

                    <div className="text-xs space-y-1">
                      <span className="font-semibold block truncate">
                        {focusedItem.name}
                      </span>
                      <span className="text-muted-foreground block text-[11px]">
                        {focusedItem.uploadedAt} • {formatBytes(focusedItem.size)}
                      </span>
                      {focusedItem.dimensions && (
                        <span className="text-muted-foreground block text-[11px] font-mono">
                          {focusedItem.dimensions.width} × {focusedItem.dimensions.height} px
                        </span>
                      )}
                    </div>

                    <div className="space-y-2 pt-2 border-t text-xs">
                      <div>
                        <Label className="text-[11px] text-muted-foreground">
                          {t("fields.title")}
                        </Label>
                        <Input
                          readOnly
                          value={focusedItem.title}
                          className="h-7 text-xs mt-1 bg-background"
                        />
                      </div>

                      {focusedItem.type === "image" && (
                        <div>
                          <Label className="text-[11px] text-muted-foreground">
                            {t("fields.altText")}
                          </Label>
                          <Input
                            readOnly
                            value={focusedItem.altText || ""}
                            className="h-7 text-xs mt-1 bg-background"
                          />
                        </div>
                      )}

                      {focusedItem.caption && (
                        <div>
                          <Label className="text-[11px] text-muted-foreground">
                            {t("fields.caption")}
                          </Label>
                          <p className="text-[11px] text-muted-foreground bg-background p-2 rounded-md border mt-1 line-clamp-2">
                            {focusedItem.caption}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="h-40 flex items-center justify-center text-center text-xs text-muted-foreground">
                    {t("selector.noFileSelected")}
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Footer with Selection Summary and Confirmation Button */}
        <div className="px-5 py-3 border-t bg-background shrink-0 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs">
            {selectedIds.length > 0 ? (
              <>
                <span className="font-medium text-foreground">
                  {selectedIds.length} {t("selector.selected").toLowerCase()}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-6 text-[11px] px-1.5 text-muted-foreground hover:text-foreground cursor-pointer"
                  onClick={() => setSelectedIds([])}
                >
                  <X className="size-3 mr-1" />
                  {t("selector.clearSelection")}
                </Button>
              </>
            ) : (
              <span className="text-muted-foreground text-xs">
                {t("selector.noFileSelected")}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="text-xs cursor-pointer"
            >
              {tCommon("cancel")}
            </Button>
            <Button
              type="button"
              size="sm"
              disabled={selectedIds.length === 0}
              onClick={handleConfirm}
              className="text-xs gap-1.5 cursor-pointer"
            >
              <Check className="size-3.5" />
              <span>
                {selectButtonText ||
                  (multiple && selectedIds.length > 1
                    ? t("selector.insertMultiple", { count: selectedIds.length })
                    : t("selector.insert"))}
              </span>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
