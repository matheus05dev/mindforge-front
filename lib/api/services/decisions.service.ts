import { apiClient } from "../client"
import { DecisionRecord, DecisionRequest, DecisionResponse } from "../types"

export const decisionsService = {
  getByProject: async (projectId: number): Promise<DecisionRecord[]> => {
    const data = await apiClient.get<DecisionRecord[]>(
      `/api/projects/${projectId}/decisions`
    )
    return data
  },

  create: async (
    projectId: number,
    decision: DecisionRequest
  ): Promise<DecisionRecord> => {
    const data = await apiClient.post<DecisionRecord>(
      `/api/projects/${projectId}/decisions`,
      decision
    )
    return data
  },

  update: async (
    projectId: number,
    decisionId: number,
    decision: DecisionRequest
  ): Promise<DecisionRecord> => {
    const data = await apiClient.put<DecisionRecord>(
      `/api/projects/${projectId}/decisions/${decisionId}`,
      decision
    )
    return data
  },

  propose: async (
    projectId: number,
    context: string
  ): Promise<DecisionRequest> => {
    // Note: The backend returns a "Proposal" which matches the DecisionResponse structure essentially, 
    // but without ID/dates. Or it matches DecisionRequest. 
    // The backend `proposeDecisionFromContext` returns `DecisionResponse`.
    // Let's use DecisionResponse but cast/map if needed.
    const data = await apiClient.post<DecisionRecord>(
      `/api/projects/${projectId}/decisions/propose`,
      { context }
    )
    // We strip the ID and dates to make it a Request (draft)
    const { id, createdAt, updatedAt, ...draft } = data
    return draft
  },
}
