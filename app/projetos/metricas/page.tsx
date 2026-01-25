"use client"

import { useState, useEffect } from "react"
import { AppShell } from "@/components/layout/app-shell"
import { useStore } from "@/lib/store"
import { projectsService } from "@/lib/api/services/projects.service"
import { DecisionMetricsDashboard } from "@/components/decisions/decision-metrics"
import { Card, CardContent } from "@/components/ui/card"
import { BarChart3 } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function MetricasPage() {
  const { projects, setProjects } = useStore()
  const [selectedProjectId, setSelectedProjectId] = useState<string>("")

  // Carregar projetos da API
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await projectsService.getAll({ size: 1000 })
        const adaptedProjects = data.content.map(p => ({
          id: String(p.id),
          workspaceId: String(p.workspaceId || 3),
          name: p.name,
          description: p.description,
          status: "ativo" as const,
          color: "#4f46e5",
          githubRepo: p.githubRepo,
          milestones: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }))
        setProjects(adaptedProjects)
      } catch (error) {
        console.error("Erro ao carregar projetos:", error)
      }
    }

    if (projects.length === 0) {
      fetchProjects()
    }
  }, [projects.length, setProjects])

  // Auto-select first project if available
  useEffect(() => {
    if (projects.length > 0 && !selectedProjectId) {
      setSelectedProjectId(projects[0].id.toString())
    }
  }, [projects, selectedProjectId])

  return (
    <AppShell>
      <div className="flex flex-col h-[calc(100vh-8rem)]">
        {/* Cabeçalho */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Métricas do Projeto</h1>
            <p className="text-muted-foreground">
              Análise de qualidade, estabilidade e evolução das decisões arquiteturais.
            </p>
          </div>
          <Select
            value={selectedProjectId}
            onValueChange={setSelectedProjectId}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Selecionar projeto" />
            </SelectTrigger>
            <SelectContent>
              {projects.map((project) => (
                <SelectItem key={project.id} value={project.id.toString()}>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-primary" />
                    {project.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Conteúdo */}
        {!selectedProjectId ? (
            <Card className="border-dashed flex-1 flex flex-col items-center justify-center m-4">
                <CardContent className="flex flex-col items-center justify-center p-12 text-muted-foreground">
                    <BarChart3 className="h-16 w-16 mb-4 opacity-20" />
                    <h3 className="text-lg font-semibold mb-2">Nenhum Projeto Selecionado</h3>
                    <p className="text-center max-w-md">Selecione um projeto para visualizar suas métricas de arquitetura.</p>
                </CardContent>
            </Card>
        ) : (
            <div className="space-y-6">
                 <DecisionMetricsDashboard projectId={Number(selectedProjectId)} />
            </div>
        )}
      </div>
    </AppShell>
  )
}
