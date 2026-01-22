"use client"

import { AppShell } from "@/components/layout/app-shell"
import { SubjectList } from "@/components/studies/subject-list"
import { studiesService } from "@/lib/api"
import { useEffect, useState } from "react"
import type { Subject } from "@/lib/api/types"

export default function CoursesPage() {
  const [subjects, setSubjects] = useState<Subject[]>([])
  
  const loadSubjects = async () => {
    try {
      const data = await studiesService.getAllSubjects()
      setSubjects(data)
    } catch (error) {
       console.error(error)
    }
  }

  useEffect(() => { loadSubjects() }, [])

  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Meus Estudos</h1>
          <p className="text-muted-foreground">Gerencie todas as suas matérias e cursos.</p>
        </div>
        <div className="bg-muted/10 rounded-xl p-4 border h-[calc(100vh-12rem)] overflow-hidden">
             <SubjectList subjects={subjects} onRefresh={loadSubjects} />
        </div>
      </div>
    </AppShell>
  )
}
