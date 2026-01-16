"use client"

import { AppShell } from "@/components/layout/app-shell"
import { KanbanBoardGeneral } from "@/components/kanban/kanban-board-general"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export default function KanbanGeneralPage() {
  return (
    <AppShell>
      <div className="flex flex-col h-[calc(100vh-8rem)]">
        {/* Cabeçalho */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Kanban Geral</h1>
            <p className="text-muted-foreground">Gerencie todas as suas tarefas em um único quadro.</p>
          </div>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Nova Tarefa
          </Button>
        </div>

        {/* Quadro Kanban */}
        <KanbanBoardGeneral />
      </div>
    </AppShell>
  )
}

