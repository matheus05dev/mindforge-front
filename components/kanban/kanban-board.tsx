"use client";

import type React from "react";

import { useState } from "react";
import { useStore } from "@/lib/store";
import { KanbanColumn } from "./kanban-column";
import { TaskModal } from "./task-modal";
import type { Task } from "@/lib/types";

interface KanbanBoardProps {
  projectId?: string;
}

const columns: { id: Task["status"]; title: string; color: string }[] = [
  { id: "backlog", title: "Backlog", color: "bg-zinc-500" },
  { id: "a_fazer", title: "A Fazer", color: "bg-blue-500" },
  { id: "em_progresso", title: "Em Progresso", color: "bg-amber-500" },
  { id: "concluido", title: "Concluído", color: "bg-green-500" },
];

// Mock de tarefas para testes
const mockTasks: Task[] = [
  {
    id: "1",
    projectId: "1",
    title: "Implementar autenticação",
    description: "Adicionar sistema de login e autenticação",
    status: "backlog",
    priority: "alta",
    tags: ["backend", "segurança"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2",
    projectId: "1",
    title: "Criar API REST",
    description: "Desenvolver endpoints da API",
    status: "a_fazer",
    priority: "alta",
    tags: ["backend", "api"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "3",
    projectId: "1",
    title: "Validação de formulários",
    description: "Implementar validações",
    status: "a_fazer",
    priority: "media",
    tags: ["frontend"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "4",
    projectId: "1",
    title: "Testes unitários",
    description: "Escrever testes para os componentes",
    status: "em_progresso",
    priority: "media",
    tags: ["testes"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "5",
    projectId: "1",
    title: "Setup do projeto",
    description: "Configurar ambiente de desenvolvimento",
    status: "concluido",
    priority: "alta",
    tags: ["infra"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export function KanbanBoard({ projectId }: KanbanBoardProps) {
  const {
    tasks: storeTasks,
    projects,
    moveTask,
    addTask,
    updateTask,
    deleteTask,
  } = useStore();
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTaskStatus, setNewTaskStatus] = useState<Task["status"] | null>(
    null
  );

  // Usar mocks se não houver tarefas no store, caso contrário usar dados do store
  const allTasks = storeTasks && storeTasks.length > 0 ? storeTasks : mockTasks;

  // Filtrar tarefas por projeto se especificado
  const filteredTasks = projectId
    ? allTasks.filter((t) => t.projectId === projectId)
    : allTasks;

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData("taskId", taskId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, status: Task["status"]) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("taskId");
    if (taskId) {
      moveTask(taskId, status);
    }
  };

  const handleAddTask = (status: Task["status"]) => {
    setNewTaskStatus(status);
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setNewTaskStatus(null);
    setIsModalOpen(true);
  };

  const handleSaveTask = (
    taskData: Omit<Task, "id" | "createdAt" | "updatedAt">
  ) => {
    if (editingTask) {
      updateTask(editingTask.id, taskData);
    } else {
      addTask(taskData);
    }
    setIsModalOpen(false);
    setEditingTask(null);
    setNewTaskStatus(null);
  };

  const handleDeleteTask = (taskId: string) => {
    deleteTask(taskId);
  };

  const getProjectName = (projectId: string) => {
    return projects.find((p) => p.id === projectId)?.name || "Sem projeto";
  };

  const getProjectColor = (projectId: string) => {
    return projects.find((p) => p.id === projectId)?.color || "#71717a";
  };

  return (
    <>
      <div className="flex gap-4 flex-1 overflow-x-auto pb-4">
        {columns.map((column) => {
          const columnTasks = filteredTasks.filter(
            (t) => t.status === column.id
          );
          return (
            <KanbanColumn
              key={column.id}
              id={column.id}
              title={column.title}
              color={column.color}
              tasks={columnTasks}
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onAddTask={handleAddTask}
              onEditTask={handleEditTask}
              onDeleteTask={handleDeleteTask}
              getProjectName={getProjectName}
              getProjectColor={getProjectColor}
            />
          );
        })}
      </div>

      <TaskModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        task={editingTask}
        defaultStatus={newTaskStatus}
        projects={projects}
        onSave={handleSaveTask}
      />
    </>
  );
}
