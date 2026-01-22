// Tipos da API - correspondem aos DTOs do backend

export type WorkspaceType = "PROJECT" | "STUDY" | "GENERIC"

export interface Workspace {
  id: number
  name: string
  description?: string
  type: WorkspaceType
}

export interface Project {
  id: number
  name: string
  description?: string
  documents?: Document[]
  workspaceId?: number
  githubRepo?: string
  milestones?: Milestone[]
}

export interface Milestone {
  id: number
  projectId: number
  title: string
  description?: string
  dueDate?: string
  completed: boolean
}

export interface Subject {
  id: number
  name: string
  description?: string
  proficiencyLevel: "BEGINNER" | "INTERMEDIATE" | "ADVANCED"
  professionalLevel: "JUNIOR" | "PLENO" | "SENIOR"
  studySessions?: StudySession[]
}

export interface StudySession {
  id: number
  subjectId: number
  subjectName?: string
  startTime: string
  durationMinutes: number
  notes?: string
  documents?: Document[]
}

// Tipo para anotações independentes (se for criar endpoint)
export interface StudyNote {
  id: number
  subjectId?: number
  subjectName?: string
  title: string
  content: string
  tags: string[]
  createdAt: string
  sessionId?: number
}

export interface KnowledgeItem {
  id: number
  title: string
  content: string
  tags: string[]
  workspaceId?: number
  documents?: Document[]
}

export interface KanbanColumn {
  id: number
  name: string
  position: number
  tasks: KanbanTask[]
}

export interface KanbanTask {
  id: number
  title: string
  description?: string
  position: number
  columnId: number
  subjectId?: number
  subjectName?: string
  projectId?: number
  projectName?: string
  documents?: Document[]
}

export interface Document {
  id: number
  fileName: string
  originalFileName?: string
  fileType: string
  downloadUri: string
  uploadDate: string
}

export interface AIMessage {
  id: number
  role: "assistant" | "user"
  content: string
  createdAt: string
}

export type AIMode = "MENTOR" | "ANALYST" | "DEBUG_ASSISTANT" | "SOCRATIC_TUTOR"

export type AIProvider = "gemini" | "groq" | null
