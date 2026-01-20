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

  const allTasks = storeTasks || [];

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
