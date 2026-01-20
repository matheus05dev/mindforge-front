"use client"

import { useEffect, useState } from "react"
import { projectsService } from "@/lib/api"
import type { Milestone, Project } from "@/lib/api/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Circle, Calendar, Plus, List, Network } from "lucide-react"
import { format, parseISO, isPast, isToday } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

export function ProjectRoadmap() {
  const [projects, setProjects] = useState<Project[]>([])
  const [allMilestones, setAllMilestones] = useState<{ project: Project; milestones: Milestone[] }[]>([])
  const [loading, setLoading] = useState(true)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [viewMode, setViewMode] = useState<"timeline" | "mindmap">("timeline")

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    
    const loadData = async () => {
      try {
        setLoading(true)
        let projectsData: Project[] = []
        
        // Carregar da API
        try {
          projectsData = await projectsService.getAll()
        } catch (error) {
          console.error("Erro ao carregar projetos:", error)
          projectsData = []
        }

        // Carregar milestones de todos os projetos
        const projectsWithMilestones: { project: Project; milestones: Milestone[] }[] = []
        for (const project of projectsData) {
          try {
            const milestones = await projectsService.getMilestones(project.id)
            projectsWithMilestones.push({
              project,
              milestones,
            })
          } catch (error) {
            console.error(`Erro ao carregar milestones do projeto ${project.id}:`, error)
            projectsWithMilestones.push({
              project,
              milestones: [],
            })
          }
        }

        setProjects(projectsData)
        setAllMilestones(projectsWithMilestones)
      } catch (error) {
        console.error("Erro ao carregar dados:", error)
        setProjects([])
        setAllMilestones([])
      } finally {
        setLoading(false)
      }
    }
    
    loadData()
  }, [mounted])

  const getMilestoneStatus = (milestone: Milestone) => {
    if (milestone.completed) return "completed"
    if (!milestone.dueDate) return "pending"
    const dueDate = parseISO(milestone.dueDate)
    if (isPast(dueDate) && !isToday(dueDate)) return "overdue"
    if (isToday(dueDate)) return "today"
    return "upcoming"
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500/10 text-green-500 border-green-500/20"
      case "overdue":
        return "bg-red-500/10 text-red-500 border-red-500/20"
      case "today":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
      default:
        return "bg-muted text-muted-foreground border-border"
    }
  }

  if (loading || !mounted) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-muted-foreground">Carregando roadmap...</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Roadmap de Projetos</CardTitle>
            <CardDescription>Visualize o progresso e os marcos de todos os projetos</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as "timeline" | "mindmap")}>
              <TabsList>
                <TabsTrigger value="timeline" className="gap-2">
                  <List className="h-4 w-4" />
                  Timeline
                </TabsTrigger>
                <TabsTrigger value="mindmap" className="gap-2">
                  <Network className="h-4 w-4" />
                  Mindmap
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {allMilestones.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Nenhum projeto encontrado.</p>
            <p className="text-sm mt-2">Crie projetos para visualizar o roadmap.</p>
          </div>
        ) : viewMode === "timeline" ? (
          <TimelineView milestones={allMilestones} getMilestoneStatus={getMilestoneStatus} getStatusColor={getStatusColor} />
        ) : (
          <MindmapView milestones={allMilestones} getMilestoneStatus={getMilestoneStatus} getStatusColor={getStatusColor} />
        )}
      </CardContent>
    </Card>
  )
}

