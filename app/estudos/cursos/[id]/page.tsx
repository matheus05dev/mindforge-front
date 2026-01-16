"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { AppShell } from "@/components/layout/app-shell"
import { useApi } from "@/lib/hooks/use-api"
import { studiesService } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, TrendingUp, ArrowLeft, Calendar, BookOpen, FileText, Sparkles } from "lucide-react"
import { format, parseISO } from "date-fns"
import { ptBR } from "date-fns/locale"
import type { Subject } from "@/lib/api/types"
import { AIAssistantButton } from "@/components/studies/ai-assistant-button"

const proficiencyLabels: Record<string, string> = {
  BEGINNER: "Iniciante",
  INTERMEDIATE: "Intermediário",
  ADVANCED: "Avançado",
}

const proficiencyColors: Record<string, string> = {
  BEGINNER: "bg-blue-500/10 text-blue-500",
  INTERMEDIATE: "bg-yellow-500/10 text-yellow-500",
  ADVANCED: "bg-purple-500/10 text-purple-500",
}

// Mock data para visualização
const mockSubjects: Record<number, Subject> = {
  1: {
    id: 1,
    name: "Java",
    description: "Programação orientada a objetos com Java",
    proficiencyLevel: "INTERMEDIATE",
    professionalLevel: "PLENO",
    studySessions: [
      {
        id: 1,
        subjectId: 1,
        subjectName: "Java",
        startTime: "2024-01-15T10:00:00",
        durationMinutes: 120,
        notes: "Estudei sobre streams e lambdas. Aprendi como usar map, filter e reduce com streams.",
      },
      {
        id: 2,
        subjectId: 1,
        subjectName: "Java",
        startTime: "2024-01-16T14:00:00",
        durationMinutes: 90,
        notes: "Revisão de collections. Focando em HashMap, ArrayList e suas diferenças.",
      },
    ],
  },
  2: {
    id: 2,
    name: "TypeScript",
    description: "TypeScript avançado e tipos complexos",
    proficiencyLevel: "ADVANCED",
    professionalLevel: "SENIOR",
    studySessions: [
      {
        id: 3,
        subjectId: 2,
        subjectName: "TypeScript",
        startTime: "2024-01-17T09:00:00",
        durationMinutes: 150,
        notes: "Generics e utility types. Aprofundando em Conditional Types e Mapped Types.",
      },
    ],
  },
  3: {
    id: 3,
    name: "Docker",
    description: "Containerização e orquestração",
    proficiencyLevel: "BEGINNER",
    professionalLevel: "JUNIOR",
    studySessions: [],
  },
}

