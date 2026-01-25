"use client"

import { useState, useEffect } from "react"
import { AppShell } from "@/components/layout/app-shell"
import { useStore } from "@/lib/store"
import { projectsService } from "@/lib/api/services/projects.service"
import { DecisionTimeline } from "@/components/decisions/decision-timeline"
import { DecisionWizard } from "@/components/decisions/decision-wizard"
import { DecisionMetricsDashboard } from "@/components/decisions/decision-metrics"
import { Button } from "@/components/ui/button"
import { Plus, Filter, BookOpen } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"

export default function DecisoesPage() {
  const { projects, setProjects } = useStore()
  const [selectedProjectId, setSelectedProjectId] = useState<string>("")
  const [isWizardOpen, setIsWizardOpen] = useState(false)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

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

  const handleDecisionCreated = () => {
    setRefreshTrigger(prev => prev + 1)
  }

  return (
    <AppShell>
      <div className="flex flex-col h-[calc(100vh-8rem)]">
        {/* Cabeçalho */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Decisões Arquiteturais (ADRs)</h1>
            <p className="text-muted-foreground">
              Histórico de decisões e memória técnica dos projetos
            </p>
          </div>
          <div className="flex items-center gap-3">
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
                       {/* Placeholder color since project might not have color prop in this context or it's optional */}
                      <div className="h-2 w-2 rounded-full bg-primary" />
                      {project.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
            <Button
              className="gap-2"
              onClick={() => setIsWizardOpen(true)}
              disabled={!selectedProjectId}
            >
              <Plus className="h-4 w-4" />
              Nova Decisão
            </Button>
          </div>
        </div>

        {/* Conteúdo */}
        <div className="flex-1 overflow-auto">
            {!selectedProjectId ? (
                <Card className="border-dashed">
                    <CardContent className="flex flex-col items-center justify-center p-12 text-muted-foreground">
                        <BookOpen className="h-12 w-12 mb-4 opacity-20" />
                        <h3 className="text-lg font-semibold mb-1">Selecione um Projeto</h3>
                        <p>Escolha um projeto acima para visualizar ou registrar suas decisões arquiteturais.</p>
                    </CardContent>
                </Card>
            ) : (
                <div className="max-w-5xl mx-auto space-y-6">
                    <DecisionMetricsDashboard projectId={parseInt(selectedProjectId)} />
                    <DecisionTimeline 
                        projectId={parseInt(selectedProjectId)} 
                        refreshTrigger={refreshTrigger}
                    />
                </div>
            )}
        </div>

        {/* Wizard Modal */}
        {selectedProjectId && (
            <DecisionWizard
                projectId={parseInt(selectedProjectId)}
                open={isWizardOpen}
                onOpenChange={setIsWizardOpen}
                onSuccess={handleDecisionCreated}
            />
        )}
      </div>
    </AppShell>
  )
}
