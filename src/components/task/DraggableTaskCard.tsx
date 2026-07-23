import { useDraggable } from "@dnd-kit/core"
import { CSS } from "@dnd-kit/utilities"

import { TaskCard } from "@/components/task/TaskCard"
import type { Task } from "@/types/task"

interface DraggableTaskCardProps {
  task: Task
  onSelect: (task: Task) => void
}

export function DraggableTaskCard({
  task,
  onSelect,
}: DraggableTaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
  } = useDraggable({
    id: task.id,
    data: {
      task,
    },
  })

  const style = {
    transform: CSS.Translate.toString(transform),
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={[
        "touch-pan-y",
        isDragging ? "opacity-30" : "",
      ].join(" ")}
      onClick={() => onSelect(task)}
      {...listeners}
      {...attributes}
    >
      <TaskCard task={task} />
    </div>
  )
}