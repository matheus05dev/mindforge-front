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

import { KanbanTask } from "@/lib/api/types"
export function UpcomingTasks({ tasks = [] }: { tasks?: KanbanTask[] }) {
  // Use tasks from props
  
  // Helper to determine status color based on column (heuristic)
  const getStatusColor = (task: KanbanTask) => {
     // Since we don't have column name here easily unless we fetch board, 
     // we can just use a default or maybe try to guess if we had column info.
     // For now, let's just make it neutral or based on position?
     // Actually, let's just use a generic style.
     return "bg-blue-500/10 text-blue-500 border-blue-500/20"
  }

  return (
    <div className="rounded-lg border border-border bg-card p-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="font-semibold">Tarefas Recentes</h3>
          <p className="text-sm text-muted-foreground">Suas tarefas no quadro Kanban</p>
        </div>
        <Badge variant="secondary" className="gap-1">
          <Clock className="h-3 w-3" />
          {tasks.length} ativa(s)
        </Badge>
      </div>
      <div className="space-y-3 max-h-[300px] overflow-y-auto">
        {tasks.length === 0 ? (
           <p className="text-sm text-muted-foreground text-center py-4">Nenhuma tarefa encontrada.</p>
        ) : (
        tasks.slice(0, 5).map((task) => (
          <div
            key={task.id}
            className={cn(
              "flex items-start gap-3 rounded-md border p-3 transition-colors hover:bg-accent/50 cursor-pointer border-border",
            )}
          >
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{task.title}</p>
              <p className="text-xs text-muted-foreground">{task.projectName || task.subjectName || "Sem projeto"}</p>
            </div>
            <div className="flex flex-col items-end gap-1">
               {/* Since we don't have priority/date, maybe show ID or generic icon */}
               <Badge variant="outline" className="text-[10px]">
                 #{task.id}
               </Badge>
            </div>
          </div>
        ))
        )}
      </div>
    </div>
  )
}
