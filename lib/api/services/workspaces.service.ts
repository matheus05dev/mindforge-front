import { apiClient } from "../client"
import { API_ENDPOINTS } from "../config"
import type { Workspace } from "../types"

export const workspacesService = {
  getAll: async (): Promise<Workspace[]> => {
    return apiClient.get<Workspace[]>(API_ENDPOINTS.workspaces)
  },

  getById: async (id: number): Promise<Workspace> => {
    return apiClient.get<Workspace>(API_ENDPOINTS.workspace(id))
  },

  create: async (data: Omit<Workspace, "id">): Promise<Workspace> => {
    return apiClient.post<Workspace>(API_ENDPOINTS.workspaces, data)
  },

  update: async (id: number, data: Partial<Workspace>): Promise<Workspace> => {
    return apiClient.put<Workspace>(API_ENDPOINTS.workspace(id), data)
  },

  delete: async (id: number): Promise<void> => {
    return apiClient.delete<void>(API_ENDPOINTS.workspace(id))
  },
}

