"use client"

import * as React from "react"
import { useTranslations } from "next-intl"
import { Tag as TagIcon, Plus, Search, MoreHorizontal, Pencil, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { initialTags, type Tag } from "./data/cms-data"

export function TagsFeature() {
  const t = useTranslations("cms.tags")
  const [tags, setTags] = React.useState<Tag[]>(initialTags)
  const [search, setSearch] = React.useState("")

  const filteredTags = tags.filter(
    (tag) =>
      tag.name.toLowerCase().includes(search.toLowerCase()) ||
      tag.slug.toLowerCase().includes(search.toLowerCase())
  )

  const handleDelete = (id: string) => {
    setTags((prev) => prev.filter((tag) => tag.id !== id))
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            {t("title")}
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            {t("description")}
          </p>
        </div>
        <Button
          onClick={() => alert("Create tag modal / action")}
          size="sm"
          className="gap-1.5 text-xs self-start sm:self-auto"
        >
          <Plus className="size-3.5" />
          <span>{t("newTag")}</span>
        </Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
        <Input
          placeholder={t("searchPlaceholder")}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-8 h-8 text-xs"
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {filteredTags.map((tag) => (
          <Card key={tag.id} className="flex flex-col justify-between">
            <CardHeader className="p-3.5 pb-2">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="flex size-7 items-center justify-center rounded-md bg-primary/10 text-primary">
                    <TagIcon className="size-3.5" />
                  </div>
                  <div>
                    <CardTitle className="text-xs font-semibold">
                      {tag.name}
                    </CardTitle>
                    <span className="font-mono text-[10px] text-muted-foreground">
                      #{tag.slug}
                    </span>
                  </div>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger
                    render={
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-6 text-muted-foreground"
                      />
                    }
                  >
                    <MoreHorizontal className="size-3" />
                    <span className="sr-only">Actions</span>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="text-xs w-28">
                    <DropdownMenuItem
                      onClick={() => alert(`Edit ${tag.name}`)}
                      className="justify-between gap-2 cursor-pointer"
                    >
                      <span>{t("actions.edit")}</span>
                      <Pencil className="size-3" />
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleDelete(tag.id)}
                      className="justify-between gap-2 text-destructive focus:text-destructive cursor-pointer"
                    >
                      <span>{t("actions.delete")}</span>
                      <Trash2 className="size-3" />
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardFooter className="p-3.5 pt-2 border-t flex items-center justify-between text-[11px] text-muted-foreground">
              <span>{t("fields.count")}</span>
              <Badge variant="secondary" className="text-[10px] font-mono px-1.5 py-0">
                {tag.count}
              </Badge>
            </CardFooter>
          </Card>
        ))}
      </div>

      {filteredTags.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center border rounded-lg border-dashed">
          <TagIcon className="size-8 text-muted-foreground/60 mb-2" />
          <h3 className="text-sm font-semibold">{t("empty")}</h3>
          <p className="text-xs text-muted-foreground mt-1">{t("emptyDesc")}</p>
        </div>
      )}
    </div>
  )
}
