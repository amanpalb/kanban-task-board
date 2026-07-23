import { BoardColumn } from "@/components/board/BoardColumn"
import { boardColumns } from "@/components/board/boardConfig"
import type { Task } from "@/types/task"

interface BoardProps {
  tasks: Task[]
}

export function Board({ tasks }: BoardProps) {
  return (
    <div className="overflow-x-auto pb-4">
      <div className="flex min-w-max gap-4">
        {boardColumns.map((column) => {
          const columnTasks = tasks.filter(
            (task) => task.status === column.id,
          )

          return (
            <BoardColumn
              key={column.id}
              column={column}
              tasks={columnTasks}
            />
          )
        })}
      </div>
    </div>
  )
}