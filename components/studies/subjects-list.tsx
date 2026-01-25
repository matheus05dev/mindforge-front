"use client"

import { useState, useEffect, useCallback } from "react"
import { useApi } from "@/lib/hooks/use-api"
import { studiesService } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, TrendingUp, MoreHorizontal, Plus, GraduationCap } from "lucide-react"
import { useRouter } from "next/navigation"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SubjectForm } from "./subject-form"
import { AIAssistantButton } from "./ai-assistant-button"
import type { Subject } from "@/lib/api/types"

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

export function SubjectsList() {
  const router = useRouter()
  const { data: apiData, loading, error, execute } = useApi<any>()
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingSubject, setEditingSubject] = useState<Subject | undefined>()

  const subjects: Subject[] = apiData?.content || []

  const loadSubjects = useCallback(() => {
    execute(() => studiesService.getAllSubjects({ size: 1000 }, 1))
  }, [execute])

  useEffect(() => {
    loadSubjects()
  }, [loadSubjects])

  const handleCreate = () => {
    setEditingSubject(undefined)
    setIsFormOpen(true)
  }

  const handleEdit = (subject: Subject) => {
    setEditingSubject(subject)
    setIsFormOpen(true)
  }

  const handleDelete = async (subjectId: number) => {
    if (!confirm("Tem certeza que deseja excluir este estudo?")) return
    try {
      await studiesService.deleteSubject(subjectId)
      loadSubjects()
    } catch (error) {
      console.error("Erro ao excluir:", error)
      const errorMessage =
        error && typeof error === "object" && "message" in error
          ? (error as { message: string }).message
          : "Erro ao excluir estudo. Verifique se a API está rodando."
      alert(errorMessage)
    }
  }

  if (loading) {
    return <div className="text-center py-12 text-muted-foreground">Carregando estudos...</div>
  }

  if (error) {
    const errorMessage = error?.message || "Erro desconhecido ao carregar estudos"
    return (
      <div className="text-center py-12">
        <p className="text-destructive mb-4">Erro ao carregar estudos: {errorMessage}</p>
        <Button onClick={loadSubjects}>Tentar novamente</Button>
      </div>
    )
  }

  if (!subjects || subjects.length === 0) {
    return (
      <>
        <div className="flex flex-col items-center justify-center py-16 rounded-lg border border-border bg-card/50 border-dashed">
          <div className="bg-primary/10 p-4 rounded-full mb-4">
            <GraduationCap className="h-10 w-10 text-primary" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Sua jornada de aprendizado começa aqui!</h3>
          <p className="text-muted-foreground mb-6 text-center max-w-md px-4">
            Adicione matérias, cursos ou tópicos que você quer dominar. Acompanhe seu progresso e organize seus estudos de forma eficiente.
          </p>
          <Button className="gap-2 text-md px-6 h-11" onClick={handleCreate}>
            <Plus className="h-5 w-5" />
            Criar Primeiro Estudo
          </Button>
        </div>
        <SubjectForm open={isFormOpen} onOpenChange={setIsFormOpen} onSuccess={loadSubjects} />
      </>
    )
  }

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {subjects.map((subject) => {
        const totalMinutes = subject.studySessions?.reduce((acc, s) => acc + s.durationMinutes, 0) || 0
        const totalHours = Math.floor(totalMinutes / 60)

        return (
          <div
            key={subject.id}
            onClick={() => router.push(`/estudos/cursos/${subject.id}`)}
            className="group rounded-lg border border-border bg-card p-5 hover:border-primary/30 transition-all hover:shadow-lg cursor-pointer"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-semibold group-hover:text-primary transition-colors text-lg">{subject.name}</h3>
                {subject.description && (
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{subject.description}</p>
                )}
              </div>
              <div className="flex items-center gap-1">
                <AIAssistantButton subject={subject} />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleEdit(subject)}>Editar</DropdownMenuItem>
                    <DropdownMenuItem>Ver Sessões</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(subject.id)}>
                      Excluir
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Nível de Proficiência */}
            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="outline" className={`${proficiencyColors[subject.proficiencyLevel]} font-medium`}>
                  <TrendingUp className="h-3 w-3 mr-1" />
                  {proficiencyLabels[subject.proficiencyLevel]}
                </Badge>
              </div>
              
              {/* Barra de progresso visual baseada no nível */}
              <div className="mt-2">
                <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      subject.proficiencyLevel === "BEGINNER"
                        ? "bg-blue-500"
                        : subject.proficiencyLevel === "INTERMEDIATE"
                          ? "bg-yellow-500"
                          : "bg-purple-500"
                    }`}
                    style={{
                      width:
                        subject.proficiencyLevel === "BEGINNER"
                          ? "33%"
                          : subject.proficiencyLevel === "INTERMEDIATE"
                            ? "66%"
                            : "100%",
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Estatísticas de Sessões */}
            <div className="mt-4 pt-4 border-t border-border">
              {subject.studySessions && subject.studySessions.length > 0 ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span className="font-medium">{totalHours}h</span>
                      <span className="text-xs">estudadas</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <span className="text-xs">{subject.studySessions.length}</span>
                      <span className="text-xs">
                        {subject.studySessions.length === 1 ? "sessão" : "sessões"}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-xs text-muted-foreground">
                  Nenhuma sessão registrada ainda
                </div>
              )}
            </div>
          </div>
        )
      })}
      </div>
      <SubjectForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSuccess={loadSubjects}
        subject={editingSubject}
      />
    </>
  )
}

