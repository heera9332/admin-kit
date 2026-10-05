"use client"

import * as React from "react"
import { tasks as initialTasks, type Task } from "@/data/tasks"

interface TasksContextType {
  tasks: Task[]
  getTask: (id: string) => Task | undefined
  updateTask: (id: string, updates: Partial<Task>) => void
  createTask: (taskData: Partial<Task> & { title: string }) => Task
  deleteTask: (id: string) => void
  bulkUpdateStatus: (taskIds: string[], status: Task["status"]) => void
}

const TasksContext = React.createContext<TasksContextType | undefined>(undefined)

const TASKS_STORAGE_KEY = "admin_tasks_list"

let memoryTasks: Task[] = initialTasks as Task[]
let isInitialized = false

function initStorage() {
  if (isInitialized || typeof window === "undefined") return
  try {
    const saved = localStorage.getItem(TASKS_STORAGE_KEY)
    if (saved) {
      const parsed = JSON.parse(saved)
      if (Array.isArray(parsed) && parsed.length > 0) {
        memoryTasks = parsed
      }
    }
  } catch {
    // Ignore localStorage errors
  }
  isInitialized = true
}

const listeners = new Set<() => void>()

function subscribe(callback: () => void) {
  listeners.add(callback)
  return () => {
    listeners.delete(callback)
  }
}

function notify() {
  listeners.forEach((l) => l())
}

function persistTasks(tasks: Task[]) {
  memoryTasks = tasks
  notify()
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks))
    } catch {
      // Ignore write errors
    }
  }
}

function generateTaskId(): string {
  return `TASK-${Math.floor(1000 + Math.random() * 9000)}`
}

export function TasksProvider({ children }: { children: React.ReactNode }) {
  React.useEffect(() => {
    initStorage()
    notify()
  }, [])

  const tasks = React.useSyncExternalStore(
    subscribe,
    () => {
      initStorage()
      return memoryTasks
    },
    () => initialTasks as Task[]
  )

  const getTask = React.useCallback(
    (id: string) => tasks.find((t) => t.id === id),
    [tasks]
  )

  const updateTask = React.useCallback(
    (id: string, updates: Partial<Task>) => {
      const updated = tasks.map((t) =>
        t.id === id ? { ...t, ...updates } : t
      )
      persistTasks(updated)
    },
    [tasks]
  )

  const createTask = React.useCallback(
    (taskData: Partial<Task> & { title: string }) => {
      const newTask: Task = {
        id: taskData.id || generateTaskId(),
        status: taskData.status || "todo",
        priority: taskData.priority || "medium",
        label: taskData.label || "feature",
        assignedTo: taskData.assignedTo || null,
        reportedTo: taskData.reportedTo || null,
        projectId: taskData.projectId || taskData.project || null,
        project: taskData.project || taskData.projectId || null,
        content: taskData.content || "",
        ...taskData,
        title: taskData.title.trim(),
      }
      persistTasks([newTask, ...tasks])
      return newTask
    },
    [tasks]
  )

  const deleteTask = React.useCallback(
    (id: string) => {
      persistTasks(tasks.filter((t) => t.id !== id))
    },
    [tasks]
  )

  const bulkUpdateStatus = React.useCallback(
    (taskIds: string[], status: Task["status"]) => {
      const updated = tasks.map((t) =>
        taskIds.includes(t.id) ? { ...t, status } : t
      )
      persistTasks(updated)
    },
    [tasks]
  )

  const value = React.useMemo(
    () => ({
      tasks,
      getTask,
      updateTask,
      createTask,
      deleteTask,
      bulkUpdateStatus,
    }),
    [tasks, getTask, updateTask, createTask, deleteTask, bulkUpdateStatus]
  )

  return <TasksContext.Provider value={value}>{children}</TasksContext.Provider>
}

export function useTasks() {
  const context = React.useContext(TasksContext)
  if (!context) {
    throw new Error("useTasks must be used within a TasksProvider")
  }
  return context
}
