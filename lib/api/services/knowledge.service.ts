import { apiClient } from "../client"
import { API_ENDPOINTS } from "../config"
import type { KnowledgeItem } from "../types"

export const knowledgeService = {
  getAll: async (): Promise<KnowledgeItem[]> => {
    return apiClient.get<KnowledgeItem[]>(API_ENDPOINTS.knowledge)
  },

  getById: async (id: number): Promise<KnowledgeItem> => {
    return apiClient.get<KnowledgeItem>(API_ENDPOINTS.knowledgeItem(id))
  },

  create: async (data: { title: string; content: string; tags: string[]; workspaceId?: string }): Promise<KnowledgeItem> => {
    return apiClient.post<KnowledgeItem>(API_ENDPOINTS.knowledge, data)
  },

  update: async (id: number, data: Partial<{ title: string; content: string; tags: string[]; workspaceId?: string }>): Promise<KnowledgeItem> => {
    return apiClient.put<KnowledgeItem>(API_ENDPOINTS.knowledgeItem(id), data)
  },

  delete: async (id: number): Promise<void> => {
    return apiClient.delete<void>(API_ENDPOINTS.knowledgeItem(id))
  },

  searchByTag: async (tag: string): Promise<KnowledgeItem[]> => {
    return apiClient.get<KnowledgeItem[]>(API_ENDPOINTS.knowledgeSearch(tag))
  },
}

