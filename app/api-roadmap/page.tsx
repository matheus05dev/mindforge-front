"use client"

import { AppShell } from "@/components/layout/app-shell"
import { ApiRoadmap } from "@/components/api/api-roadmap"

export default function ApiRoadmapPage() {
  return (
    <AppShell>
      <div className="space-y-6">
        {/* Cabeçalho */}
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Roadmap da API</h1>
          <p className="text-muted-foreground">
            Explore todos os endpoints disponíveis na API do MindForge de forma visual e interativa
          </p>
        </div>

        {/* Roadmap */}
        <ApiRoadmap />
      </div>
    </AppShell>
  )
}

