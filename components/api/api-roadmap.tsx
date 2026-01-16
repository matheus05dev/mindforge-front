"use client"

import { useState } from "react"
import { API_ENDPOINTS } from "@/lib/api/config"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  FolderKanban,
  GraduationCap,
  BookOpen,
  Kanban,
  FileText,
  Sparkles,
  Github,
  Database,
  Settings,
  ChevronRight,
  CheckCircle2,
  Circle,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface EndpointNode {
  id: string
  label: string
  endpoint: string
  method?: "GET" | "POST" | "PUT" | "DELETE"
  category: string
  icon?: React.ComponentType<{ className?: string }>
  children?: EndpointNode[]
  completed?: boolean
}

const endpointCategories: EndpointNode[] = [
  {
    id: "workspaces",
    label: "Workspaces",
    endpoint: "/api/workspaces",
    category: "Core",
    icon: Settings,
    children: [
      {
        id: "workspaces-list",
        label: "Listar Workspaces",
        endpoint: API_ENDPOINTS.workspaces,
        method: "GET",
        category: "Workspaces",
      },
      {
        id: "workspace-detail",
        label: "Workspace por ID",
        endpoint: API_ENDPOINTS.workspace(1).replace("/1", "/{id}"),
        method: "GET",
        category: "Workspaces",
      },
    ],
  },
  {
    id: "projects",
    label: "Projetos",
    endpoint: "/api/projects",
    category: "Core",
    icon: FolderKanban,
    children: [
      {
        id: "projects-list",
        label: "Listar Projetos",
        endpoint: API_ENDPOINTS.projects,
        method: "GET",
        category: "Projects",
      },
      {
        id: "project-detail",
        label: "Projeto por ID",
        endpoint: API_ENDPOINTS.project(1).replace("/1", "/{id}"),
        method: "GET",
        category: "Projects",
      },
      {
        id: "project-link",
        label: "Vincular GitHub",
        endpoint: API_ENDPOINTS.projectLink(1).replace("/1", "/{id}"),
        method: "POST",
        category: "Projects",
      },
      {
        id: "milestones",
        label: "Milestones",
        endpoint: "/api/projects/{projectId}/milestones",
        category: "Projects",
        icon: CheckCircle2,
        children: [
          {
            id: "milestones-list",
            label: "Listar Milestones",
            endpoint: API_ENDPOINTS.milestones(1).replace("/1", "/{projectId}"),
            method: "GET",
            category: "Milestones",
          },
          {
            id: "milestone-detail",
            label: "Milestone por ID",
            endpoint: API_ENDPOINTS.milestone(1).replace("/1", "/{id}"),
            method: "GET",
            category: "Milestones",
          },
        ],
      },
    ],
  },
  {
    id: "studies",
    label: "Estudos",
    endpoint: "/api/studies",
    category: "Core",
    icon: GraduationCap,
    children: [
      {
        id: "subjects",
        label: "Subjects",
        endpoint: "/api/studies/subjects",
        category: "Studies",
        icon: BookOpen,
        children: [
          {
            id: "subjects-list",
            label: "Listar Subjects",
            endpoint: API_ENDPOINTS.subjects,
            method: "GET",
            category: "Subjects",
          },
          {
            id: "subject-detail",
            label: "Subject por ID",
            endpoint: API_ENDPOINTS.subject(1).replace("/1", "/{id}"),
            method: "GET",
            category: "Subjects",
          },
        ],
      },
      {
        id: "sessions",
        label: "Sessions",
        endpoint: "/api/studies/subjects/{subjectId}/sessions",
        category: "Studies",
        children: [
          {
            id: "sessions-list",
            label: "Listar Sessions",
            endpoint: API_ENDPOINTS.sessions(1).replace("/1", "/{subjectId}"),
            method: "GET",
            category: "Sessions",
          },
          {
            id: "session-detail",
            label: "Session por ID",
            endpoint: API_ENDPOINTS.session(1).replace("/1", "/{id}"),
            method: "GET",
            category: "Sessions",
          },
        ],
      },
    ],
  },
  {
    id: "knowledge",
    label: "Base de Conhecimento",
    endpoint: "/api/knowledge",
    category: "Core",
    icon: BookOpen,
    children: [
      {
        id: "knowledge-list",
        label: "Listar Itens",
        endpoint: API_ENDPOINTS.knowledge,
        method: "GET",
        category: "Knowledge",
      },
      {
        id: "knowledge-detail",
        label: "Item por ID",
        endpoint: API_ENDPOINTS.knowledgeItem(1).replace("/1", "/{id}"),
        method: "GET",
        category: "Knowledge",
      },
      {
        id: "knowledge-search",
        label: "Buscar por Tag",
        endpoint: API_ENDPOINTS.knowledgeSearch("tag").replace("tag", "{tag}"),
        method: "GET",
        category: "Knowledge",
      },
    ],
  },
  {
    id: "kanban",
    label: "Kanban",
    endpoint: "/api/kanban",
    category: "Core",
    icon: Kanban,
    children: [
      {
        id: "kanban-board",
        label: "Board",
        endpoint: API_ENDPOINTS.kanbanBoard,
        method: "GET",
        category: "Kanban",
      },
      {
        id: "kanban-columns",
        label: "Columns",
        endpoint: API_ENDPOINTS.kanbanColumns,
        method: "GET",
        category: "Kanban",
      },
      {
        id: "kanban-tasks",
        label: "Tasks",
        endpoint: "/api/kanban/tasks",
        category: "Kanban",
        children: [
          {
            id: "tasks-list",
            label: "Tasks por Column",
            endpoint: API_ENDPOINTS.kanbanTasks(1).replace("/1", "/{columnId}"),
            method: "GET",
            category: "Tasks",
          },
          {
            id: "task-move",
            label: "Mover Task",
            endpoint: API_ENDPOINTS.kanbanMoveTask(1, 2).replace("/1", "/{taskId}").replace("/2", "/{columnId}"),
            method: "POST",
            category: "Tasks",
          },
        ],
      },
    ],
  },
  {
    id: "documents",
    label: "Documentos",
    endpoint: "/api/documents",
    category: "Core",
    icon: FileText,
    children: [
      {
        id: "documents-upload",
        label: "Upload",
        endpoint: API_ENDPOINTS.documentsUpload,
        method: "POST",
        category: "Documents",
      },
      {
        id: "documents-download",
        label: "Download",
        endpoint: API_ENDPOINTS.documentsDownload("file").replace("file", "{fileName}"),
        method: "GET",
        category: "Documents",
      },
    ],
  },
  {
    id: "ai",
    label: "Inteligência Artificial",
    endpoint: "/api/ai",
    category: "AI",
    icon: Sparkles,
    children: [
      {
        id: "ai-analyze-code",
        label: "Analisar Código",
        endpoint: API_ENDPOINTS.aiAnalyzeCode,
        method: "POST",
        category: "AI",
      },
      {
        id: "ai-analyze-github",
        label: "Analisar Arquivo GitHub",
        endpoint: API_ENDPOINTS.aiAnalyzeGithubFile,
        method: "POST",
        category: "AI",
      },
      {
        id: "ai-generic",
        label: "Análise Genérica",
        endpoint: API_ENDPOINTS.aiAnalyzeGeneric,
        method: "POST",
        category: "AI",
      },
      {
        id: "ai-review-portfolio",
        label: "Revisar Portfólio",
        endpoint: API_ENDPOINTS.aiReviewPortfolio,
        method: "POST",
        category: "AI",
      },
      {
        id: "ai-think-product",
        label: "Pensar Produto",
        endpoint: API_ENDPOINTS.aiThinkProduct,
        method: "POST",
        category: "AI",
      },
    ],
  },
  {
    id: "integrations",
    label: "Integrações",
    endpoint: "/api/integrations",
    category: "Integrations",
    icon: Github,
    children: [
      {
        id: "github-connect",
        label: "Conectar GitHub",
        endpoint: API_ENDPOINTS.githubConnect,
        method: "GET",
        category: "Integrations",
      },
      {
        id: "github-callback",
        label: "Callback GitHub",
        endpoint: API_ENDPOINTS.githubCallback,
        method: "GET",
        category: "Integrations",
      },
    ],
  },
]

