"use client"

import * as React from "react"
import { useTranslations } from "next-intl"
import {
  TrendingUp,
  DollarSign,
  ShoppingCart,
  Repeat,
  RotateCcw,
  ArrowUpRight,
  Package,
} from "lucide-react"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useEcommerce } from "@/context/ecommerce-provider"

const monthlySalesData = [
  { month: "Jan", revenue: 14200, orders: 120 },
  { month: "Feb", revenue: 18400, orders: 145 },
  { month: "Mar", revenue: 22100, orders: 190 },
  { month: "Apr", revenue: 20800, orders: 175 },
  { month: "May", revenue: 26500, orders: 220 },
  { month: "Jun", revenue: 31200, orders: 260 },
  { month: "Jul", revenue: 29800, orders: 240 },
  { month: "Aug", revenue: 35400, orders: 290 },
  { month: "Sep", revenue: 42100, orders: 340 },
  { month: "Oct", revenue: 38900, orders: 310 },
  { month: "Nov", revenue: 48600, orders: 395 },
  { month: "Dec", revenue: 56200, orders: 460 },
]

const categoryRevenueData = [
  { category: "Electronics", sales: 142500 },
  { category: "Computers", sales: 98200 },
  { category: "Home & Kitchen", sales: 54100 },
  { category: "Furniture", sales: 48300 },
  { category: "Apparel", sales: 41200 },
]

export function ReportsFeature() {
  const t = useTranslations("ecommerce.reports")
  const { products } = useEcommerce()

  const metrics = [
    {
      title: t("metrics.grossRevenue"),
      value: "$384,300",
      change: "+18.4%",
      trend: "up",
      icon: DollarSign,
      desc: "vs. previous fiscal period",
    },
    {
      title: t("metrics.netSales"),
      value: "$346,850",
      change: "+16.2%",
      trend: "up",
      icon: TrendingUp,
      desc: "after discounts and returns",
    },
    {
      title: t("metrics.totalOrders"),
      value: "3,145",
      change: "+12.8%",
      trend: "up",
      icon: ShoppingCart,
      desc: "online storefront checkouts",
    },
    {
      title: t("metrics.aov"),
      value: "$122.19",
      change: "+4.1%",
      trend: "up",
      icon: DollarSign,
      desc: "average order value",
    },
    {
      title: t("metrics.returnRate"),
      value: "2.1%",
      change: "-0.4%",
      trend: "down",
      icon: RotateCcw,
      desc: "processed merchandise returns",
    },
    {
      title: t("metrics.repeatRate"),
      value: "38.6%",
      change: "+3.2%",
      trend: "up",
      icon: Repeat,
      desc: "repeat customer purchases",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
          {t("title")}
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
          {t("description")}
        </p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {metrics.map((metric) => {
          const Icon = metric.icon
          return (
            <Card key={metric.title} className="shadow-xs">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-xs font-medium text-muted-foreground">
                  {metric.title}
                </CardTitle>
                <div className="size-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                  <Icon className="size-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold font-mono tracking-tight text-foreground">
                  {metric.value}
                </div>
                <div className="flex items-center gap-1.5 mt-1">
                  <Badge
                    variant="secondary"
                    className="text-[10px] px-1.5 py-0 h-4 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10"
                  >
                    <ArrowUpRight className="size-3 mr-0.5 inline" />
                    {metric.change}
                  </Badge>
                  <span className="text-[11px] text-muted-foreground">{metric.desc}</span>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Revenue Chart */}
        <Card className="lg:col-span-2 shadow-xs">
          <CardHeader>
            <CardTitle className="text-sm font-semibold">
              {t("charts.salesTrend")}
            </CardTitle>
            <CardDescription className="text-xs">
              {t("charts.salesTrendDesc")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[320px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={monthlySalesData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="var(--primary)" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.5} />
                  <XAxis
                    dataKey="month"
                    stroke="#888888"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#888888"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(val) => `$${val / 1000}k`}
                  />
                  <Tooltip
                    formatter={(val) => [`$${Number(val).toLocaleString()}`, "Revenue"]}
                    contentStyle={{
                      borderRadius: "8px",
                      backgroundColor: "var(--background)",
                      borderColor: "var(--border)",
                      fontSize: "12px",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="var(--primary)"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorRevenue)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Category Breakdown Bar Chart */}
        <Card className="shadow-xs">
          <CardHeader>
            <CardTitle className="text-sm font-semibold">
              {t("charts.categoryShare")}
            </CardTitle>
            <CardDescription className="text-xs">
              {t("charts.categoryShareDesc")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[320px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={categoryRevenueData}
                  layout="vertical"
                  margin={{ top: 5, right: 15, left: 10, bottom: 5 }}
                >
                  <XAxis
                    type="number"
                    stroke="#888888"
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(val) => `$${val / 1000}k`}
                  />
                  <YAxis
                    dataKey="category"
                    type="category"
                    stroke="#888888"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    width={85}
                  />
                  <Tooltip
                    formatter={(val) => [`$${Number(val).toLocaleString()}`, "Sales"]}
                    contentStyle={{
                      borderRadius: "8px",
                      backgroundColor: "var(--background)",
                      borderColor: "var(--border)",
                      fontSize: "12px",
                    }}
                  />
                  <Bar
                    dataKey="sales"
                    fill="var(--primary)"
                    radius={[0, 4, 4, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Performing Products Ranking */}
      <Card className="shadow-xs">
        <CardHeader>
          <CardTitle className="text-sm font-semibold">
            {t("charts.topProducts")}
          </CardTitle>
          <CardDescription className="text-xs">
            {t("charts.topProductsDesc")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="divide-y">
            {products.slice(0, 5).map((product, index) => (
              <div
                key={product.id}
                className="flex items-center justify-between py-3 gap-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="size-6 rounded-full bg-muted flex items-center justify-center text-xs font-mono font-bold shrink-0">
                    {index + 1}
                  </span>
                  {product.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={product.image}
                      alt={product.name}
                      className="size-9 rounded-md object-cover border shrink-0 bg-muted/20"
                    />
                  ) : (
                    <div className="size-9 rounded-md bg-primary/10 text-primary flex items-center justify-center shrink-0">
                      <Package className="size-4" />
                    </div>
                  )}
                  <div className="space-y-0.5 min-w-0">
                    <p className="text-xs font-semibold text-foreground truncate">
                      {product.name}
                    </p>
                    <p className="text-[11px] text-muted-foreground font-mono">
                      SKU: {product.sku} • {product.category}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <p className="text-xs font-bold font-mono text-foreground">
                    ${(product.price * (product.stock + 20)).toFixed(2)}
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    {product.reviewsCount + 45} units sold
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
