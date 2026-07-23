import { CSS } from "@dnd-kit/utilities"
import { useDraggable } from "@dnd-kit/core"

import { TaskCard } from "@/components/task/TaskCard"
import type { Task } from "@/types/task"

interface DraggableTaskCardProps {
  task: Task
}

export function DraggableTaskCard({
  task,
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
      className={isDragging ? "opacity-30" : undefined}
      {...listeners}
      {...attributes}
    >
      <TaskCard task={task} />
    </div>
  )
}