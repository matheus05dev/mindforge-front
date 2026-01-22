"use client"

import { useEffect, useState } from "react"
import { useParams, useSearchParams } from "next/navigation"
import { AppShell } from "@/components/layout/app-shell"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SubjectNotes } from "@/components/studies/subject-notes"
import { SubjectQuizzes } from "@/components/studies/subject-quizzes"
import { SubjectResources } from "@/components/studies/subject-resources"
import { StudyTimer } from "@/components/studies/study-timer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PlayCircle, PenLine, BookOpen } from "lucide-react"
import { studiesService } from "@/lib/api"
import type { Subject } from "@/lib/api/types"

export default function SubjectDetailsPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const subjectId = Number(params.id)
  const [subject, setSubject] = useState<Subject | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState(searchParams.get("tab") || "overview")

  // Sync tab with URL params when they change
  useEffect(() => {
    const tab = searchParams.get("tab")
    if (tab) {
      setActiveTab(tab)
    }
  }, [searchParams])

  useEffect(() => {
    async function loadSubject() {
      try {
        const data = await studiesService.getSubjectById(subjectId)
        setSubject(data)
      } catch (error) {
        console.error("Erro ao carregar matéria:", error)
      } finally {
        setLoading(false)
      }
    }
    loadSubject()
  }, [subjectId])

  if (loading) {
    return (
      <AppShell>
        <div className="flex items-center justify-center h-full">
          <p>Carregando...</p>
        </div>
      </AppShell>
    )
  }

  if (!subject) {
    return (
      <AppShell>
        <div className="flex items-center justify-center h-full">
          <p>Matéria não encontrada</p>
        </div>
      </AppShell>
    )
  }

  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">{subject.name}</h1>
          {subject.description && (
            <p className="text-muted-foreground mt-2">{subject.description}</p>
          )}
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList>
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="notes">Notas</TabsTrigger>
            <TabsTrigger value="quizzes">Quizzes</TabsTrigger>
            <TabsTrigger value="resources">Recursos</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Seção de Sessão de Estudo (Cronômetro) */}
            <StudyTimer subjectId={subjectId} subjectName={subject.name} />

            <div className="grid gap-6 md:grid-cols-3">
              <Card className="hover:border-primary/50 transition-colors cursor-pointer" onClick={() => setActiveTab("quizzes")}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PlayCircle className="h-5 w-5 text-primary" />
                    Quizzes
                  </CardTitle>
                  <CardDescription>Teste e reforce seu conhecimento</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="secondary" className="w-full">
                    Iniciar Questionário
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:border-primary/50 transition-colors cursor-pointer" onClick={() => setActiveTab("notes")}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PenLine className="h-5 w-5 text-primary" />
                    Anotações
                  </CardTitle>
                  <CardDescription>Revise suas notas de estudo</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="secondary" className="w-full">
                    Ver Anotações
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:border-primary/50 transition-colors cursor-pointer" onClick={() => setActiveTab("resources")}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-primary" />
                    Recursos
                  </CardTitle>
                  <CardDescription>Materiais de apoio e referências</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="secondary" className="w-full">
                    Acessar Recursos
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="notes">
            <SubjectNotes subjectId={subjectId} />
          </TabsContent>

          <TabsContent value="quizzes">
            <SubjectQuizzes subjectId={subjectId} />
          </TabsContent>

          <TabsContent value="resources">
            <SubjectResources subjectId={subjectId} />
          </TabsContent>
        </Tabs>
      </div>
    </AppShell>
  )
}
