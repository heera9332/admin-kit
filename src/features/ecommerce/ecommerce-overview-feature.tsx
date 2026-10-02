"use client"

import * as React from "react"
import { useTranslations } from "next-intl"
import { Link } from "@/i18n/routing"
import {
  ShoppingBag,
  Package,
  FolderTree,
  Tag,
  ShoppingCart,
  Users,
  Ticket,
  Star,
  BarChart3,
  Settings,
  ArrowRight,
  DollarSign,
  Boxes,
} from "lucide-react"

import { buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { StatusBadge } from "@/components/status-badge"
import { useEcommerce } from "@/context/ecommerce-provider"
import { cn } from "@/lib/utils"

export function EcommerceOverviewFeature() {
  const t = useTranslations("ecommerce.overview")
  const { products, categories, brands, orders, customers, coupons, reviews } =
    useEcommerce()

  const totalRevenue = React.useMemo(
    () => orders.reduce((acc, o) => acc + (o.paymentStatus === "paid" ? o.total : 0), 0),
    [orders]
  )

  const inStockProducts = React.useMemo(
    () => products.filter((p) => p.stock > 0).length,
    [products]
  )

  const quickLinks = [
    {
      title: "Products",
      count: `${products.length} items`,
      href: "/dashboard/ecommerce/products",
      icon: Package,
      desc: "Manage catalog, stock levels & prices",
    },
    {
      title: "Categories",
      count: `${categories.length} categories`,
      href: "/dashboard/ecommerce/categories",
      icon: FolderTree,
      desc: "Catalog departments & collections",
    },
    {
      title: "Brands",
      count: `${brands.length} brands`,
      href: "/dashboard/ecommerce/brands",
      icon: Tag,
      desc: "Manufacturer profiles & websites",
    },
    {
      title: "Orders",
      count: `${orders.length} orders`,
      href: "/dashboard/ecommerce/orders",
      icon: ShoppingCart,
      desc: "Customer checkout & shipments",
    },
    {
      title: "Customers",
      count: `${customers.length} users`,
      href: "/dashboard/ecommerce/customers",
      icon: Users,
      desc: "Buyer profiles & spending history",
    },
    {
      title: "Coupons",
      count: `${coupons.length} vouchers`,
      href: "/dashboard/ecommerce/coupons",
      icon: Ticket,
      desc: "Discounts & promo campaigns",
    },
    {
      title: "Reviews",
      count: `${reviews.length} reviews`,
      href: "/dashboard/ecommerce/reviews",
      icon: Star,
      desc: "Customer feedback & moderation",
    },
    {
      title: "Reports",
      count: "Analytics",
      href: "/dashboard/ecommerce/reports",
      icon: BarChart3,
      desc: "Sales trends, revenue & performance",
    },
    {
      title: "Settings",
      count: "Preferences",
      href: "/dashboard/ecommerce/settings",
      icon: Settings,
      desc: "Currency, shipping & store info",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight flex items-center gap-2.5">
            <div className="size-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <ShoppingBag className="size-5" />
            </div>
            <span>{t("title")}</span>
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            {t("description")}
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Link
            href="/dashboard/ecommerce/reports"
            className={cn(buttonVariants({ variant: "outline", size: "sm" }), "cursor-pointer")}
          >
            <BarChart3 className="size-3.5 mr-1.5" />
            <span>View Analytics</span>
          </Link>

          <Link
            href="/dashboard/ecommerce/products"
            className={cn(buttonVariants({ size: "sm" }), "cursor-pointer")}
          >
            <Package className="size-3.5 mr-1.5" />
            <span>Browse Catalog</span>
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              {t("metrics.totalRevenue")}
            </CardTitle>
            <div className="size-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <DollarSign className="size-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono text-foreground">
              ${totalRevenue.toFixed(2)}
            </div>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              from verified paid orders
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              {t("metrics.totalOrders")}
            </CardTitle>
            <div className="size-8 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <ShoppingCart className="size-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono text-foreground">
              {orders.length}
            </div>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              total orders processed
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              {t("metrics.activeCustomers")}
            </CardTitle>
            <div className="size-8 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <Users className="size-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono text-foreground">
              {customers.length}
            </div>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              registered customer accounts
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              {t("metrics.productsInStock")}
            </CardTitle>
            <div className="size-8 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Boxes className="size-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono text-foreground">
              {inStockProducts} / {products.length}
            </div>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              active inventory lines
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 9 Navigation Cards Grid */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">
          {t("quickLinks")}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {quickLinks.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.title}
                href={item.href}
                className="group flex flex-col justify-between p-4 rounded-xl border bg-card/60 hover:bg-card hover:border-primary/50 transition-all hover:shadow-xs"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="size-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Icon className="size-4.5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                        {item.title}
                      </h3>
                      <span className="text-[11px] font-mono text-muted-foreground">
                        {item.count}
                      </span>
                    </div>
                  </div>
                  <ArrowRight className="size-4 text-muted-foreground/60 group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0 mt-1" />
                </div>

                <p className="text-xs text-muted-foreground mt-2 line-clamp-1">
                  {item.desc}
                </p>
              </Link>
            )
          })}
        </div>
      </div>

      {/* Recent Orders Overview */}
      <Card className="shadow-xs">
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <div>
            <CardTitle className="text-sm font-semibold">
              {t("recentOrders")}
            </CardTitle>
            <CardDescription className="text-xs">
              Latest storefront customer purchases
            </CardDescription>
          </div>
          <Link
            href="/dashboard/ecommerce/orders"
            className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "text-xs cursor-pointer")}
          >
            <span>{t("viewAll")}</span>
            <ArrowRight className="size-3.5 ml-1" />
          </Link>
        </CardHeader>
        <CardContent>
          <div className="divide-y">
            {orders.slice(0, 4).map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between py-3 gap-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="size-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <ShoppingCart className="size-4" />
                  </div>
                  <div className="space-y-0.5 min-w-0">
                    <Link
                      href="/dashboard/ecommerce/orders"
                      className="text-xs font-semibold text-foreground hover:text-primary transition-colors block truncate"
                    >
                      {order.orderNumber} • {order.customer.name}
                    </Link>
                    <p className="text-[11px] text-muted-foreground font-mono">
                      {order.createdAt} • {order.items.length} items
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs font-bold font-mono">
                    ${order.total.toFixed(2)}
                  </span>
                  <StatusBadge
                    variant={order.paymentStatus === "paid" ? "success" : "warning"}
                    size="sm"
                  >
                    {order.paymentStatus}
                  </StatusBadge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
