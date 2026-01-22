"use client"

import { useEffect, useState } from "react"
import { SubjectList } from "@/components/studies/subject-list"
import { StudyTimer } from "@/components/studies/study-timer"
import { studiesService } from "@/lib/api"
import type { Subject } from "@/lib/api/types"
import { AppShell } from "@/components/layout/app-shell"
import { Separator } from "@/components/ui/separator"

export default function StudiesPage() {
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const loadSubjects = async () => {
    try {
      setIsLoading(true)
      const data = await studiesService.getAllSubjects()
      setSubjects(data)
    } catch (error) {
      console.error("Erro ao carregar matérias:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadSubjects()
  }, [])

  return (
    <AppShell>
      <div className="space-y-8 h-[calc(100vh-4rem)] flex flex-col">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Área de Estudos</h1>
          <p className="text-muted-foreground">
            Gerencie suas matérias e foque no aprendizado.
          </p>
        </div>

        <Separator />

        <div className="grid gap-8 lg:grid-cols-2 flex-1 min-h-0">
          {/* Left Column: Timer & Active Session */}
          <div className="h-full">
             <StudyTimer subjects={subjects} onSessionLogged={loadSubjects} />
          </div>

          {/* Right Column: Subjects Management */}
          <div className="h-full bg-muted/10 rounded-xl p-4 border overflow-hidden">
             <SubjectList subjects={subjects} onRefresh={loadSubjects} />
          </div>
        </div>
      </div>
    </AppShell>
  )
}
