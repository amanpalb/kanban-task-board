import {
  CheckCircle2,
  CircleAlert,
  ClipboardList,
  LoaderCircle,
  TriangleAlert,
} from "lucide-react"

import { Board } from "@/components/board/Board"
import { useAuth } from "@/hooks/useAuth"
import { useTasks } from "@/hooks/useTasks"
import { CreateTaskDialog } from "@/components/task/CreateTaskDialog"

function App() {
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

  const completedTasks = tasks.filter(
    (task) => task.status === "done",
  ).length

  const activeTasks = tasks.length - completedTasks

  return (
    <main className="min-h-screen bg-background">
      <header className="border-b border-border/70 bg-background/95">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-6 px-6 py-5">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <ClipboardList className="size-5" />
              </div>

              <div>
                <h1 className="text-xl font-semibold tracking-tight">
                  Momentum
                </h1>
                <p className="text-xs text-muted-foreground">
                  Personal task workspace
                </p>
              </div>
            </div>
          </div>

          <CreateTaskDialog onCreateTask={createTask} />
        </div>
      </header>

      <div className="mx-auto max-w-[1600px] space-y-8 px-6 py-8">
        <section>
          <p className="text-sm font-medium text-muted-foreground">
            Overview
          </p>

          <h2 className="mt-1 text-3xl font-semibold tracking-tight">
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
              Organize tasks across each stage of your workflow.
            </p>
          </div>

          <Board
            tasks={tasks}
            onMoveTask={moveTask}
          />
        </section>
      </div>
    </main>
  )
}

interface StatCardProps {
  title: string
  value: number
  icon: React.ReactNode
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