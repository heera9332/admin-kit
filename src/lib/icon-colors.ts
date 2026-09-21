/**
 * Resolves semantic icon colors based on sidebar menu item or action meaning.
 * Activated when NEXT_PUBLIC_LABEL_MEANING_BASED_ICON_COLOR=true is set in environment.
 */

export const isLabelMeaningBasedColorEnabled =
  process.env.NEXT_PUBLIC_LABEL_MEANING_BASED_ICON_COLOR === "true"

export type SidebarMenuMeaning =
  | "dashboard"
  | "projects"
  | "tasks"
  | "apps"
  | "chats"
  | "users"
  | "cms"
  | "posts"
  | "categories"
  | "tags"
  | "auth"
  | "errors"
  | "settings"
  | "help"
  | "finance"
  | "ecommerce"
  | "analytics"
  | "neutral"

export const sidebarMeaningIconColorMap: Record<SidebarMenuMeaning, string> = {
  dashboard: "text-sky-500 dark:text-sky-400",
  projects: "text-violet-500 dark:text-violet-400",
  tasks: "text-emerald-500 dark:text-emerald-400",
  apps: "text-orange-500 dark:text-orange-400",
  chats: "text-cyan-500 dark:text-cyan-400",
  users: "text-blue-500 dark:text-blue-400",
  cms: "text-pink-500 dark:text-pink-400",
  posts: "text-indigo-500 dark:text-indigo-400",
  categories: "text-amber-500 dark:text-amber-400",
  tags: "text-teal-500 dark:text-teal-400",
  auth: "text-emerald-500 dark:text-emerald-400",
  errors: "text-rose-500 dark:text-rose-400",
  settings: "text-slate-500 dark:text-slate-400",
  help: "text-amber-500 dark:text-amber-400",
  finance: "text-emerald-500 dark:text-emerald-400",
  ecommerce: "text-violet-500 dark:text-violet-400",
  analytics: "text-sky-500 dark:text-sky-400",
  neutral: "",
}

export function resolveSidebarItemMeaning(input?: string): SidebarMenuMeaning {
  if (!input) return "neutral"
  const normalized = input.toLowerCase().replace(/[\s._\-\/]/g, "")

  // Dashboard / Overview
  if (
    normalized.includes("dashboard") ||
    normalized.includes("डैशबोर्ड")
  ) {
    return "dashboard"
  }

  // Analytics
  if (
    normalized.includes("analytics") ||
    normalized.includes("metrics") ||
    normalized.includes("reports")
  ) {
    return "analytics"
  }

  // Projects / Kanban
  if (
    normalized.includes("project") ||
    normalized.includes("kanban") ||
    normalized.includes("workspace") ||
    normalized.includes("परियोजना")
  ) {
    return "projects"
  }

  // Tasks / Todos / Checklist
  if (
    normalized.includes("task") ||
    normalized.includes("todo") ||
    normalized.includes("checklist") ||
    normalized.includes("कार्य")
  ) {
    return "tasks"
  }

  // Apps / Integrations
  if (
    normalized.includes("app") ||
    normalized.includes("package") ||
    normalized.includes("plugin") ||
    normalized.includes("integration") ||
    normalized.includes("ऐप्स")
  ) {
    return "apps"
  }

  // Chats / Messaging
  if (
    normalized.includes("chat") ||
    normalized.includes("message") ||
    normalized.includes("conversation") ||
    normalized.includes("inbox") ||
    normalized.includes("चैट") ||
    normalized.includes("बातचीत")
  ) {
    return "chats"
  }

  // Users / Team / Members
  if (
    normalized.includes("user") ||
    normalized.includes("member") ||
    normalized.includes("team") ||
    normalized.includes("people") ||
    normalized.includes("उपयोगकर्ता") ||
    normalized.includes("सदस्य")
  ) {
    return "users"
  }

  // CMS
  if (
    normalized.includes("cms") ||
    normalized.includes("सीएमएस")
  ) {
    return "cms"
  }

  // Posts / Articles
  if (
    normalized.includes("post") ||
    normalized.includes("article") ||
    normalized.includes("blog") ||
    normalized.includes("पोस्ट") ||
    normalized.includes("लेख")
  ) {
    return "posts"
  }

  // Categories / Collections
  if (
    normalized.includes("categor") ||
    normalized.includes("collection") ||
    normalized.includes("taxonomy") ||
    normalized.includes("श्रेण")
  ) {
    return "categories"
  }

  // Tags
  if (
    normalized.includes("tag") ||
    normalized.includes("टैग")
  ) {
    return "tags"
  }

  // Auth / Security
  if (
    normalized.includes("auth") ||
    normalized.includes("security") ||
    normalized.includes("signin") ||
    normalized.includes("signup") ||
    normalized.includes("password") ||
    normalized.includes("otp") ||
    normalized.includes("प्रमाणीकरण") ||
    normalized.includes("सुरक्षा")
  ) {
    return "auth"
  }

  // Errors / Bugs
  if (
    normalized.includes("error") ||
    normalized.includes("bug") ||
    normalized.includes("unauthorized") ||
    normalized.includes("forbidden") ||
    normalized.includes("fault") ||
    normalized.includes("त्रुटि")
  ) {
    return "errors"
  }

  // Settings
  if (
    normalized.includes("setting") ||
    normalized.includes("config") ||
    normalized.includes("preference") ||
    normalized.includes("सेटिंग")
  ) {
    return "settings"
  }

  // Help / Support
  if (
    normalized.includes("help") ||
    normalized.includes("support") ||
    normalized.includes("faq") ||
    normalized.includes("मदद") ||
    normalized.includes("सहायता")
  ) {
    return "help"
  }

  // Finance / Billing
  if (
    normalized.includes("finance") ||
    normalized.includes("billing") ||
    normalized.includes("payment") ||
    normalized.includes("invoice")
  ) {
    return "finance"
  }

  // E-commerce
  if (
    normalized.includes("commerce") ||
    normalized.includes("order") ||
    normalized.includes("product") ||
    normalized.includes("shop")
  ) {
    return "ecommerce"
  }

  return "neutral"
}

/**
 * Returns Tailwind text color classes for sidebar menu item icons based on their label meaning.
 * If NEXT_PUBLIC_LABEL_MEANING_BASED_ICON_COLOR is not "true", returns fallback (default: "").
 */
export function getSidebarIconColor(identifier?: string, fallback = ""): string {
  if (process.env.NEXT_PUBLIC_LABEL_MEANING_BASED_ICON_COLOR !== "true") {
    return fallback
  }
  if (!identifier) return fallback
  const meaning = resolveSidebarItemMeaning(identifier)
  return meaning !== "neutral" ? sidebarMeaningIconColorMap[meaning] : fallback
}
