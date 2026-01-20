import type React from "react";

export type WorkspaceType = "geral" | "estudos" | "projetos";

export interface Workspace {
  id: string;
  name: string;
  type: WorkspaceType;
  icon: string;
  description?: string;
}

export interface Project {
  id: string;
  workspaceId: string;
  name: string;
  description?: string;
  status: "ativo" | "arquivado" | "concluido";
  color: string;
  githubRepo?: string;
  milestones?: Milestone[];
  createdAt: string;
  updatedAt: string;
}

export interface Milestone {
  id: string;
  projectId: string;
  title: string;
  description?: string;
  dueDate?: string;
  status: "pendente" | "em_progresso" | "concluido";
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description?: string;
  status: "backlog" | "a_fazer" | "em_progresso" | "concluido";
  priority: "baixa" | "media" | "alta";
  dueDate?: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Study {
  id: string;
  workspaceId: string;
  title: string;
  description?: string;
  category: string;
  subject?: Subject;
  progress: number;
  totalHours: number;
  completedHours: number;
  status: "em_andamento" | "concluido" | "pausado";
  sessions?: StudySession[];
  createdAt: string;
  updatedAt: string;
}

export interface Subject {
  id: string;
  name: string;
  description?: string;
  proficiencyLevel:
    | "iniciante"
    | "basico"
    | "intermediario"
    | "avancado"
    | "especialista";
  createdAt: string;
  updatedAt: string;
}

export interface StudySession {
  id: string;
  studyId: string;
  duration: number; // em minutos
  notes?: string;
  createdAt: string;
}

export interface KnowledgeItem {
  id: string;
  workspaceId: string;
  title: string;
  content: string;
  tags: string[];
  category: string;
  createdAt: string;
  updatedAt: string;
}

export interface ChatMessage {
  id: string | number;
  role: "user" | "assistant";
  content: string;
  persona?: AIPersona;
  attachments?: {
    name: string;
    type: string;
    size: number;
  }[];
  createdAt: string;
}

export type AIPersona =
  | "mentor"
  | "analista"
  | "tutor_socratico"
  | "debug_assistant"
  | "recrutador_tecnico"
  | "planejador"
  | "geral";

export interface Document {
  id: string;
  workspaceId: string;
  name: string;
  type: "pdf" | "image" | "text" | "code" | "other";
  url: string;
  size: number;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ChatSession {
  id: number;
  title?: string;
  messages?: ChatMessage[];
  createdAt?: string;
  documentId?: string;
}

export type Conversation = ChatSession;

export interface NavigationItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
}

export const TASK_STATUS_LABELS: Record<Task["status"], string> = {
  backlog: "Backlog",
  a_fazer: "A Fazer",
  em_progresso: "Em Progresso",
  concluido: "Concluído",
};

export const PRIORITY_LABELS: Record<Task["priority"], string> = {
  baixa: "Baixa",
  media: "Média",
  alta: "Alta",
};

export const PRIORITY_COLORS: Record<Task["priority"], string> = {
  baixa: "bg-zinc-500/20 text-zinc-400",
  media: "bg-yellow-500/20 text-yellow-400",
  alta: "bg-red-500/20 text-red-400",
};
