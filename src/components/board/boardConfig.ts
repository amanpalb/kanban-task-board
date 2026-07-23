import type { TaskStatus } from "@/types/task"

export interface BoardColumnDefinition {
  id: TaskStatus
  title: string
  description: string
}

export const boardColumns: BoardColumnDefinition[] = [
  {
    id: "todo",
    title: "To Do",
    description: "Tasks waiting to be started",
  },
  {
    id: "in_progress",
    title: "In Progress",
    description: "Work currently underway",
  },
  {
    id: "in_review",
    title: "In Review",
    description: "Tasks awaiting feedback",
  },
  {
    id: "done",
    title: "Done",
    description: "Completed work",
  },
]