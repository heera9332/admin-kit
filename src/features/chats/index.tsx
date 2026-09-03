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
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { chatContacts, type ChatContact, type ChatMessage } from "./data/chat-data"

export function ChatsFeature() {
  const [contacts, setContacts] = React.useState<ChatContact[]>(chatContacts)
  const [selectedId, setSelectedId] = React.useState<string>(chatContacts[0].id)
  const [search, setSearch] = React.useState("")
  const [inputText, setInputText] = React.useState("")
  const [mobileViewChat, setMobileViewChat] = React.useState(false)

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
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="size-8 sm:hidden -ml-2"
              onClick={() => setMobileViewChat(false)}
            >
              <ArrowLeft className="size-4" />
            </Button>

            <div className="relative">
              <Avatar className="size-8">
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
              <h3 className="font-semibold text-xs sm:text-sm leading-none">{activeContact.name}</h3>
              <p className="text-[10px] text-muted-foreground mt-0.5">
                {activeContact.status === "online" ? "Active now" : activeContact.lastActive}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="size-8 text-muted-foreground">
              <Phone className="size-4" />
            </Button>
            <Button variant="ghost" size="icon" className="size-8 text-muted-foreground">
              <Video className="size-4" />
            </Button>
            <Button variant="ghost" size="icon" className="size-8 text-muted-foreground">
              <MoreVertical className="size-4" />
            </Button>
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
    </div>
  )
}
