"use client"

import * as React from "react"
import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Placeholder from "@tiptap/extension-placeholder"
import Link from "@tiptap/extension-link"
import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Undo2,
  Redo2,
  Link2,
  Unlink,
  Minus,
  RemoveFormatting,
  CodeXml,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

export interface TiptapEditorProps {
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  editable?: boolean
  minHeight?: string
  className?: string
  toolbarClassName?: string
  contentClassName?: string
}

interface ToolbarButtonProps {
  onClick: () => void
  active?: boolean
  disabled?: boolean
  title: string
  icon: React.ReactNode
}

function ToolbarButton({
  onClick,
  active,
  disabled,
  title,
  icon,
}: ToolbarButtonProps) {
  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            type="button"
            variant={active ? "secondary" : "ghost"}
            size="icon"
            onClick={onClick}
            disabled={disabled}
            className={cn(
              "size-7 rounded-md cursor-pointer transition-colors",
              active && "bg-muted font-bold text-primary shadow-xs"
            )}
            aria-label={title}
          />
        }
      >
        {icon}
      </TooltipTrigger>
      <TooltipContent side="top" className="text-[11px] py-1 px-2">
        {title}
      </TooltipContent>
    </Tooltip>
  )
}

export function TiptapEditor({
  value = "",
  onChange,
  placeholder = "Write something inspiring...",
  editable = true,
  minHeight = "min-h-[160px]",
  className,
  toolbarClassName,
  contentClassName,
}: TiptapEditorProps) {
  const isMounted = React.useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  )

  const lastHtmlRef = React.useRef(value)

  const extensions = React.useMemo(
    () => [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Placeholder.configure({
        placeholder,
        emptyEditorClass: "is-editor-empty",
      }),
      Link.configure({
        openOnClick: false,
        autolink: true,
        defaultProtocol: "https",
        HTMLAttributes: {
          class: "text-primary underline font-medium cursor-pointer",
          target: "_blank",
          rel: "noopener noreferrer",
        },
      }),
    ],
    [placeholder]
  )

  const editor = useEditor(
    {
      immediatelyRender: false,
      editable,
      extensions,
      content: value,
      onUpdate: ({ editor: currentEditor }) => {
        const html = currentEditor.getHTML()
        lastHtmlRef.current = html
        onChange?.(html)
      },
    },
    [extensions]
  )

  // Synchronize external value changes if editor content is genuinely different and not from typing
  React.useEffect(() => {
    if (!editor) return

    // If incoming value matches what was just emitted by the editor, skip
    if (value === lastHtmlRef.current) return

    // If both incoming value and editor document are empty, skip
    const isValueEmpty = !value || value.trim() === "" || value === "<p></p>"
    const isEditorEmpty = editor.isEmpty || editor.getHTML() === "<p></p>"
    if (isValueEmpty && isEditorEmpty) return

    const currentHtml = editor.getHTML()
    if (value !== currentHtml) {
      lastHtmlRef.current = value
      editor.commands.setContent(value || "", { emitUpdate: false })
    }
  }, [value, editor])

  React.useEffect(() => {
    if (editor) {
      editor.setEditable(editable)
    }
  }, [editable, editor])

  const setLink = React.useCallback(() => {
    if (!editor) return
    const previousUrl = editor.getAttributes("link").href
    const url = window.prompt("Enter URL:", previousUrl || "https://")

    if (url === null) return
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run()
      return
    }

    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run()
  }, [editor])

  if (!isMounted) {
    return (
      <div
        className={cn(
          "rounded-xl border bg-card/60 p-4 animate-pulse flex flex-col justify-center items-center text-xs text-muted-foreground",
          minHeight,
          className
        )}
      >
        <span>Loading editor...</span>
      </div>
    )
  }

  if (!editor) return null

  return (
    <div
      className={cn(
        "rounded-xl border bg-card text-card-foreground shadow-xs transition-colors focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/20 overflow-hidden flex flex-col",
        className
      )}
    >
      {editable && (
        <div
          className={cn(
            "flex flex-wrap items-center gap-0.5 border-b bg-muted/30 p-1.5",
            toolbarClassName
          )}
        >
          {/* History */}
          <ToolbarButton
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            title="Undo (Ctrl+Z)"
            icon={<Undo2 className="size-3.5" />}
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            title="Redo (Ctrl+Y)"
            icon={<Redo2 className="size-3.5" />}
          />

          <Separator orientation="vertical" className="mx-1 h-5" />

          {/* Headings */}
          <ToolbarButton
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 1 }).run()
            }
            active={editor.isActive("heading", { level: 1 })}
            title="Heading 1"
            icon={<Heading1 className="size-3.5" />}
          />
          <ToolbarButton
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
            active={editor.isActive("heading", { level: 2 })}
            title="Heading 2"
            icon={<Heading2 className="size-3.5" />}
          />
          <ToolbarButton
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 3 }).run()
            }
            active={editor.isActive("heading", { level: 3 })}
            title="Heading 3"
            icon={<Heading3 className="size-3.5" />}
          />

          <Separator orientation="vertical" className="mx-1 h-5" />

          {/* Inline Formats */}
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            active={editor.isActive("bold")}
            title="Bold (Ctrl+B)"
            icon={<Bold className="size-3.5" />}
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            active={editor.isActive("italic")}
            title="Italic (Ctrl+I)"
            icon={<Italic className="size-3.5" />}
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleStrike().run()}
            active={editor.isActive("strike")}
            title="Strikethrough"
            icon={<Strikethrough className="size-3.5" />}
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleCode().run()}
            active={editor.isActive("code")}
            title="Inline Code"
            icon={<Code className="size-3.5" />}
          />

          <Separator orientation="vertical" className="mx-1 h-5" />

          {/* Lists & Blocks */}
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            active={editor.isActive("bulletList")}
            title="Bullet List"
            icon={<List className="size-3.5" />}
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            active={editor.isActive("orderedList")}
            title="Ordered List"
            icon={<ListOrdered className="size-3.5" />}
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            active={editor.isActive("blockquote")}
            title="Blockquote"
            icon={<Quote className="size-3.5" />}
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            active={editor.isActive("codeBlock")}
            title="Code Block"
            icon={<CodeXml className="size-3.5" />}
          />

          <Separator orientation="vertical" className="mx-1 h-5" />

          {/* Links & Rules */}
          <ToolbarButton
            onClick={setLink}
            active={editor.isActive("link")}
            title="Insert Link"
            icon={<Link2 className="size-3.5" />}
          />
          {editor.isActive("link") && (
            <ToolbarButton
              onClick={() => editor.chain().focus().unsetLink().run()}
              title="Remove Link"
              icon={<Unlink className="size-3.5" />}
            />
          )}
          <ToolbarButton
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
            title="Horizontal Divider"
            icon={<Minus className="size-3.5" />}
          />
          <ToolbarButton
            onClick={() =>
              editor.chain().focus().clearNodes().unsetAllMarks().run()
            }
            title="Clear Formatting"
            icon={<RemoveFormatting className="size-3.5" />}
          />
        </div>
      )}

      {/* Editor Content Area */}
      <div
        className={cn(
          "p-3.5 text-sm text-foreground overflow-y-auto cursor-text",
          minHeight,
          "[&_.tiptap]:outline-hidden [&_.tiptap]:min-h-full",
          "[&_.tiptap_p]:my-2 [&_.tiptap_p]:leading-relaxed",
          "[&_.tiptap_h1]:text-2xl [&_.tiptap_h1]:font-bold [&_.tiptap_h1]:tracking-tight [&_.tiptap_h1]:mt-4 [&_.tiptap_h1]:mb-2",
          "[&_.tiptap_h2]:text-xl [&_.tiptap_h2]:font-semibold [&_.tiptap_h2]:tracking-tight [&_.tiptap_h2]:mt-3 [&_.tiptap_h2]:mb-2",
          "[&_.tiptap_h3]:text-lg [&_.tiptap_h3]:font-medium [&_.tiptap_h3]:mt-2 [&_.tiptap_h3]:mb-1",
          "[&_.tiptap_ul]:list-disc [&_.tiptap_ul]:pl-5 [&_.tiptap_ul]:my-2 [&_.tiptap_ul]:space-y-1",
          "[&_.tiptap_ol]:list-decimal [&_.tiptap_ol]:pl-5 [&_.tiptap_ol]:my-2 [&_.tiptap_ol]:space-y-1",
          "[&_.tiptap_blockquote]:border-l-3 [&_.tiptap_blockquote]:border-primary/50 [&_.tiptap_blockquote]:pl-3.5 [&_.tiptap_blockquote]:italic [&_.tiptap_blockquote]:text-muted-foreground [&_.tiptap_blockquote]:my-3",
          "[&_.tiptap_pre]:bg-muted/80 [&_.tiptap_pre]:text-foreground [&_.tiptap_pre]:p-3 [&_.tiptap_pre]:rounded-lg [&_.tiptap_pre]:font-mono [&_.tiptap_pre]:text-xs [&_.tiptap_pre]:my-3 [&_.tiptap_pre]:overflow-x-auto",
          "[&_.tiptap_code]:bg-muted/70 [&_.tiptap_code]:text-primary [&_.tiptap_code]:font-mono [&_.tiptap_code]:text-xs [&_.tiptap_code]:px-1.5 [&_.tiptap_code]:py-0.5 [&_.tiptap_code]:rounded",
          "[&_.tiptap_hr]:my-4 [&_.tiptap_hr]:border-border",
          "[&_.tiptap_p.is-editor-empty:first-child::before]:content-[attr(data-placeholder)] [&_.tiptap_p.is-editor-empty:first-child::before]:text-muted-foreground/60 [&_.tiptap_p.is-editor-empty:first-child::before]:float-left [&_.tiptap_p.is-editor-empty:first-child::before]:pointer-events-none [&_.tiptap_p.is-editor-empty:first-child::before]:h-0",
          contentClassName
        )}
        onClick={() => {
          if (!editor.isFocused) {
            editor.commands.focus()
          }
        }}
      >
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}
