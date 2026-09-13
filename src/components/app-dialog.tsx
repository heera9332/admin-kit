"use client"

import * as React from "react"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

export type AppDialogSize = "sm" | "md" | "lg" | "xl" | "2xl" | "full"

const sizeClasses: Record<AppDialogSize, string> = {
  sm: "sm:max-w-sm",
  md: "sm:max-w-md",
  lg: "sm:max-w-lg",
  xl: "sm:max-w-xl",
  "2xl": "sm:max-w-2xl",
  full: "sm:max-w-[calc(100vw-2rem)] sm:max-h-[calc(100vh-2rem)]",
}

export interface AppDialogProps {
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  trigger?: React.ReactNode
  title?: React.ReactNode
  description?: React.ReactNode
  header?: React.ReactNode
  footer?: React.ReactNode
  children?: React.ReactNode
  size?: AppDialogSize
  className?: string
  headerClassName?: string
  contentClassName?: string
  footerClassName?: string
  showCloseButton?: boolean
  scrollable?: boolean
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void
  formProps?: Omit<React.ComponentProps<"form">, "onSubmit">
}

export function AppDialog({
  open,
  defaultOpen,
  onOpenChange,
  trigger,
  title,
  description,
  header,
  footer,
  children,
  size = "md",
  className,
  headerClassName,
  contentClassName,
  footerClassName,
  showCloseButton = true,
  scrollable = false,
  onSubmit,
  formProps,
}: AppDialogProps) {
  const contentBody = (
    <>
      {header ? (
        header
      ) : title ? (
        <DialogHeader className={headerClassName}>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
      ) : (
        <DialogTitle className="sr-only">Dialog</DialogTitle>
      )}

      {children && (
        <div
          className={cn(
            scrollable && "max-h-[calc(80vh-10rem)] overflow-y-auto pr-1",
            contentClassName
          )}
        >
          {children}
        </div>
      )}

      {footer && <DialogFooter className={footerClassName}>{footer}</DialogFooter>}
    </>
  )

  return (
    <Dialog
      open={open}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
    >
      {trigger && <DialogTrigger render={trigger as React.ReactElement} />}
      <DialogContent
        className={cn(sizeClasses[size], className)}
        showCloseButton={showCloseButton}
      >
        {onSubmit ? (
          <form onSubmit={onSubmit} {...formProps} className="flex flex-col gap-4">
            {contentBody}
          </form>
        ) : (
          contentBody
        )}
      </DialogContent>
    </Dialog>
  )
}

AppDialog.Header = DialogHeader
AppDialog.Title = DialogTitle
AppDialog.Description = DialogDescription
AppDialog.Footer = DialogFooter
AppDialog.Close = DialogClose
AppDialog.Trigger = DialogTrigger
