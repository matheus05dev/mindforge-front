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
  milestoneCount?: number;
  documentCount?: number;
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
  workspaceId?: number
  studySessions?: StudySession[]
  sessionCount?: number;
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

export interface Note {
  id: number
  subjectId: number
  title: string
  content?: string
  tags?: string
  createdAt: string
  updatedAt: string
}

export interface QuizQuestion {
  id?: number
  question: string
  options: string
  correctAnswer: number
  explanation?: string
  orderIndex?: number
}

export interface Quiz {
  id: number
  subjectId: number
  title: string
  description?: string
  difficulty: "EASY" | "MEDIUM" | "HARD"
  questions?: QuizQuestion[]
  createdAt: string
  questionCount: number
}

export interface StudyResource {
  id: number
  subjectId: number
  title: string
  type: "VIDEO" | "ARTICLE" | "BOOK" | "COURSE" | "DOCUMENTATION" | "OTHER"
  url: string
  description?: string
  isAIGenerated: boolean
  createdAt: string
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

export type DecisionStatus = "PROPOSED" | "ACCEPTED" | "REJECTED" | "DEPRECATED" | "SUPERSEDED"

export interface DecisionRecord {
  id: number
  projectId: number
  title: string
  status: DecisionStatus
  context: string
  decision: string
  consequences: string
  tags: string[]
  author?: string
  createdAt: string
  updatedAt: string
}

export interface DecisionRequest {
  projectId: number
  title: string
  status: DecisionStatus
  context: string
  decision: string
  consequences: string
  tags: string[]
  author?: string
}

export interface Page<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  last: boolean;
  size: number;
  number: number;
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  numberOfElements: number;
  first: boolean;
  empty: boolean;
}

export interface Pageable {
  page?: number;
  size?: number;
  sort?: string[];
}
