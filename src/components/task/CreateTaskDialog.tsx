import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { LoaderCircle, Plus } from "lucide-react"
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
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { CreateTaskInput, TaskPriority } from "@/types/task"

const createTaskSchema = z.object({
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

type CreateTaskFormValues = z.infer<typeof createTaskSchema>

interface CreateTaskDialogProps {
  onCreateTask: (input: CreateTaskInput) => Promise<unknown>
}

export function CreateTaskDialog({
  onCreateTask,
}: CreateTaskDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateTaskFormValues>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      title: "",
      description: "",
      priority: "medium",
      dueDate: "",
    },
  })

  async function handleCreateTask(values: CreateTaskFormValues) {
    setSubmitError(null)

    try {
      await onCreateTask({
        title: values.title,
        description: values.description || null,
        priority: values.priority as TaskPriority,
        due_date: values.dueDate || null,
        status: "todo",
      })

      reset()
      setIsOpen(false)
    } catch (caughtError) {
      setSubmitError(
        caughtError instanceof Error
          ? caughtError.message
          : "Unable to create the task.",
      )
    }
  }

  function handleOpenChange(open: boolean) {
    if (isSubmitting) {
      return
    }

    setIsOpen(open)

    if (!open) {
      reset()
      setSubmitError(null)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger
        render={
          <Button>
            <Plus className="size-4" />
            New task
          </Button>
        }
      />

      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <form
          className="space-y-6"
          onSubmit={handleSubmit(handleCreateTask)}
        >
          <DialogHeader>
            <DialogTitle>Create a new task</DialogTitle>

            <DialogDescription>
              Add a task to the To Do column. You can move it through
              the workflow afterward.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="task-title">
                Title <span className="text-destructive">*</span>
              </Label>

              <Input
                id="task-title"
                placeholder="What needs to be done?"
                autoFocus
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
              <Label htmlFor="task-description">
                Description
              </Label>

              <Textarea
                id="task-description"
                placeholder="Add useful details or context..."
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
                <Label htmlFor="task-priority">
                  Priority
                </Label>

                <select
                  id="task-priority"
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
                <Label htmlFor="task-due-date">
                  Due date
                </Label>

                <Input
                  id="task-due-date"
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

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              disabled={isSubmitting}
              onClick={() => handleOpenChange(false)}
            >
              Cancel
            </Button>

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <LoaderCircle className="size-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="size-4" />
                  Create task
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}