function TimelineView({ 
  milestones, 
  getMilestoneStatus, 
  getStatusColor 
}: { 
  milestones: { project: Project; milestones: Milestone[] }[]
  getMilestoneStatus: (m: Milestone) => string
  getStatusColor: (s: string) => string
}) {
  return (
    <div className="space-y-8">
      {milestones.map(({ project, milestones: projectMilestones }) => (
        <div key={project.id} className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-border">
            <h3 className="font-semibold text-lg">{project.name}</h3>
            {project.description && (
              <span className="text-sm text-muted-foreground">- {project.description}</span>
            )}
          </div>
          {projectMilestones.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground text-sm">
              Nenhum marco definido para este projeto.
            </div>
          ) : (
            <div className="space-y-4">
              {projectMilestones
                .sort((a, b) => {
                  if (!a.dueDate) return 1
                  if (!b.dueDate) return -1
                  return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
                })
                .map((milestone, index) => {
                  const status = getMilestoneStatus(milestone)
                  const statusColor = getStatusColor(status)
                  
                  return (
                    <div key={milestone.id} className="relative">
                      {index < projectMilestones.length - 1 && (
                        <div className="absolute left-4 top-12 h-full w-0.5 bg-border" />
                      )}
                      
                      <div className="flex gap-4">
                        <div className={cn("flex-shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center bg-background", statusColor)}>
                          {milestone.completed ? (
                            <CheckCircle2 className="h-5 w-5 fill-current" />
                          ) : (
                            <Circle className="h-5 w-5" />
                          )}
                        </div>
                        
                        <div className="flex-1 pb-6">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <h4 className={cn("font-semibold", milestone.completed && "line-through text-muted-foreground")}>
                                {milestone.title}
                              </h4>
                              {milestone.description && (
                                <p className="text-sm text-muted-foreground mt-1">{milestone.description}</p>
                              )}
                            </div>
                            {milestone.dueDate && (
                              <div className="flex items-center gap-2 text-sm text-muted-foreground whitespace-nowrap">
                                <Calendar className="h-4 w-4" />
                                <span>{format(parseISO(milestone.dueDate), "d MMM yyyy", { locale: ptBR })}</span>
                              </div>
                            )}
                          </div>
                          
                          <div className="mt-2">
                            <span className={cn("text-xs px-2 py-1 rounded-full", statusColor)}>
                              {status === "completed" ? "Concluído" :
                               status === "overdue" ? "Atrasado" :
                               status === "today" ? "Hoje" :
                               "Pendente"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

function MindmapView({ 
  milestones, 
  getMilestoneStatus, 
  getStatusColor 
}: { 
  milestones: { project: Project; milestones: Milestone[] }[]
  getMilestoneStatus: (m: Milestone) => string
  getStatusColor: (s: string) => string
}) {
  return (
    <div className="relative min-h-[600px] p-8 overflow-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {milestones.map(({ project, milestones: projectMilestones }) => {
          const completedCount = projectMilestones.filter(m => m.completed).length
          const totalCount = projectMilestones.length
          
          return (
            <div key={project.id} className="relative">
              {/* Nó central - Projeto */}
              <div className="relative z-10 bg-primary/10 border-2 border-primary rounded-xl p-5 mb-4 shadow-lg">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-bold text-lg">{project.name}</h3>
                  <div className="flex-shrink-0 text-xs bg-primary/20 text-primary px-2 py-1 rounded-full">
                    {completedCount}/{totalCount}
                  </div>
                </div>
                {project.description && (
                  <p className="text-sm text-muted-foreground mb-3">{project.description}</p>
                )}
                {project.githubRepo && (
                  <div className="text-xs text-muted-foreground flex items-center gap-1">
                    <span>🔗</span>
                    <span className="truncate">{project.githubRepo}</span>
                  </div>
                )}
              </div>

              {/* Milestones ao redor - estilo mindmap */}
              {projectMilestones.length > 0 ? (
                <div className="relative z-10 space-y-2">
                  {projectMilestones
                    .sort((a, b) => {
                      if (!a.dueDate) return 1
                      if (!b.dueDate) return -1
                      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
                    })
                    .map((milestone) => {
                      const milestoneStatus = getMilestoneStatus(milestone)
                      const statusColor = getStatusColor(milestoneStatus)
                      
                      return (
                        <div
                          key={milestone.id}
                          className={cn(
                            "relative rounded-lg border-2 p-3 text-sm transition-all hover:scale-[1.02] hover:shadow-md cursor-pointer group",
                            "before:absolute before:-left-2 before:top-1/2 before:-translate-y-1/2 before:w-2 before:h-0.5 before:bg-border",
                            statusColor,
                            milestone.completed && "opacity-70"
                          )}
                        >
                          <div className="flex items-start gap-2">
                            <div className="flex-shrink-0 mt-0.5">
                              {milestone.completed ? (
                                <CheckCircle2 className="h-4 w-4" />
                              ) : (
                                <Circle className="h-4 w-4" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className={cn("font-semibold text-sm mb-1", milestone.completed && "line-through")}>
                                {milestone.title}
                              </h4>
                              {milestone.description && (
                                <p className="text-xs opacity-80 mb-2 line-clamp-2">{milestone.description}</p>
                              )}
                              {milestone.dueDate && (
                                <div className="flex items-center gap-1 text-xs opacity-75">
                                  <Calendar className="h-3 w-3" />
                                  <span>{format(parseISO(milestone.dueDate), "d MMM yyyy", { locale: ptBR })}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )
                    })}
                </div>
              ) : (
                <div className="text-center py-4 text-muted-foreground text-sm">
                  Nenhum marco definido
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
