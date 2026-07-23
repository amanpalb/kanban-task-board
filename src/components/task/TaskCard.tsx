import { CalendarDays } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import type { Task, TaskPriority } from "@/types/task"

interface TaskCardProps {
  task: Task
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

export function TaskCard({ task }: TaskCardProps) {
  return (
    <Card className="cursor-pointer border-border/70 bg-card transition hover:-translate-y-0.5 hover:border-border hover:shadow-md">
      <CardContent className="space-y-4 p-4">
        <div>
          <h3 className="font-medium leading-snug">{task.title}</h3>

          {task.description && (
            <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
              {task.description}
            </p>
          )}
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