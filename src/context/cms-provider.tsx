"use client"

import * as React from "react"
import {
  initialPosts,
  initialCategories,
  initialTags,
  initialPages,
  type Post,
  type Category,
  type Tag,
  type CmsPage,
} from "@/data/cms"

interface CmsContextType {
  posts: Post[]
  categories: Category[]
  tags: Tag[]
  pages: CmsPage[]
  getPost: (id: string) => Post | undefined
  updatePost: (id: string, updates: Partial<Post>) => void
  createPost: (postData: Partial<Post> & { title: string }) => Post
  deletePost: (id: string) => void
  getPage: (id: string) => CmsPage | undefined
  updatePage: (id: string, updates: Partial<CmsPage>) => void
  createPage: (pageData: Partial<CmsPage> & { title: string }) => CmsPage
  deletePage: (id: string) => void
  addCategory: (category: Category) => void
  addTag: (tag: Tag) => void
}

const CmsContext = React.createContext<CmsContextType | undefined>(undefined)

const CMS_POSTS_STORAGE_KEY = "admin_cms_posts"
const CMS_CATEGORIES_STORAGE_KEY = "admin_cms_categories"
const CMS_TAGS_STORAGE_KEY = "admin_cms_tags"
const CMS_PAGES_STORAGE_KEY = "admin_cms_pages"

let memoryPosts: Post[] = initialPosts
let memoryCategories: Category[] = initialCategories
let memoryTags: Tag[] = initialTags
let memoryPages: CmsPage[] = initialPages
let isInitialized = false

function initStorage() {
  if (isInitialized || typeof window === "undefined") return
  try {
    const savedPosts = localStorage.getItem(CMS_POSTS_STORAGE_KEY)
    if (savedPosts) {
      const parsed = JSON.parse(savedPosts)
      if (Array.isArray(parsed) && parsed.length > 0) {
        memoryPosts = parsed
      }
    }

    const savedCategories = localStorage.getItem(CMS_CATEGORIES_STORAGE_KEY)
    if (savedCategories) {
      const parsedCat = JSON.parse(savedCategories)
      if (Array.isArray(parsedCat) && parsedCat.length > 0) {
        memoryCategories = parsedCat
      }
    }

    const savedTags = localStorage.getItem(CMS_TAGS_STORAGE_KEY)
    if (savedTags) {
      const parsedTags = JSON.parse(savedTags)
      if (Array.isArray(parsedTags) && parsedTags.length > 0) {
        memoryTags = parsedTags
      }
    }

    const savedPages = localStorage.getItem(CMS_PAGES_STORAGE_KEY)
    if (savedPages) {
      const parsedPages = JSON.parse(savedPages)
      if (Array.isArray(parsedPages) && parsedPages.length > 0) {
        memoryPages = parsedPages
      }
    }
  } catch {
    // Ignore localStorage errors
  }
  isInitialized = true
}

const listeners = new Set<() => void>()

function subscribe(callback: () => void) {
  listeners.add(callback)
  return () => {
    listeners.delete(callback)
  }
}

function notify() {
  listeners.forEach((l) => l())
}

function persistPosts(posts: Post[]) {
  memoryPosts = posts
  notify()
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(CMS_POSTS_STORAGE_KEY, JSON.stringify(posts))
    } catch {
      // Ignore write errors
    }
  }
}

function persistCategories(categories: Category[]) {
  memoryCategories = categories
  notify()
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(CMS_CATEGORIES_STORAGE_KEY, JSON.stringify(categories))
    } catch {
      // Ignore write errors
    }
  }
}

function persistTags(tags: Tag[]) {
  memoryTags = tags
  notify()
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(CMS_TAGS_STORAGE_KEY, JSON.stringify(tags))
    } catch {
      // Ignore write errors
    }
  }
}

function persistPages(pages: CmsPage[]) {
  memoryPages = pages
  notify()
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(CMS_PAGES_STORAGE_KEY, JSON.stringify(pages))
    } catch {
      // Ignore write errors
    }
  }
}

