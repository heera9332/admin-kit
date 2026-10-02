"use client"

import * as React from "react"
import {
  initialProducts,
  initialProductCategories,
  initialBrands,
  initialOrders,
  initialCustomers,
  initialCoupons,
  initialReviews,
  initialSettings,
  type Product,
  type ProductCategory,
  type Brand,
  type Order,
  type Customer,
  type Coupon,
  type Review,
  type EcommerceSettings,
  type PaymentStatus,
  type FulfillmentStatus,
  type ReviewStatus,
  type CouponStatus,
} from "@/data/ecommerce"

interface EcommerceContextType {
  products: Product[]
  categories: ProductCategory[]
  brands: Brand[]
  orders: Order[]
  customers: Customer[]
  coupons: Coupon[]
  reviews: Review[]
  settings: EcommerceSettings
  // Product actions
  addProduct: (product: Omit<Product, "id" | "createdAt" | "updatedAt">) => Product
  updateProduct: (id: string, updates: Partial<Product>) => void
  deleteProduct: (id: string) => void
  // Category actions
  addCategory: (category: Omit<ProductCategory, "id">) => ProductCategory
  updateCategory: (id: string, updates: Partial<ProductCategory>) => void
  deleteCategory: (id: string) => void
  // Brand actions
  addBrand: (brand: Omit<Brand, "id">) => Brand
  updateBrand: (id: string, updates: Partial<Brand>) => void
  deleteBrand: (id: string) => void
  // Order actions
  updateOrderStatus: (
    id: string,
    paymentStatus?: PaymentStatus,
    fulfillmentStatus?: FulfillmentStatus
  ) => void
  deleteOrder: (id: string) => void
  // Customer actions
  addCustomer: (customer: Omit<Customer, "id" | "createdAt" | "ordersCount" | "totalSpent">) => Customer
  updateCustomer: (id: string, updates: Partial<Customer>) => void
  deleteCustomer: (id: string) => void
  // Coupon actions
  addCoupon: (coupon: Omit<Coupon, "id" | "usageCount">) => Coupon
  updateCoupon: (id: string, updates: Partial<Coupon>) => void
  deleteCoupon: (id: string) => void
  toggleCouponStatus: (id: string) => void
  // Review actions
  updateReviewStatus: (id: string, status: ReviewStatus) => void
  deleteReview: (id: string) => void
  // Settings actions
  updateSettings: (settings: Partial<EcommerceSettings>) => void
}

const EcommerceContext = React.createContext<EcommerceContextType | undefined>(undefined)

const STORAGE_KEYS = {
  products: "admin_ecommerce_products",
  categories: "admin_ecommerce_categories",
  brands: "admin_ecommerce_brands",
  orders: "admin_ecommerce_orders",
  customers: "admin_ecommerce_customers",
  coupons: "admin_ecommerce_coupons",
  reviews: "admin_ecommerce_reviews",
  settings: "admin_ecommerce_settings",
} as const

function loadInitial<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback
  try {
    const saved = localStorage.getItem(key)
    if (saved) {
      const parsed = JSON.parse(saved)
      if (Array.isArray(fallback) && Array.isArray(parsed) && parsed.length > 0) {
        return parsed as T
      }
      if (!Array.isArray(fallback) && typeof parsed === "object" && parsed !== null) {
        return parsed as T
      }
    }
  } catch {
    // fallback
  }
  return fallback
}

