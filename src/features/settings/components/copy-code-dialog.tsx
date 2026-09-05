"use client"

import * as React from "react"
import { Check, Copy, Code2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  generateThemeCss,
  type ThemeColor,
  type ThemeRadius,
  type ThemeFont,
} from "@/config/themes"

interface CopyCodeDialogProps {
  color: ThemeColor
  radius: ThemeRadius
  font?: ThemeFont
  displayFont?: ThemeFont
  trigger?: React.ReactNode
}

export function CopyCodeDialog({
  color,
  radius,
  font = "lexend",
  displayFont = "lexend",
  trigger,
}: CopyCodeDialogProps) {
  const [copied, setCopied] = React.useState(false)

  const cssCode = React.useMemo(() => {
    return generateThemeCss(color, radius, font, displayFont)
  }, [color, radius, font, displayFont])

  const tailwindV4Snippet = React.useMemo(() => {
    return `@import "tailwindcss";

@theme inline {
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-ring: var(--ring);
  --radius-lg: var(--radius);
}

${cssCode}`
  }, [cssCode])

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback if clipboard API is not available
    }
  }

  return (
    <Dialog>
      <DialogTrigger
        render={
          trigger ? (
            (trigger as React.ReactElement)
          ) : (
            <Button variant="outline" size="sm" className="gap-2 text-xs">
              <Code2 className="size-3.5" />
              <span>Export CSS</span>
            </Button>
          )
        }
      />
      <DialogContent className="sm:max-w-xl max-h-[85vh] flex flex-col p-6 overflow-hidden">
        <DialogHeader className="gap-1 text-left">
          <DialogTitle className="text-base font-semibold">Export Theme Code</DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Export these generated CSS variables and Tailwind v4 theme configuration for use in external projects.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="css" className="flex flex-col flex-1 min-h-0 mt-2">
          <div className="flex items-center justify-between pb-2 border-b">
            <TabsList className="h-8">
              <TabsTrigger value="css" className="text-xs px-3">
                CSS Variables
              </TabsTrigger>
              <TabsTrigger value="tailwind" className="text-xs px-3">
                Tailwind v4
              </TabsTrigger>
            </TabsList>

            <Button
              variant="outline"
              size="sm"
              onClick={() => copyToClipboard(cssCode)}
              className="h-7 text-xs gap-1.5"
            >
              {copied ? (
                <>
                  <Check className="size-3 text-emerald-500" />
                  <span className="text-emerald-600 font-medium">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="size-3" />
                  <span>Copy Code</span>
                </>
              )}
            </Button>
          </div>

          <TabsContent value="css" className="flex-1 overflow-auto mt-3">
            <pre className="p-4 rounded-lg bg-zinc-950 text-zinc-100 font-mono text-[11px] leading-relaxed overflow-x-auto border border-zinc-800">
              <code>{cssCode}</code>
            </pre>
          </TabsContent>

          <TabsContent value="tailwind" className="flex-1 overflow-auto mt-3">
            <pre className="p-4 rounded-lg bg-zinc-950 text-zinc-100 font-mono text-[11px] leading-relaxed overflow-x-auto border border-zinc-800">
              <code>{tailwindV4Snippet}</code>
            </pre>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
