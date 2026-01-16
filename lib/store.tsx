"use client"

import type React from "react"
import { createContext, useContext, useState, useCallback } from "react"
import type { Workspace, Project, Task, Study, KnowledgeItem } from "./types"

// Workspaces padrão
const defaultWorkspaces: Workspace[] = [
  { id: "geral", name: "Geral", type: "geral", icon: "🏠", description: "Visão geral de tudo" },
  { id: "estudos", name: "Estudos", type: "estudos", icon: "📚", description: "Gestão de estudos e aprendizado" },
  { id: "projetos", name: "Projetos", type: "projetos", icon: "🚀", description: "Gestão de projetos e tarefas" },
]

// Dados iniciais
const initialProjects: Project[] = [
  {
    id: "p1",
    workspaceId: "projetos",
    name: "API Backend",
    description: "Desenvolvimento da API principal com microserviços",
    status: "ativo",
    color: "#8b5cf6",
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-20T14:30:00Z",
  },
  {
    id: "p2",
    workspaceId: "projetos",
    name: "E-commerce",
    description: "Plataforma de e-commerce fullstack",
    status: "ativo",
    color: "#06b6d4",
    createdAt: "2024-01-10T08:00:00Z",
    updatedAt: "2024-01-19T16:00:00Z",
  },
  {
    id: "p3",
    workspaceId: "projetos",
    name: "Dashboard Analytics",
    description: "Dashboard de analytics em tempo real",
    status: "ativo",
    color: "#10b981",
    createdAt: "2024-01-05T12:00:00Z",
    updatedAt: "2024-01-18T11:00:00Z",
  },
]

const initialTasks: Task[] = [
  // API Backend
  {
    id: "t1",
    projectId: "p1",
    title: "Configurar autenticação JWT",
    description: "Implementar auth com refresh tokens",
    status: "concluido",
    priority: "alta",
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-18T14:00:00Z",
    tags: ["auth", "segurança"],
  },
  {
    id: "t2",
    projectId: "p1",
    title: "Design do schema do banco",
    description: "Criar schema PostgreSQL para usuários",
    status: "concluido",
    priority: "alta",
    createdAt: "2024-01-15T11:00:00Z",
    updatedAt: "2024-01-17T16:00:00Z",
    tags: ["database"],
  },
  {
    id: "t3",
    projectId: "p1",
    title: "CRUD de usuários",
    description: "Endpoints REST para gestão de usuários",
    status: "em_progresso",
    priority: "alta",
    createdAt: "2024-01-16T09:00:00Z",
    updatedAt: "2024-01-20T10:00:00Z",
    tags: ["api"],
  },
  {
    id: "t4",
    projectId: "p1",
    title: "Rate limiting",
    description: "Middleware de proteção da API",
    status: "em_progresso",
    priority: "media",
    createdAt: "2024-01-17T14:00:00Z",
    updatedAt: "2024-01-20T09:00:00Z",
    tags: ["segurança"],
  },
  {
    id: "t5",
    projectId: "p1",
    title: "Documentação da API",
    description: "Documentar endpoints com Swagger",
    status: "a_fazer",
    priority: "media",
    dueDate: "2024-01-25T00:00:00Z",
    createdAt: "2024-01-18T10:00:00Z",
    updatedAt: "2024-01-18T10:00:00Z",
    tags: ["docs"],
  },
  {
    id: "t6",
    projectId: "p1",
    title: "Pipeline CI/CD",
    description: "Configurar GitHub Actions",
    status: "a_fazer",
    priority: "baixa",
    createdAt: "2024-01-19T08:00:00Z",
    updatedAt: "2024-01-19T08:00:00Z",
    tags: ["devops"],
  },
  {
    id: "t7",
    projectId: "p1",
    title: "Implementar cache Redis",
    description: "Cache para dados frequentes",
    status: "backlog",
    priority: "media",
    createdAt: "2024-01-20T10:00:00Z",
    updatedAt: "2024-01-20T10:00:00Z",
    tags: ["performance"],
  },
  {
    id: "t8",
    projectId: "p1",
    title: "WebSocket para notificações",
    description: "Notificações em tempo real",
    status: "backlog",
    priority: "baixa",
    createdAt: "2024-01-20T11:00:00Z",
    updatedAt: "2024-01-20T11:00:00Z",
    tags: ["realtime"],
  },
  // E-commerce
  {
    id: "t9",
    projectId: "p2",
    title: "Página de produtos",
    description: "Grid de produtos com filtros",
    status: "em_progresso",
    priority: "alta",
    createdAt: "2024-01-10T08:00:00Z",
    updatedAt: "2024-01-19T16:00:00Z",
    tags: ["frontend"],
  },
  {
    id: "t10",
    projectId: "p2",
    title: "Carrinho de compras",
    description: "Lógica do carrinho com persistência",
    status: "a_fazer",
    priority: "alta",
    createdAt: "2024-01-12T09:00:00Z",
    updatedAt: "2024-01-12T09:00:00Z",
    tags: ["frontend", "state"],
  },
  {
    id: "t11",
    projectId: "p2",
    title: "Checkout e pagamentos",
    description: "Integração com Stripe",
    status: "backlog",
    priority: "alta",
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
    tags: ["pagamentos"],
  },
]

