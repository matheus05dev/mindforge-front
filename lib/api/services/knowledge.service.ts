import { apiClient } from "../client"
import { API_ENDPOINTS } from "../config"
import type { KnowledgeItem } from "../types"

export interface KnowledgeVersion {
  id: number
  knowledgeItemId: number
  title: string
  contentPreview: string
  fullContent?: string
  createdAt: string
  changeType: "MANUAL_EDIT" | "AGENT_PROPOSAL" | "ROLLBACK" | "INITIAL_VERSION"
  changeSummary: string
  proposalId?: string
}

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

  aiAssist: async (data: {
    command: "CONTINUE" | "SUMMARIZE" | "FIX_GRAMMAR" | "IMPROVE" | "CUSTOM" | "ASK_AGENT" | "AGENT_UPDATE"
    context?: string // Opcional para modo agente
    instruction?: string
    useContext?: boolean
    knowledgeId?: number
    agentMode?: boolean // Habilita modo agente
  }): Promise<{ 
    result?: string
    proposal?: any // KnowledgeAgentProposal
    success: boolean
    message: string 
  }> => {
    return apiClient.post(API_ENDPOINTS.knowledgeAI, data)
  },

  getChatSession: async (knowledgeId: number): Promise<{ id: number; messages: any[] }> => {
    return apiClient.get(API_ENDPOINTS.knowledgeChatSession(knowledgeId))
  },

  applyProposal: async (proposalId: string, approval: {
    approvedChangeIndices: number[]
    approveAll: boolean
    userComment?: string
    modifiedContent?: Record<number, string>
  }): Promise<KnowledgeItem> => {
    return apiClient.post(`/api/v1/knowledge/ai/proposals/${proposalId}/apply`, approval)
  },

  // Gerenciamento de Versões
  getVersions: async (knowledgeId: number): Promise<KnowledgeVersion[]> => {
    return apiClient.get<KnowledgeVersion[]>(`/api/knowledge/${knowledgeId}/versions`)
  },

  getVersion: async (knowledgeId: number, versionId: number): Promise<KnowledgeVersion> => {
    return apiClient.get<KnowledgeVersion>(`/api/knowledge/${knowledgeId}/versions/${versionId}`)
  },

  rollbackToVersion: async (knowledgeId: number, versionId: number): Promise<KnowledgeItem> => {
    return apiClient.post<KnowledgeItem>(`/api/knowledge/${knowledgeId}/versions/${versionId}/rollback`, {})
  }
}
