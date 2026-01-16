"use client";

import { useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { KanbanBoardGeneral } from "@/components/kanban/kanban-board-general";
import { ColumnModal } from "@/components/kanban/column-modal";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function KanbanGeneralPage() {
  const [isColumnModalOpen, setIsColumnModalOpen] = useState(false);

  const handleSaveColumn = (columnData: { title: string; color: string }) => {
    // Este handler é chamado quando o modal salva uma coluna
    // A lógica de adicionar coluna fica no KanbanBoardGeneral
    setIsColumnModalOpen(false);
  };

  return (
    <AppShell>
      <div className="flex flex-col h-[calc(100vh-8rem)]">
        {/* Cabeçalho */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              Kanban Geral
            </h1>
            <p className="text-muted-foreground">
              Gerencie todas as suas tarefas em um único quadro.
            </p>
          </div>
          <Button className="gap-2" onClick={() => setIsColumnModalOpen(true)}>
            <Plus className="h-4 w-4" />
            Nova Coluna
          </Button>
        </div>

        {/* Quadro Kanban */}
        <KanbanBoardGeneral />

        {/* Modal de Coluna */}
        <ColumnModal
          open={isColumnModalOpen}
          onOpenChange={setIsColumnModalOpen}
          onSave={handleSaveColumn}
        />
      </div>
    </AppShell>
  );
}
