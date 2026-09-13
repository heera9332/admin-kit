"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { AppDialog } from "@/components/app-dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { Task } from "../data/tasks"

interface CreateTaskDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreate: (task: Task) => void
}

export function CreateTaskDialog({ open, onOpenChange, onCreate }: CreateTaskDialogProps) {
  const [title, setTitle] = React.useState("")
  const [status, setStatus] = React.useState<Task["status"]>("todo")
  const [priority, setPriority] = React.useState<Task["priority"]>("medium")
  const [label, setLabel] = React.useState<Task["label"]>("feature")

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!title.trim()) return

    const newTask: Task = {
      id: `TASK-${Math.floor(1000 + Math.random() * 9000)}`,
      title: title.trim(),
      status,
      priority,
      label,
    }

    onCreate(newTask)
    setTitle("")
    onOpenChange(false)
  }

  return (
    <AppDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Create Task"
      description="Add a new task to your backlog or sprint board."
      onSubmit={handleSubmit}
      size="md"
      footer={
        <>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="submit">Create Task</Button>
        </>
      }
    >
      <div className="grid gap-4 py-2">
        <div className="space-y-1.5">
          <Label htmlFor="title">Task Title</Label>
          <Input
            id="title"
            placeholder="Brief description of the issue or feature"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="status">Status</Label>
            <Select
              value={status}
              onValueChange={(val) => {
                if (val) setStatus(val as Task["status"])
              }}
            >
              <SelectTrigger id="status" className="h-8 text-xs w-full">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="w-full">
                <SelectItem value="backlog">Backlog</SelectItem>
                <SelectItem value="todo">Todo</SelectItem>
                <SelectItem value="in progress">In Progress</SelectItem>
                <SelectItem value="done">Done</SelectItem>
                <SelectItem value="canceled">Canceled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="priority">Priority</Label>
            <Select
              value={priority}
              onValueChange={(val) => {
                if (val) setPriority(val as Task["priority"])
              }}
            >
              <SelectTrigger id="priority" className="h-8 text-xs w-full">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent className="w-full">
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="label">Label</Label>
            <Select
              value={label}
              onValueChange={(val) => {
                if (val) setLabel(val as Task["label"])
              }}
            >
              <SelectTrigger id="label" className="h-8 text-xs w-full">
                <SelectValue placeholder="Label" />
              </SelectTrigger>
              <SelectContent className="w-full">
                <SelectItem value="bug">Bug</SelectItem>
                <SelectItem value="feature">Feature</SelectItem>
                <SelectItem value="documentation">Docs</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </AppDialog>
  )
}
