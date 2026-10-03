import ecommerceData from "./ecommerce.json"

export type ProductStatus = "published" | "draft" | "out_of_stock" | "archived"

export interface Product {
  id: string
  name: string
  slug: string
  shortDescription?: string
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
  metaTitle?: string
  metaDescription?: string
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

export interface PaymentGatewayConfig {
  id: string
  name: string
  description: string
  enabled: boolean
  isTestMode?: boolean
  accountDetails?: string
  instructions?: string
  publishableKey?: string
  secretKey?: string
  merchantEmail?: string
}

export interface EcommerceSettings {
  // Store Settings (General)
  storeName: string
  storeEmail: string
  phone: string
  tagline?: string
  storeNotice?: string
  sellingLocations?: string
  shippingLocations?: string
  defaultCustomerLocation?: string
  taxRate: number
  enableTaxes?: boolean
  enableCoupons?: boolean
  lowStockAlert: number
  freeShippingThreshold: number
  enableReviews: boolean
  guestCheckout: boolean

  // Site Visibility
  siteVisibility?: "coming_soon" | "live"
  showVisibilityBadgeInAdminBar?: boolean
  comingSoonApplyToStoreOnly?: boolean
  comingSoonShareableLink?: boolean

  // Store Address
  address: string
  addressLine1?: string
  addressLine2?: string
  city?: string
  state?: string
  country?: string
  zip?: string
  warehouseSameAsStore?: boolean
  warehouseName?: string
  warehouseAddressLine1?: string
  warehouseCity?: string
  warehouseState?: string
  warehouseZip?: string
  warehousePhone?: string

  // Currency Options
  currency: string
  currencyPosition?: "left" | "right" | "left_space" | "right_space"
  thousandSeparator?: string
  decimalSeparator?: string
  decimalPlaces?: number
  priceSuffix?: string

  // Payments
  paymentGateways?: PaymentGatewayConfig[]
}

export const defaultPaymentGateways: PaymentGatewayConfig[] = [
  {
    id: "stripe",
    name: "Stripe (Credit / Debit Card)",
    description: "Accept Visa, Mastercard, Amex, Apple Pay, and Google Pay securely via Stripe.",
    enabled: true,
    isTestMode: true,
    publishableKey: "pk_test_51MzExampleKey...",
    secretKey: "sk_test_51MzExampleSecret...",
    instructions: "Pay with your credit or debit card. Your payment is encrypted and PCI compliant.",
  },
  {
    id: "paypal",
    name: "PayPal Checkout",
    description: "Accept PayPal balance, Pay in 4, and international credit cards.",
    enabled: true,
    isTestMode: true,
    merchantEmail: "payments@luminacommerce.com",
    instructions: "You will be redirected to PayPal to complete your purchase safely.",
  },
  {
    id: "bacs",
    name: "Direct Bank Transfer (BACS)",
    description: "Make payment directly into our bank account. Goods dispatch upon payment clearance.",
    enabled: false,
    accountDetails: "Chase Bank • Account: 9876543210 • Routing: 121000358",
    instructions: "Please use your Order ID as the payment reference. Your order will not ship until funds have cleared.",
  },
  {
    id: "cod",
    name: "Cash on Delivery (COD)",
    description: "Pay with cash upon delivery at your doorstep.",
    enabled: true,
    instructions: "Please have exact cash ready when the courier arrives at your shipping address.",
  },
  {
    id: "razorpay",
    name: "Razorpay (UPI / NetBanking / Cards)",
    description: "Accept UPI payments (GPay, PhonePe, Paytm), NetBanking, and Indian debit/credit cards.",
    enabled: false,
    isTestMode: true,
    publishableKey: "rzp_test_example...",
    secretKey: "rzp_secret_example...",
    instructions: "Scan the UPI QR code or enter your VPA to pay instantly.",
  },
]

export const initialProducts: Product[] = ecommerceData.products as Product[]
export const initialProductCategories: ProductCategory[] = ecommerceData.categories as ProductCategory[]
export const initialEcommerceCategories: ProductCategory[] = initialProductCategories
export const initialBrands: Brand[] = ecommerceData.brands as Brand[]
export const initialOrders: Order[] = ecommerceData.orders as Order[]
export const initialCustomers: Customer[] = ecommerceData.customers as Customer[]
export const initialCoupons: Coupon[] = ecommerceData.coupons as Coupon[]
export const initialReviews: Review[] = ecommerceData.reviews as Review[]
export const initialSettings: EcommerceSettings = {
  storeName: (ecommerceData.settings as any)?.storeName || "Lumina Commerce",
  storeEmail: (ecommerceData.settings as any)?.storeEmail || "store@luminacommerce.com",
  phone: (ecommerceData.settings as any)?.phone || "+1 (800) 555-0199",
  tagline: "Quality goods delivered to your doorstep",
  storeNotice: "Enjoy free shipping on orders over $99. No coupon code required!",
  sellingLocations: "all",
  shippingLocations: "all_selling",
  defaultCustomerLocation: "geolocate",
  taxRate: (ecommerceData.settings as any)?.taxRate || 8.5,
  enableTaxes: true,
  enableCoupons: true,
  lowStockAlert: (ecommerceData.settings as any)?.lowStockAlert || 10,
  freeShippingThreshold: (ecommerceData.settings as any)?.freeShippingThreshold || 99.0,
  enableReviews: (ecommerceData.settings as any)?.enableReviews ?? true,
  guestCheckout: (ecommerceData.settings as any)?.guestCheckout ?? true,

  siteVisibility: "coming_soon",
  showVisibilityBadgeInAdminBar: true,
  comingSoonApplyToStoreOnly: false,
  comingSoonShareableLink: true,

  address: (ecommerceData.settings as any)?.address || "500 Howard Street, Suite 400, San Francisco, CA 94105",
  addressLine1: "500 Howard Street",
  addressLine2: "Suite 400",
  city: "San Francisco",
  state: "CA",
  country: "United States (US)",
  zip: "94105",
  warehouseSameAsStore: true,
  warehouseName: "West Coast Distribution Hub",
  warehouseAddressLine1: "500 Howard Street, Suite 400",
  warehouseCity: "San Francisco",
  warehouseState: "CA",
  warehouseZip: "94105",
  warehousePhone: "+1 (800) 555-0199",

  currency: (ecommerceData.settings as any)?.currency || "USD",
  currencyPosition: "left",
  thousandSeparator: ",",
  decimalSeparator: ".",
  decimalPlaces: 2,
  priceSuffix: "ex. VAT",

  paymentGateways: defaultPaymentGateways,
}

