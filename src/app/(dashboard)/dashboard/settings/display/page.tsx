"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"

const sidebarDisplayItems = [
  { id: "dashboard", label: "Dashboard Overview" },
  { id: "tasks", label: "Tasks & Backlog" },
  { id: "apps", label: "App Integrations" },
  { id: "chats", label: "Chats Messenger" },
  { id: "users", label: "Users & Roles" },
]

export default function DisplaySettingsPage() {
  const [selectedItems, setSelectedItems] = React.useState<string[]>([
    "dashboard",
    "tasks",
    "apps",
    "chats",
    "users",
  ])
  const [saved, setSaved] = React.useState(false)

  const toggleItem = (id: string) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-base font-semibold">Display</h3>
        <p className="text-xs text-muted-foreground">
          Turn items on or off to control what&apos;s displayed in the sidebar navigation.
        </p>
      </div>

      <Separator />

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-3 max-w-md">
          <div className="space-y-1 mb-3">
            <span className="text-xs font-semibold">Sidebar Items</span>
            <p className="text-[11px] text-muted-foreground">
              Select the sections you want visible in the primary navigation rail.
            </p>
          </div>

          {sidebarDisplayItems.map((item) => (
            <div key={item.id} className="flex items-center space-x-2">
              <Checkbox
                id={item.id}
                checked={selectedItems.includes(item.id)}
                onCheckedChange={() => toggleItem(item.id)}
              />
              <label
                htmlFor={item.id}
                className="text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
              >
                {item.label}
              </label>
            </div>
          ))}
        </div>

        <div className="pt-2 flex items-center gap-3">
          <Button type="submit" size="sm" className="text-xs">
            Update display
          </Button>
          {saved && (
            <span className="text-xs text-emerald-500 font-medium">
              Display settings updated!
            </span>
          )}
        </div>
      </form>
    </div>
  )
}
