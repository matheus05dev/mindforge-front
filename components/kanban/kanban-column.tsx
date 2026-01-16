"use client"

import type React from "react"

import { Plus, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { KanbanCard } from "./kanban-card"
import { cn } from "@/lib/utils"
import type { Task } from "@/lib/types"

interface KanbanColumnProps {
  id: Task["status"]
  title: string
  color: string
  tasks: Task[]
  onDragStart: (e: React.DragEvent, taskId: string) => void
  onDragOver: (e: React.DragEvent) => void
  onDrop: (e: React.DragEvent, status: Task["status"]) => void
  onAddTask: (status: Task["status"]) => void
  onEditTask: (task: Task) => void
  onDeleteTask: (taskId: string) => void
  getProjectName: (projectId: string) => string
  getProjectColor: (projectId: string) => string
}

export function KanbanColumn({
  id,
  title,
  color,
  tasks,
  onDragStart,
  onDragOver,
  onDrop,
  onAddTask,
  onEditTask,
  onDeleteTask,
  getProjectName,
  getProjectColor,
}: KanbanColumnProps) {
  return (
    <div
      className="flex flex-col w-[320px] min-w-[320px] bg-zinc-900/50 rounded-lg border border-border"
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, id)}
    >
      {/* Cabeçalho da Coluna */}
      <div className="flex items-center justify-between p-3 border-b border-border">
        <div className="flex items-center gap-2">
          <div className={cn("h-2 w-2 rounded-full", color)} />
          <h3 className="font-medium text-sm">{title}</h3>
          <span className="text-xs text-muted-foreground bg-zinc-800 px-2 py-0.5 rounded-full">{tasks.length}</span>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onAddTask(id)}>
            <Plus className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Lista de Cards */}
      <ScrollArea className="flex-1 p-2">
        <div className="space-y-2">
          {tasks.map((task) => (
            <KanbanCard
              key={task.id}
              task={task}
              projectName={getProjectName(task.projectId)}
              projectColor={getProjectColor(task.projectId)}
              onDragStart={onDragStart}
              onEdit={onEditTask}
              onDelete={onDeleteTask}
            />
          ))}
          {tasks.length === 0 && (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <p className="text-sm text-muted-foreground">Nenhuma tarefa</p>
              <Button variant="ghost" size="sm" className="mt-2 text-muted-foreground" onClick={() => onAddTask(id)}>
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
