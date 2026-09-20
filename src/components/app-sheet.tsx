"use client"

import * as React from "react"
import {
  Sheet,
  SheetBody,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

export type AppSheetSide = "top" | "right" | "bottom" | "left"
export type AppSheetSize = "sm" | "md" | "lg" | "xl" | "2xl" | "full"

const horizontalSizeClasses: Record<AppSheetSize, string> = {
  sm: "data-[side=right]:sm:max-w-sm data-[side=left]:sm:max-w-sm",
  md: "data-[side=right]:sm:max-w-md data-[side=left]:sm:max-w-md",
  lg: "data-[side=right]:sm:max-w-lg data-[side=left]:sm:max-w-lg",
  xl: "data-[side=right]:sm:max-w-xl data-[side=left]:sm:max-w-xl",
  "2xl": "data-[side=right]:sm:max-w-2xl data-[side=left]:sm:max-w-2xl",
  full: "data-[side=right]:sm:max-w-full data-[side=left]:sm:max-w-full w-screen",
}

const verticalSizeClasses: Record<AppSheetSize, string> = {
  sm: "max-h-[30vh]",
  md: "max-h-[50vh]",
  lg: "max-h-[70vh]",
  xl: "max-h-[85vh]",
  "2xl": "max-h-[95vh]",
  full: "h-screen max-h-screen",
}

export interface AppSheetProps {
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  trigger?: React.ReactNode
  title?: React.ReactNode
  description?: React.ReactNode
  header?: React.ReactNode
  footer?: React.ReactNode
  children?: React.ReactNode
  side?: AppSheetSide
  size?: AppSheetSize
  className?: string
  headerClassName?: string
  contentClassName?: string
  footerClassName?: string
  showCloseButton?: boolean
  scrollable?: boolean
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void
  formProps?: Omit<React.ComponentProps<"form">, "onSubmit">
}

export function AppSheet({
  open,
  defaultOpen,
  onOpenChange,
  trigger,
  title,
  description,
  header,
  footer,
  children,
  side = "right",
  size = "sm",
  className,
  headerClassName,
  contentClassName,
  footerClassName,
  showCloseButton = true,
  scrollable = true,
  onSubmit,
  formProps,
}: AppSheetProps) {
  const isHorizontal = side === "right" || side === "left"
  const sizeClass = isHorizontal ? horizontalSizeClasses[size] : verticalSizeClasses[size]

  const contentBody = (
    <>
      {header ? (
        header
      ) : title ? (
        <SheetHeader className={headerClassName}>
          <SheetTitle>{title}</SheetTitle>
          {description && <SheetDescription>{description}</SheetDescription>}
        </SheetHeader>
      ) : (
        <SheetTitle className="sr-only">Sheet</SheetTitle>
      )}

      {children && (
        <div
          className={cn(
            "flex-1 p-4",
            scrollable && "overflow-y-auto",
            contentClassName
          )}
        >
          {children}
        </div>
      )}

      {footer && <SheetFooter className={footerClassName}>{footer}</SheetFooter>}
    </>
  )

  return (
    <Sheet
      open={open}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
    >
      {trigger && <SheetTrigger render={trigger as React.ReactElement} />}
      <SheetContent
        side={side}
        className={cn(sizeClass, className)}
        showCloseButton={showCloseButton}
      >
        {onSubmit ? (
          <form onSubmit={onSubmit} {...formProps} className="flex h-full min-h-0 flex-col">
            {contentBody}
          </form>
        ) : (
          contentBody
        )}
      </SheetContent>
    </Sheet>
  )
}

AppSheet.Header = SheetHeader
AppSheet.Title = SheetTitle
AppSheet.Description = SheetDescription
AppSheet.Body = SheetBody
AppSheet.Footer = SheetFooter
AppSheet.Close = SheetClose
AppSheet.Trigger = SheetTrigger
