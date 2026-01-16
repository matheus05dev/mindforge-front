"use client"

import { useState } from "react"
import { AppShell } from "@/components/layout/app-shell"
import { useStore } from "@/lib/store"
import { KanbanBoard } from "@/components/kanban/kanban-board"
import { Button } from "@/components/ui/button"
import { Plus, Filter, SlidersHorizontal } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function KanbanPage() {
  const { projects } = useStore()
  const [selectedProjectId, setSelectedProjectId] = useState<string>("all")

  return (
    <AppShell>
      <div className="flex flex-col h-[calc(100vh-8rem)]">
        {/* Cabeçalho */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Kanban</h1>
            <p className="text-muted-foreground">Gerencie suas tarefas visualmente</p>
          </div>
          <div className="flex items-center gap-3">
            <Select value={selectedProjectId} onValueChange={setSelectedProjectId}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Selecionar projeto" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os projetos</SelectItem>
                {projects.map((project) => (
                  <SelectItem key={project.id} value={project.id}>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full" style={{ backgroundColor: project.color }} />
                      {project.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <SlidersHorizontal className="h-4 w-4" />
            </Button>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Nova Tarefa
            </Button>
          </div>
        </div>

        {/* Quadro Kanban */}
        <KanbanBoard projectId={selectedProjectId === "all" ? undefined : selectedProjectId} />
      </div>
    </AppShell>
  )
}
