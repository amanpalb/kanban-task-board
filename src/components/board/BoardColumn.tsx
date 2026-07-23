import { Inbox } from "lucide-react"

import { TaskCard } from "@/components/task/TaskCard"
import type { BoardColumnDefinition } from "@/components/board/boardConfig"
import type { Task } from "@/types/task"

interface BoardColumnProps {
  column: BoardColumnDefinition
  tasks: Task[]
}

export function BoardColumn({
  column,
  tasks,
}: BoardColumnProps) {
  return (
    <section className="flex min-h-[32rem] min-w-[18rem] flex-1 flex-col rounded-2xl border border-border/60 bg-muted/30">
      <header className="border-b border-border/60 px-4 py-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-semibold">{column.title}</h2>

          <span className="flex size-6 items-center justify-center rounded-full bg-background text-xs font-medium text-muted-foreground">
            {tasks.length}
          </span>
        </div>

        <p className="mt-1 text-xs text-muted-foreground">
          {column.description}
        </p>
      </header>

      <div className="flex flex-1 flex-col gap-3 p-3">
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center rounded-xl border border-dashed border-border/70 p-6 text-center">
            <Inbox className="size-6 text-muted-foreground" />

            <p className="mt-3 text-sm font-medium">
              No tasks here
            </p>

            <p className="mt-1 max-w-40 text-xs leading-relaxed text-muted-foreground">
              Tasks moved into this stage will appear here.
            </p>
          </div>
        )}
      </div>
    </section>
  )
}