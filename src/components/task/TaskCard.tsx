import { CalendarDays, GripVertical } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import type { Task, TaskPriority } from "@/types/task"

interface TaskCardProps {
  task: Task
  isOverlay?: boolean
}

const priorityLabels: Record<TaskPriority, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
}

function formatDueDate(dueDate: string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(new Date(`${dueDate}T00:00:00`))
}

export function TaskCard({
  task,
  isOverlay = false,
}: TaskCardProps) {
  return (
    <Card
      className={[
        "border-border/70 bg-card transition",
        isOverlay
          ? "rotate-2 cursor-grabbing shadow-xl"
          : "cursor-grab hover:-translate-y-0.5 hover:border-border hover:shadow-md active:cursor-grabbing",
      ].join(" ")}
    >
      <CardContent className="space-y-4 p-4">
        <div className="flex items-start gap-3">
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
          <Badge variant="secondary">
            {priorityLabels[task.priority]}
          </Badge>

          {task.due_date && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <CalendarDays className="size-3.5" />
              {formatDueDate(task.due_date)}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}