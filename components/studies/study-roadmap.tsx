"use client"

import { useEffect, useState } from "react"
import { studiesService } from "@/lib/api"
import type { Subject, StudySession } from "@/lib/api/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { GraduationCap, Calendar, Clock, TrendingUp, List, Network } from "lucide-react"
import { format, parseISO } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

export function StudyRoadmap() {
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [sessions, setSessions] = useState<StudySession[]>([])
  const [loading, setLoading] = useState(true)
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
        let subjectsData: Subject[] = []
        let allSessions: StudySession[] = []

        // Carregar da API
        try {
          subjectsData = await studiesService.getAllSubjects()
          
          // Carregar sessions de todos os subjects
          for (const subject of subjectsData) {
            try {
              const subjectSessions = await studiesService.getSessionsBySubject(subject.id)
              const sessionsWithSubjectName = subjectSessions.map((session) => ({
                ...session,
                subjectName: subject.name,
              }))
              allSessions.push(...sessionsWithSubjectName)
            } catch (error) {
              console.error(`Erro ao carregar sessions do subject ${subject.id}:`, error)
            }
          }

          setSubjects(subjectsData)
        } catch (error) {
          console.error("Erro ao carregar dados:", error)
          setSubjects([])
          allSessions = []
        }

        // Ordenar sessions por data
        const sortedSessions = allSessions.sort((a, b) => 
          new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
        )
        
        setSessions(sortedSessions)
      } catch (error) {
        console.error("Erro ao carregar dados:", error)
        setSubjects([])
        setSessions([])
      } finally {
        setLoading(false)
      }
    }
    
    loadData()
  }, [mounted])

  const getProficiencyColor = (level: string) => {
    switch (level) {
      case "BEGINNER":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20"
      case "INTERMEDIATE":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
      case "ADVANCED":
        return "bg-green-500/10 text-green-500 border-green-500/20"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const getProfessionalColor = (level: string) => {
    switch (level) {
      case "JUNIOR":
        return "bg-purple-500/10 text-purple-500 border-purple-500/20"
      case "PLENO":
        return "bg-orange-500/10 text-orange-500 border-orange-500/20"
      case "SENIOR":
        return "bg-red-500/10 text-red-500 border-red-500/20"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  // Calcular estatísticas
  const totalHours = sessions.reduce((acc, session) => acc + (session.durationMinutes || 0), 0) / 60

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
    <div className="space-y-6">
      {/* Estatísticas */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-md bg-primary/10 p-2">
                <GraduationCap className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Assuntos</p>
                <p className="text-2xl font-semibold">{subjects.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-md bg-primary/10 p-2">
                <Clock className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Horas de Estudo</p>
                <p className="text-2xl font-semibold">{totalHours.toFixed(1)}h</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-md bg-primary/10 p-2">
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Sessões</p>
                <p className="text-2xl font-semibold">{sessions.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Roadmap */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Progressão de Estudos</CardTitle>
              <CardDescription>Visualize sua jornada de aprendizado</CardDescription>
            </div>
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
        </CardHeader>
        <CardContent>
          {subjects.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <GraduationCap className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Nenhum assunto cadastrado ainda.</p>
            </div>
          ) : viewMode === "timeline" ? (
            <TimelineView 
              subjects={subjects} 
              sessions={sessions}
              getProficiencyColor={getProficiencyColor}
              getProfessionalColor={getProfessionalColor}
            />
          ) : (
            <MindmapView 
              subjects={subjects} 
              sessions={sessions}
              getProficiencyColor={getProficiencyColor}
              getProfessionalColor={getProfessionalColor}
            />
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function TimelineView({ 
  subjects, 
  sessions,
  getProficiencyColor,
  getProfessionalColor
}: { 
  subjects: Subject[]
  sessions: StudySession[]
  getProficiencyColor: (level: string) => string
  getProfessionalColor: (level: string) => string
}) {
  return (
    <div className="space-y-4">
      {subjects.map((subject, index) => {
        const subjectSessions = sessions.filter(s => s.subjectId === subject.id)
        
        return (
          <div key={subject.id} className="relative">
            {/* Linha conectora */}
            {index < subjects.length - 1 && (
              <div className="absolute left-6 top-12 h-full w-0.5 bg-border" />
            )}
            
            <div className="flex gap-4">
              {/* Indicador */}
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center border-2 border-primary/20">
                <GraduationCap className="h-6 w-6 text-primary" />
              </div>
              
              {/* Conteúdo */}
              <div className="flex-1 pb-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{subject.name}</h3>
                    {subject.description && (
                      <p className="text-sm text-muted-foreground mt-1">{subject.description}</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="outline" className={getProficiencyColor(subject.proficiencyLevel)}>
                      {subject.proficiencyLevel}
                    </Badge>
                    <Badge variant="outline" className={getProfessionalColor(subject.professionalLevel)}>
                      {subject.professionalLevel}
                    </Badge>
                  </div>
                </div>
                
                {/* Sessões do subject */}
                {subjectSessions.length > 0 && (
                  <div className="mt-3 space-y-2">
                    <p className="text-xs text-muted-foreground">
                      {subjectSessions.length} sessão(ões) de estudo
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {subjectSessions.slice(0, 3).map((session) => (
                        <div
                          key={session.id}
                          className="flex items-center gap-1 text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded"
                        >
                          <Calendar className="h-3 w-3" />
                          <span>
                            {format(parseISO(session.startTime), "d MMM", { locale: ptBR })} -{" "}
                            {session.durationMinutes}min
                          </span>
                        </div>
                      ))}
                      {subjectSessions.length > 3 && (
                        <span className="text-xs text-muted-foreground">
                          +{subjectSessions.length - 3} mais
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

function MindmapView({ 
  subjects, 
  sessions,
  getProficiencyColor,
  getProfessionalColor
}: { 
  subjects: Subject[]
  sessions: StudySession[]
  getProficiencyColor: (level: string) => string
  getProfessionalColor: (level: string) => string
}) {
  return (
    <div className="relative min-h-[600px] p-8 overflow-auto">
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        {subjects.map((subject, index) => {
          const centerX = 50 + (index % 3) * 33.33
          const centerY = index < 3 ? 30 : 70
          const subjectSessions = sessions.filter(s => s.subjectId === subject.id)
          
          return (
            <g key={subject.id}>
              {/* Linhas conectando subject às sessions */}
              {subjectSessions.slice(0, 4).map((session, sessionIndex) => {
                const angle = (sessionIndex / Math.max(subjectSessions.length, 4)) * 2 * Math.PI
                const radius = 15
                const sessionX = centerX + Math.cos(angle) * radius
                const sessionY = centerY + Math.sin(angle) * radius
                
                return (
                  <line
                    key={session.id}
                    x1={`${centerX}%`}
                    y1={`${centerY}%`}
                    x2={`${sessionX}%`}
                    y2={`${sessionY}%`}
                    stroke="currentColor"
                    strokeWidth="1"
                    className="text-border opacity-20"
                    strokeDasharray="3 3"
                  />
                )
              })}
            </g>
          )
        })}
      </svg>

      <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subjects.map((subject) => {
          const subjectSessions = sessions.filter(s => s.subjectId === subject.id)
          const totalHours = subjectSessions.reduce((acc, s) => acc + (s.durationMinutes || 0), 0) / 60
          
          return (
            <div key={subject.id} className="relative">
              {/* Nó central - Subject */}
              <div className="relative z-10 bg-primary/10 border-2 border-primary rounded-lg p-4 mb-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-semibold text-lg">{subject.name}</h3>
                  <div className="flex gap-1 flex-shrink-0">
                    <Badge variant="outline" className={cn("text-xs", getProficiencyColor(subject.proficiencyLevel))}>
                      {subject.proficiencyLevel}
                    </Badge>
                    <Badge variant="outline" className={cn("text-xs", getProfessionalColor(subject.professionalLevel))}>
                      {subject.professionalLevel}
                    </Badge>
                  </div>
                </div>
                {subject.description && (
                  <p className="text-sm text-muted-foreground mb-2">{subject.description}</p>
                )}
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span>{subjectSessions.length} sessões</span>
                  <span>{totalHours.toFixed(1)}h</span>
                </div>
              </div>

              {/* Sessions ao redor */}
              {subjectSessions.length > 0 && (
                <div className="relative z-10 grid grid-cols-2 gap-2">
                  {subjectSessions.slice(0, 4).map((session) => (
                    <div
                      key={session.id}
                      className="rounded-lg border border-border bg-card/50 p-2 text-xs hover:bg-card transition-all"
                    >
                      <div className="flex items-center gap-1 mb-1">
                        <Calendar className="h-3 w-3 text-muted-foreground" />
                        <span className="font-medium">
                          {format(parseISO(session.startTime), "d MMM", { locale: ptBR })}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>{session.durationMinutes}min</span>
                      </div>
                      {session.notes && (
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{session.notes}</p>
                      )}
                    </div>
                  ))}
                  {subjectSessions.length > 4 && (
                    <div className="rounded-lg border border-border bg-muted/30 p-2 text-xs text-center text-muted-foreground flex items-center justify-center">
                      +{subjectSessions.length - 4} mais
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
