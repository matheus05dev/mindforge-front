"use client"

import type React from "react"
import { createContext, useContext, useState, useCallback, useEffect } from "react"
import type { Workspace, Project, Task, Study, KnowledgeItem } from "./types"

// Workspaces padrão
const defaultWorkspaces: Workspace[] = [
  { id: "1", name: "Geral", type: "geral", icon: "🏠", description: "Visão geral de tudo" },
  { id: "2", name: "Estudos", type: "estudos", icon: "📚", description: "Gestão de estudos e aprendizado" },
  { id: "3", name: "Projetos", type: "projetos", icon: "🚀", description: "Gestão de projetos e tarefas" },
]

// Dados iniciais
const initialProjects: Project[] = []

const initialTasks: Task[] = []

const initialStudies: Study[] = []

const initialKnowledge: KnowledgeItem[] = []

interface StoreContextType {
  // Workspace
  workspaces: Workspace[]
  currentWorkspace: Workspace
  setCurrentWorkspace: (workspace: Workspace) => void

  // Projects
  projects: Project[]
  setProjects: (projects: Project[]) => void
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
  setKnowledgeItems: (items: KnowledgeItem[]) => void
  addKnowledge: (item: Omit<KnowledgeItem, "id" | "createdAt" | "updatedAt">) => void
  updateKnowledge: (id: string, updates: Partial<KnowledgeItem>) => void

  // AI Notes
  isAINotesOpen: boolean
  toggleAINotes: () => void
  aiContext: string | null
  setAiContext: (context: string | null) => void

  // Agent Mode
  isAgentMode: boolean
  toggleAgentMode: () => void
}

const StoreContext = createContext<StoreContextType | null>(null)

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [workspaces] = useState<Workspace[]>(defaultWorkspaces)
  const [currentWorkspace, setCurrentWorkspace] = useState<Workspace>(defaultWorkspaces[0])
  const [projects, setProjects] = useState<Project[]>(initialProjects)
  const [tasks, setTasks] = useState<Task[]>(initialTasks)
  const [studies, setStudies] = useState<Study[]>(initialStudies)
  const [knowledge, setKnowledge] = useState<KnowledgeItem[]>(initialKnowledge)

  const setKnowledgeItems = useCallback((items: KnowledgeItem[]) => {
    setKnowledge(items)
  }, [])

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


  // AI Notes Sidebar
  const [isAINotesOpen, setIsAINotesOpen] = useState(false)
  const toggleAINotes = useCallback(() => setIsAINotesOpen((prev) => !prev), [])

  const [aiContext, setAiContext] = useState<string | null>(null)

  // Agent Mode
  const [isAgentMode, setIsAgentMode] = useState(false)
  const toggleAgentMode = useCallback(() => setIsAgentMode((prev) => {
    const newValue = !prev
    localStorage.setItem("mindforge_agent_mode", String(newValue))
    return newValue
  }), [])

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("mindforge_agent_mode")
    if (stored !== null) {
      setIsAgentMode(stored === "true")
    }
  }, [])

  // Persist and restore workspace
  useEffect(() => {
    // Detect workspace from URL on mount
    if (typeof window !== 'undefined') {
      const path = window.location.pathname
      let detectedWorkspace = currentWorkspace

      if (path.startsWith('/projetos') || path.startsWith('/kanban')) {
        detectedWorkspace = defaultWorkspaces.find(w => w.type === 'projetos') || defaultWorkspaces[0]
      } else if (path.startsWith('/estudos')) {
        detectedWorkspace = defaultWorkspaces.find(w => w.type === 'estudos') || defaultWorkspaces[0]
      } else if (path === '/' || path.startsWith('/dashboard')) {
        detectedWorkspace = defaultWorkspaces.find(w => w.type === 'geral') || defaultWorkspaces[0]
      } else {
        // Try to restore from localStorage
        const storedWorkspaceId = localStorage.getItem("mindforge_current_workspace")
        if (storedWorkspaceId) {
          const restoredWorkspace = defaultWorkspaces.find(w => w.id === storedWorkspaceId)
          if (restoredWorkspace) {
            detectedWorkspace = restoredWorkspace
          }
        }
      }

      if (detectedWorkspace.id !== currentWorkspace.id) {
        setCurrentWorkspace(detectedWorkspace)
      }
    }
  }, []) // Run only on mount

  // Save workspace to localStorage when it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem("mindforge_current_workspace", currentWorkspace.id)
    }
  }, [currentWorkspace])

  return (
    <StoreContext.Provider
      value={{
        workspaces,
        currentWorkspace,
        setCurrentWorkspace,
        projects,
        setProjects,
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
        setKnowledgeItems,
        addKnowledge,
        updateKnowledge,
        isAINotesOpen,
        toggleAINotes,
        aiContext,
        setAiContext,
        isAgentMode,
        toggleAgentMode,
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