export default function StudyDetailPage() {
  const params = useParams()
  const router = useRouter()
  const studyId = Number(params.id)
  const { data: subject, loading, execute } = useApi<Subject>()
  const [useMock] = useState(true)

  useEffect(() => {
    if (!useMock) {
      execute(() => studiesService.getSubjectById(studyId))
    }
  }, [studyId, execute, useMock])

  const currentSubject = useMock ? mockSubjects[studyId] : subject

  if (loading && !useMock) {
    return (
      <AppShell>
        <div className="text-center py-12 text-muted-foreground">Carregando estudo...</div>
      </AppShell>
    )
  }

  if (!currentSubject) {
    return (
      <AppShell>
        <div className="text-center py-12">
          <p className="text-destructive mb-4">Estudo não encontrado.</p>
          <Button onClick={() => router.push("/estudos/cursos")}>Voltar para Estudos</Button>
        </div>
      </AppShell>
    )
  }

  const totalMinutes = currentSubject.studySessions?.reduce((acc, s) => acc + s.durationMinutes, 0) || 0
  const totalHours = Math.floor(totalMinutes / 60)
  const totalSessions = currentSubject.studySessions?.length || 0

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <Button variant="ghost" size="sm" onClick={() => router.push("/estudos/cursos")} className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </Button>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-semibold tracking-tight">{currentSubject.name}</h1>
              <AIAssistantButton subject={currentSubject} />
            </div>
            {currentSubject.description && (
              <p className="text-muted-foreground text-lg">{currentSubject.description}</p>
            )}
          </div>
        </div>

        {/* Badges e Níveis */}
        <div className="flex items-center gap-3 flex-wrap">
          <Badge variant="outline" className={`${proficiencyColors[currentSubject.proficiencyLevel]} font-medium text-sm px-3 py-1`}>
            <TrendingUp className="h-3 w-3 mr-1" />
            {proficiencyLabels[currentSubject.proficiencyLevel]}
          </Badge>
          <Badge variant="outline" className="font-medium text-sm px-3 py-1">
            {currentSubject.professionalLevel}
          </Badge>
        </div>

        {/* Barra de Progresso */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Nível de Proficiência</span>
            <span className="font-medium">{proficiencyLabels[currentSubject.proficiencyLevel]}</span>
          </div>
          <div className="h-3 w-full rounded-full bg-muted overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${
                currentSubject.proficiencyLevel === "BEGINNER"
                  ? "bg-blue-500"
                  : currentSubject.proficiencyLevel === "INTERMEDIATE"
                    ? "bg-yellow-500"
                    : "bg-purple-500"
              }`}
              style={{
                width:
                  currentSubject.proficiencyLevel === "BEGINNER"
                    ? "33%"
                    : currentSubject.proficiencyLevel === "INTERMEDIATE"
                      ? "66%"
                      : "100%",
              }}
            />
          </div>
        </div>

        {/* Estatísticas */}
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-lg border border-border bg-card p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <Clock className="h-4 w-4" />
              <span className="text-sm">Tempo Total</span>
            </div>
            <p className="text-2xl font-semibold">{totalHours}h</p>
            <p className="text-xs text-muted-foreground mt-1">{totalMinutes % 60} minutos</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <Calendar className="h-4 w-4" />
              <span className="text-sm">Sessões</span>
            </div>
            <p className="text-2xl font-semibold">{totalSessions}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {totalSessions === 1 ? "sessão registrada" : "sessões registradas"}
            </p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <BookOpen className="h-4 w-4" />
              <span className="text-sm">Média por Sessão</span>
            </div>
            <p className="text-2xl font-semibold">
              {totalSessions > 0 ? Math.floor(totalMinutes / totalSessions) : 0}
            </p>
            <p className="text-xs text-muted-foreground mt-1">minutos</p>
          </div>
        </div>

        {/* Sessões de Estudo */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Sessões de Estudo</h2>
            <Button
              onClick={() => router.push(`/estudos/agenda?subjectId=${currentSubject.id}`)}
              variant="outline"
              size="sm"
            >
              Ver no Calendário
            </Button>
          </div>

          {totalSessions === 0 ? (
            <div className="rounded-lg border border-border bg-card p-12 text-center">
              <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground mb-4">Nenhuma sessão registrada ainda.</p>
              <Button
                onClick={() => router.push("/estudos/agenda")}
                variant="outline"
                className="gap-2"
              >
                <Calendar className="h-4 w-4" />
                Criar Primeira Sessão
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {currentSubject.studySessions
                ?.sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime())
                .map((session) => {
                  const sessionDate = parseISO(session.startTime)
                  const durationHours = Math.floor(session.durationMinutes / 60)
                  const durationMinutes = session.durationMinutes % 60

                  return (
                    <div
                      key={session.id}
                      className="rounded-lg border border-border bg-card p-5 hover:border-primary/30 transition-all"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <Calendar className="h-4 w-4 text-primary" />
                            <span className="font-semibold">
                              {format(sessionDate, "EEEE, d 'de' MMMM 'de' yyyy", { locale: ptBR })}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {format(sessionDate, "HH:mm")} -{" "}
                            {format(
                              new Date(sessionDate.getTime() + session.durationMinutes * 60000),
                              "HH:mm"
                            )}
                          </p>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          <span>
                            {durationHours > 0 && `${durationHours}h `}
                            {durationMinutes > 0 && `${durationMinutes}min`}
                          </span>
                        </div>
                      </div>
                      {session.notes && (
                        <div className="mt-3 pt-3 border-t border-border">
                          <div className="flex items-center gap-2 mb-2">
                            <FileText className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-medium text-muted-foreground">Anotações</span>
                          </div>
                          <p className="text-sm text-foreground whitespace-pre-wrap">{session.notes}</p>
                        </div>
                      )}
                    </div>
                  )
                })}
            </div>
          )}
        </div>
      </div>
    </AppShell>
  )
}

