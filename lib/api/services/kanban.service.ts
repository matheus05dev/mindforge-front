import { apiClient } from "../client"
import { API_ENDPOINTS } from "../config"
import type { KanbanColumn, KanbanTask } from "../types"

export const kanbanService = {
  getBoard: async (): Promise<KanbanColumn[]> => {
    return apiClient.get<KanbanColumn[]>(API_ENDPOINTS.kanbanBoard)
  },

  // Columns
  createColumn: async (data: { name: string; position: number }): Promise<KanbanColumn> => {
    return apiClient.post<KanbanColumn>(API_ENDPOINTS.kanbanColumns, data)
  },

  updateColumn: async (id: number, data: { name?: string; position?: number }): Promise<KanbanColumn> => {
    return apiClient.put<KanbanColumn>(API_ENDPOINTS.kanbanColumn(id), data)
  },

  deleteColumn: async (id: number): Promise<void> => {
    return apiClient.delete<void>(API_ENDPOINTS.kanbanColumn(id))
  },

  // Tasks
  createTask: async (
    columnId: number,
    data: { title: string; description?: string; position: number; subjectId?: number; projectId?: number },
  ): Promise<KanbanTask> => {
    return apiClient.post<KanbanTask>(API_ENDPOINTS.kanbanTasks(columnId), data)
  },

  updateTask: async (
    id: number,
    data: { title?: string; description?: string; position?: number; subjectId?: number; projectId?: number },
  ): Promise<KanbanTask> => {
    return apiClient.put<KanbanTask>(API_ENDPOINTS.kanbanTask(id), data)
  },

  moveTask: async (taskId: number, targetColumnId: number): Promise<KanbanTask> => {
    return apiClient.put<KanbanTask>(API_ENDPOINTS.kanbanMoveTask(taskId, targetColumnId), {})
  },

  deleteTask: async (id: number): Promise<void> => {
    return apiClient.delete<void>(API_ENDPOINTS.kanbanTask(id))
  },
}

