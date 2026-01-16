"use client";

import { useState, useEffect, useCallback } from "react";
import { useApi } from "@/lib/hooks/use-api";
import { kanbanService } from "@/lib/api";
import { KanbanColumnApi } from "./kanban-column-api";
import { TaskModal } from "./task-modal";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import type {
  KanbanColumn as KanbanColumnType,
  KanbanTask,
} from "@/lib/api/types";
import type { Task } from "@/lib/types";

// Mock de colunas para testes
const mockColumns: KanbanColumnType[] = [
  {
    id: 1,
    name: "Backlog",
    position: 0,
    tasks: [
      {
        id: 1,
        title: "Implementar autenticação",
        description: "Adicionar sistema de login e autenticação",
        columnId: 1,
        position: 0,
        projectId: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 2,
        title: "Criar API REST",
        description: "Desenvolver endpoints da API",
        columnId: 1,
        position: 1,
        projectId: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 2,
    name: "A Fazer",
    position: 1,
    tasks: [
      {
        id: 3,
        title: "Validação de formulários",
        description: "Implementar validações",
        columnId: 2,
        position: 0,
        projectId: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 3,
    name: "Em Progresso",
    position: 2,
    tasks: [
      {
        id: 4,
        title: "Testes unitários",
        description: "Escrever testes para os componentes",
        columnId: 3,
        position: 0,
        projectId: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 4,
    name: "Concluído",
    position: 3,
    tasks: [
      {
        id: 5,
        title: "Setup do projeto",
        description: "Configurar ambiente de desenvolvimento",
        columnId: 4,
        position: 0,
        projectId: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export function KanbanBoardGeneral() {
  const {
    data: columnsData,
    loading,
    error,
    execute,
  } = useApi<KanbanColumnType[]>();
  const [columns, setColumns] = useState<KanbanColumnType[]>(mockColumns);
  const [editingTask, setEditingTask] = useState<KanbanTask | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedColumnId, setSelectedColumnId] = useState<number | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const loadBoard = useCallback(() => {
    execute(() => kanbanService.getBoard())
      .then((data) => {
        if (data && data.length > 0) {
          setColumns(data);
        }
      })
      .catch(() => {
        // Se houver erro, manter os mocks
        console.log("Usando mocks de dados");
      });
  }, [execute]);

  useEffect(() => {
    if (isMounted) {
      loadBoard();
    }
  }, [loadBoard, isMounted]);

  const handleAddTask = (columnId: number) => {
    setSelectedColumnId(columnId);
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const handleEditTask = (task: KanbanTask) => {
    setEditingTask(task);
    setSelectedColumnId(null);
    setIsModalOpen(true);
  };

  const handleSaveTask = async (
    taskData: Omit<Task, "id" | "createdAt" | "updatedAt">
  ) => {
    try {
      const apiTaskData = {
        title: taskData.title,
        description: taskData.description,
        position: 0,
        subjectId: undefined as number | undefined,
        projectId: taskData.projectId
          ? parseInt(taskData.projectId)
          : undefined,
      };

      if (editingTask) {
        await kanbanService.updateTask(editingTask.id, apiTaskData);
      } else if (selectedColumnId) {
        await kanbanService.createTask(selectedColumnId, apiTaskData);
      }
      loadBoard();
      setIsModalOpen(false);
      setEditingTask(null);
      setSelectedColumnId(null);
    } catch (error) {
      console.error("Erro ao salvar tarefa:", error);
      const errorMessage =
        error && typeof error === "object" && "message" in error
          ? (error as { message: string }).message
          : "Erro ao salvar tarefa. Verifique se a API está rodando.";
      alert(errorMessage);
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    try {
      await kanbanService.deleteTask(taskId);
      loadBoard();
    } catch (error) {
      console.error("Erro ao excluir tarefa:", error);
      alert("Erro ao excluir tarefa. Verifique se a API está rodando.");
    }
  };

  const handleMoveTask = async (taskId: number, targetColumnId: number) => {
    try {
      await kanbanService.moveTask(taskId, targetColumnId);
      loadBoard();
    } catch (error) {
      console.error("Erro ao mover tarefa:", error);
    }
  };

  if (!isMounted) {
    return null;
  }

  if (error && !columns.length) {
    const errorMessage =
      error?.message || "Erro desconhecido ao carregar quadro";
    return (
      <div className="text-center py-12">
        <p className="text-destructive mb-4">
          Erro ao carregar quadro: {errorMessage}
        </p>
        <Button onClick={loadBoard}>Tentar novamente</Button>
      </div>
    );
  }

  if (!columns || columns.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground mb-4">
          Nenhuma coluna encontrada. Crie uma coluna para começar.
        </p>
      </div>
    );
  }

  // Ordenar colunas por posição
  const sortedColumns = [...columns].sort((a, b) => a.position - b.position);

  return (
    <>
      <div className="flex-1 overflow-x-auto pb-4">
        <div className="flex gap-4 min-w-max h-full">
          {sortedColumns.map((column) => (
            <KanbanColumnApi
              key={column.id}
              id={column.id.toString()}
              title={column.name}
              tasks={column.tasks.map((task) => ({
                id: task.id.toString(),
                projectId: task.projectId?.toString() || "",
                title: task.title,
                description: task.description,
                status: "a_fazer" as const,
                priority: "media" as const,
                tags: [],
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              }))}
              onAddTask={() => handleAddTask(column.id)}
              onEditTask={(task) => {
                const apiTask = column.tasks.find(
                  (t) => t.id.toString() === task.id
                );
                if (apiTask) {
                  handleEditTask(apiTask);
                }
              }}
              onDeleteTask={(taskId) => handleDeleteTask(parseInt(taskId))}
              onMoveTask={handleMoveTask}
            />
          ))}
        </div>
      </div>

      {isMounted && (
        <TaskModal
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
          task={
            editingTask
              ? {
                  id: editingTask.id.toString(),
                  projectId: editingTask.projectId?.toString() || "",
                  title: editingTask.title,
                  description: editingTask.description,
                  status: "a_fazer" as const,
                  priority: "media" as const,
                  tags: [],
                  dueDate: undefined,
                  createdAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString(),
                }
              : null
          }
          defaultStatus={undefined}
          projects={[]}
          onSave={handleSaveTask}
        />
      )}
    </>
  );
}
