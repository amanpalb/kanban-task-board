export const taskStatuses = [
  "todo",
  "in_progress",
  "in_review",
  "done",
] as const

export type TaskStatus = (typeof taskStatuses)[number]

export const taskPriorities = [
  "low",
  "medium",
  "high",
] as const

export type TaskPriority = (typeof taskPriorities)[number]

export const taskColors = [
  "gray",
  "blue",
  "green",
  "yellow",
  "orange",
  "red",
  "purple",
  "pink",
] as const

export type TaskColor = (typeof taskColors)[number]

export interface Task {
  id: string
  title: string
  description: string | null
  status: TaskStatus
  priority: TaskPriority
  color: TaskColor
  due_date: string | null
  user_id: string
  created_at: string
  updated_at: string
}

export interface CreateTaskInput {
  title: string
  description?: string | null
  status?: TaskStatus
  priority?: TaskPriority
  color?: TaskColor
  due_date?: string | null
}

export interface UpdateTaskInput {
  title?: string
  description?: string | null
  status?: TaskStatus
  priority?: TaskPriority
  color?: TaskColor
  due_date?: string | null
}