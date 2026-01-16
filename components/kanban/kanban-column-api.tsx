"use client"

import type React from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { KanbanCard } from "./kanban-card"
import { cn } from "@/lib/utils"
import type { Task } from "@/lib/types"

interface KanbanColumnApiProps {
  id: string
  title: string
  tasks: Task[]
  onAddTask: () => void
  onEditTask: (task: Task) => void
  onDeleteTask: (taskId: string) => void
  onMoveTask?: (taskId: string, targetColumnId: string) => void
}

export function KanbanColumnApi({
  id,
  title,
  tasks,
  onAddTask,
  onEditTask,
  onDeleteTask,
}: KanbanColumnApiProps) {
  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData("taskId", taskId)
    e.dataTransfer.setData("sourceColumnId", id)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const taskId = e.dataTransfer.getData("taskId")
    const sourceColumnId = e.dataTransfer.getData("sourceColumnId")
    
    if (taskId && sourceColumnId !== id) {
      // A tarefa foi movida de outra coluna
      // O movimento será tratado pelo componente pai
    }
  }

  return (
    <div
      className="flex flex-col w-[320px] min-w-[320px] bg-zinc-900/50 rounded-lg border border-border"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {/* Cabeçalho da Coluna */}
      <div className="flex items-center justify-between p-3 border-b border-border">
        <div className="flex items-center gap-2">
          <h3 className="font-medium text-sm">{title}</h3>
          <span className="text-xs text-muted-foreground bg-zinc-800 px-2 py-0.5 rounded-full">
            {tasks.length}
          </span>
        </div>
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onAddTask}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {/* Lista de Cards */}
      <ScrollArea className="flex-1 p-2">
        <div className="space-y-2">
          {tasks.map((task) => (
            <div
              key={task.id}
              draggable
              onDragStart={(e) => handleDragStart(e, task.id)}
              className="cursor-move"
            >
              <div onDragStart={(e) => handleDragStart(e, task.id)}>
                <KanbanCard
                  task={task}
                  projectName={task.projectId ? `Projeto ${task.projectId}` : "Sem projeto"}
                  projectColor="#71717a"
                  onDragStart={handleDragStart}
                  onEdit={onEditTask}
                  onDelete={onDeleteTask}
                />
              </div>
            </div>
          ))}
          {tasks.length === 0 && (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <p className="text-sm text-muted-foreground">Nenhuma tarefa</p>
              <Button variant="ghost" size="sm" className="mt-2 text-muted-foreground" onClick={onAddTask}>
                <Plus className="h-4 w-4 mr-1" />
                Adicionar tarefa
              </Button>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}

