"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
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
} from "lucide-react";
import { cn } from "@/lib/utils";

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

export function ProjetosContent() {
  const { projects, tasks } = useStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);

  const filteredProjects = projects.filter(
    (project) =>
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getProjectStats = (projectId: string) => {
    const projectTasks = tasks.filter((task) => task.projectId === projectId);
    const completedTasks = projectTasks.filter(
      (task) => task.status === "concluido"
    ).length;
    const totalTasks = projectTasks.length;
    return { completedTasks, totalTasks };
  };

  const handleFormSuccess = () => {
    // Recarregar dados se necessário
  };

  return (
    <div className="space-y-6">
      {/* Cabeçalho da Página */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Projetos</h1>
          <p className="text-muted-foreground">
            Gerencie e acompanhe todos os seus projetos.
          </p>
        </div>
        <Button className="gap-2" onClick={() => setIsFormOpen(true)}>
          <Plus className="h-4 w-4" />
          Novo Projeto
        </Button>
      </div>

      {/* Busca e Filtros */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
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

      {/* Grid de Projetos */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredProjects.map((project) => {
          const stats = getProjectStats(project.id);
          const progress =
            stats.totalTasks > 0
              ? (stats.completedTasks / stats.totalTasks) * 100
              : 0;

          return (
            <Link
              key={project.id}
              href={`/projetos/kanban?projeto=${project.id}`}
            >
              <div className="group rounded-lg border border-border bg-card p-5 transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
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
                      onClick={(e) => e.preventDefault()}
                    >
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 opacity-0 group-hover:opacity-100"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
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
              </div>
            </Link>
          );
        })}
      </div>

      {/* Project Form Modal */}
      <ProjectForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSuccess={handleFormSuccess}
      />
    </div>
  );
}
