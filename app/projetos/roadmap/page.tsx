"use client"

import { AppShell } from "@/components/layout/app-shell"
import { ProjectRoadmap } from "@/components/projetos/project-roadmap"

export default function ProjetosRoadmapPage() {
  return (
    <AppShell>
      <div className="space-y-6">
        {/* Cabeçalho */}
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Roadmap de Projetos</h1>
          <p className="text-muted-foreground">Visualize o progresso e os marcos de todos os seus projetos</p>
        </div>

        {/* Roadmap */}
        <ProjectRoadmap />
      </div>
    </AppShell>
  )
}

