"use client"

import * as React from "react"
import { useTranslations } from "next-intl"
import { FolderTree, Plus, Search, MoreHorizontal, Pencil, Trash2, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardDescription,
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
import { initialCategories, type Category } from "./data/cms-data"
import { CreateCategoryDialog, ViewCategorySheet } from "./components/category-dialogs"

export function CategoriesFeature() {
  const t = useTranslations("cms.categories")
  const [categories, setCategories] = React.useState<Category[]>(initialCategories)
  const [search, setSearch] = React.useState("")
  const [createOpen, setCreateOpen] = React.useState(false)
  const [viewOpen, setViewOpen] = React.useState(false)
  const [selectedCategory, setSelectedCategory] = React.useState<Category | null>(null)

  const filteredCategories = categories.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase())
  )

  const handleCreate = (newCategory: Category) => {
    setCategories((prev) => [newCategory, ...prev])
  }

  const handleView = (category: Category) => {
    setSelectedCategory(category)
    setViewOpen(true)
  }

  const handleDelete = (id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id))
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
          onClick={() => setCreateOpen(true)}
          size="sm"
          className="gap-1.5 text-xs self-start sm:self-auto cursor-pointer"
        >
          <Plus className="size-3.5" />
          <span>{t("newCategory")}</span>
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

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {filteredCategories.map((category) => (
          <Card key={category.id} className="flex flex-col justify-between">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-2">
                <div
                  onClick={() => handleView(category)}
                  className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary cursor-pointer hover:bg-primary/20 transition-colors"
                >
                  <FolderTree className="size-4.5" />
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger
                    render={
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-7 text-muted-foreground"
                      />
                    }
                  >
                    <MoreHorizontal className="size-3.5" />
                    <span className="sr-only">Actions</span>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="text-xs w-32">
                    <DropdownMenuItem
                      onClick={() => handleView(category)}
                      className="justify-between gap-2 cursor-pointer"
                    >
                      <span>{t("actions.view")}</span>
                      <Eye className="size-3.5" />
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => alert(`Edit ${category.name}`)}
                      className="justify-between gap-2 cursor-pointer"
                    >
                      <span>{t("actions.edit")}</span>
                      <Pencil className="size-3.5" />
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleDelete(category.id)}
                      className="justify-between gap-2 text-destructive focus:text-destructive cursor-pointer"
                    >
                      <span>{t("actions.delete")}</span>
                      <Trash2 className="size-3.5" />
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <CardTitle
                onClick={() => handleView(category)}
                className="text-sm font-semibold mt-2 cursor-pointer hover:text-primary transition-colors"
              >
                {category.name}
              </CardTitle>
              <CardDescription className="text-xs line-clamp-2">
                {category.description}
              </CardDescription>
            </CardHeader>
            <CardFooter className="pt-2 border-t flex items-center justify-between text-xs text-muted-foreground">
              <span className="font-mono text-[11px]">/{category.slug}</span>
              <Badge variant="secondary" className="text-[10px] font-mono">
                {category.postCount} posts
              </Badge>
            </CardFooter>
          </Card>
        ))}
      </div>

      {filteredCategories.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center border rounded-lg border-dashed">
          <FolderTree className="size-8 text-muted-foreground/60 mb-2" />
          <h3 className="text-sm font-semibold">{t("empty")}</h3>
          <p className="text-xs text-muted-foreground mt-1">{t("emptyDesc")}</p>
        </div>
      )}

      <CreateCategoryDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onCreate={handleCreate}
      />

      <ViewCategorySheet
        category={selectedCategory}
        open={viewOpen}
        onOpenChange={setViewOpen}
        onDelete={handleDelete}
      />
    </div>
  )
}