const getMethodColor = (method?: string) => {
  switch (method) {
    case "GET":
      return "bg-blue-500/10 text-blue-500 border-blue-500/20"
    case "POST":
      return "bg-green-500/10 text-green-500 border-green-500/20"
    case "PUT":
      return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
    case "DELETE":
      return "bg-red-500/10 text-red-500 border-red-500/20"
    default:
      return "bg-muted text-muted-foreground"
  }
}

const getCategoryColor = (category: string) => {
  const colors: Record<string, string> = {
    Core: "bg-primary/10 text-primary border-primary/20",
    AI: "bg-purple-500/10 text-purple-500 border-purple-500/20",
    Integrations: "bg-orange-500/10 text-orange-500 border-orange-500/20",
  }
  return colors[category] || "bg-muted text-muted-foreground"
}

interface NodeProps {
  node: EndpointNode
  level: number
  isExpanded: boolean
  onToggle: () => void
  expandedNodes?: Set<string>
  toggleNode?: (id: string) => void
}

function EndpointNodeComponent({ node, level, isExpanded, onToggle, expandedNodes, toggleNode }: NodeProps) {
  const Icon = node.icon || Circle
  const hasChildren = node.children && node.children.length > 0

  return (
    <div className="relative">
      <div
        className={cn(
          "group relative flex items-start gap-3 rounded-lg border p-3 transition-all hover:shadow-md",
          level === 0 && "bg-card border-primary/20",
          level === 1 && "bg-card/50 border-border",
          level >= 2 && "bg-muted/30 border-border",
          node.completed && "opacity-60",
        )}
        style={{ marginLeft: `${level * 1.5}rem` }}
      >
        {/* Linha conectora */}
        {level > 0 && (
          <div
            className="absolute -left-6 top-6 h-0.5 w-6 bg-border"
            style={{ left: `${-level * 1.5 - 0.5}rem` }}
          />
        )}

        {/* Ícone */}
        <div
          className={cn(
            "flex-shrink-0 rounded-md p-2",
            level === 0 ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground",
          )}
        >
          <Icon className="h-4 w-4" />
        </div>

        {/* Conteúdo */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3
                  className={cn(
                    "font-medium truncate",
                    level === 0 && "text-base",
                    level === 1 && "text-sm",
                    level >= 2 && "text-xs",
                  )}
                >
                  {node.label}
                </h3>
                {node.method && (
                  <Badge variant="outline" className={cn("text-xs", getMethodColor(node.method))}>
                    {node.method}
                  </Badge>
                )}
                {level === 0 && (
                  <Badge variant="outline" className={cn("text-xs", getCategoryColor(node.category))}>
                    {node.category}
                  </Badge>
                )}
                {node.completed && (
                  <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-1 font-mono break-all">{node.endpoint}</p>
            </div>

            {hasChildren && (
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 flex-shrink-0"
                onClick={(e) => {
                  e.stopPropagation()
                  onToggle()
                }}
              >
                <ChevronRight
                  className={cn("h-4 w-4 transition-transform", isExpanded && "rotate-90")}
                />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Filhos */}
      {hasChildren && isExpanded && (
        <div className="mt-2 space-y-2">
          {node.children!.map((child) => (
            <EndpointNodeComponent
              key={child.id}
              node={child}
              level={level + 1}
              isExpanded={expandedNodes?.has(child.id) || false}
              onToggle={() => toggleNode?.(child.id)}
              expandedNodes={expandedNodes}
              toggleNode={toggleNode}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export function ApiRoadmap() {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(["workspaces", "projects", "studies"]))

  const toggleNode = (nodeId: string) => {
    const newExpanded = new Set(expandedNodes)
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId)
    } else {
      newExpanded.add(nodeId)
    }
    setExpandedNodes(newExpanded)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Roadmap da API</CardTitle>
            <CardDescription>Visualize todos os endpoints disponíveis na API</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const allIds = endpointCategories.flatMap((cat) => [
                  cat.id,
                  ...(cat.children?.map((c) => c.id) || []),
                  ...(cat.children?.flatMap((c) => c.children?.map((cc) => cc.id) || []) || []),
                ])
                setExpandedNodes(new Set(allIds))
              }}
            >
              Expandir Tudo
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setExpandedNodes(new Set())}
            >
              Colapsar Tudo
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {endpointCategories.map((category) => (
            <EndpointNodeComponent
              key={category.id}
              node={category}
              level={0}
              isExpanded={expandedNodes.has(category.id)}
              onToggle={() => toggleNode(category.id)}
              expandedNodes={expandedNodes}
              toggleNode={toggleNode}
            />
          ))}
        </div>

        {/* Legenda */}
        <div className="mt-6 pt-6 border-t border-border">
          <h4 className="text-sm font-medium mb-3">Legenda</h4>
          <div className="flex flex-wrap gap-4 text-xs">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className={getMethodColor("GET")}>
                GET
              </Badge>
              <span className="text-muted-foreground">Buscar dados</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className={getMethodColor("POST")}>
                POST
              </Badge>
              <span className="text-muted-foreground">Criar novo</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className={getMethodColor("PUT")}>
                PUT
              </Badge>
              <span className="text-muted-foreground">Atualizar</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className={getMethodColor("DELETE")}>
                DELETE
              </Badge>
              <span className="text-muted-foreground">Deletar</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

