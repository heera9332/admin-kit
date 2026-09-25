"use client"

import * as React from "react"
import type { BreadcrumbItem } from "@/components/breadcrumbs/types"

interface BreadcrumbContextType {
  customItems: BreadcrumbItem[] | null
  appendItems: BreadcrumbItem[]
  prependItems: BreadcrumbItem[]
  customLabels: Record<string, string>
  isHidden: boolean
  maxItems?: number
  showHome?: boolean
  showSegmentIcons?: boolean
  setBreadcrumbs: (items: BreadcrumbItem[] | null) => void
  setAppendItems: (items: BreadcrumbItem[]) => void
  setPrependItems: (items: BreadcrumbItem[]) => void
  setCustomLabels: (labels: Record<string, string>) => void
  setIsHidden: (hidden: boolean) => void
  setMaxItems: (maxItems?: number) => void
  setShowHome: (show?: boolean) => void
  setShowSegmentIcons: (show?: boolean) => void
  resetBreadcrumbs: () => void
}

const BreadcrumbContext = React.createContext<BreadcrumbContextType | undefined>(undefined)

export function BreadcrumbProvider({ children }: { children: React.ReactNode }) {
  const [customItems, setCustomItems] = React.useState<BreadcrumbItem[] | null>(null)
  const [appendItems, setAppendItems] = React.useState<BreadcrumbItem[]>([])
  const [prependItems, setPrependItems] = React.useState<BreadcrumbItem[]>([])
  const [customLabels, setCustomLabels] = React.useState<Record<string, string>>({})
  const [isHidden, setIsHidden] = React.useState<boolean>(false)
  const [maxItems, setMaxItems] = React.useState<number | undefined>(undefined)
  const [showHome, setShowHome] = React.useState<boolean | undefined>(undefined)
  const [showSegmentIcons, setShowSegmentIcons] = React.useState<boolean | undefined>(undefined)

  const resetBreadcrumbs = React.useCallback(() => {
    setCustomItems(null)
    setAppendItems([])
    setPrependItems([])
    setCustomLabels({})
    setIsHidden(false)
    setMaxItems(undefined)
    setShowHome(undefined)
    setShowSegmentIcons(undefined)
  }, [])

  const value = React.useMemo(
    () => ({
      customItems,
      appendItems,
      prependItems,
      customLabels,
      isHidden,
      maxItems,
      showHome,
      showSegmentIcons,
      setBreadcrumbs: setCustomItems,
      setAppendItems,
      setPrependItems,
      setCustomLabels,
      setIsHidden,
      setMaxItems,
      setShowHome,
      setShowSegmentIcons,
      resetBreadcrumbs,
    }),
    [
      customItems,
      appendItems,
      prependItems,
      customLabels,
      isHidden,
      maxItems,
      showHome,
      showSegmentIcons,
      resetBreadcrumbs,
    ]
  )

  return (
    <BreadcrumbContext.Provider value={value}>
      {children}
    </BreadcrumbContext.Provider>
  )
}

const noop = () => {}

const defaultContextValue: BreadcrumbContextType = {
  customItems: null,
  appendItems: [],
  prependItems: [],
  customLabels: {},
  isHidden: false,
  maxItems: undefined,
  showHome: undefined,
  showSegmentIcons: undefined,
  setBreadcrumbs: noop,
  setAppendItems: noop,
  setPrependItems: noop,
  setCustomLabels: noop,
  setIsHidden: noop,
  setMaxItems: noop,
  setShowHome: noop,
  setShowSegmentIcons: noop,
  resetBreadcrumbs: noop,
}

/**
 * Hook to access and manipulate breadcrumb overrides.
 */
export function useBreadcrumbs(): BreadcrumbContextType {
  const context = React.useContext(BreadcrumbContext)
  return context || defaultContextValue
}

/**
 * Hook for pages/components to override breadcrumbs on mount and reset on unmount.
 */
export function useSetBreadcrumbs(
  items: BreadcrumbItem[] | null,
  deps: React.DependencyList = []
) {
  const { setBreadcrumbs, resetBreadcrumbs } = useBreadcrumbs()

  React.useEffect(() => {
    setBreadcrumbs(items)
    return () => {
      resetBreadcrumbs()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}

/**
 * Hook to append additional items to the auto-generated breadcrumbs (e.g. detail page titles).
 */
export function useAppendBreadcrumbs(
  items: BreadcrumbItem | BreadcrumbItem[],
  deps: React.DependencyList = []
) {
  const { setAppendItems } = useBreadcrumbs()

  React.useEffect(() => {
    const list = Array.isArray(items) ? items : [items]
    setAppendItems(list)
    return () => {
      setAppendItems([])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}

/**
 * Declarative component that allows any page to override breadcrumbs.
 *
 * Examples:
 * ```tsx
 * // Complete override
 * <PageBreadcrumbs items={[{ label: "Projects", href: "/dashboard/projects" }, { label: "Project Alpha" }]} />
 *
 * // Append item to auto breadcrumbs
 * <PageBreadcrumbs append={[{ label: project.title }]} />
 *
 * // Custom segment label
 * <PageBreadcrumbs labels={{ "PRJ-1001": "SaaS Platform" }} />
 *
 * // Control three-dot collapse
 * <PageBreadcrumbs maxItems={2} />
 *
 * // Hide breadcrumbs completely on this page
 * <PageBreadcrumbs hidden />
 * ```
 */
export function PageBreadcrumbs({
  items,
  append,
  prepend,
  labels,
  hidden,
  maxItems,
  showHome,
  showSegmentIcons,
}: {
  items?: BreadcrumbItem[]
  append?: BreadcrumbItem[]
  prepend?: BreadcrumbItem[]
  labels?: Record<string, string>
  hidden?: boolean
  maxItems?: number
  showHome?: boolean
  showSegmentIcons?: boolean
}) {
  const {
    setBreadcrumbs,
    setAppendItems,
    setPrependItems,
    setCustomLabels,
    setIsHidden,
    setMaxItems,
    setShowHome,
    setShowSegmentIcons,
    resetBreadcrumbs,
  } = useBreadcrumbs()

  React.useEffect(() => {
    if (items) setBreadcrumbs(items)
    if (append) setAppendItems(append)
    if (prepend) setPrependItems(prepend)
    if (labels) setCustomLabels(labels)
    if (typeof hidden === "boolean") setIsHidden(hidden)
    if (typeof maxItems === "number") setMaxItems(maxItems)
    if (typeof showHome === "boolean") setShowHome(showHome)
    if (typeof showSegmentIcons === "boolean") setShowSegmentIcons(showSegmentIcons)

    return () => {
      resetBreadcrumbs()
    }
  }, [
    items,
    append,
    prepend,
    labels,
    hidden,
    maxItems,
    showHome,
    showSegmentIcons,
    setBreadcrumbs,
    setAppendItems,
    setPrependItems,
    setCustomLabels,
    setIsHidden,
    setMaxItems,
    setShowHome,
    setShowSegmentIcons,
    resetBreadcrumbs,
  ])

  return null
}
