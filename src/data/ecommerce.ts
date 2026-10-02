import ecommerceData from "./ecommerce.json"

export type ProductStatus = "published" | "draft" | "out_of_stock" | "archived"

export interface Product {
  id: string
  name: string
  slug: string
  description: string
  sku: string
  price: number
  compareAtPrice?: number
  costPrice?: number
  stock: number
  lowStockThreshold?: number
  status: ProductStatus
  category: string
  brand: string
  image?: string
  rating: number
  reviewsCount: number
  createdAt: string
  updatedAt: string
}

export type CategoryStatus = "active" | "inactive"

export interface ProductCategory {
  id: string
  name: string
  slug: string
  description: string
  image?: string
  productCount: number
  status: CategoryStatus
}

export interface Brand {
  id: string
  name: string
  slug: string
  description?: string
  logo?: string
  website?: string
  productCount: number
  featured?: boolean
}

export type PaymentStatus = "paid" | "pending" | "failed" | "refunded"
export type FulfillmentStatus = "delivered" | "processing" | "shipped" | "cancelled"
export type PaymentMethod = "credit_card" | "paypal" | "stripe" | "cod"

export interface OrderItem {
  id: string
  productId: string
  name: string
  price: number
  quantity: number
  image?: string
}

export interface OrderCustomer {
  id: string
  name: string
  email: string
  avatar?: string
}

export interface ShippingAddress {
  street: string
  city: string
  state: string
  zip: string
  country: string
}

export interface Order {
  id: string
  orderNumber: string
  customer: OrderCustomer
  items: OrderItem[]
  total: number
  subtotal: number
  tax: number
  shipping: number
  discount: number
  couponCode?: string
  paymentStatus: PaymentStatus
  fulfillmentStatus: FulfillmentStatus
  paymentMethod: PaymentMethod
  shippingAddress: ShippingAddress
  createdAt: string
}

export type CustomerStatus = "active" | "inactive"

export interface Customer {
  id: string
  name: string
  email: string
  phone?: string
  avatar?: string
  ordersCount: number
  totalSpent: number
  status: CustomerStatus
  city: string
  country: string
  createdAt: string
  lastOrderDate?: string
}

export type CouponType = "percentage" | "fixed_amount" | "free_shipping"
export type CouponStatus = "active" | "expired" | "disabled"

export interface Coupon {
  id: string
  code: string
  type: CouponType
  value: number
  minSpend: number
  usageLimit: number
  usageCount: number
  expiresAt: string
  status: CouponStatus
}

export type ReviewStatus = "approved" | "pending" | "rejected"

export interface Review {
  id: string
  productId: string
  productName: string
  customerName: string
  customerEmail: string
  rating: number
  title: string
  comment: string
  status: ReviewStatus
  createdAt: string
}

export interface EcommerceSettings {
  storeName: string
  storeEmail: string
  currency: string
  phone: string
  address: string
  lowStockAlert: number
  taxRate: number
  freeShippingThreshold: number
  enableReviews: boolean
  guestCheckout: boolean
}

export const initialProducts: Product[] = ecommerceData.products as Product[]
export const initialProductCategories: ProductCategory[] = ecommerceData.categories as ProductCategory[]
export const initialEcommerceCategories: ProductCategory[] = initialProductCategories
export const initialBrands: Brand[] = ecommerceData.brands as Brand[]
export const initialOrders: Order[] = ecommerceData.orders as Order[]
export const initialCustomers: Customer[] = ecommerceData.customers as Customer[]
export const initialCoupons: Coupon[] = ecommerceData.coupons as Coupon[]
export const initialReviews: Review[] = ecommerceData.reviews as Review[]
export const initialSettings: EcommerceSettings = ecommerceData.settings as EcommerceSettings
