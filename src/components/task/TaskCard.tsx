import { AlertTriangle, CalendarDays, GripVertical } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import type {
  Task,
  TaskColor,
  TaskPriority,
} from "@/types/task"

interface TaskCardProps {
  task: Task
  isOverlay?: boolean
}

const priorityLabels: Record<TaskPriority, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
}

const taskAccentClasses: Record<TaskColor, string> = {
  gray: "border-l-slate-400",
  blue: "border-l-blue-500",
  green: "border-l-emerald-500",
  yellow: "border-l-yellow-400",
  orange: "border-l-orange-500",
  red: "border-l-red-500",
  purple: "border-l-violet-500",
  pink: "border-l-pink-500",
}

const taskDotClasses: Record<TaskColor, string> = {
  gray: "bg-slate-400",
  blue: "bg-blue-500",
  green: "bg-emerald-500",
  yellow: "bg-yellow-400",
  orange: "bg-orange-500",
  red: "bg-red-500",
  purple: "bg-violet-500",
  pink: "bg-pink-500",
}

const priorityBadgeClasses: Record<TaskPriority, string> = {
  low: "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/70 dark:bg-emerald-950/40 dark:text-emerald-300",
  medium:
    "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/70 dark:bg-amber-950/40 dark:text-amber-300",
  high:
    "border-red-200 bg-red-50 text-red-700 dark:border-red-900/70 dark:bg-red-950/40 dark:text-red-300",
}

function formatDueDate(dueDate: string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(new Date(`${dueDate}T00:00:00`))
}

function isTaskOverdue(task: Task): boolean {
  if (!task.due_date) {
    return false
  }

  if (task.status === "done") {
    return false
  }

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const dueDate = new Date(`${task.due_date}T00:00:00`)

  return dueDate < today
}

export function TaskCard({
  task,
  isOverlay = false,
}: TaskCardProps) {
  const taskColor = task.color ?? "gray"
  const overdue = isTaskOverdue(task)

  return (
    <Card
      className={[
        "overflow-hidden border-border/70 border-l-4 bg-card transition duration-200",
        taskAccentClasses[taskColor],
        isOverlay
          ? "rotate-2 cursor-grabbing shadow-xl"
          : "cursor-grab hover:-translate-y-0.5 hover:border-border hover:shadow-md active:cursor-grabbing",
      ].join(" ")}
    >
      <CardContent className="space-y-4 p-4">
        <div className="flex items-start gap-3">
          <div
            className={[
              "mt-1.5 size-2.5 shrink-0 rounded-full",
              taskDotClasses[taskColor],
            ].join(" ")}
            aria-hidden="true"
          />

          <div className="min-w-0 flex-1">
            <h3 className="font-medium leading-snug">
              {task.title}
            </h3>

            {task.description && (
              <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                {task.description}
              </p>
            )}
          </div>

          <GripVertical className="mt-0.5 size-4 shrink-0 text-muted-foreground/60" />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Badge
            variant="outline"
            className={priorityBadgeClasses[task.priority]}
          >
            {priorityLabels[task.priority]}
          </Badge>

          {overdue && (
            <Badge
              variant="destructive"
              className="gap-1"
            >
              <AlertTriangle className="size-3" />
              Overdue
            </Badge>
          )}

          {task.due_date && (
            <div
              className={[
                "flex items-center gap-1 text-xs",
                overdue
                  ? "font-medium text-red-600 dark:text-red-400"
                  : "text-muted-foreground",
              ].join(" ")}
            >
              <CalendarDays className="size-3.5" />
              {formatDueDate(task.due_date)}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}