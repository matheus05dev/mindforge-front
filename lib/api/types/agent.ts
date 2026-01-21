// Agent Mode Types for Knowledge Base
export interface ContentChange {
  type: 'ADD' | 'REMOVE' | 'REPLACE'
  startLine: number
  endLine: number
  originalContent: string
  proposedContent: string
  reason: string
}

export interface KnowledgeAgentProposal {
  knowledgeId: number
  proposalId: string
  changes: ContentChange[]
  summary: string
  createdAt: string
  originalContent: string
}

export interface ApprovalRequest {
  approvedChangeIndices: number[]
  approveAll: boolean
  userComment?: string
  modifiedContent?: Record<number, string>
}
