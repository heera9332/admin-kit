import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

export type StatusBadgeVariant =
  | "success"
  | "info"
  | "warning"
  | "destructive"
  | "neutral"
  | "purple"

export type StatusBadgeAppearance = "subtle" | "solid" | "outline"

export type StatusBadgeSize = "sm" | "default" | "lg"

const statusBadgeVariants = cva(
  "inline-flex items-center justify-center font-medium transition-colors border select-none shrink-0 gap-1.5",
  {
    variants: {
      variant: {
        success: "",
        info: "",
        warning: "",
        destructive: "",
        neutral: "",
        purple: "",
      },
      appearance: {
        subtle: "",
        solid: "",
        outline: "",
      },
      size: {
        sm: "text-[10px] h-4.5 px-2 rounded-full",
        default: "text-xs h-5.5 px-2.5 rounded-full",
        lg: "text-sm h-6.5 px-3 rounded-full",
      },
    },
    compoundVariants: [
      // Subtle (default modern dashboard look)
      {
        variant: "success",
        appearance: "subtle",
        className:
          "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20",
      },
      {
        variant: "info",
        appearance: "subtle",
        className:
          "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20",
      },
      {
        variant: "warning",
        appearance: "subtle",
        className:
          "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20",
      },
      {
        variant: "destructive",
        appearance: "subtle",
        className:
          "bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/20",
      },
      {
        variant: "neutral",
        appearance: "subtle",
        className: "bg-muted text-muted-foreground border-border",
      },
      {
        variant: "purple",
        appearance: "subtle",
        className:
          "bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20",
      },

      // Solid
      {
        variant: "success",
        appearance: "solid",
        className:
          "bg-emerald-600 text-white dark:bg-emerald-500 dark:text-emerald-950 border-transparent shadow-2xs",
      },
      {
        variant: "info",
        appearance: "solid",
        className:
          "bg-blue-600 text-white dark:bg-blue-500 dark:text-blue-950 border-transparent shadow-2xs",
      },
      {
        variant: "warning",
        appearance: "solid",
        className:
          "bg-amber-600 text-white dark:bg-amber-500 dark:text-amber-950 border-transparent shadow-2xs",
      },
      {
        variant: "destructive",
        appearance: "solid",
        className:
          "bg-rose-600 text-white dark:bg-rose-500 dark:text-rose-950 border-transparent shadow-2xs",
      },
      {
        variant: "neutral",
        appearance: "solid",
        className: "bg-muted-foreground text-background border-transparent shadow-2xs",
      },
      {
        variant: "purple",
        appearance: "solid",
        className:
          "bg-purple-600 text-white dark:bg-purple-500 dark:text-purple-950 border-transparent shadow-2xs",
      },

      // Outline
      {
        variant: "success",
        appearance: "outline",
        className:
          "border-emerald-500/40 text-emerald-700 dark:text-emerald-400 bg-transparent",
      },
      {
        variant: "info",
        appearance: "outline",
        className:
          "border-blue-500/40 text-blue-700 dark:text-blue-400 bg-transparent",
      },
      {
        variant: "warning",
        appearance: "outline",
        className:
          "border-amber-500/40 text-amber-700 dark:text-amber-400 bg-transparent",
      },
      {
        variant: "destructive",
        appearance: "outline",
        className:
          "border-rose-500/40 text-rose-700 dark:text-rose-400 bg-transparent",
      },
      {
        variant: "neutral",
        appearance: "outline",
        className: "border-border text-muted-foreground bg-transparent",
      },
      {
        variant: "purple",
        appearance: "outline",
        className:
          "border-purple-500/40 text-purple-700 dark:text-purple-400 bg-transparent",
      },
    ],
    defaultVariants: {
      variant: "neutral",
      appearance: "subtle",
      size: "default",
    },
  }
)

const dotColorMap: Record<StatusBadgeVariant, string> = {
  success: "bg-emerald-500",
  info: "bg-blue-500",
  warning: "bg-amber-500",
  destructive: "bg-rose-500",
  neutral: "bg-muted-foreground",
  purple: "bg-purple-500",
}

const statusToVariantMap: Record<string, StatusBadgeVariant> = {
  // Success
  completed: "success",
  done: "success",
  active: "success",
  published: "success",
  success: "success",
  online: "success",
  resolved: "success",
  paid: "success",

  // Info
  in_progress: "info",
  "in-progress": "info",
  "in progress": "info",
  invited: "info",
  running: "info",
  processing: "info",

  // Warning
  planning: "warning",
  pending: "warning",
  review: "warning",
  todo: "warning",
  warning: "warning",

  // Destructive
  on_hold: "destructive",
  "on-hold": "destructive",
  "on hold": "destructive",
  suspended: "destructive",
  canceled: "destructive",
  cancelled: "destructive",
  failed: "destructive",
  error: "destructive",
  rejected: "destructive",

  // Neutral
  inactive: "neutral",
  draft: "neutral",
  backlog: "neutral",
  archived: "neutral",
  offline: "neutral",
}

function formatStatusText(str: string): string {
  return str
    .replace(/[_-]/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase())
}

export interface StatusBadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof statusBadgeVariants> {
  /** Known status string for automatic variant and label mapping */
  status?: string
  /** Explicit variant overriding the automatic status mapping */
  variant?: StatusBadgeVariant
  /** Visual appearance style */
  appearance?: StatusBadgeAppearance
  /** Size preset */
  size?: StatusBadgeSize
  /** Show an indicator dot */
  dot?: boolean
  /** Pulse animation for the indicator dot */
  pulse?: boolean
  /** Leading icon */
  icon?: React.ReactNode
}

export function StatusBadge({
  status,
  variant,
  appearance = "subtle",
  size = "default",
  dot = false,
  pulse = false,
  icon,
  className,
  children,
  ...props
}: StatusBadgeProps) {
  const resolvedVariant: StatusBadgeVariant =
    variant ??
    (status ? statusToVariantMap[status.toLowerCase()] ?? "neutral" : "neutral")

  const dotColor = dotColorMap[resolvedVariant]

  const displayContent =
    children ?? (status ? formatStatusText(status) : null)

  return (
    <span
      data-slot="status-badge"
      className={cn(
        statusBadgeVariants({
          variant: resolvedVariant,
          appearance,
          size,
        }),
        className
      )}
      {...props}
    >
      {dot && (
        <span className="relative flex size-1.5 items-center justify-center">
          {pulse && (
            <span
              className={cn(
                "absolute inline-flex size-full animate-ping rounded-full opacity-75",
                dotColor
              )}
            />
          )}
          <span
            className={cn("relative inline-flex size-1.5 rounded-full", dotColor)}
          />
        </span>
      )}

      {icon && <span className="inline-flex shrink-0 items-center">{icon}</span>}

      {displayContent && <span>{displayContent}</span>}
    </span>
  )
}
