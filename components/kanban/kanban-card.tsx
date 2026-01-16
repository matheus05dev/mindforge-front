"use client"

import type React from "react"

import { Calendar, MoreHorizontal, Pencil, Trash2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import type { Task } from "@/lib/types"
import { PRIORITY_LABELS, PRIORITY_COLORS } from "@/lib/types"

interface KanbanCardProps {
  task: Task
  projectName: string
  projectColor: string
  onDragStart: (e: React.DragEvent, taskId: string) => void
  onEdit: (task: Task) => void
  onDelete: (taskId: string) => void
}

export function KanbanCard({ task, projectName, projectColor, onDragStart, onEdit, onDelete }: KanbanCardProps) {
  const formatDate = (dateString?: string) => {
    if (!dateString) return null
    const date = new Date(dateString)
    return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })
  }

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date()

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, task.id)}
      className="group rounded-lg border border-border bg-card p-3 cursor-grab active:cursor-grabbing hover:border-primary/30 transition-colors"
    >
      {/* Projeto */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full" style={{ backgroundColor: projectColor }} />
          <span className="text-xs text-muted-foreground">{projectName}</span>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <MoreHorizontal className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(task)}>
              <Pencil className="h-4 w-4 mr-2" />
              Editar
            </DropdownMenuItem>
            <DropdownMenuItem className="text-destructive" onClick={() => onDelete(task.id)}>
              <Trash2 className="h-4 w-4 mr-2" />
              Excluir
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Título */}
      <h4 className="text-sm font-medium mb-2 line-clamp-2">{task.title}</h4>

      {/* Descrição */}
      {task.description && <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{task.description}</p>}

      {/* Tags */}
      {task.tags && task.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {task.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="secondary" className="text-[10px] px-1.5 py-0 bg-zinc-800 text-zinc-400">
              {tag}
            </Badge>
          ))}
          {task.tags.length > 3 && (
            <Badge variant="secondary" className="text-[10px] px-1.5 py-0 bg-zinc-800 text-zinc-400">
              +{task.tags.length - 3}
            </Badge>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between">
        <Badge variant="outline" className={cn("text-[10px]", PRIORITY_COLORS[task.priority])}>
          {PRIORITY_LABELS[task.priority]}
        </Badge>
        {task.dueDate && (
          <div className={cn("flex items-center gap-1 text-xs", isOverdue ? "text-red-500" : "text-muted-foreground")}>
            <Calendar className="h-3 w-3" />
            <span>{formatDate(task.dueDate)}</span>
          </div>
        )}
      </div>
    </div>
  )
}