const initialStudies: Study[] = [
  {
    id: "s1",
    workspaceId: "estudos",
    title: "TypeScript Avançado",
    description: "Generics, tipos condicionais e utility types",
    category: "Programação",
    progress: 75,
    totalHours: 40,
    completedHours: 30,
    status: "em_andamento",
    createdAt: "2024-01-05T10:00:00Z",
    updatedAt: "2024-01-20T14:00:00Z",
  },
  {
    id: "s2",
    workspaceId: "estudos",
    title: "System Design",
    description: "Arquitetura escalável e sistemas distribuídos",
    category: "Arquitetura",
    progress: 45,
    totalHours: 60,
    completedHours: 27,
    status: "em_andamento",
    createdAt: "2024-01-10T08:00:00Z",
    updatedAt: "2024-01-19T16:00:00Z",
  },
  {
    id: "s3",
    workspaceId: "estudos",
    title: "Docker & Kubernetes",
    description: "Orquestração de containers e DevOps",
    category: "DevOps",
    progress: 30,
    totalHours: 35,
    completedHours: 10.5,
    status: "em_andamento",
    createdAt: "2024-01-12T12:00:00Z",
    updatedAt: "2024-01-18T11:00:00Z",
  },
  {
    id: "s4",
    workspaceId: "estudos",
    title: "React Performance",
    description: "Técnicas de otimização para React",
    category: "Frontend",
    progress: 90,
    totalHours: 20,
    completedHours: 18,
    status: "em_andamento",
    createdAt: "2024-01-01T09:00:00Z",
    updatedAt: "2024-01-20T10:00:00Z",
  },
  {
    id: "s5",
    workspaceId: "estudos",
    title: "PostgreSQL Avançado",
    description: "Queries complexas e otimização",
    category: "Database",
    progress: 60,
    totalHours: 25,
    completedHours: 15,
    status: "em_andamento",
    createdAt: "2024-01-08T14:00:00Z",
    updatedAt: "2024-01-17T09:00:00Z",
  },
]

const initialKnowledge: KnowledgeItem[] = [
  {
    id: "k1",
    workspaceId: "geral",
    title: "Docker Best Practices",
    content:
      "# Docker Best Practices\n\n## Segurança\n- Sempre use imagens oficiais\n- Execute containers como non-root\n- Escaneie imagens por vulnerabilidades",
    tags: ["docker", "devops"],
    category: "DevOps",
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-20T14:00:00Z",
  },
  {
    id: "k2",
    workspaceId: "geral",
    title: "TypeScript Generics",
    content: "# Generics em TypeScript\n\n```typescript\nfunction identity<T>(arg: T): T {\n  return arg;\n}\n```",
    tags: ["typescript", "programação"],
    category: "Programação",
    createdAt: "2024-01-10T08:00:00Z",
    updatedAt: "2024-01-19T16:00:00Z",
  },
]

interface StoreContextType {
  // Workspace
  workspaces: Workspace[]
  currentWorkspace: Workspace
  setCurrentWorkspace: (workspace: Workspace) => void

