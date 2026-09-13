"use client"

import * as React from "react"
import {
  Search,
  Send,
  Phone,
  Video,
  MoreVertical,
  Paperclip,
  Smile,
  MessagesSquare,
  ArrowLeft,
  Info,
  Copy,
  Check,
  MapPin,
  Briefcase,
  Mail,
  Star,
  Ban,
  Trash2,
  FileText,
  ImageIcon,
  Lock,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { AppSheet } from "@/components/app-sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { chatContacts, type ChatContact, type ChatMessage } from "./data/chat-data"

export function ChatsFeature() {
  const [contacts, setContacts] = React.useState<ChatContact[]>(chatContacts)
  const [selectedId, setSelectedId] = React.useState<string>(chatContacts[0].id)
  const [search, setSearch] = React.useState("")
  const [inputText, setInputText] = React.useState("")
  const [mobileViewChat, setMobileViewChat] = React.useState(false)
  const [detailsOpen, setDetailsOpen] = React.useState(false)
  const [muted, setMuted] = React.useState(false)
  const [copiedEmail, setCopiedEmail] = React.useState(false)

  const activeContact = contacts.find((c) => c.id === selectedId) || contacts[0]

  const filteredContacts = contacts.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase())
  )

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputText.trim()) return

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: "user",
      text: inputText.trim(),
      time: "Just now",
    }

    setContacts((prev) =>
      prev.map((c) =>
        c.id === selectedId
          ? { ...c, messages: [...c.messages, newMsg] }
          : c
      )
    )

    setInputText("")
  }

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(activeContact.email)
    setCopiedEmail(true)
    setTimeout(() => setCopiedEmail(false), 2000)
  }

  const handleClearChat = () => {
    setContacts((prev) =>
      prev.map((c) =>
        c.id === selectedId ? { ...c, messages: [] } : c
      )
    )
    setDetailsOpen(false)
  }

  return (
    <div className="h-[calc(100vh-8.5rem)] min-h-[500px] rounded-lg border bg-card overflow-hidden flex flex-col sm:flex-row">
      {/* Left Contacts Pane */}
      <div
        className={cn(
          "w-full sm:w-80 md:w-96 border-r flex flex-col bg-background/50 shrink-0",
          mobileViewChat ? "hidden sm:flex" : "flex"
        )}
      >
        <div className="p-3 border-b space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessagesSquare className="size-4 text-primary" />
              <h2 className="font-semibold text-sm">Inbox</h2>
            </div>
            <Badge variant="secondary" className="text-[10px]">
              {contacts.reduce((acc, c) => acc + c.unread, 0)} new
            </Badge>
          </div>

          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
            <Input
              placeholder="Search conversations..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-8 pl-8 text-xs"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-border/40">
          {filteredContacts.map((contact) => {
            const isSelected = contact.id === selectedId
            const lastMsg = contact.messages[contact.messages.length - 1]

            return (
              <button
                key={contact.id}
                type="button"
                onClick={() => {
                  setSelectedId(contact.id)
                  setMobileViewChat(true)
                  if (contact.unread > 0) {
                    setContacts((prev) =>
                      prev.map((c) => (c.id === contact.id ? { ...c, unread: 0 } : c))
                    )
                  }
                }}
                className={cn(
                  "w-full text-left p-3 transition-colors flex items-start gap-3 hover:bg-muted/50 cursor-pointer",
                  isSelected && "bg-muted/80"
                )}
              >
                <div className="relative shrink-0">
                  <Avatar className="size-9">
                    <AvatarImage src={contact.avatar} alt={contact.name} />
                    <AvatarFallback className="text-xs">
                      {contact.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  {contact.status === "online" && (
                    <span className="absolute bottom-0 right-0 size-2.5 rounded-full bg-emerald-500 ring-2 ring-background" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-medium text-xs truncate">{contact.name}</span>
                    <span className="text-[10px] text-muted-foreground shrink-0 font-mono">
                      {lastMsg ? lastMsg.time : ""}
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground truncate mt-0.5">
                    {lastMsg ? lastMsg.text : "No messages yet"}
                  </p>
                </div>

                {contact.unread > 0 && (
                  <Badge className="size-4 p-0 flex items-center justify-center text-[10px] rounded-full shrink-0">
                    {contact.unread}
                  </Badge>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Right Chat Conversation Pane */}
      <div
        className={cn(
          "flex-1 flex flex-col bg-background",
          !mobileViewChat ? "hidden sm:flex" : "flex"
        )}
      >
        {/* Chat Header */}
        <div className="h-14 border-b px-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="size-8 sm:hidden -ml-2"
              onClick={() => setMobileViewChat(false)}
            >
              <ArrowLeft className="size-4" />
            </Button>

            {/* Clickable User Header like WhatsApp */}
            <button
              type="button"
              onClick={() => setDetailsOpen(true)}
              className="flex items-center gap-3 text-left hover:bg-muted/50 rounded-lg px-2 py-1.5 -ml-1 transition-colors cursor-pointer group"
              title={`View ${activeContact.name}'s contact info`}
              aria-label={`View ${activeContact.name}'s contact info`}
            >
              <div className="relative shrink-0">
                <Avatar className="size-8 transition-transform group-hover:scale-105">
                  <AvatarImage src={activeContact.avatar} alt={activeContact.name} />
                  <AvatarFallback className="text-xs">
                    {activeContact.name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                {activeContact.status === "online" && (
                  <span className="absolute bottom-0 right-0 size-2 rounded-full bg-emerald-500 ring-2 ring-background" />
                )}
              </div>

              <div>
                <h3 className="font-semibold text-xs sm:text-sm leading-none group-hover:text-primary transition-colors">
                  {activeContact.name}
                </h3>
                <p className="text-[10px] text-muted-foreground mt-0.5">
                  {activeContact.status === "online" ? "online" : `last seen ${activeContact.lastActive}`}
                </p>
              </div>
            </button>
          </div>

          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="size-8 text-muted-foreground" title="Audio call">
              <Phone className="size-4" />
            </Button>
            <Button variant="ghost" size="icon" className="size-8 text-muted-foreground" title="Video call">
              <Video className="size-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="size-8 text-muted-foreground"
              title="Contact info"
              onClick={() => setDetailsOpen(true)}
            >
              <Info className="size-4" />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button variant="ghost" size="icon" className="size-8 text-muted-foreground" />
                }
              >
                <MoreVertical className="size-4" />
                <span className="sr-only">More options</span>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44">
                <DropdownMenuItem onClick={() => setDetailsOpen(true)}>
                  <Info className="size-3.5 mr-2" />
                  <span>Contact info</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setMuted((prev) => !prev)}>
                  <span>{muted ? "Unmute notifications" : "Mute notifications"}</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem variant="destructive" onClick={handleClearChat}>
                  <Trash2 className="size-3.5 mr-2" />
                  <span>Clear messages</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          <div className="flex items-center justify-center my-2">
            <span className="text-[10px] text-muted-foreground px-2 py-0.5 rounded-full bg-muted/60 font-mono">
              Today
            </span>
          </div>

          {activeContact.messages.map((msg) => {
            const isMe = msg.sender === "user"

            return (
              <div
                key={msg.id}
                className={cn("flex flex-col", isMe ? "items-end" : "items-start")}
              >
                <div
                  className={cn(
                    "max-w-[75%] rounded-2xl px-3.5 py-2 text-xs leading-relaxed shadow-2xs",
                    isMe
                      ? "bg-primary text-primary-foreground rounded-br-xs"
                      : "bg-muted/80 text-foreground rounded-bl-xs"
                  )}
                >
                  {msg.text}
                </div>
                <span className="text-[9px] text-muted-foreground mt-1 px-1 font-mono">
                  {msg.time}
                </span>
              </div>
            )
          })}
        </div>

        {/* Message Input Box */}
        <div className="p-3 border-t bg-card/40 shrink-0">
          <form onSubmit={handleSendMessage} className="flex items-center gap-2">
            <Button type="button" variant="ghost" size="icon" className="size-8 shrink-0 text-muted-foreground">
              <Paperclip className="size-4" />
            </Button>

            <Input
              placeholder={`Message ${activeContact.name}...`}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="h-9 text-xs flex-1 bg-background"
            />

            <Button type="button" variant="ghost" size="icon" className="size-8 shrink-0 text-muted-foreground hidden sm:flex">
              <Smile className="size-4" />
            </Button>

            <Button type="submit" size="sm" className="h-9 px-3 gap-1.5 text-xs shrink-0">
              <span className="hidden sm:inline">Send</span>
              <Send className="size-3.5" />
            </Button>
          </form>
        </div>
      </div>

      {/* WhatsApp-Style User Details Drawer */}
      <AppSheet
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        side="right"
        size="md"
        scrollable
        className="p-0 flex flex-col"
        header={
          <div className="h-14 border-b px-6 flex items-center justify-between shrink-0">
            <AppSheet.Title className="text-base font-semibold">Contact Info</AppSheet.Title>
          </div>
        }
      >
        <div className="divide-y divide-border/60 pb-8">
          {/* Hero Profile Section */}
          <div className="p-6 flex flex-col items-center text-center bg-muted/20">
            <div className="relative mb-3.5">
              <Avatar className="size-24 border-4 border-background shadow-md">
                <AvatarImage src={activeContact.avatar} alt={activeContact.name} />
                <AvatarFallback className="text-xl font-semibold">
                  {activeContact.name.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              {activeContact.status === "online" && (
                <span className="absolute bottom-1 right-1 size-4 rounded-full bg-emerald-500 ring-3 ring-background" />
              )}
            </div>

            <h3 className="text-lg font-bold tracking-tight text-foreground">
              {activeContact.name}
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5 font-mono">
              {activeContact.phone}
            </p>

            <div className="mt-2.5">
              <span
                className={cn(
                  "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium border",
                  activeContact.status === "online"
                    ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                    : "bg-muted text-muted-foreground border-border"
                )}
              >
                <span
                  className={cn(
                    "size-1.5 rounded-full",
                    activeContact.status === "online" ? "bg-emerald-500" : "bg-muted-foreground/50"
                  )}
                />
                {activeContact.status === "online" ? "Online" : `Last seen ${activeContact.lastActive}`}
              </span>
            </div>

            {/* WhatsApp Quick Actions */}
            <div className="grid grid-cols-3 gap-3 mt-6 w-full max-w-xs">
              <button
                type="button"
                className="flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-muted/70 transition-colors group cursor-pointer border bg-card/60 shadow-2xs"
              >
                <div className="size-9 rounded-full bg-primary/10 text-primary flex items-center justify-center transition-transform group-hover:scale-110">
                  <Phone className="size-4" />
                </div>
                <span className="text-[11px] font-medium text-foreground">Audio</span>
              </button>

              <button
                type="button"
                className="flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-muted/70 transition-colors group cursor-pointer border bg-card/60 shadow-2xs"
              >
                <div className="size-9 rounded-full bg-primary/10 text-primary flex items-center justify-center transition-transform group-hover:scale-110">
                  <Video className="size-4" />
                </div>
                <span className="text-[11px] font-medium text-foreground">Video</span>
              </button>

              <button
                type="button"
                className="flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-muted/70 transition-colors group cursor-pointer border bg-card/60 shadow-2xs"
              >
                <div className="size-9 rounded-full bg-primary/10 text-primary flex items-center justify-center transition-transform group-hover:scale-110">
                  <Search className="size-4" />
                </div>
                <span className="text-[11px] font-medium text-foreground">Search</span>
              </button>
            </div>
          </div>

          {/* About Section */}
          <div className="p-5 space-y-1.5">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              About
            </span>
            <p className="text-sm text-foreground leading-relaxed">
              {activeContact.about}
            </p>
            <p className="text-[10px] text-muted-foreground pt-1">
              Member of workspace organization
            </p>
          </div>

          {/* Contact Details Section */}
          <div className="p-5 space-y-3.5">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Contact Details
            </span>

            <div className="space-y-3">
              <div className="flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Mail className="size-4 shrink-0 text-primary" />
                  <span className="text-foreground truncate">{activeContact.email}</span>
                </div>
                <Button
                  variant="ghost"
                  size="icon-xs"
                  onClick={handleCopyEmail}
                  title="Copy email address"
                >
                  {copiedEmail ? <Check className="size-3.5 text-emerald-500" /> : <Copy className="size-3.5" />}
                </Button>
              </div>

              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <Briefcase className="size-4 shrink-0 text-primary" />
                <span className="text-foreground">{activeContact.role}</span>
              </div>

              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <MapPin className="size-4 shrink-0 text-primary" />
                <span className="text-foreground">{activeContact.location}</span>
              </div>
            </div>
          </div>

          {/* Media, Links and Docs */}
          <div className="p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Media, links and docs
              </span>
              <span className="text-xs font-medium text-primary hover:underline cursor-pointer">
                3 items
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="aspect-square rounded-lg border bg-muted/40 flex flex-col items-center justify-center p-2 text-center hover:bg-muted/70 transition-colors cursor-pointer group">
                <ImageIcon className="size-5 text-muted-foreground group-hover:text-primary transition-colors mb-1" />
                <span className="text-[10px] text-muted-foreground font-medium truncate w-full">mockup.png</span>
              </div>
              <div className="aspect-square rounded-lg border bg-muted/40 flex flex-col items-center justify-center p-2 text-center hover:bg-muted/70 transition-colors cursor-pointer group">
                <FileText className="size-5 text-muted-foreground group-hover:text-primary transition-colors mb-1" />
                <span className="text-[10px] text-muted-foreground font-medium truncate w-full">specs.pdf</span>
              </div>
              <div className="aspect-square rounded-lg border bg-muted/40 flex flex-col items-center justify-center p-2 text-center hover:bg-muted/70 transition-colors cursor-pointer group">
                <ImageIcon className="size-5 text-muted-foreground group-hover:text-primary transition-colors mb-1" />
                <span className="text-[10px] text-muted-foreground font-medium truncate w-full">chart.png</span>
              </div>
            </div>
          </div>

          {/* Privacy & Settings */}
          <div className="p-5 space-y-3.5">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Chat Settings
            </span>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <p className="text-xs font-medium text-foreground">Mute notifications</p>
                  <p className="text-[11px] text-muted-foreground">Silence notifications from this chat</p>
                </div>
                <Switch checked={muted} onCheckedChange={setMuted} />
              </div>

              <div className="flex items-center justify-between py-1 hover:bg-muted/30 -mx-2 px-2 rounded-lg cursor-pointer">
                <div className="flex items-center gap-2.5">
                  <Star className="size-4 text-muted-foreground" />
                  <span className="text-xs font-medium text-foreground">Starred messages</span>
                </div>
                <span className="text-xs text-muted-foreground">None</span>
              </div>

              <div className="flex items-start gap-2.5 pt-2 text-[11px] text-muted-foreground leading-relaxed">
                <Lock className="size-3.5 text-primary shrink-0 mt-0.5" />
                <span>Messages and calls are end-to-end encrypted. No one outside of this chat can read them.</span>
              </div>
            </div>
          </div>

          {/* Danger Zone Actions */}
          <div className="p-5 space-y-2">
            <button
              type="button"
              className="w-full flex items-center gap-2.5 py-2 px-3 rounded-lg text-xs font-medium text-destructive hover:bg-destructive/10 transition-colors cursor-pointer text-left"
            >
              <Ban className="size-4" />
              <span>Block {activeContact.name}</span>
            </button>

            <button
              type="button"
              onClick={handleClearChat}
              className="w-full flex items-center gap-2.5 py-2 px-3 rounded-lg text-xs font-medium text-destructive hover:bg-destructive/10 transition-colors cursor-pointer text-left"
            >
              <Trash2 className="size-4" />
              <span>Clear chat history</span>
            </button>
          </div>
        </div>
      </AppSheet>
    </div>
  )
}
