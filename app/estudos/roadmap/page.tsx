"use client"

import { AppShell } from "@/components/layout/app-shell"
import { StudyRoadmap } from "@/components/studies/study-roadmap"

export default function EstudosRoadmapPage() {
  return (
    <AppShell>
      <div className="space-y-6">
        {/* Cabeçalho */}
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Roadmap de Estudos</h1>
          <p className="text-muted-foreground">Acompanhe sua jornada de aprendizado e progressão de níveis</p>
        </div>

        {/* Roadmap */}
        <StudyRoadmap />
      </div>
    </AppShell>
  )
}

