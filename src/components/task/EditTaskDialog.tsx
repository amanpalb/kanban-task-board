import { useEffect, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { LoaderCircle, Save, Trash2 } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type {
  Task,
  TaskPriority,
  UpdateTaskInput,
} from "@/types/task"

const editTaskSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "A task title is required.")
    .max(120, "The title must be 120 characters or fewer."),
  description: z
    .string()
    .trim()
    .max(500, "The description must be 500 characters or fewer."),
  priority: z.enum(["low", "medium", "high"]),
  dueDate: z.string(),
})

type EditTaskFormValues = z.infer<typeof editTaskSchema>

interface EditTaskDialogProps {
  task: Task | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpdateTask: (
    taskId: string,
    input: UpdateTaskInput,
  ) => Promise<unknown>
  onDeleteTask: (taskId: string) => Promise<void>
}

export function EditTaskDialog({
  task,
  open,
  onOpenChange,
  onUpdateTask,
  onDeleteTask,
}: EditTaskDialogProps) {
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EditTaskFormValues>({
    resolver: zodResolver(editTaskSchema),
    defaultValues: {
      title: "",
      description: "",
      priority: "medium",
      dueDate: "",
    },
  })

  useEffect(() => {
    if (!task) {
      return
    }

    reset({
      title: task.title,
      description: task.description ?? "",
      priority: task.priority,
      dueDate: task.due_date ?? "",
    })

    setSubmitError(null)
    setIsConfirmingDelete(false)
  }, [task, reset])

  async function handleUpdate(values: EditTaskFormValues) {
    if (!task) {
      return
    }

    setSubmitError(null)

    try {
      await onUpdateTask(task.id, {
        title: values.title,
        description: values.description || null,
        priority: values.priority as TaskPriority,
        due_date: values.dueDate || null,
      })

      onOpenChange(false)
    } catch (caughtError) {
      setSubmitError(
        caughtError instanceof Error
          ? caughtError.message
          : "Unable to update the task.",
      )
    }
  }

  async function handleDelete() {
    if (!task) {
      return
    }

    if (!isConfirmingDelete) {
      setIsConfirmingDelete(true)
      return
    }

    setSubmitError(null)
    setIsDeleting(true)

    try {
      await onDeleteTask(task.id)
      onOpenChange(false)
    } catch (caughtError) {
      setSubmitError(
        caughtError instanceof Error
          ? caughtError.message
          : "Unable to delete the task.",
      )
    } finally {
      setIsDeleting(false)
      setIsConfirmingDelete(false)
    }
  }

  function handleDialogChange(nextOpen: boolean) {
    if (isSubmitting || isDeleting) {
      return
    }

    if (!nextOpen) {
      setSubmitError(null)
      setIsConfirmingDelete(false)
    }

    onOpenChange(nextOpen)
  }

  return (
    <Dialog open={open} onOpenChange={handleDialogChange}>
      <DialogContent className="sm:max-w-lg">
        <form
          className="space-y-6"
          onSubmit={handleSubmit(handleUpdate)}
        >
          <DialogHeader>
            <DialogTitle>Edit task</DialogTitle>

            <DialogDescription>
              Update this task’s details or remove it from the board.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="edit-task-title">
                Title <span className="text-destructive">*</span>
              </Label>

              <Input
                id="edit-task-title"
                aria-invalid={Boolean(errors.title)}
                {...register("title")}
              />

              {errors.title && (
                <p className="text-sm text-destructive">
                  {errors.title.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-task-description">
                Description
              </Label>

              <Textarea
                id="edit-task-description"
                className="min-h-28 resize-none"
                aria-invalid={Boolean(errors.description)}
                {...register("description")}
              />

              <div className="flex justify-between gap-4">
                {errors.description ? (
                  <p className="text-sm text-destructive">
                    {errors.description.message}
                  </p>
                ) : (
                  <span />
                )}

                <p className="text-xs text-muted-foreground">
                  Maximum 500 characters
                </p>
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="edit-task-priority">
                  Priority
                </Label>

                <select
                  id="edit-task-priority"
                  className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm outline-none transition-colors focus:border-ring focus:ring-2 focus:ring-ring/30"
                  {...register("priority")}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>

                {errors.priority && (
                  <p className="text-sm text-destructive">
                    {errors.priority.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-task-due-date">
                  Due date
                </Label>

                <Input
                  id="edit-task-due-date"
                  type="date"
                  aria-invalid={Boolean(errors.dueDate)}
                  {...register("dueDate")}
                />

                {errors.dueDate && (
                  <p className="text-sm text-destructive">
                    {errors.dueDate.message}
                  </p>
                )}
              </div>
            </div>

            {submitError && (
              <div
                role="alert"
                className="rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive"
              >
                {submitError}
              </div>
            )}
          </div>

          <DialogFooter className="gap-2 sm:justify-between">
            <Button
              type="button"
              variant="destructive"
              disabled={isSubmitting || isDeleting}
              onClick={() => {
                void handleDelete()
              }}
            >
              {isDeleting ? (
                <>
                  <LoaderCircle className="size-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="size-4" />
                  {isConfirmingDelete
                    ? "Confirm delete"
                    : "Delete task"}
                </>
              )}
            </Button>

            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                disabled={isSubmitting || isDeleting}
                onClick={() => handleDialogChange(false)}
              >
                Cancel
              </Button>

              <Button
                type="submit"
                disabled={isSubmitting || isDeleting}
              >
                {isSubmitting ? (
                  <>
                    <LoaderCircle className="size-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="size-4" />
                    Save changes
                  </>
                )}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}