import { useCallback, useEffect, useState } from "react"

import {
  createTask as createTaskRequest,
  deleteTask as deleteTaskRequest,
  getTasks,
  moveTask as moveTaskRequest,
  updateTask as updateTaskRequest,
} from "@/services/taskService"
import type {
  CreateTaskInput,
  Task,
  TaskStatus,
  UpdateTaskInput,
} from "@/types/task"

export function useTasks(enabled = true) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(enabled)
  const [error, setError] = useState<string | null>(null)

  const loadTasks = useCallback(async () => {
    if (!enabled) {
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const loadedTasks = await getTasks()
      setTasks(loadedTasks)
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Unable to load tasks.",
      )
    } finally {
      setIsLoading(false)
    }
  }, [enabled])

  useEffect(() => {
    void loadTasks()
  }, [loadTasks])

  async function createTask(input: CreateTaskInput) {
    const createdTask = await createTaskRequest(input)
    setTasks((currentTasks) => [createdTask, ...currentTasks])
    return createdTask
  }

  async function updateTask(taskId: string, input: UpdateTaskInput) {
    const updatedTask = await updateTaskRequest(taskId, input)

    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === taskId ? updatedTask : task,
      ),
    )

    return updatedTask
  }

  async function moveTask(taskId: string, status: TaskStatus) {
    const previousTasks = tasks

    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === taskId ? { ...task, status } : task,
      ),
    )

    try {
      const updatedTask = await moveTaskRequest(taskId, status)

      setTasks((currentTasks) =>
        currentTasks.map((task) =>
          task.id === taskId ? updatedTask : task,
        ),
      )

      return updatedTask
    } catch (caughtError) {
      setTasks(previousTasks)
      throw caughtError
    }
  }

  async function deleteTask(taskId: string) {
    await deleteTaskRequest(taskId)

    setTasks((currentTasks) =>
      currentTasks.filter((task) => task.id !== taskId),
    )
  }

  return {
    tasks,
    isLoading,
    error,
    reloadTasks: loadTasks,
    createTask,
    updateTask,
    moveTask,
    deleteTask,
  }
}