import { supabase } from "@/lib/supabase"
import type {
  CreateTaskInput,
  Task,
  TaskStatus,
  UpdateTaskInput,
} from "@/types/task"

async function requireUserId(): Promise<string> {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error) {
    throw new Error(error.message)
  }

  if (!user) {
    throw new Error("No authenticated guest session was found.")
  }

  return user.id
}

export async function getTasks(): Promise<Task[]> {
  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    throw new Error(error.message)
  }

  return data as Task[]
}

export async function createTask(
  input: CreateTaskInput,
): Promise<Task> {
  const userId = await requireUserId()

  const { data, error } = await supabase
    .from("tasks")
    .insert({
      title: input.title.trim(),
      description: input.description?.trim() || null,
      status: input.status ?? "todo",
      priority: input.priority ?? "medium",
      color: input.color ?? "gray",
      due_date: input.due_date ?? null,
      user_id: userId,
    })
    .select()
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return data as Task
}

export async function updateTask(
  taskId: string,
  input: UpdateTaskInput,
): Promise<Task> {
  const { data, error } = await supabase
    .from("tasks")
    .update(input)
    .eq("id", taskId)
    .select()
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return data as Task
}

export async function moveTask(
  taskId: string,
  status: TaskStatus,
): Promise<Task> {
  return updateTask(taskId, { status })
}

export async function deleteTask(taskId: string): Promise<void> {
  const { error } = await supabase
    .from("tasks")
    .delete()
    .eq("id", taskId)

  if (error) {
    throw new Error(error.message)
  }
}