export function EcommerceProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = React.useState<Product[]>(() =>
    loadInitial(STORAGE_KEYS.products, initialProducts)
  )
  const [categories, setCategories] = React.useState<ProductCategory[]>(() =>
    loadInitial(STORAGE_KEYS.categories, initialProductCategories)
  )
  const [brands, setBrands] = React.useState<Brand[]>(() =>
    loadInitial(STORAGE_KEYS.brands, initialBrands)
  )
  const [orders, setOrders] = React.useState<Order[]>(() =>
    loadInitial(STORAGE_KEYS.orders, initialOrders)
  )
  const [customers, setCustomers] = React.useState<Customer[]>(() =>
    loadInitial(STORAGE_KEYS.customers, initialCustomers)
  )
  const [coupons, setCoupons] = React.useState<Coupon[]>(() =>
    loadInitial(STORAGE_KEYS.coupons, initialCoupons)
  )
  const [reviews, setReviews] = React.useState<Review[]>(() =>
    loadInitial(STORAGE_KEYS.reviews, initialReviews)
  )
  const [settings, setSettings] = React.useState<EcommerceSettings>(() =>
    loadInitial(STORAGE_KEYS.settings, initialSettings)
  )

  const saveToStorage = React.useCallback((key: string, data: unknown) => {
    if (typeof window === "undefined") return
    try {
      localStorage.setItem(key, JSON.stringify(data))
    } catch {
      // storage quota or disabled
    }
  }, [])

  // Product operations
  const addProduct = React.useCallback(
    (data: Omit<Product, "id" | "createdAt" | "updatedAt">): Product => {
      const newProduct: Product = {
        ...data,
        id: `prod-${Date.now()}`,
        createdAt: new Date().toISOString().split("T")[0],
        updatedAt: new Date().toISOString().split("T")[0],
      }
      setProducts((prev) => {
        const next = [newProduct, ...prev]
        saveToStorage(STORAGE_KEYS.products, next)
        return next
      })
      return newProduct
    },
    [saveToStorage]
  )

  const updateProduct = React.useCallback(
    (id: string, updates: Partial<Product>) => {
      setProducts((prev) => {
        const next = prev.map((item) =>
          item.id === id
            ? { ...item, ...updates, updatedAt: new Date().toISOString().split("T")[0] }
            : item
        )
        saveToStorage(STORAGE_KEYS.products, next)
        return next
      })
    },
    [saveToStorage]
  )

  const deleteProduct = React.useCallback(
    (id: string) => {
      setProducts((prev) => {
        const next = prev.filter((item) => item.id !== id)
        saveToStorage(STORAGE_KEYS.products, next)
        return next
      })
    },
    [saveToStorage]
  )

  // Category operations
  const addCategory = React.useCallback(
    (data: Omit<ProductCategory, "id">): ProductCategory => {
      const newCategory: ProductCategory = {
        ...data,
        id: `cat-${Date.now()}`,
      }
      setCategories((prev) => {
        const next = [newCategory, ...prev]
        saveToStorage(STORAGE_KEYS.categories, next)
        return next
      })
      return newCategory
    },
    [saveToStorage]
  )

  const updateCategory = React.useCallback(
    (id: string, updates: Partial<ProductCategory>) => {
      setCategories((prev) => {
        const next = prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
        saveToStorage(STORAGE_KEYS.categories, next)
        return next
      })
    },
    [saveToStorage]
  )

  const deleteCategory = React.useCallback(
    (id: string) => {
      setCategories((prev) => {
        const next = prev.filter((item) => item.id !== id)
        saveToStorage(STORAGE_KEYS.categories, next)
        return next
      })
    },
    [saveToStorage]
  )

  // Brand operations
  const addBrand = React.useCallback(
    (data: Omit<Brand, "id">): Brand => {
      const newBrand: Brand = {
        ...data,
        id: `brand-${Date.now()}`,
      }
      setBrands((prev) => {
        const next = [newBrand, ...prev]
        saveToStorage(STORAGE_KEYS.brands, next)
        return next
      })
      return newBrand
    },
    [saveToStorage]
  )

  const updateBrand = React.useCallback(
    (id: string, updates: Partial<Brand>) => {
      setBrands((prev) => {
        const next = prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
        saveToStorage(STORAGE_KEYS.brands, next)
        return next
      })
    },
    [saveToStorage]
  )

  const deleteBrand = React.useCallback(
    (id: string) => {
      setBrands((prev) => {
        const next = prev.filter((item) => item.id !== id)
        saveToStorage(STORAGE_KEYS.brands, next)
        return next
      })
    },
    [saveToStorage]
  )

  // Order operations
  const updateOrderStatus = React.useCallback(
    (id: string, paymentStatus?: PaymentStatus, fulfillmentStatus?: FulfillmentStatus) => {
      setOrders((prev) => {
        const next = prev.map((item) => {
          if (item.id !== id) return item
          return {
            ...item,
            ...(paymentStatus && { paymentStatus }),
            ...(fulfillmentStatus && { fulfillmentStatus }),
          }
        })
        saveToStorage(STORAGE_KEYS.orders, next)
        return next
      })
    },
    [saveToStorage]
  )

  const deleteOrder = React.useCallback(
    (id: string) => {
      setOrders((prev) => {
        const next = prev.filter((item) => item.id !== id)
        saveToStorage(STORAGE_KEYS.orders, next)
        return next
      })
    },
    [saveToStorage]
  )

  // Customer operations
  const addCustomer = React.useCallback(
    (data: Omit<Customer, "id" | "createdAt" | "ordersCount" | "totalSpent">): Customer => {
      const newCustomer: Customer = {
        ...data,
        id: `cust-${Date.now()}`,
        ordersCount: 0,
        totalSpent: 0,
        createdAt: new Date().toISOString().split("T")[0],
      }
      setCustomers((prev) => {
        const next = [newCustomer, ...prev]
        saveToStorage(STORAGE_KEYS.customers, next)
        return next
      })
      return newCustomer
    },
    [saveToStorage]
  )

  const updateCustomer = React.useCallback(
    (id: string, updates: Partial<Customer>) => {
      setCustomers((prev) => {
        const next = prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
        saveToStorage(STORAGE_KEYS.customers, next)
        return next
      })
    },
    [saveToStorage]
  )

  const deleteCustomer = React.useCallback(
    (id: string) => {
      setCustomers((prev) => {
        const next = prev.filter((item) => item.id !== id)
        saveToStorage(STORAGE_KEYS.customers, next)
        return next
      })
    },
    [saveToStorage]
  )

  // Coupon operations
  const addCoupon = React.useCallback(
    (data: Omit<Coupon, "id" | "usageCount">): Coupon => {
      const newCoupon: Coupon = {
        ...data,
        id: `coup-${Date.now()}`,
        usageCount: 0,
      }
      setCoupons((prev) => {
        const next = [newCoupon, ...prev]
        saveToStorage(STORAGE_KEYS.coupons, next)
        return next
      })
      return newCoupon
    },
    [saveToStorage]
  )

  const updateCoupon = React.useCallback(
    (id: string, updates: Partial<Coupon>) => {
      setCoupons((prev) => {
        const next = prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
        saveToStorage(STORAGE_KEYS.coupons, next)
        return next
      })
    },
    [saveToStorage]
  )

  const deleteCoupon = React.useCallback(
    (id: string) => {
      setCoupons((prev) => {
        const next = prev.filter((item) => item.id !== id)
        saveToStorage(STORAGE_KEYS.coupons, next)
        return next
      })
    },
    [saveToStorage]
  )

  const toggleCouponStatus = React.useCallback(
    (id: string) => {
      setCoupons((prev) => {
        const next = prev.map((item) => {
          if (item.id !== id) return item
          const newStatus: CouponStatus = item.status === "active" ? "disabled" : "active"
          return { ...item, status: newStatus }
        })
        saveToStorage(STORAGE_KEYS.coupons, next)
        return next
      })
    },
    [saveToStorage]
  )

  // Review operations
  const updateReviewStatus = React.useCallback(
    (id: string, status: ReviewStatus) => {
      setReviews((prev) => {
        const next = prev.map((item) => (item.id === id ? { ...item, status } : item))
        saveToStorage(STORAGE_KEYS.reviews, next)
        return next
      })
    },
    [saveToStorage]
  )

  const deleteReview = React.useCallback(
    (id: string) => {
      setReviews((prev) => {
        const next = prev.filter((item) => item.id !== id)
        saveToStorage(STORAGE_KEYS.reviews, next)
        return next
      })
    },
    [saveToStorage]
  )

  // Settings operations
  const updateSettings = React.useCallback(
    (updates: Partial<EcommerceSettings>) => {
      setSettings((prev) => {
        const next = { ...prev, ...updates }
        saveToStorage(STORAGE_KEYS.settings, next)
        return next
      })
    },
    [saveToStorage]
  )

  const value = React.useMemo<EcommerceContextType>(
    () => ({
      products,
      categories,
      brands,
      orders,
      customers,
      coupons,
      reviews,
      settings,
      addProduct,
      updateProduct,
      deleteProduct,
      addCategory,
      updateCategory,
      deleteCategory,
      addBrand,
      updateBrand,
      deleteBrand,
      updateOrderStatus,
      deleteOrder,
      addCustomer,
      updateCustomer,
      deleteCustomer,
      addCoupon,
      updateCoupon,
      deleteCoupon,
      toggleCouponStatus,
      updateReviewStatus,
      deleteReview,
      updateSettings,
    }),
    [
      products,
      categories,
      brands,
      orders,
      customers,
      coupons,
      reviews,
      settings,
      addProduct,
      updateProduct,
      deleteProduct,
      addCategory,
      updateCategory,
      deleteCategory,
      addBrand,
      updateBrand,
      deleteBrand,
      updateOrderStatus,
      deleteOrder,
      addCustomer,
      updateCustomer,
      deleteCustomer,
      addCoupon,
      updateCoupon,
      deleteCoupon,
      toggleCouponStatus,
      updateReviewStatus,
      deleteReview,
      updateSettings,
    ]
  )

  return <EcommerceContext.Provider value={value}>{children}</EcommerceContext.Provider>
}

