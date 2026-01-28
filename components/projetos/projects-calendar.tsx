"use client"

import { useState, useEffect, useMemo } from "react"
import { useApi } from "@/lib/hooks/use-api"
import { projectsService } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, Calendar, ChevronLeft, ChevronRight, Plus, CheckCircle2, Circle, AlertCircle } from "lucide-react"
import type { Milestone, Project, Page } from "@/lib/api/types"
import { format, parseISO, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, startOfWeek, endOfWeek } from "date-fns"
import { ptBR } from "date-fns/locale"
import { cn } from "@/lib/utils"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { CommitmentForm } from "./commitment-form"

interface CalendarEvent {
  id: number
  title: string
  description?: string
  date: string
  type: "milestone" | "meeting"
  projectId: number
  projectName: string
  completed?: boolean
}

export function ProjectsCalendar() {
  const { data: projects, loading, execute } = useApi<Page<Project>>()
  const [milestones, setMilestones] = useState<Milestone[]>([])
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)

  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 })
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 })
  const daysInMonth = eachDayOfInterval({ start: calendarStart, end: calendarEnd })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const projectsData = await execute(() => projectsService.getAll({ size: 1000 }))
      if (projectsData?.content) {
        // Carregar milestones de todos os projetos
        const allMilestones: Milestone[] = []
        for (const project of projectsData.content) {
          try {
            // Primeiro tenta usar milestones que vêm com o projeto
            if (project.milestones && project.milestones.length > 0) {
              allMilestones.push(...project.milestones)
            } else {
              // Se não houver, busca do endpoint específico
              try {
                const projectMilestones = await projectsService.getMilestones(project.id)
                allMilestones.push(...projectMilestones)
              } catch (err) {
                // Ignora erro se o endpoint não existir ou projeto não tiver milestones
                console.debug(`Projeto ${project.id} não tem milestones`)
              }
            }
          } catch (error) {
            console.error(`Erro ao carregar milestones do projeto ${project.id}:`, error)
          }
        }
        setMilestones(allMilestones)
      }
    } catch (error) {
      console.error("Erro ao carregar dados:", error)
    }
  }

  const events: CalendarEvent[] = useMemo(() => {
    const eventsList: CalendarEvent[] = []
    
    milestones.forEach((milestone) => {
      if (milestone.dueDate) {
        const project = projects?.content?.find((p) => p.id === milestone.projectId)
        eventsList.push({
          id: milestone.id,
          title: milestone.title,
          description: milestone.description,
          date: milestone.dueDate,
          type: "milestone",
          projectId: milestone.projectId,
          projectName: project?.name || "Projeto",
          completed: milestone.completed,
        })
      }
    })

    return eventsList
  }, [milestones, projects])

  const eventsByDate = useMemo(() => {
    const map = new Map<string, CalendarEvent[]>()
    events.forEach((event) => {
      const dateKey = format(parseISO(event.date), "yyyy-MM-dd")
      if (!map.has(dateKey)) {
        map.set(dateKey, [])
      }
      map.get(dateKey)!.push(event)
    })
    return map
  }, [events])

  const selectedDateEvents = selectedDate
    ? eventsByDate.get(format(selectedDate, "yyyy-MM-dd")) || []
    : []

  const handlePreviousMonth = () => {
    setCurrentDate(subMonths(currentDate, 1))
  }

  const handleNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1))
  }

  const handleDateClick = (date: Date) => {
    setSelectedDate(date)
  }

  const handleCreateCommitment = (project?: Project) => {
    setSelectedProject(project || null)
    setIsFormOpen(true)
  }

  const weekDays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"]

  if (loading) {
    return <div className="text-center py-12 text-muted-foreground">Carregando compromissos...</div>
  }

  return (
    <div className="space-y-6">
      {/* Header do Calendário */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">
            {format(currentDate, "MMMM 'de' yyyy", { locale: ptBR })}
          </h2>
          <p className="text-sm text-muted-foreground">
            {events.length} {events.length === 1 ? "compromisso" : "compromissos"} agendados
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={handlePreviousMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" onClick={() => setCurrentDate(new Date())}>
            Hoje
          </Button>
          <Button variant="outline" size="icon" onClick={handleNextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2" onClick={() => handleCreateCommitment()}>
                <Plus className="h-4 w-4" />
                Novo Compromisso
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Novo Compromisso</DialogTitle>
                <DialogDescription>
                  Crie uma entrega, marco ou reunião para um projeto.
                </DialogDescription>
              </DialogHeader>
              <CommitmentForm
                project={selectedProject || undefined}
                onSuccess={() => {
                  setIsFormOpen(false)
                  setSelectedProject(null)
                  loadData()
                }}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Grid do Calendário */}
      <div className="rounded-lg border border-border bg-card">
        {/* Dias da Semana */}
        <div className="grid grid-cols-7 border-b border-border">
          {weekDays.map((day) => (
            <div
              key={day}
              className="p-3 text-center text-sm font-medium text-muted-foreground border-r border-border last:border-r-0"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Dias do Mês */}
        <div className="grid grid-cols-7">
          {daysInMonth.map((day, index) => {
            const dateKey = format(day, "yyyy-MM-dd")
            const dayEvents = eventsByDate.get(dateKey) || []
            const isCurrentMonth = isSameMonth(day, currentDate)
            const isToday = isSameDay(day, new Date())
            const isSelected = selectedDate && isSameDay(day, selectedDate)
            const hasOverdue = dayEvents.some(
              (e) => !e.completed && new Date(e.date) < new Date()
            )

            return (
              <button
                key={index}
                onClick={() => handleDateClick(day)}
                className={cn(
                  "min-h-[100px] p-2 border-r border-b border-border last:border-r-0 hover:bg-accent/50 transition-colors text-left",
                  !isCurrentMonth && "text-muted-foreground/50 bg-muted/20",
                  isToday && "bg-primary/10 border-primary/30",
                  isSelected && "bg-primary/20 border-primary",
                  hasOverdue && !isCurrentMonth && "bg-red-500/10"
                )}
              >
                <div
                  className={cn(
                    "text-sm font-medium mb-1 flex items-center gap-1",
                    isToday && "text-primary font-semibold",
                    hasOverdue && isCurrentMonth && "text-red-500"
                  )}
                >
                  {format(day, "d")}
                  {hasOverdue && isCurrentMonth && (
                    <AlertCircle className="h-3 w-3 text-red-500" />
                  )}
                </div>
                <div className="space-y-1">
                  {dayEvents.slice(0, 3).map((event) => (
                    <div
                      key={event.id}
                      className={cn(
                        "text-xs rounded px-1.5 py-0.5 truncate border",
                        event.completed
                          ? "bg-muted text-muted-foreground border-border line-through"
                          : event.type === "milestone"
                            ? "bg-blue-500/20 text-blue-400 border-blue-500/30"
                            : "bg-purple-500/20 text-purple-400 border-purple-500/30"
                      )}
                      title={`${event.projectName} - ${event.title}`}
                    >
                      <div className="flex items-center gap-1">
                        {event.completed ? (
                          <CheckCircle2 className="h-2.5 w-2.5" />
                        ) : (
                          <Circle className="h-2.5 w-2.5" />
                        )}
                        <span className="truncate">{event.title}</span>
                      </div>
                    </div>
                  ))}
                  {dayEvents.length > 3 && (
                    <div className="text-xs text-muted-foreground">
                      +{dayEvents.length - 3} mais
                    </div>
                  )}
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Eventos do Dia Selecionado */}
      {selectedDate && (
        <div className="rounded-lg border border-border bg-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold">
                Compromissos de {format(selectedDate, "EEEE, d 'de' MMMM", { locale: ptBR })}
              </h3>
              <p className="text-sm text-muted-foreground">
                {selectedDateEvents.length}{" "}
                {selectedDateEvents.length === 1 ? "compromisso" : "compromissos"}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleCreateCommitment()}
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                Adicionar
              </Button>
              <Button variant="outline" size="sm" onClick={() => setSelectedDate(null)}>
                Fechar
              </Button>
            </div>
          </div>

          {selectedDateEvents.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>Nenhum compromisso agendado para este dia.</p>
              <Button
                variant="outline"
                size="sm"
                className="mt-4 gap-2"
                onClick={() => handleCreateCommitment()}
              >
                <Plus className="h-4 w-4" />
                Criar Compromisso
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {selectedDateEvents.map((event) => {
                const eventDate = parseISO(event.date)
                const isOverdue = !event.completed && eventDate < new Date()

                return (
                  <div
                    key={event.id}
                    className={cn(
                      "rounded-lg border p-4 transition-all",
                      event.completed
                        ? "border-border bg-muted/30"
                        : isOverdue
                          ? "border-red-500/50 bg-red-500/10"
                          : "border-border bg-card hover:border-primary/30"
                    )}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {event.type === "milestone" ? (
                            <CheckCircle2
                              className={cn(
                                "h-4 w-4",
                                event.completed ? "text-green-500" : "text-blue-500"
                              )}
                            />
                          ) : (
                            <Calendar className="h-4 w-4 text-purple-500" />
                          )}
                          <h4
                            className={cn(
                              "font-semibold",
                              event.completed && "line-through text-muted-foreground"
                            )}
                          >
                            {event.title}
                          </h4>
                          {event.completed && (
                            <Badge variant="outline" className="text-xs">
                              Concluído
                            </Badge>
                          )}
                          {isOverdue && !event.completed && (
                            <Badge variant="destructive" className="text-xs">
                              Atrasado
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-1">
                          Projeto: {event.projectName}
                        </p>
                        <p className="text-sm text-muted-foreground mb-2">
                          {format(eventDate, "HH:mm")}
                        </p>
                        {event.description && (
                          <p className="text-sm text-foreground">{event.description}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {!event.completed && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="gap-2"
                            onClick={async () => {
                              try {
                                // Toggle completion status
                                await projectsService.updateMilestone(event.id, {
                                  completed: true
                                })
                                loadData()
                              } catch (error) {
                                console.error("Erro ao marcar como concluído:", error)
                              }
                            }}
                          >
                            <CheckCircle2 className="h-4 w-4" />
                            Concluir
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