export function CmsProvider({ children }: { children: React.ReactNode }) {
  React.useEffect(() => {
    initStorage()
    notify()
  }, [])

  const posts = React.useSyncExternalStore(
    subscribe,
    () => {
      initStorage()
      return memoryPosts
    },
    () => initialPosts
  )

  const categories = React.useSyncExternalStore(
    subscribe,
    () => {
      initStorage()
      return memoryCategories
    },
    () => initialCategories
  )

  const tags = React.useSyncExternalStore(
    subscribe,
    () => {
      initStorage()
      return memoryTags
    },
    () => initialTags
  )

  const pages = React.useSyncExternalStore(
    subscribe,
    () => {
      initStorage()
      return memoryPages
    },
    () => initialPages
  )

  const getPost = React.useCallback(
    (id: string) => {
      return posts.find((p) => p.id === id)
    },
    [posts]
  )

  const updatePost = React.useCallback(
    (id: string, updates: Partial<Post>) => {
      const nextPosts = posts.map((item) =>
        item.id === id ? { ...item, ...updates } : item
      )
      persistPosts(nextPosts)
    },
    [posts]
  )

  const createPost = React.useCallback(
    (postData: Partial<Post> & { title: string }) => {
      const slug =
        postData.slug ||
        postData.title
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "") ||
        `post-${Date.now()}`

      const newPost: Post = {
        id: postData.id || `post-${Date.now().toString().slice(-4)}`,
        title: postData.title,
        slug,
        category: postData.category || "Engineering",
        author: postData.author || "Admin User",
        status: postData.status || "draft",
        publishedAt: postData.publishedAt || new Date().toISOString().split("T")[0],
        views: postData.views ?? 0,
        excerpt: postData.excerpt || "",
        content: postData.content || "",
        featuredImage: postData.featuredImage ?? null,
        metaTitle: postData.metaTitle || postData.title,
        metaDescription: postData.metaDescription || "",
      }

      persistPosts([newPost, ...posts])
      return newPost
    },
    [posts]
  )

  const deletePost = React.useCallback(
    (id: string) => {
      const nextPosts = posts.filter((item) => item.id !== id)
      persistPosts(nextPosts)
    },
    [posts]
  )

  const getPage = React.useCallback(
    (id: string) => {
      return pages.find((p) => p.id === id)
    },
    [pages]
  )

  const updatePage = React.useCallback(
    (id: string, updates: Partial<CmsPage>) => {
      const nextPages = pages.map((item) =>
        item.id === id
          ? {
              ...item,
              ...updates,
              updatedAt: new Date().toISOString().split("T")[0],
            }
          : item
      )
      persistPages(nextPages)
    },
    [pages]
  )

  const createPage = React.useCallback(
    (pageData: Partial<CmsPage> & { title: string }) => {
      const slug =
        pageData.slug ||
        pageData.title
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "") ||
        `page-${Date.now()}`

      const newPage: CmsPage = {
        id: pageData.id || `page-${Date.now().toString().slice(-4)}`,
        title: pageData.title,
        slug,
        status: pageData.status || "draft",
        author: pageData.author || "Admin User",
        publishedAt: pageData.publishedAt || new Date().toISOString().split("T")[0],
        updatedAt: new Date().toISOString().split("T")[0],
        views: pageData.views ?? 0,
        excerpt: pageData.excerpt || "",
        content: pageData.content || "",
        featuredImage: pageData.featuredImage ?? null,
        template: pageData.template || "default",
        parentId: pageData.parentId ?? null,
        order: pageData.order ?? 0,
        metaTitle: pageData.metaTitle || pageData.title,
        metaDescription: pageData.metaDescription || "",
      }

      persistPages([newPage, ...pages])
      return newPage
    },
    [pages]
  )

  const deletePage = React.useCallback(
    (id: string) => {
      const nextPages = pages.filter((item) => item.id !== id)
      persistPages(nextPages)
    },
    [pages]
  )

  const addCategory = React.useCallback(
    (category: Category) => {
      persistCategories([category, ...categories])
    },
    [categories]
  )

  const addTag = React.useCallback(
    (tag: Tag) => {
      persistTags([tag, ...tags])
    },
    [tags]
  )

  const value = React.useMemo(
    () => ({
      posts,
      categories,
      tags,
      pages,
      getPost,
      updatePost,
      createPost,
      deletePost,
      getPage,
      updatePage,
      createPage,
      deletePage,
      addCategory,
      addTag,
    }),
    [
      posts,
      categories,
      tags,
      pages,
      getPost,
      updatePost,
      createPost,
      deletePost,
      getPage,
      updatePage,
      createPage,
      deletePage,
      addCategory,
      addTag,
    ]
  )

  return <CmsContext.Provider value={value}>{children}</CmsContext.Provider>
}

const defaultContext: CmsContextType = {
  posts: initialPosts,
  categories: initialCategories,
  tags: initialTags,
  pages: initialPages,
  getPost: (id: string) => initialPosts.find((p) => p.id === id),
  updatePost: () => {},
  createPost: (data) => ({
    id: `post-${Date.now()}`,
    title: data.title,
    slug: "new-post",
    category: "Engineering",
    author: "Admin",
    status: "draft",
    publishedAt: new Date().toISOString().split("T")[0],
    views: 0,
    excerpt: data.excerpt || "",
    content: data.content || "",
  }),
  deletePost: () => {},
  getPage: (id: string) => initialPages.find((p) => p.id === id),
  updatePage: () => {},
  createPage: (data) => ({
    id: `page-${Date.now()}`,
    title: data.title,
    slug: "new-page",
    status: "draft",
    author: "Admin",
    publishedAt: new Date().toISOString().split("T")[0],
    views: 0,
    content: data.content || "",
    template: "default",
    parentId: null,
    order: 0,
  }),
  deletePage: () => {},
  addCategory: () => {},
  addTag: () => {},
}

export function useCms(): CmsContextType {
  const context = React.useContext(CmsContext)
  return context || defaultContext
}
