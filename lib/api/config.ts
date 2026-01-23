export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export const API_ENDPOINTS = {
  // Workspaces
  workspaces: "/api/workspaces",
  workspace: (id: number) => `/api/workspaces/${id}`,

  // Projects
  projects: "/api/projects",
  project: (id: number) => `/api/projects/${id}`,
  projectLink: (id: number) => `/api/projects/${id}/link`,

  // Milestones
  milestones: (projectId: number) => `/api/projects/${projectId}/milestones`,
  milestone: (id: number) => `/api/projects/milestones/${id}`,

  // Studies - Subjects
  subjects: "/api/studies/subjects",
  subject: (id: number) => `/api/studies/subjects/${id}`,

  // Studies - Sessions
  sessions: (subjectId: number) =>
    `/api/studies/subjects/${subjectId}/sessions`,
  session: (id: number) => `/api/studies/sessions/${id}`,

  // Knowledge
  knowledge: "/api/knowledge",
  knowledgeItem: (id: number) => `/api/knowledge/${id}`,
  knowledgeSearch: (tag: string) => `/api/knowledge/search?tag=${tag}`,
  knowledgeAI: "/api/v1/knowledge/ai/assist",
  knowledgeChatSession: (id: number) => `/api/v1/knowledge/ai/${id}/session`,

  // Kanban
  kanbanBoard: "/api/kanban/board",
  kanbanColumns: "/api/kanban/columns",
  kanbanColumn: (id: number) => `/api/kanban/columns/${id}`,
  kanbanTasks: (columnId: number) => `/api/kanban/columns/${columnId}/tasks`,
  kanbanTask: (id: number) => `/api/kanban/tasks/${id}`,
  kanbanMoveTask: (taskId: number, columnId: number) =>
    `/api/kanban/tasks/${taskId}/move/${columnId}`,

  // Documents
  documents: "/api/documents",
  documentsUpload: "/api/documents/upload",
  documentsDownload: (fileName: string) =>
    `/api/documents/download/${fileName}`,

  // AI
  aiAnalyzeCode: "/api/ai/analyze/code",
  aiAnalyzeGithubFile: "/api/ai/analyze/github-file",
  aiAnalyzeGeneric: "/api/ai/analyze/generic",
  aiEditKnowledge: (itemId: number) => `/api/ai/edit/knowledge-item/${itemId}`,
  aiTranscribeDocument: (documentId: number, itemId: number) =>
    `/api/ai/transcribe/document/${documentId}/to-item/${itemId}`,
  aiReviewPortfolio: "/api/ai/review/portfolio",
  aiThinkProduct: "/api/ai/think/product",

  // New AI Chat endpoints
  aiChat: "/v1/ai/chat",
  aiChatSession: "/v1/ai/chat/session",
  aiChatSessionById: (id: number | string) => `/v1/ai/chat/${id}`,
  aiDocumentAnalyze: "/v1/ai/document/analyze",

  // Mind Map
  mindMap: "/api/mind-map",

  // Integrations
  githubConnect: "/api/integrations/github/connect",
  githubCallback: "/api/integrations/github/callback",
} as const;
