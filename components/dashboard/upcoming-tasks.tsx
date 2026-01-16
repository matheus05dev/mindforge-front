"use client"

import { Clock, AlertCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface Task {
  id: string
  title: string
  project: string
  dueDate: string
  priority: "alta" | "media" | "baixa"
  isOverdue?: boolean
}

const tasks: Task[] = [
  {
    id: "1",
    title: "Completar módulo de autenticação",
    project: "API Backend",
    dueDate: "Hoje",
    priority: "alta",
  },
  {
    id: "2",
    title: "Revisar PR #42",
    project: "E-commerce",
    dueDate: "Amanhã",
    priority: "media",
  },
  {
    id: "3",
    title: "Design do schema do banco",
    project: "Dashboard Analytics",
    dueDate: "Em 2 dias",
    priority: "baixa",
  },
  {
    id: "4",
    title: "Documentação da API",
    project: "API Backend",
    dueDate: "Ontem",
    priority: "alta",
    isOverdue: true,
  },
]

const priorityColors = {
  alta: "bg-red-500/10 text-red-500 border-red-500/20",
  media: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  baixa: "bg-green-500/10 text-green-500 border-green-500/20",
}

const priorityLabels = {
  alta: "Alta",
  media: "Média",
  baixa: "Baixa",
}

export function UpcomingTasks() {
  return (
    <div className="rounded-lg border border-border bg-card p-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="font-semibold">Próximas Tarefas</h3>
          <p className="text-sm text-muted-foreground">Tarefas que precisam de atenção</p>
        </div>
        <Badge variant="secondary" className="gap-1">
          <AlertCircle className="h-3 w-3" />
          {tasks.filter((task) => task.isOverdue).length} atrasada(s)
        </Badge>
      </div>
      <div className="space-y-3">
        {tasks.map((task) => (
          <div
            key={task.id}
            className={cn(
              "flex items-start gap-3 rounded-md border p-3 transition-colors hover:bg-accent/50 cursor-pointer",
              task.isOverdue ? "border-red-500/30 bg-red-500/5" : "border-border",
            )}
          >
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{task.title}</p>
              <p className="text-xs text-muted-foreground">{task.project}</p>
            </div>
            <div className="flex flex-col items-end gap-1">
              <Badge variant="outline" className={cn("text-[10px]", priorityColors[task.priority])}>
                {priorityLabels[task.priority]}
              </Badge>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                {task.isOverdue ? <AlertCircle className="h-3 w-3 text-red-500" /> : <Clock className="h-3 w-3" />}
                <span className={task.isOverdue ? "text-red-500" : ""}>{task.dueDate}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
