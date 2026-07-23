import { useDroppable } from "@dnd-kit/core"
import { Inbox } from "lucide-react"

import type { BoardColumnDefinition } from "@/components/board/boardConfig"
import { DraggableTaskCard } from "@/components/task/DraggableTaskCard"
import type { Task } from "@/types/task"

interface BoardColumnProps {
  column: BoardColumnDefinition
  tasks: Task[]
}

export function BoardColumn({
  column,
  tasks,
}: BoardColumnProps) {
  const { isOver, setNodeRef } = useDroppable({
    id: column.id,
    data: {
      status: column.id,
    },
  })

  return (
    <section
      ref={setNodeRef}
      className={[
        "flex min-h-[32rem] min-w-[18rem] flex-1 flex-col rounded-2xl border transition-colors",
        isOver
          ? "border-primary/60 bg-primary/5"
          : "border-border/60 bg-muted/30",
      ].join(" ")}
    >
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
            <DraggableTaskCard
              key={task.id}
              task={task}
            />
          ))
        ) : (
          <div
            className={[
              "flex flex-1 flex-col items-center justify-center rounded-xl border border-dashed p-6 text-center transition-colors",
              isOver
                ? "border-primary/60 bg-primary/5"
                : "border-border/70",
            ].join(" ")}
          >
            <Inbox
              className={[
                "size-6",
                isOver
                  ? "text-primary"
                  : "text-muted-foreground",
              ].join(" ")}
            />

            <p className="mt-3 text-sm font-medium">
              {isOver ? "Drop task here" : "No tasks here"}
            </p>

            <p className="mt-1 max-w-40 text-xs leading-relaxed text-muted-foreground">
              {isOver
                ? `Move this task into ${column.title}.`
                : "Tasks moved into this stage will appear here."}
            </p>
          </div>
        )}
      </div>
    </section>
  )
}