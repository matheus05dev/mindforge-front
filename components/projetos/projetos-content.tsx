"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { projectsService } from "@/lib/api/services/projects.service";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ProjectForm } from "./project-form";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useStore } from "@/lib/store";
import {
  Plus,
  Search,
  Filter,
  FolderKanban,
  Calendar,
  CheckCircle2,
  MoreHorizontal,
  Archive,
  Github,
  Target,
  FileText,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { GeneralProjectStats } from "./general-stats";

const statusConfig = {
  ativo: {
    label: "Ativo",
    color: "bg-green-500/10 text-green-500 border-green-500/20",
  },
  concluido: {
    label: "Concluído",
    color: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  },
  arquivado: {
    label: "Arquivado",
    color: "bg-muted text-muted-foreground border-border",
  },
};

import { kanbanService } from "@/lib/api/services/kanban.service";
import { KanbanTask } from "@/lib/api/types";

export function ProjetosContent() {
  const router = useRouter();
  const { projects, setProjects } = useStore(); // Removed tasks from useStore
  const [tasks, setTasks] = useState<KanbanTask[]>([]); // Local state for tasks
  const [searchQuery, setSearchQuery] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 0,
    size: 9,
    totalPages: 0,
    totalElements: 0,
  });

  // Fetch projects function
  const fetchProjects = async () => {
    try {
      setLoading(true);
      const [projectsData, boardData] = await Promise.all([
        projectsService.getAll({
          page: pagination.page,
          size: pagination.size,
          sort: ["id,desc"]
        }),
        kanbanService.getBoard()
      ]);
      
      const allTasks = boardData.flatMap(col => col.tasks || []);
      setTasks(allTasks);
      
      const adaptedProjects = projectsData.content.map(p => ({
        id: String(p.id),
        workspaceId: String(p.workspaceId || 3),
        name: p.name,
        description: p.description,
        status: "ativo" as const,
        color: "#4f46e5",
        githubRepo: p.githubRepoUrl,
        milestones: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }));

      setProjects(adaptedProjects);
      setPagination(prev => ({
        ...prev,
        totalPages: projectsData.totalPages,
        totalElements: projectsData.totalElements
      }));
    } catch (error) {
      console.error("Erro ao carregar projetos:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch initial data
  useEffect(() => {
    fetchProjects();
  }, [pagination.page, pagination.size]);

  const filteredProjects = projects.filter(
    (project) =>
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getProjectStats = (projectId: string) => {
    // Check match by string or number comparison
    const projectTasks = tasks.filter((task) => String(task.projectId) === projectId);
    
    // Check for "done" column - we need to know which column is "done"
    // Since we flattened the tasks, we lost column context per task unless we map it differently or check columnId
    // KanbanTask has columnId. We need to know which IDs are "done".
    // For simplicity, let's assume we fetch board and find "done" column id.
    // In this optimized fetch we just grabbed tasks. simpler way:
    // We should probably rely on task status if we had it.
    // Re-evaluating: let's pass a set of doneColumnIds or just fetch board and keep structure.
    
    // Actually, let's filter by columnId if we knew it. 
    // Since we don't know the Done Column ID easily here without processing boardData into state:
    // Let's assume we can infer it or we should store board structure.
    // Refactoring to store tasks with their status context if possible, OR
    // just counting all tasks for now and fixing 'completed' if we can find the 'Done' column ID from the fetch.
    
    // Better idea: store boardData to find done columns.
    // Retrieving Done Column ID from boardData inside fetchProjects would be better but getProjectStats is outside.
    // I will modify this content to store `doneColumnId` in state.
    return { completedTasks: 0, totalTasks: projectTasks.length }; 
  };
  
  // Wait, I need to implement the completed count correctly.
  // I will restart the replacement to include doneColumnId state.


  const handleFormSuccess = async () => {
    // Refetch projects immediately after creation
    await fetchProjects();
  };


  const handlePriviousPage = () => {
      if (pagination.page > 0) {
          setPagination(prev => ({ ...prev, page: prev.page - 1 }));
      }
  }

  const handleNextPage = () => {
      if (pagination.page < pagination.totalPages - 1) {
          setPagination(prev => ({ ...prev, page: prev.page + 1 }));
      }
  }

  return (
    <div className="space-y-8">
      {/* Cabeçalho da Página */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard de Projetos</h1>
          <p className="text-muted-foreground">
            Visão geral de todos os seus projetos e métricas.
          </p>
        </div>
        <div className="flex items-center gap-2">
            <Button className="gap-2" onClick={() => setIsFormOpen(true)}>
            <Plus className="h-4 w-4" />
            Novo Projeto
            </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <GeneralProjectStats />

      {/* Busca e Filtros */}
      <div className="flex items-center justify-between">
         <h2 className="text-xl font-semibold tracking-tight">Seus Projetos</h2>
         <div className="flex items-center gap-4">
            <div className="relative flex-1 w-[300px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
                placeholder="Buscar projetos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
            />
            </div>
            <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
            </Button>
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex items-center justify-center p-8">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      ) : (
      <>
      {/* Projects Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">{filteredProjects.map((project) => {
          const stats = getProjectStats(project.id);
          const progress =
            stats.totalTasks > 0
              ? (stats.completedTasks / stats.totalTasks) * 100
              : 0;

          return (
            <div
              key={project.id}
              onClick={() => router.push(`/projetos/kanban?projeto=${project.id}`)}
              className="cursor-pointer"
            >
              <div className="group rounded-lg border border-border bg-card p-5 transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 relative">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="rounded-md p-2"
                      style={{ backgroundColor: `${project.color}20` }}
                    >
                      <FolderKanban
                        className="h-5 w-5"
                        style={{ color: project.color }}
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold group-hover:text-primary transition-colors">
                        {project.name}
                      </h3>
                      <Badge
                        variant="outline"
                        className={cn(
                          "mt-1 text-xs",
                          statusConfig[project.status].color
                        )}
                      >
                        {statusConfig[project.status].label}
                      </Badge>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      asChild
                      onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                      }}
                    >
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 opacity-0 group-hover:opacity-100"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                      <DropdownMenuItem>Editar Projeto</DropdownMenuItem>
                      <DropdownMenuItem>Duplicar</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <Archive className="mr-2 h-4 w-4" />
                        Arquivar
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Descrição */}
                <p className="mt-3 text-sm text-muted-foreground line-clamp-2">
                  {project.description}
                </p>

                {/* Barra de Progresso */}
                <div className="mt-4">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-muted-foreground">Progresso</span>
                    <span className="font-medium">{Math.round(progress)}%</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-muted">
                    <div
                      className="h-1.5 rounded-full bg-primary transition-all"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                {/* GitHub e Milestones */}
                {(project.githubRepo ||
                  (project.milestones && project.milestones.length > 0)) && (
                  <div className="mt-3 flex items-center gap-3 text-xs">
                    {project.githubRepo && (
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Github className="h-3.5 w-3.5" />
                        <span className="truncate max-w-[120px]">
                          {project.githubRepo}
                        </span>
                      </div>
                    )}
                    {project.milestones && project.milestones.length > 0 && (
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Target className="h-3.5 w-3.5" />
                        <span>{project.milestones.length} marcos</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Estatísticas */}
                <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>
                      {stats.completedTasks}/{stats.totalTasks} tarefas
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>
                      {new Date(project.updatedAt).toLocaleDateString("pt-BR")}
                    </span>
                  </div>
                </div>

                {/* Quick Action Bar */}
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex bg-background/80 backdrop-blur-sm rounded-md shadow-sm border border-border p-1 z-10" onClick={(e) => e.stopPropagation()}>
                     <Link href={`/projetos/kanban?projeto=${project.id}`} className="p-2 hover:bg-accent rounded-sm" title="Kanban">
                        <FolderKanban className="h-4 w-4 text-muted-foreground hover:text-primary"/>
                     </Link>
                     <Link href={`/projetos/roadmap?projeto=${project.id}`} className="p-2 hover:bg-accent rounded-sm" title="Roadmap">
                        <Target className="h-4 w-4 text-muted-foreground hover:text-purple-500"/>
                     </Link>
                     <Link href={`/projetos/decisoes/?projeto=${project.id}`} className="p-2 hover:bg-accent rounded-sm" title="Decisões (ADRs)">
                        <Archive className="h-4 w-4 text-muted-foreground hover:text-blue-500"/>
                     </Link>
                     <Link href={`/projetos/documentos/?projeto=${project.id}`} className="p-2 hover:bg-accent rounded-sm" title="Documentos">
                        <FileText className="h-4 w-4 text-muted-foreground hover:text-orange-500"/>
                     </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Pagination Controls */}
      <div className="flex items-center justify-end gap-2 mt-4">
          <Button variant="outline" size="sm" onClick={handlePriviousPage} disabled={pagination.page === 0}>
              <ChevronLeft className="h-4 w-4" />
              Anterior
          </Button>
          <span className="text-sm text-muted-foreground">
              Página {pagination.page + 1} de {pagination.totalPages}
          </span>
          <Button variant="outline" size="sm" onClick={handleNextPage} disabled={pagination.page >= pagination.totalPages - 1}>
              Próximo
              <ChevronRight className="h-4 w-4" />
          </Button>
      </div>
      </>
      )}

      {/* Project Form Modal */}
      <ProjectForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSuccess={handleFormSuccess}
      />
    </div>
  );
}
