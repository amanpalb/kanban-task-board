import { useState } from "react"
import {
  closestCorners,
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core"
import { createPortal } from "react-dom"
import { TriangleAlert } from "lucide-react"

import { BoardColumn } from "@/components/board/BoardColumn"
import { boardColumns } from "@/components/board/boardConfig"
import { EditTaskDialog } from "@/components/task/EditTaskDialog"
import { TaskCard } from "@/components/task/TaskCard"
import type {
  Task,
  TaskStatus,
  UpdateTaskInput,
} from "@/types/task"

interface BoardProps {
  tasks: Task[]
  onMoveTask: (
    taskId: string,
    status: TaskStatus,
  ) => Promise<unknown>
  onUpdateTask: (
    taskId: string,
    input: UpdateTaskInput,
  ) => Promise<unknown>
  onDeleteTask: (taskId: string) => Promise<void>
}

export function Board({
  tasks,
  onMoveTask,
  onUpdateTask,
  onDeleteTask,
}: BoardProps) {
  const [activeTask, setActiveTask] = useState<Task | null>(null)
  const [selectedTaskId, setSelectedTaskId] =
    useState<string | null>(null)
  const [moveError, setMoveError] = useState<string | null>(null)

  const selectedTask =
    tasks.find((task) => task.id === selectedTaskId) ?? null

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 6,
      },
    }),
    useSensor(KeyboardSensor),
  )

  function handleDragStart(event: DragStartEvent) {
    setMoveError(null)

    const task = tasks.find(
      (currentTask) => currentTask.id === event.active.id,
    )

    setActiveTask(task ?? null)
  }

  async function handleDragEnd(event: DragEndEvent) {
    setActiveTask(null)

    const { active, over } = event

    if (!over) {
      return
    }

    const task = tasks.find(
      (currentTask) => currentTask.id === active.id,
    )

    if (!task) {
      return
    }

    const destinationStatus = over.id as TaskStatus

    const isValidColumn = boardColumns.some(
      (column) => column.id === destinationStatus,
    )

    if (!isValidColumn || task.status === destinationStatus) {
      return
    }

    try {
      await onMoveTask(task.id, destinationStatus)
    } catch (caughtError) {
      setMoveError(
        caughtError instanceof Error
          ? caughtError.message
          : "Unable to move the task.",
      )
    }
  }

  function handleDragCancel() {
    setActiveTask(null)
  }

  return (
    <div className="space-y-3">
      {moveError && (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive"
        >
          <TriangleAlert className="mt-0.5 size-4 shrink-0" />

          <div>
            <p className="font-medium">
              The task could not be moved
            </p>

            <p className="mt-0.5 opacity-90">
              {moveError}
            </p>
          </div>
        </div>
      )}

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={(event) => {
          void handleDragEnd(event)
        }}
        onDragCancel={handleDragCancel}
      >
        <div className="-mx-4 overflow-x-auto px-4 pb-4 sm:mx-0 sm:px-0">
          <div className="flex min-w-max snap-x snap-mandatory gap-4">
            {boardColumns.map((column) => {
              const columnTasks = tasks.filter(
                (task) => task.status === column.id,
              )

              return (
                <BoardColumn
                  key={column.id}
                  column={column}
                  tasks={columnTasks}
                  onTaskSelect={(task) =>
                    setSelectedTaskId(task.id)
                  }
                />
              )
            })}
          </div>
        </div>

        {createPortal(
          <DragOverlay>
            {activeTask ? (
              <div className="w-[19rem]">
                <TaskCard
                  task={activeTask}
                  isOverlay
                />
              </div>
            ) : null}
          </DragOverlay>,
          document.body,
        )}
      </DndContext>

      <EditTaskDialog
        task={selectedTask}
        open={Boolean(selectedTask)}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedTaskId(null)
          }
        }}
        onUpdateTask={onUpdateTask}
        onDeleteTask={onDeleteTask}
      />
    </div>
  )
}