  // Projects
  projects: Project[]
  addProject: (project: Omit<Project, "id" | "createdAt" | "updatedAt">) => void
  updateProject: (id: string, updates: Partial<Project>) => void

  // Tasks
  tasks: Task[]
  addTask: (task: Omit<Task, "id" | "createdAt" | "updatedAt">) => void
  updateTask: (id: string, updates: Partial<Task>) => void
  deleteTask: (id: string) => void
  moveTask: (taskId: string, newStatus: Task["status"]) => void

  // Studies
  studies: Study[]
  addStudy: (study: Omit<Study, "id" | "createdAt" | "updatedAt">) => void
  updateStudy: (id: string, updates: Partial<Study>) => void

  // Knowledge
  knowledge: KnowledgeItem[]
  addKnowledge: (item: Omit<KnowledgeItem, "id" | "createdAt" | "updatedAt">) => void
  updateKnowledge: (id: string, updates: Partial<KnowledgeItem>) => void
}

const StoreContext = createContext<StoreContextType | null>(null)

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [workspaces] = useState<Workspace[]>(defaultWorkspaces)
  const [currentWorkspace, setCurrentWorkspace] = useState<Workspace>(defaultWorkspaces[0])
  const [projects, setProjects] = useState<Project[]>(initialProjects)
  const [tasks, setTasks] = useState<Task[]>(initialTasks)
  const [studies, setStudies] = useState<Study[]>(initialStudies)
  const [knowledge, setKnowledge] = useState<KnowledgeItem[]>(initialKnowledge)

  const addProject = useCallback((project: Omit<Project, "id" | "createdAt" | "updatedAt">) => {
    const now = new Date().toISOString()
    setProjects((prev) => [...prev, { ...project, id: `p${Date.now()}`, createdAt: now, updatedAt: now }])
  }, [])

  const updateProject = useCallback((id: string, updates: Partial<Project>) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p)),
    )
  }, [])

  const addTask = useCallback((task: Omit<Task, "id" | "createdAt" | "updatedAt">) => {
    const now = new Date().toISOString()
    setTasks((prev) => [...prev, { ...task, id: `t${Date.now()}`, createdAt: now, updatedAt: now }])
  }, [])

  const updateTask = useCallback((id: string, updates: Partial<Task>) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...updates, updatedAt: new Date().toISOString() } : t)))
  }, [])

  const deleteTask = useCallback((id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const moveTask = useCallback((taskId: string, newStatus: Task["status"]) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: newStatus, updatedAt: new Date().toISOString() } : t)),
    )
  }, [])

  const addStudy = useCallback((study: Omit<Study, "id" | "createdAt" | "updatedAt">) => {
    const now = new Date().toISOString()
    setStudies((prev) => [...prev, { ...study, id: `s${Date.now()}`, createdAt: now, updatedAt: now }])
  }, [])

  const updateStudy = useCallback((id: string, updates: Partial<Study>) => {
    setStudies((prev) => prev.map((s) => (s.id === id ? { ...s, ...updates, updatedAt: new Date().toISOString() } : s)))
  }, [])

  const addKnowledge = useCallback((item: Omit<KnowledgeItem, "id" | "createdAt" | "updatedAt">) => {
    const now = new Date().toISOString()
    setKnowledge((prev) => [...prev, { ...item, id: `k${Date.now()}`, createdAt: now, updatedAt: now }])
  }, [])

  const updateKnowledge = useCallback((id: string, updates: Partial<KnowledgeItem>) => {
    setKnowledge((prev) =>
      prev.map((k) => (k.id === id ? { ...k, ...updates, updatedAt: new Date().toISOString() } : k)),
    )
  }, [])

  return (
    <StoreContext.Provider
      value={{
        workspaces,
        currentWorkspace,
        setCurrentWorkspace,
        projects,
        addProject,
        updateProject,
        tasks,
        addTask,
        updateTask,
        deleteTask,
        moveTask,
        studies,
        addStudy,
        updateStudy,
        knowledge,
        addKnowledge,
        updateKnowledge,
      }}
    >
      {children}
    </StoreContext.Provider>
  )
}

export function useStore() {
  const context = useContext(StoreContext)
  if (!context) throw new Error("useStore must be used within StoreProvider")
  return context
}
