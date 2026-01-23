"use client"

import { useState } from "react"
import { AppShell } from "@/components/layout/app-shell"
import { StudyRoadmap } from "@/components/studies/study-roadmap"
import { GeneratedRoadmapList } from "@/components/studies/generated-roadmap-list"
import { RoadmapGeneratorDialog } from "@/components/studies/roadmap-generator-dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function EstudosRoadmapPage() {
  const [refreshKey, setRefreshKey] = useState(0)

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Cabeçalho */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Roadmap de Estudos</h1>
            <p className="text-muted-foreground">Gerencie seus planos de estudo e visualize seu progresso.</p>
          </div>
          <RoadmapGeneratorDialog onRoadmapGenerated={() => setRefreshKey(k => k + 1)} />
        </div>

        <Tabs defaultValue="plans" className="space-y-4">
          <TabsList>
            <TabsTrigger value="plans">Planos de Estudo (IA)</TabsTrigger>
            <TabsTrigger value="timeline">Histórico de Sessões</TabsTrigger>
          </TabsList>
          
          <TabsContent value="plans" className="space-y-4">
             <GeneratedRoadmapList refreshTrigger={refreshKey} />
          </TabsContent>
          
          <TabsContent value="timeline">
            <StudyRoadmap />
          </TabsContent>
        </Tabs>
      </div>
    </AppShell>
  )
}