const defaultContext: EcommerceContextType = {
  products: initialProducts,
  categories: initialProductCategories,
  brands: initialBrands,
  orders: initialOrders,
  customers: initialCustomers,
  coupons: initialCoupons,
  reviews: initialReviews,
  settings: initialSettings,
  addProduct: (data) => ({
    ...data,
    id: `prod-${Date.now()}`,
    createdAt: new Date().toISOString().split("T")[0],
    updatedAt: new Date().toISOString().split("T")[0],
  }),
  updateProduct: () => {},
  deleteProduct: () => {},
  addCategory: (data) => ({ ...data, id: `cat-${Date.now()}` }),
  updateCategory: () => {},
  deleteCategory: () => {},
  addBrand: (data) => ({ ...data, id: `brand-${Date.now()}` }),
  updateBrand: () => {},
  deleteBrand: () => {},
  updateOrderStatus: () => {},
  deleteOrder: () => {},
  addCustomer: (data) => ({
    ...data,
    id: `cust-${Date.now()}`,
    ordersCount: 0,
    totalSpent: 0,
    createdAt: new Date().toISOString().split("T")[0],
  }),
  updateCustomer: () => {},
  deleteCustomer: () => {},
  addCoupon: (data) => ({ ...data, id: `coup-${Date.now()}`, usageCount: 0 }),
  updateCoupon: () => {},
  deleteCoupon: () => {},
  toggleCouponStatus: () => {},
  updateReviewStatus: () => {},
  deleteReview: () => {},
  updateSettings: () => {},
}

export function useEcommerce() {
  const context = React.useContext(EcommerceContext)
  return context ?? defaultContext
}
