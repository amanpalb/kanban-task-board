import { useState, type ReactNode } from "react"
import {
  CheckCircle2,
  CircleAlert,
  ClipboardList,
  LoaderCircle,
  Search,
  TriangleAlert,
} from "lucide-react"

import { Board } from "@/components/board/Board"
import { CreateTaskDialog } from "@/components/task/CreateTaskDialog"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/hooks/useAuth"
import { useTasks } from "@/hooks/useTasks"

function App() {
  const [searchQuery, setSearchQuery] = useState("")

  const {
    user,
    isLoading: isAuthLoading,
    error: authError,
  } = useAuth()

  const {
    tasks,
    isLoading: areTasksLoading,
    error: tasksError,
    createTask,
    moveTask,
    updateTask,
    deleteTask,
  } = useTasks(Boolean(user))

  if (isAuthLoading || areTasksLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex items-center gap-3 text-muted-foreground">
          <LoaderCircle className="size-5 animate-spin" />
          Loading your workspace...
        </div>
      </main>
    )
  }

  const error = authError ?? tasksError

  if (error) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background p-6">
        <div className="max-w-md rounded-2xl border bg-card p-6 shadow-sm">
          <TriangleAlert className="mb-4 size-7 text-destructive" />

          <h1 className="text-xl font-semibold">
            Unable to load the board
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            {error}
          </p>
        </div>
      </main>
    )
  }

  const normalizedSearchQuery = searchQuery.trim().toLowerCase()

  const filteredTasks = normalizedSearchQuery
    ? tasks.filter((task) =>
        task.title.toLowerCase().includes(normalizedSearchQuery),
      )
    : tasks

  const completedTasks = tasks.filter(
    (task) => task.status === "done",
  ).length

  const activeTasks = tasks.length - completedTasks

  return (
    <main className="min-h-screen bg-background">
      <header className="border-b border-border/70 bg-background/95">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-3 px-4 py-4 sm:gap-6 sm:px-6 sm:py-5">
          <div className="flex items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <ClipboardList className="size-5" />
            </div>

            <div>
              <h1 className="text-xl font-semibold tracking-tight">
                Kanban Task Board
              </h1>

              <p className="hidden text-xs text-muted-foreground sm:block">
                Personal task workspace
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative hidden sm:block">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

              <Input
                type="search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search tasks..."
                aria-label="Search tasks by title"
                className="w-56 pl-9 lg:w-72"
              />
            </div>

            <CreateTaskDialog onCreateTask={createTask} />
          </div>
        </div>
      </header>

      <div className="border-b border-border/70 px-4 py-3 sm:hidden">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

          <Input
            type="search"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search tasks..."
            aria-label="Search tasks by title"
            className="pl-9"
          />
        </div>
      </div>

      <div className="mx-auto max-w-[1600px] space-y-8 px-4 py-6 sm:px-6 sm:py-8">
        <section>
          <p className="text-sm font-medium text-muted-foreground">
            Overview
          </p>

          <h2 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
            Keep your work moving
          </h2>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <StatCard
              title="Total tasks"
              value={tasks.length}
              icon={<ClipboardList className="size-5" />}
            />

            <StatCard
              title="Active"
              value={activeTasks}
              icon={<CircleAlert className="size-5" />}
            />

            <StatCard
              title="Completed"
              value={completedTasks}
              icon={<CheckCircle2 className="size-5" />}
            />
          </div>
        </section>

        <section>
          <div className="mb-4">
            <h2 className="text-lg font-semibold">
              Project board
            </h2>

            <p className="text-sm text-muted-foreground">
              {normalizedSearchQuery
                ? `Showing ${filteredTasks.length} of ${tasks.length} tasks.`
                : "Organize tasks across each stage of your workflow."}
            </p>

            <p className="mt-1 text-xs text-muted-foreground sm:hidden">
              Swipe horizontally to view each stage.
            </p>
          </div>

          <Board
            tasks={filteredTasks}
            onMoveTask={moveTask}
            onUpdateTask={updateTask}
            onDeleteTask={deleteTask}
          />
        </section>
      </div>
    </main>
  )
}

interface StatCardProps {
  title: string
  value: number
  icon: ReactNode
}

function StatCard({
  title,
  value,
  icon,
}: StatCardProps) {
  return (
    <div className="rounded-2xl border border-border/70 bg-card p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {title}
        </p>

        <div className="text-muted-foreground">
          {icon}
        </div>
      </div>

      <p className="mt-3 text-3xl font-semibold tracking-tight">
        {value}
      </p>
    </div>
  )
}

export default App