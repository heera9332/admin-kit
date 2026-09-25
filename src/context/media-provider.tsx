"use client"

import * as React from "react"
import { initialMedia, type MediaItem } from "@/data/media"

interface MediaContextType {
  items: MediaItem[]
  addItem: (itemData: Omit<MediaItem, "id" | "uploadedAt">) => MediaItem
  updateItem: (id: string, updates: Partial<MediaItem>) => void
  deleteItem: (id: string) => void
  deleteItems: (ids: string[]) => void
}

const MediaContext = React.createContext<MediaContextType | undefined>(undefined)

export function MediaProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = React.useState<MediaItem[]>(initialMedia)

  const addItem = React.useCallback(
    (itemData: Omit<MediaItem, "id" | "uploadedAt">) => {
      const newItem: MediaItem = {
        ...itemData,
        id: `med-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        uploadedAt: new Date().toISOString().split("T")[0],
      }
      setItems((prev) => [newItem, ...prev])
      return newItem
    },
    []
  )

  const updateItem = React.useCallback((id: string, updates: Partial<MediaItem>) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    )
  }, [])

  const deleteItem = React.useCallback((id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id))
  }, [])

  const deleteItems = React.useCallback((ids: string[]) => {
    const idSet = new Set(ids)
    setItems((prev) => prev.filter((item) => !idSet.has(item.id)))
  }, [])

  const value = React.useMemo(
    () => ({
      items,
      addItem,
      updateItem,
      deleteItem,
      deleteItems,
    }),
    [items, addItem, updateItem, deleteItem, deleteItems]
  )

  return <MediaContext.Provider value={value}>{children}</MediaContext.Provider>
}

const defaultContext: MediaContextType = {
  items: initialMedia,
  addItem: (data) => ({
    ...data,
    id: `med-${Date.now()}`,
    uploadedAt: new Date().toISOString().split("T")[0],
  }),
  updateItem: () => {},
  deleteItem: () => {},
  deleteItems: () => {},
}

export function useMedia(): MediaContextType {
  const context = React.useContext(MediaContext)
  return context || defaultContext
}
